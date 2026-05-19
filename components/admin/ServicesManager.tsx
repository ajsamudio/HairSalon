"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, X } from "lucide-react";
import {
  createService,
  updateService,
  toggleServiceActive,
} from "@/lib/actions/services";
import { formatCents } from "@/lib/utils";
import type { ServiceRow, ServiceCategory } from "@/types/database";

const CATEGORIES: { value: ServiceCategory; label: string }[] = [
  { value: "cuts", label: "Cuts" },
  { value: "color", label: "Color" },
  { value: "treatments", label: "Treatments" },
  { value: "styling", label: "Styling" },
  { value: "extensions", label: "Extensions" },
  { value: "add-ons" as ServiceCategory, label: "Add-ons" },
];

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface ServiceFormProps {
  initial?: ServiceRow;
  onClose: () => void;
}

function ServiceForm({ initial, onClose }: ServiceFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState<ServiceCategory>(
    initial?.category ?? "cuts"
  );
  const [durationMin, setDurationMin] = useState(
    String(initial?.duration_min ?? 60)
  );
  const [priceDollars, setPriceDollars] = useState(
    initial ? String(initial.price_cents / 100) : ""
  );
  const [depositDollars, setDepositDollars] = useState(
    initial ? String(initial.deposit_cents / 100) : "0"
  );
  const [requiresConsult, setRequiresConsult] = useState(
    initial?.requires_consult ?? false
  );
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function handleNameChange(val: string) {
    setName(val);
    if (!initial) setSlug(slugify(val));
  }

  function submit() {
    setError("");
    const data = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || null,
      category,
      duration_min: parseInt(durationMin, 10),
      price_cents: Math.round(parseFloat(priceDollars) * 100),
      deposit_cents: Math.round(parseFloat(depositDollars || "0") * 100),
      requires_consult: requiresConsult,
    };

    startTransition(async () => {
      const result = initial
        ? await updateService(initial.id, data)
        : await createService(data);
      if (result.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  }

  const inputClass =
    "w-full border border-line rounded-xl px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent";

  return (
    <div className="rounded-xl border border-line p-5 mb-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ink">
          {initial ? "Edit service" : "Add service"}
        </h3>
        <button
          onClick={onClose}
          className="min-h-[40px] min-w-[40px] flex items-center justify-center text-ink-soft hover:text-ink"
          aria-label="Close form"
        >
          <X className="w-4 h-4" aria-hidden />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-ink-soft">Name *</label>
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={inputClass}
            placeholder="e.g. Women's Haircut"
            style={{ fontSize: "16px" }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-ink-soft">Slug *</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={inputClass}
            placeholder="e.g. womens-haircut"
            style={{ fontSize: "16px" }}
          />
        </div>
        <div className="sm:col-span-2 flex flex-col gap-1">
          <label className="text-xs font-medium text-ink-soft">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass}
            placeholder="Short description"
            style={{ fontSize: "16px" }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-ink-soft">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ServiceCategory)}
            className={inputClass}
            style={{ fontSize: "16px" }}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-ink-soft">
            Duration (minutes) *
          </label>
          <input
            type="number"
            min="15"
            step="15"
            value={durationMin}
            onChange={(e) => setDurationMin(e.target.value)}
            className={inputClass}
            style={{ fontSize: "16px" }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-ink-soft">Price ($) *</label>
          <input
            type="number"
            min="0"
            step="1"
            value={priceDollars}
            onChange={(e) => setPriceDollars(e.target.value)}
            className={inputClass}
            placeholder="0"
            style={{ fontSize: "16px" }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-ink-soft">Deposit ($)</label>
          <input
            type="number"
            min="0"
            step="1"
            value={depositDollars}
            onChange={(e) => setDepositDollars(e.target.value)}
            className={inputClass}
            placeholder="0"
            style={{ fontSize: "16px" }}
          />
        </div>
        <div className="sm:col-span-2 flex items-center gap-3 min-h-[44px]">
          <input
            type="checkbox"
            id="requires-consult"
            checked={requiresConsult}
            onChange={(e) => setRequiresConsult(e.target.checked)}
            className="w-4 h-4 accent-accent"
          />
          <label htmlFor="requires-consult" className="text-sm text-ink">
            Requires consultation before booking
          </label>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={pending}
          className="min-h-[44px] px-5 rounded-xl bg-accent text-white text-sm font-semibold disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save service"}
        </button>
        <button
          onClick={onClose}
          className="min-h-[44px] px-5 rounded-xl border border-line text-ink-soft text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

interface Props {
  services: ServiceRow[];
}

export default function ServicesManager({ services }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toggling, startToggle] = useTransition();

  function handleToggle(id: string, current: boolean) {
    startToggle(async () => {
      await toggleServiceActive(id, !current);
    });
  }

  const grouped = CATEGORIES.reduce<Record<string, ServiceRow[]>>((acc, cat) => {
    acc[cat.value] = services.filter((s) => s.category === cat.value);
    return acc;
  }, {});

  const statusBadge = (active: boolean) =>
    active
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-500";

  return (
    <div>
      {!showAdd && (
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 min-h-[44px] px-5 rounded-xl bg-accent text-white text-sm font-semibold mb-6 hover:brightness-95"
        >
          <Plus className="w-4 h-4" aria-hidden /> Add service
        </button>
      )}

      {showAdd && (
        <ServiceForm onClose={() => setShowAdd(false)} />
      )}

      {CATEGORIES.map((cat) => {
        const items = grouped[cat.value];
        if (items.length === 0) return null;
        return (
          <section key={cat.value} className="mb-8">
            <h2 className="text-sm font-semibold text-ink-soft uppercase tracking-wide mb-3">
              {cat.label}
            </h2>
            <div className="rounded-xl border border-line overflow-hidden">
              {items.map((service, i) => (
                <div key={service.id}>
                  {editingId === service.id ? (
                    <div className="p-4">
                      <ServiceForm
                        initial={service}
                        onClose={() => setEditingId(null)}
                      />
                    </div>
                  ) : (
                    <div
                      className={`flex items-center justify-between gap-4 px-4 py-3 ${
                        i !== 0 ? "border-t border-line" : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-ink text-sm">
                            {service.name}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(service.is_active)}`}
                          >
                            {service.is_active ? "active" : "inactive"}
                          </span>
                        </div>
                        <p className="text-xs text-ink-soft mt-0.5">
                          {service.duration_min}min · {formatCents(service.price_cents)}
                          {service.deposit_cents > 0
                            ? ` · ${formatCents(service.deposit_cents)} deposit`
                            : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setEditingId(service.id)}
                          className="min-h-[40px] min-w-[40px] flex items-center justify-center text-ink-soft hover:text-ink transition-colors"
                          aria-label={`Edit ${service.name}`}
                        >
                          <Pencil className="w-4 h-4" aria-hidden />
                        </button>
                        <button
                          onClick={() => handleToggle(service.id, service.is_active)}
                          disabled={toggling}
                          className="min-h-[40px] px-3 rounded-lg border border-line text-xs font-medium text-ink-soft hover:text-ink transition-colors disabled:opacity-60"
                        >
                          {service.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {services.length === 0 && (
        <p className="text-sm text-ink-soft py-4 border border-line rounded-xl px-4">
          No services yet. Add your first service above.
        </p>
      )}
    </div>
  );
}
