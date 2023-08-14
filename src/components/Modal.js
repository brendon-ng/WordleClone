import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

function Modal({ closeModal, height, width, children }) {
  // If pressing modal content, do not close modal
  const handleOverlayPress = (event) => {
    event.stopPropagation();
  };

  return (
    <View style={styles.screenView} onTouchStart={closeModal}>
      <View
        style={[styles.container, { height, width }]}
        onTouchStart={handleOverlayPress}
      >
        {children}
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Ionicons name="close-outline" size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 5,
  },
});

export default Modal;
