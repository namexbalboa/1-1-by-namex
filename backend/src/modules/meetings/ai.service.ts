import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

@Injectable()
export class AiService {
  private openrouter: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
    this.openrouter = createOpenRouter({
      apiKey,
    });
  }

  async analyzeMeeting(
    currentMeeting: any,
    previousMeetings: any[],
    collaboratorName: string,
  ): Promise<string> {
    try {
      // Build context with meeting history
      const historyContext = this.buildHistoryContext(previousMeetings);
      const currentContext = this.buildCurrentMeetingContext(currentMeeting);

      // System prompt for analysis
      const systemPrompt = `Você é um consultor experiente em gestão de pessoas que está ajudando um gestor a se preparar para uma conversa 1:1 com seu colaborador.

Escreva de forma amigável, conversacional e empática, como se estivesse conversando diretamente com o gestor antes da reunião.

Use um tom acolhedor e sugira perguntas que o gestor pode fazer ao colaborador durante a conversa. Evite ser técnico demais - fale de forma natural e humana.

Estruture sua análise desta forma:

**Como o [Nome] está indo?**
[Resumo geral em 2-3 frases sobre como o colaborador está]

**O que você pode explorar nesta conversa:**

• [Pergunta sugerida 1 baseada nos dados]
• [Pergunta sugerida 2 baseada nos dados]
• [Pergunta sugerida 3 baseada nos dados]

**Pontos de atenção que vale a pena comentar:**
[Liste 2-3 observações importantes que o gestor deve ter em mente]

**Oportunidades para apoiar o desenvolvimento:**
[Sugira 2-3 formas práticas de ajudar o colaborador]

Seja empático, otimista quando possível, mas honesto sobre pontos que precisam de atenção. Lembre-se: você está ajudando o gestor a ter uma conversa melhor, não escrevendo um relatório formal.`;

      const userPrompt = `Vou te passar os dados da reunião mais recente com ${collaboratorName}${previousMeetings.length > 0 ? ' e também o histórico das reuniões anteriores' : ''}.

${previousMeetings.length > 0 ? `## Reuniões anteriores:\n${historyContext}\n\n` : ''}## Reunião mais recente:
${currentContext}

Me ajude a me preparar para nossa próxima conversa. O que devo ter em mente e quais perguntas posso fazer para ajudar ${collaboratorName} a continuar crescendo?`;

      // Call OpenRouter API
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.configService.get<string>('OPENROUTER_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API error:', response.status, errorText);

        if (response.status === 429) {
          throw new Error('Limite de requisições da API de IA excedido. Aguarde alguns minutos e tente novamente.');
        }

        throw new Error(`Erro na API de IA: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Análise não disponível';
    } catch (error) {
      console.error('Error generating AI analysis:', error);

      if (error instanceof Error && error.message.includes('Limite de requisições')) {
        throw error;
      }

      throw new Error('Falha ao gerar análise de IA');
    }
  }

  private buildHistoryContext(meetings: any[]): string {
    if (!meetings || meetings.length === 0) {
      return 'Nenhuma reunião anterior registrada.';
    }

    return meetings
      .map((meeting, index) => {
        const date = new Date(meeting.date).toLocaleDateString('pt-BR');
        return `### Reunião #${meeting.meetingNumber} - ${date}

**Bloco A - Excelência Operacional:**
- Distribuição de tempo: ${meeting.blockA?.timeDistribution?.execution}% execução, ${meeting.blockA?.timeDistribution?.meetings}% reuniões, ${meeting.blockA?.timeDistribution?.resolution}% resolução
- Bloqueadores: ${meeting.blockA?.blockers?.level || 'N/A'}
- Adequação de ferramentas: ${meeting.blockA?.toolAdequacy}/5
- Clareza de prioridades: ${meeting.blockA?.priorityClarity}/10

**Bloco B - Alinhamento Estratégico:**
- Conexão com objetivos: ${meeting.blockB?.goalConnection}/5
- Autonomia: ${meeting.blockB?.autonomy}%
- Inovação: ${meeting.blockB?.innovation ? 'Sim' : 'Não'}

**Bloco C - Dinâmica Humana:**
- Segurança psicológica: ${meeting.blockC?.psychologicalSafety}/5
- Fricção na colaboração: ${meeting.blockC?.collaborationFriction}/10
- Reconhecimento: ${meeting.blockC?.recognition || 'N/A'}

**Bloco D - Desenvolvimento e Bem-estar:**
- Desafio intelectual: Habilidade ${meeting.blockD?.intellectualChallenge?.skill}/10, Desafio ${meeting.blockD?.intellectualChallenge?.challenge}/10
- Utilização de forças: ${meeting.blockD?.strengthsUtilization}%
- Saúde mental: ${meeting.blockD?.mentalHealth}/5
- Foco quinzenal: ${meeting.blockD?.biweeklyFocus || 'N/A'}

---`;
      })
      .join('\n\n');
  }

  private buildCurrentMeetingContext(meeting: any): string {
    const date = new Date(meeting.date).toLocaleDateString('pt-BR');
    return `### Reunião #${meeting.meetingNumber} - ${date}

**Bloco A - Excelência Operacional:**
- Distribuição de tempo: ${meeting.blockA?.timeDistribution?.execution}% execução, ${meeting.blockA?.timeDistribution?.meetings}% reuniões, ${meeting.blockA?.timeDistribution?.resolution}% resolução
- Bloqueadores: ${meeting.blockA?.blockers?.level || 'N/A'}
- Adequação de ferramentas: ${meeting.blockA?.toolAdequacy}/5
- Clareza de prioridades: ${meeting.blockA?.priorityClarity}/10

**Bloco B - Alinhamento Estratégico:**
- Conexão com objetivos: ${meeting.blockB?.goalConnection}/5
- Autonomia: ${meeting.blockB?.autonomy}%
- Inovação: ${meeting.blockB?.innovation ? 'Sim' : 'Não'}

**Bloco C - Dinâmica Humana:**
- Segurança psicológica: ${meeting.blockC?.psychologicalSafety}/5
- Fricção na colaboração: ${meeting.blockC?.collaborationFriction}/10
- Reconhecimento: ${meeting.blockC?.recognition || 'N/A'}

**Bloco D - Desenvolvimento e Bem-estar:**
- Desafio intelectual: Habilidade ${meeting.blockD?.intellectualChallenge?.skill}/10, Desafio ${meeting.blockD?.intellectualChallenge?.challenge}/10
- Utilização de forças: ${meeting.blockD?.strengthsUtilization}%
- Saúde mental: ${meeting.blockD?.mentalHealth}/5
- Foco quinzenal: ${meeting.blockD?.biweeklyFocus || 'N/A'}`;
  }
}
