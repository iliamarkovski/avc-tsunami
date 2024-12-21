import { buttonVariants } from '@/components';
import { cn } from '@/lib';
import { Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t p-safe">
      <div className="wrapper flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm">АВК Цунами &copy; {new Date().getFullYear()}</p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://www.instagram.com/avc.tsunami/"
            target="_blank"
            className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
            <Instagram />
          </a>

          <a
            href="https://www.youtube.com/@avctsunami/"
            target="_blank"
            className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
            <Youtube />
          </a>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
