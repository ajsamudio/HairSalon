"use client";

import { useState } from "react";
import { sendMagicLink } from "@/lib/actions/auth";

type State = "idle" | "loading" | "success" | "error";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const result = await sendMagicLink(email.trim());
    if (result.error) {
      setErrorMsg(result.error);
      setState("error");
    } else {
      setState("success");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 text-center">
        <p className="text-ink font-semibold mb-1">Check your email</p>
        <p className="text-ink-soft text-sm">
          We sent a magic link to <strong>{email}</strong>. Click it to sign in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-ink">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={{ fontSize: "16px" }}
          className="min-h-[48px] px-4 rounded-xl border border-line bg-bg text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
        />
      </div>

      {state === "error" && (
        <p className="text-sm text-red-600 rounded-lg bg-red-50 px-3 py-2">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="min-h-[52px] w-full rounded-xl bg-accent text-white font-semibold text-base hover:brightness-95 active:brightness-90 disabled:opacity-60 transition-all"
      >
        {state === "loading" ? "Sending…" : "Send magic link"}
      </button>
    </form>
  );
}
