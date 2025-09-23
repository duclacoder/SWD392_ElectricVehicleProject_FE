import type { FC, ReactNode } from "react";
import { Sidebar } from "../../Widgets/Sidebars/Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
};
