import { StyleSheet, TouchableOpacity, Text } from 'react-native';

// Custom component Button to keep consistent styling
function BigButton({ onPress, title, children, ...rest }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} {...rest}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
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
