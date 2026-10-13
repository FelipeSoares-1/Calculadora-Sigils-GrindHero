# Histórico de alterações

## 2026-10-13 — Atualização dos 26 Sigils

Implementação: `387835b3f42b9a93ec8cba0d46501408f278f747`.
PR: [#1 — Atualiza 26 Sigils com custos, bônus e ícones da wiki oficial](https://github.com/FelipeSoares-1/Calculadora-Sigils-GrindHero/pull/1).

### Alterações realizadas

- Ampliação de 21 para 26 Sigils, incluindo Mana, Estamina, Joalheiro, Negociador e Reparador.
- Importação das 156 etapas de custo e bônus, do desbloqueio a cinco estrelas, diretamente de `rankProgression` do catálogo oficial.
- Atualização dos nomes e descrições em português e inclusão dos 26 ícones oficiais locais.
- Correção do Naturalista para 10%, 20%, 25%, 30%, 35% e 40%.
- Correção de 14 tabelas antigas de custo; diferenças registradas em `data/cost-changes.json`.
- Exibição numérica dos bônus de Joalheiro e Reparador, conforme a fonte, sem acrescentar porcentagem automaticamente.
- Centralização dos dados em `data/sigils.json`, compartilhado pela interface web e pela versão Python.
- Composição dos cards com sprites separados de nomes, estrelas e custos, preservando a proporção das imagens.
- Contagem dinâmica dos Sigils e sincronização do bundle ofuscado com a distribuição em `dist/`.
- Inclusão de build reproduzível, testes automatizados, snapshot dos Sigils oficiais e metadados de origem.

### Fontes

- [Wiki oficial — Sigilos](https://grindhero.online/pt/wiki/sigils), consultada em 13/10/2026.
- [Catálogo público oficial](https://grindhero.online/game-data/catalog.json); manifesto e hash preservados no catálogo local.
- [Repositório de análise](https://github.com/FelipeSoares-1/grind-hero-analysis/tree/6979599e5775e9fca176c920535c50d84b36e1c3), utilizado como referência inicial.

### Validações realizadas

- `npm run build`: distribuição gerada com sucesso.
- `npm test`: três testes aprovados, cobrindo catálogo, fonte e bundle final. Inclui correspondência com o snapshot oficial, limites de nível, totais dos 26 Sigils, travamento, reset e unidades dos bônus.
- Integridade dos 26 PNGs verificada com Pillow.
- `python -m py_compile Sigil.py`: compilação aprovada.
- `git diff --check`: sem erros de whitespace.
- Interface web conferida visualmente no navegador em desktop e viewport de 390 × 844.

### Estado de entrega

Implementação enviada para a branch `codex/atualizacao-sigils-26`; PR pronto para revisão. Não foi realizado merge nem publicação em produção. Não houve instalação local do jogo. A execução gráfica Python/Tk ainda não foi validada; sua verificação nesta atualização limitou-se à compilação.
