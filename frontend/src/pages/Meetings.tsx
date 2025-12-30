import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScheduleMeetingModal } from '@/components/meetings/ScheduleMeetingModal';
import { MeetingDetailsModal } from '@/components/meetings/MeetingDetailsModal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Meeting {
  id: string;
  collaboratorName: string;
  collaboratorId: string;
  department: string;
  time: string;
  date: Date;
  meetingNumber: number;
  journeyId: string;
  status?: string;
}

export function Meetings() {
  const { t } = useTranslation();
  const { collaborator, isManager } = useAuth();
  const { toast } = useToast();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Load meetings from API
  useEffect(() => {
    if (collaborator?.tenantId) {
      loadMeetings();
    }
  }, [collaborator]);

  const loadMeetings = async () => {
    try {
      setIsLoading(true);
      const tenantId = typeof collaborator?.tenantId === 'string'
        ? collaborator.tenantId
        : collaborator?.tenantId?._id;
      const response = await api.get(`/meetings/scheduled?tenantId=${tenantId}`);

      // Convert date strings to Date objects
      const meetingsData = response.data.map((m: any) => ({
        ...m,
        date: new Date(m.date),
      }));

      console.log('Loaded meetings:', meetingsData);
      setMeetings(meetingsData);
    } catch (error) {
      console.error('Error loading meetings:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar reuniões',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getMeetingsForDate = (date: Date | null) => {
    if (!date) return [];
    return meetings.filter(meeting =>
      meeting.date.getDate() === date.getDate() &&
      meeting.date.getMonth() === date.getMonth() &&
      meeting.date.getFullYear() === date.getFullYear()
    );
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const handleScheduleSuccess = () => {
    loadMeetings();
  };

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsDetailsModalOpen(true);
  };

  const handleMeetingDelete = () => {
    loadMeetings();
  };

  const handleMeetingReschedule = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsRescheduling(true);
    setIsModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setIsModalOpen(false);
    setIsRescheduling(false);
    setSelectedMeeting(null);
  };

  const days = getDaysInMonth(currentDate);

  // Calculate stats
  const totalMeetings = meetings.length;
  const thisMonthMeetings = meetings.filter(m =>
    m.date.getMonth() === currentDate.getMonth() &&
    m.date.getFullYear() === currentDate.getFullYear()
  ).length;

  const today = new Date();
  const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const nextSevenDaysMeetings = meetings.filter(m =>
    m.date >= today && m.date <= sevenDaysLater
  ).length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-6">
            <CalendarIcon className="w-8 h-8 text-primary mt-1" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-primary">Reuniões 1:1</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie e visualize todas as reuniões agendadas
              </p>
            </div>
            {isManager && (
              <Button size="lg" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Nova Reunião
              </Button>
            )}
          </div>

          {/* Calendar Controls */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={goToNextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-semibold ml-2">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
              </div>
              <Button variant="outline" onClick={goToToday}>
                Hoje
              </Button>
            </div>
          </Card>

          {/* Calendar Grid */}
          <Card className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Carregando reuniões...</div>
              </div>
            ) : (
              <>
                {/* Week Days Header */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center font-semibold text-sm text-muted-foreground py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {days.map((date, index) => {
                    const dateMeetings = getMeetingsForDate(date);
                    const isCurrentDay = isToday(date);

                    return (
                      <div
                        key={index}
                        className={cn(
                          'min-h-[120px] border rounded-lg p-2 transition-colors',
                          date ? 'bg-card hover:bg-accent/50 cursor-pointer' : 'bg-muted/20',
                          isCurrentDay && 'border-primary border-2 bg-primary/5'
                        )}
                      >
                        {date && (
                          <>
                            <div className={cn(
                              'text-sm font-medium mb-2',
                              isCurrentDay ? 'text-primary font-bold' : 'text-muted-foreground'
                            )}>
                              {date.getDate()}
                            </div>
                            <div className="space-y-1">
                              {dateMeetings.map((meeting) => {
                                const isCompleted = meeting.status === 'completed';
                                return (
                                  <div
                                    key={meeting.id}
                                    onClick={() => handleMeetingClick(meeting)}
                                    className={cn(
                                      "border rounded px-2 py-1 text-xs transition-colors cursor-pointer",
                                      isCompleted
                                        ? "bg-gray-100 border-gray-300 opacity-60 hover:opacity-80"
                                        : "bg-primary/10 border-primary/20 hover:bg-primary/30"
                                    )}
                                  >
                                    <div className={cn(
                                      "font-semibold truncate",
                                      isCompleted ? "text-gray-500 line-through" : "text-primary"
                                    )}>
                                      {meeting.collaboratorName}
                                      {isCompleted && <span className="ml-1">✓</span>}
                                    </div>
                                    <div className="flex items-center justify-between mt-0.5">
                                      <span className={cn(
                                        "truncate flex-1",
                                        isCompleted ? "text-gray-400" : "text-muted-foreground"
                                      )}>
                                        {meeting.department}
                                      </span>
                                      <Badge
                                        variant={isCompleted ? "outline" : "secondary"}
                                        className={cn(
                                          "ml-1 text-xs",
                                          isCompleted && "text-gray-400 border-gray-300"
                                        )}
                                      >
                                        {meeting.time}
                                      </Badge>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </Card>

          {/* Legend/Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Total de Reuniões</div>
              <div className="text-2xl font-bold text-primary">{totalMeetings}</div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Este Mês</div>
              <div className="text-2xl font-bold text-secondary">
                {thisMonthMeetings}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Próximas 7 Dias</div>
              <div className="text-2xl font-bold text-yellow-600">
                {nextSevenDaysMeetings}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      <ScheduleMeetingModal
        isOpen={isModalOpen}
        onClose={handleCloseScheduleModal}
        onSuccess={handleScheduleSuccess}
        existingMeeting={selectedMeeting}
        isReschedule={isRescheduling}
      />

      {/* Meeting Details Modal */}
      <MeetingDetailsModal
        meeting={selectedMeeting}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onDelete={handleMeetingDelete}
        onReschedule={handleMeetingReschedule}
      />
    </Layout>
  );
}
