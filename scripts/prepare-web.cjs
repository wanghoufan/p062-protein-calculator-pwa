// Complete the static Expo export without depending on a particular GitHub repository name.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

for (const name of ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png']) {
  fs.copyFileSync(path.join(root, 'web-assets', name), path.join(dist, name));
}
fs.writeFileSync(path.join(dist, '.nojekyll'), '');
const manifest = {
  name: '蛋白质计算器', short_name: '蛋白质计算器', lang: 'zh-CN',
  start_url: './', scope: './', display: 'standalone',
  background_color: '#FAF7F0', theme_color: '#FAF7F0',
  icons: [192, 512].map(size => ({ src: `./icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png' })),
};
fs.writeFileSync(path.join(dist, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));
const htmlPath = path.join(dist, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace('<html lang="en">', '<html lang="zh-CN">');
html = html.replace('</head>', `  <link rel="manifest" href="./manifest.webmanifest" />\n  <link rel="apple-touch-icon" href="./apple-touch-icon.png" />\n  <meta name="theme-color" content="#FAF7F0" />\n</head>`);
html = html.replace('</body>', `  <script>if ('serviceWorker' in navigator) window.addEventListener('load', function () { navigator.serviceWorker.register('./service-worker.js').catch(function () {}); });</script>\n</body>`);
fs.writeFileSync(htmlPath, html);

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const name = path.join(dir, entry.name);
    return entry.isDirectory() ? files(name) : [name];
  });
}
const all = files(dist).filter(file => !file.endsWith('service-worker.js')).sort();
const hash = crypto.createHash('sha256');
for (const file of all) hash.update(path.relative(dist, file)).update(fs.readFileSync(file));
const cache = `protein-calculator-${hash.digest('hex').slice(0, 16)}`;
const urls = all.map(file => './' + path.relative(dist, file).split(path.sep).join('/'));
const sw = `const CACHE = ${JSON.stringify(cache)};\nconst FILES = ${JSON.stringify(urls)};\n` + String.raw`
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('protein-calculator-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match(new URL('./index.html', self.registration.scope).href)));
  } else {
    event.respondWith(caches.match(request).then(hit => hit || fetch(request)));
  }
});
`;
fs.writeFileSync(path.join(dist, 'service-worker.js'), sw);
