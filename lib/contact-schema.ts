import { z } from "zod";

export const INDUSTRY_IDS = ["factory", "retail", "insurance", "legal", "other"] as const;

/** Accepts Israeli numbers with/without +972, with optional spaces/dashes. */
const IL_PHONE_REGEX = /^(\+972|0)([23489]\d{7}|5\d{8}|7\d{7,8})$/;

function normalizePhone(value: string) {
  return value.replace(/[\s-]/g, "");
}

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "errors.required"),
  businessName: z.string().trim().min(1, "errors.required"),
  phone: z
    .string()
    .trim()
    .min(1, "errors.required")
    .refine((v) => IL_PHONE_REGEX.test(normalizePhone(v)), "errors.phoneInvalid"),
  email: z.string().trim().min(1, "errors.required").email("errors.emailInvalid"),
  industry: z
    .string()
    .refine((v) => (INDUSTRY_IDS as readonly string[]).includes(v), "errors.required"),
  processToAutomate: z.string().trim().min(1, "errors.required"),
  description: z.string().trim(),
  consent: z.boolean().refine((v) => v === true, "errors.consentRequired"),
  honeypot: z.string(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const contactDefaultValues: ContactFormValues = {
  fullName: "",
  businessName: "",
  phone: "",
  email: "",
  industry: "",
  processToAutomate: "",
  description: "",
  consent: false,
  honeypot: "",
};
