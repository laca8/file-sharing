import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../service/userService";
import { objectId, user } from "../../type";
type obj = user & objectId;
const userStorage = JSON.parse(localStorage.getItem("user") || "null");
interface UserState {
  user: obj | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  users: user[];
}

const initialState: UserState = {
  user: userStorage ? userStorage : null,
  loading: false,
  error: null as string | null,
  success: false,
  users: [],
};
//create action
export const registerUser = createAsyncThunk(
  "registerUser",
  async (user: user, api) => {
    try {
      return await authService.createUser(user);
    } catch (error) {
      return api.rejectWithValue(
        (error as { response: { data: { message: string } } })?.response?.data
          ?.message
      );
    }
  }
);
export const logout = createAsyncThunk("logout", async () => {
  return await authService.logout();
});
export const loginUser = createAsyncThunk(
  "loginUser",
  async (user: user, api) => {
    try {
      return await authService.loginUser(user);
    } catch (error) {
      console.log(error);
      return api.rejectWithValue(
        (error as { response: { data: { message: string } } })?.response?.data
          ?.message
      );
    }
  }
);
export const fetchUsers = createAsyncThunk("fetchUsers", async (_, api) => {
  try {
    const games = await authService.getUsers();
    return games as user[];
  } catch (error) {
    // console.log(error);
    return api.rejectWithValue(
      (error as { response: { data: { message: string } } })?.response?.data
        ?.message
    );
  }
});
export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...action.payload } as obj;
        state.success = true;
        state.error = null;
      })

      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.success = true;
        state.error = null;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
        state.error = null;
      });
  },
});
export default userSlice.reducer;
