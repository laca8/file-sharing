import axios from "axios";
const API_URL = "/api/user";
import { user, Config } from "../../type";
const getUsers = async (config: Config) => {
  const response = await axios.get(`${API_URL}`, config);
  console.log(response);
  return response.data;
};
const loginUser = async (row: user) => {
  const response = await axios.post(`${API_URL}/login`, row);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return await response.data;
};

const createUser = async (row: user, config: Config): Promise<object> => {
  const response = await axios.post(`${API_URL}/register`, row, config);
  // if (response.data) {
  //   localStorage.setItem("user", JSON.stringify(response.data));
  // }
  return await response.data;
};

const deleteUser = async (id: string, config: Config) => {
  const response = await axios.delete(`${API_URL}/${id}`, config);
  console.log(response);
  return response.data;
};
const updatePassword = async (
  row: { id: string; password: string },
  config: Config
) => {
  const response = await axios.patch(`${API_URL}/${row.id}`, row, config);
  console.log(response);
  return response.data;
};
const logout = async () => {
  localStorage.removeItem("user");
};
const reportService = {
  createUser,
  loginUser,
  getUsers,
  logout,
  deleteUser,
  updatePassword,
};
export default reportService;
