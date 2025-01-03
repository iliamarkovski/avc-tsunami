import { EventItem } from '@/components';
import { QUERY_KEYS } from '@/constants';

type Props = {
  id: string;
  hall: string;
  dateTime: Date;
  isCurrent?: boolean;
  badge?: string;
};

const EventTrainingItem = ({ hall, dateTime, id, isCurrent, badge }: Props) => {
  return (
    <EventItem
      eventId={id}
      queryKey={QUERY_KEYS.TRAINING}
      isCurrent={isCurrent}
      title="Тренировка"
      hall={hall}
      dateTime={dateTime}
      badge={badge}
    />
  );
};

export { EventTrainingItem };
