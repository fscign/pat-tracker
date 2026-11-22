// Account and sharing layer (Firebase Auth + Firestore). Loaded as a module; the app works without it.
const V = '10.14.1';
const cfg = window.FIREBASE_CONFIG;
const bus = [];
window.Cloud = { ready: false, available: !!(cfg && cfg.apiKey), user: null, onChange: fn => bus.push(fn) };
const emit = () => bus.forEach(fn => { try { fn(window.Cloud.user); } catch (e) { console.error(e); } });

if (window.Cloud.available) try {
  const [{ initializeApp }, A, F] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`),
  ]);
  const app = initializeApp(cfg);
  const auth = A.getAuth(app);
  const db = F.getFirestore(app);
  const NICK = /^[a-z0-9_.-]{3,20}$/;

  const docId = (uid, lid) => uid + '_' + lid;
  const toDoc = (uid, nick, s) => ({
    owner: uid, ownerNick: nick, ownerName: (window.Cloud.user && window.Cloud.user.name) || '', lid: s.id, test: s.test, date: s.date, created: s.created || 0, updatedAt: s.updatedAt || 0,
    scores: s.scores || {}, notes: s.notes || {}, times: s.times || {}, finished: !!s.finished,
    sharedWith: s.sharedWith || [], sharedNames: s.sharedNames || {},
  });
  const fromDoc = d => { const x = d.data(); return { id: x.lid, test: x.test, date: x.date, created: x.created, updatedAt: x.updatedAt, scores: x.scores || {}, notes: x.notes || {}, times: x.times || {}, finished: !!x.finished, sharedWith: x.sharedWith || [], sharedNames: x.sharedNames || {} }; };

  async function loadProfile(u) {
    const snap = await F.getDoc(F.doc(db, 'users', u.uid));
    const p = snap.exists() ? snap.data() : {};
    return { uid: u.uid, email: u.email, nick: p.nick || '', name: p.name || '' };
  }

  Object.assign(window.Cloud, {
    async signUp(nick, email, password, name) {
      name = (name || '').trim().slice(0, 60);
      nick = nick.trim(); const low = nick.toLowerCase();
      if (!NICK.test(low)) throw { code: 'pat/bad-nick' };
      const u = (await A.createUserWithEmailAndPassword(auth, email.trim(), password)).user;
      try {
        // nickname first: the rules refuse it if someone already has it
        await F.setDoc(F.doc(db, 'nicks', low), { uid: u.uid, nick });
      } catch (e) { await A.deleteUser(u).catch(() => {}); throw { code: 'pat/nick-taken' }; }
      const b = F.writeBatch(db);
      b.set(F.doc(db, 'emails', u.email.toLowerCase()), { uid: u.uid, nick });
      b.set(F.doc(db, 'users', u.uid), { nick, name, email: u.email, created: Date.now() });
      await b.commit();
      window.Cloud.user = { uid: u.uid, email: u.email, nick, name }; emit();
    },
    signIn: (email, password) => A.signInWithEmailAndPassword(auth, email.trim(), password),
    reset: email => A.sendPasswordResetEmail(auth, email.trim()),
    signOut: () => A.signOut(auth),
    async pullOwn() {
      const u = window.Cloud.user; if (!u) return [];
      const q = F.query(F.collection(db, 'sessions'), F.where('owner', '==', u.uid));
      return (await F.getDocs(q)).docs.map(fromDoc);
    },
    async setName(name) {
      const u = window.Cloud.user; name = (name || '').trim().slice(0, 60);
      await F.setDoc(F.doc(db, 'users', u.uid), { name }, { merge: true });
      u.name = name;
    },
    async put(s) { const u = window.Cloud.user; await F.setDoc(F.doc(db, 'sessions', docId(u.uid, s.id)), toDoc(u.uid, u.nick, s)); },
    async del(lid) { const u = window.Cloud.user; await F.deleteDoc(F.doc(db, 'sessions', docId(u.uid, lid))); },
    async lookup(q) {
      q = q.trim().toLowerCase(); if (!q) return null;
      const ref = q.includes('@') ? F.doc(db, 'emails', q) : F.doc(db, 'nicks', q);
      const snap = await F.getDoc(ref);
      return snap.exists() ? { uid: snap.data().uid, nick: snap.data().nick } : null;
    },
    async listShared() {
      const u = window.Cloud.user; if (!u) return [];
      const q = F.query(F.collection(db, 'sessions'), F.where('sharedWith', 'array-contains', u.uid));
      return (await F.getDocs(q)).docs.map(d => { const x = d.data(); return { key: d.id, ownerNick: x.ownerNick || 'Someone', ownerName: x.ownerName || '', ...fromDoc(d) }; });
    },
  });

  A.onAuthStateChanged(auth, async u => {
    window.Cloud.ready = true;
    if (!u) { window.Cloud.user = null; emit(); return; }
    try { window.Cloud.user = await loadProfile(u); } catch (e) { window.Cloud.user = { uid: u.uid, email: u.email, nick: '' }; }
    emit();
  });
} catch (e) {
  // offline on first open, or Firebase unreachable: the app keeps working on this phone
  window.Cloud.available = false; window.Cloud.ready = true;
} else {
  window.Cloud.ready = true;
}
window.dispatchEvent(new Event('cloud-loaded'));
