import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQueryClient } from "@tanstack/react-query";

const PaymentForm = ({ payrollData, clientSecret, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe is not loaded.");
      return;
    }

    setProcessing(true);

    // Confirm card payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email: payrollData?.employeeEmail || "",
        },
      },
    });

    if (result.error) {
      setError(result.error.message);
      toast.error(result.error.message);
      setProcessing(false);
      return;
    }

    if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      // Update payroll status in backend and verify before updating UI
      try {
        const res = await axiosSecure.put(
          `/api/admin/payroll/${payrollData._id}/approve`,
          {
            status: "approved",
            processedBy: "admin",
            transactionId: result.paymentIntent.id,
          }
        );
        if (res.status === 200) {
          toast.success("Payment successful and payroll updated!");
          // Invalidate employee payment history for bar chart update
          queryClient.invalidateQueries([
            "payments",
            payrollData.employeeEmail,
          ]);
          if (onPaymentSuccess) onPaymentSuccess(result.paymentIntent);
        } else {
          toast.error("Payment succeeded but failed to update payroll status.");
        }
      } catch {
        toast.error("Payment succeeded but failed to update payroll status.");
      }
    } else {
      toast.error("Payment did not complete.");
    }

    setProcessing(false);
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-xl overflow-hidden">
      <div className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-700 dark:to-blue-500 py-8">
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
        <span className="text-blue-100 dark:text-blue-200 text-sm mt-1">
          Payroll Payment
        </span>
      </div>
      <div className="p-8 bg-white dark:bg-dark-800">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-gray-50 dark:bg-dark-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-700 dark:text-gray-200 text-sm border border-gray-300 dark:border-dark-600 rounded-md px-3 py-2 transition duration-300 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 shadow-sm"
              placeholder="Your Email"
              value={payrollData?.employeeEmail || ""}
              readOnly
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Card Details
            </label>
            <div className="w-full bg-gray-50 dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md px-3 py-2">
              <CardElement
                options={{
                  hidePostalCode: true,
                  style: {
                    base: {
                      fontSize: "14px",
                      color: document.documentElement.classList.contains("dark")
                        ? "#f5f6f7"
                        : "#374151",
                      backgroundColor:
                        document.documentElement.classList.contains("dark")
                          ? "#45494d"
                          : "#f9fafb",
                      "::placeholder": {
                        color: document.documentElement.classList.contains(
                          "dark"
                        )
                          ? "#9ea9b4"
                          : "#9ca3af",
                      },
                    },
                    invalid: {
                      color: "#ef4444",
                    },
                  },
                }}
              />
            </div>
          </div>
          <button
            className="w-full mt-2 rounded-md bg-blue-600 dark:bg-blue-700 py-2 px-4 border border-transparent text-center text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 dark:focus:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-600 active:bg-blue-700 dark:active:bg-blue-600 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="submit"
            disabled={!stripe || processing}
          >
            {processing ? "Processing..." : "Pay Now"}
          </button>
          {error && (
            <p className="text-red-500 dark:text-red-400 text-xs mt-2">
              {error}
            </p>
          )}
          <p className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-light">
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
