import { configureStore } from '@reduxjs/toolkit';
import { wordApi } from './apis/wordApi';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { scoresReducer, addWin, addLoss } from './slices/scoresSlice';
import { keyboardReducer, changeKeyColor } from './slices/keyboardSlice';
import { guessesReducer, typeIntoCurrentGuess, deleteFromCurrentGuess, submitGuess, resetGuesses } from './slices/guessesSlice';

export const store = configureStore({
  reducer: {
    [wordApi.reducerPath]: wordApi.reducer,
    scores: scoresReducer,
    keyboard: keyboardReducer,
    guesses: guessesReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(wordApi.middleware);
  },
});

setupListeners(store.dispatch);

export { useFetchWordQuery } from './apis/wordApi';
export { changeKeyColor, typeIntoCurrentGuess, deleteFromCurrentGuess, submitGuess, resetGuesses, addWin, addLoss };
