import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News Feed",
};

export default function NewsFeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
