import { createSlice } from '@reduxjs/toolkit';
import { MAX_GUESSES } from '../../constants/gameConstants';

const scoresSlice = createSlice({
  name: 'scores',
  initialState: {
    gamesPlayed: 0,
    gamesWon: 0,
    curStreak: 0,
    largestStreak: 0,
    guessDist: Array.from({length: MAX_GUESSES}, () => 0),
  },
  reducers: {
    addWin(state, action){
      state.gamesPlayed = state.gamesPlayed + 1;
      state.gamesWon = state.gamesWon + 1;
      state.curStreak = state.curStreak + 1;
      if(state.curStreak > state.largestStreak){
        state.largestStreak = state.curStreak;
      }
      state.guessDist[action.payload.guesses - 1] = state.guessDist[action.payload.guesses - 1] + 1;
    },
    addLoss(state){
      state.gamesPlayed = state.gamesPlayed + 1;
      state.curStreak = 0;
    }
  },
});

export const { addWin, addLoss } = scoresSlice.actions;
export const scoresReducer = scoresSlice.reducer;
