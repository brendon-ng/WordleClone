import GameScreen from './src/screens/GameScreen';
import { Provider } from 'react-redux';
import { store } from './src/store';
import SignInScreen from './src/screens/SigninScreen';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from 'firebase/auth';
import { auth } from './firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from './secrets';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

/*
const navigator = createStackNavigator(
  {
    Game: GameScreen,
  },
  {
    initialRouteName: 'Game',
    defaultNavigationOptions: {
      title: 'WORDLE',
      headerShown: false,
    },
  }
);*/

//const AppContainer = createAppContainer(navigator);

const App = () => {
  const [userInfo, setUserInfo] = useState();
  const [loading, setLoading] = useState(true);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
  });

  const promptAsyncPlusLoading = () => {
    setLoading(true);
    promptAsync();
  };

  const checkLocalUser = async () => {
    try {
      setLoading(true);
      const userJSON = await AsyncStorage.getItem('@user');
      const userData = userJSON ? JSON.parse(userJSON) : null;
      console.log('local storage: ', userData);
      setUserInfo(userData);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  useEffect(() => {
    checkLocalUser();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(user.email);
        setUserInfo(user);
        await AsyncStorage.setItem('@user', JSON.stringify(user));
        setLoading(false);
      } else {
        console.log('NO USER');
        setUserInfo(null);
      }
    });

    return () => unsub();
  }, []);

  return (
    <Provider store={store}>
      {loading ? (
        <LoadingScreen />
      ) : userInfo ? (
        <GameScreen />
      ) : (
        <SignInScreen promptAsync={promptAsyncPlusLoading} />
      )}
    </Provider>
  );
};

const LoadingScreen = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size={'large'} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
