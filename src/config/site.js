// Public-site content and contact details. Update these before launch.
export const site = {
  name: "PayNode",
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
  { to: "/security", label: "Security" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

// Per-page search and sharing metadata for the public site, keyed by pathname.
export const pageMeta = {
  "/": {
    title: "PayNode: payroll, work sheets and approvals in one place",
    description: "Employees log their hours, HR verifies and requests pay, and admins approve and pay through Stripe. Every step is on record.",
  },
  "/features": {
    title: "Features: work sheets, payroll approvals and Stripe payments | PayNode",
    description: "Daily work sheets, one-request-per-month payroll approvals, Stripe payments, role-based access and analytics for HR teams.",
  },
  "/security": {
    title: "Security: encrypted bank details and Stripe-confirmed payments | PayNode",
    description: "How PayNode protects payroll data: role-based access, encrypted bank account numbers, an audit trail and Stripe-processed payments.",
  },
  "/about": {
    title: "About PayNode: payroll software built for small HR teams",
    description: "Why we built PayNode to replace payroll spreadsheets with one auditable flow from hours worked to salary paid.",
  },
  "/contact": {
    title: "Contact PayNode: get in touch",
    description: "Questions about setup or security? Send us a message and we reply within one business day.",
  },
};
