import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/settings');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">🚀 Bem-vindo ao 1:1 by Namex!</DialogTitle>
          <DialogDescription className="text-base">
            Estamos felizes em tê-lo aqui. Vamos começar configurando sua organização.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Para começar a usar o sistema de reuniões 1:1, siga estes passos:
          </p>

          <div className="space-y-3">
            <div className="flex gap-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="text-2xl flex-shrink-0">1️⃣</div>
              <div>
                <h4 className="font-medium mb-1">Cadastre os Departamentos</h4>
                <p className="text-sm text-muted-foreground">
                  Configure a estrutura organizacional da empresa
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="text-2xl flex-shrink-0">2️⃣</div>
              <div>
                <h4 className="font-medium mb-1">Cadastre as Funções/Cargos</h4>
                <p className="text-sm text-muted-foreground">
                  Defina os cargos e funções disponíveis
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="text-2xl flex-shrink-0">3️⃣</div>
              <div>
                <h4 className="font-medium mb-1">Cadastre os Gestores</h4>
                <p className="text-sm text-muted-foreground">
                  Adicione os gestores que conduzirão as reuniões 1:1
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="text-2xl flex-shrink-0">4️⃣</div>
              <div>
                <h4 className="font-medium mb-1">Cadastre os Colaboradores</h4>
                <p className="text-sm text-muted-foreground">
                  Adicione os colaboradores e vincule aos gestores
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Fazer Depois
          </Button>
          <Button
            onClick={handleGetStarted}
            className="flex-1"
          >
            Começar Agora
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
