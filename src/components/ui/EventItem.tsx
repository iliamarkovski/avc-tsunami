import {
  buttonVariants,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  EventResponse,
  SkeletonEventItem,
} from '@/components';
import { db } from '@/config';
import { useAuth } from '@/contexts';
import { useLiveEventResponses, useToast } from '@/hooks';
import { cn, getUsersByResponse } from '@/lib';
import { useMutation } from '@tanstack/react-query';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ReactNode } from 'react';
import { google, CalendarEvent } from 'calendar-link';
import { format } from 'date-fns';
import { EventType } from '@/types';
import { TEAM_NAME } from '@/constants';
import { CalendarPlus } from 'lucide-react';

type Props = {
  isCurrent?: boolean;
  children?: ReactNode;
  collection: string;
  eventId: string;
  date: string;
  title: string | ReactNode;
  hall: string;
  eventType: EventType;
};

const prefix: Record<EventType, string> = {
  training: '',
  ivl: '[IVL] ',
  volleyMania: '[Volley Mania] ',
};

const suffix: Record<EventType, string> = {
  training: ` ${TEAM_NAME}`,
  ivl: '',
  volleyMania: '',
};

const getEventInfo = ({
  title,
  location,
  date,
  eventType,
}: {
  title: string;
  location: string;
  date: string;
  eventType: EventType;
}): CalendarEvent => {
  return {
    title: prefix[eventType] + title + suffix[eventType],
    location: `зала ${location}`,
    start: date,
    duration: [2, 'hour'],
  };
};

const EventItem = ({ isCurrent, children, collection, eventId, date, title, hall, eventType }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const { eventResponses, loading: eventResponsesLoading } = useLiveEventResponses(collection, eventId);

  const answer = user ? eventResponses?.[user?.uid]?.answer : undefined;
  const formattedDate = format(date, 'dd.MM.yyyy');
  const time = format(date, 'HH:mm');

  const saveResponseMutation = useMutation({
    mutationFn: async (selectedValue: string) => {
      if (!user) return;

      const eventDocRef = doc(db, collection, eventId);

      const eventDoc = await getDoc(eventDocRef);

      if (eventDoc.exists()) {
        await updateDoc(eventDocRef, {
          [user.uid]: { answer: selectedValue, name: user.name, role: user.role },
        });
      } else {
        await setDoc(eventDocRef, {
          [user.uid]: { answer: selectedValue, name: user.name, role: user.role },
        });
      }
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Възникна грешка',
        description: 'Моля, опитайте отново по-късно.',
      });
    },
  });

  const handleChange = async (value: string) => {
    saveResponseMutation.mutate(value);
  };

  if (eventResponsesLoading) {
    return <SkeletonEventItem isCurrent={isCurrent && !!user} />;
  }

  return (
    <Card
      className={cn('text-center', {
        'bg-blue-400/10': isCurrent && !answer,
        'bg-green-400/10': isCurrent && answer === 'yes',
        'bg-red-400/10': isCurrent && answer === 'no',
      })}>
      <CardHeader>
        <CardDescription>
          {formattedDate} | {time}
        </CardDescription>
        <CardTitle>{title}</CardTitle>
        <CardDescription>зала {hall}</CardDescription>

        {children}

        {isCurrent && !!user ? (
          <div className="flex flex-col items-center gap-5">
            <EventResponse
              onChange={handleChange}
              data={getUsersByResponse(eventResponses)}
              selectedValue={eventResponses?.[user!.uid]?.answer || ''}
            />

            <a
              className={cn(buttonVariants())}
              href={google(getEventInfo({ title: title as string, location: hall, date, eventType }))}
              target="_blank">
              <CalendarPlus /> Добави в календар
            </a>
          </div>
        ) : null}
      </CardHeader>
    </Card>
  );
};

export { EventItem };
