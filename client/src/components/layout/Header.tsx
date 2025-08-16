import React from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-8 py-2 rounded-3xl border px-6 bg-background shadow-md">
      <h1 className="text-2xl font-bold text-primary">Pathly</h1>
      <ThemeToggle />
    </div>
  );
};

export default Header;
