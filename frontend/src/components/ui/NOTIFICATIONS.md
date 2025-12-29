# Sistema de Notificações

Este projeto utiliza um sistema personalizado de notificações (toasts) e diálogos de confirmação.

## Toast Notifications

### Uso Básico

```tsx
import { useToast } from '@/hooks/useToast';

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Operação realizada com sucesso!');
  };

  const handleError = () => {
    toast.error('Erro ao realizar operação', 'Detalhes do erro aqui');
  };

  const handleWarning = () => {
    toast.warning('Atenção: preencha todos os campos');
  };

  const handleInfo = () => {
    toast.info('Informação importante');
  };
}
```

### Toast com Promise

```tsx
const handleSave = async () => {
  toast.promise(
    api.post('/endpoint', data),
    {
      loading: 'Salvando...',
      success: 'Salvo com sucesso!',
      error: 'Erro ao salvar',
    }
  );
};
```

## Diálogo de Confirmação

### Uso Básico

```tsx
import { useConfirm } from '@/hooks/useConfirm';

function MyComponent() {
  const { confirm, ConfirmDialog } = useConfirm();

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Remover Item',
      description: 'Tem certeza que deseja remover este item?',
      confirmText: 'Remover',
      cancelText: 'Cancelar',
      variant: 'destructive', // ou 'default'
    });

    if (!confirmed) return;

    // Proceder com a exclusão
    await api.delete(`/items/${id}`);
  };

  return (
    <>
      {ConfirmDialog}
      <button onClick={handleDelete}>Excluir</button>
    </>
  );
}
```

## Tipos de Variantes

### Toast
- `success` - Verde, para operações bem-sucedidas
- `error` - Vermelho, para erros
- `warning` - Amarelo, para avisos
- `info` - Azul, para informações

### Confirm Dialog
- `default` - Botão normal
- `destructive` - Botão vermelho para ações destrutivas (excluir, remover, etc.)

## Exemplo Completo

```tsx
import { useToast } from '@/hooks/useToast';
import { useConfirm } from '@/hooks/useConfirm';

function UserManager() {
  const toast = useToast();
  const { confirm, ConfirmDialog } = useConfirm();

  const handleCreate = async (data) => {
    try {
      await api.post('/users', data);
      toast.success('Usuário criado com sucesso');
    } catch (error) {
      toast.error('Erro ao criar usuário', error.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: 'Remover Usuário',
      description: 'Tem certeza que deseja remover este usuário?',
      confirmText: 'Remover',
      variant: 'destructive',
    });

    if (!confirmed) return;

    try {
      await api.delete(`/users/${id}`);
      toast.success('Usuário removido com sucesso');
    } catch (error) {
      toast.error('Erro ao remover usuário');
    }
  };

  return (
    <>
      {ConfirmDialog}
      {/* Component UI */}
    </>
  );
}
```
