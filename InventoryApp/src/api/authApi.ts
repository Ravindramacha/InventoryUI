import axios from "axios";

interface LoginResponse {
  token: string;
}

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const loginUser = async (credentials: { client_id: string; secret: string }): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(`${API_BASE_URL}/api/Auth/token`, credentials);
  localStorage.setItem("token", response.data.token); // Store token in localStorage
  return response.data;
};

