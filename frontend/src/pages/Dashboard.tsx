import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Calendar, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { collaborator, isManager, signOut } = useAuth();

  const currentYear = new Date().getFullYear();

  const handleStartMeeting = () => {
    // For demo purposes, create a mock journey/meeting
    const mockJourneyId = 'demo-journey-1';
    const mockMeetingNumber = 1;
    navigate(`/meeting/${mockJourneyId}/${mockMeetingNumber}/retrospective`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">{t('dashboard.title')}</h1>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Button variant="destructive" onClick={signOut}>
                {t('common.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome Section */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {t('common.welcome')}, {collaborator?.name}! 👋
                </h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Badge variant="outline" className="capitalize">
                    {collaborator?.role}
                  </Badge>
                  <span>{collaborator?.email}</span>
                  <Badge>{currentYear}</Badge>
                </div>
              </div>
              <Button size="lg" onClick={handleStartMeeting} className="bg-secondary hover:bg-secondary/90">
                <Plus className="w-5 h-5 mr-2" />
                Nova Reunião 1:1
              </Button>
            </div>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <Calendar className="w-8 h-8 text-primary" />
                <Badge variant="secondary">2025</Badge>
              </div>
              <p className="text-3xl font-bold text-primary mb-1">0</p>
              <p className="text-sm text-muted-foreground">Reuniões Realizadas</p>
            </Card>

            <Card className="p-6 hover:border-secondary/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <TrendingUp className="w-8 h-8 text-secondary" />
              </div>
              <p className="text-3xl font-bold text-secondary mb-1">-</p>
              <p className="text-sm text-muted-foreground">Pulso Médio</p>
            </Card>

            <Card className="p-6 hover:border-yellow-500/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl">📝</div>
              </div>
              <p className="text-3xl font-bold text-yellow-600 mb-1">0</p>
              <p className="text-sm text-muted-foreground">Itens Pendentes</p>
            </Card>

            {isManager && (
              <Card className="p-6 hover:border-purple-500/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-purple-600 mb-1">0</p>
                <p className="text-sm text-muted-foreground">Colaboradores</p>
              </Card>
            )}
          </div>

          {/* Getting Started Guide */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">🚀 Comece Agora</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">1️⃣</div>
                  <div>
                    <h4 className="font-medium mb-1">Inicie sua primeira reunião 1:1</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Clique no botão "Nova Reunião 1:1" para começar
                    </p>
                    <Button size="sm" onClick={handleStartMeeting}>
                      Iniciar Agora
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg opacity-60">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">2️⃣</div>
                  <div>
                    <h4 className="font-medium mb-1">Complete a Retrospectiva</h4>
                    <p className="text-sm text-muted-foreground">
                      Revise itens de ação e compartilhe seu pulso semanal
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg opacity-60">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">3️⃣</div>
                  <div>
                    <h4 className="font-medium mb-1">Preencha os 4 Blocos</h4>
                    <p className="text-sm text-muted-foreground">
                      Operacional, Estratégia, Dinâmica Humana e Desenvolvimento
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg opacity-60">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">4️⃣</div>
                  <div>
                    <h4 className="font-medium mb-1">Acompanhe seu Progresso</h4>
                    <p className="text-sm text-muted-foreground">
                      Visualize relatórios e insights ao longo do ano
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Next Meeting */}
          <Card className="p-6 bg-secondary/5 border-secondary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">📅 Próxima Reunião</h3>
                <p className="text-sm text-muted-foreground">
                  Ainda não há reuniões agendadas
                </p>
              </div>
              <Button variant="outline" onClick={handleStartMeeting}>
                Agendar Primeira Reunião
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
