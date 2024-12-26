import { EventItem } from '@/components';
import { TRAINING_KEY } from '@/constants';

type Props = {
  id: string;
  hall: string;
  date: Date;
  isCurrent?: boolean;
};

const EventTrainingItem = ({ hall, date, id, isCurrent }: Props) => {
  return (
    <EventItem
      eventId={id}
      collection={TRAINING_KEY}
      isCurrent={isCurrent}
      title="Тренировка"
      hall={hall}
      date={date}
    />
  );
};

export { EventTrainingItem };
