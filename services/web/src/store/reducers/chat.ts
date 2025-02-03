import { IChatbot } from '@packages/entities';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { indexBy } from '@root/utils/index';
import { getChat } from '../requests/chat';
import { ChatState, EntityLoadingState } from '../types';

const initialState: ChatState = {
  processing: false,
  entities: {},
  status: EntityLoadingState.IDLE,
  successMessage: undefined,
  errorMessage: undefined,
  chatFilters: {
    searchMRNName: null,
    searchAnswer: null,
  },
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addChatItem(state, action: PayloadAction<IChatbot>) {
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
    clearData(state) {
      state.entities = {};
      state.status = EntityLoadingState.IDLE;
    },
    setSearchMRNName: (state, action) => {
      state.chatFilters.searchMRNName = action.payload;
    },
    setSearchAnswer: (state, action) => {
      state.chatFilters.searchAnswer = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchChat.pending, (state) => {
      state.processing = true;
      state.status = EntityLoadingState.PENDING;
    });

    builder.addCase(fetchChat.fulfilled, (state, action) => {
      state.status = EntityLoadingState.SUCCEEDED;
      state.entities = {};
      if (action.payload.length === 0) {
        state.errorMessage = 'No chat history found.';
      }

      state.entities = {
        ...state.entities,
        ...indexBy('id', action.payload),
      };
    });

    builder.addCase(fetchChat.rejected, (state, action) => {
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

export const { addChatItem, clearSuccessMessage, clearErrorMessage } =
  chatSlice.actions;

export const fetchChat = createAsyncThunk('calendar/fetchChat', getChat);
export const { clearData, setSearchMRNName, setSearchAnswer } =
  chatSlice.actions;
export default chatSlice.reducer;
