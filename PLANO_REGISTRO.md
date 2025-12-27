# 📋 Plano de Implementação - Sistema de Registro de Usuários

## 🎯 Objetivo
Permitir que novos usuários se cadastrem no sistema sem precisar estar logados, criando automaticamente:
1. Conta no Firebase Authentication
2. Registro de Collaborator no banco de dados
3. Tenant (se for o primeiro usuário da empresa) ou vínculo com tenant existente

## 🏗️ Arquitetura

### Fluxo de Registro

```
┌─────────────────┐
│  Tela Register  │
│  (Frontend)     │
└────────┬────────┘
         │
         │ 1. Preenche formulário
         ▼
┌─────────────────────────────────────┐
│ Validações Client-Side              │
│ - Email válido                      │
│ - Senha forte (min 6 caracteres)   │
│ - Nome completo                     │
│ - Confirmação de senha              │
└────────┬────────────────────────────┘
         │
         │ 2. Envia dados
         ▼
┌─────────────────────────────────────┐
│ POST /api/auth/register (Backend)  │
│ - Endpoint PÚBLICO (sem auth)       │
└────────┬────────────────────────────┘
         │
         │ 3. Cria usuário Firebase
         ▼
┌─────────────────────────────────────┐
│ Firebase Authentication             │
│ - createUserWithEmailAndPassword    │
│ - Retorna UID                       │
└────────┬────────────────────────────┘
         │
         │ 4. UID criado
         ▼
┌─────────────────────────────────────┐
│ Verifica/Cria Tenant                │
│ - Se empresa nova: cria tenant      │
│ - Se existe: busca por domínio      │
└────────┬────────────────────────────┘
         │
         │ 5. Cria Collaborator
         ▼
┌─────────────────────────────────────┐
│ POST /api/collaborators             │
│ - tenantId                          │
│ - firebaseUid                       │
│ - name, email, role                 │
└────────┬────────────────────────────┘
         │
         │ 6. Login automático
         ▼
┌─────────────────────────────────────┐
│ signInWithEmailAndPassword          │
│ - Autentica no Firebase             │
│ - Redireciona para /dashboard      │
└─────────────────────────────────────┘
```

## 📝 Especificação Técnica

### Backend

#### 1. DTO de Registro
**Arquivo**: `backend/src/modules/auth/dto/register.dto.ts`

```typescript
export class RegisterDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(3)
  companyName: string;

  @IsOptional()
  @IsEnum(['pt', 'en', 'es'])
  preferredLanguage?: string;
}
```

#### 2. Endpoint de Registro
**Arquivo**: `backend/src/modules/auth/auth.controller.ts`

```typescript
@Post('register')
async register(@Body() registerDto: RegisterDto) {
  // 1. Criar usuário no Firebase
  // 2. Verificar se tenant existe (por domínio do email)
  // 3. Criar tenant se não existir
  // 4. Criar collaborator
  // 5. Retornar sucesso
}
```

#### 3. Lógica de Negócio
**Arquivo**: `backend/src/modules/auth/auth.service.ts`

```typescript
async registerUser(registerDto: RegisterDto) {
  // 1. Criar no Firebase
  const firebaseUser = await admin.auth().createUser({
    email: registerDto.email,
    password: registerDto.password,
    displayName: registerDto.name,
  });

  // 2. Buscar ou criar tenant
  const emailDomain = registerDto.email.split('@')[1];
  let tenant = await this.tenantModel.findOne({ emailDomain });

  if (!tenant) {
    tenant = await this.tenantModel.create({
      name: registerDto.companyName,
      emailDomain,
      defaultLanguage: registerDto.preferredLanguage || 'pt',
    });
  }

  // 3. Criar collaborator (primeiro = manager)
  const isFirstUser = await this.collaboratorModel.countDocuments({ tenantId: tenant._id }) === 0;

  const collaborator = await this.collaboratorModel.create({
    tenantId: tenant._id,
    firebaseUid: firebaseUser.uid,
    name: registerDto.name,
    email: registerDto.email,
    role: isFirstUser ? 'manager' : 'employee',
    preferredLanguage: registerDto.preferredLanguage || 'pt',
  });

  return {
    message: 'User registered successfully',
    collaborator,
    tenant,
  };
}
```

### Frontend

#### 1. Página de Registro
**Arquivo**: `frontend/src/pages/Register.tsx`

Campos:
- Nome completo
- Email corporativo
- Senha
- Confirmar senha
- Nome da empresa (se for primeiro usuário)
- Idioma preferido (dropdown)

#### 2. Rota de Registro
**Arquivo**: `frontend/src/App.tsx`

```typescript
<Route path="/register" element={<Register />} />
```

#### 3. Link na página de Login
**Arquivo**: `frontend/src/pages/Login.tsx`

```tsx
<p className="text-center text-sm">
  Não tem uma conta?{' '}
  <Link to="/register" className="text-primary hover:underline">
    Cadastre-se aqui
  </Link>
</p>
```

#### 4. API Client
**Arquivo**: `frontend/src/lib/api.ts`

```typescript
auth: {
  register: (data: RegisterData) =>
    api.post('/auth/register', data),
}
```

## 🔒 Segurança

### Validações Backend
- ✅ Email único (Firebase + MongoDB)
- ✅ Senha forte (min 6 caracteres, Firebase valida)
- ✅ Rate limiting (prevenir spam)
- ✅ Sanitização de inputs

### Validações Frontend
- ✅ Email formato válido
- ✅ Senha >= 6 caracteres
- ✅ Senha e confirmação devem ser iguais
- ✅ Nome não vazio
- ✅ Feedback visual em tempo real

## 📱 UX/UI

### Feedback Visual
- ✅ Loading state durante registro
- ✅ Mensagens de erro claras:
  - "Email já cadastrado"
  - "Senha muito fraca"
  - "Senhas não coincidem"
  - "Erro de conexão"
- ✅ Mensagem de sucesso
- ✅ Redirecionamento automático após sucesso

### Responsive
- ✅ Mobile-friendly
- ✅ Mesmo estilo visual do Login
- ✅ Tema dark/light mode

## 🧪 Casos de Teste

### Cenário 1: Primeiro Usuário da Empresa
1. Usuário preenche formulário
2. Sistema cria novo tenant
3. Usuário vira "manager" automaticamente
4. Redirecionado para dashboard

### Cenário 2: Segundo Usuário da Mesma Empresa
1. Usuário com email `@mesmaempresa.com`
2. Sistema encontra tenant existente
3. Usuário vira "employee"
4. Redirecionado para dashboard

### Cenário 3: Email Já Existe
1. Usuário tenta cadastrar email existente
2. Firebase retorna erro
3. Mensagem: "Este email já está cadastrado"

### Cenário 4: Senha Fraca
1. Usuário digita senha com menos de 6 caracteres
2. Frontend bloqueia submit
3. Mensagem: "A senha deve ter no mínimo 6 caracteres"

## 📦 Dependências Adicionais

### Backend
- ✅ firebase-admin (já instalado)
- ✅ class-validator (já instalado)

### Frontend
- ✅ react-router-dom (já instalado)
- ✅ axios (já instalado)

## 🚀 Ordem de Implementação

1. **Backend - DTOs e validações** ✓ Criar RegisterDto
2. **Backend - Service** ✓ Lógica de registro no AuthService
3. **Backend - Controller** ✓ Endpoint POST /auth/register
4. **Backend - Schema Tenant** ✓ Adicionar campo emailDomain
5. **Frontend - Página Register** ✓ UI/formulário
6. **Frontend - API client** ✓ Função de registro
7. **Frontend - Validações** ✓ Validação de formulário
8. **Frontend - Link no Login** ✓ Navegação Register ↔ Login
9. **Testes manuais** ✓ Testar fluxo completo
10. **Documentação** ✓ Atualizar CREDENCIAIS_TESTE.md

## 📄 Alterações em Schemas

### Tenant Schema
Adicionar campo opcional:
```typescript
emailDomain?: string; // Domínio do email para multi-tenant
```

Isso permite identificar automaticamente a qual empresa/tenant um novo usuário pertence baseado no domínio do email.

## 🎨 Wireframe da Tela de Registro

```
┌────────────────────────────────────────┐
│         🚀 1:1 Meeting System          │
│                                        │
│        Criar sua conta gratuita       │
│                                        │
│  Nome completo                         │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Email corporativo                     │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Senha (mínimo 6 caracteres)          │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Confirmar senha                       │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Nome da empresa                       │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Idioma preferido                      │
│  ┌──────────────────────────────────┐ │
│  │ Português ▼                      │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │        Criar Conta               │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Já tem uma conta? Faça login aqui    │
│                                        │
└────────────────────────────────────────┘
```

## ✅ Critérios de Aceitação

- [ ] Usuário consegue se registrar sem estar logado
- [ ] Firebase Authentication cria o usuário
- [ ] Collaborator é criado no MongoDB
- [ ] Tenant é criado ou vinculado corretamente
- [ ] Primeiro usuário vira manager automaticamente
- [ ] Mensagens de erro são claras e em português
- [ ] Loading states funcionam corretamente
- [ ] Redirecionamento automático após sucesso
- [ ] Validações client-side funcionam
- [ ] Validações server-side funcionam
- [ ] Email duplicado é detectado
- [ ] Sistema é responsivo (mobile + desktop)

---

**Pronto para começar a implementação!** 🚀
