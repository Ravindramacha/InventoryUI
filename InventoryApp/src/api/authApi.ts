import axios from "axios";

interface LoginResponse {
  token: string;
}

export const loginUser = async (credentials: { client_id: string; secret: string }): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>("http://localhost:5181/api/Auth/token", credentials);
  return response.data;
};
