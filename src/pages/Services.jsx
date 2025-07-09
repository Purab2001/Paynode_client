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

    {/* Core Services */}
    <section className="py-16 px-4 md:px-16 lg:px-24 xl:px-32 container mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Core Employee Management Services
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {coreServices.map((s, i) => (
          <div
            key={s.title}
            className="bg-white rounded-xl shadow p-7 flex flex-col items-center text-center hover:shadow-lg transition"
            data-aos="fade-up"
            data-aos-delay={i * 100}
            data-aos-duration="700"
          >
            {s.icon}
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              {s.title}
            </h3>
            <p className="text-gray-600 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Analytics Services */}
    <section className="bg-gray-50 py-16 px-4 md:px-16 lg:px-24 xl:px-32">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Dashboard & Analytics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
        {analyticsServices.map((s, i) => (
          <div
            key={s.title}
            className="bg-white rounded-xl shadow p-7 flex flex-col items-center text-center hover:shadow-lg transition"
            data-aos="fade-right"
            data-aos-delay={i * 100}
            data-aos-duration="700"
          >
            {s.icon}
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              {s.title}
            </h3>
            <p className="text-gray-600 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Enterprise Solutions */}
    <section className="py-16 px-4 md:px-16 lg:px-24 xl:px-32 container mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Enterprise Solutions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {enterpriseServices.map((s, i) => (
          <div
            key={s.title}
            className="bg-white rounded-xl shadow p-7 flex flex-col items-center text-center hover:shadow-lg transition"
            data-aos="fade-left"
            data-aos-delay={i * 100}
            data-aos-duration="700"
          >
            {s.icon}
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              {s.title}
            </h3>
            <p className="text-gray-600 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Support & Consultation */}
    <section className="bg-gray-50 py-16 px-4 md:px-16 lg:px-24 xl:px-32">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Support & Consultation
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
        {supportServices.map((s, i) => (
          <div
            key={s.title}
            className="bg-white rounded-xl shadow p-7 flex flex-col items-center text-center hover:shadow-lg transition"
            data-aos="zoom-in"
            data-aos-delay={i * 100}
            data-aos-duration="700"
          >
            {s.icon}
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              {s.title}
            </h3>
            <p className="text-gray-600 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Feature Comparison */}
    <section
      className="py-16 px-4 md:px-16 lg:px-24 xl:px-32 container mx-auto"
      data-aos="fade-up"
      data-aos-duration="800"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Feature Comparison
      </h2>
      <div className="overflow-x-auto scrollbar-hide">
        <table className="min-w-full bg-white rounded-xl shadow text-left">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b font-semibold">Feature</th>
              <th className="py-3 px-4 border-b font-semibold">Basic</th>
              <th className="py-3 px-4 border-b font-semibold">Pro</th>
              <th className="py-3 px-4 border-b font-semibold">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {featureComparison.map((row, i) => (
              <tr
                key={row.feature}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                data-aos-duration="600"
              >
                <td className="py-2 px-4 border-b">{row.feature}</td>
                <td className="py-2 px-4 border-b">{row.basic ? "✔️" : ""}</td>
                <td className="py-2 px-4 border-b">{row.pro ? "✔️" : ""}</td>
                <td className="py-2 px-4 border-b">
                  {row.enterprise ? "✔️" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    {/* Implementation Process */}
    <section className="bg-gray-50">
      <div
        className="py-16 px-4 md:px-16 lg:px-24 xl:px-32"
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          How We Deliver
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-5xl mx-auto">
          <div className="flex-1" data-aos="fade-right" data-aos-duration="700">
            <ol className="list-decimal list-inside text-left text-gray-700 space-y-3">
              <li>Consultation & Needs Assessment</li>
              <li>Custom Solution Design</li>
              <li>Implementation & Integration</li>
              <li>Training & Onboarding</li>
              <li>Ongoing Support & Optimization</li>
            </ol>
          </div>
          <div
            className="flex-end"
            data-aos="fade-left"
            data-aos-duration="700"
          >
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80"
              alt="Implementation"
              className="rounded-xl shadow mx-auto"
            />
          </div>
        </div>
      </div>
    </section>

    {/* Success Stories */}
    <section className="py-16 px-4 md:px-16 lg:px-24 xl:px-32 container mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Success Stories
      </h2>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        <div
          className="bg-white rounded-xl shadow p-7"
          data-aos="fade-up"
          data-aos-delay="0"
          data-aos-duration="700"
        >
          <h3 className="font-semibold text-blue-600 mb-2">
            TechCorp Solutions
          </h3>
          <p className="text-gray-700 text-sm mb-2">
            “PayNode transformed our HR operations. Managing 150+ employees is
            now effortless.”
          </p>
          <span className="text-xs text-gray-500">Sarah Chen, HR Manager</span>
        </div>
        <div
          className="bg-white rounded-xl shadow p-7"
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-duration="700"
        >
          <h3 className="font-semibold text-blue-600 mb-2">
            BrightEdge Analytics
          </h3>
          <p className="text-gray-700 text-sm mb-2">
            “With PayNode, our payroll and compliance processes are now fully
            automated. The support team is outstanding.”
          </p>
          <span className="text-xs text-gray-500">
            Priya Patel, Finance Lead
          </span>
        </div>
        <div
          className="bg-white rounded-xl shadow p-7"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="700"
        >
          <h3 className="font-semibold text-blue-600 mb-2">
            GrowthPartners Inc
          </h3>
          <p className="text-gray-700 text-sm mb-2">
            “Payroll automation saved us 20+ hours per month. The analytics are
            a game changer.”
          </p>
          <span className="text-xs text-gray-500">
            Michael Rodriguez, Operations Lead
          </span>
        </div>
      </div>
    </section>

    {/* Pricing Plans */}
    <section className="bg-gray-50 py-16 px-4 md:px-16 lg:px-24 xl:px-32">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Pricing Plans
      </h2>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {pricingPlans.map((plan, i) => (
          <div
            key={plan.name}
            className="bg-white rounded-xl shadow p-7 flex flex-col items-center text-center hover:shadow-lg transition"
            data-aos="zoom-in"
            data-aos-delay={i * 120}
            data-aos-duration="800"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              {plan.name}
            </h3>
            <span className="text-2xl font-bold text-blue-600 mb-4">
              {plan.price}
            </span>
            <ul className="text-gray-600 text-sm mb-4 space-y-1">
              {plan.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-600 transition cursor-pointer">
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </section>

    {/* FAQ */}
    <section className="py-16 px-4 md:px-16 lg:px-24 xl:px-32 container mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow p-6"
            data-aos="fade-up"
            data-aos-delay={idx * 120}
            data-aos-duration="800"
          >
            <h4 className="font-semibold text-gray-900 mb-2">{faq.q}</h4>
            <p className="text-gray-600">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>

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
