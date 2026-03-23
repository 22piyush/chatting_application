import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Generic User type (flexible for unknown backend data)
interface User {
  _id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

// Message type (keep flexible for now)
interface Message {
  _id?: string;
  text?: string;
  senderId?: string;
  receiverId?: string;
  createdAt?: string;
  [key: string]: any;
}

// State type
interface ChatState {
  users: User[];                 // array of users
  messages: Message[];           // array of messages
  selectedUser: User | null;     // selected user
  isUserLoading: boolean;
  isMessagesLoading: boolean;
}

// Initial state
const initialState: ChatState = {
  users: [],
  messages: [],
  selectedUser: null,
  isUserLoading: false,
  isMessagesLoading: false,
};

//Slice
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },

    pushNewMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },

    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },

    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
  },
});

//Exports
export const {
  setSelectedUser,
  pushNewMessage,
  setUsers,
  setMessages,
} = chatSlice.actions;

export default chatSlice.reducer;