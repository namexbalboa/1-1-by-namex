import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Save } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface FormData {
  name: string;
  email: string;
  role: 'manager' | 'employee';
  managerId?: string;
  jobRoleId?: string;
  departmentId?: string;
  preferredLanguage: 'pt' | 'en' | 'es';
  firebaseUid: string;
}

export function CollaboratorForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { collaborator: currentUser } = useAuth();
  const isEditing = !!id;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'employee',
    preferredLanguage: 'pt',
    firebaseUid: '',
  });
  const [managers, setManagers] = useState<any[]>([]);
  const [jobRoles, setJobRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);

  useEffect(() => {
    loadFormData();
    if (isEditing) {
      loadCollaborator();
    }
  }, [id]);

  const loadFormData = async () => {
    try {
      const [managersRes, jobRolesRes, departmentsRes] = await Promise.all([
        api.get('/collaborators', { params: { tenantId: currentUser?.tenantId } }),
        api.get('/settings/job-roles', { params: { tenantId: currentUser?.tenantId } }),
        api.get('/settings/departments', { params: { tenantId: currentUser?.tenantId } }),
      ]);

      setManagers(managersRes.data.filter((c: any) => c.role === 'manager'));
      setJobRoles(jobRolesRes.data);
      setDepartments(departmentsRes.data);
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const loadCollaborator = async () => {
    try {
      setLoadingData(true);
      const response = await api.get(`/collaborators/${id}`);
      const data = response.data;
      setFormData({
        name: data.name,
        email: data.email,
        role: data.role,
        managerId: data.managerId?._id,
        jobRoleId: data.jobRoleId?._id,
        departmentId: data.departmentId?._id,
        preferredLanguage: data.preferredLanguage || 'pt',
        firebaseUid: data.firebaseUid,
      });
    } catch (error) {
      console.error('Error loading collaborator:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        tenantId: currentUser?.tenantId,
      };

      if (isEditing) {
        await api.patch(`/collaborators/${id}`, payload);
      } else {
        // For new collaborators, generate a temporary firebaseUid
        payload.firebaseUid = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await api.post('/collaborators', payload);
      }

      navigate('/collaborators');
    } catch (error) {
      console.error('Error saving collaborator:', error);
      alert('Erro ao salvar colaborador');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loadingData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p>{t('common.loading')}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/collaborators')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back')}
        </Button>

        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            {isEditing ? t('collaborators.editCollaborator') : t('collaborators.addCollaborator')}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t('collaborators.name')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('collaborators.email')} *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">{t('collaborators.role')} *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">
                    {t('collaborators.roles.employee')}
                  </SelectItem>
                  <SelectItem value="manager">
                    {t('collaborators.roles.manager')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === 'employee' && (
              <div className="space-y-2">
                <Label htmlFor="manager">{t('collaborators.manager')}</Label>
                <Select
                  value={formData.managerId}
                  onValueChange={(value) => handleChange('managerId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um gestor" />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.map((manager) => (
                      <SelectItem key={manager._id} value={manager._id}>
                        {manager.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="jobRole">{t('collaborators.jobRole')}</Label>
              <Select
                value={formData.jobRoleId}
                onValueChange={(value) => handleChange('jobRoleId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhuma</SelectItem>
                  {jobRoles.map((jobRole) => (
                    <SelectItem key={jobRole._id} value={jobRole._id}>
                      {jobRole.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">{t('collaborators.department')}</Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => handleChange('departmentId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o departamento (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept._id} value={dept._id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">{t('collaborators.preferredLanguage')}</Label>
              <Select
                value={formData.preferredLanguage}
                onValueChange={(value) => handleChange('preferredLanguage', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/collaborators')}
                className="flex-1"
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                {loading ? t('common.loading') : t('common.save')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
