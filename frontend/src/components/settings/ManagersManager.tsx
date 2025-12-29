import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
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

interface Manager {
  _id: string;
  name: string;
  email: string;
  firebaseUid: string;
  preferredLanguage: 'pt' | 'en' | 'es';
  isActive: boolean;
  role: 'manager' | 'employee';
}

export function ManagersManager() {
  const { t } = useTranslation();
  const { collaborator } = useAuth();
  const toast = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'list' | 'create'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    preferredLanguage: 'pt' as 'pt' | 'en' | 'es',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const tenantId = collaborator?.tenantId
        ? typeof collaborator.tenantId === 'string'
          ? collaborator.tenantId
          : collaborator.tenantId._id
        : undefined;

      const response = await api.get('/collaborators', {
        params: { tenantId }
      });

      const allCollaborators = response.data;
      setManagers(allCollaborators.filter((c: Manager) => c.role === 'manager'));
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManager = async () => {
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
      // Criar gestor usando o endpoint correto
      await api.post('/auth/create-user', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'manager',
        preferredLanguage: formData.preferredLanguage,
        tenantId,
      });

      toast.success('Gestor cadastrado com sucesso');
      setFormData({ name: '', email: '', password: '', preferredLanguage: 'pt' });
      setActiveView('list');
      loadData();
    } catch (error: any) {
      console.error('Error creating manager:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao cadastrar gestor';
      toast.error(`Erro ao cadastrar gestor: ${Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage}`);
    }
  };


  const handleDemoteToEmployee = async (managerId: string) => {
    const confirmed = await confirm({
      title: 'Remover Função de Gestor',
      description: 'Tem certeza que deseja remover a função de gestor deste usuário?',
      confirmText: 'Remover',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });

    if (!confirmed) return;

    try {
      await api.patch(`/collaborators/${managerId}`, {
        role: 'employee',
      });

      toast.success('Função de gestor removida com sucesso');
      loadData();
    } catch (error) {
      console.error('Error demoting manager:', error);
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
        preferredLanguage: formData.preferredLanguage,
      });

      toast.success('Gestor atualizado com sucesso');
      setEditingId(null);
      setFormData({ name: '', email: '', password: '', preferredLanguage: 'pt' });
      loadData();
    } catch (error) {
      console.error('Error updating manager:', error);
      toast.error('Erro ao atualizar gestor');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Desativar Gestor',
      description: 'Tem certeza que deseja desativar este gestor?',
      confirmText: 'Desativar',
      cancelText: 'Cancelar',
      variant: 'destructive',
    });

    if (!confirmed) return;

    try {
      await api.delete(`/collaborators/${id}`);
      toast.success('Gestor desativado com sucesso');
      loadData();
    } catch (error) {
      console.error('Error deleting manager:', error);
      toast.error('Erro ao desativar gestor');
    }
  };

  const startEdit = (manager: Manager) => {
    setEditingId(manager._id);
    setFormData({
      name: manager.name,
      email: manager.email,
      password: '',
      preferredLanguage: manager.preferredLanguage,
    });
    setActiveView('list');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setActiveView('list');
    setFormData({ name: '', email: '', password: '', preferredLanguage: 'pt' });
  };

  if (loading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  return (
    <>
      {ConfirmDialog}
      <div className="space-y-4">
        {/* Header com botões de ação */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{t('settings.managers.title')}</h3>
          {activeView === 'list' && !editingId && (
            <Button onClick={() => setActiveView('create')} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Gestor
            </Button>
          )}
          {(activeView !== 'list' || editingId) && (
            <Button onClick={cancelEdit} size="sm" variant="ghost">
              Voltar
            </Button>
          )}
        </div>

        {/* Formulário de Cadastro */}
        {activeView === 'create' && (
          <Card className="p-4 border-2 border-primary/20">
            <h4 className="font-semibold mb-4">Cadastrar Novo Gestor</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="new-name">Nome Completo *</Label>
                <Input
                  id="new-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome completo do gestor"
                  className="bg-white"
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
                  className="bg-white"
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
                  className="bg-white"
                />
              </div>
              <div>
                <Label htmlFor="new-language">Idioma</Label>
                <Select
                  value={formData.preferredLanguage}
                  onValueChange={(value: 'pt' | 'en' | 'es') => setFormData({ ...formData, preferredLanguage: value })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={cancelEdit} variant="ghost" size="sm">
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleCreateManager} size="sm">
                  {t('common.save')}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Lista de Gestores */}
        {activeView === 'list' && (
          <div className="space-y-2">
            {managers.map((manager) => (
              <Card key={manager._id} className="p-4">
                {editingId === manager._id ? (
                  <div className="space-y-3 border-2 border-primary/20 -m-4 p-4 rounded-lg">
                    <div>
                      <Label htmlFor={`edit-name-${manager._id}`}>Nome *</Label>
                      <Input
                        id={`edit-name-${manager._id}`}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-email-${manager._id}`}>E-mail *</Label>
                      <Input
                        id={`edit-email-${manager._id}`}
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edit-language-${manager._id}`}>Idioma</Label>
                      <Select
                        value={formData.preferredLanguage}
                        onValueChange={(value: 'pt' | 'en' | 'es') => setFormData({ ...formData, preferredLanguage: value })}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt">Português</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={cancelEdit} variant="ghost" size="sm">
                        {t('common.cancel')}
                      </Button>
                      <Button onClick={() => handleUpdate(manager._id)} size="sm">
                        {t('common.save')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{manager.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{manager.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Idioma: {manager.preferredLanguage.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startEdit(manager)}
                        variant="ghost"
                        size="icon"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDemoteToEmployee(manager._id)}
                        variant="ghost"
                        size="icon"
                        title="Remover função de gestor"
                      >
                        <ShieldAlert className="w-4 h-4 text-orange-500" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(manager._id)}
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

            {managers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {t('settings.managers.empty')}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
