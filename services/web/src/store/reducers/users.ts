import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { State } from '@root/store';
import {
  User,
  addUser,
  deleteUser,
  getUserInfo,
  getUsers,
  updateUser,
} from '../requests/users';

type EmptyObject = Record<string, never>;

export interface UserState {
  isProcessing: boolean;
  entities: Record<string, User>;
  users: User[];
  userInfo: User | EmptyObject;
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
      if (action.payload.length === 0) {
        state.error = 'No records found';
      } else {
        state.error = '';
      }
      state.users = action.payload;
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to fetch users';
      } else {
        state.error = 'Failed to fetch users';
      }
      state.users = [];
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

    builder.addCase(updateRecordAsync.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(updateRecordAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      const updatedUser = action.payload;
      const updatedUsers = state.users.map((user) => {
        if (user.id === updatedUser.id) {
          return updatedUser; // Replace the user with updated user data
        }
        return user; // Otherwise, return the original user
      });

      state.users = updatedUsers;
      state.successMessage = 'Record updated successfully'; // Set success message
    });

    builder.addCase(updateRecordAsync.rejected, (state, action) => {
      state.status = 'failed';
      if (typeof action.payload === 'string') {
        state.error = action.payload ?? 'Failed to update user';
      } else {
        state.error = 'Failed to update user';
      }
    });

    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.isProcessing = true;
      state.status = 'loading';
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state, action) => {
      state.status = 'idle';
      const deletetedUserId = action?.meta?.arg?.id;
      state.users = state.users.filter((user) => user.id !== deletetedUserId);
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
  state.users.successMessage;
export default userSlice.reducer;
