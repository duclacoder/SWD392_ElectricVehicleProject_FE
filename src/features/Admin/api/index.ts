import { message } from "antd";
import type { ResponseDTO } from "../../../entities/Response";
import type { User } from "../../../entities/User";
import api from "../../../shared/api/axios";

export const getAllUsers = async (): Promise<User[] | null> => {
  try {
    const response = await api.get("Admin/GetAll");
    const data: ResponseDTO<User[]> = response.data;

    if (data.isSuccess) {
      return data.result;
    } else {
      message.error(data.message || "Failed to fetch users");
      return null;
    }
  } catch (error) {
    message.error("An unexpected error occurred while fetching users.");
    console.error(error);
    return null;
  }
};
