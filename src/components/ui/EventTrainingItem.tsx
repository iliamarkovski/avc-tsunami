import { EventItem } from '@/components';

type Props = {
  id: string;
  hall: string;
  date: string;
  isCurrent?: boolean;
};

const COLLECTION = 'trainings';

const EventTrainingItem = ({ hall, date, id, isCurrent }: Props) => {
  return (
    <EventItem
      eventId={id}
      collection={COLLECTION}
      isCurrent={isCurrent}
      title="Тренировка"
      hall={hall}
      date={date}
      eventType="training"
    />
  );
};

export { EventTrainingItem };
