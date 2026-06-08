"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import { useT } from "@/i18n/provider";

export default function ContactPage() {
  const t = useT();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const inputBase = "w-full bg-transparent border-b border-[#0A0A0A]/20 py-3 text-[#0A0A0A] placeholder-[#C4C0BB] focus:outline-none focus:border-[#0A0A0A] transition-colors f-body";

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-[#F5F2EC] py-16 lg:py-24 text-center">
        <p className="f-label text-[#B89A6A] mb-4" style={{ fontSize: "9px", letterSpacing: "0.35em" }}>
          {t("contact.eyebrow")}
        </p>
        <h1 className="f-display text-[#0A0A0A]" style={{ fontSize: "clamp(38px, 5vw, 72px)" }}>
          {t("contact.title")}
        </h1>
        <p className="f-body text-[#8A8680] mt-5 max-w-md mx-auto" style={{ fontSize: "13px" }}>
          {t("contact.subtitle")}
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-14 py-20 lg:py-32">
        <div className="grid lg:grid-cols-5 gap-16 lg:gap-24">

          {/* Info column */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <p className="f-label text-[#B89A6A] mb-8" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
                {t("contact.findUs")}
              </p>
              <div className="space-y-8">
                {[
                  { Icon: MapPin,  title: t("contact.visit"), lines: ["12 Rue de la Paix", "Paris, 75002, France"] },
                  { Icon: Phone,   title: t("contact.call"),  lines: ["+33 1 23 45 67 89", "Mon-Sat, 9am-7pm CET"] },
                  { Icon: Mail,    title: t("contact.email"), lines: ["contact@arinas.com", "Reply within 24 hours"] },
                  { Icon: Clock,   title: t("contact.hours"), lines: ["Mon-Sat: 10am-8pm", "Sunday: 12pm-6pm"] },
                ].map(({ Icon, title, lines }) => (
                  <div key={title} className="flex gap-5">
                    <div className="w-9 h-9 border border-[#0A0A0A]/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} strokeWidth={1.5} className="text-[#B89A6A]" />
                    </div>
                    <div>
                      <p className="f-label text-[#0A0A0A] mb-2" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>
                        {title}
                      </p>
                      {lines.map((l) => (
                        <p key={l} className="f-body text-[#8A8680]" style={{ fontSize: "12px", lineHeight: 1.8 }}>{l}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Private appointment card */}
            <div className="bg-[#0A0A0A] p-8">
              <p className="f-label text-[#B89A6A] mb-4" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
                {t("contact.privateShopping")}
              </p>
              <h3 className="f-display text-white mb-4" style={{ fontSize: "clamp(22px, 2vw, 30px)" }}>
                {t("contact.bookTitle")}
              </h3>
              <p className="f-body mb-7" style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", lineHeight: 1.8 }}>
                {t("contact.bookDesc")}
              </p>
              <button
                className="f-label text-[#B89A6A] border border-[#B89A6A] px-6 py-3 hover:bg-[#B89A6A] hover:text-white transition-colors"
                style={{ fontSize: "9px", letterSpacing: "0.25em" }}
              >
                {t("contact.bookNow")}
              </button>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-20">
                <div className="w-14 h-14 border border-[#B89A6A] flex items-center justify-center mb-8">
                  <ArrowRight size={20} strokeWidth={1} className="text-[#B89A6A]" />
                </div>
                <p className="f-label text-[#B89A6A] mb-4" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
                  {t("contact.sent")}
                </p>
                <h3 className="f-display text-[#0A0A0A] mb-4" style={{ fontSize: "clamp(28px, 3vw, 42px)" }}>
                  {t("contact.thankYou")}
                </h3>
                <p className="f-body text-[#8A8680]" style={{ fontSize: "13px" }}>
                  {t("contact.sentDesc")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="f-label text-[#0A0A0A] block mb-3" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>{t("contact.name")}</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={t("contact.namePh")}
                      required
                      className={inputBase}
                      style={{ fontSize: "14px" }}
                    />
                  </div>
                  <div>
                    <label className="f-label text-[#0A0A0A] block mb-3" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>{t("contact.emailLabel")}</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      required
                      className={inputBase}
                      style={{ fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="f-label text-[#0A0A0A] block mb-3" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>{t("contact.subject")}</label>
                  <input
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder={t("contact.subjectPh")}
                    className={inputBase}
                    style={{ fontSize: "14px" }}
                  />
                </div>

                <div>
                  <label className="f-label text-[#0A0A0A] block mb-3" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>{t("contact.message")}</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t("contact.messagePh")}
                    rows={6}
                    required
                    className={`${inputBase} resize-none`}
                    style={{ fontSize: "14px" }}
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-3 f-label text-white bg-[#0A0A0A] px-8 py-4 hover:bg-[#B89A6A] transition-colors"
                  style={{ fontSize: "9px", letterSpacing: "0.28em" }}
                >
                  {t("contact.send")}
                  <ArrowRight size={12} strokeWidth={1.5} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
