import {
  doc,
  getDoc,
  setDoc,
  runTransaction,
  onSnapshot,
} from 'firebase/firestore';
import { firestore_db } from '../../firebaseConfig';
import {
  INITIAL_SCORES_RECORD,
  LOSS,
  NEW,
  WIN,
} from '../constants/scoreConstants';

// Record win in firebase store for the given user.
export const addWinFB = async (userInfo, numGuesses) => {
  const ref = doc(firestore_db, 'scores', userInfo.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    // If no record of scores have been recorded for this user, initialize a document with a win
    setDoc(
      doc(firestore_db, 'scores', userInfo.uid),
      INITIAL_SCORES_RECORD(WIN, numGuesses)
    );
    console.log('Doc Created');
  } else {
    // Run Transaction to atomically update the document depending upon its previous values
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

// Record loss in firebase store for the given user.
export const addLossFB = async (userInfo) => {
  const ref = doc(firestore_db, 'scores', userInfo.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    // If no record of scores have been recorded for this user, initialize a document with a loss
    setDoc(
      doc(firestore_db, 'scores', userInfo.uid),
      INITIAL_SCORES_RECORD(LOSS)
    );
    console.log('Doc Created');
  } else {
    // Run Transaction to atomically update the document depending upon its previous values
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

// Get scores from firebase
export const getScoresFB = (
  uid,
  setGamesPlayed,
  setGamesWon,
  setCurStreak,
  setLargestStreak,
  setGuessDist
) => {
  const ref = doc(firestore_db, `scores/${uid}`);
  const subscriber = onSnapshot(ref, {
    next: (snapshot) => {
      const data = snapshot.data();
      if (data) {
        // If document is found in firebase for this uid
        setGamesPlayed(data.gamesPlayed);
        setGamesWon(data.gamesWon);
        setCurStreak(data.curStreak);
        setLargestStreak(data.largestStreak);
        setGuessDist(data.guessDist);
      } else {
        // If no document is found in firebase for this uid, initialize one
        const scoresData = INITIAL_SCORES_RECORD(NEW);
        setDoc(doc(firestore_db, 'scores', uid), scoresData);
        console.log('Doc Created');
      }
    },
  });
  return subscriber;
};
