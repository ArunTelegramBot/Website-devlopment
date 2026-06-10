"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

type Tier = {
  name: string;
  price: number;
  perks: string[];
};

const TIERS: Tier[] = [
  {
    name: "Fan",
    price: 4.99,
    perks: ["Exclusive posts", "Comment access", "Member badge"],
  },
  {
    name: "Super Fan",
    price: 9.99,
    perks: ["Everything in Fan", "Direct messages", "Behind-the-scenes", "Early access"],
  },
];

type CreatorProfile = {
  displayName: string;
  bannerGradient: string;
  avatarInitial: string;
  bio: string;
  subscriberCount: number;
};

const MOCK_CREATORS: Record<string, CreatorProfile> = {
  "luna-art": {
    displayName: "Luna Art",
    bannerGradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    avatarInitial: "L",
    bio: "Sketching fantasy landscapes & dreamy illustrations 🌄✨",
    subscriberCount: 12400,
  },
  "neo-beats": {
    displayName: "Neo Beats",
    bannerGradient: "from-emerald-500 via-teal-500 to-cyan-500",
    avatarInitial: "N",
    bio: "Lofi & chill beats for late night coding 🎧",
    subscriberCount: 8700,
  },
  "pixel-chef": {
    displayName: "Pixel Chef",
    bannerGradient: "from-orange-500 via-red-500 to-rose-500",
    avatarInitial: "P",
    bio: "5-minute recipes & food hacks 🍜",
    subscriberCount: 15300,
  },
  "stella-vlogs": {
    displayName: "Stella Vlogs",
    bannerGradient: "from-pink-500 via-rose-500 to-red-500",
    avatarInitial: "S",
    bio: "Tokyo morning diaries & travel stories ✨",
    subscriberCount: 22100,
  },
};

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "K";
  return String(n);
}

function PremiumFeed() {
  const posts = [
    { id: 1, title: "Sketching a dragon — timelapse 🔥", locked: false },
    { id: 2, title: "Early concept art for the next piece 🎨", locked: false },
    { id: 3, title: "Q&A — ask me anything (members only) 💬", locked: true },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        Premium Feed
      </h3>
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <span className="text-lg">{post.locked ? "🔒" : "📄"}</span>
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            {post.title}
          </span>
        </div>
      ))}
    </div>
  );
}

function PaywallCard({ onSubscribe }: { onSubscribe: (tier: Tier) => void }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white/50 p-6 text-center backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/50">
        <span className="text-3xl">🔒</span>
        <h3 className="mt-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          Subscribe to unlock
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Choose a tier below to access exclusive content
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {tier.name}
              </span>
              <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                ${tier.price.toFixed(2)}/mo
              </span>
            </div>

            <ul className="mt-3 flex flex-col gap-1.5">
              {tier.perks.map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400"
                >
                  <span className="text-purple-500">✓</span>
                  {perk}
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSubscribe(tier)}
              className="mt-4 w-full cursor-pointer rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 bg-zinc-50 px-4 dark:bg-black">
      <span className="text-5xl">🤷</span>
      <h1 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
        Creator not found
      </h1>
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        No creator with that username exists.
      </p>
    </div>
  );
}

export default function CreatorProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeTier, setActiveTier] = useState<string | null>(null);

  const creator = MOCK_CREATORS[username];

  if (!creator) {
    return <NotFound />;
  }

  const handleSubscribe = (tier: Tier) => {
    setActiveTier(tier.name);
    setIsSubscribed(true);
  };

  return (
    <div className="mx-auto min-h-screen bg-zinc-50 dark:bg-black">
      {/* Banner */}
      <div
        className={`h-40 bg-gradient-to-r ${creator.bannerGradient} sm:h-52`}
      />

      {/* Profile section */}
      <div className="mx-auto max-w-lg px-4 pb-8">
        {/* Avatar + name row */}
        <div className="-mt-10 flex items-end gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-purple-100 text-2xl font-bold text-purple-700 shadow-md dark:border-zinc-900 dark:bg-purple-900 dark:text-purple-300">
            {creator.avatarInitial}
          </div>
          <div className="pb-1">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {creator.displayName}
            </h1>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              {formatCount(creator.subscriberCount)} subscribers
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {creator.bio}
        </p>

        {/* Subscription area */}
        <div className="mt-8">
          {isSubscribed ? (
            <div className="space-y-6">
              <div className="rounded-lg bg-purple-50 px-4 py-3 text-sm text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                You&apos;re subscribed as{" "}
                <span className="font-semibold">{activeTier}</span> 🎉
              </div>
              <PremiumFeed />
            </div>
          ) : (
            <PaywallCard onSubscribe={handleSubscribe} />
          )}
        </div>
      </div>
    </div>
  );
}