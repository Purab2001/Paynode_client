import React from "react";

const PaymentForm = ({ payrollData }) => {
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-xl py-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="h-12 w-12 text-white mb-2"
        >
          <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z"></path>
          <path
            fillRule="evenodd"
            d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
            clipRule="evenodd"
          ></path>
        </svg>
        <h5 className="text-white text-2xl font-bold tracking-wide">PayNode</h5>
        <span className="text-blue-100 text-sm mt-1">Payroll Payment</span>
      </div>
      <div className="p-8">
        <form className="flex flex-col gap-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-gray-50 placeholder:text-gray-400 text-gray-700 text-sm border border-gray-300 rounded-md px-3 py-2 transition duration-300 focus:outline-none focus:border-blue-500 shadow-sm"
              placeholder="Your Email"
              value={payrollData?.employeeEmail || ""}
              readOnly
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Card Details
            </label>
            <input
              type="text"
              className="w-full bg-gray-50 placeholder:text-gray-400 text-gray-700 text-sm border border-gray-300 rounded-md px-3 py-2 transition duration-300 focus:outline-none focus:border-blue-500 shadow-sm"
              placeholder="1234 5678 9012 3456"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Expiration Date
              </label>
              <input
                type="text"
                className="w-full bg-gray-50 placeholder:text-gray-400 text-gray-700 text-sm border border-gray-300 rounded-md px-3 py-2 transition duration-300 focus:outline-none focus:border-blue-500 shadow-sm"
                placeholder="MM/YY"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                CVV
              </label>
              <input
                type="text"
                className="w-full bg-gray-50 placeholder:text-gray-400 text-gray-700 text-sm border border-gray-300 rounded-md px-3 py-2 transition duration-300 focus:outline-none focus:border-blue-500 shadow-sm"
                placeholder="123"
              />
            </div>
          </div>
          <button className="w-full mt-2 rounded-md bg-blue-600 py-2 px-4 border border-transparent text-center text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 hover:bg-blue-700 active:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
            Pay Now
          </button>
          <p className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-500 font-light">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                clipRule="evenodd"
              ></path>
            </svg>
            Payments are secure and encrypted
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
