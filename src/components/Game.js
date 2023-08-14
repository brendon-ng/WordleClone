import { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Guess from './Guess';
import { MAX_GUESSES } from '../constants/gameConstants';
import generateTargetWord from '../utils/generateWord';
import { useDispatch, useSelector } from 'react-redux';
import { resetGuesses } from '../store';
import { OFFLINE_USER } from '../constants/apiConstants';
import { addLossFB, addWinFB } from '../apis/firebase-store';
import { addLossLocal, addWinLocal } from '../apis/local-store';

const STATUS_ONGOING = 'ongoing';
const STATUS_LOSS = 'loss';
const STATUS_WIN = 'win';

function Game() {
  const dispatch = useDispatch();

  // States
  const [targetWord, setTargetWord] = useState(generateTargetWord());
  const [gameStatus, setGameStatus] = useState(STATUS_ONGOING);
  const { userInfo } = useSelector((state) => state.user);
  const { currentGuess, guesses, validGuess } = useSelector(
    (state) => state.guesses
  );

  const addWin = useCallback(
    async (numGuesses) => {
      // If playing offline, store scores in local async storage
      // If logged in, store scores in Firebase
      if (userInfo.uid === OFFLINE_USER) {
        addWinLocal(numGuesses);
      } else {
        addWinFB(userInfo, numGuesses);
      }
    },
    [userInfo]
  );

  const addLoss = useCallback(async () => {
    // If playing offline, store scores in local async storage
    // If logged in, store scores in Firebase
    if (userInfo.uid === OFFLINE_USER) {
      addLossLocal();
    } else {
      addLossFB(userInfo);
    }
  }, [userInfo]);

  // Triggers when guesses is updated, checks for a win or a loss
  useEffect(() => {
    if (guesses[guesses.length - 1] === targetWord) {
      // Win
      setGameStatus(STATUS_WIN);
      addWin(guesses.length);
    } else if (guesses.length === MAX_GUESSES) {
      // Loss
      setGameStatus(STATUS_LOSS);
      addLoss();
    }
  }, [guesses, addLoss, addWin, targetWord]);

  // Handle New Game button press
  const newGame = () => {
    dispatch(resetGuesses());
    setGameStatus(STATUS_ONGOING);
    setTargetWord(generateTargetWord());
  };

  return (
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
