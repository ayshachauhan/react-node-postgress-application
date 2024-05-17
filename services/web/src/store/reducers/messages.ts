import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { indexBy } from '@root/utils/index';
import {
  addMessage,
  deleteMessage,
  getMessageInfo,
  getMessages,
} from 'src/store/requests/messages';
import { EntityLoadingState, MessageState } from 'src/store/types';

const initialState: MessageState = {
  processing: false,
  entities: {},
  messageInfo: null,
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
};

const messageSlice = createSlice({
  name: 'messages',
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
      state.entities = {
        ...state.entities,
        ...indexBy('id', action.payload),
      };
    });

    builder.addCase(fetchListings.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch messages';
      } else {
        state.errorMessage = 'Failed to fetch messages';
      }
      state.processing = false;
    });
    builder.addCase(fetchMessageInfo.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchMessageInfo.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.messageInfo = action.payload;
    });

    builder.addCase(fetchMessageInfo.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch user info';
      } else {
        state.errorMessage = 'Failed to fetch message info';
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
        state.errorMessage = action.payload ?? 'Failed to add message';
      } else {
        state.errorMessage = 'Failed to add message';
      }
    });

    builder.addCase(deleteRecordAsync.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(deleteRecordAsync.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      const deleteMessageId = action?.meta?.arg?.id;
      const {
        // eslint-disable-next-line
        [deleteMessageId]: deletedMessage,
        ...remainingRecord
      } = state.entities;
      state.entities = remainingRecord;
      state.successMessage = 'Record deleted successfully';
    });

    builder.addCase(deleteRecordAsync.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to delete message';
      } else {
        state.errorMessage = 'Failed to delete message';
      }
    });
  },
});
export const { clearSuccessMessage, clearErrorMessage } = messageSlice.actions;

export const fetchListings = createAsyncThunk(
  'messages/fetchListings',
  getMessages,
);

export const fetchMessageInfo = createAsyncThunk(
  'messages/fetchMessageInfo',
  getMessageInfo,
);

export const addRecordAsync = createAsyncThunk(
  'messages/addRecordAsync',
  addMessage,
);

export const deleteRecordAsync = createAsyncThunk(
  'messages/deleteRecordAsync',
  deleteMessage,
);

export default messageSlice.reducer;
