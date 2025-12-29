import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, Users, Building2, Briefcase } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

interface Department {
  _id: string;
  name: string;
}

interface JobRole {
  _id: string;
  name: string;
  description?: string;
}

interface Collaborator {
  _id: string;
  name: string;
  email: string;
  departmentId: string | Department;
  jobRoleId: string | JobRole;
}

interface ExistingMeeting {
  id: string;
  collaboratorId: string;
  journeyId: string;
  meetingNumber: number;
  date: Date;
  time: string;
}

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingMeeting?: ExistingMeeting | null;
  isReschedule?: boolean;
}

export function ScheduleMeetingModal({
  isOpen,
  onClose,
  onSuccess,
  existingMeeting = null,
  isReschedule = false
}: ScheduleMeetingModalProps) {
  const { t } = useTranslation();
  const toast = useToast();
  const { collaborator: currentUser } = useAuth();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [filteredJobRoles, setFilteredJobRoles] = useState<JobRole[]>([]);
  const [filteredCollaborators, setFilteredCollaborators] = useState<Collaborator[]>([]);

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedJobRole, setSelectedJobRole] = useState('');
  const [selectedCollaborator, setSelectedCollaborator] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const loadDepartments = async () => {
    try {
      const tenantId = typeof currentUser?.tenantId === 'string'
        ? currentUser.tenantId
        : currentUser?.tenantId?._id;
      const response = await api.get(`/settings/departments?tenantId=${tenantId}`);
      setDepartments(response.data);
    } catch (error: any) {
      console.error('Error loading departments:', error);
      toast.error('Erro', 'Erro ao carregar departamentos');
    }
  };

  const loadJobRoles = async () => {
    try {
      const tenantId = typeof currentUser?.tenantId === 'string'
        ? currentUser.tenantId
        : currentUser?.tenantId?._id;
      const response = await api.get(`/settings/job-roles?tenantId=${tenantId}`);
      setJobRoles(response.data);
    } catch (error: any) {
      console.error('Error loading job roles:', error);
      toast.error('Erro', 'Erro ao carregar cargos');
    }
  };

  const loadCollaborators = async () => {
    try {
      const tenantId = typeof currentUser?.tenantId === 'string'
        ? currentUser.tenantId
        : currentUser?.tenantId?._id;
      const response = await api.get(`/auth/collaborators?tenantId=${tenantId}`);
      // Filter out current user (all collaborators returned are employees)
      const employees = response.data.filter(
        (c: Collaborator) => c._id !== currentUser?._id
      );
      setCollaborators(employees);
    } catch (error: any) {
      console.error('Error loading collaborators:', error);
      toast.error('Erro', 'Erro ao carregar colaboradores');
    }
  };

  const filterJobRoles = () => {
    // If no department selected or "all" selected, show all job roles
    if (!selectedDepartment || selectedDepartment === '__all__') {
      setFilteredJobRoles(jobRoles);
      return;
    }

    // Filter collaborators by department
    const collaboratorsInDepartment = collaborators.filter((c) => {
      const deptId = typeof c.departmentId === 'string' ? c.departmentId : c.departmentId?._id;
      return deptId === selectedDepartment;
    });

    // Get unique job role IDs from those collaborators
    const jobRoleIdsInDepartment = new Set(
      collaboratorsInDepartment.map((c) =>
        typeof c.jobRoleId === 'string' ? c.jobRoleId : c.jobRoleId?._id
      )
    );

    // Filter job roles to only those present in the selected department
    const filtered = jobRoles.filter((role) => jobRoleIdsInDepartment.has(role._id));
    setFilteredJobRoles(filtered);

    // Reset job role selection if it's not in the filtered list
    if (selectedJobRole && selectedJobRole !== '__all__' && !filtered.find((r) => r._id === selectedJobRole)) {
      setSelectedJobRole('');
    }
  };

  const filterCollaborators = () => {
    let filtered = [...collaborators];

    if (selectedDepartment && selectedDepartment !== '__all__') {
      filtered = filtered.filter((c) => {
        const deptId = typeof c.departmentId === 'string' ? c.departmentId : c.departmentId?._id;
        return deptId === selectedDepartment;
      });
    }

    if (selectedJobRole && selectedJobRole !== '__all__') {
      filtered = filtered.filter((c) => {
        const roleId = typeof c.jobRoleId === 'string' ? c.jobRoleId : c.jobRoleId?._id;
        return roleId === selectedJobRole;
      });
    }

    setFilteredCollaborators(filtered);

    // Reset collaborator selection if it's not in the filtered list
    if (selectedCollaborator && !filtered.find((c) => c._id === selectedCollaborator)) {
      setSelectedCollaborator('');
    }
  };

  const handleSchedule = async () => {
    if (!selectedCollaborator || !selectedDate || !selectedTime) {
      toast.error('Campos obrigatórios', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      const tenantId = typeof currentUser?.tenantId === 'string'
        ? currentUser.tenantId
        : currentUser?.tenantId?._id;

      if (isReschedule && existingMeeting) {
        // Update existing meeting
        await api.patch(`/meetings/journeys/${existingMeeting.journeyId}/meetings/${existingMeeting.meetingNumber}`, {
          date: `${selectedDate}T${selectedTime}:00`,
        });
        toast.success('Sucesso', 'Reunião reagendada com sucesso!');
      } else {
        // Create new meeting
        await api.post('/meetings/schedule', {
          tenantId,
          collaboratorId: selectedCollaborator,
          managerId: currentUser?._id,
          date: selectedDate,
          time: selectedTime,
        });
        toast.success('Sucesso', 'Reunião agendada com sucesso! Email de confirmação enviado.');
      }

      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error('Error scheduling meeting:', error);
      const action = isReschedule ? 'reagendar' : 'agendar';
      toast.error('Erro', error.response?.data?.message || `Erro ao ${action} reunião`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDepartment('');
    setSelectedJobRole('');
    setSelectedCollaborator('');
    setSelectedDate('');
    setSelectedTime('');
    onClose();
  };

  // Load initial data
  useEffect(() => {
    if (isOpen) {
      loadDepartments();
      loadJobRoles();
      loadCollaborators();

      // If rescheduling, pre-fill the form
      if (isReschedule && existingMeeting) {
        setSelectedCollaborator(existingMeeting.collaboratorId);
        setSelectedDate(existingMeeting.date.toISOString().split('T')[0]);
        setSelectedTime(existingMeeting.time);
      }
    }
  }, [isOpen, isReschedule, existingMeeting]);

  // Filter job roles when department changes
  useEffect(() => {
    filterJobRoles();
  }, [selectedDepartment, collaborators, jobRoles]);

  // Filter collaborators when department or job role changes
  useEffect(() => {
    filterCollaborators();
  }, [selectedDepartment, selectedJobRole, collaborators]);

  // Generate time slots (9:00 to 18:00, every 30 minutes)
  const timeSlots = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 18 && minute === 30) break;
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {isReschedule ? 'Reagendar Reunião 1:1' : 'Agendar Nova Reunião 1:1'}
          </DialogTitle>
          <DialogDescription>
            {isReschedule
              ? 'Selecione nova data e horário para a reunião'
              : 'Selecione o colaborador, data e horário para a reunião'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Department Filter */}
          <div className="space-y-2">
            <Label htmlFor="department" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Setor
            </Label>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todos os setores</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept._id} value={dept._id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Job Role Filter */}
          <div className="space-y-2">
            <Label htmlFor="jobRole" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Cargo
            </Label>
            <Select
              value={selectedJobRole}
              onValueChange={setSelectedJobRole}
              disabled={filteredJobRoles.length === 0}
            >
              <SelectTrigger id="jobRole">
                <SelectValue placeholder={
                  filteredJobRoles.length === 0
                    ? 'Nenhum cargo encontrado'
                    : 'Selecione o cargo'
                } />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Todos os cargos</SelectItem>
                {filteredJobRoles.map((role) => (
                  <SelectItem key={role._id} value={role._id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Collaborator Selection */}
          <div className="space-y-2">
            <Label htmlFor="collaborator" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Colaborador *
            </Label>
            <Select
              value={selectedCollaborator}
              onValueChange={setSelectedCollaborator}
              disabled={filteredCollaborators.length === 0}
            >
              <SelectTrigger id="collaborator">
                <SelectValue placeholder={
                  filteredCollaborators.length === 0
                    ? 'Nenhum colaborador encontrado'
                    : 'Selecione o colaborador'
                } />
              </SelectTrigger>
              <SelectContent>
                {filteredCollaborators.map((collab) => (
                  <SelectItem key={collab._id} value={collab._id}>
                    {collab.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time Selection - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data *
              </Label>
              <div className="relative">
                <input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:w-4 [&::-webkit-calendar-picker-indicator]:h-4"
                />
              </div>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Horário *
              </Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancelar
          </Button>
          <Button onClick={handleSchedule} disabled={isLoading}>
            {isLoading ? 'Agendando...' : 'Agendar Reunião'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
