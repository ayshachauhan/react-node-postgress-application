import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserInterface } from '@root/components/login/types';
import { State } from '@root/store';
import Cookies from 'js-cookie';
import { GetUserResponse, getMe, login } from '../requests/login';

export interface AuthState {
  isAuthenticated: boolean;
  user: GetUserResponse | null;
  isProcessing: boolean;
  entities: Record<string, UserInterface>;
  status: 'idle' | 'loading' | 'failed';
  successMessage: string;
  error: string;
  isSuperAdmin: boolean;
  azentiaSelectedPractice: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isProcessing: false,
  entities: {},
  status: 'idle',
  successMessage: '',
  error: '',
  isSuperAdmin: false,
  azentiaSelectedPractice: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearSuccessMessage(state) {
      state.successMessage = '';
    },
    clearErrorMessage(state) {
      state.error = '';
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isSuperAdmin = false;
      Cookies.remove('access_token');
      localStorage.removeItem('practiceId');
    },
  },
  extraReducers(builder) {
    builder.addCase(loginUser.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
      state.error = '';
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status = 'idle';
      state.isAuthenticated = true;
      state.successMessage = 'User logged in successfully';
      if (action.payload) {
        Cookies.set('access_token', action.payload.access_token, {
          expires: 1,
        });
        state.isSuperAdmin = action.payload.is_super_admin;
      }
      state.error = '';
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
      state.error = '';
    });
    builder.addCase(fetchLoggedInUser.fulfilled, (state, action) => {
      state.status = 'idle';
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = '';
      if (
        state.user &&
        state.user.userPractices &&
        state.user.userPractices.length &&
        state.user.userPractices[0].practice
      ) {
        if (!localStorage.getItem('practiceId')) {
          localStorage.setItem(
            'practiceId',
            state.user.userPractices[0].practice.id,
          );
        }
        state.azentiaSelectedPractice =
          state.user.userPractices[0].practice.name;
      } else {
        if (!localStorage.getItem('practiceId')) {
          localStorage.setItem('practiceId', '');
        }
        state.azentiaSelectedPractice = '';
      }
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
export const selectedPracticeName = (state: State) =>
  state.auth.azentiaSelectedPractice;
export const userPractices = (state: State) => {
  if (
    state.auth.user &&
    state.auth.user.userPractices &&
    state.auth.user.userPractices.length
  ) {
    return state.auth.user.userPractices;
  }
  return [];
};
export const selectSuccessMessage = (state: State) => state.auth.successMessage;

export default authSlice.reducer;
