import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { keyboardReducer, changeKeyColor } from './slices/keyboardSlice';
import {
  guessesReducer,
  typeIntoCurrentGuess,
  deleteFromCurrentGuess,
  submitGuess,
  resetGuesses,
} from './slices/guessesSlice';
import { userReducer, setUserInfo } from './slices/userSlice';

export const store = configureStore({
  reducer: {
    keyboard: keyboardReducer,
    guesses: guessesReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

setupListeners(store.dispatch);

export {
  changeKeyColor,
  typeIntoCurrentGuess,
  deleteFromCurrentGuess,
  submitGuess,
  resetGuesses,
  setUserInfo,
};
