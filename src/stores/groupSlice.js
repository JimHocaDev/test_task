// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  group: {},
  loading: true,
  error: null,
};

const groupSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setGroupData: (state, action) => {
      console.log(action ,"action");
      state.group = action.payload;
      state.loading = false;
      state.error = null;
    },
   
  },
});

export const { setGroupData} = groupSlice.actions;

export default groupSlice.reducer;