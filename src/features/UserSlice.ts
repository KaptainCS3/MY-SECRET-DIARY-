import {auth, googleProvider, facebookProvider} from '../utils/firebase'
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {signInWithPopup} from "firebase/auth"
import { AppDispatch } from '../app/store';

interface UserState {
  isAuthenticated: boolean;
  user: object | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<object | null>) => {
      state.isAuthenticated = action.payload !== null;
      state.user = action.payload;
    },
  },
});


export const { setUser } = userSlice.actions;

export default userSlice.reducer;

//! signup with google provider handler

export const signInWithGoogle = () => async (dispatch: AppDispatch) => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const data = userCredential.user.toJSON()
    // dispatch(setUser(JSON.stringify(userCredential.user.uid)));
    dispatch(setUser(data));
  } catch (error) {
    console.error(error);
  }
};

//! signup with Facebook provider handler

export const signInWithFacebook = () => async (dispatch: AppDispatch) => {
  try {
    const userCredential = await signInWithPopup(auth, facebookProvider);
    const data = userCredential.user.toJSON()
    dispatch(setUser(data));
    // dispatch(setUser(JSON.stringify(userCredential.user.uid)));
  } catch (error) {
    console.error(error);
  }
};

//! facebook and google logout handler 

export const logoutAll = () => async (dispatch: AppDispatch) => {
  try {
    await auth.signOut();
    dispatch(setUser(null));
  } catch (error) {
    console.error(error);
  }
};
