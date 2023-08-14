import { MAX_GUESSES } from './gameConstants';

export const WIN = 'win';
export const LOSS = 'loss';
export const NEW = 'new';

export const INITIAL_SCORES_RECORD = (initStatus, guesses) => {
  if (initStatus !== WIN && initStatus !== LOSS && initStatus !== NEW) {
    console.log('Invalid Initialization status for initial scores record');
    return null;
  }
  return {
    gamesPlayed: initStatus === WIN || initStatus === LOSS ? 1 : 0,
    gamesWon: initStatus === WIN ? 1 : 0,
    curStreak: initStatus === WIN ? 1 : 0,
    largestStreak: initStatus === WIN ? 1 : 0,
    guessDist: Array.from({ length: MAX_GUESSES }, (e, i) =>
      guesses && i === guesses - 1 ? 1 : 0
    ),
  };
};
