import React from "react";

export default function FAQ() {
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

  return (
    <div className="py-16 px-4 md:px-16 lg:px-24 xl:px-32 container mx-auto">
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
    </div>
  );
}
