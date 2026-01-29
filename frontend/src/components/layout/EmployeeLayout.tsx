import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { LogOut, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface EmployeeLayoutProps {
  children: ReactNode;
}

export function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const { t, i18n } = useTranslation();
  const { collaborator, signOut } = useAuth();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header for Employees */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
              1:1
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Meu Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                {collaborator?.name}
              </p>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <Select value={i18n.language} onValueChange={changeLanguage}>
              <SelectTrigger className="w-[140px]">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>

            {/* Logout Button */}
            <Button
              type="button"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Logout button clicked (EmployeeLayout)');
                try {
                  await signOut();
                } catch (error) {
                  console.error('❌ Error during logout:', error);
                }
              }}
              variant="ghost"
              size="sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('common.logout')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2025 Sistema de Reuniões 1:1. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
