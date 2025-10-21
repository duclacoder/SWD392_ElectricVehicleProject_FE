import { message } from "antd";
import type { PaginatedResult, ResponseDTO } from "../../entities/Response.ts";
import type {
  GetAllUserPackageRequestDTO,
  UserPackagesCustom,
  UserPackagesDTO,
} from "../../entities/UserPackage.ts";
import api from "../../shared/api/axios.ts";

export const getAllUserPackages = async (
  params: GetAllUserPackageRequestDTO
): Promise<PaginatedResult<UserPackagesCustom> | null> => {
  try {
    const response = await api.get("/UserPackages/GetAll", { params });
    const data: ResponseDTO<PaginatedResult<UserPackagesCustom>> =
      response.data;

    if (data.isSuccess) {
      return data.result;
    } else {
      message.error(data.message || "Failed to fetch user packages");
      return null;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message ||
        "An unexpected error occurred while fetching user packages."
    );
    console.error(error);
    return null;
  }
};

export const getUserPackageById = async (
  id: number
): Promise<UserPackagesCustom | null> => {
  try {
    const response = await api.get(`/UserPackages/GetById/${id}`);
    const data: ResponseDTO<UserPackagesCustom> = response.data;

    if (data.isSuccess) {
      return data.result;
    } else {
      message.error(data.message || "Failed to fetch user package");
      return null;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message ||
        "An unexpected error occurred while fetching user package."
    );
    console.error(error);
    return null;
  }
};

export const createUserPackage = async (
  dto: UserPackagesDTO
): Promise<UserPackagesCustom | null> => {
  try {
    const response = await api.post("/UserPackages/Create", dto);
    const data: ResponseDTO<UserPackagesCustom> = response.data;

    if (data.isSuccess) {
      message.success("Package purchased successfully!");
      return data.result;
    } else {
      message.error(data.message || "Failed to purchase package");
      return null;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message ||
        "An unexpected error occurred while purchasing package."
    );
    console.error(error);
    return null;
  }
};

export const updateUserPackage = async (
  id: number,
  dto: UserPackagesDTO
): Promise<UserPackagesCustom | null> => {
  try {
    const response = await api.put(`/UserPackages/Update/${id}`, dto);
    const data: ResponseDTO<UserPackagesCustom> = response.data;

    if (data.isSuccess) {
      message.success("Package updated successfully!");
      return data.result;
    } else {
      message.error(data.message || "Failed to update package");
      return null;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message ||
        "An unexpected error occurred while updating package."
    );
    console.error(error);
    return null;
  }
};

export const deleteUserPackage = async (
  id: number
): Promise<UserPackagesCustom | null> => {
  try {
    const response = await api.delete(`/UserPackages/Delete/${id}`);
    const data: ResponseDTO<UserPackagesCustom> = response.data;

    if (data.isSuccess) {
      message.success("Package deleted successfully!");
      return data.result;
    } else {
      message.error(data.message || "Failed to delete package");
      return null;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message ||
        "An unexpected error occurred while deleting package."
    );
    console.error(error);
    return null;
  }
};

export const filterUserPackages = async (
  params: GetAllUserPackageRequestDTO
): Promise<PaginatedResult<UserPackagesCustom> | null> => {
  try {
    const response = await api.get("/UserPackages/filter", { params });
    const data: ResponseDTO<PaginatedResult<UserPackagesCustom>> =
      response.data;

    if (data.isSuccess) {
      return data.result;
    } else {
      message.error(data.message || "Failed to filter user packages");
      return null;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message ||
        "An unexpected error occurred while filtering user packages."
    );
    console.error(error);
    return null;
  }
};
