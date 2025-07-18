import axios from "axios";
import type { LanguageModel } from "../Models/LanguageModel";

interface LoginResponse {
  token: string;
}

export const loginUser = async (credentials: { client_id: string; secret: string }): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>("http://localhost:5181/api/Auth/token", credentials);
  localStorage.setItem("token", response.data.token); // Store token in localStorage
  return response.data;
};

export async function getLanguages(): Promise<LanguageModel[]> {
    const response = await axios.get<LanguageModel[]>('/api/Languages/GetAllLanguages', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
}