import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { connectSocket, disconnectSocket } from "../../lib/socket";


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


export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await axiosInstance.get("/user/sign-out");
      disconnectSocket();
      // ✅ disconnect socket
      return null;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Logout failed"
      );
    }
  }
);


export const loginUser = createAsyncThunk<
  User, // return type
  { email: string; password: string } // input type
>(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/user/sign-in", formData);

      // ✅ connect socket after login
      connectSocket(res.data.user._id);

      return res.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Login failed"
      );
    }
  }
);


// =======================
// SLICE
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

      //error
      .addCase(getUser.rejected, (state) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })


      // =================
      //LOGOUT
      // =================
      .addCase(logoutUser.pending, (state) => {
        state.isLoggingIn = true;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.authUser = null;
        state.onlineUsers = [];
        state.isLoggingIn = false;
      })

      .addCase(logoutUser.rejected, (state) => {
        state.isLoggingIn = false;
      })


      // =================
      // LOGIN
      // =================
      .addCase(loginUser.pending, (state) => {
        state.isLoggingIn = true;
      })

      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.authUser = action.payload;
        state.isLoggingIn = false;
      })

      .addCase(loginUser.rejected, (state) => {
        state.isLoggingIn = false;
      })
  },
});

// exports
export const { setOnlineUsers, logout } = authSlice.actions;
export default authSlice.reducer;