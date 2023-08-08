import { createSlice } from '@reduxjs/toolkit';
import { COLOR_CORRECT, COLOR_POSITION, COLOR_UNGUESSED, COLOR_WRONG, MAX_WORD_LENGTH } from '../../constants/gameConstants';
import { resetGuesses } from './guessesSlice';

const initialState = {
  colors: {
    A: COLOR_UNGUESSED,
    B: COLOR_UNGUESSED,
    C: COLOR_UNGUESSED,
    D: COLOR_UNGUESSED,
    E: COLOR_UNGUESSED,
    F: COLOR_UNGUESSED,
    G: COLOR_UNGUESSED,
    H: COLOR_UNGUESSED,
    I: COLOR_UNGUESSED,
    J: COLOR_UNGUESSED,
    K: COLOR_UNGUESSED,
    L: COLOR_UNGUESSED,
    M: COLOR_UNGUESSED,
    N: COLOR_UNGUESSED,
    O: COLOR_UNGUESSED,
    P: COLOR_UNGUESSED,
    Q: COLOR_UNGUESSED,
    R: COLOR_UNGUESSED,
    S: COLOR_UNGUESSED,
    T: COLOR_UNGUESSED,
    U: COLOR_UNGUESSED,
    V: COLOR_UNGUESSED,
    W: COLOR_UNGUESSED,
    X: COLOR_UNGUESSED,
    Y: COLOR_UNGUESSED,
    Z: COLOR_UNGUESSED,
    ENTER: COLOR_UNGUESSED,
    DEL: COLOR_UNGUESSED,
  }
}

const keyboardSlice = createSlice({
  name: 'keyboard',
  initialState,
  reducers: {
    changeKeyColor(state, action) {
      // assume action is an object with letter: <letter typed>, color: <color>
      if(action.payload.color === COLOR_CORRECT){
        state.colors[action.payload.letter] = action.payload.color;
      } else if(action.payload.color === COLOR_POSITION && state.colors[action.payload.letter] === COLOR_UNGUESSED){
        state.colors[action.payload.letter] = action.payload.color;
      } else if(action.payload.color === COLOR_WRONG && state.colors[action.payload.letter] === COLOR_UNGUESSED) {
        state.colors[action.payload.letter] = action.payload.color;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resetGuesses, () => initialState);
  }
});

export const { changeKeyColor } = keyboardSlice.actions;
export const keyboardReducer = keyboardSlice.reducer;
