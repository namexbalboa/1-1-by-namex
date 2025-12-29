import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function HistoryDetails() {
  const { collaboratorId, year } = useParams();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/history')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Histórico
          </Button>

          <Card className="p-12">
            <div className="text-center space-y-6">
              <Construction className="w-24 h-24 mx-auto text-muted-foreground opacity-50" />
              <div>
                <h1 className="text-3xl font-bold mb-2">🚧 Em Construção</h1>
                <p className="text-lg text-muted-foreground mb-4">
                  Detalhes do Histórico
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Colaborador ID: {collaboratorId}</p>
                  <p>Ano: {year}</p>
                </div>
              </div>
              <p className="text-muted-foreground max-w-md mx-auto">
                Esta página está sendo desenvolvida e em breve terá as informações
                detalhadas do histórico de reuniões do colaborador.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
