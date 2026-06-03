"use client";

import { FormEvent, useState } from "react";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function getNextPath(): string {
  if (typeof window === "undefined") return "/admin";
  const next = new URLSearchParams(window.location.search).get("next");
  return next?.startsWith("/admin") && next !== "/admin/login" ? next : "/admin";
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(signInError.message || "Invalid email or password.");
        setPending(false);
        return;
      }

      // Full reload so the server-side guard re-reads the new session cookies.
      window.location.assign(getNextPath());
    } catch {
      setError("Unable to sign in. Please try again.");
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white border border-[#E6E0D8] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#B89A6A] mb-3">Admin Access</p>
        <h1 className="f-display text-[#111111]" style={{ fontSize: "clamp(42px, 7vw, 64px)", lineHeight: 0.95 }}>
          Secure Login
        </h1>
      </div>

      <label className="block mb-5">
        <span className="block text-[10px] uppercase tracking-[0.2em] text-[#6F6A63] mb-2">Email</span>
        <span className="relative block">
          <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8680]" strokeWidth={1.5} />
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full h-12 border border-[#D8D1C8] bg-[#FAF9F7] pl-12 pr-4 text-sm text-[#111111] outline-none transition-colors focus:border-[#B89A6A]"
            required
          />
        </span>
      </label>

      <label className="block mb-6">
        <span className="block text-[10px] uppercase tracking-[0.2em] text-[#6F6A63] mb-2">Password</span>
        <span className="relative block">
          <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8680]" strokeWidth={1.5} />
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full h-12 border border-[#D8D1C8] bg-[#FAF9F7] pl-12 pr-4 text-sm text-[#111111] outline-none transition-colors focus:border-[#B89A6A]"
            required
          />
        </span>
      </label>

      {error && (
        <p className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-3 bg-[#111111] text-white transition-colors hover:bg-[#B89A6A] disabled:cursor-not-allowed disabled:bg-[#111111]/40"
      >
        <span className="text-[11px] uppercase tracking-[0.24em]">{pending ? "Signing In" : "Sign In"}</span>
        <ArrowRight size={20} strokeWidth={1.5} />
      </button>
    </form>
  );
}

