"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  // Create a client (ensure it's not recreated on every render)
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Optional: Devtools for debugging */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
