import type { ResponseDTO } from "../../entities/Response";
import type { UserBatteryGetAll } from "../../entities/Battery";
import apiRoot from "../../shared/api/axios";

/**
 * Lấy danh sách tất cả pin của người dùng
 * @param userId ID của người dùng
 * @param page Trang hiện tại (mặc định = 1)
 * @param pageSize Số lượng phần tử mỗi trang (mặc định = 10)
 */
export const getAllUserBatteries = async (
  userId: number,
  page: number = 1,
  pageSize: number = 10
) => {
  try {
    const response = await apiRoot.get<ResponseDTO<{ items: UserBatteryGetAll[] }>>(
      "/Battery/GetAllBattery",
      {
        params: {
          UserId: userId,
          Page: page,
          PageSize: pageSize,
        },
      }
    );

    if (response.data && response.data) {
      return response.data.result; // trả ra danh sách pin
    }

    return [];
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách pin:", error);
    throw error;
  }
};
