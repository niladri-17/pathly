import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const AddPriorityDmForm: React.FC = () => {
  return (
    <div className="max-w-lg space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Name of Service" className="mt-1" />
      </div>

      <div>
        <Label htmlFor="amount">Amount (₹)</Label>
        <div className="relative mt-1">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            ₹
          </span>
          <Input id="amount" type="number" className="pl-8" placeholder="0" />
        </div>
      </div>

      <Button className="w-full">Next: Customize</Button>
    </div>
  );
};

export default AddPriorityDmForm;
