# Árvore da Família Mostafá

App pessoal de árvore genealógica, mobile-first. Duas partes:

- **Árvore** — cadastro manual de pessoas e relações (pais, cônjuge, filhos, irmãos), guardado no Firestore.
- **Pesquisa** — busca pública sobre um sobrenome (origem, pessoas notáveis) via Wikidata/WikiTree, só por curiosidade — não é a árvore real.

## Rodando localmente

```bash
npm install
cp .env.example .env   # preencha com as chaves do seu projeto Firebase
npm run dev
```

## Configuração do Firebase (uma vez só)

1. Crie um projeto em [console.firebase.google.com](https://console.firebase.google.com).
2. **Firestore Database** → criar banco → cole o conteúdo de `firestore.rules` na aba Rules.
3. **Authentication** → Sign-in method → ative **Anônimo**.
4. **Authentication** → Settings → Authorized domains → domínios do Firebase Hosting (`<project-id>.web.app` / `.firebaseapp.com`) já vêm autorizados por padrão.
5. Copie a config do app web para `.env` (veja `.env.example`).

## Deploy

Hospedado no **Firebase Hosting** (projeto `arvore-genealogica-64443`). Push para `main` dispara o workflow `.github/workflows/firebase-hosting-deploy.yml`, que builda e publica. Precisa estar cadastrado em Settings → Secrets and variables → Actions do repositório:

- as 6 variáveis `VITE_FIREBASE_*`;
- `FIREBASE_SERVICE_ACCOUNT_ARVORE_GENEALOGICA_64443` — chave de conta de serviço com permissão de Firebase Hosting Admin no projeto (gerada em Configurações do projeto → Contas de serviço, no Console do Firebase).

Pra publicar manualmente do seu computador: `npm run build && firebase deploy --only hosting` (com o Firebase CLI logado numa conta com acesso ao projeto).
