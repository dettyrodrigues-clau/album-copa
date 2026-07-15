# 🏆 Álbum da Copa — Controle de Figurinhas

App PWA em **React + Vite** para gerenciar suas figurinhas do Álbum da Copa do Mundo. Funciona no navegador e pode ser **instalado como aplicativo no celular** (Android e iOS).

## ✨ Funcionalidades

- 📋 **Cadastro do álbum** com numeração automática (001–N)
- 🎯 **Status** por figurinha: Falta · Já tenho · Repetida · Colada
- 🔎 **Busca rápida** por número, nome, país ou categoria — com resposta visual ("Você já tem" / "Está faltando" / "Tem repetida")
- 📸 **Análise por foto** da página do álbum: detecta automaticamente espaços vazios e figurinhas coladas, com confirmação manual
- 📄 **Cadastro de páginas** com intervalo e grade (linhas × colunas)
- 📕 **Lista de faltantes** com export PDF / imagem PNG / texto / WhatsApp
- 📗 **Lista de repetidas** com quantidade ajustável
- 🔁 **Trocas** — compare suas faltantes/repetidas com as de amigos
- 📊 **Dashboard** com porcentagem completa, gráfico de progresso e atalhos
- 💾 **Salvamento local** (localStorage) com backup/restauração em JSON
- 📱 **PWA**: "Adicionar à tela inicial" para usar como app, com cache offline

## 🚀 Como rodar

```bash
npm install
npm run dev      # desenvolvimento (http://localhost:5173)
npm run build    # gera a pasta dist/ para produção
npm run preview  # preview da build local
```

## 🌐 Deploy

### Netlify
1. Suba o projeto para um repositório Git (GitHub/GitLab).
2. No Netlify: **Add new site → Import from Git**.
3. Build command: `npm run build` · Publish directory: `dist`.
4. O arquivo `netlify.toml` já está configurado.

### Vercel
1. Suba o projeto para um repositório Git.
2. No Vercel: **Add new → Project** e importe o repositório.
3. Vercel detecta automaticamente (Vite).
4. O arquivo `vercel.json` já está configurado.

### Outros (GitHub Pages, S3, etc.)
- Rode `npm run build`. Publique o conteúdo da pasta `dist/`.
- O app usa **HashRouter**, então funciona em qualquer host estático sem precisar configurar redirecionamentos.

## 📱 Instalar no celular

Depois de abrir a URL do app:

- **Android (Chrome/Edge):** menu ⋮ → "Instalar aplicativo" / "Adicionar à tela inicial".
- **iPhone (Safari):** botão Compartilhar (↑) → "Adicionar à Tela de Início".

O app abre em tela cheia, funciona offline e o ícone fica na home como qualquer outro app.

## 🗂️ Estrutura

```
album-copa/
├── public/
│   ├── manifest.webmanifest
│   ├── sw.js                # service worker (cache offline)
│   ├── icon-192.svg
│   ├── icon-512.svg
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── BottomNav.jsx
│   │   ├── StickerTile.jsx
│   │   ├── StickerDetailSheet.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── ProgressRing.jsx
│   │   └── Toast.jsx
│   ├── pages/
│   │   ├── Onboarding.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Stickers.jsx
│   │   ├── SearchPage.jsx
│   │   ├── PhotoScan.jsx
│   │   ├── Pages.jsx
│   │   ├── Missing.jsx
│   │   ├── Duplicates.jsx
│   │   ├── Trades.jsx
│   │   └── Settings.jsx
│   ├── store/
│   │   └── useStore.js     # Zustand store (estado + persistência)
│   ├── utils/
│   │   ├── storage.js
│   │   ├── export.js       # PDF / PNG / texto / WhatsApp
│   │   └── photoAnalysis.js # análise de imagem (variância + saturação)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
├── vite.config.js
├── netlify.toml
└── vercel.json
```

## 🎨 Tecnologias

- **React 18** + **Vite 5**
- **Tailwind CSS 3** (paleta inspirada nas cores da Copa: verde, amarelo, azul e branco)
- **Zustand** (estado leve, com persistência em localStorage)
- **React Router** (HashRouter para deploy estático)
- **Lucide React** (ícones)
- **jsPDF** (export PDF)
- **Canvas API** nativa (análise de foto + export de imagem)

## 🔬 Sobre a análise por foto

A detecção usa Canvas para amostrar cada célula da página com base na **variância de brilho** e **saturação de cor**. Espaços vazios tendem a ter brilho uniforme e cor neutra; figurinhas coladas têm imagens coloridas e variadas.

A análise não é perfeita — por isso o app **sempre mostra o resultado para confirmação manual**, com toque na célula para corrigir.

## 💡 Dicas

- Use boas luzes ao tirar foto da página, com o álbum aberto e plano.
- Cadastre as páginas com a grade certa (linhas × colunas) — isso é a chave para a detecção funcionar bem.
- Faça backups regulares pelo menu de Configurações.

---

Feito com 💚💛💙 para quem ama colecionar figurinhas.
