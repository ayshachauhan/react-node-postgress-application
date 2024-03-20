import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '@root/components/users/types';
import { State } from '@root/store';
import {
  addUser,
  deleteUser,
  getUserInfo,
  getUsers,
  updateUser,
} from '../requests/users';

export interface UserState {
  isProcessing: boolean;
  entities: Record<string, User>;
  users: User[];
  userInfo: User;
  status: 'idle' | 'loading' | 'failed';
  successMessage: string | null;
  error: string | null;
}

const initialState: UserState = {
  isProcessing: false,
  entities: {},
  users: [],
  userInfo: {},
  status: 'idle',
  successMessage: null, // Initial value for success message
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
    clearErrorMessage(state) {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchListings.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(fetchListings.fulfilled, (state, action) => {
      state.status = 'idle';
      state.users = action.payload;
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to fetch users';
      } else {
        state.error = 'Failed to fetch users';
      }
    });
    builder.addCase(fetchUserInfo.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.status = 'idle';
      state.userInfo = action.payload;
    });

    builder.addCase(fetchUserInfo.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to fetch user info';
      } else {
        state.error = 'Failed to fetch user info';
      }
    });

    builder.addCase(addRecordAsync.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(addRecordAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.users = [...state.users, action.payload];
      state.successMessage = 'Record added successfully'; // Set success message
    });

    builder.addCase(addRecordAsync.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to add user';
      } else {
        state.error = 'Failed to add user';
      }
    });

    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      state.users = state.users.filter((user) => user.id !== action.payload.id);
      state.successMessage = 'Record deleted successfully'; // Set success message
    });

    builder.addCase(deleteRecordAsync.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to delete user';
      } else {
        state.error = 'Failed to delete user';
      }
    });
  },
});
export const { clearSuccessMessage, clearErrorMessage } = userSlice.actions;

export const fetchListings = createAsyncThunk('users/fetchListings', getUsers);

export const fetchUserInfo = createAsyncThunk(
  'users/fetchUserInfo',
  getUserInfo,
);

export const addRecordAsync = createAsyncThunk('users/addRecordAsync', addUser);

export const deleteRecordAsync = createAsyncThunk(
  'users/deleteRecordAsync',
  deleteUser,
);

export const updateRecordAsync = createAsyncThunk(
  'users/updateRecordAsync',
  updateUser,
);

export const selectRecords = (state: State) => state.users;
export const selectStatus = (state: State) => state.users.status;
export const selectError = (state: State) => state.users.error;
export const selectSuccessMessage = (state: State) =>
  state.users.successMessage; // Export selectSuccessMessage selector
export default userSlice.reducer;
