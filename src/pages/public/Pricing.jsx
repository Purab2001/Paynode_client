import { Check, Minus } from "lucide-react";
import { Accordion } from "@/components/ui/Field";
import { CtaBand, PageHero, PricingCards, Section, SectionHeading } from "@/components/marketing";
import { comparison, plans, site } from "@/config/site";

const faqs = [
  { q: "How does the free trial work?", a: `You get every Professional feature for ${site.trialDays} days. We don't ask for a card up front, and you can pick a plan at any point during the trial.` },
  { q: "What counts as an employee?", a: "Anyone with an active PayNode account: employees, HR and admins. Deactivated accounts don't count towards your limit." },
  { q: "Can I switch plans?", a: "Yes. Upgrades apply immediately and downgrades take effect at the start of your next billing cycle." },
  { q: "Are Stripe fees included?", a: "No. Stripe charges its standard processing fees for each salary payment, billed by Stripe directly." },
  { q: "Do you offer annual billing or discounts for non-profits?", a: `Get in touch at ${site.emails.sales} and we'll find an option that works for you.` },
];

function Cell({ value }) {
  if (value === true) return <Check size={18} className="mx-auto text-brand" aria-label="Included" />;
  if (value === false) return <Minus size={18} className="mx-auto text-line-strong" aria-label="Not included" />;
  return <span className="font-semibold">{value}</span>;
}

export default function Pricing() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Simple pricing that grows with your team."
        description={`One monthly price per company, not per person. Start with a ${site.trialDays}-day free trial of every feature.`}
      />

      <Section>
        <PricingCards plans={plans} />
        <p className="mt-6 text-center text-sm text-muted">Prices in USD, billed monthly. Stripe processing fees apply to salary payments.</p>
      </Section>

      <Section tone="surface">
        <SectionHeading title="Compare plans" description="Every plan includes the three roles and the full approval workflow." />
        <div className="relative mt-10 overflow-x-auto rounded-2xl border border-line bg-card">
          <table className="w-full min-w-[680px] border-collapse text-[15px]">
            <caption className="sr-only">Feature comparison by plan</caption>
            <thead>
              <tr className="bg-subtle">
                <th scope="col" className="w-2/5 px-6 py-4 text-left text-sm font-bold text-muted">Feature</th>
                {plans.map((p) => (
                  <th key={p.name} scope="col" className="px-6 py-4 text-center">
                    <span className="block font-extrabold">{p.name}</span>
                    <span className="text-sm font-semibold text-muted">${p.price}/mo</span>
                  </th>
                ))}
              </tr>
            </thead>
            {comparison.map((group) => (
              <tbody key={group.group}>
                <tr>
                  <th scope="colgroup" colSpan={4} className="border-t border-line bg-card px-6 pb-2 pt-6 text-left text-xs font-bold uppercase tracking-[0.08em] text-brand-dark">
                    {group.group}
                  </th>
                </tr>
                {group.rows.map(([label, ...values]) => (
                  <tr key={label} className="border-t border-divider">
                    <th scope="row" className="px-6 py-3.5 text-left font-semibold text-body">{label}</th>
                    {values.map((v, i) => (
                      <td key={i} className="px-6 py-3.5 text-center"><Cell value={v} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </Section>

      <Section containerClassName="max-w-[820px]">
        <SectionHeading align="center" title="Billing questions" />
        <div className="mt-10"><Accordion items={faqs} /></div>
      </Section>

      <CtaBand />
    </>
  );
}
