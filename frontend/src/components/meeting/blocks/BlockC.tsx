import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { BlockC as BlockCType } from '@/types';

interface BlockCProps {
  data: Partial<BlockCType>;
  onChange: (data: Partial<BlockCType>) => void;
  readonly?: boolean;
}

export function BlockC({ data, onChange, readonly = false }: BlockCProps) {
  const { t } = useTranslation();

  const getRecognitionEmoji = (recognition: string) => {
    const emojis = {
      low: '😔',
      medium: '🙂',
      high: '🌟',
    };
    return emojis[recognition as keyof typeof emojis] || '🙂';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">
          {t('meeting.blocks.c.title')}
        </h2>
        <p className="text-sm text-muted-foreground">
          Como está o clima e as relações no time?
        </p>
      </div>

      {/* Psychological Safety */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">
                {t('meeting.blocks.c.psychologicalSafety')}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Você se sente confortável para expressar opiniões e fazer perguntas?
              </p>
            </div>
            <Badge variant="outline" className="text-lg">
              {data.psychologicalSafety || 3}/5
            </Badge>
          </div>

          <Slider
            value={[data.psychologicalSafety || 3]}
            onValueChange={([value]) =>
              onChange({ ...data, psychologicalSafety: value })
            }
            min={1}
            max={5}
            step={1}
            disabled={readonly}
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 - Desconfortável</span>
            <span>3 - Neutro</span>
            <span>5 - Muito seguro</span>
          </div>

          {data.psychologicalSafety && data.psychologicalSafety <= 2 && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm text-destructive">
              ⚠️ Nível baixo de segurança psicológica. Importante discutir com o gestor.
            </div>
          )}
        </div>
      </Card>

      {/* Collaboration Friction */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">
                {t('meeting.blocks.c.collaborationFriction')}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Qual o nível de atrito ou dificuldade na colaboração com outros times/pessoas?
              </p>
            </div>
            <Badge
              variant={
                (data.collaborationFriction || 5) <= 3 ? 'default' : 'destructive'
              }
              className="text-lg"
            >
              {data.collaborationFriction || 5}/10
            </Badge>
          </div>

          <Slider
            value={[data.collaborationFriction || 5]}
            onValueChange={([value]) =>
              onChange({ ...data, collaborationFriction: value })
            }
            min={1}
            max={10}
            step={1}
            disabled={readonly}
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 - Sem atrito</span>
            <span>5 - Moderado</span>
            <span>10 - Muito atrito</span>
          </div>
        </div>
      </Card>

      {/* Recognition */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base">{t('meeting.blocks.c.recognition')}</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Como você avalia o reconhecimento recebido pelo seu trabalho?
            </p>
          </div>

          <RadioGroup
            value={data.recognition || 'medium'}
            onValueChange={(value: any) => onChange({ ...data, recognition: value })}
            disabled={readonly}
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
              <RadioGroupItem value="low" id="recognition-low" />
              <Label htmlFor="recognition-low" className="cursor-pointer flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">😔</span>
                  <div>
                    <p className="font-medium">Baixo</p>
                    <p className="text-sm text-muted-foreground">
                      Sinto falta de reconhecimento
                    </p>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
              <RadioGroupItem value="medium" id="recognition-medium" />
              <Label htmlFor="recognition-medium" className="cursor-pointer flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🙂</span>
                  <div>
                    <p className="font-medium">Médio</p>
                    <p className="text-sm text-muted-foreground">
                      Recebo reconhecimento ocasionalmente
                    </p>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
              <RadioGroupItem value="high" id="recognition-high" />
              <Label htmlFor="recognition-high" className="cursor-pointer flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌟</span>
                  <div>
                    <p className="font-medium">Alto</p>
                    <p className="text-sm text-muted-foreground">
                      Sinto-me reconhecido e valorizado
                    </p>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </Card>

      {/* Summary Card */}
      <Card className="p-6 bg-secondary/10 border-secondary/20">
        <h3 className="font-semibold mb-3">👥 Resumo de Dinâmica Humana</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Segurança psicológica:</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">{data.psychologicalSafety || 3}/5</span>
              {data.psychologicalSafety && data.psychologicalSafety <= 2 && (
                <Badge variant="destructive" className="text-xs">Atenção</Badge>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Atrito na colaboração:</span>
            <span className="font-medium">{data.collaborationFriction || 5}/10</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Reconhecimento:</span>
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {getRecognitionEmoji(data.recognition || 'medium')}
              </span>
              <Badge variant="outline">
                {t(`meeting.recognition.${data.recognition || 'medium'}`)}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
