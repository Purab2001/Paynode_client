import { ArrowRight, Check, LayoutGrid } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useAccount } from "@/hooks/useAccount";
import { cn } from "@/lib/cn";
import { site } from "@/config/site";

const placeholderHeight = { sm: "h-9", md: "h-12", lg: "h-[52px]" };

/**
 * Primary call to action that follows the visitor's session:
 * "Start free trial" when signed out, "Finish setup" when the profile is incomplete,
 * "Go to dashboard" when signed in. Holds its space while the session loads.
 */
export function TrialButton({ size = "lg", variant = "primary", className, label = "Start free trial", arrow = false }) {
  const { kind } = useAccount();

  if (kind === "loading") {
    return (
      <span
        aria-hidden="true"
        className={cn("inline-block w-44 animate-pulse rounded-xl", variant === "light" ? "bg-white/25" : "bg-line", placeholderHeight[size], className)}
      />
    );
  }
  if (kind === "signedIn") {
    return (
      <Button to="/dashboard" size={size} variant={variant} className={className}>
        <LayoutGrid size={18} aria-hidden="true" /> Go to dashboard
      </Button>
    );
  }
  if (kind === "needsProfile") {
    return <Button to="/complete-profile" size={size} variant={variant} className={className}>Finish setup</Button>;
  }
  return (
    <Button to="/register" size={size} variant={variant} className={className}>
      {label} {arrow && <ArrowRight size={18} aria-hidden="true" />}
    </Button>
  );
}

const tones = {
  white: "bg-card",
  surface: "bg-surface border-y border-line",
  ink: "bg-ink text-white",
};

/** Full-width band with a centred 1200px container. */
export function Section({ id, tone = "white", className, containerClassName, children }) {
  return (
    <section id={id} className={cn(tones[tone], "scroll-mt-20", className)}>
      <div className={cn("mx-auto max-w-[1200px] px-6 py-20 lg:py-24", containerClassName)}>{children}</div>
    </section>
  );
}

export function Eyebrow({ children, dark }) {
  return (
    <p className={cn("text-sm font-bold uppercase tracking-[0.08em]", dark ? "text-on-ink-accent" : "text-brand-dark")}>{children}</p>
  );
}

export function SectionHeading({ eyebrow, title, description, align = "left", dark, className }) {
  return (
    <div className={cn("flex max-w-[720px] flex-col gap-3", align === "center" && "mx-auto items-center text-center", className)}>
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <h2 className="text-[34px] font-extrabold leading-[1.12] tracking-tight sm:text-[40px]">{title}</h2>
      {description && <p className={cn("text-[17px] leading-relaxed", dark ? "text-on-ink" : "text-body")}>{description}</p>}
    </div>
  );
}

/** Top-of-page hero for inner pages. Optional image on the right. */
export function PageHero({ eyebrow, title, description, actions, image }) {
  return (
    <section className="border-b border-line bg-surface">
      <div className={cn("mx-auto grid max-w-[1200px] items-center gap-12 px-6 py-16 lg:py-20", image && "lg:grid-cols-[1.1fr_1fr]")}>
        <div className={cn("flex flex-col gap-5", !image && "max-w-[760px]")}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="text-[40px] font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-[52px]">{title}</h1>
          {description && <p className="max-w-[600px] text-lg leading-relaxed text-body">{description}</p>}
          {actions && <div className="flex flex-wrap gap-3 pt-2">{actions}</div>}
        </div>
        {image && <Photo image={image} className="aspect-[4/3]" sizes={[640, 960]} priority />}
      </div>
    </section>
  );
}

/** Responsive Unsplash image with rounded frame. */
export function Photo({ image, className, sizes = [480, 800], priority = false }) {
  return (
    <img
      src={image.src(sizes[1])}
      srcSet={`${image.src(sizes[0])} ${sizes[0]}w, ${image.src(sizes[1])} ${sizes[1]}w`}
      sizes="(min-width: 1024px) 560px, 100vw"
      alt={image.alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("w-full rounded-[20px] bg-line object-cover", className)}
    />
  );
}

export function IconTile({ icon: Icon, dark, onTint }) {
  return (
    <span className={cn("grid size-11 place-items-center rounded-xl", dark ? "bg-ink-2 text-on-ink-accent" : onTint ? "bg-card text-brand-dark" : "bg-brand-soft text-brand-dark")}>
      <Icon size={22} aria-hidden="true" />
    </span>
  );
}

export function FeatureCard({ icon, title, children, dark, featured, className }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3.5 rounded-2xl p-7",
        dark ? "border border-ink-line" : featured ? "border border-brand/25 bg-brand-soft" : "border border-line bg-card",
        featured && "justify-center sm:col-span-2 lg:p-9",
        className,
      )}
    >
      {icon && <IconTile icon={icon} dark={dark} onTint={featured} />}
      <h3 className={cn("font-extrabold", featured ? "text-2xl" : "text-[19px]")}>{title}</h3>
      <p className={cn("leading-relaxed", featured && "max-w-[460px] text-[17px]", dark ? "text-on-ink" : "text-body")}>{children}</p>
    </div>
  );
}

/** Grid of feature cards. An item with `featured: true` spans two columns and gets a tinted card. */
export function FeatureGrid({ items, columns = 3, dark }) {
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2", columns === 3 && "lg:grid-cols-3", columns === 4 && "lg:grid-cols-4")}>
      {items.map((f) => (
        <FeatureCard key={f.title} icon={f.icon} title={f.title} dark={dark} featured={f.featured}>
          {f.text}
        </FeatureCard>
      ))}
    </div>
  );
}

/** Row of short, verifiable facts. Use instead of invented customer numbers. */
export function FactStrip({ items }) {
  return (
    <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {items.map((f) => (
        <div key={f.label} className="flex flex-col gap-1 bg-card px-6 py-5">
          <dt className="order-2 text-sm text-muted">{f.label}</dt>
          <dd className="order-1 text-2xl font-extrabold tracking-tight">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CheckList({ items, dark }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className={cn("flex gap-3 leading-relaxed", dark ? "text-on-ink" : "text-body")}>
          <Check size={20} aria-hidden="true" className={cn("mt-0.5 flex-none", dark ? "text-on-ink-accent" : "text-brand")} />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Text + visual side by side; `reverse` flips the order on large screens. */
export function SplitFeature({ eyebrow, title, description, bullets, image, visual, reverse, action }) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <div className={cn("flex flex-col gap-5", reverse && "lg:order-2")}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h3 className="text-3xl font-extrabold leading-tight tracking-tight">{title}</h3>
        {description && <p className="text-[17px] leading-relaxed text-body">{description}</p>}
        {bullets && <CheckList items={bullets} />}
        {action}
      </div>
      <div className={cn(reverse && "lg:order-1")}>{visual ?? <Photo image={image} className="aspect-[4/3]" />}</div>
    </div>
  );
}

/** Numbered steps, used for process explanations. */
export function Steps({ items, dark }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s, i) => (
        <li key={s.title} className={cn("flex flex-col gap-2.5 rounded-[14px] p-6", dark ? "border border-ink-line" : "border border-line bg-card")}>
          <span className={cn("font-mono text-[13px]", dark ? "text-on-ink-accent" : "text-brand-dark")}>STEP {i + 1}</span>
          <p className="text-lg font-bold">{s.title}</p>
          <p className={cn("text-sm leading-relaxed", dark ? "text-on-ink" : "text-body")}>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function PricingCards({ plans }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {plans.map((p) => (
        <div
          key={p.name}
          className={cn(
            "flex flex-col gap-5 rounded-[18px] bg-card p-8",
            p.popular ? "border-2 border-brand shadow-[0_20px_50px_-28px_rgba(37,99,235,0.6)]" : "border border-line",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-extrabold">{p.name}</h3>
              <p className="mt-1.5 text-[15px] leading-snug text-muted">{p.blurb}</p>
            </div>
            {p.popular && <Badge tone="brand">Most popular</Badge>}
          </div>
          <div>
            <p>
              <span className="text-[44px] font-extrabold tracking-tight">${p.price}</span>
              <span className="text-[15px] text-muted"> / month</span>
            </p>
            <p className="text-sm font-bold text-body">{p.limit}</p>
          </div>
          <CheckList items={p.features} />
          <Button to={p.name === "Enterprise" ? "/contact?topic=sales" : "/register"} variant={p.popular ? "primary" : "secondary"} className="mt-auto">
            {p.cta}
          </Button>
        </div>
      ))}
    </div>
  );
}

/** Closing call-to-action band. */
export function CtaBand({
  title = "Run your next payroll on PayNode.",
  description = `Try every feature free for ${site.trialDays} days. No card required.`,
}) {
  const { kind } = useAccount();
  const signedIn = kind === "signedIn";
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-20">
      <div className="flex flex-wrap items-center justify-between gap-8 rounded-3xl bg-brand p-10 text-white sm:p-14">
        <div className="flex max-w-[620px] flex-col gap-2.5">
          <h2 className="text-[32px] font-extrabold leading-tight tracking-tight sm:text-4xl">{title}</h2>
          <p className="text-[17px] text-blue-100">{signedIn ? "Your workspace is ready whenever you are." : description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <TrialButton variant="light" arrow className="min-w-44" />
          <Button to="/contact?topic=sales" size="lg" className="border border-white/40 bg-transparent hover:bg-white/10">Talk to sales</Button>
        </div>
      </div>
    </section>
  );
}
