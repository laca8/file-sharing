import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../service/userService";
import { objectId, user } from "../../type";
type obj = user & objectId;
const userStorage = JSON.parse(localStorage.getItem("user") || "null");
interface UserState {
  user: obj | null;
  update: boolean;
  uerAdd: obj | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  users: user[];
}

const initialState: UserState = {
  user: userStorage ? userStorage : null,
  uerAdd: null,
  update: false,
  loading: false,
  error: null as string | null,
  success: false,
  users: [],
};
//create action
export const registerUser = createAsyncThunk(
  "registerUser",
  async (row: user, api) => {
    try {
      const appData = api.getState() as {
        userSlice: { user: { token: string } };
      };
      const { user } = appData.userSlice;
      // console.log(user);

      const config = {
        headers: {
          //"Content-Type": "multipart/form-data",
          "Content-Type": "application/json",
          authorization: user.token,
        },
      };
      return await authService.createUser(row, config);
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
    const appData = api.getState() as {
      userSlice: { user: { token: string } };
    };
    const { user } = appData.userSlice;
    // console.log(user);

    const config = {
      headers: {
        //"Content-Type": "multipart/form-data",
        "Content-Type": "application/json",
        authorization: user.token,
      },
    };
    const games = await authService.getUsers(config);
    return games as user[];
  } catch (error) {
    // console.log(error);
    return api.rejectWithValue(
      (error as { response: { data: { message: string } } })?.response?.data
        ?.message
    );
  }
});

export const deleteUser = createAsyncThunk(
  "deleteUser",
  async (id: string, api) => {
    try {
      const appData = api.getState() as {
        userSlice: { user: { token: string } };
      };
      const { user } = appData.userSlice;
      // console.log(user);

      const config = {
        headers: {
          //"Content-Type": "multipart/form-data",
          "Content-Type": "application/json",
          authorization: user.token,
        },
      };
      const games = await authService.deleteUser(id, config);
      return games as user[];
    } catch (error) {
      // console.log(error);
      return api.rejectWithValue(
        (error as { response: { data: { message: string } } })?.response?.data
          ?.message
      );
    }
  }
);

export const updatePassword = createAsyncThunk(
  "updatePassword",
  async (row: { id: string; password: string }, api) => {
    try {
      const appData = api.getState() as {
        userSlice: { user: { token: string } };
      };
      const { user } = appData.userSlice;
      // console.log(user);

      const config = {
        headers: {
          //"Content-Type": "multipart/form-data",
          "Content-Type": "application/json",
          authorization: user.token,
        },
      };
      const games = await authService.updatePassword(row, config);
      return games as user[];
    } catch (error) {
      // console.log(error);
      return api.rejectWithValue(
        (error as { response: { data: { message: string } } })?.response?.data
          ?.message
      );
    }
  }
);
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
        state.uerAdd = { ...action.payload } as obj;
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
      })

      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.update = false;
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.update = true;
        state.error = null;
      });
  },
});
export default userSlice.reducer;
