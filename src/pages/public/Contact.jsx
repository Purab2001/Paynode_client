import { useSearchParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Briefcase, LifeBuoy, ShieldCheck, Clock } from "lucide-react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { PageHero, Section } from "@/components/marketing";
import { site } from "@/config/site";
import { useSendContact } from "@/features/contact/api";
import { reportError } from "@/lib/reportError";

const topics = [
  { value: "sales", label: "Sales and pricing", description: "Plans, demos and Enterprise" },
  { value: "support", label: "Product support", description: "Help with your account" },
  { value: "billing", label: "Billing", description: "Invoices and payments" },
  { value: "other", label: "Something else" },
];

const sizes = ["1–10 employees", "11–50 employees", "51–200 employees", "200+ employees"];

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid work email"),
  company: z.string().trim().optional(),
  size: z.string().min(1, "Choose your team size"),
  topic: z.string().min(1, "Choose a topic"),
  message: z.string().trim().min(20, "Please add a few more details (at least 20 characters)"),
  website: z.string().optional(), // honeypot
});

const channels = [
  { icon: Briefcase, title: "Sales", text: "Pricing, demos and Enterprise plans.", email: site.emails.sales },
  { icon: LifeBuoy, title: "Support", text: "Help with your account or a payroll run.", email: site.emails.support },
  { icon: ShieldCheck, title: "Security", text: "Report a vulnerability or ask about data handling.", email: site.emails.security },
];

export default function Contact() {
  const [params] = useSearchParams();
  const initialTopic = topics.some((t) => t.value === params.get("topic")) ? params.get("topic") : "";

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { topic: initialTopic, size: "" } });

  const send = useSendContact();
  const onSubmit = async (values) => {
    try {
      await send.mutateAsync(values);
      toast.success(`Thanks! We'll reply ${site.responseTime}.`);
      reset({ topic: "", size: "", name: "", email: "", company: "", message: "" });
    } catch (err) {
      reportError(err);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the PayNode team."
        description={`Questions about plans, setup or a payroll run? Send us a message and a real person will reply ${site.responseTime}.`}
      />
      <Section containerClassName="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5 rounded-2xl border border-line p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" error={errors.name?.message}>
              <Input autoComplete="name" placeholder="Jane Cooper" invalid={!!errors.name} {...register("name")} />
            </Field>
            <Field label="Work email" error={errors.email?.message}>
              <Input type="email" autoComplete="email" placeholder="jane@company.com" invalid={!!errors.email} {...register("email")} />
            </Field>
            <Field label="Company" optional>
              <Input autoComplete="organization" placeholder="Company name" {...register("company")} />
            </Field>
            <Field label="Team size" error={errors.size?.message}>
              <Controller
                control={control}
                name="size"
                render={({ field }) => (
                  <Select value={field.value} onChange={field.onChange} options={sizes} placeholder="Select team size" invalid={!!errors.size} />
                )}
              />
            </Field>
          </div>
          <Field label="What can we help with?" error={errors.topic?.message}>
            <Controller
              control={control}
              name="topic"
              render={({ field }) => (
                <Select value={field.value} onChange={field.onChange} options={topics} placeholder="Choose a topic" invalid={!!errors.topic} />
              )}
            />
          </Field>
          <Field label="Message" error={errors.message?.message}>
            <Textarea
              placeholder="Tell us about your team and what you'd like to set up."
              invalid={!!errors.message}
              {...register("message")}
            />
          </Field>
          {/* Honeypot: invisible to people and screen readers, bots tend to fill it in. */}
          <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] size-0 opacity-0" {...register("website")} />
          <Button type="submit" size="lg" disabled={isSubmitting} className="sm:self-start">
            {isSubmitting ? "Sending…" : "Send message"}
          </Button>
          <p className="text-[13px] text-muted">We only use your details to reply to this message.</p>
        </form>

        <aside className="flex flex-col gap-4">
          {channels.map(({ icon: Icon, title, text, email }) => (
            <div key={title} className="flex gap-4 rounded-2xl border border-line p-5">
              <span className="grid size-11 flex-none place-items-center rounded-xl bg-brand-soft text-brand-dark">
                <Icon size={20} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="font-extrabold">{title}</h2>
                <p className="mt-0.5 text-sm text-body">{text}</p>
                <a href={`mailto:${email}`} className="mt-1.5 inline-block text-sm font-bold text-brand-dark hover:underline">{email}</a>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3 rounded-2xl bg-surface p-5 text-sm text-body">
            <Clock size={18} aria-hidden="true" className="flex-none text-brand" />
            Support hours: {site.supportHours}
          </div>
        </aside>
      </Section>
    </>
  );
}
