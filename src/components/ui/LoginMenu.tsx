import {
  Button,
  buttonVariants,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
  ThemeToggle,
} from '@/components';
import { cn } from '@/lib';
import { LogIn, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
const LoginMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <ThemeToggle />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/login" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'w-full justify-start')}>
            <LogIn />
            Вход
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { LoginMenu };
