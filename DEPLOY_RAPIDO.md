# 🚀 Guia Rápido de Deploy

Deploy em 15 minutos usando Railway (backend) + Cloudflare Pages (frontend).

## Passo 1: Preparar Repositório GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Passo 2: Deploy do Backend no Railway

1. **Criar conta**: https://railway.app (login com GitHub)

2. **Novo Projeto**:
   - Clicar em **"New Project"**
   - Selecionar **"Deploy from GitHub repo"**
   - Escolher o repositório `1-1-by-namex`
   - Railway detecta automaticamente o NestJS

3. **Configurar Root Directory**:
   - Em Settings > **"Root Directory"** = `backend`
   - Em Settings > **"Start Command"** = `npm run start:prod`
   - Em Settings > **"Build Command"** = `npm install && npm run build`

4. **Adicionar Variáveis de Ambiente**:
   - Ir em **Variables**
   - Adicionar todas do arquivo `backend/.env.production`
   - **Importante**: Gerar JWT_SECRET forte:
     ```bash
     # No terminal (Mac/Linux)
     openssl rand -base64 64

     # No Windows (PowerShell)
     [Convert]::ToBase64String((1..64 | ForEach-Object {Get-Random -Maximum 256}))
     ```

5. **Deploy**:
   - Railway faz deploy automático
   - Anote a URL gerada (ex: `https://seu-app.railway.app`)

## Passo 3: Configurar MongoDB Atlas

1. **Criar conta**: https://cloud.mongodb.com

2. **Criar Cluster**:
   - Free tier (512MB)
   - Região mais próxima

3. **Configurar Acesso**:
   - Database Access > Add User (username + senha forte)
   - Network Access > Add IP: `0.0.0.0/0` (permitir de qualquer lugar)

4. **Obter Connection String**:
   - Clusters > Connect > Connect your application
   - Copiar string: `mongodb+srv://username:password@...`
   - Substituir `<password>` pela senha
   - Adicionar ao Railway como `DATABASE_URL`

## Passo 4: Deploy do Frontend no Cloudflare Pages

1. **Criar conta**: https://dash.cloudflare.com/sign-up

2. **Novo Projeto**:
   - Workers & Pages > **"Create application"** > **"Pages"**
   - **"Connect to Git"** > Selecionar repositório

3. **Configurar Build**:
   ```
   Framework preset: Vite
   Build command: npm run build
   Build output directory: dist
   Root directory: frontend
   ```

4. **Variáveis de Ambiente** (Settings > Environment variables):
   ```
   VITE_API_URL=https://seu-app.railway.app/api
   ```

   + Adicionar todas as variáveis Firebase (do arquivo `frontend/.env.example`)

5. **Deploy**:
   - Save and Deploy
   - Anote a URL: `https://1-1-by-namex.pages.dev`

## Passo 5: Atualizar CORS no Backend

1. **No Railway**, atualizar variável:
   ```
   CORS_ORIGIN=https://1-1-by-namex.pages.dev
   ```

2. **Railway faz redeploy automático**

## Passo 6: Testar

1. Acessar o frontend: `https://1-1-by-namex.pages.dev`
2. Testar login e funcionalidades
3. Verificar logs no Railway se houver erros

## ✅ Pronto!

Seu app está no ar com:
- ✅ HTTPS automático
- ✅ Deploy contínuo (cada push no GitHub faz redeploy)
- ✅ Escalabilidade automática
- ✅ Custo inicial: $0

## 🔄 Atualizações Futuras

```bash
git add .
git commit -m "Nova feature"
git push origin main
```

Railway e Cloudflare fazem deploy automático!

## 📊 Custos Mensais Estimados

- **Cloudflare Pages**: $0 (free tier)
- **Railway**: $0-5 (free tier com $5 de crédito/mês)
- **MongoDB Atlas**: $0 (free tier 512MB)

**Total**: ~$0-5/mês

## 🆘 Troubleshooting

### Backend não inicia
- Verificar logs no Railway
- Confirmar todas variáveis de ambiente configuradas
- Verificar DATABASE_URL está correto

### Frontend não conecta ao backend
- Verificar VITE_API_URL no Cloudflare
- Verificar CORS_ORIGIN no Railway
- Verificar se backend está rodando (acessar /api/health)

### Erro de CORS
- Adicionar domínio completo do Cloudflare em CORS_ORIGIN
- Incluir `https://` no início

## 📱 Domínio Customizado (Opcional)

### Frontend (Cloudflare Pages):
1. Custom domains > Set up a custom domain
2. Adicionar: `app.seudominio.com`
3. Configurar DNS conforme instruções

### Backend (Railway):
1. Settings > Networking > Custom Domain
2. Adicionar: `api.seudominio.com`
3. Configurar DNS: CNAME para o domínio Railway

## 🔐 Checklist Final

- [ ] Backend rodando no Railway
- [ ] MongoDB Atlas conectado
- [ ] Frontend no Cloudflare Pages
- [ ] Variáveis de ambiente configuradas
- [ ] CORS atualizado
- [ ] Login funcionando
- [ ] Firebase conectado
- [ ] Email funcionando (se configurado)
- [ ] IA funcionando (se configurado)

---

**Documentação completa**: Ver [CLOUDFLARE_DEPLOY.md](./CLOUDFLARE_DEPLOY.md)
