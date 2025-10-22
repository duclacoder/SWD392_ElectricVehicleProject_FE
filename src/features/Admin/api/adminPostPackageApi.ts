import api from "../../../shared/api/axios";
import type { GetAllPostPackageRequestDTO, CreatePostPackageDTO, PostPackageCustom } from "../../../entities/PostPackage";
import type { PaginatedResult, ResponseDTO } from "../../../entities/Response";
import { message } from "antd";

export const adminPostPackageApi = {
    getAll: async (params: GetAllPostPackageRequestDTO) => {
        try {
            const res = await api.get<ResponseDTO<PaginatedResult<PostPackageCustom>>>("/PostPackage", {
                params,
            });

            if (res.data.isSuccess) {
                return res.data.result; // ✅ result chứa { items, totalItems, totalPages... }
            } else {
                message.error(res.data.message || "Không lấy được danh sách gói bài đăng");
                return { items: [] };
            }
        } catch (error: any) {
            message.error(error?.response?.data?.message || "Lỗi khi tải danh sách gói bài đăng");
            return { items: [] };
        }
    },

    getById: async (id: number) => {
        const res = await api.get<ResponseDTO<PostPackageCustom>>(`/PostPackage/${id}`);
        return res.data.result;
    },

    create: async (dto: CreatePostPackageDTO) => {
        const res = await api.post<ResponseDTO<PostPackageCustom>>("/PostPackage", dto);
        return res.data;
    },

    update: async (id: number, dto: CreatePostPackageDTO) => {
        const res = await api.put<ResponseDTO<PostPackageCustom>>(`/PostPackage/${id}`, dto);
        return res.data;
    },

    delete: async (id: number) => {
        const res = await api.delete<ResponseDTO<null>>(`/PostPackage/${id}`);
        return res.data;
    },
};
