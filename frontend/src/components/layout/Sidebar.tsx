import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { collaborator, isManager, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: t('sidebar.dashboard'),
      path: '/dashboard',
      show: true,
    },
    {
      icon: Calendar,
      label: t('sidebar.meetings'),
      path: '/meetings',
      show: true,
    },
    {
      icon: History,
      label: 'Histórico',
      path: '/history',
      show: isManager,
    },
    {
      icon: Settings,
      label: t('sidebar.settings'),
      path: '/settings',
      show: isManager,
    },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border transition-transform duration-300',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-border">
            <h1 className="text-xl font-bold text-primary">1:1 by Namex</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {collaborator?.name}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems
              .filter(item => item.show)
              .map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border space-y-3">
            <div className="px-2">
              <LanguageSwitcher />
            </div>
            <Button
              type="button"
              variant="destructive"
              className="w-full"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🖱️ Logout button clicked in Sidebar');
                try {
                  await signOut();
                  setIsOpen(false);
                } catch (error) {
                  console.error('❌ Error during logout:', error);
                }
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('common.logout')}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
