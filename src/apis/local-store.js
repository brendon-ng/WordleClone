import AsyncStorage from '@react-native-async-storage/async-storage';
import { MAX_GUESSES } from '../constants/gameConstants';

export const addWinLocal = (numGuesses) => {
  AsyncStorage.getItem('@scores').then((scoresJSON) => {
    if (scoresJSON) {
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
      const scoresData = {
        gamesPlayed: 1,
        gamesWon: 1,
        curStreak: 1,
        largestStreak: 1,
        guessDist: Array.from({ length: MAX_GUESSES }, (e, i) =>
          i === numGuesses - 1 ? 1 : 0
        ),
      };
      AsyncStorage.setItem('@scores', JSON.stringify(scoresData)).then(
        console.log('Initialized Local Storage scores with a win')
      );
    }
  });
};

export const addLossLocal = () => {
  AsyncStorage.getItem('@scores').then((scoresJSON) => {
    if (scoresJSON) {
      const scoresData = JSON.parse(scoresJSON);
      scoresData.gamesPlayed = scoresData.gamesPlayed + 1;
      scoresData.curStreak = 0;
      AsyncStorage.setItem('@scores', JSON.stringify(scoresData)).then(
        console.log('added loss to local storage')
      );
    } else {
      const scoresData = {
        gamesPlayed: 1,
        gamesWon: 0,
        curStreak: 0,
        largestStreak: 0,
        guessDist: Array.from({ length: MAX_GUESSES }, () => 0),
      };
      AsyncStorage.setItem('@scores', JSON.stringify(scoresData)).then(
        console.log('Initialized Local Storage scores with a loss')
      );
    }
  });
};
