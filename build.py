css=open('style.css').read();d=open('data.js').read();a=open('app.js').read()
html=f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Pool Progress</title>
<meta name="theme-color" content="#eef2f5" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0b141b" media="(prefers-color-scheme: dark)">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Pool Progress">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="robots" content="noindex">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icon-180.png">
<link rel="icon" href="icon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;1,500&family=Barlow+Condensed:wght@600;700&display=swap" rel="stylesheet">
<style>
{css}</style>
</head>
<body>
<div id="app"></div>
<script src="firebase-config.js"></script>
<script>
{d}
{a}</script>
<script type="module" src="cloud.js"></script>
</body>
</html>
'''
open('index.html','w').write(html);print(len(html))
