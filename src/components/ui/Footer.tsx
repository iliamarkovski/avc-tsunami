import { buttonVariants } from '@/components';
import { LATEST_VERSION } from '@/constants';
import { cn } from '@/lib';
import { Instagram, Youtube } from 'lucide-react';

const Footer = () => {
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

          {LATEST_VERSION ? <p className="text-xs">Версия {Number(LATEST_VERSION).toFixed(2)}</p> : null}
        </div>
      </div>
    </footer>
  );
};

export { Footer };
