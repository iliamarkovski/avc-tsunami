import { Loader2 } from 'lucide-react';

const PageLoader = () => {
  return (
    <div className="flex h-svh w-full items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
};

export { PageLoader };
