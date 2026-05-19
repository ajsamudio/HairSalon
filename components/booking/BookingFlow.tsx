"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { clientConfig } from "@/client.config";
import { createBooking } from "@/lib/booking/createBooking";
import BookingStepper from "./BookingStepper";
import ServicePicker from "./ServicePicker";
import DatePicker from "./DatePicker";
import SlotPicker from "./SlotPicker";
import CustomerForm from "./CustomerForm";
import BookingSummary from "./BookingSummary";
import type { BookingState, BookingStep, Slot } from "@/types/booking";
import type { ServiceWithDisplay } from "@/content/services";

interface Props {
  isSheet?: boolean; // bottom-sheet mode (mobile)
  onClose?: () => void;
}

const initialState: BookingState = {
  step: "service",
  service: null,
  slot: null,
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  notes: "",
};

function toLocalDateStr(d: Date, tz: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export default function BookingFlow({ isSheet, onClose }: Props) {
  const router = useRouter();
  const tz = clientConfig.business.timezone;

  const [state, setState] = useState<BookingState>(initialState);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [formErrors, setFormErrors] = useState<{
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
  }>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Lock body scroll when bottom sheet is open
  useEffect(() => {
    if (!isSheet) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSheet]);

  // Fetch slots whenever service + date changes
  const fetchSlots = useCallback(
    async (service: ServiceWithDisplay, date: string) => {
      setSlotsLoading(true);
      setSlots([]);
      try {
        const res = await fetch(
          `/api/availability?service_id=${service.id}&from=${date}&to=${date}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json() as { slots: Slot[] };
        setSlots(json.slots);
      } catch {
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    },
    []
  );

  function selectService(service: ServiceWithDisplay) {
    setState((s) => ({ ...s, service, slot: null, step: "date" }));
    // Pre-select today
    const today = toLocalDateStr(new Date(), tz);
    setSelectedDate(today);
    fetchSlots(service, today);
  }

  function selectDate(date: string) {
    setSelectedDate(date);
    setState((s) => ({ ...s, slot: null, step: "time" }));
    if (state.service) {
      fetchSlots(state.service, date);
    }
  }

  function selectSlot(slot: Slot) {
    setState((s) => ({ ...s, slot, step: "details" }));
  }

  function updateField(
    field: keyof Pick<
      BookingState,
      "customerName" | "customerEmail" | "customerPhone" | "notes"
    >,
    value: string
  ) {
    setState((s) => ({ ...s, [field]: value }));
    setFormErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validateDetails(): boolean {
    const errors: typeof formErrors = {};
    if (!state.customerName.trim()) errors.customerName = "Name is required.";
    if (!state.customerEmail.trim()) errors.customerEmail = "Email is required.";
    if (state.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.customerEmail)) {
      errors.customerEmail = "Enter a valid email.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function nextStep() {
    if (state.step === "details") {
      if (!validateDetails()) return;
      setState((s) => ({ ...s, step: "confirm" }));
    }
  }

  function prevStep() {
    const stepMap: Partial<Record<BookingStep, BookingStep>> = {
      date: "service",
      time: "date",
      details: "time",
      confirm: "details",
    };
    const prev = stepMap[state.step];
    if (prev) setState((s) => ({ ...s, step: prev }));
  }

  async function handleSubmit() {
    if (!state.service || !state.slot) return;
    setSubmitting(true);
    setSubmitError("");

    const result = await createBooking({
      service_id: state.service.id,
      starts_at: state.slot.starts_at,
      ends_at: state.slot.ends_at,
      customer_name: state.customerName,
      customer_email: state.customerEmail,
      customer_phone: state.customerPhone || null,
      notes: state.notes || null,
    });

    setSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error);
      if (result.slotTaken) {
        // Go back to time step
        setState((s) => ({ ...s, slot: null, step: "time" }));
      }
      return;
    }

    if ("confirmed" in result && result.confirmed) {
      router.push(`/booking/confirm?booking_id=${result.bookingId}`);
      return;
    }

    if ("checkoutUrl" in result) {
      router.push(result.checkoutUrl);
    }
  }

  // Step titles
  const stepTitles: Record<BookingStep, string> = {
    service: "Choose a service",
    date: "Pick a date",
    time: "Pick a time",
    details: "Your details",
    confirm: "Review & pay",
  };

  const canContinueFromDetails =
    state.step === "details" &&
    state.customerName.trim() !== "" &&
    state.customerEmail.trim() !== "";

  const contentArea = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-line shrink-0">
        <div className="flex items-center gap-3">
          {state.step !== "service" && (
            <button
              onClick={prevStep}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-ink-soft hover:text-ink -ml-2"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden />
            </button>
          )}
          <h2 className="font-semibold text-ink">{stepTitles[state.step]}</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-ink-soft hover:text-ink"
            aria-label="Close booking"
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
        )}
      </div>

      {/* Stepper */}
      <div className="px-4 py-3 border-b border-line shrink-0">
        <BookingStepper currentStep={state.step} />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Desktop: two-column layout on confirm + details */}
        <div
          className={cn(
            "p-4",
            !isSheet &&
              (state.step === "confirm" || state.step === "details") &&
              "md:grid md:grid-cols-[1fr_320px] md:gap-6"
          )}
        >
          {/* Main step content */}
          <div>
            {state.step === "service" && (
              <ServicePicker
                selected={state.service}
                onSelect={selectService}
              />
            )}

            {state.step === "date" && state.service && (
              <DatePicker
                selectedDate={selectedDate}
                onSelect={selectDate}
                maxDaysAhead={clientConfig.booking.maxDaysAhead}
              />
            )}

            {state.step === "time" && (
              <SlotPicker
                slots={slots}
                loading={slotsLoading}
                selected={state.slot}
                onSelect={selectSlot}
              />
            )}

            {state.step === "details" && (
              <CustomerForm
                data={{
                  customerName: state.customerName,
                  customerEmail: state.customerEmail,
                  customerPhone: state.customerPhone,
                  notes: state.notes,
                }}
                errors={formErrors}
                onChange={updateField}
              />
            )}

            {state.step === "confirm" && (
              <div className="flex flex-col gap-4">
                {/* Mobile summary — hidden on desktop (shown in sidebar) */}
                <div className="md:hidden">
                  <BookingSummary state={state} />
                </div>

                {/* Contact details review */}
                <div className="rounded-xl border border-line p-4 flex flex-col gap-2">
                  <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide">
                    Your details
                  </p>
                  <p className="text-sm font-medium text-ink">{state.customerName}</p>
                  <p className="text-sm text-ink-soft">{state.customerEmail}</p>
                  {state.customerPhone && (
                    <p className="text-sm text-ink-soft">{state.customerPhone}</p>
                  )}
                  {state.notes && (
                    <p className="text-sm text-ink-soft italic">{state.notes}</p>
                  )}
                </div>

                <p className="text-xs text-ink-soft">
                  By booking you agree to our 24-hour cancellation policy. Deposits
                  are non-refundable within 24h of your appointment.
                </p>

                {submitError && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                    {submitError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Desktop summary sidebar */}
          {!isSheet &&
            (state.step === "confirm" || state.step === "details") && (
              <div className="hidden md:block">
                <BookingSummary state={state} />
              </div>
            )}
        </div>
      </div>

      {/* Sticky footer CTA */}
      {(state.step === "details" || state.step === "confirm") && (
        <div
          className="shrink-0 p-4 border-t border-line"
          style={{ paddingBottom: isSheet ? "calc(env(safe-area-inset-bottom) + 1rem)" : undefined }}
        >
          {state.step === "details" && (
            <button
              onClick={nextStep}
              disabled={!canContinueFromDetails}
              className="w-full min-h-[52px] rounded-xl bg-accent text-white font-semibold text-base disabled:opacity-50 hover:brightness-95 active:brightness-90 transition-all"
            >
              Review booking
            </button>
          )}
          {state.step === "confirm" && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full min-h-[52px] rounded-xl bg-accent text-white font-semibold text-base disabled:opacity-60 hover:brightness-95 active:brightness-90 transition-all"
            >
              {submitting ? "Processing…" : "Continue to payment"}
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (isSheet) {
    return contentArea;
  }

  return (
    <div className="rounded-2xl border border-line bg-bg overflow-hidden min-h-[500px]">
      {contentArea}
    </div>
  );
}
