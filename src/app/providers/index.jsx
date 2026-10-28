import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      // Don't retry auth/permission/validation failures; they won't fix themselves.
      retry: (count, err) => !(err?.status >= 400 && err?.status < 500) && count < 2,
    },
  },
});

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-right" toastOptions={{ style: { fontWeight: 600 } }} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
