// ServiceSections.jsx
import React from "react";

const ServiceSections = ({
  coreServices,
  analyticsServices,
  enterpriseServices,
  supportServices,
}) => (
  <>
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
  </>
);

export default ServiceSections;