# 📝 Comandos Úteis para Deploy

Referência rápida de comandos para deploy e manutenção.

## 🔐 Gerar Secrets

```bash
# Gerar JWT Secret e outros secrets
node backend/scripts/generate-secrets.js

# No Mac/Linux (alternativa)
openssl rand -base64 64

# No Windows PowerShell (alternativa)
[Convert]::ToBase64String((1..64 | ForEach-Object {Get-Random -Maximum 256}))
```

## ✅ Verificar Configuração

```bash
# Verificar se todas variáveis de ambiente estão configuradas
cd backend
node scripts/check-env.js
```

## 🏗️ Build Local

### Backend

```bash
cd backend

# Instalar dependências
npm install

# Build
npm run build

# Testar build localmente
npm run start:prod

# Verificar health check
curl http://localhost:3000/api/health
```

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Build
npm run build

# Preview do build
npm run preview

# Build será gerado em: frontend/dist/
```

## 🐳 Docker (Opcional)

### Backend

```bash
cd backend

# Build imagem
docker build -t 1-1-by-namex-backend .

# Rodar container
docker run -p 3000:3000 --env-file .env 1-1-by-namex-backend

# Verificar logs
docker logs <container-id>

# Parar container
docker stop <container-id>
```

### Com Docker Compose (criar docker-compose.yml)

```bash
# Subir todos serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down
```

## ☁️ Cloudflare Wrangler CLI

### Instalar Wrangler

```bash
npm install -g wrangler
```

### Login

```bash
wrangler login
```

### Deploy Frontend (Manual)

```bash
cd frontend

# Build primeiro
npm run build

# Deploy para Cloudflare Pages
npx wrangler pages deploy dist --project-name=1-1-by-namex-frontend

# Deploy para ambiente específico
npx wrangler pages deploy dist --project-name=1-1-by-namex-frontend --branch=staging
```

### Gerenciar Variáveis de Ambiente

```bash
# Listar variáveis
npx wrangler pages secret list --project-name=1-1-by-namex-frontend

# Adicionar secret
npx wrangler pages secret put VITE_API_URL --project-name=1-1-by-namex-frontend

# Remover secret
npx wrangler pages secret delete VITE_API_URL --project-name=1-1-by-namex-frontend
```

## 🚂 Railway CLI

### Instalar Railway CLI

```bash
npm install -g @railway/cli
```

### Login

```bash
railway login
```

### Deploy Backend

```bash
cd backend

# Linkar projeto existente
railway link

# Deploy
railway up

# Ver logs em tempo real
railway logs

# Abrir no browser
railway open
```

### Gerenciar Variáveis

```bash
# Ver variáveis
railway variables

# Adicionar variável
railway variables set DATABASE_URL="mongodb+srv://..."

# Remover variável
railway variables delete OLD_VAR
```

## 🎨 Render CLI

### Instalar

```bash
# Render não tem CLI oficial, use o dashboard web
# Ou use curl para a API
```

### Deploy via Git

```bash
# Apenas push para main
git push origin main

# Render faz deploy automático
```

## ✈️ Fly.io CLI

### Instalar

```bash
# Mac/Linux
curl -L https://fly.io/install.sh | sh

# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

### Deploy Backend

```bash
cd backend

# Login
fly auth login

# Criar app (primeira vez)
fly launch

# Deploy
fly deploy

# Ver logs
fly logs

# Abrir no browser
fly open

# Status
fly status
```

### Gerenciar Secrets

```bash
# Adicionar secret
fly secrets set JWT_SECRET="your-secret"

# Listar secrets (apenas nomes)
fly secrets list

# Remover secret
fly secrets unset OLD_SECRET
```

## 🗃️ MongoDB Atlas

### Conectar via CLI (mongosh)

```bash
# Instalar mongosh
# https://www.mongodb.com/try/download/shell

# Conectar
mongosh "mongodb+srv://cluster.mongodb.net/database" --username user

# Backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/database" --out=backup/

# Restore
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/database" backup/
```

## 🔄 Git (Deploy Automático)

```bash
# Fazer mudanças
git add .
git commit -m "feat: nova funcionalidade"

# Push para main = deploy automático
git push origin main

# Push para branch = preview deploy (Cloudflare/Vercel)
git checkout -b feature/nova-feature
git push origin feature/nova-feature
```

## 🧪 Testes de Produção

### Testar Backend

```bash
# Health check
curl https://seu-backend.railway.app/api/health

# Com output bonito
curl https://seu-backend.railway.app/api/health | jq

# Testar endpoint específico
curl -X POST https://seu-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Testar Frontend

```bash
# Verificar build
curl -I https://seu-app.pages.dev

# Verificar headers de segurança
curl -I https://seu-app.pages.dev | grep -E "X-Frame-Options|X-Content-Type-Options"

# Testar performance (se tiver lighthouse instalado)
lighthouse https://seu-app.pages.dev --view
```

## 📊 Monitoramento

### Logs

```bash
# Railway
railway logs --tail

# Fly.io
fly logs

# Cloudflare Pages (via dashboard)
# https://dash.cloudflare.com > Pages > Logs
```

### Status

```bash
# Railway
railway status

# Fly.io
fly status

# Verificar uptime
curl -o /dev/null -s -w "%{http_code}\n" https://seu-app.pages.dev
```

## 🔙 Rollback

### Cloudflare Pages

```bash
# Via dashboard:
# Deployments > Selecionar versão anterior > Rollback

# Via Wrangler (redeploy versão anterior)
cd frontend
git checkout <commit-anterior>
npm run build
npx wrangler pages deploy dist --project-name=1-1-by-namex-frontend
```

### Railway

```bash
# Via dashboard: Deployments > Selecionar > Redeploy
# Ou fazer rollback via Git:
git revert HEAD
git push origin main
```

### Fly.io

```bash
# Listar versões
fly releases

# Rollback para versão anterior
fly releases rollback <version-number>
```

## 🛠️ Troubleshooting

### Verificar Conectividade

```bash
# Testar MongoDB
mongosh "sua-connection-string" --eval "db.adminCommand('ping')"

# Testar Redis (se usar)
redis-cli -u redis://sua-url ping

# Testar porta local
netstat -an | grep 3000
```

### Limpar Cache

```bash
# npm
npm cache clean --force

# Cloudflare (via dashboard ou API)
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

### Reinstalar Dependências

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentação Oficial

- **Cloudflare Pages**: https://developers.cloudflare.com/pages/
- **Wrangler**: https://developers.cloudflare.com/workers/wrangler/
- **Railway**: https://docs.railway.app/
- **Render**: https://render.com/docs
- **Fly.io**: https://fly.io/docs/
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/

## 💡 Dicas

1. **Sempre teste localmente antes do deploy**
   ```bash
   npm run build && npm run start:prod
   ```

2. **Use diferentes branches para ambientes**
   - `main` → Produção
   - `staging` → Staging/Preview
   - `develop` → Desenvolvimento

3. **Automatize com GitHub Actions**
   - CI/CD configurado em `.github/workflows/`

4. **Monitore custos**
   - Railway: Dashboard > Usage
   - Cloudflare: Analytics > Usage
   - MongoDB Atlas: Clusters > Metrics

5. **Faça backups regulares**
   - MongoDB Atlas tem backup automático
   - Faça backup manual antes de mudanças grandes

---

**Precisa de ajuda?** Consulte:
- [DEPLOY_RAPIDO.md](./DEPLOY_RAPIDO.md) - Guia rápido
- [CLOUDFLARE_DEPLOY.md](./CLOUDFLARE_DEPLOY.md) - Guia completo
- [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) - Checklist
