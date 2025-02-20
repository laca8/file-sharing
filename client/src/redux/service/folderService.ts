import axios from "axios";
const API_URL_POST = "/api/folders";

import { folder, Config, file } from "../../type";
//create folder
const addFolder = async (row: folder, config: Config): Promise<object> => {
  const response = await axios.post(API_URL_POST, row, config);
  return await response.data;
};
//fetch folders
const getFolders = async (config: Config): Promise<object> => {
  const response = await axios.get(API_URL_POST, config);
  console.log(response);
  
  return await response.data;
};
//fetch folder by id
const getFolderById = async (id: string, config: Config): Promise<object> => {
  const response = await axios.get(`${API_URL_POST}/${id}`, config);
  return await response.data;
};
//delete folder
const deleteFolder = async (id: string, config: Config): Promise<object> => {
  const response = await axios.delete(`${API_URL_POST}/${id}`, config);
  return await response.data;
};
//add file to folder
const addFileToFolder = async (row: file, config: Config): Promise<object> => {
  console.log(row);
  const response = await axios.post(`${API_URL_POST}/file`, row, config);
  return await response.data;
};

//delete file
const deleteFile = async (
  row: { id: string; folderId: string },
  config: Config
): Promise<object> => {
  const response = await axios.delete(`${API_URL_POST}/file/${row.folderId}`, {
    ...config,
    data: row,
  });
  return await response.data;
};
//fetch and download file
const downloadFile = async (
  row: { url: string },
  config: Config
): Promise<object> => {
  const response = await axios.post(
    `${API_URL_POST}/file/download`,
    row,
    config
  );
  return await response.data;
};
//fetch and download file
const sendFile = async (
  row: { fileId: string; folderId: string; username: string },
  config: Config
): Promise<object> => {
  const response = await axios.post(
    `${API_URL_POST}/send/${row.folderId}`,
    row,
    config
  );
  return await response.data;
};
const folderService = {
  addFolder,
  getFolders,
  deleteFolder,
  getFolderById,
  addFileToFolder,
  deleteFile,
  downloadFile,
  sendFile,
};
export default folderService;
