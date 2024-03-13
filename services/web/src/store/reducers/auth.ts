import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// todo add api call and move type to appropriate folder
const getMe = async () => {
  return {} as IUser;
};
type IUser = {
  id: string;
};

export interface AuthState {
  isAuthenticated: boolean | null;
  user: IUser | null;
}

const initialState: AuthState = {
  isAuthenticated: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchLoggedInUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });

    builder.addCase(fetchLoggedInUser.rejected, (state) => {
      state.isAuthenticated = false;
    });
  },
});

export const { setUserInfo, setIsAuthenticated } = authSlice.actions;

export const fetchLoggedInUser = createAsyncThunk(
  'users/fetchLoggedInUser',
  getMe,
);

export default authSlice.reducer;
