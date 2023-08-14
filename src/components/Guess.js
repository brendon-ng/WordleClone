import { View, StyleSheet, Text } from 'react-native';
import { MAX_WORD_LENGTH } from '../constants/gameConstants';
import {
  COLOR_CORRECT,
  COLOR_POSITION,
  COLOR_UNGUESSED,
  COLOR_WRONG,
} from '../constants/gameConstants';
import { useDispatch } from 'react-redux';
import { changeKeyColor } from '../store';

function Guess({ targetWord, guessedWord, complete, invalid }) {
  const dispatch = useDispatch();

  let squares = new Array(MAX_WORD_LENGTH);

  // Initialze squares array with the colors for each square
  if (!guessedWord || !complete) {
    // If this row is for an ongoing guess or a guess row not reached yet, assign all to neutral
    squares.fill(COLOR_UNGUESSED);
  } else {
    let _targetWord = [...targetWord];
    let _guessedWord = [...guessedWord];
    // First pass: mark all correct letters with 'correct' color
    for (let i = 0; i < MAX_WORD_LENGTH; i++) {
      if (_targetWord[i] === _guessedWord[i]) {
        squares[i] = COLOR_CORRECT;
        // Tell Keyboard to change the key color of this letter
        dispatch(
          changeKeyColor({ letter: _guessedWord[i], color: COLOR_CORRECT })
        );
        // Need to replace correct letter in target and guessed words
        // If guessed word has a duplicate letter it should not be Yellow unless there is a duplicate letter in the target word which will still exist.
        _targetWord[i] = '_';
        _guessedWord[i] = '_';
      }
    }
    // Second pass: mark all incorrectly positioned letters with 'position' color by checking for existence in target word
    for (let i = 0; i < MAX_WORD_LENGTH; i++) {
      // Ignore already marked (correct) letters
      if (_guessedWord[i] === '_') {
        continue;
      }
      const index = _targetWord.indexOf(_guessedWord[i]);
      if (index >= 0) {
        // Guessed letter exists in target word
        squares[i] = COLOR_POSITION;
        // Tell Keyboard to change the key color of this letter
        dispatch(
          changeKeyColor({ letter: _guessedWord[i], color: COLOR_POSITION })
        );
        // Need to replace the corresponding letters in target and guessed words for one-to-one correspondence of guessed letters to target letters
        _guessedWord[i] = '_';
        _targetWord[index] = '_';
      } else {
        // Guessed letter not in target word - mark as incorrect
        squares[i] = COLOR_WRONG;
        dispatch(
          changeKeyColor({ letter: _guessedWord[i], color: COLOR_WRONG })
        );
      }
    }
  }

  // Translate the letter colors to actual components with the right color and letter
  squares = squares.map((col, i) => {
    // If the current guess is not a word, turn the font red
    const color = invalid ? 'red' : complete ? 'white' : 'black';
    return (
      <View key={i} style={[styles.square, { backgroundColor: col }]}>
        <Text style={[styles.letter, { color }]}>
          {guessedWord && guessedWord[i] && guessedWord[i].toUpperCase()}
        </Text>
      </View>
    );
  });

  return <View style={styles.guessContainer}>{squares}</View>;
}

const styles = StyleSheet.create({
  guessContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'yellow',
  },
  square: {
    width: '19%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  letter: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'top',
    color: 'white',
  },
});

export default Guess;
