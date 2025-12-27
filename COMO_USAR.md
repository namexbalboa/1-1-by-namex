# 🚀 Como Usar o Sistema - Guia Completo

## ✅ Sistema 100% Funcional

O sistema de gerenciamento de reuniões 1:1 está totalmente funcional com:
- ✅ Backend rodando na porta 8000
- ✅ Frontend rodando na porta 5173
- ✅ Banco de dados MongoDB conectado
- ✅ Firebase Authentication configurado
- ✅ **Sistema de registro de usuários completo!**

---

## 🆕 Criar Nova Conta (Recomendado)

### Passo a Passo:

1. **Acesse a página de registro**:
   ```
   http://localhost:5173/register
   ```

2. **Preencha o formulário**:
   - **Nome completo**: Ex: João Silva
   - **Email corporativo**: Ex: joao@minhaempresa.com
   - **Senha**: Mínimo 6 caracteres
   - **Confirmar senha**: Repita a mesma senha
   - **Nome da empresa**: Ex: Minha Empresa Ltda
   - **Idioma preferido**: Português, English ou Español

3. **Clique em "Criar conta"**

4. **Aguarde**: O sistema irá:
   - ✅ Validar os dados
   - ✅ Criar usuário no Firebase Authentication
   - ✅ Criar ou vincular sua empresa (Tenant)
   - ✅ Criar seu perfil de Collaborator
   - ✅ Fazer login automaticamente
   - ✅ Redirecionar você para o Dashboard

5. **Pronto!** Você já pode começar a usar o sistema!

### 🎯 Regras Importantes:

- **Primeiro usuário de uma empresa** → Vira **Manager** automaticamente
- **Demais usuários do mesmo domínio** → Viram **Employee**
- **Domínio do email** determina a empresa (Ex: `@empresa.com`)

---

## 🔐 Login com Conta Existente

Se você já criou uma conta ou tem credenciais:

1. **Acesse a página de login**:
   ```
   http://localhost:5173/login
   ```

2. **Preencha**:
   - Email
   - Senha

3. **Clique em "Entrar"**

4. **Será redirecionado para o Dashboard**

---

## 📊 Usando o Sistema

### Dashboard

Após fazer login, você verá:
- **Botão "Nova Reunião 1:1"**: Inicia uma nova reunião
- **Estatísticas**: Reuniões realizadas, pulso médio, itens pendentes
- **Guia de início rápido**: Passos para usar o sistema

### Criar Reunião 1:1

1. **Clique em "Nova Reunião 1:1"** no Dashboard

2. **Fase 1 - Retrospectiva**:
   - Adicione itens de ação da última reunião
   - Marque o status: Pendente, Concluído ou Bloqueado
   - Defina o pulso semanal (1-5) das últimas 8 semanas
   - Clique em "Próximo"

3. **Fase 2 - Planning** (4 Blocos):

   **Bloco A - Operacional**:
   - Distribuição de tempo (Execução, Reuniões, Resolução)
   - Nível de bloqueadores
   - Qualidade de ferramentas
   - Clareza de prioridades

   **Bloco B - Estratégia**:
   - Conexão com objetivos da empresa
   - Nível de autonomia
   - Oportunidades de inovação

   **Bloco C - Dinâmica Humana**:
   - Segurança psicológica
   - Atrito na colaboração
   - Reconhecimento recebido

   **Bloco D - Desenvolvimento**:
   - Flow state (habilidade vs desafio)
   - Utilização de pontos fortes
   - Áreas de aprendizado ativo
   - Saúde mental
   - Foco quinzenal

4. **Clique em "Finalizar"** após preencher todos os blocos

---

## 🌐 Mudança de Idioma

Use o seletor de idioma no canto superior direito para alternar entre:
- 🇧🇷 Português
- 🇺🇸 English
- 🇪🇸 Español

---

## ❌ Mensagens de Erro Comuns

### Ao Registrar:

- **"Email já cadastrado"**: Use outro email ou faça login
- **"Senha deve ter no mínimo 6 caracteres"**: Use uma senha mais longa
- **"Senhas não coincidem"**: Verifique se digitou igual nos dois campos
- **"Erro de conexão"**: Backend não está rodando ou MongoDB desconectado

### Ao Fazer Login:

- **"Email ou senha incorretos"**: Verifique suas credenciais
- **"Usuário não cadastrado no sistema"**: Faça o cadastro primeiro
- **"Usuário não encontrado"**: Email não existe no Firebase
- **"Erro de conexão"**: Backend não está rodando

---

## 🔧 Troubleshooting

### Backend não está rodando?

```bash
cd backend
npm run start:dev
```

Deve aparecer: `Nest application successfully started`

### Frontend não está rodando?

```bash
cd frontend
npm run dev
```

Deve aparecer: `Local: http://localhost:5173/`

### MongoDB desconectado?

Verifique a variável `DATABASE_URL` em `backend/.env`

---

## 📝 Dados de Teste

### Usuário Demo Pré-Criado (Banco de Dados)

- **Email**: demo@example.com
- **Tenant**: Demo Company
- **Role**: manager

⚠️ Este usuário existe no banco mas **não** no Firebase. Para usá-lo, crie manualmente no Firebase Console com o mesmo email.

### Criar Dados de Teste

```bash
# Criar novo tenant
curl -X POST http://localhost:8000/api/tenants \
  -H "Content-Type: application/json" \
  -d '{"name":"Empresa Teste"}'

# Criar novo collaborator (use /register em vez disso!)
```

---

## 🎉 Tudo Funcionando!

Se você:
- ✅ Consegue acessar `http://localhost:5173`
- ✅ Vê a página de login ou registro
- ✅ Consegue criar uma conta
- ✅ É redirecionado para o Dashboard
- ✅ Vê seu nome e email no Dashboard

**Parabéns! O sistema está 100% funcional!** 🎊

---

## 📚 Documentação Adicional

- [INSTRUCOES.md](INSTRUCOES.md) - Instruções de instalação e execução
- [PLANO_REGISTRO.md](PLANO_REGISTRO.md) - Arquitetura do sistema de registro
- [API_ENDPOINTS.md](API_ENDPOINTS.md) - Documentação da API
- [PROGRESSO.md](PROGRESSO.md) - Progresso do desenvolvimento

---

**Desenvolvido com ❤️ usando NestJS + React + Firebase**
