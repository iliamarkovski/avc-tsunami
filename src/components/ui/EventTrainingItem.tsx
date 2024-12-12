import { CardDescription, CardTitle, EventItem } from '@/components';

type Props = {
  id: string;
  hall: string;
  date: string;
  time: string;
  isCurrent?: boolean;
};

const COLLECTION = 'trainings';

const EventTrainingItem = ({ hall, date, time, id, isCurrent }: Props) => {
  return (
    <EventItem eventId={id} collection={COLLECTION} isCurrent={isCurrent}>
      <CardDescription>
        {date} | {time}
      </CardDescription>
      <CardTitle>Тренировка</CardTitle>
      <CardDescription>зала {hall}</CardDescription>
    </EventItem>
  );
};

export { EventTrainingItem };
