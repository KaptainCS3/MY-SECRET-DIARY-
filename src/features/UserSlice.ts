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
    //! state handle if auth is successful return auth user
    setUser: (state, action: PayloadAction<object | null>) => {
      state.isAuthenticated = action.payload !== null;
      state.user = action.payload;
    },
  },
});

//!user instance
export const { setUser } = userSlice.actions;

export default userSlice.reducer;

//! signup with google provider handler

export const signInWithGoogle = () => async (dispatch: AppDispatch) => {
  try {
    //!Popup login
    const userCredential = await signInWithPopup(auth, googleProvider);
    //! serialize data from login response payload
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
    //!Popup login
    const userCredential = await signInWithPopup(auth, facebookProvider);
    //! serialize data from login response payload
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
