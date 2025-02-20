import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import folderService from "../service/folderService";
import { file, folder } from "../../type";

const initialState: {
  url: string | null;
  folder: folder | null;
  file: file | null;
  folders: folder[];
  loading: boolean;
  error: string | null;
  success: boolean;
  send: boolean;
  isDeleted: boolean;
} = {
  url: null,
  folder: null,
  file: null,
  folders: [],
  loading: false,
  error: null,
  success: false,
  send: false,
  isDeleted: false,
};

export const addFolder = createAsyncThunk(
  "addFolder",
  async (row: folder, api) => {
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

      return await folderService.addFolder(row, config);
    } catch (error) {
      console.log(error);
      return api.rejectWithValue(
        (error as { response: { data: { message: string } } })?.response?.data
          ?.message
      );
    }
  }
);
export const fetchFolders = createAsyncThunk("fetchFolders", async (_, api) => {
  try {
    const appData = api.getState() as {
      userSlice: { user: { token: string } };
    };
    const { user } = appData.userSlice;

    const config = {
      headers: {
        //"Content-Type": "multipart/form-data",
        "Content-Type": "application/json",
        authorization: user.token,
      },
    };
    const folders = await folderService.getFolders(config);
    return folders as folder[];
  } catch (error) {
    // console.log(error);
    return api.rejectWithValue(
      (error as { response: { data: { message: string } } })?.response?.data
        ?.message
    );
  }
});
export const deleteFolder = createAsyncThunk(
  "deleteFolder",
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
          authorization: user.token,
        },
      };

      return await folderService.deleteFolder(id, config);
    } catch (error) {
      console.log(error);
      return api.rejectWithValue(
        (error as { response: { data: { message: string } } })?.response?.data
          ?.message
      );
    }
  }
);
export const getFolderById = createAsyncThunk(
  "getFolderById",
  async (id: string, api) => {
    try {
      const appData = api.getState() as {
        userSlice: { user: { token: string } };
      };
      const { user } = appData.userSlice;

      const config = {
        headers: {
          //"Content-Type": "multipart/form-data",
          authorization: user.token,
        },
      };

      return await folderService.getFolderById(id, config);
    } catch (error) {
      console.log(error);
      return api.rejectWithValue(
        (error as { response: { data: { message: string } } })?.response?.data
          ?.message
      );
    }
  }
);

//add file to folder
interface AppState {
  userSlice: { user: { token: string } };
}

interface Config {
  headers: {
    "Content-Type"?: string;
    authorization: string;
  };
}

export const addFile = createAsyncThunk("addFile", async (row: file, api) => {
  try {
    const appData = api.getState() as AppState;
    const { user } = appData.userSlice;
    // console.log(user);
    const config: Config = {
      headers: {
        // "Content-Type": "application/json",
        // "Content-Type": "multipart/form-data",
        authorization: user.token,
      },
    };
    return await folderService.addFileToFolder(row, config);
  } catch (error) {
    console.log(error);
    return api.rejectWithValue(
      (error as { response: { data: { message: string } } })?.response?.data
        ?.message
    );
  }
});
//delete file
export const deleteFile = createAsyncThunk(
  "deleteFile",
  async (row: { id: string; folderId: string }, api) => {
    try {
      const appData = api.getState() as {
        userSlice: { user: { token: string } };
      };
      const { user } = appData.userSlice;
      console.log(user);

      const config = {
        headers: {
          //"Content-Type": "multipart/form-data",
          authorization: user.token,
        },
      };

      return await folderService.deleteFile(row, config);
    } catch (error) {
      console.log(error);
      return api.rejectWithValue(
        (error as { response: { data: { message: string } } })?.response?.data
          ?.message
      );
    }
  }
);
//download
export const downloadFile = createAsyncThunk(
  "downloadFile",
  async (row: { url: string }, api) => {
    try {
      const appData = api.getState() as {
        userSlice: { user: { token: string } };
      };
      const { user } = appData.userSlice;

      const config = {
        headers: {
          //"Content-Type": "multipart/form-data",
          authorization: user.token,
        },
      };

      return await folderService.downloadFile(row, config);
    } catch (error) {
      console.log(error);
      return api.rejectWithValue(
        (error as { response: { data: { message: string } } })?.response?.data
          ?.message
      );
    }
  }
);

//download
export const sendFile = createAsyncThunk(
  "sendFile",
  async (row: { fileId: string; folderId: string; username: string }, api) => {
    try {
      const appData = api.getState() as {
        userSlice: { user: { token: string } };
      };
      const { user } = appData.userSlice;
      const config = {
        headers: {
          //"Content-Type": "multipart/form-data",
          authorization: user.token,
        },
      };

      return await folderService.sendFile(row, config);
    } catch (error) {
      console.log(error);
      return api.rejectWithValue(
        (error as { response: { data: { message: string } } })?.response?.data
          ?.message
      );
    }
  }
);
export const folderSlice = createSlice({
  name: "folder",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addFolder.pending, (state) => {
        state.loading = true;
      })
      .addCase(addFolder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })
      .addCase(addFolder.fulfilled, (state, action) => {
        state.loading = false;
        state.folder = action.payload as folder;
        state.success = true;
        state.error = null;
      })
      .addCase(fetchFolders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFolders.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFolders.fulfilled, (state, action) => {
        state.loading = false;
        state.folders = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(deleteFolder.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFolder.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteFolder.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(getFolderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFolderById.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getFolderById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.folder = action.payload as folder;
        state.error = null;
      })
      .addCase(addFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(addFile.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })
      .addCase(addFile.fulfilled, (state, action) => {
        state.loading = false;
        state.file = action.payload as file;
        state.success = true;
        state.error = null;
      })
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
        state.isDeleted = false;
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.isDeleted = false;
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteFile.fulfilled, (state) => {
        state.loading = false;
        state.isDeleted = true;
        state.error = null;
      })
      .addCase(downloadFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.success = false;
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(downloadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.url = action.payload as unknown as string | null;
      })
      .addCase(sendFile.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendFile.rejected, (state, action) => {
        state.send = false;
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendFile.fulfilled, (state) => {
        state.loading = false;
        state.send = true;
        state.error = null;
      });
  },
});
export default folderSlice.reducer;
