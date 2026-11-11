import { z } from "zod";

/** Accepts Israeli numbers with/without +972, with optional spaces/dashes. */
const IL_PHONE_REGEX = /^(\+972|0)([23489]\d{7}|5\d{8}|7\d{7,8})$/;

function normalizePhone(value: string) {
  return value.replace(/[\s-]/g, "");
}

// Kept short on purpose: name + phone is enough to call back. Email and the
// process description are optional so the form doesn't put people off.
export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "errors.required"),
  phone: z
    .string()
    .trim()
    .min(1, "errors.required")
    .refine((v) => IL_PHONE_REGEX.test(normalizePhone(v)), "errors.phoneInvalid"),
  email: z.union([z.literal(""), z.string().trim().email("errors.emailInvalid")]),
  description: z.string().trim(),
  consent: z.boolean().refine((v) => v === true, "errors.consentRequired"),
  honeypot: z.string(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const contactDefaultValues: ContactFormValues = {
  fullName: "",
  phone: "",
  email: "",
  description: "",
  consent: false,
  honeypot: "",
};
