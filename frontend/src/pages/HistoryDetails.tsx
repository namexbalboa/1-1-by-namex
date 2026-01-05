import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Building2, Sparkles, RefreshCw } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

interface Meeting {
  meetingNumber: number;
  date: Date;
  completedAt: Date;
  blockA?: any;
  blockB?: any;
  blockC?: any;
  blockD?: any;
  actionItems?: any[];
  pulseHistory?: any[];
  aiAnalysis?: string;
}

interface HistoryData {
  collaborator: {
    id: string;
    name: string;
    email: string;
    department: string;
  } | null;
  manager: {
    name: string;
  };
  year: number;
  meetings: Meeting[];
}

export function HistoryDetails() {
  const { collaboratorId, year } = useParams();
  const navigate = useNavigate();
  const { collaborator } = useAuth();
  const [historyData, setHistoryData] = useState<HistoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAiAnalysisModal, setShowAiAnalysisModal] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  const [selectedMeetingNumber, setSelectedMeetingNumber] = useState<number | null>(null);
  const [regeneratingAnalysis, setRegeneratingAnalysis] = useState<number | null>(null);

  useEffect(() => {
    loadHistoryData();
  }, [collaboratorId, year]);

  const loadHistoryData = async () => {
    setIsLoading(true);
    try {
      const tenantId = typeof collaborator?.tenantId === 'object'
        ? collaborator?.tenantId?._id
        : collaborator?.tenantId;

      if (!tenantId || !collaboratorId || !year) {
        console.error('Missing required parameters');
        setIsLoading(false);
        return;
      }

      const response = await api.get(`/meetings/history/${collaboratorId}`, {
        params: { tenantId, year }
      });

      setHistoryData(response.data);
    } catch (error) {
      console.error('Error loading history details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleOpenAiAnalysis = (analysis: string, meetingNumber: number) => {
    setSelectedAnalysis(analysis);
    setSelectedMeetingNumber(meetingNumber);
    setShowAiAnalysisModal(true);
  };

  const handleRegenerateAnalysis = async (meetingNumber: number) => {
    if (!confirm('Deseja regenerar a análise de IA para esta reunião?')) {
      return;
    }

    setRegeneratingAnalysis(meetingNumber);
    try {
      const tenantId = typeof collaborator?.tenantId === 'object'
        ? collaborator?.tenantId?._id
        : collaborator?.tenantId;

      if (!tenantId || !collaboratorId) {
        alert('Erro: Parâmetros inválidos');
        return;
      }

      // Call API to regenerate AI analysis
      const response = await api.post(`/meetings/regenerate-analysis/${collaboratorId}/${meetingNumber}`, {
        tenantId,
      });

      alert('Análise de IA regenerada com sucesso!');

      // Wait a moment to ensure DB has saved
      await new Promise(resolve => setTimeout(resolve, 500));

      // Reload data
      await loadHistoryData();
    } catch (error: any) {
      console.error('Error regenerating AI analysis:', error);
      alert(error.response?.data?.message || 'Falha ao regenerar análise de IA');
    } finally {
      setRegeneratingAnalysis(null);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!historyData?.collaborator) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/history')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Histórico
            </Button>
            <Card className="p-12">
              <p className="text-center text-muted-foreground">
                Nenhum dado encontrado para este colaborador.
              </p>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/history')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Histórico
          </Button>

          {/* Header Card */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <User className="w-6 h-6 text-primary" />
                  {historyData.collaborator.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {historyData.collaborator.department}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Gestor: {historyData.manager.name}
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Calendar className="w-4 h-4 mr-2" />
                {historyData.year}
              </Badge>
            </div>
          </Card>

          {/* Meetings List */}
          {historyData.meetings.length === 0 ? (
            <Card className="p-12">
              <p className="text-center text-muted-foreground">
                Nenhuma reunião concluída encontrada para {historyData.year}.
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {historyData.meetings.map((meeting) => (
                <Card key={meeting.meetingNumber} className="p-6">
                  <div className="space-y-4">
                    {/* Meeting Header */}
                    <div className="flex items-center justify-between border-b pb-4">
                      <h3 className="text-lg font-semibold">
                        Reunião #{meeting.meetingNumber}
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        Realizada em: {formatDate(meeting.date)}
                      </div>
                    </div>

                    {/* Metrics Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-3 font-semibold bg-blue-50">Bloco A - Operacional</th>
                            <th className="text-left py-2 px-3 font-semibold bg-purple-50">Bloco B - Estratégico</th>
                            <th className="text-left py-2 px-3 font-semibold bg-orange-50">Bloco C - Clima</th>
                            <th className="text-left py-2 px-3 font-semibold bg-green-50">Bloco D - Desenvolvimento</th>
                            <th className="text-left py-2 px-3 font-semibold bg-yellow-50">Análise de IA</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-3 px-3 align-top bg-blue-50/30">
                              <div className="space-y-2">
                                {meeting.blockA && (
                                  <>
                                    <div className="text-xs">
                                      <span className="font-medium">Tempo:</span> {meeting.blockA.timeDistribution?.execution}% exec, {meeting.blockA.timeDistribution?.meetings}% meet, {meeting.blockA.timeDistribution?.resolution}% resol
                                    </div>
                                    <div className="text-xs">
                                      <span className="font-medium">Bloqueadores:</span>{' '}
                                      <span className={`font-semibold ${
                                        meeting.blockA.blockers?.level === 'green' ? 'text-green-600' :
                                        meeting.blockA.blockers?.level === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                                      }`}>
                                        {meeting.blockA.blockers?.level === 'green' ? 'Verde' :
                                         meeting.blockA.blockers?.level === 'yellow' ? 'Amarelo' : 'Vermelho'}
                                      </span>
                                    </div>
                                    <div className="text-xs">
                                      <span className="font-medium">Ferramentas:</span> {meeting.blockA.toolAdequacy}/5
                                    </div>
                                    <div className="text-xs">
                                      <span className="font-medium">Prioridades:</span> {meeting.blockA.priorityClarity}/10
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 align-top bg-purple-50/30">
                              <div className="space-y-2">
                                {meeting.blockB && (
                                  <>
                                    <div className="text-xs">
                                      <span className="font-medium">Objetivos:</span> {meeting.blockB.goalConnection}/5
                                    </div>
                                    <div className="text-xs">
                                      <span className="font-medium">Autonomia:</span> {meeting.blockB.autonomy}%
                                    </div>
                                    <div className="text-xs">
                                      <span className="font-medium">Inovação:</span> {meeting.blockB.innovation ? 'Sim' : 'Não'}
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 align-top bg-orange-50/30">
                              <div className="space-y-2">
                                {meeting.blockC && (
                                  <>
                                    <div className="text-xs">
                                      <span className="font-medium">Seg. Psicológica:</span> {meeting.blockC.psychologicalSafety}/5
                                    </div>
                                    <div className="text-xs">
                                      <span className="font-medium">Fricção Colab:</span> {meeting.blockC.collaborationFriction}/10
                                    </div>
                                    <div className="text-xs">
                                      <span className="font-medium">Reconhecimento:</span>{' '}
                                      {meeting.blockC.recognition === 'low' ? 'Baixo' :
                                       meeting.blockC.recognition === 'medium' ? 'Médio' : 'Alto'}
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 align-top bg-green-50/30">
                              <div className="space-y-2">
                                {meeting.blockD && (
                                  <>
                                    <div className="text-xs">
                                      <span className="font-medium">Desafio:</span> Hab {meeting.blockD.intellectualChallenge?.skill}/10, Des {meeting.blockD.intellectualChallenge?.challenge}/10
                                    </div>
                                    <div className="text-xs">
                                      <span className="font-medium">Forças:</span> {meeting.blockD.strengthsUtilization}%
                                    </div>
                                    <div className="text-xs">
                                      <span className="font-medium">Saúde Mental:</span> {meeting.blockD.mentalHealth}/5
                                    </div>
                                    {meeting.blockD.biweeklyFocus && (
                                      <div className="text-xs">
                                        <span className="font-medium">Foco:</span> {meeting.blockD.biweeklyFocus}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 align-top bg-yellow-50/30">
                              <div className="flex flex-col items-center justify-center gap-2 h-full">
                                {meeting.aiAnalysis ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenAiAnalysis(meeting.aiAnalysis!, meeting.meetingNumber)}
                                    className="gap-2 text-xs w-full"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Ver Análise
                                  </Button>
                                ) : (
                                  <span className="text-xs text-muted-foreground italic">
                                    Não disponível
                                  </span>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRegenerateAnalysis(meeting.meetingNumber)}
                                  disabled={regeneratingAnalysis === meeting.meetingNumber}
                                  className="gap-2 text-xs w-full"
                                >
                                  <RefreshCw className={`w-3.5 h-3.5 ${regeneratingAnalysis === meeting.meetingNumber ? 'animate-spin' : ''}`} />
                                  {regeneratingAnalysis === meeting.meetingNumber ? 'Gerando...' : 'Regenerar'}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Analysis Modal */}
      <Dialog open={showAiAnalysisModal} onOpenChange={setShowAiAnalysisModal}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Análise de IA - Reunião #{selectedMeetingNumber}
            </DialogTitle>
            <DialogDescription>
              Insights gerados por inteligência artificial baseados no histórico do colaborador
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-w-none">
            {selectedAnalysis ? (
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {selectedAnalysis}
              </div>
            ) : (
              <p className="text-muted-foreground">Análise não disponível.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
