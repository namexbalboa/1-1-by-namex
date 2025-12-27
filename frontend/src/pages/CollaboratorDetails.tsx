import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, TrendingUp, Edit } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

interface Collaborator {
  _id: string;
  name: string;
  email: string;
  role: 'manager' | 'employee';
  managerId?: {
    _id: string;
    name: string;
    email: string;
  };
  preferredLanguage: string;
  isActive: boolean;
}

interface Meeting {
  meetingNumber: number;
  date: string;
  actionItems: Array<{
    description: string;
    status: 'done' | 'pending' | 'blocked';
  }>;
  pulseHistory: Array<{
    week: number;
    value: number;
  }>;
  blockA?: any;
  blockB?: any;
  blockC?: any;
  blockD?: any;
}

interface Journey {
  _id: string;
  year: number;
  meetings: Meeting[];
}

export function CollaboratorDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [collaborator, setCollaborator] = useState<Collaborator | null>(null);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollaboratorData();
  }, [id]);

  const loadCollaboratorData = async () => {
    try {
      setLoading(true);

      // Load collaborator info
      const collabResponse = await api.get(`/collaborators/${id}`);
      setCollaborator(collabResponse.data);

      // Load meeting history
      const journeysResponse = await api.get(`/meetings/journeys/collaborator/${id}`);
      setJourneys(journeysResponse.data);
    } catch (error) {
      console.error('Error loading collaborator data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    let totalMeetings = 0;
    let totalPulse = 0;
    let pulseCount = 0;
    let pendingActions = 0;

    journeys.forEach(journey => {
      totalMeetings += journey.meetings.length;

      journey.meetings.forEach(meeting => {
        // Count pulse values
        if (meeting.pulseHistory && meeting.pulseHistory.length > 0) {
          meeting.pulseHistory.forEach(pulse => {
            totalPulse += pulse.value;
            pulseCount++;
          });
        }

        // Count pending action items
        if (meeting.actionItems) {
          pendingActions += meeting.actionItems.filter(
            item => item.status === 'pending'
          ).length;
        }
      });
    });

    const averagePulse = pulseCount > 0 ? (totalPulse / pulseCount).toFixed(1) : '-';

    return {
      totalMeetings,
      averagePulse,
      pendingActions,
    };
  };

  const stats = collaborator ? calculateStats() : { totalMeetings: 0, averagePulse: '-', pendingActions: 0 };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p>{t('common.loading')}</p>
        </div>
      </Layout>
    );
  }

  if (!collaborator) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p>Colaborador não encontrado</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/collaborators')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back')}
        </Button>

        {/* Collaborator Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-semibold text-primary">
                  {collaborator.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold">{collaborator.name}</h1>
                  <Badge variant={collaborator.role === 'manager' ? 'default' : 'secondary'}>
                    {t(`collaborators.roles.${collaborator.role}`)}
                  </Badge>
                  <Badge variant={collaborator.isActive ? 'default' : 'destructive'}>
                    {collaborator.isActive ? t('collaborators.active') : t('collaborators.inactive')}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{collaborator.email}</p>
                {collaborator.managerId && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('collaborators.manager')}: {collaborator.managerId.name}
                  </p>
                )}
              </div>
            </div>
            <Button onClick={() => navigate(`/collaborators/${id}/edit`)}>
              <Edit className="w-4 h-4 mr-2" />
              {t('common.edit')}
            </Button>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary mb-1">{stats.totalMeetings}</p>
            <p className="text-sm text-muted-foreground">Reuniões Realizadas</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="w-8 h-8 text-secondary" />
            </div>
            <p className="text-3xl font-bold text-secondary mb-1">{stats.averagePulse}</p>
            <p className="text-sm text-muted-foreground">Pulso Médio</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl">📝</div>
            </div>
            <p className="text-3xl font-bold text-yellow-600 mb-1">{stats.pendingActions}</p>
            <p className="text-sm text-muted-foreground">Itens Pendentes</p>
          </Card>
        </div>

        {/* Meeting History */}
        <div>
          <h2 className="text-xl font-bold mb-4">{t('collaborators.meetingHistory')}</h2>

          {journeys.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">{t('collaborators.noMeetings')}</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {journeys.map(journey => (
                <Card key={journey._id} className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {journey.year} - {journey.meetings.length} reuniões
                  </h3>

                  <div className="space-y-3">
                    {journey.meetings
                      .sort((a, b) => b.meetingNumber - a.meetingNumber)
                      .map(meeting => (
                        <div
                          key={meeting.meetingNumber}
                          className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-semibold">
                                  Reunião #{meeting.meetingNumber}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(meeting.date).toLocaleDateString('pt-BR')}
                                </span>
                              </div>

                              <div className="flex items-center gap-4 text-sm">
                                {meeting.actionItems && meeting.actionItems.length > 0 && (
                                  <span className="text-muted-foreground">
                                    {meeting.actionItems.filter(a => a.status === 'done').length}/
                                    {meeting.actionItems.length} ações concluídas
                                  </span>
                                )}

                                {meeting.pulseHistory && meeting.pulseHistory.length > 0 && (
                                  <span className="text-muted-foreground">
                                    Pulso: {meeting.pulseHistory[meeting.pulseHistory.length - 1].value}/5
                                  </span>
                                )}
                              </div>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(
                                `/meeting/${journey._id}/${meeting.meetingNumber}/retrospective`
                              )}
                            >
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
