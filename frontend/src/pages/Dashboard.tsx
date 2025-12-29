import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Plus, Calendar, TrendingUp, Users, History, Target, Clock, User as UserIcon, Play, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PermissionGate } from '@/components/auth/PermissionGate';
import { WelcomeModal } from '@/components/onboarding/WelcomeModal';
import { useToast } from '@/hooks/useToast';
import { useConfirm } from '@/hooks/useConfirm';
import { api } from '@/lib/api';

interface UpcomingMeeting {
  id: string;
  collaboratorName: string;
  collaboratorId: string;
  department: string;
  date: Date;
  time: string;
  meetingNumber: number;
  journeyId: string;
}

interface DashboardStatistics {
  completedMeetings: number;
  averageSatisfaction: number;
  pendingActionItems: number;
  totalCollaborators?: number;
}

export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { collaborator, isManager } = useAuth();
  const { canViewTeamAnalytics } = usePermissions();
  const [upcomingMeetings, setUpcomingMeetings] = useState<UpcomingMeeting[]>([]);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [statistics, setStatistics] = useState<DashboardStatistics>({
    completedMeetings: 0,
    averageSatisfaction: 0,
    pendingActionItems: 0,
    totalCollaborators: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const toast = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const currentYear = new Date().getFullYear();

  // Check if this is the first time the manager is accessing the app
  useEffect(() => {
    if (isManager && collaborator?._id) {
      const welcomeShownKey = `welcome-shown-${collaborator._id}`;
      const hasShownWelcome = localStorage.getItem(welcomeShownKey);

      if (!hasShownWelcome) {
        setShowWelcomeModal(true);
        localStorage.setItem(welcomeShownKey, 'true');
      }
    }
  }, [isManager, collaborator?._id]);

  useEffect(() => {
    if (collaborator?.tenantId) {
      loadStatistics();
      if (isManager) {
        loadUpcomingMeetings();
      }
    }
  }, [isManager, collaborator?.tenantId, collaborator?._id]);

  const loadStatistics = async () => {
    setIsLoadingStats(true);
    try {
      const tenantId = typeof collaborator?.tenantId === 'object'
        ? collaborator?.tenantId?._id
        : collaborator?.tenantId;

      if (!tenantId) {
        console.error('No tenantId found in collaborator');
        setIsLoadingStats(false);
        return;
      }

      const response = await api.get('/meetings/statistics', {
        params: {
          tenantId,
          collaboratorId: collaborator?._id,
          isManager: isManager.toString(),
        }
      });

      setStatistics(response.data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const loadUpcomingMeetings = async () => {
    setIsLoadingMeetings(true);
    try {
      const tenantId = typeof collaborator?.tenantId === 'object'
        ? collaborator?.tenantId?._id
        : collaborator?.tenantId;

      if (!tenantId) {
        console.error('No tenantId found in collaborator');
        setUpcomingMeetings([]);
        setIsLoadingMeetings(false);
        return;
      }

      const response = await api.get('/meetings/upcoming', {
        params: { tenantId, limit: 5 }
      });

      const meetings = response.data.map((meeting: any) => ({
        id: meeting._id,
        collaboratorName: meeting.collaborator?.name || 'N/A',
        collaboratorId: meeting.collaborator?._id || '',
        department: meeting.collaborator?.department?.name || 'N/A',
        date: new Date(meeting.scheduledDate),
        time: new Date(meeting.scheduledDate).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        meetingNumber: meeting.meetingNumber,
        journeyId: meeting.journeyId || '',
      }));

      setUpcomingMeetings(meetings);
    } catch (error) {
      console.error('Error loading upcoming meetings:', error);
      setUpcomingMeetings([]);
    } finally {
      setIsLoadingMeetings(false);
    }
  };

  const handleNewMeeting = () => {
    navigate('/meetings');
  };

  const handleStartMeeting = (meeting: UpcomingMeeting) => {
    navigate(`/meeting/${meeting.journeyId}/${meeting.meetingNumber}/planning`);
  };

  const handleDeleteMeeting = async (meeting: UpcomingMeeting, e: React.MouseEvent) => {
    e.stopPropagation();

    const confirmed = await confirm({
      title: 'Excluir Reunião',
      description: `Tem certeza que deseja excluir a reunião com ${meeting.collaboratorName}?`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });

    if (!confirmed) return;

    try {
      await api.delete(`/meetings/journeys/${meeting.journeyId}/meetings/${meeting.meetingNumber}`);
      toast.success('Sucesso', 'Reunião excluída com sucesso');
      loadUpcomingMeetings(); // Reload the list
    } catch (error: any) {
      console.error('Error deleting meeting:', error);
      toast.error('Erro', error.response?.data?.message || 'Erro ao excluir reunião');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {t('common.welcome')}, {collaborator?.name}! 👋
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <Badge variant="outline" className="capitalize">
                    {collaborator?.role === 'manager' ? 'Gestor' : 'Colaborador'}
                  </Badge>
                  <span className="hidden sm:inline">{collaborator?.email}</span>
                  <Badge>{currentYear}</Badge>
                </div>
              </div>
              <PermissionGate require="manager">
                <Button size="lg" onClick={handleNewMeeting} variant="secondary">
                  <Plus className="w-5 h-5 mr-2" />
                  Nova Reunião 1:1
                </Button>
              </PermissionGate>
            </div>
          </Card>

          {/* Stats Overview */}
          <div className={`grid grid-cols-1 gap-4 ${isManager ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
            <Card className="p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <Calendar className="w-8 h-8 text-primary" />
                <Badge variant="secondary">{currentYear}</Badge>
              </div>
              <p className="text-3xl font-bold text-primary mb-1">
                {isLoadingStats ? '...' : statistics.completedMeetings}
              </p>
              <p className="text-sm text-muted-foreground">Reuniões Realizadas</p>
            </Card>

            <Card className="p-6 hover:border-secondary/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="w-8 h-8 text-secondary" />
                {!isLoadingStats && statistics.averageSatisfaction > 0 && (
                  <Badge variant={statistics.averageSatisfaction >= 7 ? 'default' : statistics.averageSatisfaction >= 5 ? 'secondary' : 'destructive'}>
                    {statistics.averageSatisfaction >= 7 ? 'Alta' : statistics.averageSatisfaction >= 5 ? 'Média' : 'Baixa'}
                  </Badge>
                )}
              </div>
              <p className="text-3xl font-bold text-secondary mb-1">
                {isLoadingStats ? '...' : statistics.averageSatisfaction > 0 ? statistics.averageSatisfaction.toFixed(1) : '-'}
              </p>
              <p className="text-sm text-muted-foreground">Taxa de Satisfação</p>
              <p className="text-xs text-muted-foreground mt-1">Clima + Bem-estar</p>
            </Card>

            <Card className="p-6 hover:border-yellow-500/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl">📝</div>
              </div>
              <p className="text-3xl font-bold text-yellow-600 mb-1">
                {isLoadingStats ? '...' : statistics.pendingActionItems}
              </p>
              <p className="text-sm text-muted-foreground">Itens Pendentes</p>
            </Card>

            {isManager && (
              <Card className="p-6 hover:border-purple-500/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-purple-600 mb-1">
                  {isLoadingStats ? '...' : statistics.totalCollaborators || 0}
                </p>
                <p className="text-sm text-muted-foreground">Colaboradores</p>
              </Card>
            )}
          </div>

          {/* Employee View - Personal Journey */}
          <PermissionGate require="employee">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* My Meetings History */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <History className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold">Histórico de Reuniões</h3>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Nenhuma reunião registrada ainda</p>
                  <p className="text-xs mt-1">Aguarde seu gestor agendar a primeira reunião</p>
                </div>
              </Card>

              {/* My Development Goals */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-secondary" />
                  <h3 className="text-lg font-semibold">Metas de Desenvolvimento</h3>
                </div>
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Nenhuma meta definida ainda</p>
                  <p className="text-xs mt-1">Suas metas aparecerão aqui após as reuniões</p>
                </div>
              </Card>
            </div>
          </PermissionGate>

          {/* Upcoming Meetings */}
          <PermissionGate require="manager">
            <Card className="p-6 bg-secondary/5 border-secondary/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">📅 Próximas Reuniões</h3>
                <Button variant="outline" size="sm" onClick={() => navigate('/meetings')}>
                  Ver Todas
                </Button>
              </div>

              {isLoadingMeetings ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">Carregando reuniões...</p>
                </div>
              ) : upcomingMeetings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Nenhuma reunião agendada</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => navigate('/meetings')}
                  >
                    Agendar Primeira Reunião
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          Colaborador
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          Departamento
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          Data
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          Horário
                        </th>
                        <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                          #
                        </th>
                        <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingMeetings.map((meeting) => (
                        <tr
                          key={meeting.id}
                          className="border-b border-border/50 hover:bg-accent/50 transition-colors"
                        >
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <UserIcon className="w-4 h-4 text-primary" />
                              <span className="font-medium">{meeting.collaboratorName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-sm text-muted-foreground">
                            {meeting.department}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-secondary" />
                              {meeting.date.toLocaleDateString('pt-BR')}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-secondary" />
                              {meeting.time}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant="outline" className="text-xs">
                              #{meeting.meetingNumber}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => handleStartMeeting(meeting)}
                                title="Iniciar reunião"
                              >
                                <Play className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => navigate('/meetings')}
                                title="Reagendar"
                              >
                                <Edit className="w-4 h-4 text-gray-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={(e) => handleDeleteMeeting(meeting, e)}
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </PermissionGate>

          <PermissionGate require="employee">
            <Card className="p-6 bg-secondary/5 border-secondary/20">
              <h3 className="font-semibold mb-1">📅 Próxima Reunião</h3>
              <p className="text-sm text-muted-foreground">
                Aguardando agendamento do seu gestor
              </p>
            </Card>
          </PermissionGate>
        </div>
      </div>

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
      />

      {/* Confirm Dialog */}
      {ConfirmDialog}
    </Layout>
  );
}
