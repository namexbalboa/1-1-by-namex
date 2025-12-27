import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Check } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlockA } from '@/components/meeting/blocks/BlockA';
import { BlockB } from '@/components/meeting/blocks/BlockB';
import { BlockC } from '@/components/meeting/blocks/BlockC';
import { BlockD } from '@/components/meeting/blocks/BlockD';
import { useMeetingStore } from '@/stores/meetingStore';
import { useAuth } from '@/hooks/useAuth';
import type { BlockA as BlockAType, BlockB as BlockBType, BlockC as BlockCType, BlockD as BlockDType } from '@/types';

export function Planning() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { journeyId, meetingNumber } = useParams();
  const { collaborator } = useAuth();
  const { currentMeeting, setCurrentMeeting } = useMeetingStore();

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

  useEffect(() => {
    // Load existing data if available
    if (currentMeeting) {
      if (currentMeeting.blockA) setBlockA(currentMeeting.blockA);
      if (currentMeeting.blockB) setBlockB(currentMeeting.blockB);
      if (currentMeeting.blockC) setBlockC(currentMeeting.blockC);
      if (currentMeeting.blockD) setBlockD(currentMeeting.blockD);
    }
  }, [currentMeeting]);

  const markBlockComplete = (block: string) => {
    setCompletedBlocks(prev => new Set([...prev, block]));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update current meeting in store
      setCurrentMeeting({
        ...currentMeeting!,
        blockA,
        blockB,
        blockC,
        blockD,
      });

      // TODO: Save to backend via API
      // await apiClient.meetings.updateMeeting(journeyId!, Number(meetingNumber), {
      //   blockA, blockB, blockC, blockD
      // });

      // Navigate back to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving planning:', error);
    } finally {
      setSaving(false);
    }
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
            <Button onClick={handleSave} disabled={saving || !allBlocksComplete}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? t('common.loading') : t('common.finish')}
            </Button>
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
                    <Check className="w-5 h-5 text-success" strokeWidth={3} />
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
                    <Check className="w-5 h-5 text-success" strokeWidth={3} />
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
                    <Check className="w-5 h-5 text-success" strokeWidth={3} />
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
                    <Check className="w-5 h-5 text-success" strokeWidth={3} />
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
                <Button variant="outline" onClick={() => setActiveTab('blockA')}>
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
                <Button variant="outline" onClick={() => setActiveTab('blockB')}>
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
                <Button variant="outline" onClick={() => setActiveTab('blockC')}>
                  Voltar
                </Button>
                <Button onClick={() => markBlockComplete('blockD')} variant="success">
                  <Check className="w-4 h-4 mr-2" />
                  Marcar como Completo
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Final Save Button */}
          {allBlocksComplete && (
            <Card className="p-6 bg-success/10 border-success/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Check className="w-6 h-6 text-success" strokeWidth={3} />
                    Todos os blocos completos!
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Você pode finalizar a reunião agora.
                  </p>
                </div>
                <Button onClick={handleSave} disabled={saving} size="lg" variant="success">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? t('common.loading') : t('common.finish')}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
