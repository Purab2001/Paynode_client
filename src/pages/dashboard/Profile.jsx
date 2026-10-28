import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSession } from "@/app/providers/AuthProvider";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { Field, Input } from "@/components/ui/Field";
import PhotoPicker from "@/components/forms/PhotoPicker";
import { http } from "@/lib/api";
import { uploadImage } from "@/lib/uploadImage";
import { reportError } from "@/lib/reportError";
import { money } from "@/lib/format";

export default function Profile() {
  const { user, setProfile } = useSession();
  const [name, setName] = useState(user.name);
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState("");

  const save = useMutation({
    mutationFn: async () => {
      const body = {};
      if (name.trim() !== user.name) body.name = name.trim();
      if (photo) body.photoUrl = await uploadImage(photo);
      return http.patch("/api/users/me", body);
    },
    onSuccess: (updated) => {
      setProfile(updated);
      setPhoto(null);
      toast.success("Profile updated");
    },
    onError: (err) => reportError(err),
  });

  const submit = (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Enter your full name");
    if (name.trim() === user.name && !photo) return toast("No changes to save.");
    save.mutate();
  };

  return (
    <>
      <PageHeader title="Profile" subtitle="Your personal details." />
      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <Card className="flex flex-col gap-6 self-start p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <Avatar name={user.name} src={user.photoUrl} size={96} />
            <h2 className="text-xl font-extrabold">{user.name}</h2>
            <p className="break-all text-muted">{user.email}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge tone="brand">{user.label}</Badge>
              <Badge tone={user.isVerified ? "ok" : "warn"}>{user.isVerified ? "Verified" : "Awaiting verification"}</Badge>
            </div>
          </div>
          <dl className="flex flex-col divide-y divide-divider border-t border-divider text-sm">
            <div className="flex items-center justify-between gap-4 py-3"><dt className="text-muted">Role</dt><dd className="font-bold">{user.label}</dd></div>
            <div className="flex items-center justify-between gap-4 py-3"><dt className="text-muted">Account</dt><dd className="font-bold">{user.isActive === false ? "Deactivated" : "Active"}</dd></div>
            {user.createdAt && (
              <div className="flex items-center justify-between gap-4 py-3"><dt className="text-muted">Member since</dt><dd className="font-bold">{new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</dd></div>
            )}
          </dl>
        </Card>
        <div className="flex flex-col gap-5">
          <Card as="form" onSubmit={submit} className="flex flex-col gap-5 p-6">
            <h2 className="text-[17px] font-extrabold">Account details</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name">
                <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Jane Cooper" />
              </Field>
              <Field label="Work email" hint="Ask HR to change your email.">
                <Input value={user.email} readOnly />
              </Field>
              <PhotoPicker file={photo} onChange={setPhoto} error={photoError} onError={setPhotoError} currentSrc={user.photoUrl} />
            </div>
            <Button type="submit" className="self-start" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save changes"}</Button>
          </Card>
          <Card className="grid gap-4 p-6 sm:grid-cols-3">
            <div><p className="text-[13px] font-semibold text-muted">Job title</p><p className="mt-1 font-bold">{user.designation || "—"}</p></div>
            <div><p className="text-[13px] font-semibold text-muted">Monthly salary</p><p className="mt-1 font-mono font-semibold">{money(user.salary ?? 0)}</p></div>
            <div><p className="text-[13px] font-semibold text-muted">Bank account</p><p className="mt-1 font-mono font-semibold">{user.bankLast4 ? `•••• ${user.bankLast4}` : "—"}</p></div>
            <p className="text-[13px] text-muted sm:col-span-3">Job title, salary and bank details are managed by HR and admins.</p>
          </Card>
        </div>
      </div>
    </>
  );
}
