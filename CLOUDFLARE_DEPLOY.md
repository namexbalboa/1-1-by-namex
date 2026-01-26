# Deploy no Cloudflare - Guia Completo

Este guia cobre o deploy do frontend no Cloudflare Pages e recomendações para o backend.

## 📋 Pré-requisitos

1. Conta no Cloudflare (gratuita): https://dash.cloudflare.com/sign-up
2. Wrangler CLI instalado globalmente:
```bash
npm install -g wrangler
```
3. Login no Cloudflare:
```bash
wrangler login
```

---

## 🎨 Frontend - Cloudflare Pages

### Opção 1: Deploy via GitHub (Recomendado)

1. **Push do código para GitHub**
```bash
git add .
git commit -m "Prepare for Cloudflare deployment"
git push origin main
```

2. **Configurar no Dashboard do Cloudflare**
   - Acesse: https://dash.cloudflare.com
   - Vá para **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**
   - Selecione o repositório: `1-1-by-namex`
   - Configure o build:

**Build settings:**
```
Framework preset: Vite
Build command: npm run build
Build output directory: dist
Root directory: frontend
Node version: 18
```

3. **Configurar Variáveis de Ambiente**
   - No dashboard do projeto, vá para **Settings** > **Environment variables**
   - Adicione as seguintes variáveis para **Production**:

```
VITE_API_URL=https://your-backend-url.com/api
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

4. **Deploy**
   - Clique em **Save and Deploy**
   - O Cloudflare irá fazer o build e deploy automaticamente
   - Você receberá uma URL como: `https://1-1-by-namex.pages.dev`

### Opção 2: Deploy via Wrangler CLI

1. **Fazer build local**
```bash
cd frontend
npm install
npm run build
```

2. **Deploy com Wrangler**
```bash
npx wrangler pages deploy dist --project-name=1-1-by-namex-frontend
```

3. **Configurar variáveis via CLI**
```bash
# Production
npx wrangler pages secret put VITE_API_URL --project-name=1-1-by-namex-frontend
npx wrangler pages secret put VITE_FIREBASE_API_KEY --project-name=1-1-by-namex-frontend
# ... adicione todas as variáveis necessárias
```

---

## 🚀 Backend - Opções de Deploy

### ⚠️ Importante: NestJS e Cloudflare Workers

O backend usa **NestJS**, que é baseado em Node.js e não é compatível nativamente com **Cloudflare Workers** (que usa V8 isolates).

### Opções Recomendadas:

#### Opção 1: Cloudflare Workers + Hono.js (Recomendado para Cloudflare)

**Pros:**
- Serverless, escala automaticamente
- Baixíssima latência (edge computing)
- Custo-benefício excelente
- Integração nativa com Cloudflare D1 (SQLite), R2 (storage)

**Contras:**
- Requer reescrever a API (migrar de NestJS para Hono.js)
- Não suporta MongoDB diretamente (precisaria usar Cloudflare D1 ou MongoDB Atlas via HTTP)

**Como fazer:**
1. Reescrever rotas NestJS em Hono.js
2. Migrar de MongoDB para Cloudflare D1 ou usar MongoDB Atlas
3. Deploy via Wrangler

#### Opção 2: Railway.app (Mais Simples - Recomendado)

**Pros:**
- Suporta NestJS nativamente
- Deploy direto do GitHub
- Suporta MongoDB
- Free tier generoso
- HTTPS automático

**Contras:**
- Não é Cloudflare (mas é rápido e confiável)

**Passos:**
1. Criar conta em https://railway.app
2. **New Project** > **Deploy from GitHub repo**
3. Selecionar o repositório e pasta `backend`
4. Adicionar variáveis de ambiente
5. Railway faz deploy automático

#### Opção 3: Render.com

**Pros:**
- Free tier disponível
- Suporta NestJS e MongoDB
- Deploy automático do GitHub

**Contras:**
- Free tier pode ser lento (sleeping após inatividade)

**Passos:**
1. Criar conta em https://render.com
2. **New** > **Web Service**
3. Conectar repositório GitHub
4. Configurar:
```
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm run start:prod
```

#### Opção 4: Fly.io

**Pros:**
- Edge computing (similar ao Cloudflare)
- Suporta NestJS
- Free tier disponível

**Passos:**
1. Instalar Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Na pasta `backend`:
```bash
cd backend
fly launch
fly deploy
```

---

## 🔧 Configuração Pós-Deploy

### 1. Atualizar CORS no Backend

No arquivo `backend/src/main.ts`, atualize o CORS para incluir o domínio do Cloudflare Pages:

```typescript
app.enableCors({
  origin: [
    'http://localhost:5173',
    'https://1-1-by-namex.pages.dev', // Seu domínio Cloudflare Pages
    'https://your-custom-domain.com'   // Domínio customizado (se tiver)
  ],
  credentials: true,
});
```

### 2. Configurar Domínio Customizado (Opcional)

#### Frontend (Cloudflare Pages):
1. No dashboard: **Custom domains** > **Set up a custom domain**
2. Adicione seu domínio (ex: `app.seudominio.com`)
3. Siga as instruções para configurar DNS

#### Backend:
- Depende da plataforma escolhida (Railway, Render, etc.)
- Todas oferecem suporte a domínios customizados

### 3. Configurar MongoDB Atlas (se necessário)

Se usar Railway/Render/Fly:
1. Criar cluster no MongoDB Atlas: https://cloud.mongodb.com
2. Configurar IP Whitelist: `0.0.0.0/0` (permitir de qualquer lugar)
3. Criar usuário de banco de dados
4. Copiar connection string
5. Adicionar como variável `DATABASE_URL` no serviço de backend

---

## 📊 Monitoramento

### Cloudflare Pages
- Dashboard > Analytics
- Logs em tempo real
- Métricas de performance

### Backend (Railway)
- Dashboard mostra logs em tempo real
- Métricas de CPU/RAM
- Alertas automáticos

---

## 🔄 Continuous Deployment

Com GitHub conectado:
- **Frontend**: Cada push para `main` faz deploy automático no Cloudflare Pages
- **Backend**: Cada push para `main` faz deploy automático no Railway/Render

---

## 💰 Custos Estimados

### Cloudflare Pages (Frontend)
- **Free tier**: 500 builds/mês, bandwidth ilimitado
- Mais que suficiente para maioria dos projetos

### Railway (Backend - Recomendado)
- **Free tier**: $5 de crédito/mês
- Depois: ~$5-10/mês para apps pequenas

### MongoDB Atlas
- **Free tier**: 512MB storage
- Suficiente para desenvolvimento e testes

**Total estimado**: $0-10/mês dependendo do tráfego

---

## 🛠️ Comandos Úteis

### Frontend
```bash
# Build local
cd frontend
npm run build

# Preview do build
npm run preview

# Deploy manual
npx wrangler pages deploy dist --project-name=1-1-by-namex-frontend
```

### Backend
```bash
# Build
cd backend
npm run build

# Testar produção localmente
npm run start:prod
```

---

## ⚡ Recomendação Final

**Setup Recomendado para Produção:**

1. **Frontend**: Cloudflare Pages (via GitHub)
2. **Backend**: Railway.app (via GitHub)
3. **Database**: MongoDB Atlas (free tier)
4. **Auth**: Firebase (já configurado)

**Vantagens:**
- Deploy automático em ambos
- HTTPS automático
- Custo inicial zero
- Fácil de escalar
- Boa performance global

---

## 📞 Suporte

- Cloudflare Pages: https://developers.cloudflare.com/pages/
- Railway: https://docs.railway.app/
- MongoDB Atlas: https://docs.atlas.mongodb.com/

---

## 🔐 Checklist de Segurança

Antes do deploy em produção:

- [ ] Todas as variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] Domínios HTTPS configurados
- [ ] MongoDB IP whitelist configurado
- [ ] Firebase configurado para domínio de produção
- [ ] Secrets (JWT_SECRET, API_KEYS) gerados novamente para produção
- [ ] .env não commitado no Git (verificar .gitignore)
- [ ] Headers de segurança configurados (já incluídos em `_headers`)

---

## 🚦 Próximos Passos

1. Escolher plataforma para o backend (Railway recomendado)
2. Fazer deploy do backend primeiro
3. Anotar URL do backend
4. Configurar variáveis de ambiente no Cloudflare Pages
5. Fazer deploy do frontend
6. Testar aplicação completa em produção
7. Configurar domínios customizados (opcional)
