import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { ActionItem, ActionItemStatus } from '@/types';

interface ActionItemsListProps {
  items: ActionItem[];
  onChange: (items: ActionItem[]) => void;
  readonly?: boolean;
}

export function ActionItemsList({ items, onChange, readonly = false }: ActionItemsListProps) {
  const { t } = useTranslation();
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...items, { description: newItem, status: 'pending' }]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateStatus = (index: number, status: ActionItemStatus) => {
    const updated = [...items];
    updated[index] = { ...updated[index], status };
    onChange(updated);
  };

  const getStatusBadge = (status: ActionItemStatus) => {
    const variants = {
      done: 'bg-secondary text-secondary-foreground',
      pending: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
      blocked: 'bg-destructive/20 text-destructive',
    };

    return (
      <Badge className={variants[status]}>
        {t(`meeting.status.${status}`)}
      </Badge>
    );
  };

  const cycleStatus = (index: number) => {
    const currentStatus = items[index].status;
    const statusCycle: ActionItemStatus[] = ['pending', 'done', 'blocked'];
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    updateStatus(index, nextStatus);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('meeting.actionItems')}</h3>
        <span className="text-sm text-muted-foreground">
          {items.filter(i => i.status === 'done').length} / {items.length} {t('meeting.status.done').toLowerCase()}
        </span>
      </div>

      {/* Action Items List */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-card border border-border rounded-md group hover:border-primary/50 transition-colors"
          >
            <button
              onClick={() => !readonly && cycleStatus(index)}
              disabled={readonly}
              className="flex-shrink-0 w-6 h-6 rounded border-2 border-primary flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {item.status === 'done' && <Check className="w-4 h-4 text-primary" />}
              {item.status === 'blocked' && <span className="text-xs text-destructive">!</span>}
            </button>

            <p
              className={`flex-1 text-sm ${
                item.status === 'done' ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {item.description}
            </p>

            {getStatusBadge(item.status)}

            {!readonly && (
              <button
                onClick={() => removeItem(index)}
                className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 hover:bg-destructive/10 rounded transition-all"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            {readonly ? 'Nenhum item de ação' : t('meeting.addActionItem')}
          </p>
        )}
      </div>

      {/* Add New Item */}
      {!readonly && (
        <div className="flex gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder={t('meeting.addActionItem')}
            className="flex-1"
          />
          <Button onClick={addItem} disabled={!newItem.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            {t('common.save')}
          </Button>
        </div>
      )}
    </div>
  );
}
