import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-surface px-6">
      <div className="flex flex-col items-center gap-5 text-center">
        <Logo />
        <p className="font-mono text-6xl font-semibold text-brand">404</p>
        <h1 className="text-2xl font-extrabold">We can't find that page</h1>
        <Button to="/">Back to home</Button>
      </div>
    </main>
  );
}
