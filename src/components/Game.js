import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Guess from './Guess';
import { MAX_GUESSES } from '../constants/gameConstants';
import generateTargetWord from '../utils/generateWord';
import { useDispatch, useSelector } from 'react-redux';
import { resetGuesses } from '../store';
import { doc, getDoc, setDoc, runTransaction } from 'firebase/firestore';
import { firestore_db } from '../../firebaseConfig';
import { OFFLINE_USER } from '../constants/apiConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATUS_ONGOING = 'ongoing';
const STATUS_LOSS = 'loss';
const STATUS_WIN = 'win';

function Game() {
  const dispatch = useDispatch();

  const [targetWord, setTargetWord] = useState(generateTargetWord());
  const [gameStatus, setGameStatus] = useState(STATUS_ONGOING);

  const { currentGuess, guesses, validGuess } = useSelector((state) => {
    return state.guesses;
  });

  const { userInfo } = useSelector((state) => state.user);
  const addWin = useCallback(
    async (guesses) => {
      if (userInfo.uid === OFFLINE_USER) {
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
            newGuessDist[guesses - 1] = newGuessDist[guesses - 1] + 1;
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
                i === guesses - 1 ? 1 : 0
              ),
            };
            AsyncStorage.setItem('@scores', JSON.stringify(scoresData)).then(
              console.log('Initialized Local Storage scores with a win')
            );
          }
        });
      } else {
        const ref = doc(firestore_db, 'scores', userInfo.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setDoc(doc(firestore_db, 'scores', userInfo.uid), {
            gamesPlayed: 1,
            gamesWon: 1,
            curStreak: 1,
            largestStreak: 1,
            guessDist: Array.from({ length: MAX_GUESSES }, (e, i) =>
              i === guesses - 1 ? 1 : 0
            ),
          });
          console.log('Doc Created');
        } else {
          try {
            await runTransaction(firestore_db, async (transaction) => {
              const scoreDoc = await transaction.get(ref);
              if (!scoreDoc.exists()) {
                console.log(
                  'ERROR: Scores document does not exit for this user'
                );
              }
              const newGamesPlayed = scoreDoc.data().gamesPlayed + 1;
              const newWins = scoreDoc.data().gamesWon + 1;
              const newCurStreak = scoreDoc.data().curStreak + 1;
              const newLargestStreak =
                newCurStreak > scoreDoc.data().largestStreak
                  ? newCurStreak
                  : scoreDoc.data().largestStreak;
              let newGuessDist = [...scoreDoc.data().guessDist];
              newGuessDist[guesses - 1] = newGuessDist[guesses - 1] + 1;
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
      }
    },
    [userInfo]
  );

  const addLoss = useCallback(async () => {
    if (userInfo.uid === OFFLINE_USER) {
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
    } else {
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
    }
  }, [userInfo]);

  useEffect(() => {
    if (guesses[guesses.length - 1] === targetWord) {
      setGameStatus(STATUS_WIN);
      addWin(guesses.length);
    } else if (guesses.length === MAX_GUESSES) {
      setGameStatus(STATUS_LOSS);
      addLoss();
    }
  }, [guesses, addLoss, addWin, targetWord]);

  const newGame = () => {
    dispatch(resetGuesses());
    setGameStatus(STATUS_ONGOING);
    setTargetWord(generateTargetWord());
  };

  const content = (
    <View style={styles.guessContainer}>
      {Array.from(Array(MAX_GUESSES)).map((el, i) => (
        <Guess
          targetWord={targetWord}
          guessedWord={guesses[i] || (i === guesses.length && currentGuess)}
          complete={guesses[i]}
          invalid={i === guesses.length && !validGuess}
          key={i}
        />
      ))}
      {gameStatus === STATUS_LOSS && (
        <View style={styles.answer}>
          <Text style={styles.answerText}>{targetWord}</Text>
        </View>
      )}
      {gameStatus === STATUS_WIN && (
        <View style={styles.answer}>
          <Text style={styles.answerText}>GREAT JOB!</Text>
        </View>
      )}
      {gameStatus !== STATUS_ONGOING && (
        <TouchableOpacity style={styles.button} onPress={newGame}>
          <Text style={styles.buttonText}>NEW GAME</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return content;
}

const styles = StyleSheet.create({
  guessContainer: {
    width: '80%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'blue',
  },
  input: {
    width: '100%',
    aspectRatio: 5,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginVertical: '2%',
    paddingHorizontal: '2%',
    textAlign: 'left',
  },
  button: {
    position: 'absolute',
    top: '-10%',
    backgroundColor: 'orange',
    width: '70%',
    aspectRatio: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'black',
  },
  answer: {
    position: 'absolute',
    top: '27%',
    backgroundColor: 'black',
    width: '50%',
    aspectRatio: 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  answerText: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Game;
