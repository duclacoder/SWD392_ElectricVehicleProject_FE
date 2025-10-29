import {
  Car,
  DollarSign,
  Gavel,
  Home,
  LayoutDashboard,
  LogOut,
  Users,
  Package
} from "lucide-react";
import type { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logout } from "../../features/Logout";
import logo from "../../shared/assets/logo.png";

const navLinks = [
  { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
  { name: "Users", href: "/admin/users", icon: <Users size={20} /> },
  { name: "Vehicles", href: "/admin/vehicles", icon: <Car size={20} /> },
  {
    name: "Auctions Fee",
    href: "/admin/auctions-fee",
    icon: <DollarSign size={20} />,
  },
  { name: "Auctions", href: "/admin/auctions", icon: <Gavel size={20} /> },
  { name: "PostPackage", href: "/admin/postPackages", icon: <Package size={20} /> }
];

const bottomLinks = [
  { name: "Homepage", href: "/", icon: <Home size={20} /> },
  {
    name: "Logout",
    icon: <LogOut size={20} />,
    onClick: Logout,
  },
];

export const Sidebar: FC = () => {
  const location = useLocation();

  const linkClasses = (href: string) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${location.pathname === href
      ? "bg-sky-600 text-white"
      : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col p-4">
      <div className="flex items-center gap-3 mb-8 px-4">
        <img src={logo} alt="Logo" className="h-10 w-10" />
        <span className="text-xl font-bold text-gray-800">Adminator</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.href}
            className={linkClasses(link.href)}
          >
            {link.icon}
            <span className="font-medium">{link.name}</span>
          </Link>
        ))}
      </nav>

      <div className="space-y-2">
        {bottomLinks.map((link) =>
          link.href ? (
            <Link
              key={link.name}
              to={link.href}
              className={linkClasses(link.href)}
            >
              {link.icon}
              <span className="font-medium">{link.name}</span>
            </Link>
          ) : (
            <button
              key={link.name}
              onClick={link.onClick}
              className={`${linkClasses("")} w-full text-left`}
            >
              {link.icon}
              <span className="font-medium">{link.name}</span>
            </button>
          )
        )}
      </div>
    </aside>
  );
};
