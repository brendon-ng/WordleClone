import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo(state, action) {
      // Assumes action.payload is the userInfo object
      state.userInfo = action.payload;
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export const userReducer = userSlice.reducer;
