import { message } from "antd";
import type { RegisterForm } from "../../entities/Form";
import type { ResponseDTO } from "../../entities/Response";
import api from "../../shared/api/axios";

export const register = async (registerData: RegisterForm) => {
  try {
    const response = await api.post("Auth/Register", registerData);
    const data: ResponseDTO<string> = response.data;
    if (data.isSuccess) {
      return true;
    } else {
      message.error(data.message);
      return false;
    }
  } catch (error) {
    message.error("Register failed");
    console.error(error);
    return false;
  }
};

export const confirm_OTP_Register = async (
  registerData: RegisterForm,
  OTPcode: string
): Promise<boolean> => {
  try {
    const response = await api.post(
      `Auth/Confirm_OTP_Register?otpCode=${OTPcode}`,
      registerData
    );
    const data: ResponseDTO<string> = response.data;
    console.log(data);
    if (data.isSuccess) {
      console.log(data.isSuccess);
      return true;
    } else {
      message.error(data.message);
      console.log(data.isSuccess);
      return false;
    }
  } catch (error) {
    message.error("Register failed");
    console.error(error);
    return false;
  }
};

export const resend_OTP = async (email: string): Promise<boolean> => {
  try {
    const response = await api.post(`Auth/Resend_OTP?email=${email}`);
    const data: ResponseDTO<string> = response.data;
    if (data.isSuccess) {
      return true;
    } else {
      message.error(data.message);
      return false;
    }
  } catch (error) {
    message.error("Register failed");
    console.error(error);
    return false;
  }
};
