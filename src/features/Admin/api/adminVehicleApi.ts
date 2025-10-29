import { message } from "antd";
import type {
  AdminVehicle,
  AdminVehicleFormData,
} from "../../../entities/AdminVehicle";
import type { PaginatedResult, ResponseDTO } from "../../../entities/Response";
import { apiRoot } from "../../../shared/api/axios";

const camelToPascal = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const getAllAdminVehicles = async (
  page: number,
  pageSize: number
): Promise<PaginatedResult<AdminVehicle> | null> => {
  try {
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      message.error("Admin User ID not found. Please log in.");
      return null;
    }

    const response = await apiRoot.get(`/GetAllCars`, {
      params: {
        UserId: Number(currentUserId),
        Page: page,
        PageSize: pageSize,
      },
    });

    const data: ResponseDTO<PaginatedResult<AdminVehicle>> = response.data;

    if (data.isSuccess) {
      return data.result;
    } else {
      message.error(data.message || "Failed to fetch vehicles");
      return null;
    }
  } catch (error) {
    message.error("An unexpected error occurred while fetching vehicles.");
    console.error(error);
    return null;
  }
};

export const createAdminVehicle = async (
  vehicleData: AdminVehicleFormData
): Promise<boolean> => {
  try {
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      message.error("Admin User ID not found. Please log in.");
      return false;
    }

    const formData = new FormData();

    formData.append("UserId", currentUserId);
    formData.append("Status", "Admin");
    formData.append("Verified", "true");

    Object.entries(vehicleData).forEach(([key, value]) => {
      if (key === "image") return;

      const pascalCaseKey = camelToPascal(key);

      if (value !== undefined && value !== null) {
        if (typeof value === "boolean") {
          formData.append(pascalCaseKey, value ? "true" : "false");
        } else {
          formData.append(pascalCaseKey, String(value));
        }
      }
    });

    if (vehicleData.image && typeof vehicleData.image !== "string") {
      formData.append("Image", vehicleData.image);
    } else if (!vehicleData.image) {
    }

    const response = await apiRoot.post(`/AddCar`, formData, {
      headers: {
        "Content-Type": undefined,
      },
    });

    const data: ResponseDTO<any> = response.data;
    if (data.isSuccess) {
      message.success("Vehicle created successfully!");
      return true;
    } else {
      console.error("Backend validation errors:", data.message);
      message.error(
        data.message || "Failed to create vehicle. Check console for details."
      );
      return false;
    }
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response:", error.response.data);
      message.error(
        error.response.data?.message ||
          "An unexpected error occurred during creation."
      );
    } else {
      console.error("Network or other error:", error);
      message.error("An unexpected network error occurred.");
    }
    return false;
  }
};

export const updateAdminVehicle = async (
  vehicleId: number,
  vehicleData: Partial<AdminVehicleFormData>
): Promise<boolean> => {
  try {
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      message.error("Admin User ID not found. Please log in.");
      return false;
    }

    const formData = new FormData();

    formData.append("VehiclesId", String(vehicleId));
    formData.append("UserId", currentUserId);
    formData.append("Status", "Admin");

    Object.entries(vehicleData).forEach(([key, value]) => {
      if (key === "image") return;

      const pascalCaseKey = camelToPascal(key);

      if (value !== undefined && value !== null) {
        if (typeof value === "boolean") {
          formData.append(pascalCaseKey, value ? "true" : "false");
        } else {
          formData.append(pascalCaseKey, String(value));
        }
      }
    });

    if (vehicleData.image && typeof vehicleData.image !== "string") {
      formData.append("Image", vehicleData.image);
    }

    const response = await apiRoot.put(`/UserCarUpdate`, formData, {
      headers: {
        "Content-Type": undefined,
      },
    });

    const data: ResponseDTO<any> = response.data;
    if (data.isSuccess) {
      message.success("Vehicle updated successfully!");
      return true;
    } else {
      console.error("Backend validation errors:", data.message);
      message.error(
        data.message || "Failed to update vehicle. Check console for details."
      );
      return false;
    }
  } catch (error: any) {
    if (error.response) {
      console.error("API Error Response:", error.response.data);
      message.error(
        error.response.data?.message ||
          "An unexpected error occurred during update."
      );
    } else {
      console.error("Network or other error:", error);
      message.error("An unexpected network error occurred.");
    }
    return false;
  }
};

export const deleteAdminVehicle = async (
  vehicleId: number
): Promise<boolean> => {
  try {
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      message.error("Admin User ID not found. Please log in.");
      return false;
    }

    const response = await apiRoot.delete(`/DeleteCar`, {
      params: {
        userId: Number(currentUserId),
        carId: vehicleId,
      },
    });

    const data: ResponseDTO<any> = response.data;
    if (data.isSuccess) {
      message.success("Vehicle deleted successfully!");
      return true;
    } else {
      message.error(data.message || "Failed to delete vehicle");
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

export const unDeleteAdminVehicle = async (
  vehicleId: number
): Promise<boolean> => {
  try {
    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      message.error("Admin User ID not found. Please log in.");
      return false;
    }

    const response = await apiRoot.patch(`/UnDeleteCar`, null, {
      params: {
        userId: Number(currentUserId),
        carId: vehicleId,
      },
    });

    const data: ResponseDTO<any> = response.data;
    if (data.isSuccess) {
      message.success("Vehicle undeleted successfully!");
      return true;
    } else {
      message.error(data.message || "Failed to undelete vehicle");
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
