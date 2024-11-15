import { createSlice } from "@reduxjs/toolkit";
import { IMessage, IRoom } from "./chat-types";
import { UserProfile } from "../user/user-types";
import { fetchAllUsers } from "../user/user-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

interface ChatState {
  messages: IMessage[];
  room: IRoom[];
  allUser: UserProfile[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  room: [],
  allUser: [],
  loading: false,
  error: null,
};

export const getMessage = createAsyncThunk(
    "chat/getMessage",
    async (data: { roomId: number }, thunkAPI) => {
      try {
        const res = await axiosInstance.get(`/chats/rooms/${data.roomId}/message`);
        return res.data;
      } catch (error: any) {
        console.log(error);
        return thunkAPI.rejectWithValue(error.message || "Something went wrong");
      }
    }
  );

  export const getOrCreateRoom = createAsyncThunk(
    "chat/getOrCreateRoom",
    async (data: { userId: number; adminId: number }, thunkAPI) => {
      try {
        const res = await axiosInstance.get(`/chats/rooms?userId=${data.userId}&adminId=${data.adminId}`);
        return res.data.room;
      } catch (error: any) {
        console.log(error);
        return thunkAPI.rejectWithValue(error.message || "Something went wrong");
      }
    }
  );


const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessage.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
        state.loading = false;
      })
      .addCase(getMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getOrCreateRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrCreateRoom.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.room = [action.payload];
        }
      })
      .addCase(getOrCreateRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.allUser = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {addMessage} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;
