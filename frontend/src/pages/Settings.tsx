import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { SettingsTabs } from '@/components/settings/SettingsTabs';
import { JobRolesManager } from '@/components/settings/JobRolesManager';
import { DepartmentsManager } from '@/components/settings/DepartmentsManager';
import { ManagersManager } from '@/components/settings/ManagersManager';
import { CollaboratorsManager } from '@/components/settings/CollaboratorsManager';

export function Settings() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('departments');

  const tabs = [
    {
      id: 'departments',
      label: t('settings.departments.title'),
      content: <DepartmentsManager />,
    },
    {
      id: 'job-roles',
      label: t('settings.jobRoles.title'),
      content: <JobRolesManager />,
    },
    {
      id: 'managers',
      label: t('settings.managers.title'),
      content: <ManagersManager />,
    },
    {
      id: 'collaborators',
      label: 'Colaboradores',
      content: <CollaboratorsManager />,
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-start gap-3 mb-8">
          <SettingsIcon className="w-8 h-8 text-primary mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-primary">{t('settings.title')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('settings.description')}
            </p>
          </div>
        </div>

        <Card className="p-6">
          <SettingsTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </Card>
      </div>
    </Layout>
  );
}
