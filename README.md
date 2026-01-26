# 1:1 Meeting Management System

Sistema SaaS Multi-tenant para gestão de reuniões individuais (1:1) entre Gerente e Colaborador, transformando conversas subjetivas em dados estruturados.

## 🚀 Características

- ✨ **Multi-tenant**: Suporte para múltiplas empresas
- 🌍 **Multi-idioma**: Português (pt-BR), Inglês (en-US) e Espanhol (es-ES)
- 🎨 **Design Moderno**: Interface limpa com shadcn/ui + TailwindCSS
- 🌓 **Dark Mode**: Tema escuro com cinza claro
- 📊 **Metodologia 15+15**: 15min de Retrospectiva + 15min de Planejamento
- 📈 **Analytics**: Relatórios anuais e tendências
- 🔒 **Seguro**: Autenticação Firebase e validação multi-tenant

## 📁 Estrutura do Projeto

```
.
├── backend/          # API NestJS
├── frontend/         # React + Vite + shadcn/ui
├── PLANO_DE_CONSTRUCAO.md
└── README.md
```

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: NestJS
- **Database**: MongoDB (Mongoose)
- **Auth**: Firebase Authentication
- **i18n**: nestjs-i18n

### Frontend
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **UI**: shadcn/ui + TailwindCSS
- **State**: Zustand
- **i18n**: i18next + react-i18next
- **Routing**: React Router v6
- **Charts**: Recharts
- **Theme**: next-themes

## 🎨 Cores do Design System

### Light Mode
- **Primary**: Azul Claro (#0EA5E9 - sky-500)
- **Secondary**: Verde Claro (#10B981 - green-500)
- **Background**: Branco (#FFFFFF)

### Dark Mode
- **Primary**: Azul Claro (#38BDF8 - sky-400)
- **Secondary**: Verde Claro (#34D399 - green-400)
- **Background**: Cinza Escuro (#2D3748 - gray-700)
- **Cards**: Cinza Médio (#374151 - gray-600)

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- MongoDB
- Conta Firebase

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Configure as variáveis de ambiente no .env
npm run start:dev
```

O backend estará rodando em `http://localhost:3000/api`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Configure as variáveis de ambiente no .env
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 📚 Documentação

- [Plano de Construção](./PLANO_DE_CONSTRUCAO.md) - Documentação completa do projeto
- [Especificação Técnica](./ideia.md) - Documento de especificação original

## 🔧 Configuração

### Backend (.env)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/one-on-one-db
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
JWT_SECRET=your-secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 🚀 Deploy

### 📦 Início Rápido

O projeto está **100% preparado** para deploy no **Cloudflare Pages** (frontend) e **Railway.app** (backend).

**⭐ Começar agora**: [DEPLOY_RAPIDO.md](./DEPLOY_RAPIDO.md) - Deploy em 15 minutos

**📋 Arquivos criados**: [DEPLOY_SUMMARY.md](./DEPLOY_SUMMARY.md) - Resumo de todos os arquivos

**📚 Documentação completa**: [CLOUDFLARE_DEPLOY.md](./CLOUDFLARE_DEPLOY.md) - Guia detalhado

### Plataformas Suportadas

**Frontend (Cloudflare Pages)**:
- Deploy automático via GitHub
- HTTPS gratuito
- CDN global
- Free tier generoso

**Backend**:
- [Railway.app](https://railway.app) (Recomendado)
- [Render.com](https://render.com)
- [Fly.io](https://fly.io)
- Qualquer plataforma que suporte Docker

### Scripts Úteis

```bash
# Gerar secrets seguros para produção
node backend/scripts/generate-secrets.js

# Verificar variáveis de ambiente
node backend/scripts/check-env.js
```

## 📝 Licença

MIT License - veja [LICENSE](./LICENSE) para detalhes.

## 👥 Contribuindo

Contribuições são bem-vindas! Por favor, leia as diretrizes de contribuição antes de submeter um PR.

## 📞 Suporte

Para suporte, abra uma issue no repositório.

---

**Status**: Em desenvolvimento
**Versão**: 1.0.0