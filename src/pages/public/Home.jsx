import {
  ArrowRight,
  ShieldCheck,
  FileText,
  UserCheck,
  BadgeDollarSign,
  Check,
  CreditCard,
  ChartColumn,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Accordion } from "@/components/ui/Field";
import {
  CtaBand,
  FactStrip,
  FeatureGrid,
  Section,
  SectionHeading,
  SplitFeature,
  Steps,
  TrialButton,
} from "@/components/marketing";
import DashboardPreview from "@/components/marketing/DashboardPreview";
import PayrollPreview from "@/components/marketing/PayrollPreview";

const roles = [
  { icon: FileText, title: "Employees log their work", text: "Record tasks and hours each day, fix mistakes, and see every salary payment with its receipt." },
  { icon: UserCheck, title: "HR verifies and requests pay", text: "Approve new accounts, check progress across the team, and send monthly pay requests to an admin." },
  { icon: BadgeDollarSign, title: "Admins approve and pay", text: "Review the payroll queue, pay through Stripe, and manage roles, salaries and access in one place." },
];

const facts = [
  { value: "Stripe", label: "confirms every payment before it is marked paid" },
  { value: "AES-256", label: "encryption on stored bank account numbers" },
  { value: "1 per month", label: "payroll request per person, duplicates blocked" },
  { value: "3 roles", label: "Employee, HR and Admin, each with its own view" },
];

const features = [
  { icon: CreditCard, title: "Stripe payments", text: "Salaries are only marked paid after Stripe confirms the payment, and the transaction ID is saved to the employee's history.", featured: true },
  { icon: ShieldCheck, title: "Role-based access", text: "Employees, HR and admins each see only what their role needs." },
  { icon: FileText, title: "Work sheets", text: "Daily entries with task, hours and date, plus weekly and monthly totals." },
  { icon: Check, title: "Payroll approvals", text: "One request per person per month. Duplicate requests are blocked automatically." },
  { icon: ChartColumn, title: "Payroll analytics", text: "Headcount, verification status and monthly payroll trends at a glance." },
];

const steps = [
  { title: "HR requests pay", text: "The month, year and salary are recorded with the request." },
  { title: "Admin reviews", text: "Approve or reject each request from the payroll queue." },
  { title: "Stripe confirms", text: "The admin pays by card through Stripe, and nothing is marked paid until Stripe confirms." },
  { title: "History updates", text: "The employee sees the payment and transaction ID right away." },
];

const faqs = [
  { q: "How long does setup take?", a: "Most teams are running in an afternoon. Invite your HR lead, have employees create their accounts, and verify them from the Employees page." },
  { q: "Do employees need to be trained?", a: "Rarely. Logging time is a single form, and the dashboard only shows the pages each role can use." },
  { q: "Who can pay salaries?", a: "Only admins. HR sends a request, and the admin reviews the amount and pays it through Stripe." },
  { q: "Where are payments processed?", a: "All card payments run through Stripe. PayNode never sees or stores full card numbers." },
];

export default function Home() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col gap-6">
            <Badge tone="brand" className="gap-2 self-start px-3 py-1.5 text-[13px]">
              <ShieldCheck size={14} aria-hidden="true" /> Salary payments confirmed by Stripe
            </Badge>
            <h1 className="text-[44px] font-extrabold leading-[1.05] tracking-[-0.035em] sm:text-6xl">
              Payroll and people ops, run from one ledger.
            </h1>
            <p className="max-w-[520px] text-[19px] leading-relaxed text-body">
              Employees log their hours, HR verifies and requests pay, and admins approve and pay through Stripe. Every step is on record.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <TrialButton arrow />
              <Button to="/features" variant="secondary" size="lg">See how it works</Button>
            </div>
          </div>
          <PayrollPreview />
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-6 pt-12 lg:pt-16">
        <FactStrip items={facts} />
      </section>

      <Section>
        <SectionHeading eyebrow="How it works" title="Three roles, one flow from hours worked to salary paid." />
        <div className="mt-12"><FeatureGrid items={roles} /></div>
      </Section>

      <Section tone="surface">
        <SplitFeature
          eyebrow="Built for HR teams"
          title="Spend payroll week checking numbers, not chasing them."
          description="PayNode keeps hours, approvals and payments in one place, so HR can see who has logged their time, who is verified, and whose pay is waiting."
          bullets={[
            "See unverified accounts the moment someone signs up",
            "Filter everyone's work sheets by person and month",
            "Send pay requests with the salary already filled in",
          ]}
          visual={<DashboardPreview />}
          action={<Button to="/features" variant="secondary" className="self-start">Explore features <ArrowRight size={16} aria-hidden="true" /></Button>}
        />
      </Section>

      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Features" title="Everything payroll needs, nothing it doesn't." />
          <Button to="/features" variant="ghost" className="text-brand-dark">All features <ArrowRight size={16} aria-hidden="true" /></Button>
        </div>
        <div className="mt-12"><FeatureGrid items={features} /></div>
      </Section>

      <Section tone="ink">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading dark eyebrow="Audit trail" title="Every payment leaves a trail." description="Who requested it, who approved it, and the Stripe transaction that paid it, saved against the employee's history." />
          <Button to="/security" variant="light">How we keep it safe</Button>
        </div>
        <div className="mt-12"><Steps items={steps} dark /></div>
      </Section>

      <Section tone="surface" containerClassName="max-w-[820px]">
        <SectionHeading title="Frequently asked questions" />
        <div className="mt-10"><Accordion items={faqs} /></div>
      </Section>

      <CtaBand />
    </>
  );
}
