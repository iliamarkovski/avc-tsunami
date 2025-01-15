import { buttonVariants } from '@/components';
import { useData } from '@/contexts';
import { cn } from '@/lib';
import { Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const { data } = useData();
  const { version } = data;
  return (
    <footer className="border-t p-safe">
      <div className="wrapper">
        <div className="flex flex-col items-center gap-4">
          <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
            <p className="text-sm">АВК Цунами &copy; {new Date().getFullYear()}</p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://www.instagram.com/avc.tsunami/"
                target="_blank"
                className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}
                title="instagram button">
                <Instagram />
              </a>

              <a
                href="https://www.youtube.com/@avctsunami/"
                target="_blank"
                className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}
                title="youtube button">
                <Youtube />
              </a>
            </div>
          </div>

          {version ? <p className="text-xs">Версия {version.version}</p> : null}
        </div>
      </div>
    </footer>
  );
};

export { Footer };
