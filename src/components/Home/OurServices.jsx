import React from "react";
import { FiUsers, FiDollarSign, FiFolder, FiMessageCircle, FiShield, FiBarChart2, FiLock } from "react-icons/fi";

const services = [
  {
    icon: <FiUsers className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Employee Monitoring",
    desc: "Track work hours, tasks, and productivity with real-time insights.",
  },
  {
    icon: <FiDollarSign className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Payroll Processing",
    desc: "Automated salary calculations with secure payment distribution.",
  },
  {
    icon: <FiFolder className="text-blue-500 w-8 h-8 mb-2" />,
    title: "HR Management",
    desc: "Centralized employee records and streamlined workflows.",
  },
  {
    icon: <FiMessageCircle className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Team Communication",
    desc: "Built-in messaging and collaboration tools for seamless teamwork.",
  },
  {
    icon: <FiBarChart2 className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Performance Analytics",
    desc: "Advanced reporting and analytics to optimize workforce performance.",
  },
  {
    icon: <FiLock className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Data Security",
    desc: "Enterprise-grade security with encryption and compliance standards.",
  },
];

const benefits = [
  {
    icon: <FiShield className="text-blue-500 w-5 h-5" />,
    label: "Secure",
  },
  {
    icon: <FiUsers className="text-blue-500 w-5 h-5" />,
    label: "Scalable",
  },
  {
    icon: <FiFolder className="text-blue-500 w-5 h-5" />,
    label: "Simple",
  },
];

const OurServices = () => {
  return (
    <section className="bg-gradient-to-b from-[#E6EFFF] to-[#F5F7FF]">
      <div className="container mx-auto py-16 px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Our Services
          </h2>
          <p className="text-gray-600 text-base sm:text-lg">
            Employee management made simple. Discover how PayNode empowers your
            team and streamlines HR operations.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-10">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-xl shadow p-7 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              {service.icon}
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm">{service.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center gap-2 md:gap-6 mb-8">
          {benefits.map((b) => (
            <div
              key={b.label}
              className="flex items-center gap-2 bg-white rounded-full px-5 py-2 shadow text-gray-700 font-medium text-sm"
            >
              {b.icon}
              {b.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;