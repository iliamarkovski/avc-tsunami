import {
  Avatar,
  AvatarFallback,
  AvatarImage,
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
import { LogOut, UserPen, Wrench } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
const LogoutMenu = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data } = useData();
  const { loggedInUser } = data;

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
        <Button variant="outline" size="icon" title="menu button" className="relative overflow-hidden">
          <Avatar className="absolute inset-0 h-full w-full rounded-none">
            <AvatarImage src={loggedInUser?.image!} className="h-full w-full object-cover" />
            <AvatarFallback className="h-full w-full rounded-none bg-transparent leading-none">
              {getFirstChars(loggedInUser?.names || '')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{loggedInUser?.names}</DropdownMenuLabel>
        {!!loggedInUser ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                to="/profile"
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'w-full justify-start')}>
                <UserPen />
                Профил
              </Link>
            </DropdownMenuItem>
          </>
        ) : null}
        {loggedInUser?.isAdmin ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                to="/dashboard"
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'w-full justify-start')}>
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
