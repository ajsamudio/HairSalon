import { cn } from "@/lib/utils";

interface CustomerFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
}

interface CustomerFormErrors {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

interface Props {
  data: CustomerFormData;
  errors: CustomerFormErrors;
  onChange: (field: keyof CustomerFormData, value: string) => void;
}

const inputClass = cn(
  "w-full border border-line rounded-xl px-4 bg-bg text-ink placeholder:text-ink-soft",
  "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors",
  "min-h-[52px]"
);

export default function CustomerForm({ data, errors, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="customer-name" className="text-sm font-medium text-ink">
          Full name *
        </label>
        <input
          id="customer-name"
          type="text"
          autoComplete="name"
          value={data.customerName}
          onChange={(e) => onChange("customerName", e.target.value)}
          placeholder="Jane Smith"
          style={{ fontSize: "16px" }}
          className={inputClass}
        />
        {errors.customerName && (
          <p className="text-xs text-red-600">{errors.customerName}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="customer-email" className="text-sm font-medium text-ink">
          Email *
        </label>
        <input
          id="customer-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={data.customerEmail}
          onChange={(e) => onChange("customerEmail", e.target.value)}
          placeholder="jane@example.com"
          style={{ fontSize: "16px" }}
          className={inputClass}
        />
        {errors.customerEmail && (
          <p className="text-xs text-red-600">{errors.customerEmail}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="customer-phone" className="text-sm font-medium text-ink">
          Phone
          <span className="text-ink-soft font-normal ml-1 text-xs">
            (for appointment reminders)
          </span>
        </label>
        <input
          id="customer-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={data.customerPhone}
          onChange={(e) => onChange("customerPhone", e.target.value)}
          placeholder="(555) 555-5555"
          style={{ fontSize: "16px" }}
          className={inputClass}
        />
        {errors.customerPhone && (
          <p className="text-xs text-red-600">{errors.customerPhone}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="customer-notes" className="text-sm font-medium text-ink">
          Notes
          <span className="text-ink-soft font-normal ml-1 text-xs">(optional)</span>
        </label>
        <textarea
          id="customer-notes"
          autoComplete="off"
          value={data.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          placeholder="Anything your stylist should know?"
          rows={3}
          style={{ fontSize: "16px" }}
          className={cn(
            inputClass,
            "min-h-[88px] resize-none py-3"
          )}
        />
      </div>
    </div>
  );
}
