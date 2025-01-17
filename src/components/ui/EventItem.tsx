import {
  Alert,
  AlertTitle,
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
import { useData } from '@/contexts';
import { useToast, useUsersByResponse } from '@/hooks';
import { cn, getDataById } from '@/lib';
import { useMutation } from '@tanstack/react-query';
import { ReactNode, useMemo } from 'react';
import { google, CalendarEvent } from 'calendar-link';
import { format, subMinutes } from 'date-fns';
import { EventOptions, EventType, QueryKeys, Roles } from '@/types';
import { QUERY_KEYS, TEAM_NAME } from '@/constants';
import { CalendarPlus } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';
import { setDocument, updateDocument } from '@/api';
import { bg } from 'date-fns/locale';

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
  message?: string;
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
  warmupTime,
  startTime,
  eventType,
}: {
  title: string;
  location: string;
  warmupTime: Date;
  startTime: Date;
  eventType: EventType;
}): CalendarEvent => ({
  title: prefix[eventType] + title + suffix[eventType],
  location: `зала ${location}`,
  start: warmupTime,
  duration: [eventType === QUERY_KEYS.TRAINING ? 2.25 : 2.75, 'hour'],
  description: `Загрявка: ${format(warmupTime, 'HH:mm')}ч.; Начало: ${format(startTime, 'HH:mm')}ч.`,
});

const EventItem = ({ isCurrent, children, queryKey, eventId, dateTime, title, hall, badge, message }: Props) => {
  const { toast } = useToast();
  const { data } = useData();
  const { loggedInUser } = data;

  const eventResponses = getDataById(data[queryKey] as Training[] | Matches[], eventId) as
    | EventResponseType
    | undefined;
  const responsesData = useUsersByResponse(eventResponses?.responses);

  const calendarTitle = useMemo(
    () => (typeof title === 'string' ? title : ReactDOMServer.renderToString(title)),
    [title]
  );

  const answer = loggedInUser ? eventResponses?.responses?.[loggedInUser.id!]?.answer : undefined;
  const formattedDate = format(dateTime, 'dd.MM.yyyy');
  const time = format(dateTime, 'HH:mm');
  const timeDiff = queryKey === QUERY_KEYS.TRAINING ? subMinutes(dateTime, 15) : subMinutes(dateTime, 45);
  const warmupTime = format(timeDiff, 'HH:mm');
  const dayOfWeek = format(dateTime, 'EEEE', { locale: bg });

  const isUserActive = loggedInUser?.isActive;
  const userRole = loggedInUser?.role;

  const canVote = useMemo(
    () =>
      isCurrent && !!loggedInUser && (userRole === 'coach' || !(!isUserActive && queryKey === QUERY_KEYS.VOLLEYMANIA)),
    [isCurrent, loggedInUser, queryKey]
  );

  const saveResponseMutation = useMutation({
    mutationKey: ['saveResponse', eventId],
    mutationFn: async (selectedValue: string) => {
      if (!loggedInUser) return;

      if (eventResponses) {
        await updateDocument(queryKey, eventId, {
          responses: {
            ...eventResponses.responses,
            [loggedInUser.id!]: { answer: selectedValue },
          },
        });
      } else {
        await setDocument(queryKey, eventId, {
          responses: {
            [loggedInUser.id!]: { answer: selectedValue },
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

        {canVote ? (
          <>
            <CardDescription>
              Дата: {formattedDate}г. ({dayOfWeek})
            </CardDescription>
            <CardDescription>Загрявка: {warmupTime}ч.</CardDescription>
            <CardDescription>Начало: {time}ч.</CardDescription>
          </>
        ) : (
          <>
            <CardDescription>
              {formattedDate}г. | {time}ч.
            </CardDescription>
          </>
        )}
        <CardTitle>{title}</CardTitle>
        <CardDescription>зала {hall}</CardDescription>

        {canVote && message ? (
          <Alert className="!mt-5 w-auto self-center border-secondary">
            <AlertTitle className="mb-0 flex items-center justify-center gap-2">
              <span className="animate-pulse">⚠️</span> <span className="italic">{message}</span>{' '}
              <span className="animate-pulse">⚠️</span>
            </AlertTitle>
          </Alert>
        ) : null}

        {children}

        {canVote && (
          <div className="flex flex-col items-center gap-5">
            <EventResponse onChange={handleChange} data={responsesData} selectedValue={answer} />

            <a
              className={cn(buttonVariants())}
              href={google(
                getEventInfo({
                  title: calendarTitle,
                  location: hall,
                  warmupTime: timeDiff,
                  startTime: dateTime,
                  eventType: queryKey as EventType,
                })
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
