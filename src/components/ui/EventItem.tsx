import { Badge, buttonVariants, Card, CardDescription, CardHeader, CardTitle, EventResponse } from '@/components';
import { db } from '@/config';
import { useAuth, useData } from '@/contexts';
import { useToast } from '@/hooks';
import { cn, getDataById, getUsersByResponse } from '@/lib';
import { useMutation } from '@tanstack/react-query';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ReactNode } from 'react';
import { google, CalendarEvent } from 'calendar-link';
import { format } from 'date-fns';
import { EventOptions, EventType, QueryKeys, Roles } from '@/types';
import { QUERY_KEYS, TEAM_NAME } from '@/constants';
import { CalendarPlus } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

type EventResponse = {
  responses?: Record<
    string,
    {
      answer: EventOptions;
      name: string;
      role: Roles;
    }
  >;
};

type Props = {
  isCurrent?: boolean;
  children?: ReactNode;
  queryKey: QueryKeys;
  eventId: string;
  dateTime: Date;
  title: ReactNode;
  hall: string;
  badge?: string;
};

const prefix: Record<EventType, string> = {
  training: '',
  ivl: '[IVL] ',
  volleymania: '[Volley Mania] ',
};

const suffix: Record<EventType, string> = {
  training: ` ${TEAM_NAME}`,
  ivl: '',
  volleymania: '',
};

const getEventInfo = ({
  title,
  location,
  dateTime,
  eventType,
}: {
  title: string;
  location: string;
  dateTime: Date;
  eventType: EventType;
}): CalendarEvent => {
  return {
    title: prefix[eventType] + title + suffix[eventType],
    location: `зала ${location}`,
    start: dateTime,
    duration: [2, 'hour'],
  };
};

const EventItem = ({ isCurrent, children, queryKey, eventId, dateTime, title, hall, badge }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data } = useData();

  const eventResponses = getDataById(data[queryKey], eventId) as EventResponse;

  const calendarTitle = typeof title === 'string' ? title : ReactDOMServer.renderToString(title);

  const answer = user ? eventResponses?.responses?.[user?.uid]?.answer : undefined;
  const formattedDate = format(dateTime, 'dd.MM.yyyy');
  const time = format(dateTime, 'HH:mm');

  const canVote = isCurrent && !!user && !(user.role === 'other' && queryKey === QUERY_KEYS.VOLLEYMANIA);

  const saveResponseMutation = useMutation({
    mutationFn: async (selectedValue: string) => {
      if (!user) return;

      const eventDocRef = doc(db, queryKey, eventId);

      const eventDoc = await getDoc(eventDocRef);

      if (eventDoc.exists()) {
        await updateDoc(eventDocRef, {
          responses: {
            ...eventDoc.data().responses,
            [user.uid]: { answer: selectedValue, name: user.name, role: user.role },
          },
        });
      } else {
        await setDoc(eventDocRef, {
          responses: {
            [user.uid]: { answer: selectedValue, name: user.name, role: user.role },
          },
        });
      }
    },
    onError: (error) => {
      console.error('error: ', error);
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

  return (
    <Card
      className={cn('text-center', {
        'bg-blue-400/10': isCurrent && !answer,
        'bg-green-400/10': isCurrent && answer === 'yes',
        'bg-red-400/10': isCurrent && answer === 'no',
      })}>
      <CardHeader>
        {badge ? (
          <Badge variant="outline" className="mb-2 self-center">
            {badge}
          </Badge>
        ) : null}
        <CardDescription>
          {formattedDate} | {time}
        </CardDescription>
        <CardTitle>{title}</CardTitle>
        <CardDescription>зала {hall}</CardDescription>

        {children}

        {canVote ? (
          <div className="flex flex-col items-center gap-5">
            <EventResponse
              onChange={handleChange}
              data={getUsersByResponse(eventResponses?.responses)}
              selectedValue={eventResponses?.responses?.[user!.uid]?.answer || ''}
            />

            <a
              className={cn(buttonVariants())}
              href={google(
                getEventInfo({ title: calendarTitle, location: hall, dateTime, eventType: queryKey as EventType })
              )}
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
