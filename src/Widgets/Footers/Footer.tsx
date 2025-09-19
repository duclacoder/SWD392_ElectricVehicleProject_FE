import type { FC } from "react";
import logo from "../../shared/assets/logo.png";

export const Footer: FC = () => {
    return (
        <footer className="w-full bg-gray-900 text-gray-200 py-6 mt-10">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">

                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <img src={logo} alt="Logo" className="h-8 w-auto" />
                    <span className="text-xl font-bold text-gray-800">EVCMS</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold">⚡ EV Project</span>
                </div>

                {/* Links */}
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white">
                        About
                    </a>
                    <a href="#" className="hover:text-white">
                        Contact
                    </a>
                    <a href="#" className="hover:text-white">
                        Privacy
                    </a>
                </div>
            </div>
        </footer>
    );
};
