const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const root = path.join(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root,'data/sigils.json'),'utf8'));
function app(built = false) {
  const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
  const dom = new JSDOM(html, {runScripts:'outside-only'});
  dom.window.matchMedia = () => ({matches:true});
  dom.window.CSS = {escape: s => s};
  dom.window.eval(built ? fs.readFileSync(path.join(root,'dist/main.obfuscated.js'),'utf8') : `const SIGIL_CATALOG = ${JSON.stringify(catalog)};\n` + fs.readFileSync(path.join(root,'main.js'),'utf8'));
  return dom.window;
}
test('26 IDs únicos; desbloqueios completos; referências de ícones existentes', () => {
  assert.equal(catalog.sigils.length,26);
  assert.equal(new Set(catalog.sigils.map(s=>s.id)).size,26);
  for(const s of catalog.sigils) {
    assert.equal(s.costs.length,6); assert.equal(s.bonuses.length,6);
    assert.ok(s.costs[0]>0);
    if(s.icon) assert.ok(fs.existsSync(path.join(root,s.icon)));
  }
});
for (const built of [false,true]) test(`simulação, pendências, travamento e reset (${built?'dist':'fonte'})`, () => {
  const w=app(built), d=w.document;
  assert.equal(d.querySelectorAll('.sigil-card').length,26);
  assert.match(d.getElementById('st-ativos').textContent,/\/26/);
  const click = name => d.querySelector(`.sigil-card[data-nome="${name}"] .plus`).click();
  click('Mana'); click('Mana');
  assert.equal(d.getElementById('st-total').textContent,'75');
  assert.equal(d.getElementById('st-maximo').textContent,'A confirmar');
  assert.equal(d.getElementById('ss-resto').textContent,'A confirmar');
  assert.equal(d.querySelector('.pending-icon img').hasAttribute('src'),false);
  d.getElementById('btn-reset').click();
  click('Agressão');
  d.getElementById('btn-lock').click(); click('Agressão');
  assert.equal(d.getElementById('st-total').textContent,'125');
  assert.equal(d.getElementById('st-upgrade').textContent,'250');
  const minus = d.querySelector('.sigil-card[data-nome="Agressão"] .minus');
  minus.click(); minus.click();
  assert.equal(d.getElementById('st-upgrade').textContent,'0');
  d.getElementById('btn-reset').click();
  assert.equal(d.getElementById('st-total').textContent,'0');
  click('Naturalista');
  assert.match(d.getElementById('cost-tbody').textContent,/10%/);
  assert.match(d.getElementById('cost-tbody').textContent,/A confirmar/);
  d.getElementById('btn-reset').click(); click('Joalheiro');
  const cells=d.querySelectorAll('#cost-tbody tr:first-child td');
  assert.equal(cells[1].textContent,'1');
  w.close();
});
