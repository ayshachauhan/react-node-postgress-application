import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { indexBy } from '@root/utils/index';
import {
  addUser,
  changePassword,
  deleteUser,
  getUserInfo,
  getUsers,
  updateUser,
} from '../requests/users';
import { EntityLoadingState, UserState } from '../types';

const initialState: UserState = {
  processing: false,
  entities: {},
  userInfo: null,
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSuccessMessage(state) {
      state.successMessage = undefined;
    },
    clearErrorMessage(state) {
      state.errorMessage = undefined;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchListings.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchListings.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.entities = {};
      if (action.payload.length === 0) {
        state.errorMessage = 'Users not found';
      } else {
        state.errorMessage = undefined;
      }
      state.entities = {
        ...state.entities,
        ...indexBy('id', action.payload),
      };
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch users.';
      } else {
        state.errorMessage = 'Failed to fetch users.';
      }
      state.processing = false;
    });
    builder.addCase(fetchUserInfo.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.userInfo = action.payload;
    });

    builder.addCase(fetchUserInfo.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch user info.';
      } else {
        state.errorMessage = 'Failed to fetch user info.';
      }
    });

    builder.addCase(addRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(addRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.entities = {
        ...state.entities,
        ...{ [action.payload.id]: action.payload },
      };
      state.successMessage = 'user added successfully.';
    });

    builder.addCase(addRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to add user.';
      } else {
        state.errorMessage = 'Failed to add user.';
      }
    });

    builder.addCase(updateRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(updateRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;

      state.entities = {
        ...state.entities,
        ...{ [action.payload.id]: action.payload },
      };
      state.successMessage = 'User updated successfully.';
    });

    builder.addCase(updateRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to update user.';
      } else {
        state.errorMessage = 'Failed to update user.';
      }
    });

    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      const deletetedUserId = action?.meta?.arg?.id;
      const {
        // eslint-disable-next-line
        [deletetedUserId]: deletedUser,
        ...remainingUsers
      } = state.entities;
      state.entities = remainingUsers;
      state.successMessage = 'User deleted successfully.';
    });

    builder.addCase(deleteRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to delete user.';
      } else {
        state.errorMessage = 'Failed to delete user.';
      }
    });

    builder.addCase(changePasswordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(changePasswordAsync.fulfilled, (state) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.successMessage = 'Password changed successfully.';
    });

    builder.addCase(changePasswordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to change password.';
      } else {
        state.errorMessage = 'Failed to change password.';
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

export const changePasswordAsync = createAsyncThunk(
  'users/changePasswordAsync',
  changePassword,
);

export default userSlice.reducer;
