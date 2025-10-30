import {
  CarOutlined,
  DownOutlined,
  FileTextOutlined,
  HistoryOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const UserSidebar: React.FC = () => {
  const location = useLocation();

  // Dropdown states
  const [isCarOpen, setIsCarOpen] = useState(false);
  const [isBatteryOpen, setIsBatteryOpen] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);

  const renderMenuItem = (
    key: string,
    path: string,
    icon: React.ReactNode,
    label: string
  ) => (
    <Link
      key={key}
      to={path}
      className={`flex items-center p-3 pl-8 text-white cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${
        location.pathname === path ? "bg-blue-600 font-bold" : ""
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="w-[250px] bg-[#001529] shadow-lg flex-shrink-0">
      <div className="logo p-4 text-white text-xl font-bold">Menu</div>
      <nav className="text-white">
        {/* Profile */}
        <Link
          to="/profile"
          className={`flex items-center p-3 cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${
            location.pathname === "/profile" ? "bg-blue-600 font-bold" : ""
          }`}
        >
          <UserOutlined className="mr-3" />
          Profile
        </Link>

        {/* Car Dropdown */}
        <div>
          <div
            className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${
              location.pathname.includes("Car") ? "bg-blue-600 font-bold" : ""
            }`}
            onClick={() => setIsCarOpen(!isCarOpen)}
          >
            <div className="flex items-center">
              <CarOutlined className="mr-3" /> Car
            </div>
            <DownOutlined
              className={`transform transition-transform ${
                isCarOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          {isCarOpen && (
            <div>
              {renderMenuItem(
                "view-car",
                "/ViewCar",
                <CarOutlined />,
                "View Car"
              )}
              {renderMenuItem("add-car", "/AddCar", <CarOutlined />, "Add Car")}
            </div>
          )}
        </div>

        {/* Battery Dropdown */}
        <div>
          <div
            className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${
              location.pathname.includes("Battery")
                ? "bg-blue-600 font-bold"
                : ""
            }`}
            onClick={() => setIsBatteryOpen(!isBatteryOpen)}
          >
            <div className="flex items-center">
              <ThunderboltOutlined className="mr-3" /> Battery
            </div>
            <DownOutlined
              className={`transform transition-transform ${
                isBatteryOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          {isBatteryOpen && (
            <div>
              {renderMenuItem(
                "view-battery",
                "/ViewBattery",
                <ThunderboltOutlined />,
                "View Battery"
              )}
              {renderMenuItem(
                "add-battery",
                "/AddBattery",
                <ThunderboltOutlined />,
                "Add Battery"
              )}
            </div>
          )}
        </div>

        <div>
          <div
            className={`flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${
              location.pathname.includes("Post") ? "bg-blue-600 font-bold" : ""
            }`}
            onClick={() => setIsPostOpen(!isPostOpen)}
          >
            <div className="flex items-center">
              <FileTextOutlined className="mr-3" /> Post Managemen
            </div>
            <DownOutlined
              className={`transform transition-transform ${
                isPostOpen ? "rotate-180" : ""
              }`}
            />
          </div>
          {isPostOpen && (
            <div>
              {renderMenuItem(
                "view-post",
                "/ViewPost",
                <FileTextOutlined />,
                "View Posts"
              )}
            </div>
          )}
        </div>

        {/* Transaction History */}
        <Link
          to="/TransactionHistory"
          className={`flex items-center p-3 cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${
            location.pathname === "/TransactionHistory"
              ? "bg-blue-600 font-bold"
              : ""
          }`}
        >
          <HistoryOutlined className="mr-3" />
          Transaction History
        </Link>
      </nav>
    </div>
  );
};

export default UserSidebar;
