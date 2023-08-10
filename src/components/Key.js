import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteFromCurrentGuess,
  submitGuess,
  typeIntoCurrentGuess,
} from '../store';
import { DELETE, ENTER } from '../constants/keyboardConstants';

const DEF_WIDTH = 7.5;

function Key({ letter, widthMultiplier }) {
  const dispatch = useDispatch();

  const col = useSelector((state) => {
    return state.keyboard.colors[letter];
  });

  const handlePress = () => {
    if (letter === DELETE) {
      dispatch(deleteFromCurrentGuess());
    } else if (letter === ENTER) {
      dispatch(submitGuess());
    } else {
      dispatch(typeIntoCurrentGuess(letter));
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        widthMultiplier && { width: `${DEF_WIDTH * widthMultiplier}%` },
        { backgroundColor: col },
      ]}
    >
      <Text style={styles.text}>{letter}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: `${DEF_WIDTH}%`,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '1%',
    backgroundColor: 'cyan',
    borderRadius: 5,
  },
  text: {
    fontWeight: 'bold',
  },
});

export default Key;
