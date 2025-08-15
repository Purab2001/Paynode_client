import React, { useState } from "react";
import {
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
} from "@material-tailwind/react";
import { Link } from "react-router";

const ServiceDetails = () => {
  const [activeTab, setActiveTab] = useState("pricing");

  const pricingPlans = [
    {
      name: "Starter",
      price: 29,
      period: "month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 25 employees",
        "Basic payroll processing",
        "Employee self-service portal",
        "Email support",
        "Basic reporting",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: 79,
      period: "month",
      description: "Ideal for growing businesses",
      features: [
        "Up to 100 employees",
        "Advanced payroll & benefits",
        "Time tracking & attendance",
        "Performance management",
        "Advanced analytics",
        "Priority support",
        "API access",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: 149,
      period: "month",
      description: "For large organizations with complex needs",
      features: [
        "Unlimited employees",
        "Custom integrations",
        "Advanced security features",
        "Dedicated account manager",
        "24/7 phone support",
        "Custom reporting",
        "White-label options",
        "Multi-location support",
      ],
      popular: false,
    },
  ];

  const featureComparison = [
    {
      feature: "Employee Management",
      starter: true,
      professional: true,
      enterprise: true,
    },
    {
      feature: "Basic Payroll",
      starter: true,
      professional: true,
      enterprise: true,
    },
    {
      feature: "Time Tracking",
      starter: false,
      professional: true,
      enterprise: true,
    },
    {
      feature: "Performance Reviews",
      starter: false,
      professional: true,
      enterprise: true,
    },
    {
      feature: "Advanced Analytics",
      starter: false,
      professional: true,
      enterprise: true,
    },
    {
      feature: "API Access",
      starter: false,
      professional: true,
      enterprise: true,
    },
    {
      feature: "Custom Integrations",
      starter: false,
      professional: false,
      enterprise: true,
    },
    {
      feature: "White-label Solution",
      starter: false,
      professional: false,
      enterprise: true,
    },
    {
      feature: "24/7 Support",
      starter: false,
      professional: false,
      enterprise: true,
    },
    {
      feature: "Dedicated Manager",
      starter: false,
      professional: false,
      enterprise: true,
    },
  ];

  const tabData = [
    { label: "Pricing", value: "pricing" },
    { label: "Features", value: "features" },
  ];

  return (
    <section className="py-16 px-4 md:px-16 lg:px-24 xl:px-32 container mx-auto bg-white">
      <div className="">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Service Details
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our services, pricing, and
            features
          </p>
        </div>

        <Tabs value={activeTab} className="w-full">
          <TabsHeader
            className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg mb-8"
            indicatorProps={{
              className: "bg-white rounded-md",
            }}
          >
            {tabData.map(({ label, value }) => (
              <Tab
                key={value}
                value={value}
                onClick={() => setActiveTab(value)}
                className={`font-medium transition-colors ${
                  activeTab === value ? "text-gray-900" : "text-gray-600"
                }`}
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>

          <TabsBody>
            {/* Pricing Tab */}
            <TabPanel value="pricing" className="p-0">
              <div className="flex flex-wrap items-center justify-center gap-6 my-1">
                {pricingPlans.map((plan, index) => (
                  <div
                    key={index}
                    className={`w-80 text-center border border-gray-200 shadow p-6 ${
                      plan.popular ? "pb-14" : "pb-16"
                    } rounded-lg relative ${
                      plan.popular
                        ? "bg-blue-500 text-white border-gray-500/30"
                        : "bg-white text-gray-800/80"
                    }`}
                  >
                    {plan.popular && (
                      <p className="absolute px-3 text-sm -top-3.5 left-3.5 py-1 bg-blue-400 rounded-full">
                        Most Popular
                      </p>
                    )}

                    <p
                      className={`font-semibold ${plan.popular ? "pt-2" : ""}`}
                    >
                      {plan.name}
                    </p>

                    <h1 className="text-3xl font-semibold">
                      ${plan.price}
                      <span
                        className={`text-sm font-normal ${
                          plan.popular ? "text-white" : "text-gray-500"
                        }`}
                      >
                        /{plan.period}
                      </span>
                    </h1>

                    <ul
                      className={`list-none text-sm mt-6 space-y-1 ${
                        plan.popular ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center gap-2"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7.162 13.5 2.887 9.225l1.07-1.069 3.205 3.207 6.882-6.882 1.069 1.07z"
                              fill={plan.popular ? "currentColor" : "#6366F1"}
                            />
                          </svg>
                          <p>{feature}</p>
                        </li>
                      ))}
                    </ul>

                    <Link to="/contact-us">
                      <button
                        type="button"
                        className={`text-sm w-full py-2 rounded font-medium mt-7 transition-all ${
                          plan.popular
                            ? "bg-white text-blue-500 hover:bg-gray-200"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        Get Started
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            </TabPanel>

            {/* Features Comparison Tab */}
            <TabPanel value="features" className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left p-4 font-semibold text-gray-900">
                        Feature
                      </th>
                      <th className="text-center p-4 font-semibold text-gray-900">
                        Starter
                      </th>
                      <th className="text-center p-4 font-semibold text-gray-900">
                        Professional
                      </th>
                      <th className="text-center p-4 font-semibold text-gray-900">
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureComparison.map((row, index) => (
                      <tr key={index} className="border-t border-gray-200">
                        <td className="p-4 font-medium text-gray-900">
                          {row.feature}
                        </td>
                        <td className="p-4 text-center">
                          {row.starter ? (
                            <span className="text-green-500 text-xl">✓</span>
                          ) : (
                            <span className="text-gray-300 text-xl">✗</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {row.professional ? (
                            <span className="text-green-500 text-xl">✓</span>
                          ) : (
                            <span className="text-gray-300 text-xl">✗</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {row.enterprise ? (
                            <span className="text-green-500 text-xl">✓</span>
                          ) : (
                            <span className="text-gray-300 text-xl">✗</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>
    </section>
  );
};

export default ServiceDetails;
