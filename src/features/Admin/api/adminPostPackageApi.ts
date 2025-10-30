import { message } from "antd";
import type {
  CreatePostPackageDTO,
  GetAllPostPackageRequestDTO,
  PostPackageCustom,
} from "../../../entities/PostPackage";
import type { PaginatedResult, ResponseDTO } from "../../../entities/Response";
import api from "../../../shared/api/axios";

export const adminPostPackageApi = {
  getAll: async (params: GetAllPostPackageRequestDTO) => {
    try {
      const res = await api.get<
        ResponseDTO<PaginatedResult<PostPackageCustom>>
      >("/PostPackage", {
        params,
      });

      if (res.data.isSuccess) {
        return res.data.result; // ✅ result chứa { items, totalItems, totalPages... }
      } else {
        message.error(
          res.data.message || "Không lấy được danh sách gói bài đăng"
        );
        return { items: [] };
      }
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Lỗi khi tải danh sách gói bài đăng"
      );
      return { items: [] };
    }
  },

  getById: async (id: number) => {
    const res = await api.get<ResponseDTO<PostPackageCustom>>(
      `/PostPackage/${id}`
    );
    return res.data.result;
  },

  create: async (dto: CreatePostPackageDTO) => {
    const res = await api.post<ResponseDTO<PostPackageCustom>>(
      "/PostPackage",
      dto
    );
    return res.data;
  },

  update: async (id: number, dto: CreatePostPackageDTO) => {
    const res = await api.put<ResponseDTO<PostPackageCustom>>(
      `/PostPackage/${id}`,
      dto
    );
    return res.data;
  },

  delete: async (id: number) => {
    const res = await api.delete<ResponseDTO<null>>(`/PostPackage/${id}`);
    return res.data;
  },

   getActivePostPackages: async (
    params: GetAllPostPackageRequestDTO
  ): Promise<PaginatedResult<PostPackageCustom> | null> => {
    try {
      const response = await api.get("/PostPackage/active", {
        params: {
          Page: params.page,
          PageSize: params.pageSize,
        },
      });

      const data: ResponseDTO<PaginatedResult<PostPackageCustom>> = response.data;

      if (data.isSuccess) {
        return data.result;
      } else {
        message.error(data.message || "Failed to fetch active post packages");
        return null;
      }
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ||
          "An unexpected error occurred while fetching active post packages."
      );
      console.error(error);
      return null;
    }
  },
};

 