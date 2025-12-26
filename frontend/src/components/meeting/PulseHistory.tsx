import { useTranslation } from 'react-i18next';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import type { PulseHistoryItem } from '@/types';

interface PulseHistoryProps {
  pulseHistory: PulseHistoryItem[];
  onChange: (history: PulseHistoryItem[]) => void;
  readonly?: boolean;
  weeksCount?: number;
}

export function PulseHistory({
  pulseHistory,
  onChange,
  readonly = false,
  weeksCount = 8,
}: PulseHistoryProps) {
  const { t } = useTranslation();

  // Initialize pulse history if empty
  const initializeHistory = () => {
    if (pulseHistory.length === 0 && !readonly) {
      const initial = Array.from({ length: weeksCount }, (_, i) => ({
        week: i + 1,
        value: 3,
      }));
      onChange(initial);
    }
  };

  // Ensure we have data
  if (pulseHistory.length === 0 && !readonly) {
    initializeHistory();
  }

  const updatePulse = (week: number, value: number) => {
    const updated = [...pulseHistory];
    const index = updated.findIndex((p) => p.week === week);
    if (index >= 0) {
      updated[index] = { week, value };
    } else {
      updated.push({ week, value });
    }
    onChange(updated.sort((a, b) => a.week - b.week));
  };

  const getAveragePulse = () => {
    if (pulseHistory.length === 0) return 0;
    const sum = pulseHistory.reduce((acc, p) => acc + p.value, 0);
    return (sum / pulseHistory.length).toFixed(1);
  };

  const getPulseColor = (value: number) => {
    if (value >= 4) return 'text-secondary';
    if (value >= 3) return 'text-primary';
    return 'text-destructive';
  };

  const getPulseEmoji = (value: number) => {
    const emojis = ['😟', '😕', '😐', '🙂', '😊'];
    return emojis[value - 1] || '😐';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('meeting.pulse')}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Média:</span>
          <Badge className={`${getPulseColor(Number(getAveragePulse()))}`}>
            {getAveragePulse()} {getPulseEmoji(Math.round(Number(getAveragePulse())))}
          </Badge>
        </div>
      </div>

      {/* Pulse Scale Reference */}
      <div className="flex justify-between text-xs text-muted-foreground px-2">
        <span>😟 1 - Muito Baixo</span>
        <span>😐 3 - Neutro</span>
        <span>😊 5 - Muito Alto</span>
      </div>

      {/* Weekly Pulse Sliders */}
      <div className="space-y-4 bg-card border border-border rounded-lg p-4">
        {Array.from({ length: weeksCount }, (_, i) => {
          const week = i + 1;
          const pulseItem = pulseHistory.find((p) => p.week === week);
          const value = pulseItem?.value || 3;

          return (
            <div key={week} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Semana {week}
                </label>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl ${getPulseColor(value)}`}>
                    {getPulseEmoji(value)}
                  </span>
                  <Badge variant="outline" className="w-8 text-center">
                    {value}
                  </Badge>
                </div>
              </div>

              <Slider
                value={[value]}
                onValueChange={([newValue]) => !readonly && updatePulse(week, newValue)}
                min={1}
                max={5}
                step={1}
                disabled={readonly}
                className={readonly ? 'opacity-50' : ''}
              />
            </div>
          );
        })}
      </div>

      {/* Pulse Trend Chart (Simple Visual) */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="text-sm font-medium mb-3">Tendência</h4>
        <div className="flex items-end justify-between h-24 gap-1">
          {pulseHistory.map((pulse) => (
            <div key={pulse.week} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full bg-primary rounded-t transition-all ${
                  pulse.value >= 4 ? 'bg-secondary' : pulse.value <= 2 ? 'bg-destructive' : ''
                }`}
                style={{ height: `${(pulse.value / 5) * 100}%` }}
              />
              <span className="text-xs text-muted-foreground">S{pulse.week}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
