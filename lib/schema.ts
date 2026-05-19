import { z } from "zod";

export const PARCEL_COUNT_OPTIONS = [
  { value: "1", label: "1 parcel" },
  { value: "2-4", label: "2 – 4 parcels" },
  { value: "5-9", label: "5 – 9 parcels" },
  { value: "10+", label: "10+ parcels (custom quote)" },
] as const;

export const ORIGIN_OPTIONS = [
  { value: "eu", label: "Within the EU" },
  { value: "extra-eu", label: "Outside the EU" },
  { value: "mixed", label: "Mixed / not sure" },
] as const;

export const CHANNEL_OPTIONS = [
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
] as const;

export const contactSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your full name."),
    email: z.string().trim().email("Please enter a valid email address."),
    phone: z.string().trim().optional().or(z.literal("")),
    country: z
      .string()
      .trim()
      .min(2, "Please pick a destination country."),
    address: z
      .string()
      .trim()
      .min(5, "Please enter the full delivery address.")
      .max(500, "Please keep the address under 500 characters."),
    itemDescription: z
      .string()
      .trim()
      .min(3, "Please describe what you're shipping.")
      .max(500, "Please keep the description under 500 characters."),
    parcels: z.enum(["1", "2-4", "5-9", "10+"], {
      message: "Please select an estimated number of parcels.",
    }),
    origin: z.enum(["eu", "extra-eu", "mixed"], {
      message: "Please select the origin.",
    }),
    notes: z
      .string()
      .trim()
      .max(1000, "Please keep notes under 1000 characters.")
      .optional()
      .or(z.literal("")),
    channel: z.enum(["email", "whatsapp"], {
      message: "Please choose how we should reply.",
    }),
    acceptTerms: z.literal(true, {
      message: "You must accept the Terms & Conditions and Privacy Policy.",
    }),
    acceptClauses: z.literal(true, {
      message:
        "You must specifically approve clauses 3.2(b), 3.10, 4.5, 5.9 and 8.2.",
    }),
  })
  .refine(
    (data) => data.channel !== "whatsapp" || (data.phone && data.phone.length >= 6),
    {
      message: "Please provide a WhatsApp number when choosing WhatsApp.",
      path: ["phone"],
    }
  );

export type ContactInput = z.infer<typeof contactSchema>;
