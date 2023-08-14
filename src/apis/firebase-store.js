import { doc, getDoc, setDoc, runTransaction } from 'firebase/firestore';
import { firestore_db } from '../../firebaseConfig';
import { MAX_GUESSES } from '../constants/gameConstants';

export const addWinFB = async (userInfo, numGuesses) => {
  const ref = doc(firestore_db, 'scores', userInfo.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    setDoc(doc(firestore_db, 'scores', userInfo.uid), {
      gamesPlayed: 1,
      gamesWon: 1,
      curStreak: 1,
      largestStreak: 1,
      guessDist: Array.from({ length: MAX_GUESSES }, (e, i) =>
        i === numGuesses - 1 ? 1 : 0
      ),
    });
    console.log('Doc Created');
  } else {
    try {
      await runTransaction(firestore_db, async (transaction) => {
        const scoreDoc = await transaction.get(ref);
        if (!scoreDoc.exists()) {
          console.log('ERROR: Scores document does not exit for this user');
        }
        const newGamesPlayed = scoreDoc.data().gamesPlayed + 1;
        const newWins = scoreDoc.data().gamesWon + 1;
        const newCurStreak = scoreDoc.data().curStreak + 1;
        const newLargestStreak =
          newCurStreak > scoreDoc.data().largestStreak
            ? newCurStreak
            : scoreDoc.data().largestStreak;
        let newGuessDist = [...scoreDoc.data().guessDist];
        newGuessDist[numGuesses - 1] = newGuessDist[numGuesses - 1] + 1;
        transaction.update(ref, {
          gamesPlayed: newGamesPlayed,
          gamesWon: newWins,
          curStreak: newCurStreak,
          largestStreak: newLargestStreak,
          guessDist: newGuessDist,
        });
      });
      console.log('Transaction committed');
    } catch (e) {
      console.log('Transaction failed:', e);
    }
  }
};

export const addLossFB = async (userInfo) => {
  const ref = doc(firestore_db, 'scores', userInfo.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    setDoc(doc(firestore_db, 'scores', userInfo.uid), {
      gamesPlayed: 1,
      gamesWon: 0,
      curStreak: 0,
      largestStreak: 0,
      guessDist: Array.from({ length: MAX_GUESSES }, () => 0),
    });
    console.log('Doc Created');
  } else {
    try {
      await runTransaction(firestore_db, async (transaction) => {
        const scoreDoc = await transaction.get(ref);
        if (!scoreDoc.exists()) {
          console.log('ERROR: Scores document does not exit for this user');
        }
        const newGamesPlayed = scoreDoc.data().gamesPlayed + 1;
        transaction.update(ref, {
          gamesPlayed: newGamesPlayed,
          curStreak: 0,
        });
      });
      console.log('Transaction committed');
    } catch (e) {
      console.log('Transaction failed:', e);
    }
  }
};
