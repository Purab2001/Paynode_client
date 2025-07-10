// ServiceDetails.jsx
import React from "react";

const ServiceDetails = ({
  featureComparison,
  pricingPlans,
  faqs,
}) => (
  <>
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
  </>
);

export default ServiceDetails;