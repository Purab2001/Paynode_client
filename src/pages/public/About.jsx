import { Zap, Eye, ShieldCheck, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import { CtaBand, FeatureGrid, PageHero, Photo, Section, SectionHeading, SplitFeature } from "@/components/marketing";
import { images } from "@/lib/images";

const values = [
  { icon: Zap, title: "Fewer steps", text: "If a task takes five clicks, we look for a way to make it two. Payroll shouldn't eat a whole week." },
  { icon: Eye, title: "Nothing hidden", text: "Everyone can see the status of their own pay. Admins can see who changed what, and when." },
  { icon: ShieldCheck, title: "Safe by default", text: "Sensitive data is protected on our servers, not just hidden in the interface." },
  { icon: Users, title: "Made with HR teams", text: "We build features alongside the people who run payroll every month." },
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="We're building the payroll tool we wanted to use."
        description="PayNode started with a simple frustration: hours in one spreadsheet, approvals in email, and payments in a bank portal. We put them in one place."
        image={images.highFive}
      />

      <Section>
        <SplitFeature
          eyebrow="Our story"
          title="From scattered spreadsheets to one clear record."
          description="Most small companies run payroll with a patchwork of tools. Someone collects hours, someone else checks them, and a third person makes the payment. Mistakes slip through the gaps, and nobody can say for sure who approved what."
          bullets={[
            "One place for hours, approvals and payments",
            "Clear roles, so everyone knows their part",
            "A permanent record of every salary paid",
          ]}
          image={images.planning}
        />
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="What we value" title="The principles behind the product." />
        <div className="mt-12"><FeatureGrid items={values} columns={4} /></div>
      </Section>

      <Section>
        <div className="grid gap-5 sm:grid-cols-3">
          <Photo image={images.office} className="aspect-[3/4] sm:col-span-1" />
          <Photo image={images.collaborating} className="aspect-[3/4] sm:col-span-1 sm:translate-y-10" />
          <Photo image={images.smallMeeting} className="aspect-[3/4] sm:col-span-1" />
        </div>
        <div className="mt-20 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading title="A small team with a focused goal." description="We work remotely, ship often, and talk to customers every week. If you run payroll and have ideas, we'd love to hear them." />
          <Button to="/contact" variant="secondary">Get in touch</Button>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
