# Grind Hero — Calculadora de Sigils

Prévia de atualização para 26 Sigils, baseada na build Steam 25728003.

## Estado dos dados

- Os preços por estrela dos 21 Sigils anteriores foram preservados e ainda precisam de validação nativa.
- Mana e Stamina: desbloqueio de 75 Old Coins, poder base de 2%.
- Joalheiro: desbloqueio de 185, poder base 1, não percentual.
- Negociador: desbloqueio de 200, poder base 10%.
- Reparador: desbloqueio de 135, poder base 10, não percentual.
- Os cinco novos permitem somente desbloqueio. Estrelas desconhecidas são null e aparecem como “A confirmar”. O custo máximo desconhecido não é exibido como zero.
- Naturalista: base corrigida de 5% para 10%; bônus seguintes a confirmar. Preços antigos preservados.
- Novos nomes em português, descrições, unidades numéricas e ícones oficiais aguardam conferência. Os novos cards usam texto provisório.

## Catálogo único

data/sigils.json contém custos, bônus, descrições, ícones, IDs e estados de validação. Origem: grind-hero-analysis, commit 6979599e5775e9fca176c920535c50d84b36e1c3, extracted/sharedassets2.assets.gameplay.json.

Dados estáticos do cliente não comprovam a configuração atual do servidor.

## Desenvolvimento

Requer Node.js 20 ou superior. Executar nesta ordem:

```sh
npm ci
npm run build
npm test
```

O build incorpora o catálogo ao JavaScript ofuscado e gera dist/. A ofuscação não torna os dados secretos. Não editar o bundle ou dist/ manualmente. A raiz e a distribuição carregam o mesmo bundle. Para visualizar, servir dist/ por um servidor HTTP estático.

Depois de concluir a validação, publicar o conteúdo de dist/ e atualizar a versão de cache do script no HTML. Esta prévia não deve ser publicada como atualização integralmente validada.

## Desktop

Sigil.py consome o mesmo catálogo e corrige a divergência de Drenar Stamina. A interface desktop mantém os 21 cards completos; os cinco novos dependem da adaptação visual e dos preços por estrela. Dependências: customtkinter e Pillow.

## Verificação

npm test verifica fonte e bundle: 26 cards, IDs únicos, imagens existentes, bloqueio de estrelas desconhecidas, totais, máximos pendentes, unidades, Naturalista, travamento da build e reset. Não substitui comparação com o cliente e revisão visual em dispositivos reais.
