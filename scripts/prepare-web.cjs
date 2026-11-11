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
// 主屏名称随界面语言变化：页面在运行时按 locale 切换 <link rel="manifest"> 指向的中/英两份清单。
const manifestBase = {
  start_url: './', scope: './', display: 'standalone',
  background_color: '#FAF7F0', theme_color: '#FAF7F0',
  icons: [192, 512].map(size => ({ src: `./icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png' })),
};
// short_name 是 Android 启动器图标下的标签；英文装在 Android 14 单行只容约 15 字符，
// 18 字符的 Protein Calculator 会被截成 Protein Calcula…，故英文短名压到 13 字符。
const manifests = {
  zh: { ...manifestBase, name: '蛋白质计算器', short_name: '蛋白质计算器', lang: 'zh-CN' },
  en: { ...manifestBase, name: 'Protein Calculator', short_name: 'ProtnCalc·pwa', lang: 'en' },
};
for (const [code, manifest] of Object.entries(manifests)) {
  fs.writeFileSync(path.join(dist, `manifest.${code}.webmanifest`), JSON.stringify(manifest, null, 2));
}
// 静态 index.html 的默认指向（中文）；运行时由 applyDocumentLocale 改写。
fs.writeFileSync(path.join(dist, 'manifest.webmanifest'), JSON.stringify(manifests.zh, null, 2));
const htmlPath = path.join(dist, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
html = html.replace('<html lang="en">', '<html lang="zh-CN">');
html = html.replace('</head>', `  <link rel="manifest" href="./manifest.webmanifest" />\n  <link rel="apple-touch-icon" href="./apple-touch-icon.png" />\n  <meta name="theme-color" content="#FAF7F0" />\n</head>`);
html = html.replace('</body>', `  <script>if ('serviceWorker' in navigator) window.addEventListener('load', function () { navigator.serviceWorker.register('./service-worker.js').catch(function (error) { console.warn('service worker registration failed', error); }); });</script>\n</body>`);
fs.writeFileSync(htmlPath, html);

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const name = path.join(dir, entry.name);
    return entry.isDirectory() ? files(name) : [name];
  });
}
// GitHub Pages 不提供点文件（.nojekyll 实测 404），不能放进预缓存清单，否则 install 失败导致离线不可用。
const all = files(dist)
  .filter(file => {
    const rel = path.relative(dist, file);
    return !rel.endsWith('service-worker.js') && !rel.split(path.sep).some(part => part.startsWith('.'));
  })
  .sort();
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
