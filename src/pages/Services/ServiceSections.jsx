// ServiceSections.jsx
import React from "react";
import { Card, CardBody, Button } from "@material-tailwind/react";
import { Link } from "react-router";

const ServiceSections = () => {
  const serviceCategories = [
    {
      title: "Core Services",
      description: "Essential tools for everyday HR management",
      color: "from-blue-500 to-blue-600",
      services: [
        {
          title: "Employee Management",
          description:
            "Complete employee lifecycle management from onboarding to offboarding",
          features: [
            "Digital Onboarding",
            "Profile Management",
            "Document Storage",
            "Performance Tracking",
          ],
        },
        {
          title: "Payroll Processing",
          description:
            "Automated payroll with compliance and direct deposit capabilities",
          features: [
            "Automated Calculations",
            "Tax Management",
            "Direct Deposit",
            "Pay Stub Generation",
          ],
        },
        {
          title: "Time & Attendance",
          description:
            "Accurate time tracking with flexible scheduling options",
          features: [
            "Time Clock",
            "Schedule Management",
            "Leave Tracking",
            "Overtime Calculation",
          ],
        },
      ],
    },
    {
      title: "Analytics & Reporting",
      description: "Data-driven insights for better decision making",
      color: "from-green-500 to-green-600",
      services: [
        {
          title: "Advanced Analytics",
          description:
            "Comprehensive business intelligence and workforce analytics",
          features: [
            "Custom Dashboards",
            "Predictive Analytics",
            "Performance Metrics",
            "Trend Analysis",
          ],
        },
        {
          title: "Compliance Reporting",
          description: "Automated compliance reporting for various regulations",
          features: [
            "GDPR Compliance",
            "Labor Law Reports",
            "Audit Trails",
            "Regulatory Updates",
          ],
        },
        {
          title: "Financial Analytics",
          description: "Deep insights into payroll costs and budget planning",
          features: [
            "Cost Analysis",
            "Budget Forecasting",
            "ROI Tracking",
            "Expense Reports",
          ],
        },
      ],
    },
    {
      title: "Enterprise Solutions",
      description: "Advanced features for large organizations",
      color: "from-purple-500 to-purple-600",
      services: [
        {
          title: "API Integration",
          description:
            "Seamless integration with your existing business systems",
          features: [
            "REST API",
            "Webhook Support",
            "Custom Integrations",
            "Real-time Sync",
          ],
        },
        {
          title: "Multi-tenant Platform",
          description: "Support for multiple organizations with data isolation",
          features: [
            "Data Security",
            "Custom Branding",
            "Isolated Environments",
            "Scalable Architecture",
          ],
        },
        {
          title: "Advanced Security",
          description: "Enterprise-grade security features and compliance",
          features: [
            "SSO Integration",
            "2FA",
            "Role-based Access",
            "Encryption",
          ],
        },
      ],
    },
  ];

  return (
    <section className="bg-gradient-to-b from-[#E6EFFF] to-[#F5F7FF] dark:bg-none dark:bg-dark-800">
      <div className="py-16 px-4 md:px-16 lg:px-24 xl:px-32 container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Service Categories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our organized service categories designed to meet every
            aspect of your HR needs
          </p>
        </div>

        <div className="space-y-16">
          {serviceCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-8">
              {/* Category Header */}
              <div className="text-center">
                <div
                  className={`inline-block bg-gradient-to-r ${category.color} text-white px-6 py-3 rounded-full mb-4`}
                >
                  <h3 className="text-xl font-bold">{category.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                  {category.description}
                </p>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.services.map((service, serviceIndex) => (
                  <Card
                    key={serviceIndex}
                    className="h-full dark:bg-dark-600 shadow hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardBody className="p-6 flex flex-col h-full">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        {service.title}
                      </h4>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
                        {service.description}
                      </p>

                      <div className="space-y-2 mb-6">
                        <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                          Key Features
                        </h5>
                        <ul className="space-y-1">
                          {service.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="text-sm text-gray-600 dark:text-gray-300 flex items-center"
                            >
                              <span className="text-green-500 mr-2">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Link to="/contact-us" className="mt-auto">
                        <Button
                          size="sm"
                          className={`w-full bg-gradient-to-r ${category.color} shadow-none normal-case`}
                        >
                          Learn More
                        </Button>
                      </Link>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSections;
