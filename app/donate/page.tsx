"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  Building2,
  Check,
  Coins,
  Copy,
  Heart,
  HelpCircle,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Gateway {
  id: "easypaisa" | "jazzcash" | "nayapay" | "bank" | "crypto";
  name: string;
  badge: string;
  color: string;
  accountName: string;
  instructions: string;
  details: { label: string; val: string; copyable?: boolean }[];
  /** When true, the gateway is not yet active — shows a "Coming Soon" note. */
  comingSoon?: boolean;
}

const GATEWAYS: Gateway[] = [
  {
    id: "easypaisa",
    name: "EasyPaisa",
    badge: "Instant Transfer",
    color: "#00A859",
    accountName: "Muhammad Shafiq",
    instructions: "Open EasyPaisa App → Tap 'Send Money' → Choose EasyPaisa or Raast → Enter the number below and confirm.",
    details: [
      { label: "Account Title", val: "Muhammad Shafiq", copyable: true },
      { label: "EasyPaisa / Raast Number", val: "03435493880", copyable: true },
      { label: "Transfer Method", val: "EasyPaisa App / Raast Instant", copyable: false },
      { label: "Fee", val: "0 PKR (100% Free Transfer)", copyable: false },
    ],
  },
  {
    id: "jazzcash",
    name: "JazzCash",
    badge: "JazzCash App",
    color: "#E50914",
    accountName: "Syed Ahmad",
    instructions: "Open JazzCash App → Tap 'Send Money' → Enter the number below and complete the transfer.",
    details: [
      { label: "Account Title", val: "Syed Ahmad", copyable: true },
      { label: "JazzCash Mobile Number", val: "03025247290", copyable: true },
      { label: "Payment Gateway", val: "JazzCash Mobile", copyable: false },
    ],
  },
  {
    id: "nayapay",
    name: "NayaPay",
    badge: "Coming Soon",
    color: "#F36F21",
    accountName: "—",
    comingSoon: true,
    instructions: "NayaPay payments are coming soon. Please use EasyPaisa, JazzCash or Crypto until then.",
    details: [{ label: "NayaPay", val: "Coming Soon", copyable: false }],
  },
  {
    id: "bank",
    name: "Direct Bank Transfer",
    badge: "Coming Soon",
    color: "#1E3A8A",
    accountName: "—",
    comingSoon: true,
    instructions: "Direct Bank Transfer is coming soon. Please use EasyPaisa, JazzCash or Crypto until then.",
    details: [{ label: "Bank Transfer", val: "Coming Soon", copyable: false }],
  },
  {
    id: "crypto",
    name: "Crypto (MetaMask)",
    badge: "Ethereum",
    color: "#627EEA",
    accountName: "Hidayah MetaMask Wallet",
    instructions: "Send Ethereum-based assets (ETH / USDT ERC-20 / MATIC etc.) directly to the MetaMask wallet address below.",
    details: [
      { label: "Network", val: "Ethereum (ERC-20)", copyable: false },
      {
        label: "MetaMask Wallet Address",
        val: "0xc2BD51bFeF5aD587B50b8164beAdE05355FA742b",
        copyable: true,
      },
      { label: "Currency", val: "ETH / USDT (ERC-20)", copyable: false },
    ],
  },
];

const AMOUNTS = [
  { val: 500, label: "₨ 500", desc: "Covers 100+ audio tilawat recitations & hosting" },
  { val: 1000, label: "₨ 1,000", desc: "Covers 1 month of AI Quran search server bandwidth" },
  { val: 2500, label: "₨ 2,500", desc: "Supports daily Quran, Hadith & Tasbeeh database" },
  { val: 5000, label: "₨ 5,000", desc: "Sadaqah Jariyah for app maintenance & new features" },
];

const PURPOSES = [
  { id: "sadaqah", label: "🤲 General Sadaqah" },
  { id: "jariyah", label: "✨ Sadaqah Jariyah" },
  { id: "zakat", label: "🌙 Zakat Eligible" },
  { id: "hosting", label: "💻 Server & AI Hosting" },
];

export default function DonatePage() {
  const [activeTab, setActiveTab] = useState<Gateway["id"]>("easypaisa");
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(1000);
  const [customVal, setCustomVal] = useState("");
  const [purpose, setPurpose] = useState("sadaqah");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const gw = GATEWAYS.find((g) => g.id === activeTab) ?? GATEWAYS[0];

  const handleCopy = (text: string, key: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-10">

      {/* ══ 1. HERO BANNER PANEL (MATCHING AI SEARCH BANNER) ═══════════════════ */}
      <section className="relative overflow-hidden rounded-[2.5rem] border-2 border-[#BFA059]/70 shadow-[0_0_50px_rgba(191,160,89,0.35)] min-h-[360px] flex items-center justify-center text-center text-white py-12 px-4 sm:px-8">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/ai-banner.jpg"
            alt="Support Hidayah Hub Banner"
            fill sizes="100vw" quality={75}
            className="object-cover object-center scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070D18]/90 via-black/50 to-[#070D18]/75" />
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-[#BFA059] to-transparent opacity-95" />
        </div>

        {/* Central Hero Content */}
        <div className="relative z-10 mx-auto max-w-3xl w-full space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#BFA059]/80 bg-[#121A26]/85 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#BFA059] backdrop-blur-md shadow-md">
            <Heart className="size-4 fill-[#BFA059] text-[#BFA059]" />
            Sadaqah Jariyah · صدقة جارية
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
            Support <span className="text-[#EAD090]">Hidayah Hub</span>
          </h1>

          <p className="text-sm sm:text-lg text-[#EAD090] font-semibold drop-shadow-sm max-w-2xl mx-auto">
            Keep Quran recitations, Sahih Hadiths, Prayer Times &amp; AI Islamic Search 100% free &amp; ad-free for the global Ummah.
          </p>

          {/* Quranic Verse Box */}
          <div className="mx-auto mt-4 max-w-2xl rounded-3xl border-2 border-[#BFA059]/40 bg-black/60 p-4 backdrop-blur-md space-y-1 shadow-2xl">
            <p dir="rtl" lang="ar" className="font-arabic text-xl sm:text-2xl font-bold leading-relaxed text-[#EAD090]">
              الَّذِينَ يُنفِقُونَ أَمْوَالَهُم بِاللَّيْلِ وَالنَّهَارِ سِرًّا وَعَلَانِيَةً فَلَهُمْ أَجْرُهُمْ عِندَ رَبِّهِمْ
            </p>
            <p className="text-xs italic text-slate-200">
              &ldquo;Those who spend their wealth by night and by day, secretly and publicly — they will have their reward with their Lord.&rdquo; — Surah Al-Baqarah 2:274
            </p>
          </div>
        </div>
      </section>

      {/* ══ 2. MAIN PAYMENT & CALCULATOR SECTION ══════════════════════════════ */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">

        {/* LEFT COLUMN: MULTI-GATEWAY PAYMENT CARD */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className="rounded-[2.5rem] border-2 border-[#BFA059]/40 bg-gradient-to-b from-white to-[#FAF7F0] p-6 sm:p-8 shadow-xl dark:border-night-800 dark:from-night-900 dark:to-night-950 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#BFA059]/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-[#1A202C] text-[#BFA059] shadow-md">
                  <Wallet className="size-6 text-[#BFA059]" />
                </div>
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-extrabold text-[#1A202C] dark:text-gold-100">
                    Select Payment Method
                  </h2>
                  <p className="text-xs font-semibold text-slate-500">EasyPaisa · JazzCash · Crypto (MetaMask)</p>
                </div>
              </div>
            </div>

            {/* Gateway Switcher Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {GATEWAYS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setActiveTab(g.id)}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-2xl border-2 py-3 px-2 text-center transition-all duration-200 active:scale-95 shadow-sm",
                    activeTab === g.id
                      ? "border-[#BFA059] bg-gradient-to-r from-[#BFA059] to-[#D4AF37] text-black shadow-md font-extrabold scale-105"
                      : "border-slate-200 bg-white text-slate-700 hover:border-[#BFA059]/60 dark:border-night-800 dark:bg-night-900 dark:text-slate-200"
                  )}
                >
                  <span className="text-xs font-extrabold truncate">{g.name.split(" ")[0]}</span>
                  <span className="text-[9px] opacity-75">{g.badge}</span>
                </button>
              ))}
            </div>

            {/* Direct EasyPaisa Notice */}
            {activeTab === "easypaisa" && (
              <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50 p-4 text-xs dark:bg-emerald-950/20 space-y-1 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                  <Send className="size-4" />
                  Direct EasyPaisa / Raast Transfer (100% Guaranteed Success)
                </div>
                <p className="leading-relaxed text-emerald-900 dark:text-emerald-200">
                  EasyPaisa app transfers directly using the mobile number below:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-emerald-800 dark:text-emerald-300 font-semibold">
                  <li>Copy Account Title: <strong>Muhammad Shafiq</strong></li>
                  <li>Copy EasyPaisa Number below</li>
                  <li>Open EasyPaisa → <strong>Send Money</strong> → Enter Number &amp; Confirm</li>
                </ol>
              </div>
            )}

            {/* Coming Soon Notice (NayaPay / Bank Transfer) */}
            {gw.comingSoon && (
              <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-[#BFA059]/40 bg-[#FAF7F0] py-10 px-6 text-center shadow-sm dark:bg-night-950">
                <Coins className="size-10 text-[#BFA059]" />
                <p className="text-sm font-extrabold text-[#BFA059]">
                  {gw.name} — Coming Soon
                </p>
                <p className="max-w-sm text-center text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  This payment method is under preparation. Until then, please use
                  <strong>EasyPaisa</strong>, <strong>JazzCash</strong> or
                  <strong>Crypto (MetaMask)</strong>. جزاک اللہ خیر!
                </p>
              </div>
            )}

            {/* Account Details & 1-Click Copy Rows */}
            {!gw.comingSoon && (
              <div className="space-y-3 rounded-3xl border-2 border-[#BFA059]/30 bg-white p-5 shadow-inner dark:bg-night-950">
                {gw.details.map((d) => (
                  <div key={d.label} className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm border-b border-slate-100 dark:border-night-900 pb-2 last:border-none last:pb-0">
                    <span className="font-bold text-slate-500">{d.label}:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-[#1A202C] dark:text-gold-200">
                        {d.val}
                      </span>
                      {d.copyable && (
                        <button
                          type="button"
                          onClick={() => handleCopy(d.val, d.label)}
                          className="inline-flex items-center gap-1 rounded-xl border-2 border-[#BFA059]/50 bg-[#FAF7F0] px-2.5 py-1 text-[11px] font-bold text-[#1A202C] transition hover:bg-[#BFA059]/20 active:scale-95 dark:bg-night-900 dark:text-gold-100 shadow-sm"
                          title="Copy to clipboard"
                        >
                          {copiedKey === d.label ? (
                            <Check className="size-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="size-3.5 text-[#BFA059]" />
                          )}
                          {copiedKey === d.label ? "Copied!" : "Copy"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* WhatsApp Receipt Button */}
            {!gw.comingSoon && (
              <div className="flex flex-col gap-2.5 pt-2">
                <a
                  href={`https://wa.me/?text=Assalamu%20Alaikum!%20I%20have%20sent%20a%20donation%20via%20${encodeURIComponent(gw.name)}%20for%20Hidayah%20Hub.%20Account:%20${encodeURIComponent(gw.accountName)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700 active:scale-95"
                >
                  <MessageCircle className="size-4" />
                  Send Payment Receipt via WhatsApp
                </a>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: DONATION CALCULATOR & TRUST CARDS */}
        <div className="lg:col-span-5 flex flex-col space-y-6">

          {/* Calculator Card */}
          <div className="rounded-[2.5rem] border-2 border-[#BFA059]/40 bg-white p-6 sm:p-8 shadow-xl dark:border-night-800 dark:bg-night-900 space-y-6">
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-extrabold text-[#1A202C] dark:text-gold-100">
                1. Donation Intention
              </h3>
              <p className="text-xs text-slate-500 font-medium">Choose where your contribution goes:</p>
            </div>

            {/* Purpose Selector Grid */}
            <div className="grid grid-cols-2 gap-2">
              {PURPOSES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPurpose(p.id)}
                  className={cn(
                    "rounded-2xl border-2 py-2.5 px-3 text-xs font-bold transition-all text-left shadow-sm",
                    purpose === p.id
                      ? "border-[#BFA059] bg-[#BFA059]/20 text-[#1A202C] dark:text-gold-200 ring-2 ring-[#BFA059]/40"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[#BFA059]/50 dark:border-night-800 dark:bg-night-950 dark:text-slate-300"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="space-y-1 pt-2">
              <h3 className="font-serif text-lg font-extrabold text-[#1A202C] dark:text-gold-100">
                2. Choose Amount
              </h3>
              <p className="text-xs text-slate-500 font-medium">Select a preset amount or enter custom amount:</p>
            </div>

            {/* Preset Amounts */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {AMOUNTS.map((a) => (
                <button
                  key={a.val}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(a.val);
                    setCustomVal("");
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-2xl border-2 py-3 px-2 transition-all active:scale-95 shadow-sm",
                    selectedAmount === a.val
                      ? "border-[#BFA059] bg-gradient-to-r from-[#BFA059] to-[#D4AF37] text-black shadow-md font-black scale-105"
                      : "border-slate-200 bg-white text-slate-700 hover:border-[#BFA059] dark:border-night-800 dark:bg-night-950 dark:text-slate-200"
                  )}
                >
                  <span className="text-sm font-extrabold">{a.label}</span>
                </button>
              ))}
            </div>

            {/* Custom Amount Input */}
            <div>
              <input
                type="number"
                placeholder="Or enter custom amount in PKR (₨)…"
                value={customVal}
                onChange={(e) => {
                  setCustomVal(e.target.value);
                  setSelectedAmount("custom");
                }}
                className="w-full rounded-2xl border-2 border-[#BFA059]/40 bg-[#FAF7F0] px-4 py-3 text-xs sm:text-sm font-medium text-[#1A202C] placeholder-slate-400 outline-none transition focus:border-[#BFA059] focus:ring-4 focus:ring-[#BFA059]/20 dark:bg-night-950 dark:text-gold-50 shadow-inner"
              />
            </div>

            {/* Impact Box */}
            <div className="rounded-2xl border-2 border-[#BFA059]/30 bg-[#FAF7F0] p-4 text-xs dark:bg-night-950 space-y-1 shadow-sm">
              <div className="flex items-center gap-2 font-black text-[#BFA059]">
                <Sparkles className="size-4 text-[#BFA059]" />
                Spiritual Impact Summary:
              </div>
              <p className="leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                {typeof selectedAmount === "number"
                  ? AMOUNTS.find((a) => a.val === selectedAmount)?.desc
                  : customVal
                  ? `Your donation of ₨ ${customVal} directly supports Quran Recitation servers and daily maintenance.`
                  : "Every single rupee helps keep Hidayah Hub 100% free and accessible to Muslims worldwide."}
              </p>
            </div>
          </div>

          {/* Trust Features Card */}
          <div className="rounded-[2.5rem] border-2 border-[#BFA059]/40 bg-gradient-to-br from-[#1A202C] via-[#121A26] to-[#0D1117] p-6 text-white shadow-xl space-y-4">
            <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-[#BFA059]">
              <ShieldCheck className="size-5 text-[#BFA059]" /> Why Donate to Hidayah Hub?
            </h3>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-300 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-[#BFA059] font-bold">✓</span>
                <span><strong>100% Free &amp; Ad-Free Forever:</strong> Zero commercial ads or popups during prayer &amp; tilawat.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#BFA059] font-bold">✓</span>
                <span><strong>Continuous Sadaqah Jariyah:</strong> Continuous rewards (Sawab) whenever anyone recites Quran or Hadiths.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#BFA059] font-bold">✓</span>
                <span><strong>Direct Transparency:</strong> Direct transfers to our verified EasyPaisa / JazzCash / Crypto (MetaMask) accounts with instant receipt confirmation.</span>
              </li>
            </ul>
          </div>

        </div>

      </section>

      {/* ══ 3. FREQUENTLY ASKED QUESTIONS ═════════════════════════════════════ */}
      <section className="mx-auto max-w-4xl space-y-6 pt-4">
        <h2 className="text-center font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wider text-[#1A202C] dark:text-gold-100">
          Frequently Asked Questions (سوالات و جوابات)
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border-2 border-[#BFA059]/30 bg-white p-6 shadow-md dark:border-night-800 dark:bg-night-900 space-y-2">
            <h3 className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#1A202C] dark:text-gold-100">
              <AlertCircle className="size-4 text-[#BFA059]" />
              How do I send via EasyPaisa / Raast?
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Select <strong>EasyPaisa &amp; Raast</strong>, copy the Account Title (<strong>Muhammad Shafiq</strong>) and Mobile Number, open your EasyPaisa app → Send Money → EasyPaisa/Raast, enter the number and complete your donation!
            </p>
          </div>

          <div className="rounded-3xl border-2 border-[#BFA059]/30 bg-white p-6 shadow-md dark:border-night-800 dark:bg-night-900 space-y-2">
            <h3 className="flex items-center gap-2 text-sm sm:text-base font-bold text-[#1A202C] dark:text-gold-100">
              <HelpCircle className="size-4 text-[#BFA059]" />
              Is my donation Zakat eligible?
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              Yes! You can choose the &quot;Zakat Eligible&quot; intention. Zakat funds are strictly used for maintaining free Islamic learning tools and keeping religious resources accessible for deserving students.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}