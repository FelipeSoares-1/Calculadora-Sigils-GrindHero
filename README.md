# Grind Hero - Calculadora de Sigils (MII)

Calculadora e simulador de custos para os **Sigils** do projeto Grind Hero (MII). Ferramenta desenvolvida para a **Red Skull Guild**, com interface responsiva, UX aprimorada e design temático dark/gold.

## 🌟 Funcionalidades
- **Simulação em Tempo Real:** Clique e simule o gasto em moedas para subir os níveis dos Sigils de 1 a 5 (e nível MAX).
- **Indicadores Visuais:** Estrelas 3D reativas e cards interativos que destacam quais sigils estão selecionados.
- **Painel de Status Global:** Monitoramento automático de total gasto, sigils ativos e quanto falta para atingir o máximo (Custo Total e Sigils Ativos / 21).
- **Lista de Simulação Dinâmica:** Ranking automático dos sigils ativados ordenados por maior custo acumulado, ajudando a planejar gastos de forma inteligente.
- **UX Otimizada para Mobile e Desktop:** Botões integrados aos cards, visíveis através do evento Hover/Touch para melhor acessibilidade sem poluição visual.

## 🛠️ Tecnologias
- **Frontend:** HTML5, CSS3, JavaScript Vanilla (Nenhum framework externo)
- **Design System:** Baseado em variáveis CSS e flex/grid properties.
- **Segurança (Ofuscação):** Os custos nativos e a lógica de nivelamento (`TABELA`) foram separados em `main.js` e ofuscados localmente gerando `main.obfuscated.js` utilizando *javascript-obfuscator*, provendo uma barreira técnica contra raspagem (scraping) da economia e cópia.

## 🚀 Deploy e Uso

A aplicação é um front-end estático (Static Site). 

### Hospedagem (Hostinger)
Os arquivos necessários para rodar o site em produção (`sigils.redskull.space`) são:
- `index.html`
- `main.obfuscated.js`
- `estrela.webp` e logos
- Diretório `/sigils_icons/`

> **Nota de Segurança:** Em produção, o arquivo fonte limpo `main.js` ou o original com `TABELA` exposta nunca devem ser enviados para a pasta `public_html`. O arquivo `main.obfuscated.js` possui toda a inteligência e lógica cifrada.

---
*Desenvolvido em nome da Red Skull Guild.*
