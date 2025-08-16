import type { addOneOnOneCallSchema } from "../schemas/addOneOneOneCall.schema";
import { editServiceFormSchema } from "../schemas/editService.schema";
import z from "zod";

export type ServiceType =
  | "1-1-call"
  | "priority-dm"
  | "webinar"
  | "digital-product"
  | "package";

export interface ServiceOption {
  type: ServiceType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export type EditServiceFormData = z.infer<typeof editServiceFormSchema>;
export type AddOneOnOneCallFormData = z.infer<typeof addOneOnOneCallSchema>;
