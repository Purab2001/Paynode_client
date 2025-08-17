import React from "react";
import { FiUserPlus, FiUsers, FiBarChart2, FiDollarSign } from "react-icons/fi";

const steps = [
  {
    icon: <FiUserPlus className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Sign Up & Setup",
    desc: "Create your account and set up your company profile in minutes.",
  },
  {
    icon: <FiUsers className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Add Your Team",
    desc: "Import employees, assign roles, and organize your workforce.",
  },
  {
    icon: <FiBarChart2 className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Track & Manage",
    desc: "Monitor work hours, tasks, and performance in real time.",
  },
  {
    icon: <FiDollarSign className="text-blue-500 w-8 h-8 mb-2" />,
    title: "Automate Payroll",
    desc: "Process salaries and payments seamlessly with a single click.",
  },
];

const HowItWorks = () => (
  <section className="bg-gradient-to-b from-[#E6EFFF] to-[#F5F7FF] dark:bg-none dark:bg-dark-800">
    <div className="py-16 px-4 md:px-16 lg:px-24 xl:px-32 container mx-auto ">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900  dark:text-white mb-3">
          How PayNode Works
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
          Get started in four simple steps and experience effortless employee
          management.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto">
        {steps.map((step, idx) => (
          <div
            key={step.title}
            className="flex flex-col items-center bg-white dark:bg-dark-600 rounded-xl p-7 shadow text-center hover:shadow-lg transition relative"
            data-aos="fade-up"
            data-aos-delay={100 + idx * 100}
          >
            <div className="mb-2">{step.icon}</div>
            <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">
              {step.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">{step.desc}</p>
            {idx < steps.length - 1 && (
              <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-0.5 bg-blue-200"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
