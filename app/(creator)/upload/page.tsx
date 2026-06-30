"use client";

import { useState } from "react";
import Link from "next/link";

type VisibilityTier = "public" | "fan" | "super-fan";

const sidebarLinks = [
  { label: "Upload", href: "/creator/upload", icon: "↑" },
  { label: "Dashboard", href: "/creator/dashboard", icon: "☰" },
  { label: "Earnings", href: "#", icon: "$" },
  { label: "Subscribers", href: "#", icon: "◎" },
  { label: "Settings", href: "/creator/settings", icon: "⚙" },
];

const tiers: { key: VisibilityTier; label: string; desc: string }[] = [
  { key: "public", label: "Public", desc: "Visible to everyone" },
  { key: "fan", label: "Fan", desc: "Visible to fans only" },
  { key: "super-fan", label: "Super Fan", desc: "Visible to super fans only" },
];

export default function CreatorUploadPage() {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [tier, setTier] = useState<VisibilityTier>("public");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up API call
  };

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
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                link.label === "Upload"
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
          Upload Post
        </h1>

        <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
          {/* Title */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title…"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-purple-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption…"
              rows={4}
              className="w-full resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-purple-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>

          {/* Visibility tier */}
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Visibility
            </legend>
            <div className="flex flex-col gap-2">
              {tiers.map((t) => (
                <label
                  key={t.key}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
                    tier === t.key
                      ? "border-purple-400 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/20"
                      : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    value={t.key}
                    checked={tier === t.key}
                    onChange={() => setTier(t.key)}
                    className="accent-purple-600"
                  />
                  <div>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {t.label}
                    </span>
                    <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
                      {t.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>

          {/* File Picker placeholder */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Attach File
            </label>
            <div className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 p-8 text-sm text-zinc-400 transition hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:border-zinc-600 dark:hover:bg-zinc-800">
              <span>Click or drag to upload a file</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 active:scale-[0.98]"
          >
            Publish
          </button>
        </form>
      </main>
    </div>
  );
}
