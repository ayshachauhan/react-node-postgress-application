import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { indexBy } from '@root/utils/index';
import { getMessageInfo, getMessages } from 'src/store/requests/messages';
import { EntityLoadingState, MessageState } from 'src/store/types';

const initialState: MessageState = {
  processing: false,
  entities: {},
  messageInfo: null,
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
  messageFilters: {
    searchMRNName: null,
  },
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
    setSearchMRNName: (state, action) => {
      state.messageFilters.searchMRNName = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchListings.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchListings.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.entities = indexBy('id', action.payload);
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
export const { setSearchMRNName } = messageSlice.actions;
export default messageSlice.reducer;
