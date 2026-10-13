# Grind Hero — Calculadora de Sigils

Calculadora e simulador da Red Skull Guild com 26 Sigils, do desbloqueio a cinco estrelas. Interface web responsiva e versão Python consumindo o mesmo catálogo.

## Dados oficiais

Nomes em português, descrições, ícones, preços e bônus de todas as etapas foram importados da [wiki oficial](https://grindhero.online/pt/wiki/sigils), consultada em 13/10/2026. O [catálogo público](https://grindhero.online/game-data/catalog.json) fornece rankProgression diretamente; a calculadora não extrapola fórmulas ou arredondamentos.

- data/sigils.json: catálogo único usado pela aplicação; registra origem, hash do catálogo consultado e manifesto oficial.
- data/official-sigils-source.json: recorte dos 26 Sigils oficiais para conferir a importação e os testes.
- data/cost-changes.json: diferenças de preço em relação à prévia anterior.
- sigils_icons/official/: 26 sprites obtidos da wiki. As artes pertencem aos respectivos titulares do jogo.

O repositório grind-hero-analysis (commit 6979599e5775e9fca176c920535c50d84b36e1c3, build 25728003) foi usado como referência inicial. Os valores completos são os publicados pela wiki; não dependem de uma instalação local do jogo.

## Alterações

Inclui Mana, Estamina, Joalheiro, Negociador e Reparador com todas as estrelas. Naturalista passa a 10%, 20%, 25%, 30%, 35% e 40%. Joalheiro e Reparador seguem o formato numérico da fonte oficial, sem porcentagem automática. Corrige arredondamentos de custo de 14 Sigils antigos, além de completar as cinco tabelas novas.

## Desenvolvimento

Requer Node.js 20 ou superior. Executar nesta ordem:

```sh
npm ci
npm run build
npm test
```

O build incorpora o JSON ao JavaScript ofuscado e gera dist/. A ofuscação não torna os dados secretos. Não editar main.obfuscated.js nem dist/ manualmente. O HTML da raiz e da distribuição usa o mesmo bundle.

Para visualizar: python -m http.server 8765 --directory dist. Abrir http://localhost:8765.

Para publicar: enviar o conteúdo de dist/ à hospedagem estática. Nenhuma requisição ao catálogo externo é necessária durante o uso. Uma atualização posterior deve revisar o catálogo oficial, substituir os dados e sprites necessários, atualizar a versão de cache do script no HTML e regenerar o build.

## Desktop

Sigil.py usa os mesmos 26 registros e compõe os cards com os sprites oficiais, preservando suas proporções. Dependências: customtkinter e Pillow. Executar python Sigil.py. O código foi verificado por compilação; a sessão gráfica Tk não foi executada nesta atualização.

## Validação

npm test compara todos os nomes, descrições, preços, bônus e unidades com o snapshot oficial. Também verifica imagens locais, desbloqueio, limite de cinco estrelas, custo máximo de todos os 26 Sigils, simulação travada e reset, tanto no fonte como no bundle final. Interface web revisada visualmente no navegador em desktop e em viewport de 390 x 844.
