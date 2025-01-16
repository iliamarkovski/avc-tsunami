import { EventItem } from '@/components';
import { QUERY_KEYS } from '@/constants';

type Props = {
  id: string;
  hall: string;
  dateTime: Date;
  isCurrent?: boolean;
  badge?: string;
  message?: string;
};

const EventTrainingItem = ({ hall, dateTime, id, isCurrent, badge, message }: Props) => {
  return (
    <EventItem
      eventId={id}
      queryKey={QUERY_KEYS.TRAINING}
      isCurrent={isCurrent}
      title="Тренировка"
      hall={hall}
      dateTime={dateTime}
      badge={badge}
      message={message}
    />
  );
};

export { EventTrainingItem };
