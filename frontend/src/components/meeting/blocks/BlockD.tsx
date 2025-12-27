import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { BlockD as BlockDType } from '@/types';

interface BlockDProps {
  data: Partial<BlockDType>;
  onChange: (data: Partial<BlockDType>) => void;
  readonly?: boolean;
}

export function BlockD({ data, onChange, readonly = false }: BlockDProps) {
  const { t } = useTranslation();
  const [newLearningArea, setNewLearningArea] = useState('');

  const updateIntellectualChallenge = (
    field: keyof BlockDType['intellectualChallenge'],
    value: number
  ) => {
    onChange({
      ...data,
      intellectualChallenge: {
        ...data.intellectualChallenge!,
        [field]: value,
      },
    });
  };

  const addLearningArea = () => {
    if (newLearningArea.trim() && !data.activeLearning?.includes(newLearningArea)) {
      onChange({
        ...data,
        activeLearning: [...(data.activeLearning || []), newLearningArea.trim()],
      });
      setNewLearningArea('');
    }
  };

  const removeLearningArea = (area: string) => {
    onChange({
      ...data,
      activeLearning: data.activeLearning?.filter((a) => a !== area) || [],
    });
  };

  const getFlowState = () => {
    const skill = data.intellectualChallenge?.skill || 5;
    const challenge = data.intellectualChallenge?.challenge || 5;

    if (challenge > skill + 2) {
      return { state: 'Ansiedade', emoji: '😰', color: 'text-destructive' };
    }
    if (skill > challenge + 2) {
      return { state: 'Tédio', emoji: '😴', color: 'text-yellow-600' };
    }
    if (skill >= 6 && challenge >= 6) {
      return { state: 'Flow', emoji: '🚀', color: 'text-secondary' };
    }
    return { state: 'Apatia', emoji: '😐', color: 'text-muted-foreground' };
  };

  const flowState = getFlowState();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          {t('meeting.blocks.d.title')}
        </h2>
        <p className="text-sm text-muted-foreground">
          Como está seu desenvolvimento profissional e bem-estar?
        </p>
      </div>

      {/* Intellectual Challenge (Flow State) */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <Label className="text-base">{t('meeting.blocks.d.intellectualChallenge')}</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Avalie seu nível de habilidade atual vs. o desafio das tarefas
            </p>
          </div>

          {/* Skill Level */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t('meeting.blocks.d.skill')}</Label>
              <Badge variant="outline">
                {data.intellectualChallenge?.skill || 5}/10
              </Badge>
            </div>
            <Slider
              value={[data.intellectualChallenge?.skill || 5]}
              onValueChange={([value]) => updateIntellectualChallenge('skill', value)}
              min={1}
              max={10}
              step={1}
              disabled={readonly}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 - Iniciante</span>
              <span>10 - Expert</span>
            </div>
          </div>

          {/* Challenge Level */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t('meeting.blocks.d.challenge')}</Label>
              <Badge variant="outline">
                {data.intellectualChallenge?.challenge || 5}/10
              </Badge>
            </div>
            <Slider
              value={[data.intellectualChallenge?.challenge || 5]}
              onValueChange={([value]) => updateIntellectualChallenge('challenge', value)}
              min={1}
              max={10}
              step={1}
              disabled={readonly}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 - Muito fácil</span>
              <span>10 - Muito difícil</span>
            </div>
          </div>

          {/* Flow State Indicator */}
          <div className={`p-4 border-2 rounded-lg ${
            flowState.state === 'Flow' ? 'bg-secondary/10 border-secondary' :
            flowState.state === 'Ansiedade' ? 'bg-destructive/10 border-destructive' :
            flowState.state === 'Tédio' ? 'bg-yellow-500/10 border-yellow-500' :
            'bg-muted border-border'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estado atual:</p>
                <p className={`text-xl font-bold ${flowState.color}`}>
                  {flowState.emoji} {flowState.state}
                </p>
              </div>
              {flowState.state === 'Flow' && (
                <Badge variant="success">Ideal!</Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Strengths Utilization */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">
                {t('meeting.blocks.d.strengthsUtilization')}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Quanto você está usando seus pontos fortes no trabalho?
              </p>
            </div>
            <Badge variant="outline" className="text-lg">
              {data.strengthsUtilization || 50}%
            </Badge>
          </div>

          <Slider
            value={[data.strengthsUtilization || 50]}
            onValueChange={([value]) =>
              onChange({ ...data, strengthsUtilization: value })
            }
            min={0}
            max={100}
            step={5}
            disabled={readonly}
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0% - Não uso</span>
            <span>50% - Parcialmente</span>
            <span>100% - Totalmente</span>
          </div>
        </div>
      </Card>

      {/* Active Learning */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base">{t('meeting.blocks.d.activeLearning')}</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Quais áreas você está estudando/desenvolvendo atualmente?
            </p>
          </div>

          {!readonly && (
            <div className="flex gap-2">
              <Input
                value={newLearningArea}
                onChange={(e) => setNewLearningArea(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addLearningArea()}
                placeholder="Ex: liderança, arquitetura, python..."
              />
              <button
                onClick={addLearningArea}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                +
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {data.activeLearning?.map((area) => (
              <Badge
                key={area}
                variant="secondary"
                className={`${!readonly ? 'cursor-pointer hover:bg-destructive/20' : ''}`}
                onClick={() => !readonly && removeLearningArea(area)}
              >
                {area} {!readonly && '×'}
              </Badge>
            ))}
            {(!data.activeLearning || data.activeLearning.length === 0) && (
              <p className="text-sm text-muted-foreground">
                Nenhuma área adicionada ainda
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Mental Health */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">{t('meeting.blocks.d.mentalHealth')}</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Como você avalia sua saúde mental e bem-estar?
              </p>
            </div>
            <Badge
              variant={(data.mentalHealth || 3) >= 4 ? 'default' : 'destructive'}
              className="text-lg"
            >
              {data.mentalHealth || 3}/5
            </Badge>
          </div>

          <Slider
            value={[data.mentalHealth || 3]}
            onValueChange={([value]) => onChange({ ...data, mentalHealth: value })}
            min={1}
            max={5}
            step={1}
            disabled={readonly}
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 - Muito mal</span>
            <span>3 - Regular</span>
            <span>5 - Excelente</span>
          </div>

          {data.mentalHealth && data.mentalHealth <= 2 && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
              ⚠️ Saúde mental precisa de atenção. Considere conversar com o gestor ou RH.
            </div>
          )}
        </div>
      </Card>

      {/* Biweekly Focus */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base">{t('meeting.blocks.d.biweeklyFocus')}</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Qual será seu foco principal de desenvolvimento para as próximas 2 semanas?
            </p>
          </div>

          <Textarea
            value={data.biweeklyFocus || ''}
            onChange={(e) => onChange({ ...data, biweeklyFocus: e.target.value })}
            placeholder="Descreva seu objetivo de desenvolvimento para as próximas 2 semanas..."
            maxLength={200}
            disabled={readonly}
            rows={3}
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Máximo 200 caracteres</span>
            <span>{(data.biweeklyFocus || '').length}/200</span>
          </div>
        </div>
      </Card>

      {/* Summary Card */}
      <Card className="p-6 bg-secondary/10 border-secondary/20">
        <h3 className="font-semibold mb-3">🎯 Resumo de Desenvolvimento</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Estado de flow:</span>
            <div className="flex items-center gap-2">
              <span className="text-lg">{flowState.emoji}</span>
              <Badge variant={flowState.state === 'Flow' ? 'default' : 'secondary'}>
                {flowState.state}
              </Badge>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Uso de pontos fortes:</span>
            <span className="font-medium">{data.strengthsUtilization || 50}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Áreas de aprendizado:</span>
            <span className="font-medium">{data.activeLearning?.length || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Saúde mental:</span>
            <Badge variant={(data.mentalHealth || 3) >= 4 ? 'default' : 'destructive'}>
              {data.mentalHealth || 3}/5
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}
