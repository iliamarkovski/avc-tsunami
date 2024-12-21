import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from '@/components';
import { Trash2 } from 'lucide-react';

type Props = { onClick: () => void; isLoading?: boolean; disabled?: boolean };

const DeleteButton = ({ onClick, isLoading, disabled }: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="ghost" disabled={isLoading || disabled} title="Изтрий">
          <Trash2 className="text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Сигурен ли сте?</AlertDialogTitle>
          <AlertDialogDescription>Това действие е необратимо и ще изтрие данните завинаги.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Отмяна</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={onClick}>Потвърждавам</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { DeleteButton };
