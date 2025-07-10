import React from "react";
import {
  FiUsers,
  FiDollarSign,
  FiBarChart2,
  FiLock,
  FiTrendingUp,
  FiCheckCircle,
  FiLayers,
  FiGlobe,
  FiSettings,
  FiBookOpen,
  FiStar,
  FiSmartphone,
} from "react-icons/fi";
import { Link } from "react-router";
import { Button } from "@material-tailwind/react";
import ServiceSections from "./ServiceSections";
import ServiceDetails from "./ServiceDetails";

const coreServices = [
  {
    icon: <FiUsers className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Work Sheet Management",
    desc: "Track tasks, hours worked, and productivity with real-time updates and easy editing.",
  },
  {
    icon: <FiDollarSign className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Advanced Payroll Processing",
    desc: "Automated salary calculations, payment gateway integration, and duplicate payment prevention.",
  },
  {
    icon: <FiCheckCircle className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Employee Verification & Management",
    desc: "HR verification toggles, role assignments, and secure profile management.",
  },
];

const analyticsServices = [
  {
    icon: <FiBarChart2 className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Progress Monitoring",
    desc: "Filter by employee or month, view dynamic charts, and analyze performance trends.",
  },
  {
    icon: <FiLayers className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Role-Based Access Control",
    desc: "Secure, permission-based access for Employees, HR, and Admins using JWT.",
  },
  {
    icon: <FiTrendingUp className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Data Visualization",
    desc: "Interactive dashboards, table/grid views, and real-time reporting.",
  },
];

const enterpriseServices = [
  {
    icon: <FiGlobe className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Integration Services",
    desc: "Connect with third-party APIs, import/export data, and enable custom integrations.",
  },
  {
    icon: <FiLock className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Security & Compliance",
    desc: "Enterprise-grade encryption, audit logs, and regulatory compliance features.",
  },
  {
    icon: <FiSmartphone className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Mobile & Remote Access",
    desc: "Mobile-responsive design and remote monitoring for flexible workforce management.",
  },
];

const supportServices = [
  {
    icon: <FiSettings className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Custom Development",
    desc: "Tailored solutions, API development, and system integration for enterprises.",
  },
  {
    icon: <FiBookOpen className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Training & Support",
    desc: "Comprehensive user training, technical support, and detailed documentation.",
  },
  {
    icon: <FiStar className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Consultation Services",
    desc: "Workflow analysis, best practices, and strategic implementation planning.",
  },
];

const featureComparison = [
  {
    feature: "Work Sheet Management",
    basic: true,
    pro: true,
    enterprise: true,
  },
  { feature: "Payroll Processing", basic: true, pro: true, enterprise: true },
  {
    feature: "Employee Verification",
    basic: false,
    pro: true,
    enterprise: true,
  },
  { feature: "Progress Analytics", basic: false, pro: true, enterprise: true },
  {
    feature: "Integration Services",
    basic: false,
    pro: false,
    enterprise: true,
  },
  { feature: "Custom Development", basic: false, pro: false, enterprise: true },
];

const pricingPlans = [
  {
    name: "Basic",
    price: "$0",
    features: ["Work Sheet Management", "Payroll Processing"],
  },
  {
    name: "Pro",
    price: "$49/mo",
    features: [
      "All Basic features",
      "Employee Verification",
      "Progress Analytics",
    ],
  },
  {
    name: "Enterprise",
    price: "Contact Us",
    features: [
      "All Pro features",
      "Integration Services",
      "Custom Development",
    ],
  },
];

const faqs = [
  {
    q: "Can I upgrade my plan later?",
    a: "Yes, you can upgrade at any time from your dashboard.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We use enterprise-grade encryption and regular audits.",
  },
  {
    q: "Do you offer onboarding support?",
    a: "Yes, our team provides training and onboarding for all plans.",
  },
];

const Services = () => (
  <div className="bg-white pt-10 md:pt-0">
    {/* Hero Section */}
    <section
      className="bg-gradient-to-b from-[#E6EFFF] to-[#F5F7FF] py-16 px-4 md:px-16 lg:px-24 xl:px-32 text-center"
      data-aos="fade-up"
      data-aos-duration="800"
    >
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Complete Employee Management Solutions
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Discover the full suite of PayNode services designed to streamline HR,
        payroll, analytics, and enterprise operations for modern businesses.
      </p>
    </section>

    {/* Service Sections */}
    <ServiceSections
      coreServices={coreServices}
      analyticsServices={analyticsServices}
      enterpriseServices={enterpriseServices}
      supportServices={supportServices}
    />

    {/* Service Details */}
    <ServiceDetails
      featureComparison={featureComparison}
      pricingPlans={pricingPlans}
      faqs={faqs}
    />

    {/* Contact / Demo */}
    <section className="bg-gradient-to-b from-[#E6EFFF] to-[#F5F7FF] py-16 px-4 md:px-16 lg:px-24 xl:px-32 text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Ready to Transform Your HR?
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        Contact us for a personalized demo or to discuss your business needs.
      </p>
      <Link to="/contact-us">
        <Button className="rounded-full bg-blue-500 shadow-none normal-case text-sm">
          Contact Us
        </Button>
      </Link>
    </section>
  </div>
);

export default Services;
