import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Eye, Calendar as CalendarIcon, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';

interface CollaboratorHistory {
  collaboratorId: string;
  collaboratorName: string;
  department: string;
  currentManager: string;
  metrics: {
    completedMeetings: number;
    averageSatisfaction: number;
    pendingActionItems: number;
    attendanceRate: number;
  };
  lastMeeting: Date | null;
  nextMeeting: Date | null;
}

export function History() {
  const navigate = useNavigate();
  const { collaborator, isManager } = useAuth();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [historyData, setHistoryData] = useState<CollaboratorHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Redirect non-managers
    if (!isManager) {
      navigate('/dashboard');
      return;
    }

    loadHistoryData();
  }, [selectedYear, isManager, navigate, collaborator?.tenantId]);

  const loadHistoryData = async () => {
    setIsLoading(true);
    try {
      const tenantId = typeof collaborator?.tenantId === 'object'
        ? collaborator?.tenantId?._id
        : collaborator?.tenantId;

      if (!tenantId) {
        console.error('No tenantId found');
        setIsLoading(false);
        return;
      }

      const response = await api.get('/meetings/history', {
        params: { tenantId, year: selectedYear }
      });

      setHistoryData(response.data);
    } catch (error) {
      console.error('Error loading history:', error);
      setHistoryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousYear = () => {
    setSelectedYear(prev => prev - 1);
  };

  const handleNextYear = () => {
    if (selectedYear < currentYear) {
      setSelectedYear(prev => prev + 1);
    }
  };

  const handleViewDetails = (collaboratorId: string) => {
    navigate(`/history/${collaboratorId}/${selectedYear}`);
  };

  const getSatisfactionBadge = (score: number) => {
    if (score === 0) return { variant: 'outline' as const, label: 'N/A' };
    if (score >= 7) return { variant: 'default' as const, label: 'Alta' };
    if (score >= 5) return { variant: 'secondary' as const, label: 'Média' };
    return { variant: 'destructive' as const, label: 'Baixa' };
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header with Year Navigation */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">📊 Histórico de Reuniões</h1>
                <p className="text-sm text-muted-foreground">
                  Visualize o histórico e métricas dos colaboradores
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousYear}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="text-center min-w-[100px]">
                  <p className="text-3xl font-bold text-primary">{selectedYear}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextYear}
                  disabled={selectedYear >= currentYear}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>

          {/* History Table */}
          <Card className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando histórico...</p>
              </div>
            ) : historyData.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">Nenhum registro encontrado para {selectedYear}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-center py-4 px-2 text-sm font-semibold text-muted-foreground">
                      </th>
                      <th className="text-left py-4 px-3 text-sm font-semibold text-muted-foreground">
                        Colaborador
                      </th>
                      <th className="text-left py-4 px-3 text-sm font-semibold text-muted-foreground">
                        Departamento
                      </th>
                      <th className="text-left py-4 px-3 text-sm font-semibold text-muted-foreground">
                        Gestor Atual
                      </th>
                      <th className="text-center py-4 px-2 text-sm font-semibold text-muted-foreground">
                        Reuniões
                      </th>
                      <th className="text-center py-4 px-2 text-sm font-semibold text-muted-foreground">
                        Satisfação
                      </th>
                      <th className="text-center py-4 px-2 text-sm font-semibold text-muted-foreground">
                        Pendentes
                      </th>
                      <th className="text-center py-4 px-2 text-sm font-semibold text-muted-foreground">
                        Presença
                      </th>
                      <th className="text-center py-4 px-3 text-sm font-semibold text-muted-foreground">
                        Última Reunião
                      </th>
                      <th className="text-center py-4 px-3 text-sm font-semibold text-muted-foreground">
                        Próxima Reunião
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((item) => {
                      const satisfactionBadge = getSatisfactionBadge(item.metrics.averageSatisfaction);

                      return (
                        <tr
                          key={item.collaboratorId}
                          className="border-b border-border/50 hover:bg-accent/50 transition-colors"
                        >
                          <td className="py-4 px-2 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(item.collaboratorId)}
                              title="Ver detalhes"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-primary" />
                              <span className="font-medium">{item.collaboratorName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-3 text-sm text-muted-foreground">
                            {item.department}
                          </td>
                          <td className="py-4 px-3 text-sm text-muted-foreground">
                            {item.currentManager}
                          </td>
                          <td className="py-4 px-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <CalendarIcon className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium">{item.metrics.completedMeetings}</span>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <Badge variant={satisfactionBadge.variant} className="text-xs">
                              {item.metrics.averageSatisfaction > 0
                                ? `${item.metrics.averageSatisfaction.toFixed(1)}`
                                : 'N/A'}
                            </Badge>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <AlertCircle className="w-4 h-4 text-yellow-600" />
                              <span className="text-sm font-medium text-yellow-600">
                                {item.metrics.pendingActionItems}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <span className={`text-sm font-medium ${
                              item.metrics.attendanceRate >= 80 ? 'text-green-600' :
                              item.metrics.attendanceRate >= 60 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {item.metrics.attendanceRate}%
                            </span>
                          </td>
                          <td className="py-4 px-3 text-center text-sm">
                            {formatDate(item.lastMeeting)}
                          </td>
                          <td className="py-4 px-3 text-center text-sm">
                            {formatDate(item.nextMeeting)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}
