import { message } from "antd";
import type { PaginatedResult, ResponseDTO } from "../../../entities/Response";
import type { UserPostCustom } from "../../../entities/UserPost";
import api from "../../../shared/api/axios";

export const getAllUserPosts = async (
  page: number = 1,
  pageSize: number = 10,
  userId?: number
): Promise<PaginatedResult<UserPostCustom> | null> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (userId) {
      params.append("userId", userId.toString());
    }

    const response = await api.get(`/UserPost?${params.toString()}`);
    const data: ResponseDTO<PaginatedResult<UserPostCustom>> = response.data;

    if (data.isSuccess && data.result) {
      return data.result;
    } else {
      message.error(data.message || "Failed to fetch user posts");
      return null;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message ||
        "An unexpected error occurred while fetching user posts."
    );
    console.error(error);
    return null;
  }
};

export const getUserPostById = async (
  id: number
): Promise<UserPostCustom | null> => {
  try {
    const response = await api.get(`/UserPost/${id}`);
    const data: ResponseDTO<UserPostCustom> = response.data;

    if (data.isSuccess && data.result) {
      return data.result;
    } else {
      message.error(data.message || "Failed to fetch user post");
      return null;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message || "An unexpected error occurred."
    );
    console.error("Get user post by ID error:", error);
    return null;
  }
};

export const deleteUserPost = async (id: number): Promise<boolean> => {
  try {
    const response = await api.delete(`/UserPost/${id}`);
    const data: ResponseDTO<any> = response.data;

    if (data.isSuccess) {
      message.success("User post deleted successfully!");
      return true;
    } else {
      message.error(data.message || "Failed to delete user post");
      return false;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message || "An unexpected error occurred."
    );
    console.error("Delete user post error:", error);
    return false;
  }
};
