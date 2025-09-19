import { message } from "antd";
import type { LoginForm } from "../../entities/Form";
import api from "../../shared/api/axios";

export const Login = async (LoginForm: LoginForm): Promise<boolean> => {
  try {
    const response = await api.post("/auth/login", LoginForm);
    const data = response.data;
    if (data.isSuccess) {
      message.success(data.message);
      localStorage.setItem("userName", data.userName);
      localStorage.setItem("token", data.token);
    }
    return data.isSuccess;
  } catch (error) {
    message.error(error?.response?.data?.message || "Login failed");
    return error?.response?.data?.isSuccess;
  }
};
