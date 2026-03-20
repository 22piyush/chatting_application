import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { connectSocket } from "../../lib/socket";


// ✅ User type
interface User {
  _id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

// Auth state type
interface AuthState {
  authUser: User | null;
  isSigningIn: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
}

// Initial state
const initialState: AuthState = {
  authUser: null,
  isSigningIn: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
};


export const getUser = createAsyncThunk<User | null>(
  "auth/getUser",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get<User>("/user/me");
      connectSocket(res.data.user);
      return res.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);


// =======================
// ✅ SLICE
// =======================
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setOnlineUsers(state, action: PayloadAction<string[]>) {
      state.onlineUsers = action.payload;
    },

    logout(state) {
      state.authUser = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // 🔄 pending
      .addCase(getUser.pending, (state) => {
        state.isCheckingAuth = true;
      })

      // ✅ success
      .addCase(getUser.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.authUser = action.payload;
        state.isCheckingAuth = false;
      })

      // ❌ error
      .addCase(getUser.rejected, (state) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      });
  },
});

// ✅ exports
export const { setOnlineUsers, logout } = authSlice.actions;
export default authSlice.reducer;