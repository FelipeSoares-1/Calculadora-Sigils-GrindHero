const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const root = path.join(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root,'data/sigils.json'),'utf8'));
const official = JSON.parse(fs.readFileSync(path.join(root,'data/official-sigils-source.json'),'utf8'));
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
    const source = official.sigils.find(o=>o.id===s.id);
    assert.deepEqual(s.costs, source.rankProgression.map(r=>r.price));
    assert.deepEqual(s.bonuses, source.rankProgression.map(r=>r.power));
    assert.equal(s.name, source.translations.find(t=>t.locale==='pt').name);
    assert.equal(s.description, source.descriptionTranslations.find(t=>t.locale==='pt').name);
    assert.equal(s.isPercentage, source.powerIsPercentage);
  }
});
for (const built of [false,true]) test(`simulação completa, travamento e reset (${built?'dist':'fonte'})`, () => {
  const w=app(built), d=w.document;
  assert.equal(d.querySelectorAll('.sigil-card').length,26);
  assert.match(d.getElementById('st-ativos').textContent,/\/26/);
  const click = name => d.querySelector(`.sigil-card[data-nome="${name}"] .plus`).click();
  click('Mana'); click('Mana');
  assert.equal(d.getElementById('st-total').textContent,'225');
  assert.equal(d.getElementById('st-maximo').textContent,'1.200');
  assert.equal(d.getElementById('ss-resto').textContent,'975');
  assert.equal(d.querySelectorAll('.pending-icon').length,0);
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
  assert.doesNotMatch(d.getElementById('cost-tbody').textContent,/A confirmar/);
  assert.match(d.getElementById('cost-tbody').textContent,/40%/);
  d.getElementById('btn-reset').click(); click('Joalheiro');
  const cells=d.querySelectorAll('#cost-tbody tr:first-child td');
  assert.equal(cells[1].textContent,'1');
  for (let i=0;i<5;i++) click('Joalheiro');
  assert.equal(d.querySelector('#cost-tbody tr:last-child td:nth-child(2)').textContent,'6');
  d.getElementById('btn-reset').click();
  for (const s of catalog.sigils) for(let i=0;i<7;i++) click(s.name);
  const total=catalog.sigils.reduce((sum,s)=>sum+s.costs.reduce((a,b)=>a+b,0),0);
  assert.equal(d.getElementById('st-total').textContent,total.toLocaleString('pt-BR'));
  assert.equal(d.getElementById('st-maximo').textContent,total.toLocaleString('pt-BR'));
  assert.match(d.getElementById('st-ativos').textContent,/26.*\/26/);
  assert.equal(d.querySelectorAll('.sigil-card.active').length,26);
  w.close();
});
