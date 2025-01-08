import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { indexBy } from '@root/utils/index';
import { getUnifiedChat } from '../requests/unifiedChat';
import { EntityLoadingState, UnifiedChatState } from '../types';

const initialState: UnifiedChatState = {
  processing: false,
  entities: {},
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
};

const unifiedChatSlice = createSlice({
  name: 'unifiedChat',
  initialState,
  reducers: {
    clearData(state) {
      state.entities = {};
      state.status = EntityLoadingState.IDLE;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchUnifiedChat.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchUnifiedChat.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      if (action.payload.length === 0) {
        state.errorMessage = 'No sms history found.';
      }

      state.entities = {
        ...state.entities,
        ...indexBy('id', action.payload),
      };
    });

    builder.addCase(fetchUnifiedChat.rejected, (state, action) => {
      state.status = EntityLoadingState.FAILED;
      state.processing = false;
      if (typeof action.payload === 'string') {
        state.errorMessage = action.payload ?? 'Failed to fetch chat history.';
      } else {
        state.errorMessage = 'Failed to fetch chat history.';
      }
    });
  },
});

export const fetchUnifiedChat = createAsyncThunk(
  'calendar/getUnifiedChat',
  getUnifiedChat,
);

export const { clearData } = unifiedChatSlice.actions;
export default unifiedChatSlice.reducer;
