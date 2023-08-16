import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';

// Custom component Button to keep consistent styling
function BigButton({ onPress, title, loading, children, ...rest }) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={loading}
      {...rest}
    >
      {loading && <ActivityIndicator />}
      {!loading && title && <Text style={styles.title}>{title}</Text>}
      {!loading && children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginVertical: 10,
    aspectRatio: 5,
    borderRadius: 10,
    backgroundColor: '#DDDDDD',
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default BigButton;
