import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserInterface } from '@root/components/login/types';
import { State } from '@root/store';
import Cookies from 'js-cookie';
import { User, getMe, login } from '../requests/login';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isProcessing: boolean;
  entities: Record<string, UserInterface>;
  status: 'idle' | 'loading' | 'failed';
  successMessage: string | null;
  error: string | null;
  isSuperAdmin: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isProcessing: false,
  entities: {},
  status: 'idle',
  successMessage: null, // Initial value for success message
  error: null,
  isSuperAdmin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    clearErrorMessage(state) {
      state.error = null;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isSuperAdmin = false;
      Cookies.remove('access_token'); // Remove access token from cookies on logout
    },
  },
  extraReducers(builder) {
    builder.addCase(loginUser.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status = 'idle';
      state.isAuthenticated = true;
      state.successMessage = 'User logged in successfully'; // Set success message
      if (action.payload) {
        Cookies.set('access_token', action.payload.access_token, {
          expires: 1,
        });
        state.isSuperAdmin = action.payload.is_super_admin;
      }
      state.error = null;
    });

    builder.addCase(loginUser.rejected, (state, action) => {
      state.status = 'failed';
      state.isAuthenticated = false;
      state.error = action.payload as string;
      state.isSuperAdmin = false;
    });
    builder.addCase(fetchLoggedInUser.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
      state.error = null;
    });
    builder.addCase(fetchLoggedInUser.fulfilled, (state, action) => {
      state.status = 'idle';
      state.isAuthenticated = true;
      state.user = action.payload;
      state.user = action.payload;
      state.error = null;
    });

    builder.addCase(fetchLoggedInUser.rejected, (state, action) => {
      state.status = 'failed';
      state.isAuthenticated = false;
      state.error = action.payload as string;
      state.isSuperAdmin = false;
    });
  },
});

export const { clearSuccessMessage, clearErrorMessage } = authSlice.actions;

export const fetchLoggedInUser = createAsyncThunk(
  'users/fetchLoggedInUser',
  getMe,
);

export const loginUser = createAsyncThunk('auth/loginUser', login);

export const { logoutUser } = authSlice.actions;

export const selectRecords = (state: State) => state.auth.user;
export const isSuperAdmin = (state: State) => state.auth.isSuperAdmin;
export const selectIsAuthenticated = (state: State) =>
  state.auth.isAuthenticated;
export const selectStatus = (state: State) => state.auth.status;
export const selectError = (state: State) => state.auth.error;
export const selectPractice = (state: State) => {
  if (
    state.auth.user &&
    state.auth.user.userPractices.length &&
    state.auth.user.userPractices[0].practice
  ) {
    return state.auth.user.userPractices[0].practice.id;
  }
  return null;
};
export const selectSuccessMessage = (state: State) => state.auth.successMessage; // Export selectSuccessMessage selecto

export default authSlice.reducer;
