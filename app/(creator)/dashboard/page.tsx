"use client";

import { useState } from "react";
import Link from "next/link";

const sidebarLinks = [
  { label: "Upload", href: "#", icon: "↑" },
  { label: "Earnings", href: "#", icon: "$" },
  { label: "Subscribers", href: "#", icon: "◎" },
  { label: "Settings", href: "#", icon: "⚙" },
];

const quickStats = {
  totalSubs: 1248,
  monthlyEarnings: 342.5,
  payoutGoal: 500,
  payoutEarned: 342.5,
};

export default function CreatorDashboardPage() {
  const [activeTab, setActiveTab] = useState("Upload");

  const payoutPercent = Math.min(
    Math.round((quickStats.payoutEarned / quickStats.payoutGoal) * 100),
    100,
  );

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl gap-0 bg-zinc-50 dark:bg-black">
      {/* Sidebar */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-6 text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Studio
        </h2>
        <nav className="flex flex-col gap-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setActiveTab(link.label)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                activeTab === link.label
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <span className="w-5 text-center text-base">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="mb-6 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h1>

        {/* Quick stat summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Total Subscribers */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Total Subscribers
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {quickStats.totalSubs.toLocaleString()}
            </p>
          </div>

          {/* Monthly Earnings */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Monthly Earnings
            </p>
            <p className="mt-1 text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${quickStats.monthlyEarnings.toFixed(2)}
            </p>
          </div>

          {/* Payout progress */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Payout Progress
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              ${quickStats.payoutEarned.toFixed(2)}{" "}
              <span className="text-sm font-normal text-zinc-400">
                / ${quickStats.payoutGoal}
              </span>
            </p>
            {/* Progress bar */}
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
              <div
                className="h-full rounded-full bg-purple-600 transition-all"
                style={{ width: `${payoutPercent}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {payoutPercent}% of payout threshold reached
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}