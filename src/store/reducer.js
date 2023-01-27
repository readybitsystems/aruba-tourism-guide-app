import { createSlice } from "@reduxjs/toolkit";

export const myReducer = createSlice({
  name: "storeReducer",
  initialState: {
    isLogged: false,
    token: null,
    popUp: {
      open: false,
      message: '',
    },
    isNetAvailable: false,
    hasPermission: true,
  },

  reducers: {
    logInUser: (state,{payload}) => {
      state.isLogged = true;
      state.token = payload;
    },
    logOutUser: (state) => {
      state.isLogged = false;
      state.token = null;
    },
    openPopUp: (state, { payload }) => {
      state.popUp = {
        open: true,
        message: payload,
      }
    },
    closePopUp: (state) => {
      state.popUp = {
        open: false,
        message: '',
      }
    },
    netStatus: (state, { payload }) => {
      state.isNetAvailable = payload;
    },
    checkPermission: (state, { payload }) => {
      state.hasPermission = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  logOutUser,
  logInUser,
  openPopUp,
  closePopUp,
  netStatus,
  checkPermission,
} =
  myReducer.actions;

export default myReducer.reducer;
