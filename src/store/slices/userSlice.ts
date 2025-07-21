import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Define types
interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  notificationsEnabled: boolean;
}

export interface UserState {
  id: string | null;
  username: string | null;
  email: string | null;
  isAuthenticated: boolean;
  preferences: UserPreferences;
  lastSyncTimestamp: number | null;
  loading: boolean;
  error: string | null;
}

// Define initial state
const initialState: UserState = {
  id: null,
  username: null,
  email: null,
  isAuthenticated: false,
  preferences: {
    theme: 'system',
    fontSize: 16,
    notificationsEnabled: true,
  },
  lastSyncTimestamp: null,
  loading: false,
  error: null,
};

// Define async thunks
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      // This would be replaced with actual API call
      // Simulating API response
      return {
        id: '1',
        username: credentials.username,
        email: `${credentials.username}@example.com`,
      };
    } catch (error) {
      return rejectWithValue('Login failed. Please check your credentials.');
    }
  }
);

// Create the slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.id = null;
      state.username = null;
      state.email = null;
      state.isAuthenticated = false;
      state.lastSyncTimestamp = null;
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setLastSyncTimestamp: (state, action: PayloadAction<number>) => {
      state.lastSyncTimestamp = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { logout, updatePreferences, setLastSyncTimestamp } = userSlice.actions;

// Export selectors
export const selectUser = (state: RootState) => state.user;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectUserPreferences = (state: RootState) => state.user.preferences;
export const selectTheme = (state: RootState) => state.user.preferences.theme;

// Export reducer
export default userSlice.reducer;