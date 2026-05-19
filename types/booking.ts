import type { ServiceWithDisplay } from "@/content/services";

export interface Slot {
  starts_at: string;
  ends_at: string;
}

export type BookingStep = "service" | "date" | "time" | "details" | "confirm";

export interface BookingState {
  step: BookingStep;
  service: ServiceWithDisplay | null;
  slot: Slot | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
}

export const BOOKING_STEPS: BookingStep[] = [
  "service",
  "date",
  "time",
  "details",
  "confirm",
];

export const STEP_LABELS: Record<BookingStep, string> = {
  service: "Service",
  date: "Date",
  time: "Time",
  details: "Details",
  confirm: "Confirm",
};
