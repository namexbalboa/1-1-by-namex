import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface JobRole {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export function JobRolesManager() {
  const { t } = useTranslation();
  const { collaborator } = useAuth();
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    loadJobRoles();
  }, []);

  const loadJobRoles = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings/job-roles', {
        params: { tenantId: collaborator?.tenantId }
      });
      setJobRoles(response.data);
    } catch (error) {
      console.error('Error loading job roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) return;

    try {
      await api.post('/settings/job-roles', {
        ...formData,
        tenantId: collaborator?.tenantId,
      });
      setFormData({ name: '', description: '' });
      setIsCreating(false);
      loadJobRoles();
    } catch (error) {
      console.error('Error creating job role:', error);
      alert('Erro ao criar função');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim()) return;

    try {
      await api.patch(`/settings/job-roles/${id}`, formData);
      setEditingId(null);
      setFormData({ name: '', description: '' });
      loadJobRoles();
    } catch (error) {
      console.error('Error updating job role:', error);
      alert('Erro ao atualizar função');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('settings.jobRoles.confirmDelete'))) return;

    try {
      await api.delete(`/settings/job-roles/${id}`);
      loadJobRoles();
    } catch (error) {
      console.error('Error deleting job role:', error);
      alert('Erro ao deletar função');
    }
  };

  const startEdit = (jobRole: JobRole) => {
    setEditingId(jobRole._id);
    setFormData({ name: jobRole.name, description: jobRole.description || '' });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ name: '', description: '' });
  };

  if (loading) {
    return <div className="text-center py-8">{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{t('settings.jobRoles.title')}</h3>
        {!isCreating && !editingId && (
          <Button onClick={() => setIsCreating(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            {t('settings.jobRoles.add')}
          </Button>
        )}
      </div>

      {isCreating && (
        <Card className="p-4 border-2 border-primary/20">
          <div className="space-y-3">
            <div>
              <Label htmlFor="new-name">{t('settings.jobRoles.name')} *</Label>
              <Input
                id="new-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Desenvolvedor, Gerente, Analista..."
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="new-description">{t('settings.jobRoles.description')}</Label>
              <Textarea
                id="new-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição opcional"
                rows={2}
                className="bg-white"
              />
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
        {jobRoles.map((jobRole) => (
          <Card key={jobRole._id} className="p-4">
            {editingId === jobRole._id ? (
              <div className="space-y-3 border-2 border-primary/20 -m-4 p-4 rounded-lg">
                <div>
                  <Label htmlFor={`edit-name-${jobRole._id}`}>
                    {t('settings.jobRoles.name')} *
                  </Label>
                  <Input
                    id={`edit-name-${jobRole._id}`}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor={`edit-description-${jobRole._id}`}>
                    {t('settings.jobRoles.description')}
                  </Label>
                  <Textarea
                    id={`edit-description-${jobRole._id}`}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="bg-white"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleUpdate(jobRole._id)} size="sm">
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
                  <h4 className="font-semibold">{jobRole.name}</h4>
                  {jobRole.description && (
                    <p className="text-sm text-muted-foreground mt-1">{jobRole.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => startEdit(jobRole)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    {t('common.edit')}
                  </Button>
                  <Button
                    onClick={() => handleDelete(jobRole._id)}
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

        {jobRoles.length === 0 && !isCreating && (
          <div className="text-center py-8 text-muted-foreground">
            {t('settings.jobRoles.empty')}
          </div>
        )}
      </div>
    </div>
  );
}
