import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Analysis",
};

export default function AnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen bg-zinc-950 text-white items-center justify-center text-gray-400">
          Loading…
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
