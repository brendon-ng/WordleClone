import GameScreen from './screens/GameScreen';

import SignInScreen from './screens/SigninScreen';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from 'firebase/auth';
import { firebase_auth } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from '../secrets';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { OFFLINE_USER } from './constants/apiConstants';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from './store';

WebBrowser.maybeCompleteAuthSession();

const Application = () => {
  const dispatch = useCallback(useDispatch(), []);

  const { userInfo } = useSelector((state) => {
    return state.user;
  });
  const [loading, setLoading] = useState(true);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
  });

  const promptAsyncPlusLoading = () => {
    setLoading(true);
    promptAsync();
  };

  const useAppOffline = () => {
    setLoading(false);
    dispatch(
      setUserInfo({
        uid: OFFLINE_USER,
        email: OFFLINE_USER,
      })
    );
  };

  const checkLocalUser = useCallback(async () => {
    try {
      setLoading(true);
      const userJSON = await AsyncStorage.getItem('@user');
      const userData = userJSON ? JSON.parse(userJSON) : null;
      console.log('local storage: ', userData);
      dispatch(setUserInfo(userData));
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(firebase_auth, credential);
    } else if (response?.type === 'cancel') {
      setLoading(false);
    } else {
      setLoading(false);
      console.log('Response from login:', response);
    }
  }, [response]);

  useEffect(() => {
    checkLocalUser();
    const unsub = onAuthStateChanged(firebase_auth, async (user) => {
      if (user) {
        console.log(JSON.stringify(user));
        dispatch(setUserInfo(user));
        await AsyncStorage.setItem('@user', JSON.stringify(user));
        setLoading(false);
      } else {
        console.log('NO USER');
        dispatch(setUserInfo(null));
      }
    });

    return () => unsub();
  }, [checkLocalUser, dispatch]);

  return loading ? (
    <LoadingScreen />
  ) : userInfo ? (
    <GameScreen />
  ) : (
    <SignInScreen
      promptAsync={promptAsyncPlusLoading}
      useOffline={useAppOffline}
    />
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

export default Application;
