import axios from "axios";
const API_URL = "/api/user";
import { user } from "../../type";
const getUsers = async () => {
  const response = await axios.get(`${API_URL}`);
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

const createUser = async (row: user): Promise<object> => {
  const response = await axios.post(`${API_URL}/register`, row);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return await response.data;
};
const logout = async () => {
  localStorage.removeItem("user");
};
const reportService = {
  createUser,
  loginUser,
  getUsers,
  logout,
};
export default reportService;
