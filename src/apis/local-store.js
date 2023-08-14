import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  INITIAL_SCORES_RECORD,
  LOSS,
  NEW,
  WIN,
} from '../constants/scoreConstants';

// Record win in local async storage.
export const addWinLocal = (numGuesses) => {
  AsyncStorage.getItem('@scores').then((scoresJSON) => {
    if (scoresJSON) {
      // If an existing scores record is found in local async storage
      const scoresData = JSON.parse(scoresJSON);
      scoresData.gamesPlayed = scoresData.gamesPlayed + 1;
      scoresData.gamesWon = scoresData.gamesWon + 1;
      const newStreak = scoresData.curStreak + 1;
      scoresData.curStreak = newStreak;
      scoresData.largestStreak =
        newStreak > scoresData.largestStreak
          ? newStreak
          : scoresData.largestStreak;
      let newGuessDist = [...scoresData.guessDist];
      newGuessDist[numGuesses - 1] = newGuessDist[numGuesses - 1] + 1;
      scoresData.guessDist = newGuessDist;
      AsyncStorage.setItem('@scores', JSON.stringify(scoresData)).then(
        console.log('added win to local storage')
      );
    } else {
      // If no scores record is found in local async storage, initialize it
      const scoresData = INITIAL_SCORES_RECORD(WIN, numGuesses);
      AsyncStorage.setItem('@scores', JSON.stringify(scoresData)).then(
        console.log('Initialized Local Storage scores with a win')
      );
    }
  });
};

// Record loss in local async storage.
export const addLossLocal = () => {
  AsyncStorage.getItem('@scores').then((scoresJSON) => {
    // If an existing scores record is found in local async storage
    if (scoresJSON) {
      const scoresData = JSON.parse(scoresJSON);
      scoresData.gamesPlayed = scoresData.gamesPlayed + 1;
      scoresData.curStreak = 0;
      AsyncStorage.setItem('@scores', JSON.stringify(scoresData)).then(
        console.log('added loss to local storage')
      );
    } else {
      // If no scores record is found in local async storage, initialize it
      const scoresData = INITIAL_SCORES_RECORD(LOSS);
      AsyncStorage.setItem('@scores', JSON.stringify(scoresData)).then(
        console.log('Initialized Local Storage scores with a loss')
      );
    }
  });
};

// Get scores from local async storage.
export const getScoresLocal = async () => {
  const scoresJSON = await AsyncStorage.getItem('@scores');
  if (scoresJSON) {
    // If an existing local async storage scores record is found
    return JSON.parse(scoresJSON);
  } else {
    // No local record found, initialize it to zeros
    const scoresData = INITIAL_SCORES_RECORD(NEW);
    await AsyncStorage.setItem('@scores', JSON.stringify(scoresData));
    return scoresData;
  }
};
