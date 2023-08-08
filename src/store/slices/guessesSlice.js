import { createSlice } from '@reduxjs/toolkit';
import { MAX_WORD_LENGTH } from '../../constants/gameConstants';
import checkWord from '../../utils/checkWord';

const initialState = {
  guesses: [],
  currentGuess: '',
  validGuess: true,
};

const guessesSlice = createSlice({
  name: 'guesses',
  initialState,
  reducers: {
    typeIntoCurrentGuess(state, action) {
      if (state.currentGuess.length <= MAX_WORD_LENGTH) {
        state.currentGuess = state.currentGuess + action.payload;
        state.validGuess = true;
      }
    },
    deleteFromCurrentGuess(state) {
      state.currentGuess = state.currentGuess.slice(0, -1);
      state.validGuess = true;
    },
    submitGuess(state) {
      if (state.currentGuess.length === MAX_WORD_LENGTH) {
        if (checkWord(state.currentGuess)) {
          state.guesses.push(state.currentGuess);
          state.currentGuess = '';
          state.validGuess = true;
        } else {
          state.validGuess = false;
        }
      }
    },
    resetGuesses() {
      return initialState;
    },
  },
});

export const {
  deleteFromCurrentGuess,
  typeIntoCurrentGuess,
  submitGuess,
  resetGuesses,
} = guessesSlice.actions;
export const guessesReducer = guessesSlice.reducer;
