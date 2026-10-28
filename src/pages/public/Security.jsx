import { ShieldCheck, LockKeyhole, CreditCard, Webhook, UserX, History, Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import { CtaBand, FeatureGrid, PageHero, Section, SectionHeading, SplitFeature, Steps } from "@/components/marketing";
import { images } from "@/lib/images";
import { site } from "@/config/site";

const practices = [
  { icon: ShieldCheck, title: "Role checks on every request", text: "Our servers check who you are and what your role allows on every request. Hiding a button is never the only protection." },
  { icon: LockKeyhole, title: "Encrypted bank details", text: "Bank account numbers are encrypted at rest and only the last four digits are shown in the app." },
  { icon: CreditCard, title: "Card data stays with Stripe", text: "Card details are entered into Stripe's secure fields. They never pass through or get stored on PayNode's servers." },
  { icon: Webhook, title: "Payments confirmed by Stripe", text: "A payroll request is only marked paid when Stripe tells us the payment succeeded, not when the browser says so." },
  { icon: UserX, title: "Instant access removal", text: "When an admin deactivates an account, that person is signed out of every request straight away." },
  { icon: History, title: "A record of every change", text: "Salary changes, role changes and approvals are logged with who made them and when." },
];

const steps = [
  { title: "Request is checked", text: "Only HR can request pay, and only once per person per month." },
  { title: "Amount is fixed", text: "The amount comes from the employee record on our servers, never from the browser." },
  { title: "Stripe processes it", text: "The admin pays through Stripe's secure card form." },
  { title: "Webhook confirms", text: "Stripe's signed webhook marks the request paid and stores the receipt." },
];

export default function Security() {
  return (
    <>
      <PageHero
        eyebrow="Security"
        title="Payroll data is sensitive. We treat it that way."
        description="Salaries, bank details and payment records deserve more than a login screen. Here's how PayNode protects them."
        image={images.focusedDesk}
      />

      <Section>
        <SectionHeading eyebrow="Our practices" title="Built so the safe thing is the default." />
        <div className="mt-12"><FeatureGrid items={practices} /></div>
      </Section>

      <Section tone="ink">
        <SectionHeading dark eyebrow="Payments" title="How a salary payment is protected" description="Each step is checked on our servers before the next one can happen." />
        <div className="mt-12"><Steps items={steps} dark /></div>
      </Section>

      <Section>
        <SplitFeature
          eyebrow="Your data"
          title="You stay in control of your company's records."
          description="Your payroll history belongs to you. We keep it accurate, keep it private, and make it easy to take with you."
          bullets={[
            "Only people in your company can see your data",
            "Admins can review and change everyone's access at any time",
            "Request a full export or deletion of your account data",
            "Sign-in is handled by Firebase Authentication, with Google sign-in supported",
          ]}
          image={images.cardPayment}
        />
      </Section>

      <Section tone="surface">
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-line bg-card p-8 sm:flex-row sm:items-center sm:p-10">
          <span className="grid size-14 flex-none place-items-center rounded-2xl bg-brand-soft text-brand-dark">
            <Mail size={26} aria-hidden="true" />
          </span>
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold">Found a security issue?</h2>
            <p className="mt-2 leading-relaxed text-body">
              Email us at <a href={`mailto:${site.emails.security}`} className="font-bold text-brand-dark hover:underline">{site.emails.security}</a> with the details and steps to reproduce. We reply {site.responseTime} and keep you updated until it's fixed.
            </p>
          </div>
          <Button href={`mailto:${site.emails.security}`} variant="secondary">Report an issue</Button>
        </div>
      </Section>

      <CtaBand title="Questions about security?" description="Our team is happy to walk your IT or finance lead through how PayNode handles data." />
    </>
  );
}
