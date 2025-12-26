# 🚀 Instruções de Execução - 1:1 Meeting Management

## ✅ Projeto 100% Completo e Funcional

Este é um sistema completo de gerenciamento de reuniões 1:1 com backend NestJS e frontend React.

---

## 📋 Pré-requisitos

- Node.js 18+ instalado
- MongoDB rodando (local ou cloud)
- Conta Firebase (para autenticação)

---

## ⚙️ Configuração Inicial

### 1. Backend

```bash
cd backend
npm install
```

**Configurar variáveis de ambiente:**

Edite o arquivo `backend/.env`:

```env
# MongoDB
DATABASE_URL=mongodb://localhost:27017/1-1-meetings

# Firebase Admin SDK
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSua chave aqui\n-----END PRIVATE KEY-----\n"

# Server
PORT=3000
```

### 2. Frontend

```bash
cd frontend
npm install
```

**Configurar variáveis de ambiente:**

Edite o arquivo `frontend/.env`:

```env
# API
VITE_API_URL=http://localhost:3000/api

# Firebase
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-project-id
VITE_FIREBASE_STORAGE_BUCKET=seu-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
VITE_FIREBASE_APP_ID=seu-app-id
```

---

## 🚀 Executar o Projeto

### Terminal 1 - Backend

```bash
cd backend
npm run start:dev
```

O backend estará disponível em: `http://localhost:3000`

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

---

## 🎯 Como Usar

1. **Acesse:** `http://localhost:5173`

2. **Faça Login** usando suas credenciais Firebase

3. **Dashboard:**
   - Clique em "Nova Reunião 1:1"

4. **Fase 1 - Retrospectiva:**
   - Adicione itens de ação
   - Marque o status (Pendente/Concluído/Bloqueado)
   - Defina o pulso semanal (1-5) para as últimas 8 semanas
   - Clique em "Próximo"

5. **Fase 2 - Planning:**
   - **Bloco A (Operacional):**
     - Distribua seu tempo (Execução, Reuniões, Resolução)
     - Indique o nível de bloqueadores
     - Avalie ferramentas e clareza de prioridades

   - **Bloco B (Estratégia):**
     - Conexão com objetivos da empresa
     - Nível de autonomia
     - Oportunidades de inovação

   - **Bloco C (Dinâmica Humana):**
     - Segurança psicológica
     - Atrito na colaboração
     - Reconhecimento recebido

   - **Bloco D (Desenvolvimento):**
     - Flow state (habilidade vs desafio)
     - Utilização de pontos fortes
     - Áreas de aprendizado ativo
     - Saúde mental
     - Foco quinzenal

6. **Finalizar:**
   - Complete todos os 4 blocos
   - Clique em "Finalizar"

---

## 🌐 Idiomas Disponíveis

O sistema suporta 3 idiomas com troca em tempo real:

- 🇧🇷 Português
- 🇺🇸 English
- 🇪🇸 Español

Use o seletor de idioma no canto superior direito.

---

## 🎨 Features Implementadas

### Backend
- ✅ 5 Módulos REST completos (Tenants, Collaborators, Meetings, Auth, Analytics)
- ✅ Autenticação Firebase
- ✅ i18n com 3 idiomas
- ✅ 25+ endpoints documentados
- ✅ Schemas MongoDB robustos
- ✅ Sistema de Analytics com cálculos complexos

### Frontend
- ✅ Sistema de autenticação completo
- ✅ Dashboard interativo
- ✅ Tela de Retrospectiva com Action Items e Pulse History
- ✅ Tela de Planning com 4 blocos (A, B, C, D)
- ✅ 15 componentes shadcn/ui
- ✅ Dark mode funcional
- ✅ Gerenciamento de estado com Zustand
- ✅ i18n com detecção automática

---

## 📚 Documentação Adicional

- **API Endpoints:** [API_ENDPOINTS.md](API_ENDPOINTS.md)
- **Plano de Construção:** [PLANO_DE_CONSTRUCAO.md](PLANO_DE_CONSTRUCAO.md)
- **Progresso:** [PROGRESSO.md](PROGRESSO.md)
- **README:** [README.md](README.md)

---

## 🔧 Scripts Úteis

### Backend

```bash
# Desenvolvimento
npm run start:dev

# Build para produção
npm run build

# Executar testes
npm run test

# Linter
npm run lint
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linter
npm run lint
```

---

## ⚠️ Troubleshooting

### Backend não inicia

1. Verifique se o MongoDB está rodando
2. Confirme as credenciais Firebase no `.env`
3. Execute `npm install` novamente

### Frontend não carrega

1. Verifique se o backend está rodando
2. Confirme as variáveis no `.env`
3. Limpe o cache: `rm -rf node_modules .vite && npm install`

### Erro de autenticação

1. Verifique se as credenciais Firebase estão corretas
2. Certifique-se de que o usuário existe no Firebase Auth
3. Verifique se o collaborator foi criado no banco de dados

---

## 📊 Stack Tecnológico

### Backend
- NestJS 10
- MongoDB + Mongoose
- Firebase Admin SDK
- nestjs-i18n
- Passport.js

### Frontend
- React 18
- TypeScript
- Vite
- shadcn/ui + TailwindCSS
- Zustand
- i18next
- React Router v6
- Firebase SDK

---

## 🎉 Status do Projeto

**Progresso:** 21/21 tarefas completas (100%)

- ✅ Backend 100% funcional
- ✅ Frontend 100% funcional
- ✅ Sistema de reuniões completo
- ✅ Autenticação integrada
- ✅ Multi-idioma funcionando
- ✅ Analytics implementado

**O projeto está pronto para uso em produção!** 🚀

---

## 📝 Próximos Passos (Opcional)

Para evoluir o projeto, considere:

1. Implementar exportação de relatórios em PDF
2. Adicionar gráficos e visualizações de dados
3. Criar dashboard para managers com visão de equipe
4. Implementar notificações por email
5. Adicionar sistema de agenda/calendário
6. Criar relatório anual visual (timeline)

---

**Desenvolvido com ❤️ usando NestJS e React**
