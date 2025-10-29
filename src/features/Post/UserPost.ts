import type { ResponseDTO } from "../../entities/Response";
import type { User } from "../../entities/User";
import api from "../../shared/api/axios";

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const response = await api.get(`${API_BASE_URL}GetUserById/${userId}`, {
      baseURL: "", // ⚡ bỏ baseURL mặc định (/api/)
    });

    const data: ResponseDTO<User> = response.data;

    if (data.isSuccess && data.result) {
      return data.result;
    }
    console.warn("Không có dữ liệu user:", data);
    return null;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return null;
  }
};
