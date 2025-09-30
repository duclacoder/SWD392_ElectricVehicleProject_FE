import { message } from "antd";
import type { UserFormData } from "../../../entities/Form";
import type { PaginatedResult, ResponseDTO } from "../../../entities/Response";
import type { User } from "../../../entities/User";
import api from "../../../shared/api/axios";

export const getAllUsers = async (
  page: number,
  pageSize: number
): Promise<PaginatedResult<User> | null> => {
  try {
    const response = await api.get("Admin/GetAllUsers", {
      params: {
        Page: page,
        PageSize: pageSize,
      },
    });

    const data: ResponseDTO<PaginatedResult<User>> = response.data;

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

export const createUser = async (userData: UserFormData): Promise<boolean> => {
  try {
    const response = await api.post("Admin/CreateUser", userData);
    const data: ResponseDTO<any> = response.data;
    if (data.isSuccess) {
      message.success("User created successfully!");
      return true;
    } else {
      message.error(data.message || "Failed to create user");
      return false;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message || "An unexpected error occurred."
    );
    console.error(error);
    return false;
  }
};

export const updateUser = async (
  userId: string,
  userData: Partial<UserFormData>
): Promise<boolean> => {
  try {
    const response = await api.put(`Admin/UpdateUser/${userId}`, userData);
    const data: ResponseDTO<any> = response.data;
    if (data.isSuccess) {
      message.success("User updated successfully!");
      return true;
    } else {
      message.error(data.message || "Failed to update user");
      return false;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message || "An unexpected error occurred."
    );
    console.error(error);
    return false;
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const response = await api.delete(`Admin/DeleteUser/${userId}`);
    const data: ResponseDTO<any> = response.data;
    if (data.isSuccess) {
      message.success("User deleted successfully!");
      return true;
    } else {
      message.error(data.message || "Failed to delete user");
      return false;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message || "An unexpected error occurred."
    );
    console.error(error);
    return false;
  }
};
