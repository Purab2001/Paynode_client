import {
  ArrowRight,
  LayoutGrid,
  Receipt,
  MessageSquare,
  CopyX,
  Smartphone,
  History,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { CtaBand, FeatureGrid, PageHero, Section, SectionHeading, SplitFeature, TrialButton } from "@/components/marketing";
import PayrollPreview from "@/components/marketing/PayrollPreview";
import WorksheetPreview from "@/components/marketing/WorksheetPreview";
import { images } from "@/lib/images";

const details = [
  { icon: LayoutGrid, title: "A dashboard for every role", text: "Employees see their hours and pay, HR sees the team, admins see the whole company." },
  { icon: Receipt, title: "Payment history", text: "Every salary payment is listed with its month, amount and Stripe transaction ID." },
  { icon: CopyX, title: "Duplicate protection", text: "PayNode blocks a second pay request for the same person and month." },
  { icon: History, title: "Audit trail", text: "Role changes, salary changes and approvals are recorded with who made them." },
  { icon: MessageSquare, title: "Team chat", text: "Questions about hours or pay stay next to the work they're about." },
  { icon: Smartphone, title: "Works on any device", text: "Log time from a phone or approve payroll from a laptop. Same account, same data." },
];

export default function Features() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Everything between a logged hour and a paid salary."
        description="PayNode connects time tracking, HR checks and salary payments, so nothing gets lost between spreadsheets, emails and bank portals."
        image={images.teamLaptops}
        actions={
          <>
            <TrialButton />
            <Button to="/security" variant="secondary" size="lg">How we keep it safe</Button>
          </>
        }
      />

      <Section containerClassName="flex flex-col gap-24">
        <SplitFeature
          eyebrow="For employees"
          title="Log the day's work in under a minute."
          description="Pick a task, add the hours and an optional note. Entries can be edited or deleted until payroll runs, and weekly totals update as you go."
          bullets={["Six task types, from Development to Paper-work", "Weekly and monthly hour totals", "Full payment history with receipts"]}
          visual={<WorksheetPreview />}
        />
        <SplitFeature
          reverse
          eyebrow="For HR"
          title="Verify people and request pay with confidence."
          description="New accounts wait for HR to verify them, so nobody is paid before their details are checked. Requests carry the salary from the employee record, so there's nothing to re-type."
          bullets={["Verify or unverify accounts with one switch", "Track progress across the team by person and month", "See each employee's last 12 months of pay"]}
          image={images.signing}
        />
        <SplitFeature
          eyebrow="For admins"
          title="Approve and pay from a single queue."
          description="Pending requests are grouped in one place. Review the amount and bank account, pay through Stripe, or reject with one click."
          bullets={["Pay individually or work through the whole queue", "Stripe confirms every payment before it's marked paid", "Paid and rejected requests stay on record"]}
          visual={<PayrollPreview />}
        />
        <SplitFeature
          reverse
          eyebrow="Control"
          title="Roles, salaries and access in one place."
          description="Promote an employee to HR, adjust a salary, or remove someone's access. Changes take effect right away and are recorded for later."
          bullets={["Promote to HR or move back to Employee", "Salary changes are logged with the old and new amount", "Deactivated accounts lose access immediately and can be restored"]}
          image={images.smallMeeting}
        />
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="And the details" title="The small things that make payroll week calmer." />
        <div className="mt-12"><FeatureGrid items={details} /></div>
        <div className="mt-10">
          <Button to="/security" variant="ghost" className="text-brand-dark">Read how we protect your data <ArrowRight size={16} aria-hidden="true" /></Button>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
