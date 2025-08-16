import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ShadCN Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Types and Schema
import type { ServiceType } from "@/features/dashboard/services/types";
import type { EditServiceFormData } from "@/features/dashboard/services/types";
import { getDefaultEditServiceFormValues } from "@/features/dashboard/services/lib/utils";
import {
  editOneOnOneCallSchema,
  editPriorityDMSchema,
  editServiceFormSchema,
  editWebinarSchema,
} from "@/features/dashboard/services/schemas/editService.schema";
import type z from "zod";
import NotFoundPage from "@/pages/NotFoundPage";
import Spinner from "@/components/ui/Spinner";

// Type guards for better type safety
const isOneOnOneCall = (
  data: EditServiceFormData
): data is z.infer<typeof editOneOnOneCallSchema> =>
  data.serviceType === "1-1-call";

const isPriorityDM = (
  data: EditServiceFormData
): data is z.infer<typeof editPriorityDMSchema> =>
  data.serviceType === "priority-dm";

const isWebinar = (
  data: EditServiceFormData
): data is z.infer<typeof editWebinarSchema> => data.serviceType === "webinar";

// const isServiceTypeValid = (serviceType: ServiceType): data is ServiceType => serviceType

// Service configuration
const serviceConfig = {
  "1-1-call": {
    title: "1-on-1 Call Service",
    description: "Configure your personal consultation service",
  },
  "priority-dm": {
    title: "Priority DM Service",
    description: "Set up priority direct messaging service",
  },
  webinar: {
    title: "Webinar Service",
    description: "Configure your webinar or group session",
  },
  "digital-product": {
    title: "Digital Product Service",
    description: "Configure your digital product service",
  },
  package: {
    title: "Package Service",
    description: "Configure your package service",
  },
};

const EditServicePage: React.FC = () => {
  const { serviceType, id } = useParams<{
    serviceType: ServiceType;
    id: string;
  }>();

  let defaultEditServiceFormValues;
  let isServiceTypeValid = true;

  try {
    // if(typeof serviceType !== ServiceType)
    defaultEditServiceFormValues = getDefaultEditServiceFormValues(
      serviceType!
    );
  } catch (error) {
    isServiceTypeValid = false;
  }

  const form = useForm<EditServiceFormData>({
    resolver: zodResolver(editServiceFormSchema),
    defaultValues: defaultEditServiceFormValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  // Load existing service data if editing
  useEffect(() => {
    if (serviceType && id) {
      const loadServiceData = async () => {
        try {
          // const response = await fetch(`/api/services/${serviceType}/${id}`);
          // const data = await response.json();
          // reset(data);

          // Mock data for demonstration
          console.log(`Loading service data for ${serviceType}/${id}`);
        } catch (error) {
          console.error("Failed to load service data:", error);
        }
      };

      loadServiceData();
    }
  }, [serviceType, id, reset]);

  if (!isServiceTypeValid) {
    return <NotFoundPage />;
  }

  const config = serviceConfig[serviceType!] || {
    title: "Service",
    description: "",
  };

  const onSubmit = async (data: EditServiceFormData) => {
    try {
      const url = id
        ? `/api/services/${serviceType}/${id}`
        : `/api/services/${serviceType}`;
      const method = id ? "PUT" : "POST";

      // Delay the UI update by 3 seconds
      await new Promise<void>((resolve, reject) =>
        setTimeout(() => {
          resolve();
          // reject("error");
        }, 3000)
      );

      console.log(`${method} ${url}`, data);
      // Replace with actual API call
      // await fetch(url, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
    } catch (error) {
      console.error("Failed to save service:", error);
    }
  };

  // Type-safe service-specific field rendering
  const renderServiceSpecificFields = () => {
    if (!serviceType) return null;

    switch (serviceType) {
      case "1-1-call":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Call Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Call Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter call duration..."
                        min="15"
                        max="180"
                        {...field}
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

              {/* <FormField
                control={form.control}
                name="meetingLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://zoom.us/j/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preparationNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preparation Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What should clients prepare before the call?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </CardContent>
          </Card>
        );

      case "priority-dm":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Priority DM Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="responseTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Response Time</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select response time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="immediate">
                          Immediate (within 15 min)
                        </SelectItem>
                        <SelectItem value="1-hour">Within 1 hour</SelectItem>
                        <SelectItem value="24-hours">
                          Within 24 hours
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="platforms"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Available Platforms
                      </FormLabel>
                    </div>
                    {["whatsapp", "telegram", "discord"].map((platform) => (
                      <FormField
                        key={platform}
                        control={form.control}
                        name="platforms"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={platform}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(platform)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          platform,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== platform
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal capitalize">
                                {platform}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxMessages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Messages per Session</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50"
                        {...field}
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
            </CardContent>
          </Card>
        );

      case "webinar":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Webinar Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Attendees</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="100"
                          min="1"
                          max="1000"
                          {...field}
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

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter call duration..."
                          min="30"
                          max="480"
                          {...field}
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
              </div>

              <FormField
                control={form.control}
                name="recordingEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Enable Recording</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="materials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Materials</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List required materials or tools for the webinar..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit {config.title}</h1>
          <p className="text-gray-600 mt-1">{config.description}</p>
        </div>
        <div className="text-sm text-gray-500">
          Service Type:{" "}
          <span className="font-medium capitalize">
            {serviceType?.replace("-", " ")}
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter service title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a short description..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Service-Specific Fields */}
          {renderServiceSpecificFields()}

          {/* Pricing Section */}
          <Card>
            <CardHeader>
              <CardTitle>Amount (₹)</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="pricing"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        ₹
                      </div>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          className="pl-8"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Alert className="mt-4">
                <AlertDescription>
                  ⚠️ Warning: Incorrect pricing information may result in
                  billing errors
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Configuration Section */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Service Configuration</CardTitle>
              <p className="text-sm text-gray-600">
                Configure additional settings and integrations
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="configurations.enableNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Enable push notifications</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="configurations.enableAnalytics"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Enable analytics tracking</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="configurations.enableSharing"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Enable social sharing</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card> */}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                "Edit Service"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditServicePage;
