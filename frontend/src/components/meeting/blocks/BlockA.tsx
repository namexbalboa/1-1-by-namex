import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { BlockA as BlockAType } from '@/types';

interface BlockAProps {
  data: Partial<BlockAType>;
  onChange: (data: Partial<BlockAType>) => void;
  readonly?: boolean;
}

export function BlockA({ data, onChange, readonly = false }: BlockAProps) {
  const { t } = useTranslation();

  const updateTimeDistribution = (field: keyof BlockAType['timeDistribution'], value: number) => {
    const current = {
      execution: data.timeDistribution?.execution || 33,
      meetings: data.timeDistribution?.meetings || 33,
      resolution: data.timeDistribution?.resolution || 34,
    };

    // Garantir que o valor esteja entre 0 e 100
    const newValue = Math.max(0, Math.min(100, value));

    // Atualizar o campo sendo modificado
    const updated = { ...current, [field]: newValue };

    // Calcular quanto sobrou para distribuir
    const remaining = 100 - newValue;

    // Pegar os outros campos
    const otherFields = (Object.keys(current) as Array<keyof typeof current>)
      .filter(key => key !== field);

    // Calcular a proporção atual dos outros campos
    const otherFieldsTotal = otherFields.reduce((sum, key) => sum + current[key], 0);

    // Redistribuir proporcionalmente entre os outros campos
    if (otherFieldsTotal > 0 && remaining > 0) {
      otherFields.forEach(key => {
        const proportion = current[key] / otherFieldsTotal;
        updated[key] = Math.round(remaining * proportion);
      });

      // Ajustar arredondamento para somar exatamente 100
      const newTotal = Object.values(updated).reduce((sum, val) => sum + val, 0);
      if (newTotal !== 100) {
        updated[otherFields[0]] += (100 - newTotal);
      }
    } else if (remaining > 0) {
      // Se os outros campos estavam em 0, dividir igualmente
      const perField = Math.floor(remaining / otherFields.length);
      otherFields.forEach((key, idx) => {
        updated[key] = idx === 0 ? remaining - (perField * (otherFields.length - 1)) : perField;
      });
    } else {
      // Se não sobrou nada, zerar os outros
      otherFields.forEach(key => {
        updated[key] = 0;
      });
    }

    onChange({
      ...data,
      timeDistribution: updated,
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
    <TooltipProvider>
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
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">
                  Como você tem distribuído seu tempo?
                </h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Analise como você está distribuindo seu tempo entre execução de tarefas, participação em reuniões e resolução de imprevistos. A soma deve totalizar 100%.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Badge variant={isTimeValid ? 'default' : 'destructive'}>
                Total: {totalTime}%
              </Badge>
            </div>

          {!isTimeValid && (
            <p className="text-sm text-destructive">
              A soma deve ser exatamente 100%
            </p>
          )}

          {/* Visual Distribution Bar */}
          <div className="w-full h-8 flex rounded-lg overflow-hidden shadow-inner border-2 border-border">
            {data.timeDistribution?.execution! > 0 && (
              <div
                className="bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center text-xs font-semibold text-white transition-all duration-300"
                style={{ width: `${data.timeDistribution?.execution || 0}%` }}
              >
                {data.timeDistribution?.execution! >= 10 && `${data.timeDistribution?.execution}%`}
              </div>
            )}
            {data.timeDistribution?.meetings! > 0 && (
              <div
                className="bg-gradient-to-r from-accent to-accent/80 flex items-center justify-center text-xs font-semibold text-white transition-all duration-300"
                style={{ width: `${data.timeDistribution?.meetings || 0}%` }}
              >
                {data.timeDistribution?.meetings! >= 10 && `${data.timeDistribution?.meetings}%`}
              </div>
            )}
            {data.timeDistribution?.resolution! > 0 && (
              <div
                className="bg-gradient-to-r from-warning to-warning/80 flex items-center justify-center text-xs font-semibold text-white transition-all duration-300"
                style={{ width: `${data.timeDistribution?.resolution || 0}%` }}
              >
                {data.timeDistribution?.resolution! >= 10 && `${data.timeDistribution?.resolution}%`}
              </div>
            )}
            {totalTime < 100 && (
              <div
                className="bg-muted flex items-center justify-center text-xs text-muted-foreground transition-all duration-300"
                style={{ width: `${100 - totalTime}%` }}
              >
                {100 - totalTime >= 10 && `${100 - totalTime}%`}
              </div>
            )}
          </div>


          <div className="space-y-6">
            {/* Execution */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-primary to-primary/80 flex-shrink-0"></div>
                  <Label className="text-base font-medium">{t('meeting.blocks.a.execution')}</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Tempo dedicado à execução de tarefas planejadas, desenvolvimento de projetos e atividades previstas no seu escopo de trabalho.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge variant="outline" className="text-base font-semibold min-w-[60px] justify-center">
                  {data.timeDistribution?.execution || 33}%
                </Badge>
              </div>
              <Slider
                value={[data.timeDistribution?.execution || 33]}
                onValueChange={([value]) => updateTimeDistribution('execution', value)}
                min={0}
                max={100}
                step={1}
                disabled={readonly}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Tempo executando tarefas planejadas e desenvolvimento
              </p>
            </div>

            {/* Meetings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-accent to-accent/80 flex-shrink-0"></div>
                  <Label className="text-base font-medium">{t('meeting.blocks.a.meetings')}</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Tempo gasto em reuniões, alinhamentos com o time, cerimônias ágeis e outras interações colaborativas planejadas.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge variant="outline" className="text-base font-semibold min-w-[60px] justify-center">
                  {data.timeDistribution?.meetings || 33}%
                </Badge>
              </div>
              <Slider
                value={[data.timeDistribution?.meetings || 33]}
                onValueChange={([value]) => updateTimeDistribution('meetings', value)}
                min={0}
                max={100}
                step={1}
                disabled={readonly}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Tempo em reuniões, alinhamentos e cerimônias
              </p>
            </div>

            {/* Resolution */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-warning to-warning/80 flex-shrink-0"></div>
                  <Label className="text-base font-medium">{t('meeting.blocks.a.resolution')}</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Tempo dedicado a resolver imprevistos, apagar incêndios, lidar com urgências não planejadas e corrigir problemas inesperados.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge variant="outline" className="text-base font-semibold min-w-[60px] justify-center">
                  {data.timeDistribution?.resolution || 34}%
                </Badge>
              </div>
              <Slider
                value={[data.timeDistribution?.resolution || 34]}
                onValueChange={([value]) => updateTimeDistribution('resolution', value)}
                min={0}
                max={100}
                step={1}
                disabled={readonly}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Tempo apagando incêndios e resolvendo imprevistos
              </p>
            </div>
          </div>
        </div>
      </Card>

        {/* Blockers */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Existem bloqueadores no seu trabalho?</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Identifique obstáculos que estão impedindo ou dificultando seu trabalho. Verde = sem bloqueios significativos, Amarelo = alguns impedimentos, Vermelho = bloqueios críticos.</p>
                </TooltipContent>
              </Tooltip>
            </div>

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
              <div className="flex items-center gap-2">
                <Label className="text-lg font-semibold">As ferramentas que você usa são adequadas?</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Avalie se as ferramentas, sistemas e tecnologias disponíveis atendem suas necessidades para executar o trabalho com eficiência e qualidade.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
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
              <div className="flex items-center gap-2">
                <Label className="text-lg font-semibold">As prioridades do seu trabalho estão claras?</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Avalie o quanto você entende claramente o que deve ser priorizado no seu trabalho e como as tarefas se ordenam em termos de importância e urgência.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
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
    </TooltipProvider>
  );
}
