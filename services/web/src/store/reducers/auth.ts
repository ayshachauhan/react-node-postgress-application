import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { State } from '@root/store';
import { getPracticeId } from '../../utils/index';
import {
  getMe,
  login,
  removeLoginToken,
  sendResetMail,
  setLoginCookie,
} from '../requests/login';
import { uploadImg } from '../requests/users';
import { AuthState, EntityLoadingState } from '../types';

const initialState: AuthState = {
  isAuthenticated: false,
  processing: false,
  user: null,
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
  isSuperAdmin: false,
  azentiaSelectedPractice: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearSuccessMessage(state) {
      state.successMessage = '';
    },
    clearErrorMessage(state) {
      state.errorMessage = '';
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isSuperAdmin = false;
      removeLoginToken();
      localStorage.removeItem('practiceId');
    },
  },
  extraReducers(builder) {
    builder.addCase(loginUser.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
      state.errorMessage = undefined;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status = EntityLoadingState.IDLE;
      state.isAuthenticated = true;
      state.successMessage = 'User logged in successfully.';
      if (action.payload) {
        setLoginCookie(action.payload.access_token);
        state.isSuperAdmin = action.payload.is_super_admin;
      }
      state.errorMessage = undefined;
    });

    builder.addCase(loginUser.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      state.isAuthenticated = false;
      state.errorMessage = action.payload as string;
      state.isSuperAdmin = false;
    });
    builder.addCase(fetchLoggedInUser.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
      state.errorMessage = undefined;
    });
    builder.addCase(fetchLoggedInUser.fulfilled, (state, action) => {
      state.status = EntityLoadingState.IDLE;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.errorMessage = undefined;
      const currentPracticeId = getPracticeId();
      const practiceIdFromState = state.user?.practices?.[0]?.id || '';

      if (!currentPracticeId || currentPracticeId === '') {
        if (practiceIdFromState) {
          localStorage.setItem('practiceId', practiceIdFromState);
        } else {
          localStorage.setItem('practiceId', '');
        }
      }
      if (state.user && state.user.practices && state.user.practices.length) {
        state.azentiaSelectedPractice = state.user.practices[0].name;
      } else {
        state.azentiaSelectedPractice = '';
      }
    });

    builder.addCase(fetchLoggedInUser.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      state.isAuthenticated = false;
      state.errorMessage = action.payload as string;
      state.isSuperAdmin = false;
    });

    builder.addCase(uploadImage.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
      state.errorMessage = undefined;
    });
    builder.addCase(uploadImage.fulfilled, (state, action) => {
      state.status = EntityLoadingState.IDLE;
      //@ts-expect-error type error due to sanitizeuser
      state.user = action.payload;
      state.errorMessage = undefined;
    });

    builder.addCase(uploadImage.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      state.errorMessage = action.payload as string;
    });

    builder.addCase(forgotPassword.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
      state.errorMessage = undefined;
      state.successMessage = undefined;
    });

    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.processing = false;
      state.status = EntityLoadingState.SUCCEEDED;
      state.errorMessage = undefined;
      state.successMessage = action.payload as string;
    });

    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.processing = false;
      state.status = EntityLoadingState.FAILED;
      state.errorMessage = action.payload as string;
      state.successMessage = undefined;
    });
  },
});

export const { clearSuccessMessage, clearErrorMessage } = authSlice.actions;

export const fetchLoggedInUser = createAsyncThunk(
  'users/fetchLoggedInUser',
  getMe,
);

export const loginUser = createAsyncThunk('auth/loginUser', login);

export const forgotPassword = createAsyncThunk(
  'users/forgotPassword',
  sendResetMail,
);

export const uploadImage = createAsyncThunk('users/uploadImage', uploadImg);

export const { logoutUser } = authSlice.actions;

export const selectRecords = (state: State) => state.auth.user;
export const isSuperAdmin = (state: State) => state.auth.isSuperAdmin;
export const selectIsAuthenticated = (state: State) =>
  state.auth.isAuthenticated;
export const selectStatus = (state: State) => state.auth.status;
export const selectError = (state: State) => state.auth.errorMessage;
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
