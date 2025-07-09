import React from "react";
import { FiUsers, FiClock, FiShield, FiTrendingUp } from "react-icons/fi";

const stats = [
  {
    icon: <FiUsers className="text-blue-500 w-8 h-8 mb-2" />,
    label: "Employees Managed",
    value: "10,000+",
  },
  {
    icon: <FiTrendingUp className="text-blue-500 w-8 h-8 mb-2" />,
    label: "Companies Trust PayNode",
    value: "50+",
  },
  {
    icon: <FiClock className="text-blue-500 w-8 h-8 mb-2" />,
    label: "Hours Saved/Month",
    value: "20+",
  },
  {
    icon: <FiShield className="text-blue-500 w-8 h-8 mb-2" />,
    label: "Uptime",
    value: "99.9%",
  },
];

const features = [
  "Real-time employee tracking",
  "Automated payroll processing",
  "Enterprise-grade security",
  "Mobile access for teams",
];

const StatsHighlight = () => (
  <section className="py-16 px-4 md:px-16 lg:px-24 xl:px-32 container mx-auto ">
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
        Why Choose PayNode?
      </h2>
      <p className="text-gray-600 text-base sm:text-lg">
        Trusted by leading businesses for secure, efficient, and scalable
        employee management.
      </p>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 mb-10">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center bg-gray-50 rounded-xl p-6 shadow"
        >
          {stat.icon}
          <span className="text-2xl font-bold text-blue-600">{stat.value}</span>
          <span className="text-gray-700 text-sm mt-1">{stat.label}</span>
        </div>
      ))}
    </div>
    <div className="flex flex-wrap justify-center gap-4 mt-8">
      {features.map((feature) => (
        <span
          key={feature}
          className="bg-blue-50/80 text-blue-700 px-5 py-2 rounded-full text-sm font-medium shadow"
        >
          {feature}
        </span>
      ))}
    </div>
  </section>
);

export default StatsHighlight;