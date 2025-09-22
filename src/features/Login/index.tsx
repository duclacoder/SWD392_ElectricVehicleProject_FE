import { message } from "antd";
import type { LoginForm } from "../../entities/Form";
import api from "../../shared/api/axios";
import type { ResponseDTO } from "../../entities/Response";
import type { User } from "../../entities/User";

export const Login = async (LoginForm: LoginForm): Promise<boolean> => {
  try {
    const response = await api.post("User/Login", LoginForm);
    const data : ResponseDTO<User> = response.data;
    if (data.isSuccess) {
      localStorage.setItem("userName", data.result.userName);
      localStorage.setItem("token", data.result.token);
    } else {
      message.error(data.message);
    }
    return data.isSuccess;
  } catch (error) {
    message.error(error?.response?.data?.message || "Login failed");
    console.error(error?.response?.data);
    return false;
  }
};
