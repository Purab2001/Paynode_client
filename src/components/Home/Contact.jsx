import React from "react";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router";

export default function Contact() {
  return (
    <div className="bg-gradient-to-b from-[#E6EFFF] to-[#F5F7FF] dark:bg-none dark:bg-dark-800 py-16 px-4 md:px-16 lg:px-24 xl:px-32 text-center">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Have Questions? We're Here to Help
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Contact us for a personalized demo or to discuss your business needs.
      </p>
      <Link to="/contact-us">
        <Button className="rounded-full bg-blue-500 shadow-none normal-case text-sm">
          Contact Us
        </Button>
      </Link>
    </div>
  );
}
