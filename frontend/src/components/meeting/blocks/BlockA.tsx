import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import type { BlockA as BlockAType } from '@/types';

interface BlockAProps {
  data: Partial<BlockAType>;
  onChange: (data: Partial<BlockAType>) => void;
  readonly?: boolean;
}

export function BlockA({ data, onChange, readonly = false }: BlockAProps) {
  const { t } = useTranslation();

  const updateTimeDistribution = (field: keyof BlockAType['timeDistribution'], value: number) => {
    onChange({
      ...data,
      timeDistribution: {
        ...data.timeDistribution!,
        [field]: value,
      },
    });
  };

  const updateBlockers = (field: keyof BlockAType['blockers'], value: any) => {
    onChange({
      ...data,
      blockers: {
        ...data.blockers!,
        [field]: value,
      },
    });
  };

  const addBlockerTag = (tag: string) => {
    if (tag && !data.blockers?.tags?.includes(tag)) {
      updateBlockers('tags', [...(data.blockers?.tags || []), tag]);
    }
  };

  const removeBlockerTag = (tagToRemove: string) => {
    updateBlockers(
      'tags',
      data.blockers?.tags?.filter((tag) => tag !== tagToRemove) || []
    );
  };

  const totalTime =
    (data.timeDistribution?.execution || 0) +
    (data.timeDistribution?.meetings || 0) +
    (data.timeDistribution?.resolution || 0);

  const isTimeValid = totalTime === 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          {t('meeting.blocks.a.title')}
        </h2>
        <p className="text-sm text-muted-foreground">
          Como está sua rotina operacional?
        </p>
      </div>

      {/* Time Distribution */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {t('meeting.blocks.a.timeDistribution')}
            </h3>
            <Badge variant={isTimeValid ? 'default' : 'destructive'}>
              Total: {totalTime}%
            </Badge>
          </div>

          {!isTimeValid && (
            <p className="text-sm text-destructive">
              A soma deve ser exatamente 100%
            </p>
          )}

          <div className="space-y-4">
            {/* Execution */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t('meeting.blocks.a.execution')}</Label>
                <Badge variant="outline">{data.timeDistribution?.execution || 0}%</Badge>
              </div>
              <Input
                type="number"
                min="0"
                max="100"
                value={data.timeDistribution?.execution || 0}
                onChange={(e) =>
                  updateTimeDistribution('execution', Number(e.target.value))
                }
                disabled={readonly}
              />
            </div>

            {/* Meetings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t('meeting.blocks.a.meetings')}</Label>
                <Badge variant="outline">{data.timeDistribution?.meetings || 0}%</Badge>
              </div>
              <Input
                type="number"
                min="0"
                max="100"
                value={data.timeDistribution?.meetings || 0}
                onChange={(e) =>
                  updateTimeDistribution('meetings', Number(e.target.value))
                }
                disabled={readonly}
              />
            </div>

            {/* Resolution */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t('meeting.blocks.a.resolution')}</Label>
                <Badge variant="outline">{data.timeDistribution?.resolution || 0}%</Badge>
              </div>
              <Input
                type="number"
                min="0"
                max="100"
                value={data.timeDistribution?.resolution || 0}
                onChange={(e) =>
                  updateTimeDistribution('resolution', Number(e.target.value))
                }
                disabled={readonly}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Blockers */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('meeting.blocks.a.blockers')}</h3>

          <div className="space-y-3">
            <Label>{t('meeting.blocks.a.blockersLevel')}</Label>
            <RadioGroup
              value={data.blockers?.level || 'green'}
              onValueChange={(value: any) => updateBlockers('level', value)}
              disabled={readonly}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="green" id="green" />
                <Label htmlFor="green" className="cursor-pointer">
                  🟢 {t('meeting.blockersLevel.green')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yellow" id="yellow" />
                <Label htmlFor="yellow" className="cursor-pointer">
                  🟡 {t('meeting.blockersLevel.yellow')}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="red" id="red" />
                <Label htmlFor="red" className="cursor-pointer">
                  🔴 {t('meeting.blockersLevel.red')}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {!readonly && (
            <div className="space-y-2">
              <Label>{t('meeting.blocks.a.blockersTags')}</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: infraestrutura, dependências..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addBlockerTag((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.blockers?.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive/20"
                    onClick={() => removeBlockerTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Tool Adequacy */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>{t('meeting.blocks.a.toolAdequacy')}</Label>
            <Badge variant="outline">{data.toolAdequacy || 3}/5</Badge>
          </div>
          <Slider
            value={[data.toolAdequacy || 3]}
            onValueChange={([value]) => onChange({ ...data, toolAdequacy: value })}
            min={1}
            max={5}
            step={1}
            disabled={readonly}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 - Inadequadas</span>
            <span>5 - Perfeitas</span>
          </div>
        </div>
      </Card>

      {/* Priority Clarity */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>{t('meeting.blocks.a.priorityClarity')}</Label>
            <Badge variant="outline">{data.priorityClarity || 5}/10</Badge>
          </div>
          <Slider
            value={[data.priorityClarity || 5]}
            onValueChange={([value]) => onChange({ ...data, priorityClarity: value })}
            min={1}
            max={10}
            step={1}
            disabled={readonly}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 - Muito confusas</span>
            <span>10 - Cristalinas</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
