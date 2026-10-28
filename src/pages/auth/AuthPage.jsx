import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { useSession } from "@/app/providers/AuthProvider";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Button from "@/components/ui/Button";
import { Field, Input, Tabs } from "@/components/ui/Field";
import { CheckList } from "@/components/marketing";
import ProfileDetailsFields, { profileDetailsSchema } from "@/components/forms/ProfileDetailsFields";
import PhotoPicker from "@/components/forms/PhotoPicker";
import { uploadImage } from "@/lib/uploadImage";
import { reportError } from "@/lib/reportError";

const YEAR = new Date().getFullYear();

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

const registerSchema = profileDetailsSchema.extend({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters").regex(/\d/, "Include at least one number"),
});

const GoogleIcon = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
  </svg>
);

function PasswordInput({ invalid, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input type={show ? "text" : "password"} className="pr-12" invalid={invalid} {...props} />
      <button
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow((v) => !v)}
        className="absolute right-1.5 top-1/2 grid size-10 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-muted hover:text-fg"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function LoginForm() {
  const { signIn } = useSession();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(loginSchema) });

  // On success the session changes and the route guard redirects to the dashboard.
  const onSubmit = async ({ email, password }) => {
    try {
      await signIn(email, password);
    } catch (err) {
      reportError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <Field label="Work email" error={errors.email?.message}>
        <Input type="email" autoComplete="email" placeholder="you@company.com" invalid={!!errors.email} {...register("email")} />
      </Field>
      <Field label="Password" error={errors.password?.message}>
        <PasswordInput autoComplete="current-password" placeholder="Enter your password" invalid={!!errors.password} {...register("password")} />
      </Field>
      <Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? "Signing in…" : "Sign in"}</Button>
    </form>
  );
}

function RegisterForm() {
  const { register: createAccount } = useSession();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [step, setStep] = useState("");
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async ({ email, password, ...details }) => {
    try {
      // Upload first, so a failed upload doesn't leave a half-created account.
      if (photo) {
        setStep("Uploading photo…");
        details.photoUrl = await uploadImage(photo);
      }
      setStep("Creating account…");
      await createAccount({ email, password, ...details });
      toast.success("Account created. HR will verify it before your first payroll.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      reportError(err, setError);
    } finally {
      setStep("");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 sm:grid-cols-2">
      <Field label="Full name" error={errors.name?.message}>
        <Input autoComplete="name" placeholder="Jane Cooper" invalid={!!errors.name} {...register("name")} />
      </Field>
      <Field label="Work email" error={errors.email?.message}>
        <Input type="email" autoComplete="email" placeholder="jane@company.com" invalid={!!errors.email} {...register("email")} />
      </Field>
      <Field label="Password" hint="At least 8 characters, including a number." error={errors.password?.message} className="sm:col-span-2">
        <PasswordInput autoComplete="new-password" placeholder="Create a password" invalid={!!errors.password} {...register("password")} />
      </Field>
      <ProfileDetailsFields register={register} errors={errors} />
      <PhotoPicker file={photo} onChange={setPhoto} error={photoError} onError={setPhotoError} />
      <Button type="submit" size="lg" disabled={isSubmitting} className="sm:col-span-2">{isSubmitting ? step || "Creating account…" : "Create account"}</Button>
      <p className="text-center text-[13px] text-muted sm:col-span-2">
        Everyone joins as an Employee. An admin can give you HR access afterwards.
      </p>
    </form>
  );
}

export default function AuthPage({ mode: initial = "register" }) {
  const [mode, setMode] = useState(initial);
  const [googleBusy, setGoogleBusy] = useState(false);
  const { signInWithGoogle } = useSession();
  const location = useLocation();
  const isRegister = mode === "register";

  const google = async () => {
    setGoogleBusy(true);
    try {
      await signInWithGoogle(); // guards route new Google users to /complete-profile
    } catch (err) {
      console.warn("Google sign-in failed:", err?.code, err?.message);
      if (err?.code === "auth/popup-closed-by-user" || err?.code === "auth/cancelled-popup-request") {
        toast("The Google window closed before sign-in finished. If you did finish, allow pop-ups for this site and try again.", { icon: "ℹ️", duration: 7000 });
      } else {
        reportError(err);
      }
    } finally {
      setGoogleBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-wrap bg-card">
      <main className="flex min-w-0 flex-[999_1_560px] justify-center px-6 pb-14 pt-10">
        <div className="flex w-full max-w-[520px] flex-col gap-7">
          <div className="flex items-center justify-between">
            <Logo size={34} textClassName="text-[19px]" />
            <ThemeToggle />
          </div>
          <Tabs
            label="Account"
            value={mode}
            onChange={setMode}
            items={[{ value: "register", label: "Create account" }, { value: "login", label: "Sign in" }]}
          />
          <div>
            <h1 className="text-[32px] font-extrabold tracking-tight">{isRegister ? "Join your team on PayNode" : "Welcome back"}</h1>
            <p className="mt-2 text-muted">
              {isRegister
                ? "HR will verify your account before your first payroll."
                : location.state?.from
                  ? "Sign in to continue to that page."
                  : "Sign in to see your dashboard."}
            </p>
          </div>

          <Button variant="secondary" onClick={google} disabled={googleBusy}>
            <GoogleIcon /> {googleBusy ? "Waiting for Google…" : "Continue with Google"}
          </Button>

          <div className="flex items-center gap-3 text-[13px] font-semibold text-muted">
            <span className="h-px flex-1 bg-line" />or with email<span className="h-px flex-1 bg-line" />
          </div>

          {isRegister ? <RegisterForm /> : <LoginForm />}

          <p className="text-center text-sm text-muted">
            {isRegister ? "Already have an account? " : "New to PayNode? "}
            <button type="button" onClick={() => setMode(isRegister ? "login" : "register")} className="inline-flex min-h-11 cursor-pointer items-center px-1 font-bold text-brand-dark hover:underline">
              {isRegister ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </main>

      <aside className="flex min-w-0 flex-[1_1_440px] flex-col justify-between gap-12 bg-ink px-12 py-14 text-white">
        <img src="/logo.png" alt="PayNode" width={64} height={64} />
        <div className="flex flex-col gap-7">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">Your hours, your pay, all in one place.</h2>
          <CheckList dark items={["Log tasks and hours from any device", "See every salary payment with its Stripe receipt", "Bank details encrypted and never shown in full"]} />
        </div>
        <p className="text-[13px] text-[#9aa8bf]">
          <Link to="/" className="inline-flex min-h-11 items-center hover:text-white">← Back to home</Link> · © {YEAR} PayNode
        </p>
      </aside>
    </div>
  );
}

