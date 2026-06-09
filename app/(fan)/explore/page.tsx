"use client";

import { useState } from "react";

type Creator = {
  id: number;
  username: string;
  subscriberCount: number;
  bio: string;
};

const MOCK_CREATORS: Creator[] = [
  { id: 1, username: "Luna Art", subscriberCount: 12400, bio: "Sketching fantasy landscapes 🌄" },
  { id: 2, username: "Neo Beats", subscriberCount: 8700, bio: "Lofi & chill beats 🎧" },
  { id: 3, username: "Pixel Chef", subscriberCount: 15300, bio: "5-minute recipes 🍜" },
  { id: 4, username: "Stella Vlogs", subscriberCount: 22100, bio: "Tokyo morning diaries ✨" },
  { id: 5, username: "Cyber Coder", subscriberCount: 9800, bio: "Code & coffee ☕" },
  { id: 6, username: "Mochi Draws", subscriberCount: 3100, bio: "Cute doodles every day 🐱" },
];

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
        {creator.username.charAt(0)}
      </div>

      <div className="space-y-2 p-4">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          {creator.username}
        </h3>
        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {creator.bio}
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          {formatCount(creator.subscriberCount)} subscribers
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
  const [query, setQuery] = useState("");
  const [subscribedIds, setSubscribedIds] = useState<Set<number>>(new Set());

  const filtered = MOCK_CREATORS.filter((c) =>
    c.username.toLowerCase().includes(query.toLowerCase()),
  );

  const toggleSubscribe = (id: number) => {
    setSubscribedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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

      {/* Creator grid */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">
          No creators found.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              subscribed={subscribedIds.has(creator.id)}
              onSubscribe={() => toggleSubscribe(creator.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}