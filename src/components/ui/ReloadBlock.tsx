import { Button, Title } from '@/components';
import { RotateCw } from 'lucide-react';

const ReloadBlock = () => {
  const handleRefresh = () => {
    // Clear cache and refresh the page
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => caches.delete(name));
      });
    }

    window.location.reload();
  };

  return (
    <div className="flex min-h-svh w-full flex-col">
      <main className="wrapper flex flex-1 flex-col items-center justify-center gap-4 p-safe">
        <Title title="Налична е нова версия" />
        <Button type="button" variant="outline" onClick={handleRefresh}>
          <RotateCw />
          Презареди
        </Button>
      </main>
    </div>
  );
};

export { ReloadBlock };
