import React from "react";
import { FiAward, FiMapPin, FiMail } from "react-icons/fi";

const team = [
  {
    name: "Ava Patel",
    role: "Chief Executive Officer",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Co-founded PayNode in 2020 after a decade in SaaS. Ava leads with a vision for transparent, people-first technology.",
  },
  {
    name: "Liam Chen",
    role: "Chief Technology Officer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Tech entrepreneur and cloud architect, Liam ensures PayNode’s platform is secure, scalable, and innovative.",
  },
  {
    name: "Sophia Kim",
    role: "Head of HR",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    bio: "HR strategist with 12 years’ experience, Sophia bridges technology and people for efficient workforce solutions.",
  },
  {
    name: "Noah Smith",
    role: "Lead DevOps Engineer",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    bio: "Noah’s automation expertise guarantees 99.9% uptime and seamless deployments for all clients.",
  },
];

const values = [
  {
    title: "Efficiency",
    desc: "Streamlining HR and payroll processes for maximum productivity.",
  },
  {
    title: "Transparency",
    desc: "Clear, open communication and real-time reporting for all stakeholders.",
  },
  {
    title: "Innovation",
    desc: "Constantly evolving with the latest technology to solve real-world problems.",
  },
];

const About = () => (
  <main className="pt-10 pb-20 bg-gradient-to-b from-[#E6EFFF] to-[#F5F7FF] min-h-screen">
    {/* Hero Section */}
    <section
      className="container mx-auto px-4 md:px-16 lg:px-24 xl:px-32 text-center py-16"
      data-aos="fade-down"
      data-aos-duration="800"
    >
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        About PayNode
      </h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8">
        Founded in 2020 by a team of tech entrepreneurs and HR experts, PayNode
        is on a mission to streamline employee management for organizations of
        all sizes.
      </p>
    </section>

    {/* Company Story & Mission */}
    <section
      className="container mx-auto px-4 md:px-16 lg:px-24 xl:px-32 py-12 grid md:grid-cols-2 gap-12 items-center"
      data-aos="fade-up"
      data-aos-duration="800"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
        <p className="text-gray-700 text-base mb-4">
          To empower organizations with seamless, secure, and intelligent
          employee management solutions that drive efficiency and growth.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">
          Our Founding Story
        </h2>
        <p className="text-gray-700 text-base">
          In 2020, a group of passionate engineers and HR professionals came
          together to tackle the inefficiencies plaguing traditional workforce
          management. Frustrated by outdated systems and siloed data, they
          envisioned a platform that would unify HR, payroll, and
          analytics—making work easier for everyone. Today, PayNode continues to
          deliver reliability, transparency, and innovation at scale.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-8">
          Our Vision
        </h2>
        <p className="text-gray-700 text-base">
          To be the global standard for modern, people-centric workforce
          management—trusted by organizations to empower their teams and unlock
          new levels of productivity.
        </p>
      </div>
      <img
        src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80"
        alt="PayNode team collaborating"
        className="rounded-xl shadow-lg w-full h-72 object-cover"
        loading="lazy"
      />
    </section>

    {/* Team Profiles */}
    <section className="container mx-auto px-4 md:px-16 lg:px-24 xl:px-32 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Meet Our Leadership Team
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {team.map((member, i) => (
          <div
            key={member.name}
            className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center"
            data-aos="zoom-in"
            data-aos-delay={i * 100}
            data-aos-duration="700"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-100"
              loading="lazy"
            />
            <h3 className="text-lg font-semibold text-gray-900">
              {member.name}
            </h3>
            <span className="text-blue-600 text-sm font-medium mb-2">
              {member.role}
            </span>
            <p className="text-gray-700 text-sm">{member.bio}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Core Values */}
    <section className="container mx-auto px-4 md:px-16 lg:px-24 xl:px-32 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Our Core Values
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        {values.map((value, i) => (
          <div
            key={value.title}
            className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center"
            data-aos="fade-up"
            data-aos-delay={i * 120}
            data-aos-duration="700"
          >
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              {value.title}
            </h3>
            <p className="text-gray-700 text-sm">{value.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Certifications & Achievements */}
    <section className="container mx-auto px-4 md:px-16 lg:px-24 xl:px-32 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Certifications & Achievements
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-4 sm:p-5 lg:p-6 flex flex-col items-center text-center"
            data-aos="zoom-in"
            data-aos-delay={i * 100}
            data-aos-duration="700"
          >
            <FiAward className="text-blue-500 w-6 h-6 sm:w-7 sm:h-7" />
            <span className="text-blue-600 font-semibold mt-3 text-sm sm:text-base">
              {["Best HR Tech 2025", "ISO 27001 Compliant", "SOC 2 Certified", "GDPR Ready"][i]}
            </span>
          </div>
        ))}
      </div>
    </section>

    {/* Contact & Locations */}
    <section className="container mx-auto px-4 md:px-16 lg:px-24 xl:px-32 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Contact & Office Locations
      </h2>
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center items-stretch">
        <div
          className="flex items-center gap-3 bg-white rounded-xl shadow p-6 w-full md:w-1/2 h-24"
          data-aos="fade-right"
          data-aos-duration="700"
        >
          <FiMapPin className="text-blue-500 w-7 h-7" />
          <div>
            <h3 className="font-semibold text-gray-900">Global HQ</h3>
            <p className="text-gray-700 text-sm">
              123 Innovation Drive, San Francisco, CA, USA
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-3 bg-white rounded-xl shadow p-6 w-full md:w-1/2 h-24"
          data-aos="fade-left"
          data-aos-duration="700"
        >
          <FiMail className="text-blue-500 w-7 h-7" />
          <div>
            <h3 className="font-semibold text-gray-900">Contact</h3>
            <p className="text-gray-700 text-sm">support@paynode.com</p>
            <p className="text-gray-700 text-sm">+1-234-567-890</p>
          </div>
        </div>
      </div>
    </section>
  </main>
);

export default About;
