import { Button } from '@/components';
import { useTheme } from '@/contexts';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      variant="ghost"
      size="sm"
      className="w-full justify-start">
      {theme === 'dark' ? <Sun /> : null}
      {theme === 'light' ? <Moon /> : null}
      {theme === 'light' ? 'Тъмна' : 'Светла'} тема
    </Button>
  );
};

export { ThemeToggle };
