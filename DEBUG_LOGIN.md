# 🔍 Guia de Debug - Problema de Login

## ✅ Status Atual

- ✅ Backend rodando na porta 8000
- ✅ Frontend rodando na porta 5173
- ✅ Firebase Authentication funcionando (login retorna 200 OK)
- ✅ Collaborator existe no banco de dados
- ❌ **Problema**: Login não completa o fluxo e não redireciona

## 🔬 Debug Passo a Passo

### 1. Abra o Console do Navegador

Pressione `F12` ou `Ctrl+Shift+I` e vá na aba **Console**

### 2. Faça Login com:
- **Email**: a@a.com
- **Senha**: (a senha que você usou no registro)

### 3. Verifique os Logs no Console

Você deve ver algo como:

```
🔑 Signing in with email: a@a.com
✅ Firebase sign in successful
🔐 Handling auth user: CWLfYpRUJYQ1CEf5Ma1V95ZEoem2 a@a.com
📡 Fetching collaborator from backend...
```

### 4. Cenários Possíveis

#### Cenário A: Sucesso Total
```
🔑 Signing in with email: a@a.com
✅ Firebase sign in successful
🔐 Handling auth user: CWLfYpRUJYQ1CEf5Ma1V95ZEoem2
📡 Fetching collaborator from backend...
✅ Collaborator found: {name: "Teste de User", ...}
✅ Auth flow completed successfully
```
→ **Você deve ser redirecionado para /dashboard**

#### Cenário B: Collaborator Não Encontrado (404)
```
🔑 Signing in with email: a@a.com
✅ Firebase sign in successful
🔐 Handling auth user: CWLfYpRUJYQ1CEf5Ma1V95ZEoem2
📡 Fetching collaborator from backend...
❌ Error fetching collaborator data: AxiosError
Error details: {status: 404, ...}
🚪 Signing out user due to error
```
→ **Mensagem de erro**: "Usuário não cadastrado no sistema"

#### Cenário C: Erro de Rede
```
🔑 Signing in with email: a@a.com
✅ Firebase sign in successful
🔐 Handling auth user: CWLfYpRUJYQ1CEf5Ma1V95ZEoem2
📡 Fetching collaborator from backend...
❌ Error fetching collaborator data: AxiosError
Error details: {code: "ERR_NETWORK", ...}
🚪 Signing out user due to error
```
→ **Mensagem de erro**: "Erro de conexão com o servidor"

## 🔧 Soluções por Cenário

### Se você vê: Erro 404 (Collaborator Não Encontrado)

O Firebase UID não bate com o banco de dados. Verifique:

```bash
# 1. Ver qual UID o Firebase criou
# Veja no console do navegador: "🔐 Handling auth user: [UID]"

# 2. Buscar collaborator com esse UID
curl http://localhost:8000/api/collaborators/firebase/SEU_UID_AQUI
```

**Solução**: Atualizar o collaborator no banco com o UID correto:

```bash
curl -X PATCH http://localhost:8000/api/collaborators/ID_DO_COLLABORATOR \
  -H "Content-Type: application/json" \
  -d '{"firebaseUid":"UID_DO_FIREBASE"}'
```

### Se você vê: ERR_NETWORK

O backend não está respondendo. Verifique:

```bash
# Teste se o backend está rodando
curl http://localhost:8000/api/health

# Se não responder, reinicie o backend
cd backend
npm run start:dev
```

### Se você vê: Nada acontece (sem logs)

O frontend pode não estar atualizado. Faça:

```bash
# Parar o frontend (Ctrl+C)
cd frontend
npm run dev
# Recarregue a página (Ctrl+Shift+R)
```

## 🧪 Teste Manual do Fluxo Completo

### Passo 1: Verifique o Backend
```bash
# Health check
curl http://localhost:8000/api/health

# Listar todos os collaborators
curl http://localhost:8000/api/collaborators

# Buscar por Firebase UID específico
curl http://localhost:8000/api/collaborators/firebase/CWLfYpRUJYQ1CEf5Ma1V95ZEoem2
```

### Passo 2: Teste o Endpoint de Registro
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Usuario",
    "email": "novo@teste.com",
    "password": "123456",
    "companyName": "Teste Corp",
    "preferredLanguage": "pt"
  }'
```

Se retornar sucesso, você verá:
```json
{
  "message": "User registered successfully",
  "user": { "uid": "...", "email": "novo@teste.com" },
  "collaborator": { ... },
  "tenant": { ... }
}
```

### Passo 3: Faça Login na Interface
1. Acesse `http://localhost:5173/login`
2. Use as credenciais:
   - Email: `novo@teste.com`
   - Senha: `123456`
3. Verifique o console (F12)
4. Deve redirecionar para `/dashboard`

## 📊 Dados Atuais no Sistema

### Usuário Existente
- **Email**: a@a.com
- **Nome**: Teste de User
- **Firebase UID**: CWLfYpRUJYQ1CEf5Ma1V95ZEoem2
- **Role**: manager
- **Tenant**: Teste
- **Collaborator ID**: 69502e609799d27dc4dc1962

### Para Testar Login com Este Usuário

1. Certifique-se que a senha está correta no Firebase
2. Tente fazer login
3. Abra o console (F12) e veja os logs
4. Copie os logs e compartilhe se houver erro

## 🐛 Logs Esperados em Caso de Sucesso

```
Console do Navegador:
🔑 Signing in with email: a@a.com
✅ Firebase sign in successful
🔐 Handling auth user: CWLfYpRUJYQ1CEf5Ma1V95ZEoem2 a@a.com
📡 Fetching collaborator from backend...
✅ Collaborator found: {
  _id: '69502e609799d27dc4dc1962',
  name: 'Teste de User',
  email: 'a@a.com',
  role: 'manager',
  ...
}
✅ Auth flow completed successfully
```

**Network Tab (F12 → Network)**:
```
GET http://localhost:8000/api/collaborators/firebase/CWLfYpRUJYQ1CEf5Ma1V95ZEoem2
Status: 200 OK
Response: {_id: "...", name: "Teste de User", ...}
```

## 🎯 Próximos Passos

1. **Abra o console do navegador** (F12)
2. **Tente fazer login** com `a@a.com`
3. **Copie todos os logs** que aparecerem
4. **Veja a aba Network** (F12 → Network) e verifique:
   - Requisição para `/api/collaborators/firebase/...`
   - Status code (200, 404, etc.)
   - Response body

5. **Compartilhe os logs** para eu ajudar a identificar o problema específico

---

**Desenvolvido com ❤️ - Debug Mode Ativado**
