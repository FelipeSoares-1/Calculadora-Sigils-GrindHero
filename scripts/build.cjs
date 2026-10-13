const fs = require('node:fs');
const path = require('node:path');
const obfuscator = require('javascript-obfuscator');
const root = path.join(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data/sigils.json'), 'utf8'));
const source = `const SIGIL_CATALOG = ${JSON.stringify(catalog)};\n` + fs.readFileSync(path.join(root, 'main.js'), 'utf8');
const output = obfuscator.obfuscate(source, {compact: true, seed: 25728003, stringArray: true}).getObfuscatedCode();
fs.writeFileSync(path.join(root, 'main.obfuscated.js'), output);
const dist = path.join(root, 'dist');
fs.mkdirSync(dist, {recursive: true});
// Não distribuir cópias antigas da lógica nem fontes desnecessárias.
for (const name of ['main.js', 'sigils-data.js']) {
  const file = path.join(dist, name);
  if (fs.existsSync(file)) fs.unlinkSync(file);
}
for (const name of ['index.html','main.obfuscated.js','estrela.webp','favicon.png','og-image.png','red-skull-logo.png','red-skull-logo.webp','robots.txt','sitemap.xml']) {
  fs.copyFileSync(path.join(root, name), path.join(dist, name));
}
fs.cpSync(path.join(root, 'sigils_icons'), path.join(dist, 'sigils_icons'), {recursive: true});
console.log('Distribuição gerada em dist/ a partir do catálogo único.');
