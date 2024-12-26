import { TEAM_NAME } from '@/constants';

type Props = {
  isHost?: boolean;
  opponent: string;
  gamesHost?: string;
  gamesGuest?: string;
};

const MatchTitle = ({ isHost, opponent, gamesHost, gamesGuest }: Props) => {
  const win = (isHost && gamesHost === '3') || (!isHost && gamesGuest === '3');
  const lose = (isHost && gamesHost && gamesGuest === '3') || (!isHost && gamesGuest && gamesHost === '3');
  if (!gamesHost && !gamesGuest) {
    return isHost ? `${TEAM_NAME} vs ${opponent}` : `${opponent} vs ${TEAM_NAME}`;
  }
  if (win) {
    return isHost ? (
      <>
        {TEAM_NAME} <span className="text-green-600">3:{gamesGuest ?? '???'}</span> {opponent}
      </>
    ) : (
      <>
        {opponent} <span className="text-green-600">{gamesHost ?? '???'}:3</span> {TEAM_NAME}
      </>
    );
  }

  if (lose) {
    return isHost ? (
      <>
        {TEAM_NAME} <span className="text-red-600">{gamesHost ?? '?'}:3</span> {opponent}
      </>
    ) : (
      <>
        {opponent} <span className="text-red-600">3:{gamesGuest ?? '?'}</span> {TEAM_NAME}
      </>
    );
  }

  return null;
};

export { MatchTitle };
