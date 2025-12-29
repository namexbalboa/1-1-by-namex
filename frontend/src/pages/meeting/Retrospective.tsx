import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ActionItemsList } from '@/components/meeting/ActionItemsList';
import { PulseHistory } from '@/components/meeting/PulseHistory';
import { useMeetingStore } from '@/stores/meetingStore';
import { useAuth } from '@/hooks/useAuth';
import type { ActionItem, PulseHistoryItem } from '@/types';

export function Retrospective() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { journeyId, meetingNumber } = useParams();
  const { collaborator } = useAuth();
  const { currentMeeting, setCurrentMeeting } = useMeetingStore();

  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [pulseHistory, setPulseHistory] = useState<PulseHistoryItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load existing data if available
    if (currentMeeting) {
      setActionItems(currentMeeting.actionItems || []);
      setPulseHistory(currentMeeting.pulseHistory || []);
    }
  }, [currentMeeting]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update current meeting in store
      setCurrentMeeting({
        ...currentMeeting!,
        actionItems,
        pulseHistory,
      });

      // TODO: Save to backend via API
      // await apiClient.meetings.updateMeeting(journeyId!, Number(meetingNumber), {
      //   actionItems,
      //   pulseHistory,
      // });

      // Navigate to next phase
      navigate(`/meeting/${journeyId}/${meetingNumber}/planning`);
    } catch (error) {
      console.error('Error saving retrospective:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

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
                  {t('meeting.retrospective')} - Reunião #{meetingNumber}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {collaborator?.name} | Fase 1 de 2
                </p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction Card */}
          <Card className="p-6 bg-primary/5 border-primary/20">
            <h2 className="text-lg font-semibold mb-2">
              👋 Bem-vindo à Retrospectiva!
            </h2>
            <p className="text-sm text-muted-foreground">
              Nesta fase, vamos revisar o que aconteceu desde a última reunião.
              Atualize seus itens de ação e compartilhe como foi seu pulso nas últimas semanas.
            </p>
          </Card>

          {/* Action Items Section */}
          <Card className="p-6">
            <ActionItemsList
              items={actionItems}
              onChange={setActionItems}
            />
          </Card>

          {/* Pulse History Section */}
          <Card className="p-6">
            <PulseHistory
              pulseHistory={pulseHistory}
              onChange={setPulseHistory}
              weeksCount={8}
            />
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.cancel')}
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Fase 1 de 2
              </span>
              <Button onClick={handleSave} disabled={saving} size="lg">
                {t('common.next')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
