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
    <div className="bg-gradient-to-b from-[#E6EFFF] to-[#F5F7FF] dark:bg-none dark:bg-dark-800">
      <div className="py-16 px-4 md:px-16 lg:px-24 xl:px-32 container mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-dark-600 rounded-xl shadow p-6"
              data-aos="fade-up"
              data-aos-delay={idx * 120}
              data-aos-duration="800"
            >
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {faq.q}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
