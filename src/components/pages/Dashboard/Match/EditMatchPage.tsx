import { MatchForm, FormCard, Matches } from '@/components';
import { useData } from '@/contexts';
import { getDataById } from '@/lib';
import { QueryKeys } from '@/types';
import { useParams } from 'react-router-dom';

type Props = {
  queryKey: QueryKeys;
  title: string;
  description: string;
  parentUrl: string;
};

const EditMatchPage = ({ queryKey, title, description, parentUrl }: Props) => {
  const { id } = useParams();

  const { data } = useData();
  const event = getDataById<Matches>(data[queryKey] as Matches[], id);

  if (!event) {
    return <p>Not Found</p>;
  }

  return (
    <FormCard title={title} description={description}>
      <MatchForm
        dateTime={event.dateTime}
        gamesGuest={event.gamesGuest}
        gamesHost={event.gamesHost}
        hall={event.hall}
        host={event.host}
        message={event.message}
        opponent={event.opponent}
        recordingLink={event.recordingLink}
        id={id}
        parentUrl={parentUrl}
        queryKey={queryKey}
        statisticsDocUrl={event.statisticsDocUrl}
      />
    </FormCard>
  );
};

export { EditMatchPage };
