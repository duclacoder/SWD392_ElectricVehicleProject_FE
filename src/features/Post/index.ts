import { message } from "antd";
import type { PaginatedResult, ResponseDTO } from "../../entities/Response.ts";
import type {
  CreateUserPostDTO,
  GetAllUserPostRequestDTO,
  UserPostCustom,
} from "../../entities/UserPost.ts";
import api from "../../shared/api/axios.ts";

export const getAllUserPosts = async (
  params: GetAllUserPostRequestDTO
): Promise<PaginatedResult<UserPostCustom> | null> => {
  try {
    const response = await api.get("/UserPost", {
      params: {
        Page: params.page,
        PageSize: params.pageSize,
        UserId: params.userId
      },
    });
    const data: ResponseDTO<PaginatedResult<UserPostCustom>> = response.data;

    if (data.isSuccess) return data.result;
    else {
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

    if (data.isSuccess) {
      return data.result;
    } else {
      message.error(data.message || "Failed to fetch user post");
      return null;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message ||
      "An unexpected error occurred while fetching user post."
    );
    console.error(error);
    return null;
  }
};

export const createUserPost = async (
  dto: CreateUserPostDTO,
  imagesFiles: File[]
): Promise<UserPostCustom | null> => {
  try {
    const formData = new FormData();

    formData.append("UserId", dto.userId.toString());
    formData.append('Title', dto.title);
    formData.append('UserPackageId', dto.userPackageId.toString());

     if (dto.vehicle) {
      formData.append('Vehicle.Brand', dto.vehicle.brand || '');
      formData.append('Vehicle.Model', dto.vehicle.model || '');
      formData.append('Vehicle.Color', dto.vehicle.color || '');
      formData.append('Vehicle.Year', dto.vehicle.year?.toString() || '');
      formData.append('Vehicle.Price', dto.vehicle.price?.toString() || '');
      formData.append('Vehicle.Description', dto.vehicle.description || '');
      formData.append('Vehicle.BodyType', dto.vehicle.bodyType || '');
      formData.append('Vehicle.RangeKm', dto.vehicle.rangeKm?.toString() || '');
      formData.append('Vehicle.MotorPowerKw', dto.vehicle.motorPowerKw?.toString() || '');
    }

    imagesFiles.forEach((file) => {
      formData.append('ImageUrls', file);
    });

     const response = await api.post("/UserPost", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data: ResponseDTO<UserPostCustom> = response.data;


    if (data.isSuccess) {
      message.success("Post created successfully!");
      return data.result;
    } else {
      message.error(data.message || "Failed to create post");
      return null;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message ||
      "An unexpected error occurred while creating post."
    );
    console.error(error);
    return null;
  }
};

// export const updateUserPost = async (
//     id: number,
//     dto: UpdateUserPostDTO
// ): Promise<UserPostCustom | null> => {
//     try {
//         const response = await api.put(`/api/UserPost/${id}`, dto);
//         const data: ResponseDTO<UserPostCustom> = response.data;

//         if (data.isSuccess) {
//             message.success("Post updated successfully!");
//             return data.result;
//         } else {
//             message.error(data.message || "Failed to update post");
//             return null;
//         }
//     } catch (error: any) {
//         message.error(
//             error?.response?.data?.message || "An unexpected error occurred while updating post."
//         );
//         console.error(error);
//         return null;
//     }
// };

export const deleteUserPost = async (
  id: number
): Promise<UserPostCustom | null> => {
  try {
    const response = await api.delete(`/UserPost/${id}`);
    const data: ResponseDTO<UserPostCustom> = response.data;

    if (data.isSuccess) {
      message.success("Post deleted successfully!");
      return data.result;
    } else {
      message.error(data.message || "Failed to delete post");
      return null;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message ||
      "An unexpected error occurred while deleting post."
    );
    console.error(error);
    return null;
  }
};

