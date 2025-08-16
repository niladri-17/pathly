import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { addOneOnOneCallSchema } from "../../schemas/addOneOneOneCall.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AddOneOnOneCallFormData } from "../../types";
import Spinner from "@/components/ui/Spinner";

const AddOneOnOneCallForm: React.FC = () => {
  const form = useForm<AddOneOnOneCallFormData>({
    resolver: zodResolver(addOneOnOneCallSchema),
    defaultValues: {
      title: "",
      duration: 0,
      amount: 0,
    },
    mode: "onChange",
  });

  const onSubmit = async () => {
    try {
      // Delay the UI update by 3 seconds
      await new Promise<void>((resolve, reject) =>
        setTimeout(() => {
          resolve();
          // reject("error");
        }, 3000)
      );
    } catch (error) {
      console.error("Failed to save service:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="max-w-lg space-y-4">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="title">Title</FormLabel>
                <FormControl>
                  <Input
                    id="title"
                    placeholder="Name of Service"
                    className="mt-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Duration */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="duration">Duration</FormLabel>
                <FormControl>
                  <Input
                    id="duration"
                    placeholder="Duration"
                    className="mt-1"
                    type="number"
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="amount">Amount (₹)</FormLabel>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <FormControl>
                    <Input
                      id="amount"
                      type="number"
                      className="pl-8"
                      placeholder="0"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      value={field.value || ""}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {form.formState.isSubmitting ? (
              <>
                <Spinner />
                Creating...
              </>
            ) : (
              "Next: Customize"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddOneOnOneCallForm;
