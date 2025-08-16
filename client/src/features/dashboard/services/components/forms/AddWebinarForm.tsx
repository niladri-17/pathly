import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { SessionDatePicker } from "../ui/SessionDatePicker";

// Simple Label component
// const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({
//   className,
//   children,
//   ...props
// }) => (
//   <label
//     className={cn(
//       "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
//       className
//     )}
//     {...props}
//   >
//     {children}
//   </label>
// );

interface FormData {
  title: string;
  duration: string;
  sessionDate: string;
  sessionTime: string;
  amount: string;
  addMeetingClient: boolean;
}

const AddWebinarForm = () => {
  const [totalSessions, setTotalSessions] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    duration: "",
    sessionDate: "2025-08-10",
    sessionTime: "12:00 AM",
    amount: "0",
    addMeetingClient: true,
  });

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="max-w-lg space-y-4">
      {/* Title */}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Name of Service"
          className="mt-1"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
        />
      </div>

      {/* Duration */}
      <div>
        <Label htmlFor="duration">Duration (mins)</Label>
        <Input
          id="duration"
          type="number"
          placeholder="60"
          className="mt-1"
          value={formData.duration}
          onChange={(e) => handleInputChange("duration", e.target.value)}
        />
      </div>

      {/* Session Date and Time */}
      <div>
        <Label>Session</Label>
        {Array.from({ length: totalSessions }, (_, i) => (
          <SessionDatePicker key={i} />
        ))}

        {/* Create multiple sessions link */}
        <Button
          type="button"
          className="flex items-center gap-1 mt-3"
          onClick={() => setTotalSessions((prev) => prev + 1)}
        >
          <Plus className="h-3 w-3" />
          Create multiple sessions
        </Button>
      </div>

      {/* Amount */}
      <div>
        <Label htmlFor="amount">Amount (₹)</Label>
        <div className="relative mt-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            ₹
          </span>
          <Input
            id="amount"
            type="number"
            className="pl-8"
            placeholder="0"
            value={formData.amount}
            onChange={(e) => handleInputChange("amount", e.target.value)}
          />
        </div>
      </div>

      {/* Hosting Options */}
      <div>
        <Label>Hosting options</Label>
        <div className="mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={formData.addMeetingClient}
              onChange={(e) =>
                handleInputChange("addMeetingClient", e.target.checked)
              }
            />
            <span className="text-sm text-gray-700">Add meeting client</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <Button className="w-full">Next: Customize</Button>
    </div>
  );
};

export default AddWebinarForm;
