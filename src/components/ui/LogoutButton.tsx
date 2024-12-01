import { Button } from '@/components';
import { useAuth } from '@/contexts';
import { useToast } from '@/hooks';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
const LogoutButton = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await logout();
    },
    onSuccess: () => {
      navigate('/');
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Възникна грешка',
        description: 'Моля, опитайте отново по-късно.',
      });
    },
  });

  const handleClick = () => {
    logoutMutation.mutate();
  };

  return <Button onClick={handleClick}>Изход</Button>;
};

export { LogoutButton };
