import {
  Button,
  buttonVariants,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  ThemeToggle,
} from '@/components';
import { useAuth, useData } from '@/contexts';
import { useToast } from '@/hooks';
import { cn, getFirstChars } from '@/lib';
import { useMutation } from '@tanstack/react-query';
import { LogOut, Wrench } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
const LogoutMenu = () => {
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data } = useData();
  const { users } = data;

  const userData = users.find((u) => u.id === user?.id);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await logout();
    },
    onSuccess: () => {
      navigate('/');
      localStorage.clear();
    },
    onError: (error) => {
      console.error('error: ', error);
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" title="menu button">
          {getFirstChars(userData?.names || '')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{userData?.names}</DropdownMenuLabel>
        {user?.isAdmin ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
                <Wrench />
                Управление
              </Link>
            </DropdownMenuItem>
          </>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ThemeToggle />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button type="button" variant="ghost" size="sm" onClick={handleClick} className="w-full justify-start">
            <LogOut />
            Изход
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { LogoutMenu };
