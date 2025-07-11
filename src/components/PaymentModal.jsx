// PaymentModal.jsx
import React, { useEffect, useState } from "react";
import { Dialog, DialogBody, Button } from "@material-tailwind/react";
import PaymentForm from "../pages/Dashboard/Admin/PaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentModal = ({ open, onClose, payrollData }) => {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    // Fetch PaymentIntent client secret from backend when modal opens and payrollData is present
    if (open && payrollData) {
      fetch("https://paynode-server.vercel.app/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: payrollData.salary,
          email: payrollData.employeeEmail,
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch(() => setClientSecret(null));
    } else {
      setClientSecret(null);
    }
  }, [open, payrollData]);

  return (
    <Dialog open={open} handler={onClose} size="sm">
      <DialogBody>
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm
              payrollData={payrollData}
              clientSecret={clientSecret}
              onPaymentSuccess={() => {
                onClose();
              }}
            />
          </Elements>
        ) : (
          <div>Loading payment form...</div>
        )}
        <div className="flex justify-end">
          <Button variant="text" color="gray" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default PaymentModal;
