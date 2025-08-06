// Template padrão para modais do sistema
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

interface StandardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'glass';
}

const StandardModal: React.FC<StandardModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  size = 'md',
  variant = 'glass'
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${sizeClasses[size]} max-h-[90vh] overflow-y-auto p-0`}>
        <Card className={`border-0 shadow-none ${variant === 'glass' ? 'glassmorphism border-primary/20' : ''}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              {icon && <span className="text-primary">{icon}</span>}
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {children}
            {footer && (
              <>
                <Separator />
                <div className="flex gap-3 justify-end pt-2">
                  {footer}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default StandardModal;

// Exemplo de uso:
/*
<StandardModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Adicionar Produto"
  subtitle="Preencha as informações do novo produto"
  icon={<Plus className="w-5 h-5" />}
  size="lg"
  footer={
    <>
      <Button variant="outline" onClick={() => setShowModal(false)}>
        Cancelar
      </Button>
      <Button onClick={handleSave}>
        Salvar Produto
      </Button>
    </>
  }
>
  <div className="space-y-4">
    <Input placeholder="Nome do produto" />
    <Textarea placeholder="Descrição" />
  </div>
</StandardModal>
*/