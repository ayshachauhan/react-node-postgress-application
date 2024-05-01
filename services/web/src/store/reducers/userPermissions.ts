import { IPermission } from '@packages/entities/index.browser';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { indexBy } from '@root/utils/index';
import { addPermission, getPermission } from '../requests/userPermissions';
import { EntityLoadingState, PermissionState } from '../types';

const initialState: PermissionState = {
  processing: false,
  entities: {},
  permissionInfo: null,
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
};

const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    addPermissionItem(state, action: PayloadAction<IPermission>) {
      state.entities = {
        ...state.entities,
        ...{ [action.payload.id]: action.payload },
      };
    },
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
        state.errorMessage = 'No records found';
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
      state.processing = false;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch videos';
      } else {
        state.errorMessage = 'Failed to fetch videos';
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
      state.successMessage = 'Record added successfully';
    });

    builder.addCase(addRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to add video';
      } else {
        state.errorMessage = 'Failed to add video';
      }
      state.processing = false;
    });
  },
});

export const { addPermissionItem, clearSuccessMessage, clearErrorMessage } =
  permissionSlice.actions;

export const fetchListings = createAsyncThunk(
  'userPermissions/fetchListings',
  getPermission,
);

export const addRecordAsync = createAsyncThunk(
  'userPermissions/addRecordAsync',
  addPermission,
);

export default permissionSlice.reducer;
