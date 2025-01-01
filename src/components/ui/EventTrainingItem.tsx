import { EventItem } from '@/components';
import { QUERY_KEYS } from '@/constants';

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
      queryKey={QUERY_KEYS.TRAINING}
      isCurrent={isCurrent}
      title="Тренировка"
      hall={hall}
      date={date}
    />
  );
};

export { EventTrainingItem };
