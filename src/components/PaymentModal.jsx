// PaymentModal.jsx
import React from "react";
import {
  Dialog,
  DialogBody,
  Button,
} from "@material-tailwind/react";
import PaymentForm from "../pages/Dashboard/Admin/PaymentForm";

const PaymentModal = ({ open, onClose, payrollData }) => {
  return (
    <Dialog open={open} handler={onClose} size="sm">
      <DialogBody>
        {/* Optionally pass payrollData as props to PaymentForm if needed */}
        <PaymentForm payrollData={payrollData} />
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
