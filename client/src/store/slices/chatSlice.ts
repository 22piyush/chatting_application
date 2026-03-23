import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { connectSocket, disconnectSocket } from "../../lib/socket";


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