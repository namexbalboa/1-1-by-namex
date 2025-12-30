import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Check } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BlockA } from '@/components/meeting/blocks/BlockA';
import { BlockB } from '@/components/meeting/blocks/BlockB';
import { BlockC } from '@/components/meeting/blocks/BlockC';
import { BlockD } from '@/components/meeting/blocks/BlockD';
import { useMeetingStore } from '@/stores/meetingStore';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import type { BlockA as BlockAType, BlockB as BlockBType, BlockC as BlockCType, BlockD as BlockDType } from '@/types';

export function Planning() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { journeyId, meetingNumber } = useParams();
  const { collaborator } = useAuth();
  const { currentMeeting, setCurrentMeeting } = useMeetingStore();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('blockA');
  const [blockA, setBlockA] = useState<Partial<BlockAType>>({
    timeDistribution: { execution: 60, meetings: 30, resolution: 10 },
    blockers: { level: 'green', tags: [] },
    toolAdequacy: 3,
    priorityClarity: 5,
  });
  const [blockB, setBlockB] = useState<Partial<BlockBType>>({
    goalConnection: 3,
    autonomy: 50,
    innovation: false,
  });
  const [blockC, setBlockC] = useState<Partial<BlockCType>>({
    psychologicalSafety: 3,
    collaborationFriction: 5,
    recognition: 'medium',
  });
  const [blockD, setBlockD] = useState<Partial<BlockDType>>({
    intellectualChallenge: { skill: 5, challenge: 5 },
    strengthsUtilization: 50,
    activeLearning: [],
    mentalHealth: 3,
    biweeklyFocus: '',
  });

  const [saving, setSaving] = useState(false);
  const [completedBlocks, setCompletedBlocks] = useState<Set<string>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    // Load existing data if available
    if (currentMeeting) {
      if (currentMeeting.blockA) setBlockA(currentMeeting.blockA);
      if (currentMeeting.blockB) setBlockB(currentMeeting.blockB);
      if (currentMeeting.blockC) setBlockC(currentMeeting.blockC);
      if (currentMeeting.blockD) setBlockD(currentMeeting.blockD);
    }
  }, [currentMeeting]);

  const markBlockComplete = async (block: string) => {
    // If completing Block D, save the meeting data
    if (block === 'blockD') {
      setSaving(true);
      try {
        // Import api
        const { api } = await import('@/lib/api');

        const payload = {
          blockA,
          blockB,
          blockC,
          blockD,
          status: 'completed', // Mark as completed
        };

        console.log('Saving meeting with payload:', payload);
        console.log('URL:', `/meetings/journeys/${journeyId}/meetings/${meetingNumber}`);

        // Save to backend via API
        const response = await api.patch(`/meetings/journeys/${journeyId}/meetings/${meetingNumber}`, payload);
        console.log('Save response:', response.data);

        // Update current meeting in store
        setCurrentMeeting({
          ...currentMeeting!,
          blockA,
          blockB,
          blockC,
          blockD,
        });

        // Mark block as complete
        setCompletedBlocks(prev => new Set([...prev, block]));

        toast.success('Sucesso', 'Reunião salva com sucesso!');

        // Show completion modal
        setShowCompletionModal(true);
      } catch (error) {
        console.error('Error saving planning:', error);
        toast.error('Erro', 'Erro ao salvar o planejamento. Por favor, tente novamente.');
      } finally {
        setSaving(false);
      }
    } else {
      // For other blocks, just mark as complete
      setCompletedBlocks(prev => {
        const newSet = new Set([...prev, block]);

        // Show success toast
        const blockNames: Record<string, string> = {
          blockA: 'Bloco A - Excelência Operacional',
          blockB: 'Bloco B - Alinhamento Estratégico',
          blockC: 'Bloco C - Dinâmica Humana',
        };

        toast.success('Bloco Completo!', `${blockNames[block]} foi marcado como concluído`);

        // Scroll to bottom smoothly
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

        return newSet;
      });
    }
  };

  const handleFinish = () => {
    // Navigate to meetings page
    navigate('/meetings');
  };

  const handleBack = () => {
    navigate(`/meeting/${journeyId}/${meetingNumber}/retrospective`);
  };

  const isBlockComplete = (block: string) => completedBlocks.has(block);
  const allBlocksComplete = completedBlocks.size === 4;

  return (
    <Layout>
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('common.back')}
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-xl font-bold">
                  {t('meeting.planning')} - Reunião #{meetingNumber}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {collaborator?.name} | Fase 2 de 2
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction Card */}
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h2 className="text-lg font-semibold mb-2">
              🎯 Planejamento Quinzenal
            </h2>
            <p className="text-sm text-muted-foreground">
              Agora vamos planejar as próximas duas semanas através de 4 blocos de análise.
              Complete todos os blocos para finalizar a reunião.
            </p>
          </Card>

          {/* Progress Indicator */}
          <Card className="p-4 bg-card">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso:</span>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {['blockA', 'blockB', 'blockC', 'blockD'].map((block) => (
                    <div
                      key={block}
                      className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                        isBlockComplete(block) ? 'bg-success shadow-md shadow-success/30' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {completedBlocks.size}/4 completos
                </span>
              </div>
            </div>
          </Card>

          {/* Blocks Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="blockA"
                className={`relative ${isBlockComplete('blockA') ? 'bg-success/10 data-[state=active]:bg-success/20' : ''}`}
              >
                <span className="flex items-center gap-2">
                  {isBlockComplete('blockA') && (
                    <span className="text-base">✅</span>
                  )}
                  Bloco A
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="blockB"
                className={`relative ${isBlockComplete('blockB') ? 'bg-success/10 data-[state=active]:bg-success/20' : ''}`}
              >
                <span className="flex items-center gap-2">
                  {isBlockComplete('blockB') && (
                    <span className="text-base">✅</span>
                  )}
                  Bloco B
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="blockC"
                className={`relative ${isBlockComplete('blockC') ? 'bg-success/10 data-[state=active]:bg-success/20' : ''}`}
              >
                <span className="flex items-center gap-2">
                  {isBlockComplete('blockC') && (
                    <span className="text-base">✅</span>
                  )}
                  Bloco C
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="blockD"
                className={`relative ${isBlockComplete('blockD') ? 'bg-success/10 data-[state=active]:bg-success/20' : ''}`}
              >
                <span className="flex items-center gap-2">
                  {isBlockComplete('blockD') && (
                    <span className="text-base">✅</span>
                  )}
                  Bloco D
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="blockA" className="mt-6">
              <BlockA data={blockA} onChange={setBlockA} />
              <div className="mt-6 flex justify-end">
                <Button onClick={() => { markBlockComplete('blockA'); setActiveTab('blockB'); }}>
                  Continuar para Bloco B
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="blockB" className="mt-6">
              <BlockB data={blockB} onChange={setBlockB} />
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setActiveTab('blockA')}>
                  Voltar
                </Button>
                <Button onClick={() => { markBlockComplete('blockB'); setActiveTab('blockC'); }}>
                  Continuar para Bloco C
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="blockC" className="mt-6">
              <BlockC data={blockC} onChange={setBlockC} />
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setActiveTab('blockB')}>
                  Voltar
                </Button>
                <Button onClick={() => { markBlockComplete('blockC'); setActiveTab('blockD'); }}>
                  Continuar para Bloco D
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="blockD" className="mt-6">
              <BlockD data={blockD} onChange={setBlockD} />
              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setActiveTab('blockC')}>
                  Voltar
                </Button>
                {isBlockComplete('blockD') ? (
                  <div className="flex items-center gap-2 text-success animate-in fade-in zoom-in duration-500">
                    <Check className="w-6 h-6" strokeWidth={3} />
                    <span className="font-semibold">Bloco Concluído!</span>
                  </div>
                ) : (
                  <Button onClick={() => markBlockComplete('blockD')} className="bg-green-600 hover:bg-green-700 text-white">
                    <Check className="w-4 h-4 mr-2" />
                    Marcar como Completo
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Completion Modal */}
      <Dialog open={showCompletionModal} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-2xl max-h-[90vh] overflow-y-auto [&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700 text-xl">
              <Check className="w-8 h-8 text-green-600" strokeWidth={3} />
              Reunião Concluída com Sucesso!
            </DialogTitle>
            <DialogDescription>
              Parabéns! Todos os blocos foram preenchidos e a reunião foi salva.
            </DialogDescription>
          </DialogHeader>

          {/* Summary Cards */}
          <div className="space-y-4 py-4">
            {/* Block A Summary */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-green-600" />
                Bloco A - Excelência Operacional
              </h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Distribuição de tempo: {blockA.timeDistribution?.execution}% execução, {blockA.timeDistribution?.meetings}% reuniões, {blockA.timeDistribution?.resolution}% resolução</p>
                <p>• Bloqueadores: <span className={`font-medium ${
                  blockA.blockers?.level === 'green' ? 'text-green-600' :
                  blockA.blockers?.level === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                }`}>{blockA.blockers?.level === 'green' ? 'Verde' : blockA.blockers?.level === 'yellow' ? 'Amarelo' : 'Vermelho'}</span></p>
                <p>• Adequação de ferramentas: {blockA.toolAdequacy}/5</p>
                <p>• Clareza de prioridades: {blockA.priorityClarity}/10</p>
              </div>
            </Card>

            {/* Block B Summary */}
            <Card className="p-4 bg-purple-50 border-purple-200">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-green-600" />
                Bloco B - Alinhamento Estratégico
              </h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Conexão com objetivos: {blockB.goalConnection}/5</p>
                <p>• Autonomia: {blockB.autonomy}%</p>
                <p>• Inovação: {blockB.innovation ? 'Sim' : 'Não'}</p>
              </div>
            </Card>

            {/* Block C Summary */}
            <Card className="p-4 bg-orange-50 border-orange-200">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-green-600" />
                Bloco C - Dinâmica Humana
              </h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Segurança psicológica: {blockC.psychologicalSafety}/5</p>
                <p>• Fricção na colaboração: {blockC.collaborationFriction}/10</p>
                <p>• Reconhecimento: {blockC.recognition === 'low' ? 'Baixo' : blockC.recognition === 'medium' ? 'Médio' : 'Alto'}</p>
              </div>
            </Card>

            {/* Block D Summary */}
            <Card className="p-4 bg-green-50 border-green-200">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-green-600" />
                Bloco D - Desenvolvimento e Bem-estar
              </h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Desafio intelectual: Habilidade {blockD.intellectualChallenge?.skill}/10, Desafio {blockD.intellectualChallenge?.challenge}/10</p>
                <p>• Utilização de forças: {blockD.strengthsUtilization}%</p>
                <p>• Saúde mental: {blockD.mentalHealth}/5</p>
                {blockD.biweeklyFocus && <p>• Foco quinzenal: {blockD.biweeklyFocus}</p>}
              </div>
            </Card>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button
              onClick={handleFinish}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
            >
              <Check className="w-5 h-5 mr-2" />
              Ir para o Calendário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
