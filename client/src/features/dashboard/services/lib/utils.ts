import type { EditServiceFormData } from "../types";

export const getDefaultEditServiceFormValues = (
  serviceType: string
): Partial<EditServiceFormData> => {
  const baseDefaults = {
    title: "",
    description: "",
    pricing: "",
    // configurations: {
    //   enableNotifications: false,
    //   enableAnalytics: false,
    //   enableSharing: false,
    // },
  };

  switch (serviceType) {
    case "1-1-call":
      return {
        ...baseDefaults,
        serviceType: "1-1-call" as const,
        duration: 60,
        // meetingLink: "",
        // preparationNotes: "",
      };

    case "priority-dm":
      return {
        ...baseDefaults,
        serviceType: "priority-dm" as const,
        responseTime: "1-hour" as const,
        platforms: [],
        maxMessages: 50,
      };

    case "webinar":
      return {
        ...baseDefaults,
        serviceType: "webinar" as const,
        capacity: 100,
        duration: 60,
        recordingEnabled: false,
        materials: "",
      };

    default:
      // navigate("/")
      throw new Error(`Unknown service type: ${serviceType}`);
  }
};
