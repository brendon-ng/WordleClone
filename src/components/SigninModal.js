import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import Modal from './Modal';
import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { firebase_auth } from '../../firebaseConfig';
import BigButton from './BigButton';
import {
  EMAIL_IN_USE,
  INVALID_EMAIL,
  INVALID_PASSWORD,
  USER_NOT_FOUND,
  WEAK_PW,
} from '../constants/apiConstants';

const MESSAGE_INVALID_PASSWORD = 'invalid-pw';
const MESSAGE_USER_NOT_FOUND = 'user-not-found';
const MESSAGE_ACCOUNT_CREATED = 'account-created';
const MESSAGE_ACCOUNT_EXISTS = 'account-exists';
const MESSAGE_INVALID_EMAIL = 'invalid-email';
const MESSAGE_MISMATCH_PW = 'mismatched-pw';
const MESSAGE_WEAK_PW = 'weak-pw';
const MESSAGE_NONE = 'none';

function SigninModal({ closeModal, height, width }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPW, setConfirmPW] = useState();
  const [create, setCreate] = useState(false);
  const [messageStatus, setMessageStatus] = useState(MESSAGE_NONE);

  const handleCreateAccount = () => {
    if (password !== confirmPW) {
      setMessageStatus(MESSAGE_MISMATCH_PW);
      return;
    }

    createUserWithEmailAndPassword(firebase_auth, email, password)
      .then((userCredential) => {
        //Signed In
        const user = userCredential.user;
        console.log('CREATED USER:', user);
        setMessageStatus(MESSAGE_ACCOUNT_CREATED);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Error creating account:', errorCode, errorMessage);
        switch (errorCode) {
          case INVALID_EMAIL:
            setMessageStatus(MESSAGE_INVALID_EMAIL);
            break;
          case WEAK_PW:
            setMessageStatus(MESSAGE_WEAK_PW);
            break;
          case EMAIL_IN_USE:
            setMessageStatus(MESSAGE_ACCOUNT_EXISTS);
            break;
          default:
            setMessageStatus(errorMessage);
            break;
        }
      });
  };

  const handleSignIn = () => {
    signInWithEmailAndPassword(firebase_auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('SIGNED IN:', user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(
          'Error signing in with email: code -',
          errorCode,
          'Message:',
          errorMessage
        );
        switch (errorCode) {
          case INVALID_EMAIL:
            setMessageStatus(MESSAGE_INVALID_EMAIL);
            break;
          case USER_NOT_FOUND:
            setMessageStatus(MESSAGE_USER_NOT_FOUND);
            break;
          case INVALID_PASSWORD:
            setMessageStatus(MESSAGE_INVALID_PASSWORD);
            break;
          default:
            setMessageStatus(errorMessage);
            break;
        }
      });
  };

  let message;
  switch (messageStatus) {
    case MESSAGE_ACCOUNT_CREATED:
      message = (
        <Text style={styles.goodMessage}>Account Successfully Created</Text>
      );
      break;
    case MESSAGE_ACCOUNT_EXISTS:
      message = (
        <Text style={styles.badMessage}>
          Account with this email already exists
        </Text>
      );
      break;
    case MESSAGE_INVALID_PASSWORD:
      message = <Text style={styles.badMessage}>Incorrect password</Text>;
      break;
    case MESSAGE_USER_NOT_FOUND:
      message = (
        <Text style={styles.badMessage}>User with this email not found</Text>
      );
      break;
    case MESSAGE_INVALID_EMAIL:
      message = <Text style={styles.badMessage}>Invalid email</Text>;
      break;
    case MESSAGE_MISMATCH_PW:
      message = <Text style={styles.badMessage}>Passwords do not match</Text>;
      break;
    case MESSAGE_WEAK_PW:
      message = <Text style={styles.badMessage}>Password too weak</Text>;
      break;
    case MESSAGE_NONE:
      message = <Text style={styles.goodMessage}> </Text>;
      break;
    default:
      message = <Text style={styles.badMessage}>messageStatus</Text>;
      break;
  }

  return (
    <Modal height={height} width={width} closeModal={closeModal}>
      <Text style={styles.title}>
        {create ? 'Create Account' : 'Sign In With Email'}
      </Text>
      <View>
        <Text style={styles.message}>{message}</Text>
      </View>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        style={styles.input}
        autoCapitalize="none"
      />
      {create && (
        <TextInput
          secureTextEntry={true}
          value={confirmPW}
          onChangeText={setConfirmPW}
          placeholder="Confirm Password"
          style={styles.input}
          autoCapitalize="none"
        />
      )}
      <BigButton
        title={create ? 'Create Account' : 'Sign In'}
        onPress={create ? handleCreateAccount : handleSignIn}
      />
      <View style={styles.createAccount}>
        <Button
          title={create ? 'Sign In With Existing Account' : 'Create Account'}
          style={styles.createAccount}
          onPress={() => {
            setCreate((cur) => !cur);
            setMessageStatus(MESSAGE_NONE);
            setEmail(null);
            setPassword(null);
            setConfirmPW(null);
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 20,
  },
  input: {
    width: '75%',
    aspectRatio: 7,
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  createAccount: {
    marginVertical: 30,
  },
  goodMessage: {
    color: 'green',
  },
  badMessage: {
    color: 'red',
  },
});

export default SigninModal;
