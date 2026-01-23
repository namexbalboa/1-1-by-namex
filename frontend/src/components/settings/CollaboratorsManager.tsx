import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, UserCog, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useConfirm } from '@/hooks/useConfirm';

interface Collaborator {
  _id: string;
  name: string;
  email: string;
  firebaseUid: string;
  role: 'manager' | 'employee';
  preferredLanguage: 'pt' | 'en' | 'es';
  jobRoleId?: { _id: string; name: string };
  departmentId?: { _id: string; name: string };
  managerId?: { _id: string; name: string };
  isActive: boolean;
}

interface JobRole {
  _id: string;
  name: string;
}

interface Department {
  _id: string;
  name: string;
}

interface Manager {
  _id: string;
  name: string;
}

interface CollaboratorsManagerProps {
  isActive?: boolean;
}

export function CollaboratorsManager({ isActive }: CollaboratorsManagerProps) {
  const { t } = useTranslation();
  const { collaborator } = useAuth();
  const toast = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDynamicData, setLoadingDynamicData] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'create'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<'all' | 'manager' | 'employee'>('all');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee' as 'manager' | 'employee',
    preferredLanguage: 'pt' as 'pt' | 'en' | 'es',
    jobRoleId: '',
    departmentId: '',
    managerId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  // Reload dynamic data when tab becomes active
  useEffect(() => {
    if (isActive) {
      loadDynamicData();
    }
  }, [isActive]);

  const loadData = async () => {
    try {
      setLoading(true);

      const tenantId = collaborator?.tenantId
        ? typeof collaborator.tenantId === 'string'
          ? collaborator.tenantId
          : collaborator.tenantId._id
        : undefined;

      // Load all data in parallel
      const [collabResponse, jobRolesResponse, departmentsResponse] = await Promise.all([
        api.get('/collaborators', { params: { tenantId } }),
        api.get('/settings/job-roles', { params: { tenantId } }),
        api.get('/settings/departments', { params: { tenantId } }),
      ]);

      setCollaborators(collabResponse.data);
      setJobRoles(jobRolesResponse.data);
      setDepartments(departmentsResponse.data);

      // Filter managers for the manager select
      setManagers(collabResponse.data.filter((c: Collaborator) => c.role === 'manager'));
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const loadDynamicData = async () => {
    try {
      setLoadingDynamicData(true);

      const tenantId = collaborator?.tenantId
        ? typeof collaborator.tenantId === 'string'
          ? collaborator.tenantId
          : collaborator.tenantId._id
        : undefined;

      // Reload only dynamic data (job roles, departments, managers)
      const [jobRolesResponse, departmentsResponse, collabResponse] = await Promise.all([
        api.get('/settings/job-roles', { params: { tenantId } }),
        api.get('/settings/departments', { params: { tenantId } }),
        api.get('/collaborators', { params: { tenantId } }),
      ]);

      setJobRoles(jobRolesResponse.data);
      setDepartments(departmentsResponse.data);
      setManagers(collabResponse.data.filter((c: Collaborator) => c.role === 'manager'));
    } catch (error) {
      console.error('Error loading dynamic data:', error);
    } finally {
      setLoadingDynamicData(false);
    }
  };

  const handleCreateCollaborator = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.warning('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!collaborator?.tenantId) {
      toast.error('Erro: Tenant ID não encontrado');
      return;
    }

    const tenantId = typeof collaborator.tenantId === 'string'
      ? collaborator.tenantId
      : collaborator.tenantId._id;

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        preferredLanguage: formData.preferredLanguage,
        tenantId,
      };

      // Add optional fields only if they have values
      if (formData.jobRoleId) payload.jobRoleId = formData.jobRoleId;
      if (formData.departmentId) payload.departmentId = formData.departmentId;
      if (formData.managerId) payload.managerId = formData.managerId;

      await api.post('/auth/create-user', payload);

      toast.success('Colaborador cadastrado com sucesso');
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        preferredLanguage: 'pt',
        jobRoleId: '',
        departmentId: '',
        managerId: '',
      });
      setActiveView('list');
      loadData();
    } catch (error: any) {
      console.error('Error creating collaborator:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao cadastrar';
      toast.error(`Erro: ${Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage}`);
    }
  };

  const handlePromoteToManager = async (collaboratorId: string, currentName: string) => {
    const confirmed = await confirm({
      title: 'Promover a Gestor',
      description: `Tem certeza que deseja promover ${currentName} a gestor?`,
      confirmText: 'Promover',
      cancelText: 'Cancelar',
    });

    if (!confirmed) return;

    try {
      await api.patch(`/collaborators/${collaboratorId}`, { role: 'manager' });
      toast.success('Colaborador promovido a gestor com sucesso');
      loadData();
    } catch (error) {
      console.error('Error promoting:', error);
      toast.error('Erro ao promover colaborador');
    }
  };

  const handleDemoteToEmployee = async (collaboratorId: string, currentName: string) => {
    const confirmed = await confirm({
      title: 'Remover Função de Gestor',
      description: `Tem certeza que deseja remover a função de gestor de ${currentName}?`,
      confirmText: 'Remover',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });

    if (!confirmed) return;

    try {
      await api.patch(`/collaborators/${collaboratorId}`, { role: 'employee' });
      toast.success('Função de gestor removida com sucesso');
      loadData();
    } catch (error) {
      console.error('Error demoting:', error);
      toast.error('Erro ao remover função de gestor');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.warning('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      await api.patch(`/collaborators/${id}`, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        preferredLanguage: formData.preferredLanguage,
        jobRoleId: formData.jobRoleId || undefined,
        departmentId: formData.departmentId || undefined,
        managerId: formData.managerId || undefined,
      });

      toast.success('Colaborador atualizado com sucesso');
      setEditingId(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        preferredLanguage: 'pt',
        jobRoleId: '',
        departmentId: '',
        managerId: '',
      });
      loadData();
    } catch (error) {
      console.error('Error updating:', error);
      toast.error('Erro ao atualizar colaborador');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = await confirm({
      title: 'Desativar Colaborador',
      description: `Tem certeza que deseja desativar ${name}?`,
      confirmText: 'Desativar',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });

    if (!confirmed) return;

    try {
      await api.delete(`/collaborators/${id}`);
      toast.success('Colaborador desativado com sucesso');
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Erro ao desativar colaborador');
    }
  };

  const startEdit = (collab: Collaborator) => {
    setEditingId(collab._id);
    setFormData({
      name: collab.name,
      email: collab.email,
      password: '',
      role: collab.role,
      preferredLanguage: collab.preferredLanguage,
      jobRoleId: collab.jobRoleId?._id || '',
      departmentId: collab.departmentId?._id || '',
      managerId: collab.managerId?._id || '',
    });
    setActiveView('list');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setActiveView('list');
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'employee',
      preferredLanguage: 'pt',
      jobRoleId: '',
      departmentId: '',
      managerId: '',
    });
  };

  const filteredCollaborators = collaborators.filter((c) => {
    if (filterRole === 'all') return true;
    return c.role === filterRole;
  });

  if (loading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  return (
    <>
      {ConfirmDialog}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Colaboradores</h3>
          {activeView === 'list' && !editingId && (
            <Button onClick={() => setActiveView('create')} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Colaborador
            </Button>
          )}
          {(activeView !== 'list' || editingId) && (
            <Button onClick={cancelEdit} size="sm" variant="ghost">
              Voltar
            </Button>
          )}
        </div>

        {/* Create Form */}
        {activeView === 'create' && (
          <Card className="p-4 border-2 border-primary/20">
            <h4 className="font-semibold mb-4">Cadastrar Novo Colaborador</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="new-name">Nome Completo *</Label>
                <Input
                  id="new-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome completo"
                  className="bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="new-email">E-mail *</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="new-password">Senha *</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Senha de acesso"
                  className="bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="new-language">Idioma</Label>
                <Select
                  value={formData.preferredLanguage}
                  onValueChange={(value: 'pt' | 'en' | 'es') => setFormData({ ...formData, preferredLanguage: value })}
                >
                  <SelectTrigger className="bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new-jobRole">Cargo</Label>
                <Select
                  value={formData.jobRoleId || undefined}
                  onValueChange={(value) => setFormData({ ...formData, jobRoleId: value === 'none' ? '' : value })}
                  disabled={loadingDynamicData}
                >
                  <SelectTrigger className="bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <SelectValue
                      placeholder={
                        loadingDynamicData ? (
                          <span className="flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          </span>
                        ) : (
                          "Selecione um cargo"
                        )
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {jobRoles.map((role) => (
                      <SelectItem key={role._id} value={role._id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new-department">Departamento</Label>
                <Select
                  value={formData.departmentId || undefined}
                  onValueChange={(value) => setFormData({ ...formData, departmentId: value === 'none' ? '' : value })}
                  disabled={loadingDynamicData}
                >
                  <SelectTrigger className="bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <SelectValue
                      placeholder={
                        loadingDynamicData ? (
                          <span className="flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          </span>
                        ) : (
                          "Selecione um departamento"
                        )
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept._id} value={dept._id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="new-manager">Gestor Responsável</Label>
                <Select
                  value={formData.managerId || undefined}
                  onValueChange={(value) => setFormData({ ...formData, managerId: value === 'none' ? '' : value })}
                  disabled={loadingDynamicData}
                >
                  <SelectTrigger className="bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                    <SelectValue
                      placeholder={
                        loadingDynamicData ? (
                          <span className="flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          </span>
                        ) : (
                          "Selecione um gestor"
                        )
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    {managers.map((manager) => (
                      <SelectItem key={manager._id} value={manager._id}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleCreateCollaborator} size="sm">
                {t('common.save')}
              </Button>
              <Button onClick={cancelEdit} variant="ghost" size="sm">
                {t('common.cancel')}
              </Button>
            </div>
          </Card>
        )}

        {/* List View */}
        {activeView === 'list' && (
          <>
            {/* Filter */}
            <div className="flex items-center gap-3">
              <Label>Filtrar por:</Label>
              <Select value={filterRole} onValueChange={(value: any) => setFilterRole(value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="manager">Gestores</SelectItem>
                  <SelectItem value="employee">Colaboradores</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline">{filteredCollaborators.length} encontrados</Badge>
            </div>

            {/* Collaborators List */}
            <div className="space-y-2">
              {filteredCollaborators.map((collab) => (
                <Card key={collab._id} className="p-4">
                  {editingId === collab._id ? (
                    <div className="space-y-3 border-2 border-primary/20 -m-4 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div>
                          <Label>Nome *</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label>E-mail *</Label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <Label>Idioma</Label>
                          <Select
                            value={formData.preferredLanguage}
                            onValueChange={(value: 'pt' | 'en' | 'es') => setFormData({ ...formData, preferredLanguage: value })}
                          >
                            <SelectTrigger className="bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pt">Português</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Español</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Cargo</Label>
                          <Select
                            value={formData.jobRoleId || undefined}
                            onValueChange={(value) => setFormData({ ...formData, jobRoleId: value === 'none' ? '' : value })}
                            disabled={loadingDynamicData}
                          >
                            <SelectTrigger className="bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                              <SelectValue
                                placeholder={
                                  loadingDynamicData ? (
                                    <span className="flex items-center justify-center">
                                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    </span>
                                  ) : (
                                    "Selecione um cargo"
                                  )
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Nenhum</SelectItem>
                              {jobRoles.map((role) => (
                                <SelectItem key={role._id} value={role._id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Departamento</Label>
                          <Select
                            value={formData.departmentId || undefined}
                            onValueChange={(value) => setFormData({ ...formData, departmentId: value === 'none' ? '' : value })}
                            disabled={loadingDynamicData}
                          >
                            <SelectTrigger className="bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                              <SelectValue
                                placeholder={
                                  loadingDynamicData ? (
                                    <span className="flex items-center justify-center">
                                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    </span>
                                  ) : (
                                    "Selecione um departamento"
                                  )
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Nenhum</SelectItem>
                              {departments.map((dept) => (
                                <SelectItem key={dept._id} value={dept._id}>
                                  {dept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Gestor Responsável</Label>
                          <Select
                            value={formData.managerId || undefined}
                            onValueChange={(value) => setFormData({ ...formData, managerId: value === 'none' ? '' : value })}
                            disabled={loadingDynamicData}
                          >
                            <SelectTrigger className="bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                              <SelectValue
                                placeholder={
                                  loadingDynamicData ? (
                                    <span className="flex items-center justify-center">
                                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    </span>
                                  ) : (
                                    "Selecione um gestor"
                                  )
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Nenhum</SelectItem>
                              {managers.map((manager) => (
                                <SelectItem key={manager._id} value={manager._id}>
                                  {manager.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleUpdate(collab._id)} size="sm">
                          {t('common.save')}
                        </Button>
                        <Button onClick={cancelEdit} variant="ghost" size="sm">
                          {t('common.cancel')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">{collab.name}</h4>
                          <Badge variant={collab.role === 'manager' ? 'default' : 'secondary'}>
                            {collab.role === 'manager' ? 'Gestor' : 'Colaborador'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{collab.email}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>Idioma: {collab.preferredLanguage.toUpperCase()}</span>
                          {collab.jobRoleId && <span>• Cargo: {collab.jobRoleId.name}</span>}
                          {collab.departmentId && <span>• Depto: {collab.departmentId.name}</span>}
                          {collab.managerId && <span>• Gestor: {collab.managerId.name}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => startEdit(collab)} variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {collab.role === 'employee' ? (
                          <Button
                            onClick={() => handlePromoteToManager(collab._id, collab.name)}
                            variant="ghost"
                            size="icon"
                            title="Promover a gestor"
                          >
                            <UserCog className="w-4 h-4 text-green-600" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleDemoteToEmployee(collab._id, collab.name)}
                            variant="ghost"
                            size="icon"
                            title="Remover função de gestor"
                          >
                            <UserCog className="w-4 h-4 text-orange-600" />
                          </Button>
                        )}
                        <Button
                          onClick={() => handleDelete(collab._id, collab.name)}
                          variant="ghost"
                          size="icon"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ))}

              {filteredCollaborators.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum colaborador encontrado
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
