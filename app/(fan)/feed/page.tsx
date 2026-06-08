"use client";

import { useState } from "react";

type VideoPost = {
  id: number;
  creatorName: string;
  videoUrl: string;
  caption: string;
  price: number;
};

const MOCK_POSTS: VideoPost[] = [
  {
    id: 1,
    creatorName: "Luna Art",
    videoUrl: "/placeholder-video-1.mp4",
    caption: "Sketching a fantasy landscape 🌄",
    price: 4.99,
  },
  {
    id: 2,
    creatorName: "Neo Beats",
    videoUrl: "/placeholder-video-2.mp4",
    caption: "New lofi track — late night session 🎧",
    price: 2.99,
  },
  {
    id: 3,
    creatorName: "Pixel Chef",
    videoUrl: "/placeholder-video-3.mp4",
    caption: "5-minute ramen hack 🍜",
    price: 1.99,
  },
  {
    id: 4,
    creatorName: "Stella Vlogs",
    videoUrl: "/placeholder-video-4.mp4",
    caption: "Morning routine in Tokyo ✨",
    price: 3.49,
  },
];

function PostCard({ post }: { post: VideoPost }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Video placeholder */}
      <div className="flex aspect-[9/16] items-center justify-center bg-zinc-100 text-xs text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
        🎬 {post.videoUrl}
      </div>

      {/* Card body */}
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {post.creatorName}
          </span>
          <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-600 dark:bg-purple-950 dark:text-purple-400">
            ${post.price.toFixed(2)}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {post.caption}
        </p>
      </div>
    </div>
  );
}

export default function FeedPage() {
  const [posts] = useState(MOCK_POSTS);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col gap-6 bg-zinc-50 px-4 py-8 dark:bg-black">
      <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        Feed
      </h1>

      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
