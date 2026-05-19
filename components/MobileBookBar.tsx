"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function MobileBookBar() {
  const [scrollVisible, setScrollVisible] = useState(false);
  const [bookingVisible, setBookingVisible] = useState(false);

  // Show after 400px scroll
  useEffect(() => {
    const onScroll = () => setScrollVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide when #book section is in view
  useEffect(() => {
    const target = document.getElementById("book");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setBookingVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const visible = scrollVisible && !bookingVisible;

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300",
        visible ? "translate-y-0" : "translate-y-full"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href="#book"
        className="flex items-center justify-center w-full h-16 bg-accent text-white font-semibold text-base active:brightness-90"
        tabIndex={visible ? 0 : -1}
      >
        Book Now
      </a>
    </div>
  );
}
