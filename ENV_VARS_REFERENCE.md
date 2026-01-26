# 🔐 Referência de Variáveis de Ambiente

Guia completo de todas as variáveis de ambiente necessárias para o projeto.

---

## 🎨 Frontend (Cloudflare Pages)

### Obrigatórias

| Variável | Descrição | Exemplo | Onde obter |
|----------|-----------|---------|------------|
| `VITE_API_URL` | URL da API backend | `https://api.exemplo.com/api` | URL do deploy do backend (Railway/Render) |
| `VITE_FIREBASE_API_KEY` | API Key do Firebase | `AIzaSyC...` | Firebase Console > Project Settings > General |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth Domain do Firebase | `projeto.firebaseapp.com` | Firebase Console > Project Settings > General |
| `VITE_FIREBASE_PROJECT_ID` | Project ID do Firebase | `projeto-id` | Firebase Console > Project Settings > General |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage Bucket | `projeto.appspot.com` | Firebase Console > Project Settings > General |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging Sender ID | `123456789` | Firebase Console > Project Settings > General |
| `VITE_FIREBASE_APP_ID` | App ID | `1:123:web:abc` | Firebase Console > Project Settings > General |

### Como Configurar no Cloudflare Pages

1. Dashboard > Pages > Seu projeto
2. Settings > Environment variables
3. Add variable > Selecionar "Production" ou "Preview"
4. Colar valores do Firebase Console

**Exemplo completo:**

```env
VITE_API_URL=https://1-1-by-namex.railway.app/api
VITE_FIREBASE_API_KEY=AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=one-on-one-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=one-on-one-prod
VITE_FIREBASE_STORAGE_BUCKET=one-on-one-prod.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

---

## 🚀 Backend (Railway/Render/Fly.io)

### Obrigatórias

| Variável | Descrição | Exemplo | Como gerar |
|----------|-----------|---------|------------|
| `NODE_ENV` | Ambiente | `production` | Fixo |
| `PORT` | Porta do servidor | `3000` | Railway: auto / Render: `10000` / Fly: `8080` |
| `DATABASE_URL` | Connection string MongoDB | `mongodb+srv://user:pass@...` | MongoDB Atlas |
| `FIREBASE_PROJECT_ID` | Project ID | `projeto-id` | Firebase Console |
| `FIREBASE_PRIVATE_KEY` | Private Key (JSON) | `-----BEGIN PRIVATE KEY-----\n...` | Firebase Service Account |
| `FIREBASE_CLIENT_EMAIL` | Client Email | `firebase@projeto.iam.gserviceaccount.com` | Firebase Service Account |
| `JWT_SECRET` | Secret para JWT | `base64string...` | `node backend/scripts/generate-secrets.js` |
| `JWT_EXPIRATION` | Tempo de expiração JWT | `7d` | Fixo (7 dias recomendado) |
| `CORS_ORIGIN` | Origem permitida | `https://app.pages.dev` | URL do Cloudflare Pages |
| `FRONTEND_URL` | URL do frontend | `https://app.pages.dev` | URL do Cloudflare Pages |

### Opcionais (Features Extras)

| Variável | Descrição | Exemplo | Onde obter |
|----------|-----------|---------|------------|
| `MAILERSEND_API_KEY` | API Key do MailerSend | `mlsn.xxx...` | https://www.mailersend.com/ > API Tokens |
| `MAILERSEND_SENDER_EMAIL` | Email remetente | `noreply@seudominio.com` | MailerSend > Domains (precisa verificar domínio) |
| `MAILERSEND_SENDER_NAME` | Nome do remetente | `1:1 Meetings Platform` | Customizável |
| `OPENROUTER_API_KEY` | API Key OpenRouter | `sk-or-xxx...` | https://openrouter.ai/keys |

### Como Obter Credenciais Firebase

1. **Firebase Console**: https://console.firebase.google.com
2. Selecionar projeto
3. **Project Settings** (ícone engrenagem)
4. **Service Accounts** tab
5. Clicar em **"Generate new private key"**
6. Baixa um arquivo JSON:

```json
{
  "project_id": "seu-projeto-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nXXXX...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk@seu-projeto.iam.gserviceaccount.com"
}
```

7. Extrair valores:
   - `FIREBASE_PROJECT_ID` = `project_id`
   - `FIREBASE_PRIVATE_KEY` = `private_key` (COM as quebras de linha `\n`)
   - `FIREBASE_CLIENT_EMAIL` = `client_email`

⚠️ **IMPORTANTE**: A `FIREBASE_PRIVATE_KEY` deve incluir as quebras de linha `\n`:
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBADA...\n-----END PRIVATE KEY-----\n
```

### Como Configurar no Railway

1. Dashboard > Seu projeto
2. **Variables** tab
3. **RAW Editor** (para colar tudo de uma vez):

```env
NODE_ENV=production
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_AQUI\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@projeto.iam.gserviceaccount.com
JWT_SECRET=seu-secret-super-seguro-gerado-pelo-script
JWT_EXPIRATION=7d
CORS_ORIGIN=https://seu-app.pages.dev
FRONTEND_URL=https://seu-app.pages.dev
```

4. **Save Variables**
5. Railway faz redeploy automático

### Como Configurar no Render

1. Dashboard > Web Service > Environment
2. Adicionar cada variável individualmente
3. Para `FIREBASE_PRIVATE_KEY`, clicar em **"Add from .env"** e colar o valor completo

---

## 🗃️ MongoDB Atlas

### Criar Connection String

1. **MongoDB Atlas**: https://cloud.mongodb.com
2. Clusters > **Connect**
3. **Connect your application**
4. Copiar connection string:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

5. Substituir:
   - `<username>` → seu usuário
   - `<password>` → sua senha (URL encoded se tiver caracteres especiais)

6. Adicionar nome do database:

```
mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/one-on-one-db?retryWrites=true&w=majority
```

### Caracteres Especiais na Senha

Se a senha tiver caracteres especiais, use URL encoding:

| Caractere | Codificado |
|-----------|------------|
| `@` | `%40` |
| `:` | `%3A` |
| `/` | `%2F` |
| `?` | `%3F` |
| `#` | `%23` |
| `&` | `%26` |

**Exemplo:**
- Senha: `Pass@word#123`
- Encoded: `Pass%40word%23123`

---

## 🔑 Gerar Secrets Seguros

### Usando o Script (Recomendado)

```bash
node backend/scripts/generate-secrets.js
```

Gera:
- `JWT_SECRET` (base64, 64 bytes)
- `SESSION_SECRET` (hex, 32 bytes)
- `API_KEY` (hex, 32 bytes)

### Manualmente

#### Mac/Linux
```bash
# JWT Secret (base64)
openssl rand -base64 64

# Hex secret
openssl rand -hex 32
```

#### Windows (PowerShell)
```powershell
# JWT Secret (base64)
[Convert]::ToBase64String((1..64 | ForEach-Object {Get-Random -Maximum 256}))

# Hex secret
-join ((48..57) + (97..102) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

#### Online (Use com cuidado)
- https://www.grc.com/passwords.htm (Perfect Passwords - 64 random hex)
- Gere localmente sempre que possível

---

## 📧 MailerSend (Opcional)

### Criar Conta e Configurar

1. **Criar conta**: https://www.mailersend.com/
2. **Verificar domínio**:
   - Domains > Add domain
   - Adicionar registros DNS (TXT, CNAME)
   - Aguardar verificação

3. **Criar API Token**:
   - API Tokens > Create token
   - Selecionar permissões: **Email sending**
   - Copiar token: `mlsn.xxxxxxxx`

4. **Configurar variáveis**:
```env
MAILERSEND_API_KEY=mlsn.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAILERSEND_SENDER_EMAIL=noreply@seudominio.com
MAILERSEND_SENDER_NAME=1:1 Meetings Platform
```

**Sem domínio próprio?**
- MailerSend oferece sandbox domain para testes
- Limitado a emails verificados

---

## 🤖 OpenRouter AI (Opcional)

### Criar Conta e API Key

1. **Criar conta**: https://openrouter.ai/
2. **Keys**: https://openrouter.ai/keys
3. **Create Key** > Copiar key: `sk-or-v1-xxxxx`

4. **Adicionar créditos**: Settings > Credits
   - $5 mínimo
   - Pay as you go

5. **Configurar**:
```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Modelos recomendados** (configurável no código):
- `anthropic/claude-3-sonnet` - Rápido, inteligente
- `openai/gpt-4-turbo` - Alternativa
- Veja preços: https://openrouter.ai/docs#models

---

## ✅ Verificar Configuração

### Backend

```bash
cd backend
node scripts/check-env.js
```

Verifica se todas variáveis obrigatórias estão configuradas.

### Frontend

```bash
cd frontend
npm run build
```

Se houver variáveis faltando, o build vai avisar.

---

## 🔒 Segurança

### ✅ Boas Práticas

- ✅ Use secrets diferentes para cada ambiente (dev, staging, prod)
- ✅ Gere novos secrets para produção (não use os de desenvolvimento)
- ✅ Nunca commite `.env` no Git
- ✅ Use gerenciador de senhas para armazenar secrets
- ✅ Rotacione secrets periodicamente (a cada 90 dias)
- ✅ Use secrets longos e aleatórios (64+ caracteres)
- ✅ Limite permissões de service accounts do Firebase

### ❌ Evite

- ❌ Compartilhar secrets via chat/email
- ❌ Usar secrets simples como `secret123`
- ❌ Reutilizar secrets entre projetos
- ❌ Deixar variáveis vazias em produção
- ❌ Expor secrets em logs ou frontend

---

## 📝 Template Rápido

### Para Railway (Backend)

```env
NODE_ENV=production
DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
JWT_SECRET=
JWT_EXPIRATION=7d
CORS_ORIGIN=
FRONTEND_URL=
MAILERSEND_API_KEY=
MAILERSEND_SENDER_EMAIL=
MAILERSEND_SENDER_NAME=1:1 Meetings Platform
OPENROUTER_API_KEY=
```

### Para Cloudflare Pages (Frontend)

```env
VITE_API_URL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## 🆘 Troubleshooting

### Erro: "Firebase auth failed"
- Verificar `FIREBASE_PRIVATE_KEY` tem `\n` correto
- Verificar `FIREBASE_PROJECT_ID` está correto
- Verificar service account tem permissões

### Erro: "MongoDB connection failed"
- Verificar senha está URL encoded
- Verificar IP whitelist: `0.0.0.0/0`
- Verificar nome do database na connection string

### Erro: "CORS policy"
- Verificar `CORS_ORIGIN` tem `https://` e domínio correto
- Verificar não tem barra `/` no final
- Verificar domínio está ativo no Cloudflare Pages

### Frontend não conecta à API
- Verificar `VITE_API_URL` termina com `/api`
- Verificar backend está rodando
- Verificar health check: `curl https://backend.com/api/health`

---

**Próximos passos**: [DEPLOY_RAPIDO.md](./DEPLOY_RAPIDO.md)
