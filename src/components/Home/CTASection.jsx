import React from "react";
import { Link } from "react-router";
import { Button } from "@material-tailwind/react";

export default function CTASection() {
  return (
    <section className="py-16 px-4 md:px-16 lg:px-24 xl:px-32 dark:bg-dark-900">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto" data-aos="fade-up">
          {/* Main Headline */}
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your
            <span className="block text-blue-600 dark:text-blue-300">
              HR Management?
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of businesses streamlining their employee management
            with PayNode. Start your free trial today and see the difference.
          </p>

          {/* Stats Row */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                5,000+
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                Happy Customers
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                99.9%
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                Uptime Guarantee
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                24/7
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-sm">
                Expert Support
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Link to="/contact-us">
              <Button
                size="lg"
                className="bg-blue-600 text-white hover:bg-blue-700 shadow-none normal-case font-semibold px-8 py-3 text-lg"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link to="/services">
              <Button
                size="lg"
                variant="outlined"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 shadow-none normal-case font-semibold px-8 py-3 text-lg dark:border-gray-300 dark:text-gray-300 dark:hover:bg-gray-300 dark:hover:text-dark-800"
              >
                View Pricing
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600 dark:text-gray-400 text-sm"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>No Setup Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>30-Day Free Trial</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
