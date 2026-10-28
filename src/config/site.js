// Public-site content and contact details. Update these before launch.
export const site = {
  name: "PayNode",
  trialDays: 14,
  emails: {
    sales: "sales@paynode.app",
    support: "support@paynode.app",
    security: "security@paynode.app",
  },
  supportHours: "Monday–Friday, 9am–6pm (GMT+6)",
  responseTime: "within one business day",
};

export const nav = [
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/security", label: "Security" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const plans = [
  {
    name: "Starter",
    price: 29,
    blurb: "For small teams moving payroll off spreadsheets.",
    limit: "Up to 10 employees",
    features: ["Work sheets and hour tracking", "Payroll requests and approvals", "Payment history for every employee", "Email support"],
    cta: "Start free trial",
  },
  {
    name: "Professional",
    price: 79,
    blurb: "For growing companies with a dedicated HR team.",
    limit: "Up to 50 employees",
    popular: true,
    features: ["Everything in Starter", "Salary payouts through Stripe", "Analytics and payroll trends", "Audit trail for role and salary changes", "Priority support"],
    cta: "Start free trial",
  },
  {
    name: "Enterprise",
    price: 149,
    blurb: "For larger organisations with more people and process.",
    limit: "Unlimited employees",
    features: ["Everything in Professional", "Guided onboarding for HR and admins", "Data export on request", "Named account manager"],
    cta: "Talk to sales",
  },
];

// Plan comparison: true = included, false = not included, string = detail.
export const comparison = [
  { group: "People", rows: [
    ["Employees", "10", "50", "Unlimited"],
    ["Employee, HR and Admin roles", true, true, true],
    ["Account verification by HR", true, true, true],
  ] },
  { group: "Time & payroll", rows: [
    ["Work sheets and hour tracking", true, true, true],
    ["Payroll requests and approvals", true, true, true],
    ["Salary payouts through Stripe", false, true, true],
    ["Payment history and receipts", true, true, true],
  ] },
  { group: "Insight & control", rows: [
    ["Dashboards per role", true, true, true],
    ["Payroll analytics and trends", false, true, true],
    ["Audit trail", false, true, true],
    ["Data export", false, false, true],
  ] },
  { group: "Support", rows: [
    ["Support channel", "Email", "Priority email", "Named manager"],
    ["Guided onboarding", false, false, true],
  ] },
];

// Per-page search and sharing metadata for the public site, keyed by pathname.
export const pageMeta = {
  "/": {
    title: "PayNode: payroll, work sheets and approvals in one place",
    description: "Employees log their hours, HR verifies and requests pay, and admins approve and pay through Stripe. Every step is on record.",
  },
  "/features": {
    title: "Features: work sheets, payroll approvals and Stripe payouts | PayNode",
    description: "Daily work sheets, one-request-per-month payroll approvals, Stripe payouts, role-based access and analytics for HR teams.",
  },
  "/pricing": {
    title: "Pricing: plans from $29 a month with a 14-day free trial | PayNode",
    description: "Starter, Professional and Enterprise plans for teams of any size. Every plan starts with a 14-day free trial and no card required.",
  },
  "/security": {
    title: "Security: encrypted bank details and Stripe-confirmed payouts | PayNode",
    description: "How PayNode protects payroll data: role-based access, encrypted bank account numbers, an audit trail and Stripe-processed payments.",
  },
  "/about": {
    title: "About PayNode: payroll software built for small HR teams",
    description: "Why we built PayNode to replace payroll spreadsheets with one auditable flow from hours worked to salary paid.",
  },
  "/contact": {
    title: "Contact PayNode: talk to sales or get support",
    description: "Questions about plans, onboarding or security? Send us a message and we reply within one business day.",
  },
};
