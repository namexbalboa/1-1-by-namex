# 🔐 Credenciais de Teste

## Usuário Demo Criado no Banco de Dados

Um usuário foi criado automaticamente no banco de dados MongoDB com as seguintes informações:

- **Email**: `demo@example.com`
- **Nome**: Demo User
- **Role**: manager
- **Firebase UID**: `6a64wPyzgXejseJQURbLKVUldg93`
- **Tenant**: Demo Company

## ⚠️ IMPORTANTE: Próximos Passos

Para fazer login com este usuário, você precisa **criar o mesmo usuário no Firebase Authentication**:

### Opção 1: Criar Usuário via Firebase Console (Recomendado)

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto: `arch-svelten-fb`
3. Vá em **Authentication** → **Users**
4. Clique em **Add user**
5. Preencha:
   - **Email**: `demo@example.com`
   - **Password**: `Demo123!` (ou qualquer senha de sua escolha)
6. Copie o **UID** gerado pelo Firebase
7. Atualize o collaborator no banco de dados com o UID correto

### Opção 2: Usar um Usuário Firebase Existente

Se você já tem um usuário no Firebase:

1. Acesse o Firebase Console
2. Vá em **Authentication** → **Users**
3. Copie o **UID** do usuário
4. Atualize o collaborator no banco de dados:

```bash
curl -X PATCH http://localhost:8000/api/collaborators/69502bd0287df5f52a2e04f4 \
  -H "Content-Type: application/json" \
  -d '{"firebaseUid":"SEU_UID_AQUI"}'
```

### Opção 3: Criar Novo Collaborator para seu Usuário Firebase

Se preferir, crie um novo collaborator com seu Firebase UID:

```bash
curl -X POST http://localhost:8000/api/collaborators \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "69502bc9287df5f52a2e04f0",
    "firebaseUid": "SEU_UID_FIREBASE",
    "name": "Seu Nome",
    "email": "seu-email@exemplo.com",
    "role": "manager"
  }'
```

## 📝 Mensagens de Erro Implementadas

O sistema agora mostra mensagens de erro claras em português:

- **Email ou senha incorretos**: Credenciais inválidas no Firebase
- **Usuário não encontrado**: Email não existe no Firebase
- **Usuário não cadastrado no sistema**: Firebase OK, mas não existe no banco de dados
- **Erro de conexão**: Problemas de rede ou backend offline
- **Muitas tentativas**: Bloqueio temporário do Firebase por segurança

## 🎯 Testando o Sistema

Após criar o usuário no Firebase:

1. Acesse: `http://localhost:5173`
2. Use as credenciais:
   - Email: `demo@example.com`
   - Senha: A senha que você definiu no Firebase
3. O sistema deve:
   - Autenticar no Firebase
   - Buscar dados do collaborator no backend
   - Redirecionar para o Dashboard

## 🔍 Verificando Dados

### Ver todos os collaborators:
```bash
curl http://localhost:8000/api/collaborators
```

### Ver collaborator por Firebase UID:
```bash
curl http://localhost:8000/api/collaborators/firebase/SEU_UID
```

### Ver tenant:
```bash
curl http://localhost:8000/api/tenants/69502bc9287df5f52a2e04f0
```

## 💡 Dica

Para facilitar o desenvolvimento, recomendo criar um usuário de teste permanente no Firebase com credenciais simples, e depois criar o collaborator correspondente no banco de dados.
