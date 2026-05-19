"use client";

import { useState } from "react";
import { clientConfig } from "@/client.config";
import BookingFlow from "./BookingFlow";
import { cn } from "@/lib/utils";

export default function BookingEmbed() {
  const { mode, iframeSrc } = clientConfig.booking;

  if (mode === "iframe" && iframeSrc) {
    return (
      <div className="w-full rounded-2xl overflow-hidden border border-line">
        <iframe
          src={iframeSrc}
          title="Book an appointment"
          className="w-full min-h-[600px] border-0"
          loading="lazy"
        />
      </div>
    );
  }

  // Native mode — bottom sheet on mobile, inline on desktop
  return <NativeBookingEmbed />;
}

function NativeBookingEmbed() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      {/* Mobile: tap-to-open bottom sheet */}
      <div className="md:hidden">
        <button
          onClick={() => setSheetOpen(true)}
          className="w-full min-h-[56px] rounded-xl bg-accent text-white font-semibold text-base hover:brightness-95 active:brightness-90 transition-all"
        >
          Book your appointment
        </button>

        {/* Bottom sheet */}
        {sheetOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setSheetOpen(false)}
              aria-hidden
            />

            {/* Sheet */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Book your appointment"
              className={cn(
                "fixed left-0 right-0 bottom-0 z-50",
                "bg-bg rounded-t-2xl",
                "h-[85svh]", // use svh for better mobile support
                "flex flex-col",
                "shadow-xl"
              )}
            >
              {/* Drag handle */}
              <div
                className="flex justify-center pt-3 pb-1 shrink-0"
                aria-hidden
              >
                <div className="w-10 h-1 bg-line rounded-full" />
              </div>

              <BookingFlow
                isSheet
                onClose={() => setSheetOpen(false)}
              />
            </div>
          </>
        )}
      </div>

      {/* Desktop: inline booking */}
      <div className="hidden md:block">
        <BookingFlow />
      </div>
    </>
  );
}
