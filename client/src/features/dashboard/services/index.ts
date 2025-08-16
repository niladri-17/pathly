import { addOneOnOneCall } from "./schemas/addOneOneOneCall.schema";
import z from "zod";

export type AddOneOnOneCallType = z.infer<typeof addOneOnOneCall>;
