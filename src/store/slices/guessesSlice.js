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
      // Assumes action.payload is a string of the singular letter typed
      if (state.currentGuess.length < MAX_WORD_LENGTH) {
        // If we have room to type, update the guess
        state.currentGuess = state.currentGuess + action.payload;
        state.validGuess = true;
      }
    },
    deleteFromCurrentGuess(state) {
      state.currentGuess = state.currentGuess.slice(0, -1);
      state.validGuess = true; // Remove red color from current guess if invalid
    },
    submitGuess(state) {
      if (state.currentGuess.length === MAX_WORD_LENGTH) {
        // If the guess is submittable (complete word) check if it is valid word
        if (checkWord(state.currentGuess)) {
          // Update guesses
          state.guesses.push(state.currentGuess);
          state.currentGuess = '';
          state.validGuess = true; // causes text to turn red
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
