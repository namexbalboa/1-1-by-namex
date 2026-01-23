import { ReactNode, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface SettingsTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function SettingsTabs({ tabs, activeTab, onTabChange }: SettingsTabsProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;

    setIsTransitioning(true);

    // Show loading animation for a smooth transition
    setTimeout(() => {
      onTabChange(tabId);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Tabs Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 p-1 bg-gradient-to-r from-muted/50 to-muted rounded-xl shadow-inner backdrop-blur-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            disabled={isTransitioning}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary to-secondary !text-white shadow-lg shadow-primary/25'
                  : 'text-muted-foreground hover:text-foreground/80'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs Content */}
      <div className="relative min-h-[400px]">
        {isTransitioning && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex items-center justify-center rounded-lg animate-in fade-in duration-200">
            <div className="bg-white p-4 rounded-lg shadow-xl border border-primary/10 flex items-center gap-3 animate-in zoom-in-95 duration-200">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm font-medium text-foreground">Carregando...</span>
            </div>
          </div>
        )}

        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${activeTab === tab.id ? 'block animate-in fade-in duration-300' : 'hidden'}`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
