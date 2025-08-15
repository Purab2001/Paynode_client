import React, { useState, useMemo } from "react";
import { Select, Option, Button } from "@material-tailwind/react";
import { Link } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import ServiceSections from "./ServiceSections";
import ServiceDetails from "./ServiceDetails";

const servicesData = [
  // Core Services
  {
    id: 1,
    title: "Employee Management",
    desc: "Employee profile management with verification and onboarding processes.",
    category: "Core",
    price: 49,
    features: ["Profile Management", "Employee Verification", "Onboarding"],
    icon: "👥",
  },
  {
    id: 2,
    title: "Payroll Processing",
    desc: "Automated payroll calculations with tax deductions and payment processing.",
    category: "Core",
    price: 89,
    features: [
      "Automated Calculations",
      "Tax Management",
      "Payment Processing",
    ],
    icon: "💰",
  },
  {
    id: 3,
    title: "Worksheet Management",
    desc: "Track employee work hours, tasks, and productivity metrics effectively.",
    category: "Core",
    price: 39,
    features: ["Time Tracking", "Task Management", "Productivity Reports"],
    icon: "📊",
  },
  {
    id: 4,
    title: "Role-Based Access",
    desc: "Secure access control with customizable roles and permissions.",
    category: "Security",
    price: 29,
    features: ["Custom Roles", "Permission Management", "Secure Access"],
    icon: "🔐",
  },
  {
    id: 5,
    title: "Advanced Analytics",
    desc: "Comprehensive business intelligence with customizable dashboards and reports.",
    category: "Analytics",
    price: 129,
    features: [
      "Custom Dashboards",
      "Real-time Analytics",
      "Data Visualization",
    ],
    icon: "📈",
  },
  {
    id: 6,
    title: "Performance Tracking",
    desc: "Monitor employee performance with KPIs and goal management.",
    category: "Analytics",
    price: 79,
    features: ["KPI Tracking", "Goal Management", "Performance Reviews"],
    icon: "🎯",
  },
];

const Services = () => {
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterCategory, setFilterCategory] = useState("all");

  React.useEffect(() => {
    AOS.init();
  }, []);

  const categories = [
    "all",
    ...new Set(servicesData.map((service) => service.category)),
  ];

  const filteredAndSortedServices = useMemo(() => {
    let filtered = servicesData;

    // Filter by category
    if (filterCategory !== "all") {
      filtered = servicesData.filter(
        (service) => service.category === filterCategory
      );
    }

    // Sort the filtered results
    return [...filtered].sort((a, b) => {
      let aValue, bValue;

      if (sortBy === "price") {
        aValue = a.price;
        bValue = b.price;
      } else if (sortBy === "category") {
        aValue = a.category.toLowerCase();
        bValue = b.category.toLowerCase();
      } else {
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [sortBy, sortOrder, filterCategory]);

  return (
    <div className="bg-white pt-10 md:pt-0">
      {/* Hero Section */}
      <section
        className="bg-gradient-to-b from-[#E6EFFF] to-[#F5F7FF] py-16 px-4 md:px-16 lg:px-24 xl:px-32 text-center"
        data-aos="fade-up"
        data-aos-duration="800"
      >
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            All PayNode Services
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Discover our comprehensive suite of employee management solutions.
            Use our advanced filtering and sorting to find the perfect services
            for your business needs.
          </p>

          {/* Controls Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Category
                </label>
                <Select
                  value={filterCategory}
                  onChange={(value) => setFilterCategory(value)}
                  className="w-full"
                >
                  {categories.map((category) => (
                    <Option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <Select
                  value={sortBy}
                  onChange={(value) => setSortBy(value)}
                  className="w-full"
                >
                  <Option value="name">Name</Option>
                  <Option value="price">Price</Option>
                  <Option value="category">Category</Option>
                </Select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <Select
                  value={sortOrder}
                  onChange={(value) => setSortOrder(value)}
                  className="w-full"
                >
                  <Option value="asc">
                    {sortBy === "price" ? "Low to High" : "A to Z"}
                  </Option>
                  <Option value="desc">
                    {sortBy === "price" ? "High to Low" : "Z to A"}
                  </Option>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredAndSortedServices.length} of{" "}
              {servicesData.length} services
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="">
        <div className="py-16 px-4 md:px-16 lg:px-24 xl:px-32 container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedServices.map((service, idx) => (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-gray-50 shadow hover:shadow-xl transition-all duration-300 flex flex-col h-96 group"
                data-aos="fade-up"
                data-aos-delay={idx * 50}
              >
                {/* Header */}
                <div className="p-6 flex-shrink-0">
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full">
                      {service.category}
                    </span>
                    <div className="text-2xl">{service.icon}</div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>

                  <div className="text-center mb-3">
                    <span className="text-2xl font-bold text-blue-600">
                      ${service.price}
                    </span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 flex-grow">
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {service.desc}
                  </p>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Key Features
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 pt-0 mt-auto">
                  <Link to="/contact-us">
                    <Button
                      className="w-full bg-blue-500 hover:bg-blue-600 shadow-none normal-case text-sm py-2"
                      size="sm"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAndSortedServices.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No services found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}
        </div>
      </section>

      <ServiceSections />
      <ServiceDetails />
    </div>
  );
};

export default Services;
