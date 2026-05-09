    // ══════════════════════════════════════
    // DADOS
    // ══════════════════════════════════════
    const TABELA = {
      "Agressão": [125, 250, 312, 375, 437, 500],
      "Alquimista": [75, 150, 187, 225, 262, 300],
      "Apressado": [45, 90, 112, 135, 158, 180],
      "Artesão": [45, 90, 112, 135, 158, 180],
      "Atleta": [145, 290, 362, 435, 508, 580],
      "Drenar Mana": [225, 450, 562, 674, 787, 899],
      "Drenar Stamina": [125, 250, 312, 375, 437, 500],
      "Drenar Vida": [185, 370, 462, 555, 647, 740],
      "Especialista": [125, 250, 312, 375, 437, 500],
      "Esquiva": [125, 250, 312, 375, 437, 500],
      "Ganância": [125, 250, 312, 375, 437, 500],
      "Letalidade": [85, 170, 212, 255, 298, 340],
      "Naturalista": [150, 300, 375, 450, 525, 600],
      "Ousadia": [125, 250, 312, 375, 437, 500],
      "Pacifista": [125, 250, 312, 375, 437, 500],
      "Precisão": [105, 210, 262, 315, 368, 420],
      "Proteção": [75, 150, 187, 225, 262, 300],
      "Refletir": [125, 250, 312, 375, 437, 500],
      "Sorte": [125, 250, 312, 375, 437, 500],
      "Velocidade": [125, 250, 312, 375, 437, 500],
      "Vida": [75, 150, 187, 225, 262, 300],
    };

    const DESC = {
      "Agressão": "Causa um aumento nos ataques desferidos, tanto físico quanto mágico.",
      "Alquimista": "Aumenta a potencia de suas porções, fazendo com que recuperem mais vida, mana e estamina do que o normal.",
      "Apressado": "Reduz o tempo de cooldown (para usar habilidades de mesma categoria) de suas magias e itens, fazendo com que sejam lançadas mais rapidamente.",
      "Artesão": "Aumenta a quantidade de itens produzidos em todas as magias de criaçao, como por exemplo, magias de criaçao de flechas.",
      "Atleta": "Acelera a evoluçao de seus atributos(corpo a corpo, magia, distância, escudaria ou adestramento), fazendo com que eles subam de nível mais rapidamente.",
      "Drenar Mana": "Seus ataques drenam uma quantia de pontos de mana de seu oponente para seus próprios pontos de mana.",
      "Drenar Stamina": "Seus ataques drenam uma quantia de pontos de stamina de seu oponente para seus próprios pontos de stamina.",
      "Drenar Vida": "Seus ataques drenam uma quantia de pontos de vida de seu oponente para seus próprios pontos de vida.",
      "Especialista": "Acelera o ganho de experiência para evolução de seus itens, fazendo com que eles subam de nível mais rapidamente.",
      "Esquiva": "Obtém a chance de se esquivar de ataques inimigos.",
      "Ganância": "A quantidade de loot coletado será maior.",
      "Letalidade": "Aumenta o total de dano causado por seus ataques críticos.",
      "Naturalista": "Reduz o tempo de recuperação natural de seus pontos de vida, mana e stamina, fazendo que se regenere mais rapidamente.",
      "Ousadia": "Aumenta a chance de provocar monstros em seus ataques. O valor é adicionado diretamente na habilidade no momento do ataque, por exemplo, se a habilidade possuir uma chance de provocar de 10% e o seu sigil tiver 2%, no total serão 12% de chance.",
      "Pacifista": "Reduz a chance de provocar monstros em seus ataques. O valor é removido diretamente na habilidade no momento do ataque, por exemplo, se a habilidade possuir uma chance de provocar de 10% e o seu sigil tiver 2%, no total serão 8% de chance.",
      "Precisão": "Aumenta a chance de acerto crítico e precisão de disparos.",
      "Proteção": "Causa uma redução no dano recebido, tanto físico quanto mágico.",
      "Refletir": "Sempre que receber um ataque, parte do dano será devolvido para aquele que desferiu o golpe.",
      "Sorte": "Sua chance será maior para encontrar itens e loots em monstros.",
      "Velocidade": "Causa um aumento na velocidade de movimento do personagem.",
      "Vida": "Causa um aumento nos pontos de vida do personagem."
    };

    // custo total máximo de cada sigil (soma de todos os 6 níveis)
    function maxCost(nome) { return TABELA[nome].reduce((a, b) => a + b, 0); }

    // ══════════════════════════════════════
    // ESTADO  (nivel: -1 = inativo, 0-5 = ativo)
    // ══════════════════════════════════════
    const state = {};
    const baseState = {};
    let isLocked = false;
    let selectedName = null;

    const fmt = n => n.toLocaleString('pt-BR');

    // ══════════════════════════════════════
    // BUILD DO GRID
    // ══════════════════════════════════════
    function buildGrid() {
      const grid = document.getElementById('grid');
      Object.keys(TABELA).sort().forEach(nome => {
        state[nome] = -1;
        baseState[nome] = -1;
        const card = document.createElement('div');
        card.className = 'sigil-card';
        card.dataset.nome = nome;

        const img = document.createElement('img');
        img.className = 'card-img';
        img.src = `sigils_icons/${nome.replace(/ /g, '_')}.png`;
        img.alt = nome; img.draggable = false;

        const ov = document.createElement('div'); ov.className = 'card-overlay';
        const sws = document.createElement('div'); sws.className = 'card-stars';
        for (let i = 0; i < 5; i++) { const s = document.createElement('div'); s.className = 'star'; sws.appendChild(s); }
        const cost = document.createElement('div'); cost.className = 'card-cost';

        // Botões de mais e menos interativos
        const btnControls = document.createElement('div');
        btnControls.className = 'card-controls';

        const btnMinus = document.createElement('button');
        btnMinus.className = 'btn-control minus';
        btnMinus.innerHTML = '−';
        btnMinus.title = "Diminuir Nível";
        btnMinus.addEventListener('click', (e) => { e.stopPropagation(); levelDown(nome); });

        const btnPlus = document.createElement('button');
        btnPlus.className = 'btn-control plus';
        btnPlus.innerHTML = '+';
        btnPlus.title = "Aumentar Nível";
        btnPlus.addEventListener('click', (e) => { e.stopPropagation(); levelUp(nome); });

        btnControls.append(btnMinus, btnPlus);

        card.append(img, ov, sws, cost, btnControls);
        // No PC (mouse), o clique esquerdo sobe o nível. No celular (touch), apenas seleciona.
        card.addEventListener('click', e => { 
          e.preventDefault(); 
          if (window.matchMedia("(pointer: fine)").matches) {
            levelUp(nome);
          } else {
            showPanel(nome); 
          }
        });
        // Mantemos o clique direito como atalho para descer o nível (opcional, mais para desktop)
        card.addEventListener('contextmenu', e => { e.preventDefault(); levelDown(nome); });
        grid.appendChild(card);
        renderCard(nome);
      });
    }

    function renderCard(nome) {
      const card = document.querySelector(`.sigil-card[data-nome="${CSS.escape(nome)}"]`);
      if (!card) return;
      const n = state[nome], p = TABELA[nome];
      card.classList.toggle('active', n >= 0);
      card.querySelectorAll('.star').forEach((s, i) => s.classList.toggle('on', i < n));
      card.querySelector('.card-cost').textContent = n < 5 ? fmt(p[n + 1]) : 'MAX';
      
      const btnMinus = card.querySelector('.btn-control.minus');
      if (btnMinus) {
        const locked = isLocked && n <= baseState[nome];
        btnMinus.style.opacity = locked ? '0.3' : '1';
        btnMinus.style.cursor = locked ? 'not-allowed' : 'pointer';
      }
    }

    // ══════════════════════════════════════
    // LÓGICA
    // ══════════════════════════════════════
    function levelUp(nome) { if (state[nome] < 5) state[nome]++; after(nome); }
    function levelDown(nome) { 
      if (state[nome] >= 0) {
        if (isLocked && state[nome] <= baseState[nome]) return; // Impede descer do nível base
        state[nome]--; 
        after(nome); 
      }
    }

    function after(nome) {
      renderCard(nome);
      updateStats();
      updateSimList();
      showPanel(nome);
    }

    // ══════════════════════════════════════
    // STATS BAR
    // ══════════════════════════════════════
    function updateStats() {
      let total = 0, ativos = 0, maxTotal = 0, baseTotal = 0;
      Object.entries(state).forEach(([nome, n]) => {
        if (n >= 0) {
          ativos++;
          const p = TABELA[nome];
          const gasto = p.slice(0, n + 1).reduce((a, b) => a + b, 0);
          total += gasto;
          maxTotal += maxCost(nome);
        }
        if (isLocked && baseState[nome] >= 0) {
          const p = TABELA[nome];
          const gastoBase = p.slice(0, baseState[nome] + 1).reduce((a, b) => a + b, 0);
          baseTotal += gastoBase;
        }
      });
      
      const cardUp = document.getElementById('card-upgrade');
      if (isLocked) {
        document.getElementById('st-total').textContent = fmt(baseTotal);
        document.getElementById('st-total-sub').textContent = "na build travada";
        document.getElementById('st-upgrade').textContent = fmt(total - baseTotal);
        cardUp.style.display = 'flex';
        cardUp.style.flexDirection = 'column';
      } else {
        document.getElementById('st-total').textContent = fmt(total);
        document.getElementById('st-total-sub').textContent = "old coins totais";
        cardUp.style.display = 'none';
      }
      
      document.getElementById('st-ativos').innerHTML =
        `${ativos} <span style="font-size:1.6rem;color:var(--muted)">/21</span>`;
      document.getElementById('st-maximo').textContent = ativos > 0 ? fmt(maxTotal) : '0';
    }

    // ══════════════════════════════════════
    // LISTA DE SIMULAÇÃO
    // ══════════════════════════════════════
    function updateSimList() {
      const list = document.getElementById('sim-list');
      const empty = document.getElementById('sim-empty');
      list.innerHTML = '';

      const ativos = Object.entries(state)
        .filter(([, n]) => n >= 0)
        .sort((a, b) => {
          // ordena por custo acumulado descendente
          const ca = TABELA[a[0]].slice(0, a[1] + 1).reduce((x, y) => x + y, 0);
          const cb = TABELA[b[0]].slice(0, b[1] + 1).reduce((x, y) => x + y, 0);
          return cb - ca;
        });

      if (ativos.length === 0) {
        empty.style.display = 'block'; return;
      }
      empty.style.display = 'none';

      ativos.forEach(([nome, n]) => {
        const p = TABELA[nome];
        const gasto = p.slice(0, n + 1).reduce((a, b) => a + b, 0);

        const row = document.createElement('div'); row.className = 'sim-row';

        const img = document.createElement('div');
        img.className = 'sim-row-img';
        img.style.backgroundImage = `url('sigils_icons/${nome.replace(/ /g, '_')}.png')`;
        img.title = nome;

        const info = document.createElement('div'); info.className = 'sim-row-info';
        info.innerHTML = `
      <div class="sim-row-name">${nome}</div>
      <div class="sim-row-stars">
        ${Array.from({ length: 5 }, (_, i) => `<div class="sim-star${i < n ? ' on' : ''}"></div>`).join('')}
      </div>`;

        const right = document.createElement('div');
        right.style.cssText = 'text-align:right;flex-shrink:0';
        right.innerHTML = `
      <div class="sim-row-cost">${fmt(gasto)}</div>
      <div class="sim-row-lvl">${n === 0 ? 'Desbloqueio' : 'Nv ' + n}${n === 5 ? ' MAX' : ''}</div>`;

        row.append(img, info, right);
        // clicar na linha do sim abre o painel daquele sigil
        row.addEventListener('click', () => showPanel(nome));
        list.appendChild(row);
      });
    }

    // ══════════════════════════════════════
    // PAINEL LATERAL
    // ══════════════════════════════════════
    function showPanel(nome) {
      selectedName = nome;
      const n = state[nome], p = TABELA[nome];

      document.querySelectorAll('.sigil-card')
        .forEach(c => c.classList.toggle('focused', c.dataset.nome === nome));

      document.getElementById('sel-name').textContent = nome.toUpperCase();
      document.getElementById('sel-desc').textContent = DESC[nome] || '';

      const statsEl = document.getElementById('sigil-stats');
      const progEl = document.getElementById('level-prog');
      const tableEl = document.getElementById('sec-table');

      if (n >= 0) {
        const gasto = p.slice(0, n + 1).reduce((a, b) => a + b, 0);
        const maxC = maxCost(nome);
        const resto = maxC - gasto;
        const proxCu = n < 5 ? fmt(p[n + 1]) : '—';
        const pct = Math.round((gasto / maxC) * 100);

        document.getElementById('ss-nivel').textContent = n === 0 ? 'Desbloqueio' : `${n}${n === 5 ? ' MAX' : ''}`;
        document.getElementById('ss-gasto').textContent = fmt(gasto);
        document.getElementById('ss-prox').textContent = proxCu;
        document.getElementById('ss-resto').textContent = fmt(resto);
        statsEl.style.display = 'grid';

        document.getElementById('lp-pct').textContent = `${pct}%`;
        document.getElementById('lp-fill').style.width = `${pct}%`;
        progEl.style.display = 'block';
      } else {
        statsEl.style.display = 'none';
        progEl.style.display = 'none';
      }

      // tabela de custos por nível
      // nivel 0 = desbloqueio (sem estrela), 1-5 = 1 a 5 estrelas
      const tbody = document.getElementById('cost-tbody');
      tbody.innerHTML = '';
      let acc = 0;
      p.forEach((custo, i) => {
        acc += custo;
        const tr = document.createElement('tr');
        if (i < n) tr.className = 'r-past';
        else if (i === n) tr.className = 'r-current';
        else tr.className = 'r-future';

        // coluna de nível: i=0 é o unlock (sem estrela), i=1..5 mostram 1..5 estrelas
        let nvCol;
        if (i === 0) {
          nvCol = `<span style="font-size:1rem;color:var(--dim);letter-spacing:1px">UNLOCK</span>`;
        } else {
          const stars = Array.from({ length: 5 }, (_, s) =>
            `<span style="color:${s < i ? 'var(--gold)' : 'var(--mid)'}">★</span>`
          ).join('');
          nvCol = `<span style="font-size:1.05rem;letter-spacing:0">${stars}</span>`;
        }

        const maxLabel = i === 5 ? `<span style="font-size:0.9rem;color:var(--red);margin-left:3px">MAX</span>` : '';
        tr.innerHTML = `<td>${nvCol}${maxLabel}</td><td>${fmt(custo)}</td><td>${fmt(acc)}</td>`;
        tbody.appendChild(tr);
      });
      tableEl.style.display = 'block';
    }

    // ══════════════════════════════════════
    // RESET & LOCK
    // ══════════════════════════════════════
    document.getElementById('btn-lock').addEventListener('click', () => {
      isLocked = !isLocked;
      const btnLock = document.getElementById('btn-lock');
      if (isLocked) {
        Object.keys(state).forEach(k => baseState[k] = state[k]);
        btnLock.innerHTML = '🔓 Destravar Build';
        btnLock.style.color = '#fff';
        btnLock.style.borderColor = '#fff';
        btnLock.style.background = 'rgba(255, 255, 255, 0.15)';
      } else {
        Object.keys(state).forEach(k => baseState[k] = -1);
        btnLock.innerHTML = '🔒 Travar Build Atual';
        btnLock.style.color = 'var(--gold)';
        btnLock.style.borderColor = 'var(--gold)';
        btnLock.style.background = 'rgba(212, 175, 55, 0.15)';
      }
      Object.keys(state).forEach(k => renderCard(k));
      updateStats();
    });

    document.getElementById('btn-reset').addEventListener('click', () => {
      isLocked = false;
      const btnLock = document.getElementById('btn-lock');
      btnLock.innerHTML = '🔒 Travar Build Atual';
      btnLock.style.color = 'var(--gold)';
      btnLock.style.borderColor = 'var(--gold)';
      btnLock.style.background = 'rgba(212, 175, 55, 0.15)';
      
      Object.keys(state).forEach(k => { state[k] = -1; baseState[k] = -1; renderCard(k); });
      updateStats();
      updateSimList();
      document.getElementById('sel-name').textContent = 'Selecione um Sigil';
      document.getElementById('sel-desc').textContent = 'Clique em um ícone para ver os detalhes e bônus de cada nível.';
      document.getElementById('sigil-stats').style.display = 'none';
      document.getElementById('level-prog').style.display = 'none';
      document.getElementById('sec-table').style.display = 'none';
      document.getElementById('cost-tbody').innerHTML = '';
      document.querySelectorAll('.sigil-card').forEach(c => c.classList.remove('focused'));
      selectedName = null;
    });

    // ══════════════════════════════════════
    // INIT
    // ══════════════════════════════════════
    buildGrid();
