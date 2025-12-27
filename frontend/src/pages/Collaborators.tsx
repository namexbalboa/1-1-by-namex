import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface Collaborator {
  _id: string;
  name: string;
  email: string;
  role: 'manager' | 'employee';
  managerId?: {
    _id: string;
    name: string;
    email: string;
  };
  preferredLanguage: string;
  isActive: boolean;
}

export function Collaborators() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { collaborator: currentUser } = useAuth();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollaborators();
  }, []);

  const loadCollaborators = async () => {
    try {
      setLoading(true);
      const response = await api.get('/collaborators', {
        params: { tenantId: currentUser?.tenantId }
      });
      setCollaborators(response.data);
    } catch (error) {
      console.error('Error loading collaborators:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('collaborators.confirmDelete'))) return;

    try {
      await api.delete(`/collaborators/${id}`);
      loadCollaborators();
    } catch (error) {
      console.error('Error deleting collaborator:', error);
    }
  };

  if (loading) {
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">{t('collaborators.title')}</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os colaboradores da sua equipe
            </p>
          </div>
          <Button onClick={() => navigate('/collaborators/new')}>
            <Plus className="w-4 h-4 mr-2" />
            {t('collaborators.addCollaborator')}
          </Button>
        </div>

        <div className="grid gap-4">
          {collaborators.map((collab) => (
            <Card key={collab._id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {collab.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold">{collab.name}</h3>
                      <Badge variant={collab.role === 'manager' ? 'default' : 'secondary'}>
                        {t(`collaborators.roles.${collab.role}`)}
                      </Badge>
                      <Badge variant={collab.isActive ? 'default' : 'destructive'}>
                        {collab.isActive ? t('collaborators.active') : t('collaborators.inactive')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{collab.email}</p>
                    {collab.managerId && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('collaborators.manager')}: {collab.managerId.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/collaborators/${collab._id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Detalhes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/collaborators/${collab._id}/edit`)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    {t('common.edit')}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(collab._id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {t('common.delete')}
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {collaborators.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                Nenhum colaborador cadastrado ainda
              </p>
              <Button onClick={() => navigate('/collaborators/new')}>
                <Plus className="w-4 h-4 mr-2" />
                {t('collaborators.addCollaborator')}
              </Button>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
