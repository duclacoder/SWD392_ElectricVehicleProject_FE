import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { LoginForm } from "../../../entities/Form";
import { Login } from "../../../features/Login";

const LoginPage = () => {
  const [accountName, setAccountName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginData: LoginForm = {
      userName: accountName,
      password: password,
    };
    const result = await Login(loginData);
    if (result) navigate("/");
  };

  return (
    <div className="bg-[#739EC9] min-h-screen flex justify-center items-center inset-0 fixed">
      <div className="bg-[#1E3A5F] h-[80%] w-[60%] text-white flex rounded-lg p-4">
        {/* Left side: image */}
        <div className="w-[65%] flex justify-center items-center">
          <img
            src="https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2024/03/mau-xe-o-to-dien-thumbnail.jpg"
            className="object-cover w-full h-full rounded-lg"
            alt="Visual"
          />
        </div>

        {/* Right side: Login Form */}
        <div className="w-1/2 flex flex-col justify-center p-6">
          <h2 className="text-3xl font-bold text-center mb-2">Login</h2>
          <p className="text-center text-sm mb-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 underline">
              Sign up
            </Link>
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Account Name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="p-2 rounded bg-slate-500 text-white placeholder-gray-200 outline-none"
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 rounded bg-slate-500 text-white placeholder-gray-200 outline-none"
            />
            <button className="py-2 bg-[#4682A9] rounded text-white font-semibold hover:opacity-90">
              Login
            </button>
          </form>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-600" />
            <span className="mx-2 text-sm text-gray-400">Or Login with</span>
            <hr className="flex-grow border-gray-600" />
          </div>

          <div className="flex gap-4 font-bold justify-center">
            <button className="py-2 px-4 bg-[#3B5998] rounded text-white hover:opacity-90">
              Facebook
            </button>
            <button className="py-2 px-4 bg-[#DB4437] rounded text-white hover:opacity-90">
              Google
            </button>
            <button className="py-2 px-4 bg-[#1DA1F2] rounded text-white hover:opacity-90">
              Twitter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
// !!!!
