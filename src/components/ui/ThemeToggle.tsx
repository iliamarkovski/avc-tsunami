import React from 'react';
import { Button } from '@/components';
import { useTheme } from '@/contexts';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>((props, ref) => {
  const { setTheme, theme } = useTheme();

  return (
    <>
      <Button
        ref={ref}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        variant="ghost"
        size="sm"
        className="w-full justify-start"
        {...props}>
        {theme === 'dark' ? <Sun /> : null}
        {theme === 'light' ? <Moon /> : null}
        {theme === 'light' ? 'Тъмна' : 'Светла'} тема
      </Button>
    </>
  );
});

ThemeToggle.displayName = 'ThemeToggle';

export { ThemeToggle };
