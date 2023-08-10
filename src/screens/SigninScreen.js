import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function SignInScreen({ promptAsync }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sign In With Google</Text>
      <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
        <Text>Sign In</Text>
      </TouchableOpacity>
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
  label: {
    marginTop: 50,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    aspectRatio: 5,
    borderRadius: 10,
    backgroundColor: 'lightgrey',
  },
});
