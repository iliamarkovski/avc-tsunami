import { buttonVariants } from '@/components';
import { cn } from '@/lib';
import { Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = {
  to: string;
};

const EditLink = ({ to }: Props) => {
  return (
    <Link to={to} className={cn(buttonVariants({ size: 'icon', variant: 'ghost' }), 'bg-background')}>
      <Pencil className="text-primary" />
    </Link>
  );
};

export { EditLink };
