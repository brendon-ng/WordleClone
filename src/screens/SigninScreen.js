import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Dimensions,
} from 'react-native';
import { COLOR_CORRECT } from '../constants/gameConstants';
import { useState } from 'react';
import SigninModal from '../components/SigninModal';
import BigButton from '../components/BigButton';
import { Ionicons } from '@expo/vector-icons';

export default function SignInScreen({ promptAsync, useOffline }) {
  const [modalVisible, setModalVisible] = useState(false);

  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  const closeModal = () => {
    setModalVisible(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WORDLE</Text>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Sign In</Text>
      </View>
      <BigButton title="Sign In With Email" onPress={openModal}>
        <Ionicons name='mail-outline' size={29} style={styles.logo}/>
      </BigButton>
      <BigButton title="Sign In With Google" onPress={() => promptAsync()}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/google.png')}
        />
      </BigButton>
      <View style={styles.offline}>
        <Button
          title="Play Offline"
          style={styles.offline}
          onPress={useOffline}
        />
      </View>
      {modalVisible && (
        <SigninModal
          closeModal={closeModal}
          height={screenHeight * 0.75}
          width={screenWidth * 0.8}
        />
      )}
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
    fontSize: 30,
  },
  logo: {
    width: 30,
    height: 30,
    position: 'absolute',
    left: 10,
  },
  signin: {
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  offline: {
    margin: 20,
    padding: 20,
  },
});
