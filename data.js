/* ---------- Table geometry helpers (book coordinates: x 0..8 foot to head, y 0..4) ---------- */
const F = 0.11, HB = 0.22, W1 = 0.33;
const AIM = { TL:[.07,.07], BL:[.07,3.93], TR:[7.93,.07], BR:[7.93,3.93], TS:[4,.03], BS:[4,3.97] };
const ob = (x,y,n) => ({ p:[x,y], n });
const cue = (x,y) => ({ p:[x,y], t:'cue' });
const gh = (x,y) => ({ p:[x,y], t:'ghost' });
const pot = (b,pk) => ({ pts:[b,AIM[pk]], k:'ob', arrow:1 });
const aimL = (c,b) => ({ pts:[c,b], k:'aim' });
const path = (pts) => ({ pts, k:'cue', arrow:1 });
const rect = (x1,y1,x2,y2,label,lp) => ({ poly:[[x1,y1],[x2,y1],[x2,y2],[x1,y2]], label, lp: lp || [(x1+x2)/2,(y1+y2)/2] });
function behind(b,pk,x){ const a=AIM[pk]; const t=(x-a[0])/(b[0]-a[0]); return [x, a[1]+t*(b[1]-a[1])]; }
function straightSet(objs,pk,xLine,nums){
  const balls=[], lines=[];
  objs.forEach((o,i)=>{ const c=behind(o,pk,xLine); balls.push(ob(o[0],o[1],nums?nums[i]:undefined)); balls.push(gh(c[0],c[1])); lines.push(aimL(c,o)); lines.push(pot(o,pk)); });
  return { balls, lines };
}
const col = (x,y0,step,n) => Array.from({length:n},(_,i)=>[x, +(y0+i*step).toFixed(3)]);

const DIAGRAMS = {
  /* ---------- PAT 1 ---------- */
  p1_straight(){
    const balls=[], lines=[];
    [1,2,3].forEach(y=>{ balls.push(ob(2,y-.27), ob(2,y+.27), cue(6,y)); lines.push(path([[6,y],[0,y-.03],[7.3,y+.03]])); });
    return { balls, lines, zones:[rect(6,0,8,4,'Stop here',[7.55,1.5])] };
  },
  p1_follow(){
    const a=straightSet([[3,.2],[3,.46],[3,.72]],'TL',5,[1,2,3]), b=straightSet([[3,3.28],[3,3.54],[3,3.8]],'BL',5,[4,5,6]);
    return { balls:[...a.balls,...b.balls], lines:[...a.lines,...b.lines], zones:[rect(0,0,1,1,'Zone',[.5,.6]), rect(0,3,1,4,'Zone',[.5,3.4])] };
  },
  p1_draw(){
    const a=straightSet([[3,.2],[3,.46],[3,.72]],'TL',5,[1,2,3]), b=straightSet([[3,3.28],[3,3.54],[3,3.8]],'BL',5,[4,5,6]);
    return { balls:[...a.balls,...b.balls], lines:[...a.lines,...b.lines, path([[3,.72],[8,1.4],[7.4,1.5]]), path([[3,3.28],[8,2.6],[7.4,2.5]])], zones:[rect(6,0,8,4,'Position zone',[7.2,2])] };
  },
  p1_small1(){
    const b=[[4.5,.61],[4.28,.8],[4,.89],[3.72,.8],[3.5,.61]];
    return { balls:b.map((p,i)=>ob(p[0],p[1],i+1)).concat([cue(4.95,.98), gh(4.55,1.25)]),
      lines:[aimL([4.95,.98],[4.58,.66]), pot([4.5,.61],'TS'), path([[4.52,.72],[4.55,1.15]])] };
  },
  p1_small2(){
    const xs=[.11,.33,.55,.77,.99];
    return { balls:xs.map((x,i)=>ob(x,2,i+1)).concat([cue(.18,2.62), gh(.55,2.62)]),
      lines:[aimL([.18,2.62],[.13,2.15]), pot([.11,2],'TL'), path([[.18,2.5],[.5,2.58]])] };
  },
  p1_large1(){
    return { balls:[ob(6,2,1),ob(6,1.11,3),ob(6,HB,5), ob(2,2,2),ob(2,2.89,4),ob(2,4-HB,6), cue(5.7,2.6), gh(2.27,1.3)],
      lines:[aimL([5.7,2.6],[5.93,2.15]), pot([6,2],'TR'), path([[5.95,2.05],[2.35,1.32]]), pot([2,2],'BL')] };
  },
  p1_large2(){
    return { balls:[ob(6,2,1),ob(6.89,2,3),ob(8-HB,2,5), ob(2,2,2),ob(1.11,2,4),ob(HB,2,6), cue(5.8,2.6), gh(2.35,1.3)],
      lines:[aimL([5.8,2.6],[5.95,2.15]), pot([6,2],'TR'), path([[5.95,2.05],[2.42,1.32]]), pot([2,2],'BL'), pot([1.11,2],'TL')] };
  },
  p1_frozen1(){ return { balls:[ob(1,F),ob(2,F),ob(F,1),ob(F,3),ob(1,4-F),ob(2,4-F), cue(2.3,.8)] }; },
  p1_frozen2(){ return { balls:[ob(1,F),ob(3,F),ob(5,F),ob(7,F),ob(F,2),ob(8-F,2),ob(1,4-F),ob(3,4-F),ob(5,4-F),ob(7,4-F), cue(3.9,1.1)] }; },
  p1_endless(){ return { balls:[ob(2,2,7),ob(4,2,9),ob(6,2,8), cue(2.2,2.65)] }; },
  p1_9ball(){ return { balls:[ob(5.9,W1,3),ob(.29,1,7),ob(7.7,1,2),ob(2,2,5),ob(4,2,4),cue(5,2),ob(.29,3,8),ob(3,3,6),ob(6.85,3,1),ob(7.7,3,9)] }; },
  p1_std1(){ return { balls:[ob(4,2,1), cue(7,.5), gh(7,3.5)], lines:[aimL([7,.5],[4.18,1.91]), pot([4,2],'BL'), {pts:[[7,3.5],[4.18,2.09]],k:'thin'}, {pts:[[4,2],AIM.TL],k:'obg',arrow:1}] }; },
  p1_std2(){ const sp=y=>({p:[6,y],t:'ghost',small:1});
    return { balls:[ob(2,2,1), cue(6,.77), sp(.11),sp(.33),sp(.55), gh(6,3.23), sp(3.45),sp(3.67),sp(3.89)],
      lines:[aimL([6,.77],[2.2,1.95]), pot([2,2],'BL'), {pts:[[6,3.23],[2.2,2.05]],k:'thin'}, {pts:[[2,2],AIM.TL],k:'obg',arrow:1}],
      notes:[{p:[6.45,.44],text:'3 balls',small:1},{p:[6.45,3.56],text:'3 balls',small:1}] }; },
  p1_std3(){ return { balls:[ob(3,4-W1,1), cue(7,1), gh(7,3), gh(3,W1)], lines:[aimL([7,1],[3.18,3.6]), pot([3,4-W1],'BL'), {pts:[[7,3],[3.18,.4]],k:'thin'}, {pts:[[3,W1],AIM.TL],k:'obg',arrow:1}] }; },
  p1_std4(){ return { balls:[ob(4,1.1,1), cue(7,.4), gh(7,3.6), gh(4,2.9)], lines:[aimL([7,.4],[4.2,1.04]), pot([4,1.1],'TL'), {pts:[[7,3.6],[4.2,2.96]],k:'thin'}, {pts:[[4,2.9],AIM.BL],k:'obg',arrow:1}] }; },
  p1_std5(){ return { balls:[ob(.45,3,1), cue(6.1,.55), gh(6.1,3.45), gh(.45,1)], lines:[aimL([6.1,.55],[.65,2.94]), {pts:[[.45,3],[.1,3.9]],k:'ob',arrow:1}, {pts:[[6.1,3.45],[.65,1.06]],k:'thin'}, {pts:[[.45,1],[.1,.1]],k:'obg',arrow:1}] }; },
  pat2_speed(){
    const ys=[.5,1.5,2.5,3.5];
    return { balls: ys.map((y,i)=>ob(6,y,i+1)),
      zones:[rect(0,0,2,4,'Speed 1, 3',[1,2]), rect(6,0,8,4,'Speed 2, 4',[7.5,2])],
      lines:[ path([[6,.5],[.5,.5]]), path([[6,1.5],[0,1.46],[7.5,1.38]]), path([[6,2.5],[0,2.46],[8,2.4],[.5,2.33]]), path([[6,3.5],[0,3.47],[8,3.41],[0,3.35],[7.5,3.29]]) ] };
  },
  pat2_straight(){
    const balls=[], lines=[];
    [1,2,3].forEach(y=>{ balls.push(ob(2,y-.27), ob(2,y+.27), cue(6,y)); lines.push(path([[6,y],[0,y-.03],[8,y+.02],[1.1,y+.06]])); });
    return { balls, lines, zones:[rect(0,0,2,4,'Stop here',[.45,1.5])] };
  },
  pat3_straight(){
    const balls=[], lines=[];
    [1,2,3].forEach(y=>{ balls.push(ob(2,y-.27), ob(2,y+.27), cue(6,y)); lines.push(path([[6,y],[0,y-.04],[8,y-.01],[0,y+.03],[7.1,y+.07]])); });
    return { balls, lines, zones:[rect(6,0,8,4,'Stop here',[7.55,1.5])] };
  },
  pat2_follow(){
    const a=straightSet([[2,.2],[2,.47],[2,.74]],'TL',5,[1,2,3]), b=straightSet([[3,3.26],[3,3.53],[3,3.8]],'BL',6,[4,5,6]);
    return { balls:[...a.balls,...b.balls], lines:[...a.lines,...b.lines], notes:[{p:[5.35,1.75],text:'cue ball on this line'},{p:[6.35,2.6],text:'cue ball on this line'}] };
  },
  pat2_draw(){
    const a=straightSet([[2,.11],[2,.33],[2,.55]],'TL',5), b=straightSet([[1,3.5],[1,3.695],[1,3.89]],'BL',5);
    return { balls:[...a.balls,...b.balls], lines:[...a.lines,...b.lines, path([[2,.55],[7.2,1.75]]), path([[1,3.5],[7.2,2.45]])], zones:[rect(6.5,0,8,4,'Position zone',[7.6,2])] };
  },
  pat3_draw(){
    const a=straightSet([[4,.18],[4,.46],[4,.74]],'TL',7), b=straightSet([[4,3.26],[4,3.54],[4,3.82]],'BL',7);
    return { balls:[...a.balls,...b.balls], lines:[...a.lines,...b.lines, path([[4,.74],[7.45,1.7]]), path([[4,3.26],[7.45,2.3]])], zones:[rect(6.5,0,8,4,'Position zone',[7.7,2])] };
  },
  t_follow(){
    const a=straightSet([[4,.23],[4,.62],[4,1.0]],'TL',7), b=straightSet([[3,3.25],[3,3.53],[3,3.8]],'BL',7);
    return { balls:[...a.balls,...b.balls], lines:[...a.lines,...b.lines] };
  },
  pat2_small3(){
    const row=[.22,.59,.96,1.33,1.7].map(x=>[x,2]), column=[1.73,1.36,.98,.6,.22].map(y=>[2,y]);
    return { balls:[...row,...column].map((p,i)=>ob(p[0],p[1],i+1)).concat([gh(.42,2.62), gh(1.4,2.78)]),
      lines:[aimL([.42,2.62],[.22,2]), pot([.22,2],'TL'), path([[.3,2.2],[1.4,2.78]])] };
  },
  pat3_small5(){
    const row=[.16,.42,.67,.93,1.19,1.45,1.7,1.96].map(x=>[x,2]), column=[1.75,1.48,1.21,.94,.67,.4,.15].map(y=>[2.2,y]);
    return { balls:[...row,...column].map((p,i)=>ob(p[0],p[1],i+1)).concat([gh(.4,2.58), gh(1.42,2.74)]),
      lines:[aimL([.4,2.58],[.16,2]), pot([.16,2],'TL'), path([[.26,2.2],[1.42,2.74]])] };
  },
  pat2_small4(){
    const top=[.14,.41,.68,.95,1.22].map(y=>[3,y]), bot=[3.86,3.59,3.32,3.05,2.78].map(y=>[3,y]);
    return { balls:[...top,...bot].map((p,i)=>ob(p[0],p[1],i+1)).concat([gh(2.3,.34), gh(2.2,.78), gh(2.3,3.66), gh(2.2,3.22)]),
      lines:[aimL([2.3,.34],[3,.14]), pot([3,.14],'TR'), path([[2.85,.2],[2.2,.78]]), aimL([2.3,3.66],[3,3.86]), pot([3,3.86],'BR'), path([[2.85,3.8],[2.2,3.22]])] };
  },
  pat3_small6(){
    const pts=col(3,.15,.263,15);
    return { balls: pts.map((p,i)=>ob(p[0],p[1],i+1)).concat([gh(2.4,.36), gh(2.38,.68)]),
      lines:[aimL([2.4,.36],pts[0]), pot(pts[0],'TR'), path([[2.85,.24],[2.38,.68]])] };
  },
  pat2_large3(){
    return { balls:[ob(6,2,1),ob(6,1.555,3),ob(6,1.11,5),ob(6,.665,7),ob(6,HB,9), ob(2,2,2),ob(2,2.445,6),ob(2,2.89,4),ob(2,3.335,8),ob(2,4-HB,10), gh(5.75,2.65), gh(3.6,1.55)],
      lines:[aimL([5.75,2.65],[6,2]), pot([6,2],'TR'), path([[5.9,2.1],[3.6,1.55]]), pot([2,2],'BL')] };
  },
  pat2_large4(){
    return { balls:[ob(HB,2,10),ob(.665,2,8),ob(1.11,2,6),ob(1.555,2,4),ob(2,2,2), ob(6,2,1),ob(6.445,2,3),ob(6.89,2,5),ob(7.335,2,7),ob(8-HB,2,9), gh(5.7,2.65), gh(2.3,2.9)],
      lines:[aimL([5.7,2.65],[6,2]), pot([6,2],'TR'), path([[5.85,2.15],[2.3,2.9]]), pot([2,2],'TL')] };
  },
  pat2_frozen3(){
    return { balls:[ob(7,F,1),ob(6,F,2),ob(5,F,3),ob(1,F,4),ob(2,F,5),ob(3,F,6), cue(4,2)],
      lines:[aimL([4,2],[6.82,.26]), pot([7,F],'TR'), pot([1,F],'TL')] };
  },
  pat2_frozen4(){
    const S=[7.7,2], k=(7.7-3.3)/(7.7-4);
    const mid=[1,2,3].map(g=>path([S,[3.3, 2+(g-2)*k]]));
    const l1=path([S,[4.25,.02],[3.3,.57]]), l5=path([S,[4.25,3.98],[3.3,3.43]]);
    return { balls:[ob(4,.5,2),ob(4,1.5,3),ob(4,2.5,4),ob(4,3.5,5), ob(8-F,2,1), cue(7.05,3.5)],
      lines:[aimL([7.05,3.5],[7.82,2.12]), pot([8-F,2],'TR'), l1, ...mid, l5],
      notes:[[.21,1],[.95,2],[2,3],[3.05,4],[3.79,5]].map(v=>({p:[3.72,v[0]],text:'lane '+v[1],small:1})) };
  },
  pat2_endless(){ return { balls:[ob(W1,2,5),ob(2,2,7),ob(4,2,9),ob(6,2,8),ob(8-W1,2,6), gh(.25,2.65)] }; },
  pat2_9ball(){ return { balls:[ob(1.1,.15,3),ob(1.1,3.85,2),ob(.15,2,9),ob(2,2,5),ob(4,2,4),cue(5,2),ob(6,2,6),ob(8-F,1,7),ob(8-F,3,8),ob(7.1,3,1)] }; },
  std1(){ return { balls:[ob(2,W1-.1), cue(1,1)], lines:[aimL([1,1],[1.86,.34]), pot([2,.2],'TR'), path([[1.88,.3],[1.95,0],[4.76,4],[6.05,2.3]])], zones:[rect(5,1,7,3,'Position zone',[6,1.35])] }; },
  std2(){ return { balls:[ob(3,2,1), cue(4,2), ob(8-F,2,2), gh(7.6,3.4)], lines:[aimL([4,2],[3.2,2]), pot([3,2],'TL'), path([[3,2],[1.66,4],[0,2.33],[2.12,0],[6.8,4],[7.55,3.45]]), pot([8-F,2],'TR')], zones:[{poly:[[6.07,4],[8,2.1],[8,4]],label:'Position zone',lp:[7.9,3.0]}] }; },
  std3(){ return { balls:[ob(2,2), cue(6,3.8), gh(6,3.0)], lines:[{pts:[[6,2.9],[6,3.9]],k:'range'}, aimL([6,3.8],[2.2,2.09]), pot([2,2],'TL'), path([[2.05,2.15],[1.75,3.2],[1.55,4],[1.9,2.6],[2.25,1.4]])], zones:[rect(.25,0,2.9,4,'Position zone',[.6,2.9])], notes:[{p:[.62,1.3],text:'no foot rail'}] }; },
  std4(){ return { balls:[ob(3.85,3.75), cue(8-W1+.03,3.5)], lines:[aimL([7.73,3.5],[4.05,3.74]), pot([3.85,3.75],'BL')], zones:[rect(3.95,3,4.9,4,'Position zone',[4.42,2.82])] }; },
  std5(){ return { balls:[ob(4,1), cue(6,1.2), gh(6,.5), gh(6,1.8)], lines:[{pts:[[6,.45],[6,1.85]],k:'range'}, aimL([6,1.2],[4.2,1.02]), pot([4,1],'TL'), path([[3.9,1.08],[2.2,1.35],[0,1.5],[6.05,2.2]])], zones:[rect(5,1.1,7.93,3.05,'Position zone',[6.6,2.75])], notes:[{p:[3.2,3.6],text:'no long rails'}] }; },
  pat3_angle1(){
    const b=[[4,2,3],[3.5,2,4],[3,2,5],[2.5,2,6],[2,2,7],[1.5,2,8],[1,2,9]];
    return { balls:b.map(v=>ob(v[0],v[1],v[2])).concat([cue(6,2)]), lines:b.map(v=>pot([v[0],v[1]], v[2]%2?'TL':'BL')) };
  },
  pat3_angle2(){
    const s=(c,b,pk)=>[aimL(c,b),pot(b,pk)];
    return { balls:[ob(3,1,1),ob(5,1,2),ob(3,3,3),ob(5,3,4), gh(5,4-F),gh(3,4-F),gh(5,F),gh(3,F)],
      lines:[...s([5,4-F],[3,1],'TL'), ...s([3,4-F],[5,1],'TR'), ...s([5,F],[3,3],'BL'), ...s([3,F],[5,3],'BR')] };
  },
  pat3_long1(){
    const pts=col(6,.3,.2429,15), balls=[], lines=[];
    pts.forEach((p,i)=>{ const pk=i<8?'TL':'BL'; const c=behind(p,pk,8-F); balls.push(ob(p[0],p[1],i+1)); balls.push({p:c,t:'ghost',small:1}); lines.push({pts:[c,AIM[pk]],k:'thin'}); });
    return { balls, lines };
  },
  pat3_long2(){
    const c=[8-F,2], b={5:[2,W1],7:[2,1.15],9:[2,2],8:[2,2.85],6:[2,4-W1]};
    return { balls:[...Object.keys(b).map(n=>ob(b[n][0],b[n][1],+n)), cue(c[0],c[1])],
      lines:[...Object.values(b).map(p=>({pts:[c,p],k:'thin'})), pot(b[5],'TL'),pot(b[7],'TL'),pot(b[6],'BL'),pot(b[8],'BL'),pot(b[9],'TL'),pot(b[9],'BL')] };
  },
  pat3_9b3(){ return { balls:[ob(1.5,F,7),ob(3,F,8),ob(.13,2,5),ob(1,2,2),ob(2,2,9),ob(4,2,4),ob(8-F,2,3),cue(4,3),ob(2,4-F,6),ob(7.84,3.84,1)] }; },
  pat3_9b4(){ return { balls:[ob(2,1,8),ob(6,1,3),ob(.13,2,9),ob(2,2,4),cue(4,2),ob(6,2,2),ob(8-F,2,5),ob(2,4-W1,7),ob(3,4-W1,6),ob(7,4-F,1)] }; },
  pat3_bank(){
    const xs=[.5,1.5,2.5,3.5];
    return { balls:[...xs.map(x=>ob(x,W1)), ...xs.map(x=>ob(x,4-W1)), gh(.55,1.1), gh(1.5,1.65)],
      lines:[aimL([.55,1.1],[.5,.5]), {pts:[[.5,W1],[.47,0],[.1,3.88]],k:'ob',arrow:1}, path([[.6,.6],[1.5,1.65]])] };
  },
  pat3_rail5(){
    const b=[[1,F],[3,F],[5,F],[7,F],[1,4-F],[2,4-F],[3,4-F],[5,4-F],[6,4-F],[7,4-F],[F,1],[F,3],[8-F,1],[8-F,2],[8-F,3]];
    return { balls:b.map(p=>ob(p[0],p[1])).concat([cue(4,2)]), lines:[aimL([4,2],[6.85,3.72]), pot([7,4-F],'BR'), path([[6.8,3.6],[7.0,2.4]])] };
  },
  pat3_rail6(){
    return { balls:[ob(1,F,1),ob(7,F,2),ob(7,4-F,3),ob(1,4-F,4),ob(5,F,5),ob(3,F,6),ob(5,4-F,7),ob(3,4-F,8),ob(F,3,9),ob(F,1,10),ob(8-F,1,11),ob(8-F,3,12),ob(5,2,13),ob(3,2,14),ob(4,2,15), gh(2.2,.45)] };
  },
  t_drawdose(){
    const yl=x=>3.5-1.5*x/8, strip=(a,b,l)=>({poly:[[a,yl(a)],[b,yl(b)],[b,4],[a,4]],label:l,lp:[(a+b)/2, yl((a+b)/2)+.22]});
    const z=[3,4,5,6,7].map((x,i)=>strip(x-.17,x+.17,String(i+1))); z.push(strip(7.62,8,'6'));
    return { balls:[ob(1,3.84), cue(2,3.78)], lines:[aimL([2,3.78],[1.2,3.83]), pot([1,3.84],'BL'), path([[1.3,3.8],[7.75,3.7]]), {pts:[[0,3.5],[8,2]],k:'thin'}], zones:z };
  },
  t_criss(){
    return { balls:[ob(.73,F,7),ob(1.5,F,9),ob(F,1.03,8),ob(1,1.03,13),ob(1.48,1.53,14),ob(2,2,15),ob(5.97,2,12),ob(6.48,2.52,11),ob(6.98,3.03,10),ob(8-F,2,6),ob(8-F,2.78,4),ob(8-F,3.53,2),ob(5.98,4-F,5),ob(6.7,4-F,3),ob(7.45,4-F,1), gh(5.77,3.2)] };
  },
  t_bank2(){
    const xs=[1,1.5,2,2.5,3,5,5.5,6,6.5,7];
    return { balls: xs.map(x=>ob(x,2)).concat([gh(2.9,2.75), gh(2.2,2.9)]), lines:[aimL([2.9,2.75],[3,2.2]), {pts:[[3,2],[3.47,0],[3.96,3.93]],k:'ob',arrow:1}, path([[2.95,2.3],[2.2,2.9]])] };
  },
};

/* ---------- Test definitions ---------- */
const inn = (n,max,min) => Array.from({length:n},(_,i)=>({ label:'Inning '+(i+1), max, min:min||0 }));
const STD_SHOTS = [
  { id:'s1', label:'1', title:'Shot 1: two rails across the table', diagram:'std1', tip:[.45,.2], how:['Object ball one ball off the long rail on the second-diamond line. Cue ball on the 1-1 spot.','After the first long rail the cue ball must cross the centre line and reach the other long rail past the side pocket. It then drifts into the zone.'] },
  { id:'s2', label:'2', title:'Shot 2: three rails to the frozen ball', diagram:'std2', tip:[.5,0], how:['Cue ball must travel three or more rails and stop in the zone.','Only then shoot the second ball, frozen on the head rail. It must go in too for the attempt to count.'] },
  { id:'s3', label:'3', title:'Shot 3: foot spot, hold the cue ball', diagram:'std3', tip:[-.15,-.5], how:['Object ball on the foot spot. Cue ball anywhere behind the head string.','Cue ball must not touch the foot rail, must not scratch, and must stop inside the zone.'] },
  { id:'s4', label:'4', title:'Shot 4: jacked up off the head rail', diagram:'std4', tip:[0,-.5], how:['Object ball one to two balls from the side pocket. Cue ball one ball off the head cushion, in line with ball and corner pocket.','Cue ball must stop in the small zone by the side pocket.'] },
  { id:'s5', label:'5', title:'Shot 5: foot rail and back', diagram:'std5', tip:[.2,.5], how:['Cue ball anywhere behind the head string. Pick the angle yourself.','Cue ball goes to the foot rail and comes back into the zone. The long rails may not be touched.'] },
];
const stdParts = () => STD_SHOTS.map(s=>({ ...s, fields:[{ label:'Made out of 3', max:3, min:0 }], how:[...s.how,'3 attempts. An attempt counts only if the ball is potted and the cue ball reaches the zone. After a make, play the next one from the other side of the table.'] }));

const TESTS = [
{ id:'pat1', name:'PAT 1', sub:'Playing Ability Test, level 1', mode:'sum', targetTotal:1000, emblems:[600,800,1000], cats:[
  { id:'c1', name:'Speed Drill', target:3.33, factor:30, parts:[{ id:'a', title:'Speed Drill', diagram:'pat2_speed', fields:inn(3,4), how:['Four balls on the head string, one in each diamond segment. You may shift a ball along its segment, but only on the head string.','Shoot each ball itself down the table: ball 1 at Speed 1 (stops in the foot zone), ball 2 at Speed 2 (foot rail and back to the head zone), ball 3 at Speed 3, ball 4 at Speed 4.','Hitting another ball or a long rail is not allowed. 1 point for each ball that stops in its zone; the centre of the ball decides.','3 innings, up to 4 points each.'] }] },
  { id:'c2', name:'Stroke Straightness', target:2.5, factor:40, parts:[{ id:'a', title:'Straightness at Speed 2', diagram:'p1_straight', fields:inn(4,3), how:['Cue ball from the head string through a gate of two balls set two ball widths apart. No side spin.','Speed 2: to the foot rail and back, and the cue ball has to stop in the head field.','A shot counts only if neither gate ball is touched and the speed is right. The centre of the ball decides.','4 innings of 3 shots. If the table is not true on all three lanes, shoot one lane three times.'] }] },
  { id:'c3', name:'Follow Shot Drill', target:11, factor:9.1, parts:[{ id:'a', title:'Follow Shot Drill', diagram:'p1_follow', fields:inn(3,12), how:['Six balls on the third-diamond line, about half a ball apart and off the long rail. Cue ball anywhere on the fifth-diamond line, lined up with ball and corner pocket.','1 point for the pot, 1 more if the cue ball stops in the 1 by 1 diamond field at that corner. The cue ball following the ball into the pocket also counts.','No position point if the cue ball touches a neighbouring ball. Any order. 12 points per inning.'] }] },
  { id:'c4', name:'Draw Shot Drill', target:10, factor:10, parts:[{ id:'a', title:'Draw Shot Drill', diagram:'p1_draw', fields:inn(3,12), how:['Six balls on the third-diamond line, half a ball apart and off the long rail. Cue ball anywhere on the fifth-diamond line, lined up with ball and corner pocket.','1 point for the pot, 1 more if the cue ball draws back, hits the head rail and stops in the head field.','No position point if the cue ball touches a neighbouring ball. On the balls next to the long rails the cue ball may use those rails, and a scratch in a head pocket still earns the position point.','The draw has to be clearly visible. 12 points per inning.'] }] },
  { id:'c5', name:'Small Area Position', target:3.33, factor:30, parts:[
    { id:'a', label:'5a', title:'Small Area Position Drill 1', diagram:'p1_small1', fields:inn(3,5), how:['Five balls in a half circle around a side pocket. The middle ball touches the first-diamond line with its far edge; the end balls sit on the half-diamond lines either side of the pocket.','Ball in hand. Play them in order, from one end of the half circle to the other, into that side pocket.','The cue ball may not touch a rail or another ball. Contact ends the inning and that ball does not count. A scratch also ends it.','Score is balls potted, up to 5.'] },
    { id:'b', label:'5b', title:'Small Area Position Drill 2', diagram:'p1_small2', fields:inn(3,5), how:['Five balls frozen in a row on the centre line, the first one frozen to the foot rail.','Ball in hand. Play them in order, starting at the rail, all into the same corner pocket. The cue ball may use any number of rails.','Hitting another object ball or a scratch ends the inning and that ball does not count. If the last ball moves when you pot the first, re-spot it and carry on.','Score is balls potted, up to 5.'] } ] },
  { id:'c6', name:'Large Area Position', target:3.33, factor:30, parts:[
    { id:'a', label:'6a', title:'Large Area Position Drill 1', diagram:'p1_large1', fields:inn(3,6), how:['The 1 on the head spot, the 2 on the foot spot, the 5 and 6 half a ball off the long rails, the 3 and 4 halfway between.','Numerical order, ball in hand to start. Each ball only into its own corner pocket, as drawn.','Touching another ball or a scratch ends the inning and that ball does not count. No banks or combinations; kicks and jumps are allowed.','Score is balls potted, up to 6.'] },
    { id:'b', label:'6b', title:'Large Area Position Drill 2', diagram:'p1_large2', fields:inn(3,6), how:['All six on the centre line: the 1 on the head spot, the 2 on the foot spot, the 5 and 6 half a ball off the short rails, the 3 and 4 halfway between.','Numerical order, ball in hand to start. Either corner pocket at that end of the table.','Touching another ball or a scratch ends the inning and that ball does not count. No banks or combinations; kicks and jumps are allowed.','Score is balls potted, up to 6.'] } ] },
  { id:'c7', name:'Frozen Rail', target:4, factor:25, parts:[
    { id:'a', label:'7a', title:'Frozen Rail Drill 1', diagram:'p1_frozen1', fields:inn(3,6), how:['Six balls frozen to the rails around the foot end, as drawn. Ball in hand to start.','Any order, any corner pocket.','No combinations, no banks, no touching other balls. Any of these, or a scratch, ends the inning and that ball does not count. Kicks and jumps are allowed.','Score is balls potted, up to 6.'] },
    { id:'b', label:'7b', title:'Frozen Rail Drill 2', diagram:'p1_frozen2', fields:inn(3,10), how:['Ten balls frozen to the rails as drawn. The cue ball starts where drawn, not ball in hand.','Any order, any corner pocket.','No combinations, no banks, no touching other balls. Any of these, or a scratch, ends the inning and that ball does not count. Kicks and jumps are allowed.','Score is balls potted, up to 10.'] } ] },
  { id:'c8', name:'Endless Position', target:4.5, factor:22.22, parts:[{ id:'a', title:'Endless Position Drill 1', diagram:'p1_endless', fields:inn(3,9), how:['The 7 on the foot spot, the 9 on the centre spot, the 8 on the head spot. Ball in hand to start.','Play 7, 8, 9 in order. Any pocket, but call it.','When all three are down, re-spot them and keep going from where the cue ball stopped.','Touching another ball or a scratch ends the inning. No banks or combinations. Capped at 9 balls per inning.'] }] },
  { id:'c9', name:'Standard Shots', target:2, factor:50, parts:[
    { id:'s1', label:'1', title:'Shot 1: centre spot to the corner', diagram:'p1_std1', fields:[{ label:'Made out of 3', max:3, min:0 }], how:['Object ball on the centre spot, cue ball on the line from the far corner through the ball, so it is a straight shot into the opposite corner.','3 attempts. After a make, the next attempt is from the other side.','Only the pot counts here; where the cue ball goes, even a scratch, does not matter.'] },
    { id:'s2', label:'2', title:'Shot 2: foot spot cut', diagram:'p1_std2', fields:[{ label:'Made out of 3', max:3, min:0 }], how:['Object ball on the foot spot. Cue ball on the head string, three ball widths off the long rail.','Cut the ball into the far corner pocket on the other side.','3 attempts, changing sides after a make. Only the pot counts.'] },
    { id:'s3', label:'3', title:'Shot 3: ball off the long rail', diagram:'p1_std3', fields:[{ label:'Made out of 3', max:3, min:0 }], how:['Object ball one ball off the long rail on the third-diamond line. Cue ball on the seventh-diamond line, one diamond off the opposite rail.','Pot it along the rail into the foot corner pocket.','3 attempts, changing sides after a make. Only the pot counts.'] },
    { id:'s4', label:'4', title:'Shot 4: side pocket line to the corner', diagram:'p1_std4', fields:[{ label:'Made out of 3', max:3, min:0 }], how:['Object ball on the side pocket line, about one diamond off the long rail. Cue ball near the head corner on the same side.','Pot it into the foot corner pocket on that side.','3 attempts, changing sides after a make. Only the pot counts.'] },
    { id:'s5', label:'5', title:'Shot 5: ball near the foot rail', diagram:'p1_std5', fields:[{ label:'Made out of 3', max:3, min:0 }], how:['Object ball half a diamond off the foot rail, one diamond in from the long rail. Cue ball near the head string by the opposite long rail.','Cut it into the near foot corner pocket.','3 attempts, changing sides after a make. Only the pot counts.'] } ] },
  { id:'c10', name:'9-Ball Situation', target:4.5, factor:22.22, parts:[{ id:'a', title:'9-Ball Situation Drill', diagram:'p1_9ball', fields:inn(3,9), how:['Set up the layout and try to clear the table under full 9-ball rules. The cue ball may touch other balls.','Balls potted on a foul do not count. A combination on the 9 scores the full 9, and luck counts.','3 innings, each from the same layout. Mirror it if you are left-handed.','Score is balls legally potted, up to 9.'] }] },
]},
{ id:'pat2', name:'PAT 2', sub:'Playing Ability Test, level 2', mode:'sum', targetTotal:1000, cats:[
  { id:'c1', name:'Speed Drill', target:4, factor:25, parts:[{ id:'a', title:'Speed Drill', diagram:'pat2_speed', fields:inn(3,4), how:['Four balls on the head string, one per lane.','Shoot each ball itself down the table. Ball 1 at Speed 1 (one length, stops in the foot zone), ball 2 at Speed 2 (foot rail and back to the head zone), ball 3 at Speed 3, ball 4 at Speed 4.','1 point for each ball that stops in its zone without touching a long rail or another ball. The centre of the ball decides.','3 innings, up to 4 points each.'] }] },
  { id:'c2', name:'Stroke Straightness', target:1.5, factor:66.67, parts:[{ id:'a', title:'Straightness at Speed 3', diagram:'pat2_straight', fields:inn(4,3), how:['Cue ball from the head string through a gate of two balls set two ball widths apart. No side spin.','Speed 3: foot rail, head rail, then the cue ball has to stop in the marked end zone.','A shot counts only if neither gate ball is touched and the speed is right.','4 innings of 3 shots. Enter the number of good shots per inning. If the table is not true on all three lanes, shoot one lane three times.'] }] },
  { id:'c3', name:'Follow Shot Drill', target:10, factor:10, parts:[{ id:'a', title:'Follow Shot Drill', diagram:'pat2_follow', fields:inn(3,12), how:['Six straight-in shots: three balls on the second-diamond line, three on the third, about half a ball apart and off the long rail.','Cue ball anywhere on its diamond line, lined up with ball and pocket.','1 point for the pot, 1 more if the cue ball follows it into the same corner pocket.','No position point if the cue ball touches a neighbouring ball. Any order. 12 points per inning.'] }] },
  { id:'c4', name:'Draw Shot Drill', target:10, factor:10, parts:[{ id:'a', title:'Draw Shot Drill', diagram:'pat2_draw', fields:inn(3,12), how:['Object balls on the first and second diamond lines. Cue ball on the fifth-diamond line, lined up with ball and corner pocket.','1 point for the pot, 1 more if the cue ball draws back and stops in the position zone. It may touch the head rail.','No position point if the cue ball touches a neighbouring ball. On the balls nearest the long rails the cue ball may use that rail, and a scratch in a head pocket still earns the position point.','The draw has to be clearly visible. 12 points per inning.'] }] },
  { id:'c5', name:'Small Area Position', target:6, factor:16.67, parts:[
    { id:'a', label:'5a', title:'Small Area Position Drill 3', diagram:'pat2_small3', fields:inn(3,10), how:['Ten balls in an L around the foot spot (no ball on the spot itself). Ball in hand to start.','Play them in order along the L, starting with the ball nearest the foot rail, all into the one corner pocket shown.','Touching another ball or scratching ends the inning and that ball does not count. No banks.','Score is balls potted, up to 10.'] },
    { id:'b', label:'5b', title:'Small Area Position Drill 4', diagram:'pat2_small4', fields:inn(3,10), how:['Two rows of five on the third-diamond line. Ball in hand to start.','Work from the rail inward, each ball into the far corner pocket. After the fifth ball take ball in hand for the other five.','Touching another ball or scratching ends the inning and that ball does not count. No banks.','Score is balls potted, up to 10.'] } ] },
  { id:'c6', name:'Large Area Position', target:5.5, factor:18.18, parts:[
    { id:'a', label:'6a', title:'Large Area Position Drill 3', diagram:'pat2_large3', fields:inn(3,10), how:['1 on the head spot, 2 on the foot spot, 9 and 10 half a ball off the long rails, the rest evenly between.','Numerical order, ball in hand to start. Odd balls into one corner, even balls into the opposite corner, as drawn.','Touching another ball or scratching ends the inning and that ball does not count. No banks or combinations. Kicks and jumps are allowed.','Score is balls potted, up to 10.'] },
    { id:'b', label:'6b', title:'Large Area Position Drill 4', diagram:'pat2_large4', fields:inn(3,10), how:['All ten balls on the centre line: 1 on the head spot, 2 on the foot spot, 9 and 10 half a ball off the short rails.','Numerical order, ball in hand to start. Either corner pocket at that end of the table.','Touching another ball or scratching ends the inning and that ball does not count. No banks or combinations. Kicks and jumps are allowed.','Score is balls potted, up to 10.'] } ] },
  { id:'c7', name:'Frozen Rail', target:3.33, factor:30, parts:[
    { id:'a', label:'7a', title:'Frozen Rail Drill 3', diagram:'pat2_frozen3', fields:inn(3,6), how:['Six balls frozen on one long rail. Cue ball starts on the centre spot.','Numerical order into the corner pockets. Use one or more rails for position as you like.','No combinations, no banks, no touching other balls. Any of these, or a scratch, ends the inning and that ball does not count.','Score is balls potted, up to 6.'] },
    { id:'b', label:'7b', title:'Frozen Rail Drill 4', diagram:'pat2_frozen4', fields:inn(3,5), how:['Pot the ball frozen on the head rail and send the cue ball through one lane of the row of balls. Ball and cue ball go back to their spots each time.','One attempt per lane, lanes 1 to 5 in turn. The cue ball may use a rail only on the first and last lane.','A lane counts only if the cue ball touches nothing, does not scratch, does not come back through, and stays on the far half.','Score is lanes made, up to 5.'] } ] },
  { id:'c8', name:'Endless Position', target:7, factor:14.29, parts:[{ id:'a', title:'Endless Position Drill 3', diagram:'pat2_endless', fields:inn(3,15), how:['Five balls on the centre line. 5 and 6 sit a ball off their short rails. Ball in hand to start.','Play 5, 6, 7, 8, 9 in order. Any pocket, but call it.','When all five are down, re-spot them and keep going from where the cue ball stopped.','Touching another ball or scratching ends the inning. No banks or combinations. Capped at 15 balls per inning.'] }] },
  { id:'c9', name:'Standard Position Shots', target:2, factor:50, parts:stdParts() },
  { id:'c10', name:'9-Ball Situation', target:6, factor:16.67, parts:[{ id:'a', title:'9-Ball Situation Drill 1', diagram:'pat2_9ball', fields:inn(3,9), how:['Set the layout and try to run out under full 9-ball rules.','The cue ball may touch other balls. Balls potted on a foul do not count.','A combination on the 9 scores the full 9. Luck counts.','3 innings, each from the same layout. Score is balls legally potted, up to 9. Mirror the layout if you are left-handed.'] }] },
]},
{ id:'pat3', name:'PAT 3', sub:'Playing Ability Test, level 3', mode:'sum', targetTotal:1000, emblems:[550,700,850,1000], cats:[
  { id:'c1', name:'Stroke Straightness', target:1.5, factor:66.67, parts:[{ id:'a', title:'Straightness at Speed 4', diagram:'pat3_straight', fields:inn(4,3), how:['Cue ball from the head string through a gate of two balls set two ball widths apart. No side spin.','Speed 4: four table lengths, and the cue ball has to stop above the head string.','A shot counts only if neither gate ball is touched and the speed is right.','4 innings of 3 shots. Enter the number of good shots per inning.'] }] },
  { id:'c2', name:'Draw Drill', target:10, factor:10, parts:[{ id:'a', title:'Draw Drill', diagram:'pat3_draw', fields:inn(3,12), how:['Six balls on the line between the side pockets, half a ball apart and off the long rail. Cue ball on the seventh-diamond line, lined up with ball and corner pocket.','1 point for the pot, 1 more if the cue ball draws back and stops in the head zone. It may not touch the head rail.','No position point if the cue ball touches a neighbouring ball or scratches. On the balls nearest the long rails the cue ball may use that rail.','The draw has to be clearly visible. 12 points per inning.'] }] },
  { id:'c3', name:'Small Area Position', target:10, factor:10, parts:[
    { id:'a', label:'3a', title:'Small Area Position Drill 5', diagram:'pat3_small5', fields:inn(3,15), how:['Fifteen balls in an L: eight toward the foot rail, seven in a column one ball beyond the foot string. Ball in hand to start.','Play them in order along the L, starting nearest the foot rail, all into the one corner pocket shown.','Touching any other ball or scratching ends the inning and that ball does not count. No banks.','Score is balls potted, up to 15.'] },
    { id:'b', label:'3b', title:'Small Area Position Drill 6', diagram:'pat3_small6', fields:inn(3,15), how:['Fifteen balls in one row across the table. Put the 8 in the middle, solids one side, stripes the other. Ball in hand to start.','Work along the row in order. Either far corner pocket, any time.','Touching any other ball or scratching ends the inning and that ball does not count. No banks.','Score is balls potted, up to 15.'] } ] },
  { id:'c4', name:'Large Area Position', target:10, factor:10, parts:[
    { id:'a', label:'4a', title:'Large Area Position Drill 5', diagram:null, missing:'The pages for this drill (PAT 3, pages 16 to 21) were not in the scanned file. Set it up from the book. Scoring here works as normal.', fields:inn(3,15), how:['Score is balls potted per inning, up to 15.'] },
    { id:'b', label:'4b', title:'Large Area Position Drill 6', diagram:null, missing:'The pages for this drill (PAT 3, pages 16 to 21) were not in the scanned file. Set it up from the book. Scoring here works as normal.', fields:inn(3,15), how:['Score is balls potted per inning, up to 15.'] } ] },
  { id:'c5', name:'Angle Shots', target:3, factor:33.33, parts:[
    { id:'a', label:'5a', title:'Angle Shot Drill 1', diagram:'pat3_angle1', fields:inn(3,7), how:['Balls 3 to 9 on the centre line, half a diamond apart, from the centre spot toward the foot rail. Cue ball on the head spot for every shot.','Start with the 3 and go up in order. Odd balls to one corner, even balls to the other, as drawn.','A miss ends the inning. The next inning starts on the ball you missed, and balls are re-spotted so 7 is always possible.','Touching another ball and scratching are each tolerated once. Score is balls potted, up to 7.'] },
    { id:'b', label:'5b', title:'Angle Shot Drill 2', diagram:'pat3_angle2', fields:inn(3,4), how:['Four balls on the diamond crossings shown. For each one the cue ball sits frozen on the long rail at its matching spot.','Start with the 1. Each ball goes to the corner drawn.','A miss ends the inning. The next inning starts on the missed ball, with re-spots so 4 is always possible.','Touching another ball and scratching are each tolerated once. Score is balls potted, up to 4.'] } ] },
  { id:'c6', name:'Long Shots', target:4, factor:25, parts:[
    { id:'a', label:'6a', title:'Long Shot Drill 1', diagram:'pat3_long1', fields:inn(3,15), how:['Fifteen balls across the head string, the outer two a ball off the long rails. Cue ball frozen to the head rail, dead straight with ball and far corner pocket.','Start innings alternately from the right and from the left. The middle ball may go to either corner.','A miss ends the inning.','Score is balls potted, up to 15.'] },
    { id:'b', label:'6b', title:'Long Shot Drill 2', diagram:'pat3_long2', fields:inn(3,5), how:['5 and 6 a ball off the long rails, 9 on the foot spot, 7 and 8 halfway between. Cue ball frozen to the middle of the head rail before every shot.','Order 5, 6, 7, 8, 9. The 9 may go in either corner, the others into the corner drawn.','A miss ends the inning. The next inning starts on the missed ball with everything re-spotted. The cue ball may touch other balls here.','Score is balls potted, up to 5.'] } ] },
  { id:'c7', name:'9-Ball Situations', target:7, factor:14.29, parts:[
    { id:'a', label:'7a', title:'9-Ball Situation Drill 3', diagram:'pat3_9b3', fields:inn(3,9), how:['The 1 sits exactly between the jaws of the corner pocket.','Run out under full 9-ball rules. Other balls may be moved. Balls potted on a foul do not count.','A combination on the 9 scores the full 9. Luck counts.','3 innings, each from the same layout. Score is balls legally potted, up to 9.'] },
    { id:'b', label:'7b', title:'9-Ball Situation Drill 4', diagram:'pat3_9b4', fields:inn(3,9), how:['The 6 and 7 are exactly one ball off the rail.','Run out under full 9-ball rules. Other balls may be moved. Balls potted on a foul do not count.','A combination on the 9 scores the full 9. Luck counts.','3 innings, each from the same layout. Mirror it if you are left-handed. Score is balls legally potted, up to 9.'] } ] },
  { id:'c8', name:'Bank Shot Drill', target:4, factor:25, parts:[{ id:'a', title:'Bank Shot Drill 1', diagram:'pat3_bank', fields:inn(3,8), how:['Eight balls, each midway between two diamonds and one ball off the cushion.','Ball in hand on the first ball of your choice, then play from where the cue ball stops. Any order, any pocket.','Called bank shots only. The cue ball may not touch any other object ball.','A miss ends the inning and the next starts fresh with all eight. Score is banks made, up to 8.'] }] },
  { id:'c9', name:'Standard Position Shots', target:3, factor:33.33, parts:stdParts() },
  { id:'c10', name:'Frozen Rail', target:10, factor:10, parts:[
    { id:'a', label:'10a', title:'Frozen Rail Drill 5', diagram:'pat3_rail5', fields:inn(3,15), how:['Fifteen balls frozen to the rails. Cue ball starts on the centre spot, not ball in hand.','Any order. Corner pockets only, direct shots only.','No banks, combinations or caroms. Kicks and jumps are allowed. Touching another ball or scratching ends the inning and that ball does not count.','Every inning starts again with all fifteen. Score is balls potted, up to 15.'] },
    { id:'b', label:'10b', title:'Frozen Rail Drill 6', diagram:'pat3_rail6', fields:inn(3,15), how:['Twelve balls frozen to the rails plus 13, 14 and 15 on the centre line. Ball in hand to start.','Numerical order, 1 to 15.','No banks, combinations or caroms. Kicks and jumps are allowed. Touching another ball or scratching ends the inning and that ball does not count.','Score is balls potted, up to 15.'] } ] },
]},
{ id:'tech', name:'Technique Set', short:'Technique', sub:'PAT 3 technique training drills', mode:'mean', targetTotal:100, cats:[
  { id:'t1', name:'Follow Shots', kind:'pct', cap:12, parts:[{ id:'a', title:'Follow Shots', diagram:'t_follow', fields:inn(3,12), how:['Six straight-in shots from the seventh-diamond line.','1 point for the pot, 1 more if the cue ball follows it into the same pocket.','12 points per round.'] }] },
  { id:'t2', name:'Draw Shot Dosage', kind:'pct', cap:6, parts:[{ id:'a', title:'Draw Shot Dosage', diagram:'t_drawdose', fields:inn(3,6), how:['Six draw shots along the long rail, one to each numbered zone.','1 point each time the cue ball stops in the zone you were playing for. The centre of the ball decides.','6 points per round.'] }] },
  { id:'t3', name:'Criss-Cross Drill', kind:'pct', cap:15, parts:[{ id:'a', title:'Criss-Cross Drill', diagram:'t_criss', fields:inn(3,15), how:['Ball in hand. Numerical order, each ball into its prescribed pocket.','No touching other balls, no banks, combinations or caroms.','Four levels: A is balls 1 to 9, B adds 10 and 13, C adds 12 and 15, D is all fifteen.','Score is balls potted, up to 15.'] }] },
  { id:'t4', name:'Bank Shot Drill 2', kind:'lower', best:10, parts:[{ id:'a', title:'Bank Shot Drill 2', diagram:'t_bank2', fields:inn(3,20,10), how:['Ten balls on the centre line. Ball in hand to start, any order, any pocket.','Only called banks count. A ball that drops uncalled is re-spotted. Moving other balls is allowed.','Scored here as innings needed to bank all ten: 10 is perfect, 20 is the limit.'] }] },
  { id:'t5', name:'Standard Position Workout', kind:'sum', cap:112, parts:[
    { id:'b', label:'Balls', title:'Workout: object balls potted', diagram:null, missing:'The eight workout shots (PAT 3, page 48) were not in the scanned file. Set them up from the book.', fields:Array.from({length:8},(_,i)=>({label:'Shot '+(i+1), max:7, min:0})), how:['7 attempts at each of the 8 shots. Enter how many times the object ball went in.'] },
    { id:'p', label:'Position', title:'Workout: positions reached', diagram:null, missing:'The eight workout shots (PAT 3, page 48) were not in the scanned file. Set them up from the book.', fields:Array.from({length:8},(_,i)=>({label:'Shot '+(i+1), max:7, min:0})), how:['Enter how many times you also reached position. A position point only counts when the ball was potted.','The book puts the pass mark at 80 percent: 44.8 of 56 for each line.'] } ] },
]},
{ id:'basis', name:'Basis-Check', short:'Basis', sub:'Six drills scored by errors, then 10 racks against the ghost', mode:'basis', cats:[
  { id:'b1', name:'Warm Up Drill', kind:'errors', timed:true, parts:[{ id:'a', title:'Warm Up Drill', photo:'basis-1.jpg', fields:[{ label:'Errors, round 1', counter:1 },{ label:'Errors, round 2', counter:1 }], how:['Spread all 15 balls at least one diamond off every cushion.','Pocket every ball without the cue ball touching a rail. The cue ball may touch object balls, and object balls may touch the rails.','A miss or the cue ball touching a rail is an error. Take ball in hand after every error.','Play it twice and count the errors of each round separately.'] }] },
  { id:'b2', name:'Technique Drill', kind:'errors', timed:true, parts:[{ id:'a', title:'Technique Drill', photo:'basis-2.jpg', fields:[{ label:'Errors', counter:1 }], how:['Five object balls on the third diamond on each side.','Ball in hand two diamonds away. Pot the ball and follow the cue ball into the same pocket.','If both balls do not drop, or the cue ball does not follow in, it is an error. Put the ball back and play it again.'] }] },
  { id:'b3', name:'S Drill', kind:'errors', timed:true, parts:[{ id:'a', title:'S Drill', photo:'basis-3.jpg', fields:[{ label:'Errors, round 1', counter:1 },{ label:'Errors, round 2', counter:1 }], how:['Five balls on the second diamond on each side of the table, about a quarter diamond off the rail.','Pot them from the outside in. For every position the cue ball goes exactly two rails: short rail, then long rail.','A miss or touching another ball is an error. Take ball in hand after an error.','Round 1 is one side, round 2 the other side.'] }] },
  { id:'b4', name:'Quadrant Drill', kind:'errors', timed:true, parts:[{ id:'a', title:'Quadrant Drill', photo:'basis-4.jpg', fields:[{ label:'Errors, round 1', counter:1 },{ label:'Errors, round 2', counter:1 }], how:['All 15 balls at random around the second diamond, about half a ball off the rail.','Pot them in rotation, 1 to 15, without touching another ball.','The cue ball has to stay in that quadrant: it may never pass the second diamond.','A miss or touching another object ball is an error. Take ball in hand after an error. Play it twice.'] }] },
  { id:'b5', name:'Snooker Drill', kind:'errors', timed:true, parts:[{ id:'a', title:'Snooker Drill', photo:'basis-5.jpg', fields:[{ label:'Errors', counter:1 }], how:['Line the balls up as in the photo: even numbers on one side, odd on the other, the 15 on the spot.','Pot 1 to 14 in rotation, and pot the 15 between every ball, re-spotting it each time.','Balls on the left go in the left pocket, balls on the right in the right pocket. The cue ball may not cross the line of balls.','A miss, touching a ball or crossing the line is an error. Take ball in hand after an error.'] }] },
  { id:'b6', name:'10 Ball Drill', kind:'errors', timed:true, parts:[{ id:'a', title:'10 Ball Drill', photo:'basis-6.jpg', fields:[{ label:'Errors, round 1', counter:1 },{ label:'Errors, round 2', counter:1 }], how:['Even balls on one side, odd balls on the other, in random order.','Pot them from 1 to 10.','A miss or touching a ball is an error. Take ball in hand after an error.','The score sheet has two boxes for this drill, one per round.'] }] },
  { id:'b7', name:'Ghost 9-Ball', kind:'ghost', parts:[{ id:'a', title:'Ghost 9-Ball, 10 racks', diagram:null, fields:Array.from({length:10},(_,i)=>({ label:'Rack '+(i+1), values:[0,1,2,3,4,5,6,7,8,9,10,15] })), how:['Ten racks of 9-ball. The 9 on the spot, kitchen rule.','Break and run out: 15 points.','Ball in hand after the break and run out: 10 points, because the 9-ball counts as 2 points.','A dry break or a foul on the break does not matter, you take ball in hand.','After a miss: 9 minus the balls left on the table. Three left means 9 minus 3, so 6.'] }] },
]},
];

/* ---------- Scoring (pure) ---------- */
function fieldKeys(cat){ const k=[]; cat.parts.forEach(p=>p.fields.forEach((f,i)=>k.push({ key:cat.id+'.'+p.id+'.'+i, f, part:p }))); return k; }
function catCap(cat){ const k=fieldKeys(cat); return k.reduce((s,x)=>s+x.f.max,0)/k.length; }
function catMaxPts(cat){ const kind=cat.kind||'pat'; if(kind==='errors') return null; if(kind==='ghost') return 150; return kind==='pat' ? Math.round(catCap(cat)*cat.factor) : 100; }
function catCalc(cat, scores){
  const keys=fieldKeys(cat), vals=keys.map(k=>scores[k.key]).filter(v=>typeof v==='number');
  const n=keys.length, entered=vals.length, complete=entered===n, sum=vals.reduce((a,b)=>a+b,0);
  const kind=cat.kind||'pat';
  let avg=null, pts=null;
  if(entered){
    const div = complete ? n : entered;
    avg = sum/div;
    if(kind==='pat') pts=Math.round(avg*cat.factor);
    else if(kind==='pct') pts=Math.round(avg/cat.cap*100);
    else if(kind==='lower') pts=Math.round(cat.best/avg*100);
    else if(kind==='sum'){ avg=sum; pts=Math.round(sum/(complete?cat.cap:entered*7)*100); }
    else if(kind==='errors'||kind==='ghost') pts=sum;
  }
  return { n, entered, complete, sum, avg, pts, max:catMaxPts(cat), kind };
}
function sessionCalc(test, scores){
  const cats=test.cats.map(c=>({ cat:c, ...catCalc(c,scores) }));
  const done=cats.filter(c=>c.complete), started=cats.filter(c=>c.entered>0);
  if(test.mode==='basis'){
    const ec=cats.filter(c=>c.kind==='errors'), gc=cats.find(c=>c.kind==='ghost');
    const errors=ec.reduce((s,c)=>s+(c.entered?c.sum:0),0);
    return { cats, total:gc.entered?gc.sum:0, errors, errorsComplete:ec.every(c=>c.complete), ghostComplete:gc.complete, maxTotal:150, doneCount:done.length, startedCount:started.length, complete:done.length===test.cats.length };
  }
  const sum=done.reduce((s,c)=>s+c.pts,0);
  const total = test.mode==='sum' ? sum : (done.length ? Math.round(sum/done.length) : 0);
  const maxTotal = test.mode==='sum' ? test.cats.reduce((s,c)=>s+catMaxPts(c),0) : 100;
  return { cats, total, maxTotal, doneCount:done.length, startedCount:started.length, complete:done.length===test.cats.length };
}
if (typeof module!=='undefined') module.exports={ TESTS, DIAGRAMS, catCalc, sessionCalc, catMaxPts, fieldKeys };
