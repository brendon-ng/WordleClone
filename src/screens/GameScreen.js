import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Game from '../components/Game';
import SquareView from '../components/SquareView';
import { useState } from 'react';
import Keyboard from '../components/Keyboard';
import ScoresModal from '../components/ScoresModal';

function GameScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [parentLayout, setParentLayout] = useState({ width: 0, height: 0 });

  const handleLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setParentLayout({ width, height });
  };

  const closeModal = () => {
    setModalVisible(false);
  }

  const openModal = () => {
    setModalVisible(true);
  }

  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={styles.container} onLayout={handleLayout}>
      <SquareView
        parentLayout={parentLayout}
        maxHeightPct={60}
        style={[styles.gameContainer]}
      >
        <Game />
      </SquareView>
      <View style={styles.keyboardContainer}>
        <Keyboard />
      </View>
      <TouchableOpacity style={styles.statsButton} onPress={openModal}>
        <Ionicons name='bar-chart' size={30}/>
      </TouchableOpacity>
      {modalVisible && <TouchableOpacity style={styles.screenView} onPress={closeModal}>
        <ScoresModal closeModal={closeModal} height={screenHeight*0.75} width={screenWidth*0.80}/>
      </TouchableOpacity>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'red',
  },
  gameContainer: {
    marginTop: '5%',
    borderWidth: 0,
    borderColor: 'green',
  },
  keyboardContainer: {
    width: '95%',
    height: '25%',
    marginBottom: '5%',
    borderWidth: 0,
    borderColor: 'pink',
  },
  statsButton: {
    position: 'absolute',
    top: '6%',
    right: '10%',
    width: 50,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenView: {
    position: 'absolute',
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  }
});

export default GameScreen;
