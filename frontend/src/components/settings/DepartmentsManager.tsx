import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

interface Department {
  _id: string;
  name: string;
  description?: string;
  managerId?: {
    _id: string;
    name: string;
  };
  isActive: boolean;
}

interface Manager {
  _id: string;
  name: string;
  email: string;
}

export function DepartmentsManager() {
  const { t } = useTranslation();
  const { collaborator } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', managerId: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [deptResponse, managersResponse] = await Promise.all([
        api.get('/settings/departments', {
          params: { tenantId: collaborator?.tenantId }
        }),
        api.get('/collaborators', {
          params: { tenantId: collaborator?.tenantId }
        })
      ]);

      setDepartments(deptResponse.data);
      setManagers(managersResponse.data.filter((c: any) => c.role === 'manager'));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) return;

    try {
      await api.post('/settings/departments', {
        name: formData.name,
        description: formData.description,
        managerId: formData.managerId || undefined,
        tenantId: collaborator?.tenantId,
      });
      setFormData({ name: '', description: '', managerId: '' });
      setIsCreating(false);
      loadData();
    } catch (error) {
      console.error('Error creating department:', error);
      alert('Erro ao criar departamento');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim()) return;

    try {
      await api.patch(`/settings/departments/${id}`, {
        name: formData.name,
        description: formData.description,
        managerId: formData.managerId || undefined,
      });
      setEditingId(null);
      setFormData({ name: '', description: '', managerId: '' });
      loadData();
    } catch (error) {
      console.error('Error updating department:', error);
      alert('Erro ao atualizar departamento');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('settings.departments.confirmDelete'))) return;

    try {
      await api.delete(`/settings/departments/${id}`);
      loadData();
    } catch (error) {
      console.error('Error deleting department:', error);
      alert('Erro ao deletar departamento');
    }
  };

  const startEdit = (department: Department) => {
    setEditingId(department._id);
    setFormData({
      name: department.name,
      description: department.description || '',
      managerId: department.managerId?._id || '',
    });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ name: '', description: '', managerId: '' });
  };

  if (loading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{t('settings.departments.title')}</h3>
        {!isCreating && !editingId && (
          <Button onClick={() => setIsCreating(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            {t('settings.departments.add')}
          </Button>
        )}
      </div>

      {isCreating && (
        <Card className="p-4 border-2 border-primary/20">
          <div className="space-y-3">
            <div>
              <Label htmlFor="new-name">{t('settings.departments.name')} *</Label>
              <Input
                id="new-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: TI, RH, Vendas, Marketing..."
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="new-description">{t('settings.departments.description')}</Label>
              <Textarea
                id="new-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição opcional"
                rows={2}
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="new-manager">{t('settings.departments.manager')}</Label>
              <Select
                value={formData.managerId}
                onValueChange={(value) => setFormData({ ...formData, managerId: value })}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Selecione um gestor (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {managers.map((manager) => (
                    <SelectItem key={manager._id} value={manager._id}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} size="sm">
                <Save className="w-4 h-4 mr-2" />
                {t('common.save')}
              </Button>
              <Button onClick={cancelEdit} variant="ghost" size="sm">
                {t('common.cancel')}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {departments.map((department) => (
          <Card key={department._id} className="p-4">
            {editingId === department._id ? (
              <div className="space-y-3 border-2 border-primary/20 -m-4 p-4 rounded-lg">
                <div>
                  <Label htmlFor={`edit-name-${department._id}`}>
                    {t('settings.departments.name')} *
                  </Label>
                  <Input
                    id={`edit-name-${department._id}`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor={`edit-description-${department._id}`}>
                    {t('settings.departments.description')}
                  </Label>
                  <Textarea
                    id={`edit-description-${department._id}`}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor={`edit-manager-${department._id}`}>
                    {t('settings.departments.manager')}
                  </Label>
                  <Select
                    value={formData.managerId}
                    onValueChange={(value) => setFormData({ ...formData, managerId: value })}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecione um gestor (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {managers.map((manager) => (
                        <SelectItem key={manager._id} value={manager._id}>
                          {manager.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleUpdate(department._id)} size="sm">
                    <Save className="w-4 h-4 mr-2" />
                    {t('common.save')}
                  </Button>
                  <Button onClick={cancelEdit} variant="ghost" size="sm">
                    {t('common.cancel')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{department.name}</h4>
                  {department.description && (
                    <p className="text-sm text-muted-foreground mt-1">{department.description}</p>
                  )}
                  {department.managerId && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Gestor: {department.managerId.name}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => startEdit(department)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    {t('common.edit')}
                  </Button>
                  <Button
                    onClick={() => handleDelete(department._id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {t('common.delete')}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}

        {departments.length === 0 && !isCreating && (
          <div className="text-center py-8 text-muted-foreground">
            {t('settings.departments.empty')}
          </div>
        )}
      </div>
    </div>
  );
}
