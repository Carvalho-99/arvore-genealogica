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
4. **Authentication** → Settings → Authorized domains → adicione `<usuario>.github.io` depois do deploy.
5. Copie a config do app web para `.env` (veja `.env.example`).

## Deploy

Push para `main` dispara o workflow `.github/workflows/deploy.yml`, que builda e publica no GitHub Pages. As 6 variáveis `VITE_FIREBASE_*` precisam estar cadastradas em Settings → Secrets and variables → Actions do repositório.
