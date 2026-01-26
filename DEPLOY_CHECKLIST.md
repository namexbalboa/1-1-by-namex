# ✅ Checklist de Deploy para Produção

Use este checklist para garantir que tudo está configurado corretamente antes do deploy.

## 📋 Pré-Deploy

### Backend

- [ ] Todas as dependências estão no `package.json`
- [ ] Build funciona localmente (`npm run build`)
- [ ] Testes passam (`npm test`)
- [ ] Health check endpoint funciona (`/api/health`)
- [ ] Variáveis de ambiente documentadas em `.env.production`
- [ ] `.env` está no `.gitignore`
- [ ] Dockerfile criado e testado (opcional)

### Frontend

- [ ] Build funciona localmente (`npm run build`)
- [ ] Preview do build funciona (`npm run preview`)
- [ ] Todas as variáveis `VITE_*` documentadas
- [ ] Rotas SPA funcionam corretamente
- [ ] Assets otimizados (imagens comprimidas, etc.)
- [ ] Favicon configurado

### Segurança

- [ ] Novos secrets gerados para produção (JWT_SECRET, etc.)
- [ ] Secrets NÃO estão commitados no Git
- [ ] Firebase configurado para domínio de produção
- [ ] CORS configurado corretamente
- [ ] Rate limiting considerado (se necessário)
- [ ] Headers de segurança configurados

### Database

- [ ] MongoDB Atlas configurado
- [ ] Connection string segura (username/password forte)
- [ ] IP Whitelist configurado (0.0.0.0/0 para cloud)
- [ ] Backup automático habilitado (Atlas faz isso)
- [ ] Indexes criados (se necessário)

---

## 🚀 Durante o Deploy

### Backend (Railway/Render/Fly)

- [ ] Repositório conectado ao GitHub
- [ ] Root directory configurado (`backend`)
- [ ] Build command configurado
- [ ] Start command configurado
- [ ] Variáveis de ambiente adicionadas:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT` (se necessário)
  - [ ] `DATABASE_URL`
  - [ ] `FIREBASE_PROJECT_ID`
  - [ ] `FIREBASE_PRIVATE_KEY`
  - [ ] `FIREBASE_CLIENT_EMAIL`
  - [ ] `JWT_SECRET` (gerado novo!)
  - [ ] `JWT_EXPIRATION`
  - [ ] `CORS_ORIGIN`
  - [ ] `FRONTEND_URL`
  - [ ] `MAILERSEND_API_KEY` (opcional)
  - [ ] `MAILERSEND_SENDER_EMAIL` (opcional)
  - [ ] `MAILERSEND_SENDER_NAME` (opcional)
  - [ ] `OPENROUTER_API_KEY` (opcional)
- [ ] Health check configurado
- [ ] Deploy realizado com sucesso
- [ ] URL do backend anotada

### Frontend (Cloudflare Pages)

- [ ] Repositório conectado ao GitHub
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Build output directory: `dist`
- [ ] Root directory: `frontend`
- [ ] Node version: 18
- [ ] Variáveis de ambiente adicionadas:
  - [ ] `VITE_API_URL` (URL do backend)
  - [ ] `VITE_FIREBASE_API_KEY`
  - [ ] `VITE_FIREBASE_AUTH_DOMAIN`
  - [ ] `VITE_FIREBASE_PROJECT_ID`
  - [ ] `VITE_FIREBASE_STORAGE_BUCKET`
  - [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `VITE_FIREBASE_APP_ID`
- [ ] Deploy realizado com sucesso
- [ ] URL do frontend anotada

---

## 🧪 Pós-Deploy (Testes)

### Backend

- [ ] `/api/health` retorna status 200
- [ ] Logs não mostram erros críticos
- [ ] MongoDB conectado (verificar logs)
- [ ] Autenticação Firebase funciona
- [ ] CORS permite requisições do frontend

### Frontend

- [ ] Site carrega corretamente
- [ ] Console do navegador sem erros críticos
- [ ] Tema (light/dark) funciona
- [ ] Troca de idioma funciona
- [ ] Rotas navegam corretamente

### Integração Completa

- [ ] **Login funciona**
- [ ] **Registro de novo usuário funciona**
- [ ] **Logout funciona**
- [ ] API retorna dados corretamente
- [ ] Formulários salvam dados
- [ ] Upload de arquivos funciona (se aplicável)
- [ ] Email de convite funciona (se configurado)
- [ ] IA de análise funciona (se configurado)

---

## 🔧 Configurações Finais

### DNS e Domínios (Opcional)

- [ ] Domínio customizado configurado no Cloudflare Pages
- [ ] Domínio customizado configurado no Railway/Render
- [ ] SSL/TLS certificado ativo (automático)
- [ ] Redirecionamentos configurados (www → não-www, etc.)

### Firebase

- [ ] Domínio de produção adicionado em "Authorized domains"
- [ ] OAuth redirect URLs atualizados (se usar)
- [ ] Quotas verificadas (Authentication, Firestore, etc.)

### Monitoramento

- [ ] Monitoramento de uptime configurado (opcional)
- [ ] Alertas de erro configurados (opcional)
- [ ] Google Analytics ou similar (opcional)

### Performance

- [ ] Lighthouse score verificado (> 90)
- [ ] Tempo de carregamento aceitável (< 3s)
- [ ] API responde rápido (< 500ms)

---

## 📊 Métricas de Sucesso

Após 24 horas de produção:

- [ ] Zero downtime
- [ ] Sem erros críticos nos logs
- [ ] Usuários conseguem fazer login
- [ ] Performance mantida (< 3s carregamento)
- [ ] Sem reclamações de bugs críticos

---

## 🆘 Rollback Plan

Se algo der errado:

### Cloudflare Pages
1. Dashboard > Deployments
2. Encontrar último deploy estável
3. Clicar "Rollback to this deployment"

### Railway
1. Dashboard > Deployments
2. Selecionar versão anterior
3. Clicar "Redeploy"

### Database
- MongoDB Atlas mantém backups automáticos
- Pode restaurar via dashboard se necessário

---

## 📝 Informações Importantes

Anote aqui as informações do deploy:

```
Data do Deploy: _____________

URLs:
- Frontend: https://_______________.pages.dev
- Backend: https://_______________.railway.app
- MongoDB: mongodb+srv://_______________

Credenciais Admin:
- Email: _______________
- (Senha salva no gerenciador de senhas)

Secrets de Produção:
- JWT_SECRET: (salvo no gerenciador de senhas)
- Firebase Private Key: (salvo no gerenciador de senhas)
- MailerSend API Key: (salvo no gerenciador de senhas)
- OpenRouter API Key: (salvo no gerenciador de senhas)
```

---

## 🎉 Deploy Completo!

Parabéns! Seu aplicativo está em produção.

**Próximos passos:**
1. Monitorar logs nas primeiras 24h
2. Testar todas funcionalidades principais
3. Configurar domínio customizado (opcional)
4. Configurar monitoramento de uptime
5. Documentar procedimentos de manutenção

**Manutenção:**
- Atualizações: Push para `main` faz deploy automático
- Logs: Verificar dashboard Railway/Cloudflare
- Backup: MongoDB Atlas faz backup automático
- Custos: Monitorar mensalmente

---

**Precisa de ajuda?** Consulte [CLOUDFLARE_DEPLOY.md](./CLOUDFLARE_DEPLOY.md) para troubleshooting.
