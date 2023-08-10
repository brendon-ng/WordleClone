import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  Image,
} from 'react-native';
import { COLOR_CORRECT } from '../constants/gameConstants';

export default function SignInScreen({ promptAsync, useOffline }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>WORDLE</Text>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Sign In With Google</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
        <Image
          style={styles.logo}
          source={{
            uri: 'https://www.transparentpng.com/thumb/google-logo/google-logo-png-icon-free-download-SUF63j.png',
          }}
        />
        <Text style={styles.signin}>Sign In</Text>
      </TouchableOpacity>
      <View style={styles.offline}>
        <Button
          title="Play Offline"
          style={styles.offline}
          onPress={useOffline}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    margin: 75,
    color: COLOR_CORRECT,
  },
  labelContainer: {
    margin: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    aspectRatio: 5,
    borderRadius: 10,
    backgroundColor: 'lightgrey',
  },
  logo: {
    width: 30,
    height: 30,
    position: 'absolute',
    left: 30,
  },
  signin: {
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  offline: {
    margin: 20,
    padding: 20,
  },
});
