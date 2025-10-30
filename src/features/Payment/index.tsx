import { message } from "antd";
import type { CreatePaymentRequest, Payment } from "../../entities/Payment";
import type { ResponseDTO } from "../../entities/Response";
import api from "../../shared/api/axios";

export const VnPayPayment = async (
  paymentId: string
): Promise<string | null> => {
  try {
    const response = await api.get(`Payment/VNPay?paymentId=${paymentId}`);
    const data: ResponseDTO<string> = response.data;
    if (data.isSuccess) {
      return data.result;
    } else message.error("Payment failed. Please try again.");
    return null;
  } catch (error) {
    message.error("Payment failed. Please try again.");
    return null;
  }
};

export const CreatePayment = async (
  createRequest: CreatePaymentRequest
): Promise<boolean> => {
  try {
    const response = await api.post(
      `/Payment/CreatePayment?UserId=${createRequest.UserId}&TransferAmount=${createRequest.TransferAmount}`
    );
    const data: ResponseDTO<Payment> = response.data;
    if (data.isSuccess) {
      sessionStorage.setItem("paymentId", data.result?.paymentsId || "");
      return true;
    } else return false;
  } catch (error) {
    message.error("Could not create payment. Please try again.");
    return false;
  }
};
