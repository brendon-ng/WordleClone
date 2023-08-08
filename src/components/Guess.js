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
  if (!guessedWord || !complete) {
    squares.fill(COLOR_UNGUESSED);
  } else {
    let _targetWord = [...targetWord];
    let _guessedWord = [...guessedWord];
    for (let i = 0; i < MAX_WORD_LENGTH; i++) {
      if (_targetWord[i] === _guessedWord[i]) {
        squares[i] = COLOR_CORRECT;
        dispatch(
          changeKeyColor({ letter: _guessedWord[i], color: COLOR_CORRECT })
        );
        _targetWord[i] = '_';
        _guessedWord[i] = '_';
      }
    }
    for (let i = 0; i < MAX_WORD_LENGTH; i++) {
      if (_guessedWord[i] === '_') {
        continue;
      }
      const index = _targetWord.indexOf(_guessedWord[i]);
      if (index >= 0) {
        squares[i] = COLOR_POSITION;
        dispatch(
          changeKeyColor({ letter: _guessedWord[i], color: COLOR_POSITION })
        );
        _guessedWord[i] = '_';
        _targetWord[index] = '_';
      } else {
        squares[i] = COLOR_WRONG;
        dispatch(
          changeKeyColor({ letter: _guessedWord[i], color: COLOR_WRONG })
        );
      }
    }
  }

  squares = squares.map((col, i) => {
    const color = invalid ? 'red' : (complete ? 'white' : 'black');
    return (
      <View key={i} style={[styles.square, { backgroundColor: col }]}>
        <Text
          style={[
            styles.letter,
            { color },
          ]}
        >
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
