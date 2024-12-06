import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib';

const badgeVariants = cva(
  'inline-flex items-center text-primary-foreground rounded-full border px-2 h-[24px] pt-0.5 leading-none text-xs font-semibold transition-colors leading-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        positive: 'bg-green-600/70 ',
        negative: 'bg-red-600/70',
        neutral: 'bg-yellow-600/70',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
