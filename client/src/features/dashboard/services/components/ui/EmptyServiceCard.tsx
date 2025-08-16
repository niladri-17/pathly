import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyServiceCard: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      {/* Illustration */}
      <div className="mb-8">
        <svg
          width="200"
          height="160"
          viewBox="0 0 200 160"
          fill="none"
          className="mx-auto"
        >
          {/* Monitor/Dashboard */}
          <rect
            x="20"
            y="20"
            width="80"
            height="50"
            rx="4"
            fill="none"
            stroke="#374151"
            strokeWidth="2"
          />
          <rect x="25" y="25" width="15" height="12" fill="#3B82F6" />
          <rect x="45" y="25" width="15" height="18" fill="#10B981" />
          <rect x="65" y="25" width="15" height="8" fill="#F59E0B" />
          <rect x="85" y="25" width="10" height="15" fill="#EF4444" />

          {/* Monitor stand */}
          <rect x="55" y="70" width="10" height="8" fill="#374151" />
          <rect x="45" y="78" width="30" height="4" fill="#374151" />

          {/* Document/Paper */}
          <rect
            x="120"
            y="15"
            width="30"
            height="40"
            rx="2"
            fill="white"
            stroke="#374151"
            strokeWidth="2"
          />
          <line
            x1="125"
            y1="25"
            x2="145"
            y2="25"
            stroke="#9CA3AF"
            strokeWidth="1"
          />
          <line
            x1="125"
            y1="30"
            x2="140"
            y2="30"
            stroke="#9CA3AF"
            strokeWidth="1"
          />
          <line
            x1="125"
            y1="35"
            x2="145"
            y2="35"
            stroke="#9CA3AF"
            strokeWidth="1"
          />

          {/* Small device/phone */}
          <rect
            x="160"
            y="25"
            width="18"
            height="28"
            rx="3"
            fill="white"
            stroke="#374151"
            strokeWidth="2"
          />
          <circle cx="169" cy="30" r="2" fill="#3B82F6" />

          {/* Person figure */}
          <g transform="translate(80, 90)">
            {/* Head */}
            <circle
              cx="20"
              cy="15"
              r="12"
              fill="#FDE68A"
              stroke="#374151"
              strokeWidth="2"
            />

            {/* Body */}
            <rect x="8" y="25" width="24" height="30" rx="12" fill="#1F2937" />

            {/* Arms */}
            <ellipse cx="-2" cy="35" rx="6" ry="12" fill="#FDE68A" />
            <ellipse cx="42" cy="35" rx="6" ry="12" fill="#FDE68A" />

            {/* Hand holding paper */}
            <rect
              x="44"
              y="28"
              width="12"
              height="16"
              rx="2"
              fill="white"
              stroke="#374151"
              strokeWidth="1"
            />
          </g>

          {/* Gear/Settings icon */}
          <g transform="translate(30, 100)">
            <circle
              cx="0"
              cy="0"
              r="12"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
            />
            <circle
              cx="0"
              cy="0"
              r="4"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
            />
            <path d="M0,-12 L3,-9 L0,-6 L-3,-9 Z" fill="#9CA3AF" />
            <path d="M12,0 L9,3 L6,0 L9,-3 Z" fill="#9CA3AF" />
            <path d="M0,12 L-3,9 L0,6 L3,9 Z" fill="#9CA3AF" />
            <path d="M-12,0 L-9,-3 L-6,0 L-9,3 Z" fill="#9CA3AF" />
          </g>

          {/* Light bulb */}
          <g transform="translate(45, 105)">
            <path
              d="M0,-8 C-4,-8 -6,-4 -6,0 C-6,2 -4,4 -2,5 L-2,8 L2,8 L2,5 C4,4 6,2 6,0 C6,-4 4,-8 0,-8 Z"
              fill="#FEF3C7"
              stroke="#F59E0B"
              strokeWidth="1"
            />
            <rect x="-2" y="6" width="4" height="2" fill="#F59E0B" />
          </g>
        </svg>
      </div>

      {/* Heading */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-3">
        Sell digital products
      </h2>

      {/* Description */}
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        Digital products are a great source of side income.
      </p>

      {/* Add Button */}
      <Link to="/dashboard/services/add">
        <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-md font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </Link>
    </div>
  );
};

export default EmptyServiceCard;
