import Link from "next/link";
import { clientConfig } from "@/client.config";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-20 bg-bg/90 backdrop-blur border-b border-line h-14 flex items-center px-4">
        <Link
          href="/"
          className="font-heading font-bold text-ink hover:text-accent transition-colors"
        >
          {clientConfig.business.name}
        </Link>
      </header>
      <div className="pt-14">{children}</div>
    </>
  );
}
