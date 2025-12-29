import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Building2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/useToast';
import { useConfirm } from '@/hooks/useConfirm';
import { api } from '@/lib/api';

interface Meeting {
  id: string;
  collaboratorName: string;
  collaboratorId: string;
  department: string;
  time: string;
  date: Date;
  meetingNumber: number;
  journeyId: string;
}

interface MeetingDetailsModalProps {
  meeting: Meeting | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onReschedule: (meeting: Meeting) => void;
}

export function MeetingDetailsModal({
  meeting,
  isOpen,
  onClose,
  onDelete,
  onReschedule,
}: MeetingDetailsModalProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const { confirm, ConfirmDialog } = useConfirm();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!meeting) return null;

  const formattedDate = meeting.date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleStartMeeting = () => {
    // Navigate to planning page with meeting context
    navigate(`/meeting/${meeting.journeyId}/${meeting.meetingNumber}/planning`);
    onClose();
  };

  const handleReschedule = () => {
    onReschedule(meeting);
    onClose();
  };

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Excluir Reunião',
      description: `Tem certeza que deseja excluir a reunião com ${meeting.collaboratorName}?`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await api.delete(`/meetings/journeys/${meeting.journeyId}/meetings/${meeting.meetingNumber}`);
      toast.success('Sucesso', 'Reunião excluída com sucesso');
      onDelete();
      onClose();
    } catch (error: any) {
      console.error('Error deleting meeting:', error);
      toast.error('Erro', error.response?.data?.message || 'Erro ao excluir reunião');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Detalhes da Reunião 1:1
          </DialogTitle>
          <DialogDescription>
            Reunião #{meeting.meetingNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Collaborator Info */}
          <div className="flex items-start gap-3 p-4 bg-accent/50 rounded-lg">
            <User className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-lg">{meeting.collaboratorName}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Building2 className="w-4 h-4" />
                {meeting.department}
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Calendar className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">Data</div>
                <div className="font-medium capitalize">{formattedDate}</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="text-sm text-muted-foreground">Horário</div>
                <div className="font-medium">{meeting.time}</div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2 flex-1">
            <Button
              onClick={handleReschedule}
              variant="ghost"
              className="flex-1 !bg-gray-200 !text-gray-700 hover:!bg-gray-300 !border-0 !shadow-none hover:!shadow-none !scale-100 hover:!scale-100"
              disabled={isDeleting}
            >
              Reagendar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </Button>
          </div>
          <Button
            onClick={handleStartMeeting}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            disabled={isDeleting}
          >
            Iniciar Agora
          </Button>
        </DialogFooter>
      </DialogContent>
      {ConfirmDialog}
    </Dialog>
  );
}
