import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInterface } from '@root/components/login/types';
import Cookies from 'js-cookie';
import { login } from '../requests/login';

// todo add api call and move type to appropriate folder
const getMe = async () => {
  return {} as UserInterface;
};

export interface AuthState {
  isAuthenticated: boolean;
  user: UserInterface[] | null;
  isProcessing: boolean;
  entities: Record<string, UserInterface>;
  status: 'idle' | 'loading' | 'failed';
  successMessage: string | null;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isProcessing: false,
  entities: {},
  status: 'idle',
  successMessage: null, // Initial value for success message
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserInterface>) {
      state.user = action.payload;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    clearErrorMessage(state) {
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
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
      state.user = action.payload;
      state.successMessage = 'User logged in successfully'; // Set success message
      Cookies.set('access_token', state.user.access_token, { expires: 1 });
      state.error = null;
    });

    builder.addCase(loginUser.rejected, (state, action) => {
      state.status = 'failed';
      state.isAuthenticated = false;
      state.error = action.payload as string;
    });
  },
});

export const { setUserInfo, clearSuccessMessage, clearErrorMessage } =
  authSlice.actions;

export const fetchLoggedInUser = createAsyncThunk(
  'users/fetchLoggedInUser',
  getMe,
);

export const loginUser = createAsyncThunk('auth/loginUser', login);

export const selectRecords = (state) => state.auth.user;
export const selectStatus = (state) => state.status;
export const selectError = (state) => state.auth.error;
export const selectSuccessMessage = (state) => state.user.successMessage; // Export selectSuccessMessage selecto

export default authSlice.reducer;
