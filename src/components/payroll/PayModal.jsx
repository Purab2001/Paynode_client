import { useEffect, useRef, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { payrollKeys, useCreatePaymentIntent, usePayrollRequest } from "@/features/payroll/api";
import { MONTHS } from "@/config/constants";
import { stripePromise } from "@/lib/stripe";
import { money } from "@/lib/format";

const APPEARANCE = { variables: { colorPrimary: "#2563eb", fontFamily: "Manrope, system-ui, sans-serif", borderRadius: "10px" } };
const GIVE_UP_AFTER_MS = 30_000;

/** The card form. Stripe confirms the charge; our server marks the request paid when Stripe's webhook arrives. */
function CardForm({ request, onDone }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const startedAt = useRef(0);
  const qc = useQueryClient();

  // After Stripe accepts the card, poll our own API until the webhook has flipped the request to paid.
  const latest = usePayrollRequest(request.id, { poll: confirmed });

  const finished = useRef(false);

  useEffect(() => {
    if (!confirmed || finished.current) return;
    const paid = latest.data?.status === "paid";
    if (!paid && Date.now() - startedAt.current <= GIVE_UP_AFTER_MS) return;
    finished.current = true; // the effect re-runs on every render; announce the result once
    qc.invalidateQueries({ queryKey: payrollKeys.all });
    if (paid) toast.success(`Paid ${request.employee.name} ${money(request.amount, { cents: true })}`);
    else toast("Stripe accepted the payment. It will show as paid in a moment.");
    onDone();
  }, [confirmed, latest.data, latest.dataUpdatedAt, request, qc, onDone]);

  const submit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);
    const { error: stripeError } = await stripe.confirmPayment({ elements, redirect: "if_required" });
    if (stripeError) {
      setError(stripeError.message ?? "The payment didn't go through. Check the card details and try again.");
      setSubmitting(false);
      return;
    }
    startedAt.current = Date.now();
    setConfirmed(true);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <PaymentElement />
      {error && <p role="alert" className="text-[13px] font-medium text-bad">{error}</p>}
      <Button type="submit" size="lg" disabled={!stripe || submitting}>
        {confirmed ? "Waiting for confirmation…" : submitting ? "Processing…" : `Pay ${money(request.amount, { cents: true })}`}
      </Button>
      <p className="flex items-center justify-center gap-2 text-[13px] text-muted">
        <Lock size={14} aria-hidden="true" /> Processed by Stripe. Marked paid once Stripe confirms.
      </p>
    </form>
  );
}

function PayBody({ request, onClose }) {
  const { mutate, data, error, isPending } = useCreatePaymentIntent();
  useEffect(() => mutate(request.id), [mutate, request.id]);

  return (
    <>
      <dl className="flex flex-col gap-2.5 rounded-xl bg-surface p-4 text-sm">
        <div className="flex justify-between"><dt className="text-muted">Pay period</dt><dd className="font-bold">{MONTHS[request.period.month - 1]} {request.period.year}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">Requested by</dt><dd className="font-bold">{request.requestedBy.name}</dd></div>
        <div className="my-1 h-px bg-line" />
        <div className="flex items-baseline justify-between"><dt className="font-bold">Amount</dt><dd className="font-mono text-2xl font-semibold">{money(request.amount, { cents: true })}</dd></div>
      </dl>

      {!stripePromise && <p role="alert" className="text-sm text-bad">Stripe isn't configured. Set VITE_STRIPE_PUBLISHABLE_KEY and reload.</p>}
      {isPending && <p className="text-sm text-muted" aria-live="polite">Preparing a secure payment…</p>}
      {error && (
        <div role="alert" className="flex flex-col gap-3">
          <p className="text-sm text-bad">{error.message}</p>
          <Button variant="secondary" onClick={() => mutate(request.id)}>Try again</Button>
        </div>
      )}
      {data && stripePromise && (
        <Elements stripe={stripePromise} options={{ clientSecret: data.clientSecret, appearance: APPEARANCE }}>
          <CardForm request={request} onDone={onClose} />
        </Elements>
      )}
    </>
  );
}

export default function PayModal({ request, onClose }) {
  return (
    <Modal open={!!request} onClose={onClose} title={`Pay ${request?.employee.name ?? ""}`}>
      {request && <PayBody key={request.id} request={request} onClose={onClose} />}
    </Modal>
  );
}
