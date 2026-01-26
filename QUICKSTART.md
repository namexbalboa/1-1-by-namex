# 🚀 Quick Start - Deploy em 5 Passos

Coloque sua aplicação no ar em menos de 20 minutos.

---

## 📋 Pré-requisitos (5 min)

### ✅ 1. Push para GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### ✅ 2. Gerar Secrets

```bash
node backend/scripts/generate-secrets.js
```

💾 **Salve os secrets gerados** em um gerenciador de senhas.

### ✅ 3. Criar Contas (Todas Gratuitas)

- [ ] **Railway**: https://railway.app (login com GitHub)
- [ ] **Cloudflare**: https://dash.cloudflare.com/sign-up
- [ ] **MongoDB Atlas**: https://cloud.mongodb.com
- [ ] **Firebase**: https://console.firebase.google.com (se ainda não tem)

---

## 🗃️ Passo 1: MongoDB Atlas (3 min)

1. **Criar Cluster**:
   - New Project > Build a Database
   - Free (M0) > AWS > Região mais próxima
   - Create

2. **Criar Usuário**:
   - Security > Database Access > Add New User
   - Username: `admin`
   - Password: (gerar senha forte) 💾 Salvar
   - Database User Privileges: Read and write to any database

3. **Whitelist IPs**:
   - Security > Network Access > Add IP Address
   - Allow Access from Anywhere: `0.0.0.0/0`

4. **Connection String**:
   - Databases > Connect > Connect your application
   - Copiar: `mongodb+srv://admin:PASSWORD@cluster.mongodb.net/?retryWrites=true&w=majority`
   - Substituir `PASSWORD` pela senha
   - Adicionar nome do banco: `.../one-on-one-db?retryWrites...`

💾 **Salvar Connection String**

---

## 🔥 Passo 2: Firebase (3 min)

1. **Abrir Console**: https://console.firebase.google.com
2. **Project Settings** (ícone engrenagem)
3. **Service Accounts** tab
4. **Generate new private key** (baixa JSON)

5. **Extrair do JSON**:
```json
{
  "project_id": "...",           → FIREBASE_PROJECT_ID
  "private_key": "-----BEGIN...", → FIREBASE_PRIVATE_KEY (com \n)
  "client_email": "...@..."      → FIREBASE_CLIENT_EMAIL
}
```

💾 **Salvar credenciais**

6. **Config Web** (General tab):
   - Copiar todas as chaves que começam com `VITE_FIREBASE_*`

💾 **Salvar config web**

---

## 🚂 Passo 3: Deploy Backend - Railway (5 min)

1. **Criar Projeto**:
   - https://railway.app > New Project
   - Deploy from GitHub repo
   - Selecionar: `1-1-by-namex`

2. **Configurar**:
   - Settings > Root Directory: `backend`
   - Settings > Start Command: `npm run start:prod`
   - Settings > Build Command: `npm install && npm run build`

3. **Adicionar Variáveis**:
   - Variables > RAW Editor > Colar:

```env
NODE_ENV=production
DATABASE_URL=mongodb+srv://admin:PASSWORD@cluster.mongodb.net/one-on-one-db?retryWrites=true&w=majority
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase@projeto.iam.gserviceaccount.com
JWT_SECRET=cole-o-secret-gerado-no-passo-2
JWT_EXPIRATION=7d
CORS_ORIGIN=https://TEMPORARIO-aguarde-passo-4.pages.dev
FRONTEND_URL=https://TEMPORARIO-aguarde-passo-4.pages.dev
```

4. **Save Variables** → Railway faz deploy automático (2-3 min)

5. **Copiar URL**:
   - Settings > Domains > Generate Domain
   - Copiar: `https://1-1-by-namex-production.up.railway.app`

💾 **Salvar URL do Backend**

6. **Testar**:
```bash
curl https://sua-url.railway.app/api/health
```

Deve retornar: `{"status":"ok",...}`

---

## ☁️ Passo 4: Deploy Frontend - Cloudflare Pages (5 min)

1. **Criar Projeto**:
   - https://dash.cloudflare.com
   - Workers & Pages > Create application > Pages
   - Connect to Git > Selecionar repositório

2. **Configurar Build**:
```
Project name: 1-1-by-namex-frontend
Production branch: main
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: frontend
```

3. **Adicionar Variáveis**:
   - Continue to project > Settings > Environment variables
   - Production:

```env
VITE_API_URL=https://sua-url.railway.app/api
VITE_FIREBASE_API_KEY=cole-do-passo-2
VITE_FIREBASE_AUTH_DOMAIN=projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=projeto-id
VITE_FIREBASE_STORAGE_BUCKET=projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456
VITE_FIREBASE_APP_ID=1:123:web:abc
```

4. **Save and Deploy** → Cloudflare faz build (2-3 min)

5. **Copiar URL**:
   - Anote: `https://1-1-by-namex.pages.dev`

💾 **Salvar URL do Frontend**

---

## 🔄 Passo 5: Atualizar CORS (1 min)

1. **Voltar ao Railway**
2. **Variables** > Editar:
   - `CORS_ORIGIN` = `https://1-1-by-namex.pages.dev` (sua URL real)
   - `FRONTEND_URL` = `https://1-1-by-namex.pages.dev` (sua URL real)

3. **Save** → Railway redeploy automático (1 min)

---

## ✅ Testar Aplicação (2 min)

1. **Abrir frontend**: https://1-1-by-namex.pages.dev

2. **Verificar console** (F12):
   - Sem erros de CORS ✅
   - Sem erros de conexão ✅

3. **Testar funcionalidades**:
   - [ ] Login funciona
   - [ ] Registro funciona
   - [ ] Dashboard carrega
   - [ ] Tema (light/dark) funciona
   - [ ] Troca de idioma funciona

---

## 🎉 Pronto!

Sua aplicação está no ar! 🚀

**URLs**:
- Frontend: https://1-1-by-namex.pages.dev
- Backend: https://1-1-by-namex.up.railway.app/api
- Health Check: https://1-1-by-namex.up.railway.app/api/health

---

## 🔄 Próximos Deploys (Automático)

```bash
git add .
git commit -m "Nova feature"
git push origin main
```

Railway e Cloudflare fazem deploy automático! ⚡

---

## 🆘 Problemas?

### Backend não inicia
```bash
# Ver logs
# Railway Dashboard > Logs
```

Verificar:
- [ ] Todas variáveis configuradas
- [ ] `DATABASE_URL` correto
- [ ] `FIREBASE_PRIVATE_KEY` tem `\n`

### Frontend não conecta
Verificar:
- [ ] `VITE_API_URL` correto (com `/api` no final)
- [ ] `CORS_ORIGIN` no backend tem URL do frontend
- [ ] Backend health check funciona

### Erro MongoDB
- [ ] IP whitelist: `0.0.0.0/0`
- [ ] Senha no connection string está correta
- [ ] Nome do database está na URL

---

## 📚 Documentação Completa

- **Este guia**: Para deploy rápido
- [DEPLOY_RAPIDO.md](./DEPLOY_RAPIDO.md): Mais detalhes
- [CLOUDFLARE_DEPLOY.md](./CLOUDFLARE_DEPLOY.md): Todas as opções
- [ENV_VARS_REFERENCE.md](./ENV_VARS_REFERENCE.md): Todas as variáveis
- [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md): Checklist completo

---

## 💰 Custos

**Total**: $0-5/mês

- Cloudflare Pages: **$0** (free tier)
- Railway: **$0-5** (free tier com $5 crédito/mês)
- MongoDB Atlas: **$0** (free tier 512MB)
- Firebase Auth: **$0** (até 50k usuários/mês)

---

## 🎯 Features Opcionais

### Emails (MailerSend)

1. Criar conta: https://www.mailersend.com
2. Verificar domínio
3. Gerar API token
4. Adicionar no Railway:
```env
MAILERSEND_API_KEY=mlsn.xxx
MAILERSEND_SENDER_EMAIL=noreply@seudominio.com
MAILERSEND_SENDER_NAME=1:1 Meetings Platform
```

### IA (OpenRouter)

1. Criar conta: https://openrouter.ai
2. Adicionar $5 de crédito
3. Gerar API key
4. Adicionar no Railway:
```env
OPENROUTER_API_KEY=sk-or-v1-xxx
```

---

**Feito!** Sua app está em produção 🎊
