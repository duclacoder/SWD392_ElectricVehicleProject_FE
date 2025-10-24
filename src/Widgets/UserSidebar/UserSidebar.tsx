// src/components/UserSidebar.tsx
import React from "react";
import {
  UserOutlined,
  CarOutlined,
  ThunderboltOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom"; // Import Link and useLocation

interface UserSidebarProps {}

const UserSidebar: React.FC<UserSidebarProps> = () => {
  const location = useLocation(); // Get the current URL path

  // Helper function to render a menu item div with Tailwind styles
  const renderMenuItem = (
    key: string, // Unique identifier for the menu item
    path: string, // The actual route path
    icon: React.ReactNode,
    label: string
  ) => (
    <Link // Use Link component for navigation
      key={key}
      to={path}
      className={`flex items-center p-3 text-white cursor-pointer hover:bg-gray-700 transition-colors duration-200 ${
        location.pathname === path ? "bg-blue-600 font-bold" : "" // Highlight based on current URL
      }`}
    >
      <span className="mr-3 text-xl">{icon}</span>
      <span className="text-base">{label}</span>
    </Link>
  );

  return (
    <div className="w-[250px] bg-[#001529] shadow-lg flex-shrink-0">
      <div className="logo p-4 text-white text-xl font-bold">Menu</div>
      <nav>
        {renderMenuItem("profile", "/profile", <UserOutlined />, "Profile")}
        {renderMenuItem("view-car", "/ViewCar", <CarOutlined />, "View Car")}
        {renderMenuItem(
          "view-battery",
          "/ViewBattery",
          <ThunderboltOutlined />,
          "View Battery"
        )}
        {renderMenuItem(
          "transaction-history",
          "/TransactionHistory",
          <HistoryOutlined />,
          "Transaction History"
        )}
        {renderMenuItem(
          "add-car",
          "/AddCar",
          <ThunderboltOutlined />,
          "Add Car"
        )}
        {renderMenuItem(
          "add-battery",
          "/AddBattery",
          <ThunderboltOutlined />,
          "Add Battery"
        )}
        {/* {renderMenuItem(
          "view-inspection-fee",
          "/InspectionFee",
          <ThunderboltOutlined />,
          "View Inspection Fee"
        )} */}
      </nav>
    </div>
  );
};

export default UserSidebar;
