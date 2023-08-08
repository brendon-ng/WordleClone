import { StyleSheet, Text, View } from 'react-native';
import Key from './Key';

function Keyboard() {
  const row1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const row3 = [
    { letter: 'ENTER', w: 2 },
    { letter: 'Z' },
    { letter: 'X' },
    { letter: 'C' },
    { letter: 'V' },
    { letter: 'B' },
    { letter: 'N' },
    { letter: 'M' },
    { letter: 'DEL', w: 2 },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {row1.map((letter) => (
          <Key key={letter} letter={letter} />
        ))}
      </View>
      <View style={styles.row}>
        {row2.map((letter) => (
          <Key key={letter} letter={letter} />
        ))}
      </View>
      <View style={styles.row}>
        {row3.map((entry) => (
          <Key
            key={entry.letter}
            letter={entry.letter}
            widthMultiplier={entry.w}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    borderWidth: 0,
    borderColor: 'cyan',
  },
  row: {
    height: '25%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Keyboard;
