import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: { 
    token: null, 
    name: null, 
    firstname: null,
    email: null, 
    searches : [],
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userInfo: (state, action) => {
      state.value.token = action.payload.token;
      state.value.firstname = action.payload.firstname;
      state.value.name = action.payload.name;
      state.value.email = action.payload.email
      // state.value = { ...state.value, ...action.payload }; 
    },
    logout: (state) => {
      state.value.token = null;
      state.value.firstname = null;
      state.value.name = null;
      state.value.email = null
    },
    addIdOfASearch : (state, action)=>{
      state.value.searches.push(action.payload)
    }
  },
});

export const { userInfo, logout, addIdOfASearch } = userSlice.actions;
export default userSlice.reducer;