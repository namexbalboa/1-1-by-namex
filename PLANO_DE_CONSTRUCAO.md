# PLANO DE CONSTRUÇÃO - Sistema SaaS de Gestão de Reuniões 1:1

## 📋 Visão Geral
Sistema SaaS Multi-tenant para gestão de reuniões 1:1 entre Gerente e Colaborador, com suporte multi-idioma (pt-BR, en-US, es-ES) e metodologia 15+15 minutos.

---

## 🏗️ FASE 1: SETUP E CONFIGURAÇÃO INICIAL

### 1.1 Estrutura de Pastas e Dependências

#### Backend (NestJS)
```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── tenants/
│   │   ├── collaborators/
│   │   ├── meetings/
│   │   ├── analytics/
│   │   └── i18n/
│   ├── common/
│   │   ├── decorators/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── filters/
│   │   └── dto/
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── firebase.config.ts
│   │   └── i18n.config.ts
│   └── main.ts
├── locales/
│   ├── pt.json
│   ├── en.json
│   └── es.json
├── package.json
└── tsconfig.json
```

**Dependências Backend:**
- @nestjs/core, @nestjs/common, @nestjs/platform-express
- @nestjs/typeorm, typeorm, mongoose, @nestjs/mongoose
- firebase-admin
- nestjs-i18n
- class-validator, class-transformer
- @nestjs/jwt, passport, passport-jwt

#### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/ (shadcn/ui components)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── select.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ... (outros componentes shadcn)
│   │   ├── auth/
│   │   ├── layout/
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── meetings/
│   │   │   ├── retrospective/
│   │   │   └── pulse/
│   │   │       ├── BlockA/
│   │   │       ├── BlockB/
│   │   │       ├── BlockC/
│   │   │       └── BlockD/
│   │   ├── reports/
│   │   └── common/
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── meetingStore.ts
│   │   ├── i18nStore.ts
│   │   └── themeStore.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── firebase.ts
│   │   └── i18n.ts
│   ├── locales/
│   │   ├── pt.json
│   │   ├── en.json
│   │   └── es.json
│   ├── types/
│   ├── hooks/
│   ├── utils/
│   ├── lib/
│   │   └── utils.ts (cn helper para classes)
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── components.json (shadcn config)
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

**Dependências Frontend:**
- react, react-dom, react-router-dom
- zustand
- i18next, react-i18next
- firebase
- axios
- recharts (para gráficos)
- **shadcn/ui** (componentes UI)
- tailwindcss (estilização)
- tailwindcss-animate
- class-variance-authority, clsx, tailwind-merge
- lucide-react (ícones)
- next-themes (dark mode)

---

## 🔧 FASE 2: BACKEND - INFRAESTRUTURA CORE

### 2.1 Configuração do NestJS e MongoDB

**Tarefas:**
1. Inicializar projeto NestJS
2. Configurar conexão MongoDB via Mongoose
3. Criar configurações de ambiente (.env)
4. Configurar CORS e headers de segurança

**Arquivos:**
- `src/config/database.config.ts`
- `src/config/env.validation.ts`
- `src/main.ts`

### 2.2 Sistema de Autenticação (Firebase)

**Tarefas:**
1. Configurar Firebase Admin SDK
2. Criar AuthGuard para proteção de rotas
3. Implementar decorator @CurrentUser
4. Criar estratégia JWT + Firebase

**Módulo:** `src/modules/auth/`
- `auth.module.ts`
- `auth.service.ts`
- `auth.controller.ts`
- `firebase.strategy.ts`
- `auth.guard.ts`

### 2.3 Sistema de Internacionalização (i18n)

**Tarefas:**
1. Configurar nestjs-i18n
2. Criar interceptor para Accept-Language
3. Configurar arquivos de tradução (locales/)
4. Implementar validação de DTOs com mensagens traduzidas

**Módulo:** `src/modules/i18n/`
- `i18n.module.ts`
- `i18n.interceptor.ts`
- `locales/pt.json`
- `locales/en.json`
- `locales/es.json`

**Estrutura de tradução:**
```json
{
  "errors": {
    "validation": {
      "required": "Campo obrigatório",
      "email": "Email inválido"
    }
  },
  "success": {
    "created": "Criado com sucesso"
  }
}
```

---

## 💾 FASE 3: BACKEND - MODELAGEM E MÓDULOS

### 3.1 Módulo Tenants

**Schema (MongoDB):**
```typescript
{
  name: string,
  logo: string,
  primaryColor: string,
  defaultLanguage: 'pt' | 'en' | 'es',
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Endpoints:**
- POST /tenants
- GET /tenants/:id
- PATCH /tenants/:id
- DELETE /tenants/:id

### 3.2 Módulo Collaborators

**Schema (MongoDB):**
```typescript
{
  tenantId: ObjectId,
  firebaseUid: string,
  name: string,
  email: string,
  role: 'manager' | 'employee',
  managerId: ObjectId | null,
  preferredLanguage: 'pt' | 'en' | 'es',
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Endpoints:**
- POST /collaborators
- GET /collaborators
- GET /collaborators/:id
- PATCH /collaborators/:id
- PATCH /collaborators/:id/language
- DELETE /collaborators/:id

### 3.3 Módulo Meetings

**Schema Principal (Meeting_Journeys):**
```typescript
{
  tenantId: ObjectId,
  collaboratorId: ObjectId,
  managerId: ObjectId,
  year: number,
  meetings: [
    {
      meetingNumber: number,
      date: Date,

      // FASE 1: RETROSPECTIVA
      actionItems: [
        {
          description: string,
          status: 'done' | 'pending' | 'blocked',
          createdAt: Date
        }
      ],
      pulseHistory: [
        { week: number, value: number }
      ],

      // FASE 2: PULSO E FUTURO
      blockA: {
        timeDistribution: { execution: number, meetings: number, resolution: number },
        blockers: { level: 'green' | 'yellow' | 'red', tags: string[] },
        toolAdequacy: number,
        priorityClarity: number
      },
      blockB: {
        goalConnection: number,
        autonomy: number,
        innovation: boolean
      },
      blockC: {
        psychologicalSafety: number,
        collaborationFriction: number,
        recognition: 'low' | 'medium' | 'high'
      },
      blockD: {
        intellectualChallenge: { skill: number, challenge: number },
        strengthsUtilization: number,
        activeLearning: string[],
        mentalHealth: number,
        biweeklyFocus: string
      }
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**Endpoints:**
- POST /meetings/journeys
- GET /meetings/journeys/:collaboratorId/:year
- POST /meetings/journeys/:journeyId/meetings
- PATCH /meetings/journeys/:journeyId/meetings/:meetingNumber
- GET /meetings/journeys/:journeyId/meetings/:meetingNumber

### 3.4 Módulo Analytics

**Tarefas:**
1. Criar agregações para relatório anual
2. Gerar dados para infográfico timeline
3. Calcular médias e tendências

**Endpoints:**
- GET /analytics/annual-report/:collaboratorId/:year
- GET /analytics/trends/:collaboratorId
- GET /analytics/team-overview/:managerId

### 3.5 Sistema de Tags Multilíngue

**Schema (Tags):**
```typescript
{
  tenantId: ObjectId,
  category: 'blocker' | 'learning',
  labels: {
    pt: string,
    en: string,
    es: string
  },
  isActive: boolean
}
```

**Endpoints:**
- POST /tags
- GET /tags?category=blocker&language=pt
- PATCH /tags/:id
- DELETE /tags/:id

---

## 🎨 FASE 4: FRONTEND - INFRAESTRUTURA CORE

### 4.1 Configuração Inicial

**Tarefas:**
1. Inicializar projeto com Vite
2. Configurar TailwindCSS + shadcn/ui
3. Configurar sistema de temas (Light/Dark Mode)
4. Configurar roteamento (React Router)
5. Configurar estrutura de pastas

**Arquivos:**
- `vite.config.ts` (com code-splitting para locales)
- `tailwind.config.js`
- `components.json` (shadcn config)
- `src/styles/globals.css`
- `src/lib/utils.ts`
- `src/main.tsx`
- `src/App.tsx`

#### 4.1.1 Configuração do Tema e Cores (shadcn/ui)

**Paleta de Cores:**

**Light Mode:**
```css
:root {
  /* Primary: Azul Claro */
  --primary: 199 89% 48%; /* hsl(199, 89%, 48%) - #0EA5E9 (sky-500) */
  --primary-foreground: 0 0% 100%; /* texto branco */

  /* Secondary: Verde Claro */
  --secondary: 142 71% 45%; /* hsl(142, 71%, 45%) - #10B981 (green-500) */
  --secondary-foreground: 0 0% 100%;

  /* Background e Cards */
  --background: 0 0% 100%; /* branco */
  --foreground: 222 47% 11%; /* texto escuro */
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;

  /* Bordas e inputs */
  --border: 214 32% 91%; /* cinza muito claro */
  --input: 214 32% 91%;
  --ring: 199 89% 48%; /* mesmo que primary */

  /* Muted (elementos secundários) */
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;

  /* Accent (hover states) */
  --accent: 210 40% 96%;
  --accent-foreground: 222 47% 11%;

  /* Destrutivos */
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;

  /* Radius */
  --radius: 0.5rem;
}
```

**Dark Mode (Cinza Claro):**
```css
.dark {
  /* Primary: Azul Claro (mais brilhante no dark) */
  --primary: 199 89% 58%; /* #38BDF8 (sky-400) */
  --primary-foreground: 222 47% 11%;

  /* Secondary: Verde Claro (mais brilhante no dark) */
  --secondary: 142 76% 56%; /* #34D399 (green-400) */
  --secondary-foreground: 222 47% 11%;

  /* Background e Cards - Cinza Claro */
  --background: 220 13% 18%; /* #2D3748 (gray-700) */
  --foreground: 210 40% 98%; /* texto quase branco */
  --card: 217 19% 27%; /* #374151 (gray-600) */
  --card-foreground: 210 40% 98%;

  /* Bordas e inputs */
  --border: 215 28% 32%; /* #4B5563 (gray-500) */
  --input: 215 28% 32%;
  --ring: 199 89% 58%;

  /* Muted */
  --muted: 217 19% 27%;
  --muted-foreground: 215 20% 65%;

  /* Accent */
  --accent: 217 19% 27%;
  --accent-foreground: 210 40% 98%;

  /* Destrutivos */
  --destructive: 0 63% 31%;
  --destructive-foreground: 0 0% 100%;
}
```

**Arquivo:** `src/styles/globals.css`

#### 4.1.2 Configuração do Tailwind

**Arquivo:** `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

#### 4.1.3 Inicialização do shadcn/ui

**Comandos:**
```bash
cd frontend
npx shadcn-ui@latest init
```

**Configuração `components.json`:**
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

**Instalar componentes iniciais:**
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add select
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add tooltip
```

### 4.2 Sistema de Temas (Dark Mode)

**Tarefas:**
1. Configurar next-themes
2. Criar ThemeProvider
3. Criar ThemeToggle component
4. Criar themeStore (Zustand)
5. Persistir preferência de tema

**Arquivos:**

#### 4.2.1 ThemeProvider

**Arquivo:** `src/components/layout/ThemeProvider.tsx`

```tsx
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

#### 4.2.2 ThemeToggle (Switch entre Light/Dark)

**Arquivo:** `src/components/layout/ThemeToggle.tsx`

```tsx
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t('theme.toggle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {t('theme.light')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {t('theme.dark')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

#### 4.2.3 Integração no App.tsx

**Arquivo:** `src/App.tsx`

```tsx
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {/* Seu app aqui */}
      <header>
        <ThemeToggle />
      </header>
    </ThemeProvider>
  );
}
```

#### 4.2.4 Theme Store (Zustand)

**Arquivo:** `src/stores/themeStore.ts`

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
    }),
    {
      name: 'theme-storage',
    }
  )
);
```

**Traduções para tema:**

`locales/pt.json`:
```json
{
  "theme": {
    "toggle": "Alternar tema",
    "light": "Claro",
    "dark": "Escuro"
  }
}
```

### 4.3 Sistema de Internacionalização

**Tarefas:**
1. Configurar i18next com react-i18next
2. Criar hook useTranslation customizado
3. Implementar detecção automática de idioma
4. Criar componente LanguageSelector

**Arquivos:**
- `src/services/i18n.ts`
- `src/components/common/LanguageSelector.tsx`
- `src/locales/pt.json`
- `src/locales/en.json`
- `src/locales/es.json`

**Estrutura de tradução:**
```json
{
  "auth": {
    "login": "Entrar",
    "logout": "Sair"
  },
  "meeting": {
    "retrospective": "Retrospectiva",
    "pulse": "Pulso",
    "actionItems": {
      "title": "Itens de Ação",
      "status": {
        "done": "Feito",
        "pending": "Pendente",
        "blocked": "Bloqueado"
      }
    }
  },
  "blocks": {
    "a": {
      "title": "Operacional",
      "timeDistribution": "Distribuição de Tempo"
    }
  }
}
```

### 4.4 Autenticação com Firebase

**Tarefas:**
1. Configurar Firebase SDK
2. Criar AuthContext/Store (Zustand)
3. Implementar login/logout
4. Criar ProtectedRoute
5. Persistir token e sincronizar com preferredLanguage

**Arquivos:**
- `src/services/firebase.ts`
- `src/stores/authStore.ts`
- `src/components/auth/LoginPage.tsx`
- `src/components/auth/ProtectedRoute.tsx`

### 4.5 Gerenciamento de Estado (Zustand)

**Stores:**
1. **authStore**: usuário, token, tenant
2. **meetingStore**: reunião atual, histórico
3. **i18nStore**: idioma atual, preferências
4. **themeStore**: tema atual (light/dark)

**Arquivos:**
- `src/stores/authStore.ts`
- `src/stores/meetingStore.ts`
- `src/stores/i18nStore.ts`
- `src/stores/themeStore.ts`

### 4.6 Serviço de API (Axios)

**Tarefas:**
1. Configurar instância Axios
2. Adicionar interceptor para token
3. Adicionar interceptor para Accept-Language
4. Tratamento de erros global

**Arquivo:** `src/services/api.ts`

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token e idioma
api.interceptors.request.use(config => {
  const token = authStore.getState().token;
  const language = i18nStore.getState().currentLanguage;

  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (language) config.headers['Accept-Language'] = language;

  return config;
});
```

---

## 🎨 DESIGN SYSTEM E PRINCÍPIOS DE UI

### Design Limpo e Minimalista

O sistema segue os princípios de design limpo com shadcn/ui:

**Características:**
- ✨ Interface minimalista e moderna
- 🎨 Cores suaves: Azul claro (primário) e Verde claro (secundário)
- 🌓 Dark mode com cinza claro (não preto puro)
- 📏 Espaçamento consistente e arejado
- 🔤 Tipografia clara e legível
- 🎯 Foco na experiência do usuário

**Componentes Padronizados (shadcn/ui):**
- **Buttons**: Variantes primary, secondary, outline, ghost
- **Cards**: Containers com sombra suave e bordas arredondadas
- **Inputs**: Campos com bordas sutis e estados de foco claros
- **Badges**: Labels coloridos para status
- **Progress**: Barras de progresso animadas
- **Sliders**: Controles deslizantes suaves
- **Tooltips**: Dicas contextuais discretas

**Responsividade:**
- Desktop first (1024px+)
- Tablets em modo paisagem (768px+)
- Não otimizado para mobile (conforme especificação)

**Acessibilidade:**
- Alto contraste em ambos os temas
- ARIA labels em todos os elementos interativos
- Navegação por teclado
- Estados de foco visíveis

**Animações:**
- Transições suaves entre temas
- Feedback visual em interações
- Loading states elegantes
- Micro-interações discretas

---

## 📊 FASE 5: FRONTEND - COMPONENTES DE REUNIÃO

**Nota sobre Design:**
Todos os componentes abaixo devem utilizar componentes shadcn/ui como base, garantindo consistência visual e acessibilidade. Cards devem ter classe `bg-card text-card-foreground` para respeitar o tema atual.

### 5.1 FASE 1: Retrospectiva (0-15 Min)

**Componentes:**

#### 5.1.1 ActionItemsList
- Lista de tarefas com status
- Filtros por status
- Adicionar/editar/remover itens
- Labels traduzidas (Feito/Done/Hecho)

**Arquivo:** `src/components/meetings/retrospective/ActionItemsList.tsx`

**Exemplo de Implementação (shadcn/ui):**
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ActionItemsList() {
  const { t } = useTranslation();

  return (
    <Card className="bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t('meeting.actionItems.title')}
          <Button size="sm" className="bg-primary text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" />
            {t('meeting.actionItems.add')}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Lista de itens com badges de status */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent">
            <Checkbox id="item-1" />
            <label htmlFor="item-1" className="flex-1">Revisar código</label>
            <Badge variant="secondary">{t('meeting.actionItems.status.done')}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

#### 5.1.2 PulseHistory
- Gráfico de linha (últimas 4 semanas)
- Eixo Y: 1-5 (humor)
- Tooltip com datas

**Arquivo:** `src/components/meetings/retrospective/PulseHistory.tsx`

### 5.2 FASE 2: Bloco A - Operacional (15-30 Min)

**Componentes:**

#### 5.2.1 TimeDistributionChart
- Gráfico de Pizza
- 3 segmentos: Execução, Reuniões, Resolução
- Labels traduzidas

**Arquivo:** `src/components/meetings/pulse/BlockA/TimeDistributionChart.tsx`

#### 5.2.2 BlockersInput
- Semáforo (Verde/Amarelo/Vermelho)
- Nuvem de tags multilíngue
- Busca de tags existentes

**Arquivo:** `src/components/meetings/pulse/BlockA/BlockersInput.tsx`

#### 5.2.3 ToolAdequacySlider
- Escala visual de ícones (1-5)
- Ícones: 😞 → 😐 → 😊

**Arquivo:** `src/components/meetings/pulse/BlockA/ToolAdequacySlider.tsx`

#### 5.2.4 PriorityClarity
- Slider de "Confuso" a "Cristalino"
- Escala 1-10

**Arquivo:** `src/components/meetings/pulse/BlockA/PriorityClarity.tsx`

### 5.3 FASE 2: Bloco B - Estratégia

**Componentes:**

#### 5.3.1 GoalConnection
- Ícone de alvo
- Escala 1-5 (distante → conectado)

**Arquivo:** `src/components/meetings/pulse/BlockB/GoalConnection.tsx`

#### 5.3.2 PerceivedAutonomy
- Barra de progresso (0-100%)

**Arquivo:** `src/components/meetings/pulse/BlockB/PerceivedAutonomy.tsx`

#### 5.3.3 InnovationToggle
- Checkbox Sim/Não

**Arquivo:** `src/components/meetings/pulse/BlockB/InnovationToggle.tsx`

### 5.4 FASE 2: Bloco C - Dinâmica Humana

**Componentes:**

#### 5.4.1 PsychologicalSafety
- Escala de Emojis (1-5)
- 😰 → 😟 → 😐 → 🙂 → 😊

**Arquivo:** `src/components/meetings/pulse/BlockC/PsychologicalSafety.tsx`

#### 5.4.2 CollaborationFriction
- Heatmap (Azul → Verde → Amarelo → Vermelho)
- Escala 1-10

**Arquivo:** `src/components/meetings/pulse/BlockC/CollaborationFriction.tsx`

#### 5.4.3 RecognitionLevel
- Botão tripla escolha: Baixo / Médio / Alto

**Arquivo:** `src/components/meetings/pulse/BlockC/RecognitionLevel.tsx`

### 5.5 FASE 2: Bloco D - Desenvolvimento

**Componentes:**

#### 5.5.1 FlowChart
- Gráfico X/Y (Skill vs Challenge)
- Quadrantes: Tédio, Flow, Ansiedade, Apatia

**Arquivo:** `src/components/meetings/pulse/BlockD/FlowChart.tsx`

#### 5.5.2 StrengthsUtilization
- Ícone de bateria (0-100%)
- Visual: bateria vazia → cheia

**Arquivo:** `src/components/meetings/pulse/BlockD/StrengthsUtilization.tsx`

#### 5.5.3 ActiveLearning
- Nuvem de tags multilíngue
- Tags de competências (Liderança/Leadership/Liderazgo)

**Arquivo:** `src/components/meetings/pulse/BlockD/ActiveLearning.tsx`

#### 5.5.4 MentalHealth
- Ícones de cérebro (1-5)
- 🧠 (triste) → 🧠 (feliz)

**Arquivo:** `src/components/meetings/pulse/BlockD/MentalHealth.tsx`

#### 5.5.5 BiweeklyFocus
- Campo de texto único
- Máximo 200 caracteres

**Arquivo:** `src/components/meetings/pulse/BlockD/BiweeklyFocus.tsx`

### 5.6 Navegação e Timer

**Componentes:**

#### 5.6.1 MeetingTimer
- Cronômetro de 30 minutos
- Visual: 0-15min (Retrospectiva), 15-30min (Pulso)
- Alertas em 15min e 30min

**Arquivo:** `src/components/meetings/MeetingTimer.tsx`

#### 5.6.2 MeetingNavigator
- Stepper: Retrospectiva → Bloco A → B → C → D
- Progresso visual

**Arquivo:** `src/components/meetings/MeetingNavigator.tsx`

---

## 📈 FASE 6: FRONTEND - RELATÓRIOS E DASHBOARD

### 6.1 Dashboard Principal

**Componentes:**
- Resumo de reuniões recentes
- Próximas reuniões agendadas
- Métricas rápidas (média de pulso, ações pendentes)

**Arquivo:** `src/components/dashboard/Dashboard.tsx`

### 6.2 Relatório Anual (Infográfico Timeline)

**Tarefas:**
1. Renderizar timeline anual
2. Gráficos de tendências (pulso, bloqueadores, aprendizado)
3. Exportar como PDF
4. Labels no idioma do visualizador

**Componentes:**
- `src/components/reports/AnnualReport.tsx`
- `src/components/reports/TrendChart.tsx`
- `src/components/reports/ExportButton.tsx`

**Visualizações:**
- Linha do tempo com todas as reuniões
- Gráfico de evolução do pulso
- Nuvem de tags de aprendizado acumulado
- Heatmap de bloqueadores por categoria
- Evolução do flow (skill vs challenge)

---

## 🧪 FASE 7: TESTES E QUALIDADE

### 7.1 Testes Backend

**Tarefas:**
1. Testes unitários (Jest)
2. Testes de integração (Supertest)
3. Testes de autenticação
4. Testes de i18n

**Estrutura:**
```
backend/test/
├── unit/
│   ├── services/
│   └── controllers/
└── e2e/
    ├── auth.e2e-spec.ts
    ├── meetings.e2e-spec.ts
    └── i18n.e2e-spec.ts
```

### 7.2 Testes Frontend

**Tarefas:**
1. Testes de componentes (Vitest + React Testing Library)
2. Testes de stores (Zustand)
3. Testes de i18n
4. Testes E2E (Playwright)

**Estrutura:**
```
frontend/test/
├── components/
├── stores/
└── e2e/
```

---

## 🚀 FASE 8: DEPLOY E CI/CD

### 8.1 Configuração de Ambientes

**Ambientes:**
1. Development (local)
2. Staging
3. Production

**Variáveis de Ambiente:**

Backend:
```env
NODE_ENV=production
DATABASE_URL=mongodb://...
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
JWT_SECRET=...
```

Frontend:
```env
VITE_API_URL=https://api.exemplo.com
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
```

### 8.2 Docker

**Tarefas:**
1. Criar Dockerfile para backend
2. Criar Dockerfile para frontend
3. Criar docker-compose.yml

**Arquivos:**
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `docker-compose.yml`

### 8.3 CI/CD

**Pipeline (GitHub Actions):**
1. Lint e formatação
2. Testes unitários
3. Testes E2E
4. Build
5. Deploy (staging → production)

**Arquivo:** `.github/workflows/ci-cd.yml`

---

## 📚 FASE 9: DOCUMENTAÇÃO

### 9.1 Documentação Técnica

**Arquivos:**
1. `README.md` - Visão geral e setup
2. `ARCHITECTURE.md` - Arquitetura e decisões técnicas
3. `API.md` - Documentação da API (Swagger)
4. `I18N.md` - Guia de internacionalização
5. `DEPLOYMENT.md` - Guia de deploy

### 9.2 Documentação do Usuário

**Arquivos:**
1. `USER_GUIDE.md` - Manual do usuário
2. `MANAGER_GUIDE.md` - Guia para gerentes
3. `ADMIN_GUIDE.md` - Guia para administradores

---

## 🎯 FASE 10: OTIMIZAÇÕES E MELHORIAS

### 10.1 Performance

**Tarefas:**
1. Code-splitting do Vite para locales
2. Lazy loading de componentes
3. Otimização de queries MongoDB (índices)
4. Cache de traduções
5. Compressão de assets

### 10.2 Acessibilidade

**Tarefas:**
1. ARIA labels
2. Navegação por teclado
3. Contraste de cores (WCAG)
4. Leitores de tela

### 10.3 SEO e Meta Tags

**Tarefas:**
1. Meta tags dinâmicas
2. Open Graph
3. Sitemap

---

## 📦 ENTREGÁVEIS PRINCIPAIS

### Sprint 1 (Semanas 1-2): Infraestrutura
- ✅ Setup do projeto (backend + frontend)
- ✅ Autenticação Firebase
- ✅ Sistema i18n completo
- ✅ Conexão MongoDB

### Sprint 2 (Semanas 3-4): Módulos Backend
- ✅ CRUD Tenants
- ✅ CRUD Collaborators
- ✅ CRUD Meetings (schema completo)
- ✅ Sistema de tags multilíngue

### Sprint 3 (Semanas 5-6): Frontend Core
- ✅ Telas de autenticação
- ✅ Dashboard principal
- ✅ Navegação e layout

### Sprint 4 (Semanas 7-8): Retrospectiva + Bloco A
- ✅ Action Items
- ✅ Pulse History
- ✅ Todos os componentes do Bloco A

### Sprint 5 (Semanas 9-10): Blocos B, C, D
- ✅ Todos os componentes dos Blocos B, C, D
- ✅ Timer e navegação

### Sprint 6 (Semanas 11-12): Analytics e Relatórios
- ✅ Módulo Analytics
- ✅ Relatório Anual
- ✅ Exportação PDF

### Sprint 7 (Semanas 13-14): Testes e Qualidade
- ✅ Testes backend (>80% coverage)
- ✅ Testes frontend (>80% coverage)
- ✅ Testes E2E

### Sprint 8 (Semanas 15-16): Deploy e Documentação
- ✅ CI/CD configurado
- ✅ Deploy em produção
- ✅ Documentação completa

---

## 🔑 PONTOS CRÍTICOS DE ATENÇÃO

### Design e UI
1. **SEMPRE** usar componentes shadcn/ui como base
2. Respeitar as cores do tema (usar CSS variables)
3. Garantir que dark mode funcione em todos os componentes
4. Manter consistência visual em toda a aplicação
5. Usar `bg-card text-card-foreground` para cards que respondem ao tema
6. Testar contraste de cores em ambos os temas
7. Animações suaves e discretas (não excessivas)

### Internacionalização
1. **TODOS** os textos da interface devem estar em arquivos de tradução
2. Nunca hardcodar strings no código
3. Tags e competências devem ter objeto multilíngue no banco
4. Mensagens de erro da API devem respeitar Accept-Language
5. Incluir traduções para elementos do tema (light/dark)

### Segurança
1. Validar tenant_id em todas as queries (evitar acesso cross-tenant)
2. Firebase Auth em todas as rotas protegidas
3. Validação de role (manager vs employee)
4. Sanitização de inputs do usuário

### Performance
1. Índices MongoDB em: tenantId, collaboratorId, year
2. Code-splitting para locales (não carregar tudo no bundle inicial)
3. Lazy loading de componentes pesados (gráficos)
4. Cache de traduções no frontend
5. Otimizar bundle do shadcn/ui (importar apenas componentes necessários)

### UX
1. Feedback visual imediato em todas as ações
2. Loading states em requisições (usar skeleton do shadcn)
3. Mensagens de erro claras e traduzidas
4. Navegação intuitiva entre blocos
5. Dark mode persistido entre sessões
6. Transição suave entre temas

---

## 📞 PRÓXIMOS PASSOS

1. **Revisar e aprovar este plano**
2. **Configurar repositório Git** (se ainda não existe)
3. **Criar projeto Firebase**
4. **Provisionar MongoDB Atlas**
5. **Definir prioridades** (qual sprint começar?)

---

**Licença:** MIT
**Status:** Plano aprovado para execução
**Última atualização:** 2025-12-25
