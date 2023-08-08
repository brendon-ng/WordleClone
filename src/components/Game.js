import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Guess from './Guess';
import { MAX_GUESSES } from '../constants/gameConstants';
import generateTargetWord from '../utils/generateWord';
import { useDispatch, useSelector } from 'react-redux';
import { addLoss, addWin, resetGuesses, resetKeyboard } from '../store';

const STATUS_ONGOING = 'ongoing';
const STATUS_LOSS = 'loss';
const STATUS_WIN = 'win';

function Game(){
  const dispatch = useDispatch();

  const [targetWord, setTargetWord] = useState(generateTargetWord());
  const [gameStatus, setGameStatus] = useState(STATUS_ONGOING);

  const {currentGuess, guesses, validGuess} = useSelector((state) => {
    return state.guesses;
  });

  
  useEffect(() => {
    if(guesses[guesses.length-1] === targetWord){
      setGameStatus(STATUS_WIN);
      dispatch(addWin({guesses: guesses.length}));
    } else if (guesses.length === MAX_GUESSES) {
      setGameStatus(STATUS_LOSS);
      dispatch(addLoss());
    }
  }, [guesses]);
  

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
          guessedWord={guesses[i] || (i===guesses.length && currentGuess)}
          complete={(guesses[i])}
          invalid={i===guesses.length && !validGuess}
          key={i}
        />
      ))}
      {gameStatus===STATUS_LOSS && (
        <View style={styles.answer}>
          <Text style={styles.answerText}>{targetWord}</Text>
        </View>
      )}
      {gameStatus===STATUS_WIN && (
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

  return (content);
};

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
    color: 'black'
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
    color: 'white'
  },
});

export default Game;
