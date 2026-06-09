"use client";

import { FormEvent, useState } from "react";
import { Mail, Lock, ArrowRight, Eye, EyeOff, User } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useT } from "@/i18n/provider";
import Link from "next/link";

type Tab = "signIn" | "register";

export default function AccountLoginPage() {
  const t = useT();
  const [tab, setTab] = useState<Tab>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");

    const supabase = createSupabaseBrowserClient();

    if (tab === "signIn") {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (err) {
        setError(t("auth.invalidCredentials", "Email ou mot de passe incorrect."));
        setPending(false);
        return;
      }
      window.location.assign("/account/orders");
    } else {
      const { error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName.trim() } },
      });
      if (err) {
        setError(err.message);
        setPending(false);
        return;
      }
      setSuccess(t("auth.checkEmail", "Vérifiez votre email pour confirmer votre compte."));
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-[9px] uppercase tracking-[0.35em] text-[#B89A6A] mb-3">
            {t("account.account", "Compte")}
          </p>
          <h1
            className="text-[#0A0A0A]"
            style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(38px, 6vw, 56px)", fontWeight: 300, lineHeight: 0.95 }}
          >
            {tab === "signIn" ? t("account.signIn", "Connexion") : t("account.createAccount", "Créer un compte")}
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E4DDD4] mb-8">
          {(["signIn", "register"] as Tab[]).map((k) => (
            <button
              key={k}
              onClick={() => { setTab(k); setError(""); setSuccess(""); }}
              className="flex-1 pb-3 text-[10px] uppercase tracking-[0.22em] transition-colors"
              style={{
                color: tab === k ? "#0A0A0A" : "#8A8680",
                borderBottom: tab === k ? "2px solid #0A0A0A" : "2px solid transparent",
                marginBottom: "-1px",
              }}
            >
              {k === "signIn" ? t("account.signIn", "Connexion") : t("account.createAccount", "Créer un compte")}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-[#EAE6E0] p-8 shadow-sm space-y-5">
          {tab === "register" && (
            <label className="block">
              <span className="block text-[9px] uppercase tracking-[0.22em] text-[#6F6A63] mb-2">
                {t("auth.fullName", "Nom complet")}
              </span>
              <span className="relative block">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8680]" strokeWidth={1.5} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 border border-[#D8D1C8] bg-[#FAF9F7] pl-10 pr-4 text-sm text-[#111] outline-none focus:border-[#B89A6A] transition-colors"
                  required
                />
              </span>
            </label>
          )}

          <label className="block">
            <span className="block text-[9px] uppercase tracking-[0.22em] text-[#6F6A63] mb-2">Email</span>
            <span className="relative block">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8680]" strokeWidth={1.5} />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 border border-[#D8D1C8] bg-[#FAF9F7] pl-10 pr-4 text-sm text-[#111] outline-none focus:border-[#B89A6A] transition-colors"
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="block text-[9px] uppercase tracking-[0.22em] text-[#6F6A63] mb-2">
              {t("auth.password", "Mot de passe")}
            </span>
            <span className="relative block">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8680]" strokeWidth={1.5} />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete={tab === "signIn" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 border border-[#D8D1C8] bg-[#FAF9F7] pl-10 pr-10 text-sm text-[#111] outline-none focus:border-[#B89A6A] transition-colors"
                required
                minLength={tab === "register" ? 6 : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8680] hover:text-[#0A0A0A] transition-colors"
              >
                {showPassword ? <EyeOff size={15} strokeWidth={1.5} /> : <Eye size={15} strokeWidth={1.5} />}
              </button>
            </span>
          </label>

          {error && (
            <p className="border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">{error}</p>
          )}
          {success && (
            <p className="border border-green-200 bg-green-50 px-4 py-3 text-xs text-green-700">{success}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="flex h-12 w-full items-center justify-center gap-3 bg-[#0A0A0A] text-white transition-colors hover:bg-[#B89A6A] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-[10px] uppercase tracking-[0.24em]">
              {pending
                ? "..."
                : tab === "signIn"
                ? t("account.signIn", "Connexion")
                : t("account.createAccount", "Créer un compte")}
            </span>
            {!pending && <ArrowRight size={16} strokeWidth={1.5} />}
          </button>
        </form>

        <p className="text-center mt-6 text-[10px] text-[#8A8680] tracking-wide">
          <Link href="/shop" className="hover:text-[#B89A6A] transition-colors underline-offset-2 hover:underline">
            {t("cart.continue", "Continuer les achats")}
          </Link>
        </p>
      </div>
    </div>
  );
}
