"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Clock, Scissors, CalendarDays, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/actions/auth";
import { clientConfig } from "@/client.config";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/availability", label: "Availability", icon: Clock, exact: false },
  { href: "/admin/services", label: "Services", icon: Scissors, exact: false },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays, exact: false },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(link: (typeof NAV_LINKS)[number]) {
    return link.exact ? pathname === link.href : pathname.startsWith(link.href);
  }

  const linkClass = (active: boolean) =>
    cn(
      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px]",
      active
        ? "bg-accent/10 text-accent"
        : "text-ink-soft hover:text-ink hover:bg-surface"
    );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 bg-surface border-r border-line min-h-screen">
        <div className="px-4 py-5 border-b border-line">
          <span className="font-heading font-bold text-ink text-base">
            {clientConfig.business.name}
          </span>
          <p className="text-xs text-ink-soft mt-0.5">Admin</p>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass(isActive(link))}>
              <link.icon className="w-4 h-4 shrink-0" aria-hidden />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-line">
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-ink-soft hover:text-ink hover:bg-surface transition-colors w-full min-h-[44px]"
            >
              <LogOut className="w-4 h-4 shrink-0" aria-hidden />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 h-14 bg-surface border-b border-line sticky top-0 z-20">
        <span className="font-heading font-bold text-ink text-base">
          {clientConfig.business.name} Admin
        </span>
        <button
          onClick={() => setMobileOpen(true)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-ink"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" aria-hidden />
        </button>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <nav className="relative z-50 w-64 bg-bg flex flex-col h-full">
            <div className="flex items-center justify-between px-4 h-14 border-b border-line">
              <span className="font-heading font-bold text-ink">Admin</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-ink-soft"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" aria-hidden />
              </button>
            </div>
            <div className="flex-1 px-3 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={linkClass(isActive(link))}
                  onClick={() => setMobileOpen(false)}
                >
                  <link.icon className="w-4 h-4 shrink-0" aria-hidden />
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="px-3 py-4 border-t border-line">
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-ink-soft hover:text-ink hover:bg-surface transition-colors w-full min-h-[44px]"
                >
                  <LogOut className="w-4 h-4 shrink-0" aria-hidden />
                  Sign out
                </button>
              </form>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
