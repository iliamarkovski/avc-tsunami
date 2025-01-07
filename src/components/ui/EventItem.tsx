import {
  Badge,
  buttonVariants,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  EventResponse,
  Matches,
  Training,
} from '@/components';
import { db } from '@/config';
import { useAuth, useData } from '@/contexts';
import { useToast, useUsersByResponse } from '@/hooks';
import { cn, getDataById } from '@/lib';
import { useMutation } from '@tanstack/react-query';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ReactNode, useMemo } from 'react';
import { google, CalendarEvent } from 'calendar-link';
import { format } from 'date-fns';
import { EventOptions, EventType, QueryKeys, Roles } from '@/types';
import { QUERY_KEYS, TEAM_NAME } from '@/constants';
import { CalendarPlus } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

type EventResponseType = {
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
}): CalendarEvent => ({
  title: prefix[eventType] + title + suffix[eventType],
  location: `зала ${location}`,
  start: dateTime,
  duration: [2, 'hour'],
});

const EventItem = ({ isCurrent, children, queryKey, eventId, dateTime, title, hall, badge }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data } = useData();
  const { users } = data;

  const eventResponses = getDataById(data[queryKey] as Training[] | Matches[], eventId) as
    | EventResponseType
    | undefined;
  const responsesData = useUsersByResponse(eventResponses?.responses);

  const calendarTitle = useMemo(
    () => (typeof title === 'string' ? title : ReactDOMServer.renderToString(title)),
    [title]
  );

  const answer = user ? eventResponses?.responses?.[user.id!]?.answer : undefined;
  const formattedDate = format(dateTime, 'dd.MM.yyyy');
  const time = format(dateTime, 'HH:mm');

  const userInfo = !!user ? users.find((u) => u.id === user.id) : undefined;
  const isUserActive = userInfo?.isActive;
  const userRole = userInfo?.role;

  const canVote = useMemo(
    () => isCurrent && !!user && (userRole === 'coach' || !(!isUserActive && queryKey === QUERY_KEYS.VOLLEYMANIA)),
    [isCurrent, user, queryKey]
  );

  const saveResponseMutation = useMutation({
    mutationKey: ['saveResponse', eventId],
    mutationFn: async (selectedValue: string) => {
      if (!user) return;

      const eventDocRef = doc(db, queryKey, eventId);
      const eventDoc = await getDoc(eventDocRef);

      if (eventDoc.exists()) {
        await updateDoc(eventDocRef, {
          responses: {
            ...eventDoc.data().responses,
            [user.id!]: { answer: selectedValue },
          },
        });
      } else {
        await setDoc(eventDocRef, {
          responses: {
            [user.id!]: { answer: selectedValue },
          },
        });
      }
    },
    onError: (error) => {
      console.error('Error saving response:', error);
      toast({
        variant: 'destructive',
        title: 'Възникна грешка',
        description: 'Моля, опитайте отново по-късно.',
      });
    },
  });

  const handleChange = (value: string) => {
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
        {(canVote && !answer) || badge ? (
          <div className="mb-2 flex flex-wrap items-center justify-center gap-2">
            {canVote && !answer && (
              <Badge variant="destructive" className="animate-pulse">
                НЕПОТВЪРДЕНО ПРИСЪСТВИЕ
              </Badge>
            )}
            {badge && <Badge variant="outline">{badge}</Badge>}
          </div>
        ) : null}
        <CardDescription>
          {formattedDate} | {time}
        </CardDescription>
        <CardTitle>{title}</CardTitle>
        <CardDescription>зала {hall}</CardDescription>

        {children}

        {canVote && (
          <div className="flex flex-col items-center gap-5">
            <EventResponse onChange={handleChange} data={responsesData} selectedValue={answer} />

            <a
              className={cn(buttonVariants())}
              href={google(
                getEventInfo({ title: calendarTitle, location: hall, dateTime, eventType: queryKey as EventType })
              )}
              target="_blank"
              rel="noopener noreferrer">
              <CalendarPlus /> Добави в календар
            </a>
          </div>
        )}
      </CardHeader>
    </Card>
  );
};

export { EventItem };
