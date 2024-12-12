import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import { CalendarX2 } from 'lucide-react';

const NotFoundEvents = () => {
  return (
    <Alert>
      <CalendarX2 className="size-5" />
      <AlertTitle>Не са намерени резултати</AlertTitle>
      <AlertDescription>Няма предстоящи събития</AlertDescription>
    </Alert>
  );
};

export { NotFoundEvents };
