import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobRolesManager } from '@/components/settings/JobRolesManager';
import { DepartmentsManager } from '@/components/settings/DepartmentsManager';

export function Settings() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('job-roles');

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
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="job-roles">
                {t('settings.jobRoles.title')}
              </TabsTrigger>
              <TabsTrigger value="departments">
                {t('settings.departments.title')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="job-roles">
              <JobRolesManager />
            </TabsContent>

            <TabsContent value="departments">
              <DepartmentsManager />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </Layout>
  );
}
