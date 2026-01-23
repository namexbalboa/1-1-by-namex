import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { BlockB as BlockBType } from '@/types';

interface BlockBProps {
  data: Partial<BlockBType>;
  onChange: (data: Partial<BlockBType>) => void;
  readonly?: boolean;
}

export function BlockB({ data, onChange, readonly = false }: BlockBProps) {
  const { t } = useTranslation();

  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">
            {t('meeting.blocks.b.title')}
          </h2>
          <p className="text-sm text-muted-foreground">
            Como você enxerga o impacto do seu trabalho e sua autonomia?
          </p>
        </div>

        {/* Goal Connection */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Você se sente conectado aos objetivos da empresa?</Label>
                <Badge variant="outline" className="text-lg">
                  {data.goalConnection || 3}/5
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Em uma escala de 1 a 5, o quanto você compreende como seu trabalho contribui para os objetivos estratégicos e metas da organização?
              </p>
            </div>

          <Slider
            value={[data.goalConnection || 3]}
            onValueChange={([value]) => onChange({ ...data, goalConnection: value })}
            min={1}
            max={5}
            step={1}
            disabled={readonly}
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 - Desconectado</span>
            <span>3 - Parcialmente</span>
            <span>5 - Totalmente conectado</span>
          </div>
        </div>
      </Card>

        {/* Autonomy */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Qual o nível de autonomia nas suas decisões?</Label>
                <Badge variant="outline" className="text-lg">
                  {data.autonomy || 50}%
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Em uma escala de 0% a 100%, o quanto você tem liberdade para tomar decisões do dia a dia sem precisar de aprovações constantes ou micro gerenciamento?
              </p>
            </div>

          <Slider
            value={[data.autonomy || 50]}
            onValueChange={([value]) => onChange({ ...data, autonomy: value })}
            min={0}
            max={100}
            step={5}
            disabled={readonly}
          />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0% - Sem autonomia</span>
            <span>50% - Equilibrado</span>
            <span>100% - Total autonomia</span>
          </div>
        </div>
      </Card>

        {/* Innovation */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Teve oportunidade de inovar neste período?</Label>
              <p className="text-sm text-muted-foreground">
                Você teve espaço para experimentar novas abordagens, propor melhorias ou implementar soluções criativas no seu trabalho neste período?
              </p>
            </div>

          <RadioGroup
            value={data.innovation ? 'true' : 'false'}
            onValueChange={(value) => onChange({ ...data, innovation: value === 'true' })}
            disabled={readonly}
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
              <RadioGroupItem value="true" id="innovation-yes" />
              <Label htmlFor="innovation-yes" className="cursor-pointer flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-medium">Sim, tive oportunidades</p>
                    <p className="text-sm text-muted-foreground">
                      Experimentei novas ideias ou abordagens
                    </p>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
              <RadioGroupItem value="false" id="innovation-no" />
              <Label htmlFor="innovation-no" className="cursor-pointer flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">❌</span>
                  <div>
                    <p className="font-medium">Não, segui o padrão</p>
                    <p className="text-sm text-muted-foreground">
                      Mantive as mesmas abordagens de sempre
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
        <h3 className="font-semibold mb-3">📊 Resumo Estratégico</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Conexão com objetivos:</span>
            <span className="font-medium">{data.goalConnection || 3}/5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nível de autonomia:</span>
            <span className="font-medium">{data.autonomy || 50}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Inovação:</span>
            <Badge variant={data.innovation ? 'default' : 'secondary'}>
              {data.innovation ? 'Sim' : 'Não'}
            </Badge>
          </div>
        </div>
        </Card>
      </div>
  );
}
