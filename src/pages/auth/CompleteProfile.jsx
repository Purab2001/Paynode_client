import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useSession } from "@/app/providers/AuthProvider";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import ProfileDetailsFields, { profileDetailsSchema } from "@/components/forms/ProfileDetailsFields";
import PhotoPicker from "@/components/forms/PhotoPicker";
import { uploadImage } from "@/lib/uploadImage";
import { reportError } from "@/lib/reportError";

/** Second step for accounts that exist in Firebase but have no PayNode profile yet (e.g. Google sign-in). */
export default function CompleteProfile() {
  const { firebaseUser, completeProfile, signOut } = useSession();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: { name: firebaseUser?.displayName ?? "" },
  });

  const onSubmit = async (details) => {
    try {
      if (photo) details.photoUrl = await uploadImage(photo);
      await completeProfile(details);
      toast.success("You're all set. HR will verify your account shortly.");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      reportError(err, setError);
    }
  };

  return (
    <main className="flex min-h-screen justify-center bg-surface px-6 py-12">
      <div className="flex w-full max-w-[560px] flex-col gap-7">
        <Logo size={34} textClassName="text-[19px]" />
        <div>
          <h1 className="text-[32px] font-extrabold tracking-tight">Finish setting up your account</h1>
          <p className="mt-2 text-muted">
            Signed in as <span className="font-bold text-fg">{firebaseUser?.email}</span>. Payroll needs a few details before HR can verify you.
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 rounded-2xl border border-line bg-card p-6 sm:grid-cols-2 sm:p-8">
          <Field label="Full name" error={errors.name?.message} className="sm:col-span-2">
            <Input autoComplete="name" placeholder="Jane Cooper" invalid={!!errors.name} {...register("name")} />
          </Field>
          <ProfileDetailsFields register={register} errors={errors} />
          <PhotoPicker file={photo} onChange={setPhoto} error={photoError} onError={setPhotoError} currentSrc={firebaseUser?.photoURL} />
          <Button type="submit" size="lg" disabled={isSubmitting} className="sm:col-span-2">{isSubmitting ? "Saving…" : "Continue to dashboard"}</Button>
        </form>
        <p className="text-center text-sm text-muted">
          Not you?{" "}
          <button type="button" onClick={signOut} className="cursor-pointer font-bold text-brand-dark hover:underline">Sign out</button>
        </p>
      </div>
    </main>
  );
}
