# 📡 API Endpoints - 1:1 Meeting Management

**Base URL:** `http://localhost:3000/api`

## 🏥 Health Check

### Verificar Status do Sistema
```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-25T22:00:00.000Z",
  "service": "1-1 Meeting Management API"
}
```

---

## 🏢 Tenants (Empresas)

### Listar Todos os Tenants
```
GET /tenants
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Empresa Teste",
    "logo": "https://...",
    "primaryColor": "#0EA5E9",
    "defaultLanguage": "pt",
    "isActive": true,
    "createdAt": "2025-12-25T22:00:00.000Z",
    "updatedAt": "2025-12-25T22:00:00.000Z"
  }
]
```

### Buscar Tenant por ID
```
GET /tenants/:id
```

### Criar Novo Tenant
```
POST /tenants
```

**Body:**
```json
{
  "name": "Minha Empresa",
  "logo": "https://exemplo.com/logo.png",
  "primaryColor": "#0EA5E9",
  "defaultLanguage": "pt"
}
```

### Atualizar Tenant
```
PATCH /tenants/:id
```

**Body (todos os campos são opcionais):**
```json
{
  "name": "Novo Nome",
  "primaryColor": "#10B981",
  "defaultLanguage": "en",
  "isActive": false
}
```

### Desativar Tenant (Soft Delete)
```
DELETE /tenants/:id
```

---

## 👥 Collaborators (Colaboradores)

### Listar Todos os Colaboradores
```
GET /collaborators
GET /collaborators?tenantId=507f1f77bcf86cd799439011
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "tenantId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Empresa Teste",
      "logo": "https://..."
    },
    "firebaseUid": "abc123",
    "name": "João Silva",
    "email": "joao@empresa.com",
    "role": "manager",
    "managerId": null,
    "preferredLanguage": "pt",
    "isActive": true
  }
]
```

### Buscar Colaborador por ID
```
GET /collaborators/:id
```

### Buscar Colaborador por Firebase UID
```
GET /collaborators/firebase/:uid
```

### Buscar Colaboradores de um Manager
```
GET /collaborators/manager/:managerId
```

### Criar Novo Colaborador
```
POST /collaborators
```

**Body:**
```json
{
  "tenantId": "507f1f77bcf86cd799439011",
  "firebaseUid": "firebase_uid_here",
  "name": "Maria Santos",
  "email": "maria@empresa.com",
  "role": "employee",
  "managerId": "507f1f77bcf86cd799439012",
  "preferredLanguage": "pt"
}
```

**Validações:**
- `role`: `"manager"` ou `"employee"`
- `preferredLanguage`: `"pt"`, `"en"` ou `"es"`
- `managerId`: Deve ser um manager válido (opcional)

### Atualizar Colaborador
```
PATCH /collaborators/:id
```

**Body (todos os campos são opcionais):**
```json
{
  "name": "Maria Santos Silva",
  "managerId": "507f1f77bcf86cd799439013",
  "preferredLanguage": "en",
  "isActive": false
}
```

### Atualizar Idioma Preferido
```
PATCH /collaborators/:id/language
```

**Body:**
```json
{
  "preferredLanguage": "en"
}
```

### Desativar Colaborador (Soft Delete)
```
DELETE /collaborators/:id
```

---

## 📅 Meetings (Reuniões)

### Criar Jornada Anual
```
POST /meetings/journeys
```

**Body:**
```json
{
  "tenantId": "507f1f77bcf86cd799439011",
  "collaboratorId": "507f1f77bcf86cd799439012",
  "managerId": "507f1f77bcf86cd799439013",
  "year": 2025
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "tenantId": "507f1f77bcf86cd799439011",
  "collaboratorId": "507f1f77bcf86cd799439012",
  "managerId": "507f1f77bcf86cd799439013",
  "year": 2025,
  "meetings": [],
  "createdAt": "2025-12-25T22:00:00.000Z",
  "updatedAt": "2025-12-25T22:00:00.000Z"
}
```

### Buscar Jornada por Colaborador e Ano
```
GET /meetings/journeys/:collaboratorId/:year
```

**Example:** `GET /meetings/journeys/507f1f77bcf86cd799439012/2025`

### Buscar Jornadas por Manager
```
GET /meetings/journeys/manager/:managerId
```

### Adicionar Reunião à Jornada
```
POST /meetings/journeys/:journeyId/meetings
```

**Body:**
```json
{
  "meetingNumber": 1,
  "date": "2025-12-25T10:00:00.000Z",
  "actionItems": [
    {
      "description": "Revisar código do projeto X",
      "status": "pending"
    }
  ],
  "pulseHistory": [
    { "week": 1, "value": 4 },
    { "week": 2, "value": 5 }
  ],
  "blockA": {
    "timeDistribution": {
      "execution": 60,
      "meetings": 30,
      "resolution": 10
    },
    "blockers": {
      "level": "yellow",
      "tags": ["infraestrutura", "dependencias"]
    },
    "toolAdequacy": 4,
    "priorityClarity": 8
  },
  "blockB": {
    "goalConnection": 5,
    "autonomy": 80,
    "innovation": true
  },
  "blockC": {
    "psychologicalSafety": 5,
    "collaborationFriction": 3,
    "recognition": "high"
  },
  "blockD": {
    "intellectualChallenge": {
      "skill": 7,
      "challenge": 8
    },
    "strengthsUtilization": 85,
    "activeLearning": ["lideranca", "arquitetura"],
    "mentalHealth": 4,
    "biweeklyFocus": "Melhorar arquitetura do sistema de autenticação"
  }
}
```

### Buscar Reunião Específica
```
GET /meetings/journeys/:journeyId/meetings/:meetingNumber
```

**Example:** `GET /meetings/journeys/507f1f77bcf86cd799439014/meetings/1`

### Atualizar Reunião
```
PATCH /meetings/journeys/:journeyId/meetings/:meetingNumber
```

**Body (todos os campos são opcionais):**
```json
{
  "blockA": {
    "toolAdequacy": 5,
    "priorityClarity": 9
  }
}
```

### Deletar Reunião
```
DELETE /meetings/journeys/:journeyId/meetings/:meetingNumber
```

---

## 📊 Estrutura de Dados

### ActionItem
```typescript
{
  description: string,
  status: 'done' | 'pending' | 'blocked'
}
```

### PulseHistoryItem
```typescript
{
  week: number,
  value: number // 1-5
}
```

### BlockA (Operacional)
```typescript
{
  timeDistribution: {
    execution: number,    // 0-100%
    meetings: number,     // 0-100%
    resolution: number    // 0-100%
  },
  blockers: {
    level: 'green' | 'yellow' | 'red',
    tags: string[]
  },
  toolAdequacy: number,      // 1-5
  priorityClarity: number    // 1-10
}
```

### BlockB (Estratégia)
```typescript
{
  goalConnection: number,  // 1-5
  autonomy: number,        // 0-100%
  innovation: boolean
}
```

### BlockC (Dinâmica Humana)
```typescript
{
  psychologicalSafety: number,     // 1-5
  collaborationFriction: number,   // 1-10
  recognition: 'low' | 'medium' | 'high'
}
```

### BlockD (Desenvolvimento)
```typescript
{
  intellectualChallenge: {
    skill: number,      // 1-10
    challenge: number   // 1-10
  },
  strengthsUtilization: number,  // 0-100%
  activeLearning: string[],
  mentalHealth: number,          // 1-5
  biweeklyFocus: string          // max 200 chars
}
```

---

## 🔒 Autenticação (A Implementar)

Todos os endpoints (exceto `/health`) requererão autenticação Firebase no futuro:

```
Authorization: Bearer <firebase_token>
```

---

## ❌ Códigos de Erro

- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request (validação falhou)
- `401` - Unauthorized (não autenticado)
- `403` - Forbidden (sem permissão)
- `404` - Not Found
- `409` - Conflict (recurso já existe)
- `500` - Internal Server Error

### Exemplo de Erro
```json
{
  "statusCode": 404,
  "message": "Tenant not found",
  "error": "Not Found"
}
```

---

## 🧪 Testando com cURL

### Criar um Tenant
```bash
curl -X POST http://localhost:3000/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Empresa Teste",
    "defaultLanguage": "pt"
  }'
```

### Criar um Colaborador
```bash
curl -X POST http://localhost:3000/api/collaborators \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "SEU_TENANT_ID",
    "firebaseUid": "test_uid_123",
    "name": "João Silva",
    "email": "joao@teste.com",
    "role": "manager",
    "preferredLanguage": "pt"
  }'
```

### Criar uma Jornada
```bash
curl -X POST http://localhost:3000/api/meetings/journeys \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "SEU_TENANT_ID",
    "collaboratorId": "SEU_COLLABORATOR_ID",
    "managerId": "SEU_MANAGER_ID",
    "year": 2025
  }'
```

---

**Status:** Atualizado em 25/12/2025
**Versão da API:** 1.0.0
