import { buttonVariants } from '@/components';
import { cn } from '@/lib';
import { LucideIcon } from 'lucide-react';

type Props = {
  href: string;
  title: string;
  icon: LucideIcon;
};

const IconLink = ({ href, title, icon: Icon }: Props) => {
  return (
    <a
      href={href}
      target="_blank"
      className={cn(
        buttonVariants({ variant: 'outline', size: 'sm' }),
        'flex max-w-full items-center gap-2 overflow-hidden'
      )}>
      <Icon className="text-red-600" />
      <span className="truncate">{title}</span>
    </a>
  );
};

export { IconLink };
