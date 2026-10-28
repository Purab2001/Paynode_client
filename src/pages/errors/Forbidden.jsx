import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";

export default function Forbidden() {
  return (
    <main className="grid min-h-screen place-items-center bg-surface px-6">
      <div className="flex flex-col items-center gap-5 text-center">
        <Logo />
        <p className="font-mono text-6xl font-semibold text-brand">403</p>
        <h1 className="text-2xl font-extrabold">You don't have access to this page</h1>
        <Button to="/dashboard">Back to dashboard</Button>
      </div>
    </main>
  );
}
