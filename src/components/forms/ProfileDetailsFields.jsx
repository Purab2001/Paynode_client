import { z } from "zod";
import { Field, Input } from "@/components/ui/Field";

/** Validation for the employment details every PayNode profile needs. */
export const profileDetailsSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  designation: z.string().trim().min(2, "Enter your job title"),
  salary: z
    .string()
    .transform((v) => Number(v.replace(/[,\s$]/g, "")))
    .pipe(z.number({ error: "Enter a number" }).positive("Enter your monthly salary").max(1_000_000, "That looks too high")),
  bankAccount: z.string().trim().regex(/^\d{6,20}$/, "Use 6–20 digits, no spaces"),
});

/** Job title, salary and bank account inputs. Pass react-hook-form's `register` and `errors`. */
export default function ProfileDetailsFields({ register, errors }) {
  return (
    <>
      <Field label="Job title" error={errors.designation?.message}>
        <Input autoComplete="organization-title" placeholder="Product Designer" invalid={!!errors.designation} {...register("designation")} />
      </Field>
      <Field label="Monthly salary (USD)" hint="As agreed in your contract." error={errors.salary?.message}>
        <Input inputMode="decimal" placeholder="4,500" invalid={!!errors.salary} {...register("salary")} />
      </Field>
      <Field label="Bank account number" hint="Encrypted. Only the last 4 digits are ever shown." error={errors.bankAccount?.message} className="sm:col-span-2">
        <Input inputMode="numeric" autoComplete="off" placeholder="0123456789" invalid={!!errors.bankAccount} {...register("bankAccount")} />
      </Field>
    </>
  );
}
