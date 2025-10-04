import { MatchForm, FormCard, Matches } from '@/components';
import { useLiveData } from '@/hooks/useLiveData';
import { getDataById } from '@/lib';
import { QueryKeys } from '@/types';
import { Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';

type Props = {
  queryKey: QueryKeys;
  title: string;
  description: string;
  parentUrl: string;
};

const EditMatchPage = ({ queryKey, title, description, parentUrl }: Props) => {
  const { id } = useParams();

  const { data: matches, loading: matchesLoading } = useLiveData<Matches[]>(queryKey);
  const event = getDataById<Matches>(matches, id);

  if (matchesLoading) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <FormCard title={title} description={description}>
      <MatchForm
        dateTime={event?.dateTime}
        gamesGuest={event?.gamesGuest}
        gamesHost={event?.gamesHost}
        hall={event?.hall}
        host={event?.host}
        message={event?.message}
        opponent={event?.opponent}
        recordingLink={event?.recordingLink}
        id={id}
        parentUrl={parentUrl}
        queryKey={queryKey}
        statisticsDocUrl={event?.statisticsDocUrl}
      />
    </FormCard>
  );
};

export { EditMatchPage };
