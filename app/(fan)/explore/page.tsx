"use client";

import { useState, useEffect } from "react";
import { getCreatorAccounts, type CreatorProfile } from "@/lib/db";

type Creator = CreatorProfile;

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "K";
  return String(n);
}

function CreatorCard({
  creator,
  onSubscribe,
  subscribed,
}: {
  creator: Creator;
  onSubscribe: () => void;
  subscribed: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      {/* Avatar placeholder */}
      <div className="flex aspect-square items-center justify-center bg-zinc-100 text-4xl dark:bg-zinc-800">
        {creator.username?.charAt(0) ?? "?"}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          {creator.username}
        </h3>
        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {creator.bio}
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          {formatCount(creator.subscriberCount ?? 0)} subscribers
        </p>
        <button
          onClick={onSubscribe}
          className={`w-full rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            subscribed
              ? "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
              : "bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
          }`}
        >
          {subscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [subscribedUids, setSubscribedUids] = useState<Set<string>>(new Set());

  useEffect(() => {
    getCreatorAccounts()
      .then(setCreators)
      .finally(() => setLoading(false));
  }, []);

  const filtered = creators.filter((c) =>
    c.username?.toLowerCase().includes(query.toLowerCase()),
  );

  const toggleSubscribe = (uid: string) => {
    setSubscribedUids((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);
      else next.add(uid);
      return next;
    });
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 bg-zinc-50 px-4 py-8 dark:bg-black">
      <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        Explore
      </h1>

      {/* Search input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search creators..."
        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:placeholder-zinc-500 dark:focus:border-purple-400"
      />

      {loading ? (
        <p className="py-12 text-center text-sm text-zinc-400">Loading creators…</p>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">
          {query ? "No creators match your search." : "No creators yet."}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((creator) => (
            <CreatorCard
              key={creator.uid}
              creator={creator}
              subscribed={subscribedUids.has(creator.uid)}
              onSubscribe={() => toggleSubscribe(creator.uid)}
            />
          ))}
        </div>
      )}
    </div>
  );
}