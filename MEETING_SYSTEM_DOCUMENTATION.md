# Sistema de Reuniões 1:1 - Documentação Completa

## 📋 Índice
1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Modelo de Negócio](#modelo-de-negócio)
3. [Fluxo das Reuniões](#fluxo-das-reuniões)
4. [Os 4 Blocos de Planejamento](#os-4-blocos-de-planejamento)
5. [Arquitetura Técnica](#arquitetura-técnica)
6. [Melhorias Sugeridas](#melhorias-sugeridas)

---

## 🎯 Visão Geral do Sistema

### Conceito Principal
Sistema de gestão de reuniões 1:1 (one-on-one) entre gestores e colaboradores, estruturado em **jornadas anuais** com reuniões **quinzenais** (a cada duas semanas).

### Objetivo
Criar um framework estruturado de conversas contínuas focado em:
- 📊 Performance operacional
- 🎯 Alinhamento estratégico
- 🤝 Clima e relacionamentos
- 📈 Desenvolvimento profissional
- 💚 Bem-estar mental

---

## 💼 Modelo de Negócio

### Jornada Anual (Annual Journey)

Cada **colaborador** tem **uma jornada por ano**, contendo:

```
Jornada 2025
├── Colaborador: João Silva
├── Gestor: Maria Santos
└── Reuniões (array)
    ├── Reunião #1 (01/01/2025)
    ├── Reunião #2 (15/01/2025)
    ├── Reunião #3 (29/01/2025)
    └── ... (até 26 reuniões/ano)
```

### Características da Jornada

| Aspecto | Detalhe |
|---------|---------|
| **Duração** | 1 ano civil (jan-dez) |
| **Frequência** | Quinzenal (a cada 2 semanas) |
| **Reuniões/Ano** | ~26 reuniões |
| **Persistência** | Histórico completo mantido |
| **Unicidade** | 1 jornada por colaborador/ano |

### Benefícios do Modelo Anual

✅ **Visão de longo prazo**: Acompanha evolução ao longo do ano
✅ **Histórico consolidado**: Facilita análises de tendências
✅ **Performance review**: Base de dados para avaliações anuais
✅ **Desenvolvimento contínuo**: Monitora crescimento progressivo

---

## 🔄 Fluxo das Reuniões

### Estrutura em Duas Fases

Cada reunião é dividida em **2 fases sequenciais**:

```
┌─────────────────────────────────────────────┐
│         FASE 1: RETROSPECTIVA               │
│         (Olhando para trás)                 │
├─────────────────────────────────────────────┤
│  1. Revisão de Itens de Ação               │
│     - Ações da última reunião               │
│     - Status: Pendente / Concluído / Bloqueado │
│                                             │
│  2. Histórico de Pulso (8 semanas)         │
│     - Medição semanal de humor/energia      │
│     - Escala 1-5 (😟 → 😊)                 │
│     - Gráfico de tendência                  │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│         FASE 2: PLANEJAMENTO                │
│         (Olhando para frente)               │
├─────────────────────────────────────────────┤
│  Bloco A: Excelência Operacional           │
│  Bloco B: Alinhamento Estratégico          │
│  Bloco C: Dinâmica Humana                  │
│  Bloco D: Desenvolvimento & Bem-estar      │
│                                             │
│  → Foco nas próximas 2 semanas             │
└─────────────────────────────────────────────┘
```

### 1️⃣ Fase Retrospectiva

**URL**: `/meeting/:journeyId/:meetingNumber/retrospective`

#### A. Revisão de Itens de Ação

**Propósito**: Accountability - garantir que compromissos são cumpridos

**Estrutura**:
```typescript
ActionItem {
  description: string      // O que foi prometido
  status: 'pending' | 'done' | 'blocked'
}
```

**Fluxo**:
- 🔴 Pendente → 🟢 Concluído → 🟡 Bloqueado → 🔴 Pendente (ciclo)
- Clique para alternar status
- Taxa de conclusão calculada automaticamente

**Valor de Negócio**:
- ✅ Acompanha execução de compromissos
- ✅ Identifica bloqueios recorrentes
- ✅ Mede efetividade das ações

#### B. Histórico de Pulso (Pulse History)

**Propósito**: Monitorar humor/energia semanal como indicador de satisfação

**Estrutura**:
```typescript
PulseHistoryItem {
  week: string       // "Semana de 01/01"
  value: 1-5         // 😟 😕 😐 🙂 😊
}
```

**Configuração**:
- Lookback padrão: 8 semanas
- Escala: 1 (muito baixo) a 5 (excelente)
- Visualização: Gráfico de linha com tendência
- Média calculada com código de cores

**Alertas Automáticos**:
```
Média < 3.0  → 🔴 Atenção necessária
Média 3-4    → 🟡 Satisfatório
Média > 4.0  → 🟢 Excelente
```

**Valor de Negócio**:
- ✅ Early warning de insatisfação
- ✅ Identifica padrões temporais (ex: sempre baixo às segundas)
- ✅ Métricas objetivas de clima

---

### 2️⃣ Fase de Planejamento

**URL**: `/meeting/:journeyId/:meetingNumber/planning`

**Estrutura**: 4 blocos obrigatórios com navegação por tabs

---

## 📦 Os 4 Blocos de Planejamento

### 📊 BLOCO A: Excelência Operacional

**Pergunta-chave**: *"Como está sua rotina operacional?"*

#### Componentes

##### 1. Distribuição de Tempo
**Propósito**: Entender como o tempo é realmente gasto

```typescript
timeDistribution {
  execution: 0-100%      // Execução de tarefas planejadas
  meetings: 0-100%       // Tempo em reuniões
  resolution: 0-100%     // Apagar incêndios / urgências
  // TOTAL deve = 100%
}
```

**Visualização**: Barra empilhada horizontal proporcional

**Casos de Negócio**:
```
execution: 70%, meetings: 20%, resolution: 10%
→ ✅ Saudável: Maior parte no que importa

execution: 30%, meetings: 20%, resolution: 50%
→ ⚠️ Problema: Muito tempo apagando incêndio

execution: 20%, meetings: 70%, resolution: 10%
→ ⚠️ Problema: Excesso de reuniões improdutivas
```

##### 2. Bloqueadores
```typescript
blockers {
  level: 'green' | 'yellow' | 'red'
  tags: string[]    // Ex: "Falta de recursos", "Dependências"
}
```

**Sinais de Alerta**:
- 🔴 Red: Bloqueio crítico → Ação urgente do gestor
- 🟡 Yellow: Atenção necessária
- 🟢 Green: Fluindo bem

##### 3. Adequação de Ferramentas
```typescript
toolAdequacy: 1-5     // Ferramentas atendem necessidades?
```

**Interpretação**:
- 1-2: Ferramentas inadequadas → Investimento necessário
- 3: Aceitável mas pode melhorar
- 4-5: Ferramentas de qualidade

##### 4. Clareza de Prioridades
```typescript
priorityClarity: 1-10    // Quão claro está o que é importante?
```

**Valor**:
- < 5: Gestor precisa alinhar melhor prioridades
- 5-7: Satisfatório
- \> 7: Excelente clareza

**Valor de Negócio do Bloco A**:
- ✅ Identifica gargalos operacionais
- ✅ Previne burnout por sobrecarga de urgências
- ✅ Justifica investimentos em ferramentas
- ✅ Melhora clareza de comunicação

---

### 🎯 BLOCO B: Alinhamento Estratégico & Autonomia

**Pergunta-chave**: *"Quão conectado você está com os objetivos da empresa e quanta autonomia tem?"*

#### Componentes

##### 1. Conexão com Objetivos
```typescript
goalConnection: 1-5
```

**Escala**:
- 1: Não vejo relação do meu trabalho com metas da empresa
- 3: Entendo parcialmente
- 5: Totalmente alinhado e engajado

**Problema de Negócio**:
- Baixa conexão = Baixo engajamento = Menor produtividade
- Indica necessidade de melhor comunicação de estratégia

##### 2. Autonomia
```typescript
autonomy: 0-100%    // % de decisões que pode tomar sozinho
```

**Zonas**:
```
0-30%   → Microgerenciamento → Baixa motivação
30-60%  → Autonomia moderada
60-100% → Alta autonomia → Alta motivação
```

##### 3. Oportunidades de Inovação
```typescript
innovation: boolean    // Teve chance de inovar nas últimas 2 semanas?
```

**Valor de Negócio do Bloco B**:
- ✅ Mede engajamento com propósito
- ✅ Identifica microgerenciamento
- ✅ Fomenta cultura de inovação
- ✅ Correlaciona autonomia com motivação

---

### 🤝 BLOCO C: Dinâmica Humana & Clima

**Pergunta-chave**: *"Como está o clima do time e os relacionamentos?"*

#### Componentes

##### 1. Segurança Psicológica
```typescript
psychologicalSafety: 1-5
```

**Definição**: "Me sinto seguro para expressar opiniões, mesmo contrárias"

**Alertas**:
```
≤ 2  → 🔴 ALERTA CRÍTICO: Ambiente tóxico
3    → 🟡 Requer atenção
≥ 4  → 🟢 Ambiente saudável
```

**Importância**: Google descobriu que segurança psicológica é o fator #1 de times de alta performance.

##### 2. Atrito na Colaboração
```typescript
collaborationFriction: 1-10
```

**Escala**:
- 1-3: Alta fricção (conflitos, falta de alinhamento)
- 4-7: Moderado
- 8-10: Colaboração fluida

##### 3. Reconhecimento
```typescript
recognition: 'low' | 'medium' | 'high'
```

**Visualização**: 😔 / 🙂 / 🌟

**Valor de Negócio do Bloco C**:
- ✅ Previne turnover (pessoas saem de chefes, não de empresas)
- ✅ Identifica problemas de clima antes de virarem crise
- ✅ Mede cultura real vs. cultura desejada
- ✅ Reconhecimento = Retenção

---

### 📈 BLOCO D: Desenvolvimento & Bem-estar

**Pergunta-chave**: *"Como está seu desenvolvimento profissional e bem-estar?"*

#### Componentes

##### 1. Desafio Intelectual (Flow State)
```typescript
intellectualChallenge {
  skill: 1-10          // Nível de habilidade atual
  challenge: 1-10      // Dificuldade das tarefas
}
```

**Algoritmo de Flow State** (baseado em Mihaly Csikszentmihalyi):

```
SE desafio > habilidade + 2
  → 😰 ANSIEDADE (tarefas muito difíceis)

SE habilidade > desafio + 2
  → 😴 TÉDIO (tarefas muito fáceis)

SE habilidade ≥ 6 E desafio ≥ 6
  → 🚀 FLOW (estado ideal de alta performance)

SENÃO
  → 😐 APATIA (baixo engajamento)
```

**Valor**: Pessoas em Flow = Máxima produtividade + Satisfação

##### 2. Utilização de Forças
```typescript
strengthsUtilization: 0-100%
```

**Pergunta**: "Quanto % do tempo você usa suas principais forças/talentos?"

**Impacto**:
- < 30%: Desmotivação, job crafting necessário
- 50-70%: Satisfatório
- \> 70%: Máximo engajamento

##### 3. Aprendizado Ativo
```typescript
activeLearning: string[]
```

**Exemplos**: ["React Avançado", "Liderança", "Inglês"]

**Valor**: Crescimento contínuo = Retenção de talentos

##### 4. Saúde Mental
```typescript
mentalHealth: 1-5
```

**Alertas**:
```
≤ 2  → 🔴 URGENTE: Intervenção necessária
3    → 🟡 Monitorar de perto
≥ 4  → 🟢 Saudável
```

##### 5. Foco Quinzenal
```typescript
biweeklyFocus: string (max 200 chars)
```

**Exemplos**:
- "Melhorar testes unitários do módulo de pagamentos"
- "Estudar arquitetura de microserviços"
- "Reduzir reuniões em 30%"

**Valor de Negócio do Bloco D**:
- ✅ Previne burnout
- ✅ Maximiza engajamento via flow state
- ✅ Direciona desenvolvimento individual
- ✅ Monitora saúde mental proativamente
- ✅ Cria cultura de aprendizado contínuo

---

## 🏗️ Arquitetura Técnica

### Modelo de Dados

#### Relacionamentos
```
Tenant (Organização)
  └── Collaborators (Colaboradores)
      ├── role: 'manager' | 'employee'
      ├── managerId: ref → Collaborator
      └── MeetingJourneys
          ├── year: 2025
          └── meetings[]
              ├── meetingNumber: 1, 2, 3...
              ├── date
              ├── actionItems[]
              ├── pulseHistory[]
              ├── blockA
              ├── blockB
              ├── blockC
              └── blockD
```

#### Índices Únicos
```
{ tenantId, collaboratorId, year } → UNIQUE
```
**Garante**: 1 jornada por colaborador por ano

### Backend API

#### Endpoints Principais

**Gestão de Jornadas**:
```
POST   /meetings/journeys
GET    /meetings/journeys/:collaboratorId/:year
GET    /meetings/journeys/manager/:managerId
```

**Gestão de Reuniões**:
```
POST   /meetings/journeys/:journeyId/meetings
GET    /meetings/journeys/:journeyId/meetings/:meetingNumber
PATCH  /meetings/journeys/:journeyId/meetings/:meetingNumber
DELETE /meetings/journeys/:journeyId/meetings/:meetingNumber
```

**Agendamento e Calendário**:
```
POST   /meetings/schedule                     → Agenda + Envia email
GET    /meetings/scheduled?tenantId=...       → Visualização calendário
GET    /meetings/upcoming?tenantId=...&limit=5 → Próximas reuniões
```

### Frontend

#### Rotas
```
/dashboard                                        → Dashboard principal
/meetings                                         → Calendário de reuniões
/meeting/:journeyId/:meetingNumber/retrospective → Fase 1
/meeting/:journeyId/:meetingNumber/planning      → Fase 2
```

#### State Management (Zustand)
```typescript
useMeetingStore {
  currentJourney: MeetingJourney
  currentMeeting: Meeting
  loading: boolean
  error: string

  // Actions
  setCurrentJourney()
  setCurrentMeeting()
  updateMeeting()
}
```

### Permissões

| Ação | Manager | Employee |
|------|---------|----------|
| Criar jornada | ✅ | ❌ |
| Agendar reunião | ✅ | ❌ |
| Participar da própria reunião | ✅ | ✅ |
| Ver reuniões do time | ✅ | ❌ |
| Configurações | ✅ | ❌ |

---

## 💡 Melhorias Sugeridas

### 🔴 CRÍTICAS (Alta Prioridade)

#### 1. Integração de API nas Reuniões
**Problema Atual**: Planning e Retrospective não salvam dados no backend
**Status**: Código tem TODOs comentados
**Impacto**: Dados perdidos ao sair da página
**Solução**:
```typescript
// Implementar auto-save a cada mudança
const handleBlockAChange = async (data) => {
  setBlockA(data);
  await api.patch(`/meetings/journeys/${journeyId}/meetings/${meetingNumber}`, {
    blockA: data
  });
};
```

**Prioridade**: 🔴 URGENTE

---

#### 2. Sistema de Notificações
**Problema**: Apenas email de confirmação de agendamento
**Gaps**:
- ❌ Sem lembrete antes da reunião (24h antes)
- ❌ Sem notificação de reunião cancelada
- ❌ Sem lembrete de preencher retrospectiva
- ❌ Sem alertas de blocos críticos (saúde mental < 2)

**Solução**:
```typescript
// Sistema de notificações em tempo real
notifications {
  - Email 24h antes: "Reunião amanhã com João"
  - Push quando: mental_health ≤ 2
  - Email quando: psychologicalSafety ≤ 2
  - SMS quando: 3 reuniões consecutivas não realizadas
}
```

**Prioridade**: 🔴 ALTA

---

#### 3. Validação de Completude
**Problema**: Não há validação se reunião está completa
**Impacto**: Dados incompletos poluem análises

**Solução**:
```typescript
Meeting {
  status: 'scheduled' | 'in_progress' | 'completed'
  completedAt: Date
  blocksCompleted: {
    retrospective: boolean
    blockA: boolean
    blockB: boolean
    blockC: boolean
    blockD: boolean
  }
}

// Regra: Só marca como completed quando todos blocos preenchidos
```

**Prioridade**: 🔴 ALTA

---

### 🟡 IMPORTANTES (Média Prioridade)

#### 4. Dashboard de Analytics para Gestores
**Oportunidade**: Visão consolidada do time

**Funcionalidades**:
```
📊 Visão do Time
├── Pulse médio da equipe (últimas 8 semanas)
├── % de colaboradores em Flow State
├── Alertas de saúde mental (quem está < 2)
├── Alertas de segurança psicológica
├── Taxa de conclusão de action items
└── Heatmap de time distribution
    → Identifica quem está apagando muito incêndio
```

**Exemplo de Alerta**:
```
⚠️ 3 colaboradores com saúde mental ≤ 2
⚠️ 2 colaboradores com segurança psicológica baixa
✅ 85% do time em Flow State (ótimo!)
📉 Pulse médio caindo 0.5 pontos (atenção)
```

**Prioridade**: 🟡 MÉDIA-ALTA

---

#### 5. Comparação Temporal
**Oportunidade**: Ver evolução ao longo do tempo

**Funcionalidades**:
```typescript
// Gráficos de tendência
ComparisonView {
  pulseOverYear: LineChart      // Pulse ao longo de 12 meses
  flowStateEvolution: AreaChart // Skill vs Challenge
  autonomyTrend: LineChart      // Crescimento de autonomia
  actionItemsRate: BarChart     // Taxa de conclusão por mês
}
```

**Casos de Uso**:
- "Como evoluiu a autonomia de João em 2025?"
- "O pulso da equipe está melhor que no Q1?"
- "A taxa de conclusão de ações melhorou?"

**Prioridade**: 🟡 MÉDIA

---

#### 6. Biblioteca de Action Items
**Problema**: Managers não sabem quais ações sugerir
**Solução**: Catálogo de ações por cenário

```typescript
ActionLibrary {
  categories: [
    {
      name: "Desenvolvimento Técnico",
      items: [
        "Fazer curso de [tecnologia]",
        "Pair programming com senior",
        "Apresentar tech talk sobre [tema]"
      ]
    },
    {
      name: "Bloqueadores",
      items: [
        "Agendar reunião com [stakeholder]",
        "Documentar processo de [X]",
        "Solicitar acesso a [ferramenta]"
      ]
    }
  ]
}
```

**Prioridade**: 🟡 MÉDIA

---

### 🟢 DESEJÁVEIS (Baixa Prioridade)

#### 7. Integração com Calendário
**Oportunidade**: Sincronizar com Google Calendar / Outlook

**Funcionalidades**:
- Auto-criar evento no calendário pessoal
- Atualizar quando reagendar
- Cancelar evento ao deletar reunião
- Incluir link para a reunião na descrição

**Prioridade**: 🟢 BAIXA

---

#### 8. Templates de Reunião
**Oportunidade**: Diferentes tipos de 1:1

**Exemplos**:
```
Templates {
  - Standard: 4 blocos completos
  - Onboarding: Foco em Block D (desenvolvimento)
  - Performance Review: Foco em Blocks A e B
  - Skip Level: Gestor do gestor
  - Exit Interview: Feedback de saída
}
```

**Prioridade**: 🟢 BAIXA

---

#### 9. Metas SMART
**Oportunidade**: Transformar biweeklyFocus em metas rastreáveis

```typescript
Goal {
  description: string
  type: 'SMART'
  specific: string
  measurable: string
  achievable: boolean
  relevant: string
  timebound: Date
  progress: 0-100%
}
```

**Prioridade**: 🟢 BAIXA

---

#### 10. Exportação de Relatórios
**Oportunidade**: Performance review anual

**Formatos**:
```
Exports {
  - PDF: Relatório anual completo
  - CSV: Dados brutos para análise
  - PowerPoint: Apresentação de resultados
}

Conteúdo:
  ├── Pulse evolution (gráfico)
  ├── Flow state over time
  ├── Action items completed (%)
  ├── Key achievements
  └── Development areas
```

**Prioridade**: 🟢 BAIXA

---

## 📊 Métricas de Sucesso Sugeridas

### Para a Organização
```
KPIs Organizacionais:
├── Taxa de adesão: % reuniões realizadas vs agendadas
├── Pulse médio: Meta > 4.0
├── % colaboradores em Flow State: Meta > 60%
├── Taxa de turnover: Correlação negativa com pulse
├── Completion rate de action items: Meta > 80%
└── Alertas críticos resolvidos em < 1 semana
```

### Para Gestores
```
KPIs de Gestão:
├── Frequência de 1:1s: Mínimo quinzenal
├── Pulse médio do time: > 4.0
├── % time com segurança psicológica alta: > 80%
├── Tempo médio para resolver bloqueadores: < 2 semanas
└── % time com desenvolvimento ativo: > 90%
```

### Para Colaboradores
```
KPIs Individuais:
├── Pulse pessoal: > 4.0
├── Flow state: Manter skill e challenge > 6
├── Utilização de forças: > 70%
├── Completion rate de ações: > 85%
└── Aprendizado ativo: Sempre ter 1-3 áreas
```

---

## 🎯 Roadmap Sugerido

### Fase 1: Estabilização (1-2 meses)
- ✅ Integração completa de API (Planning + Retrospective)
- ✅ Sistema de auto-save
- ✅ Validação de completude de reuniões
- ✅ Correção de bugs críticos

### Fase 2: Analytics (2-3 meses)
- 📊 Dashboard de analytics para gestores
- 📈 Comparação temporal (gráficos de evolução)
- 🔔 Sistema de alertas e notificações
- 📧 Emails de lembrete

### Fase 3: Inteligência (3-4 meses)
- 🤖 Sugestões automáticas de action items
- 📚 Biblioteca de ações
- 🎯 Identificação de padrões (ML básico)
- 📱 Notificações push (mobile-friendly)

### Fase 4: Escalabilidade (4-6 meses)
- 🔄 Templates de reunião
- 📅 Integração com calendários
- 📑 Exportação de relatórios
- 🌍 Expansão de idiomas

---

## 💼 Proposta de Valor por Stakeholder

### Para o Colaborador
✅ Espaço seguro para falar sobre desafios
✅ Visibilidade do próprio desenvolvimento
✅ Ações concretas para crescimento
✅ Reconhecimento do esforço
✅ Prevenção de burnout

### Para o Gestor
✅ Framework estruturado de conversas
✅ Early warning de problemas
✅ Dados para decisões (promoções, treinamentos)
✅ Redução de turnover
✅ Time mais engajado e produtivo

### Para o RH
✅ Dados de clima em tempo real
✅ Identificação de necessidades de treinamento
✅ Prevenção de turnover
✅ Base para performance reviews
✅ Cultura de feedback contínuo

### Para a Empresa
✅ Maior produtividade (flow state)
✅ Menor turnover (custo de contratação)
✅ Cultura de alto desempenho
✅ Decisões baseadas em dados
✅ Employer branding (cuidado com pessoas)

---

## 🚀 Conclusão

O sistema de reuniões 1:1 implementado é **extremamente bem estruturado** do ponto de vista de ciência comportamental, incorporando:

✅ **Flow Theory** (Csikszentmihalyi)
✅ **Psychological Safety** (Google Project Aristotle)
✅ **Continuous Feedback** (vs. annual reviews)
✅ **Holistic Performance** (além de métricas numéricas)
✅ **Preventive Care** (saúde mental, clima)

### Principais Forças
1. **Framework estruturado**: 4 blocos cobrem tudo que importa
2. **Dados acionáveis**: Cada métrica gera ação clara
3. **Preventivo**: Identifica problemas antes de virarem crise
4. **Científico**: Baseado em pesquisa (flow, psych safety)
5. **Humano**: Equilibra performance com bem-estar

### Maiores Oportunidades
1. **Analytics**: Transformar dados em insights
2. **Automação**: Notificações e sugestões inteligentes
3. **Integração**: Conectar com outras ferramentas (calendar, Slack)
4. **Mobile**: Facilitar preenchimento on-the-go
5. **IA**: Identificar padrões e fazer recomendações

---

**Documento gerado em**: Dezembro 2025
**Versão**: 1.0
**Autor**: Análise técnica do sistema 1-1-by-namex
