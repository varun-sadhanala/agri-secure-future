
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  
  const navItems = [
    { name: "Overview", path: "/dashboard" },
    { name: "Loan Applications", path: "/loan" },
    { name: "Insurance", path: "/insurance" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div className="hidden md:block w-64 bg-secondary/30 border-r">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-md text-sm font-medium",
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
