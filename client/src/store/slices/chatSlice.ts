import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { connectSocket, disconnectSocket } from "../../lib/socket";


