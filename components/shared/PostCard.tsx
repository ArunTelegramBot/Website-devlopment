"use client";

import { useState, useCallback } from "react";
import { toggleLike, type Post } from "@/lib/db";

type PostCardProps = {
  post: Post;
  currentUserId: string | null;
};

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const initialLiked = !!(currentUserId && post.likedBy?.includes(currentUserId));
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);

  const handleLike = useCallback(async () => {
    if (!currentUserId) return;

    // Optimistic update
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((c) => (newLiked ? c + 1 : c - 1));

    try {
      await toggleLike(post.id, currentUserId, liked);
    } catch {
      // Rollback on failure
      setLiked(liked);
      setLikeCount((c) => (newLiked ? c - 1 : c + 1));
    }
  }, [post.id, currentUserId, liked]);

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

        {/* Like button */}
        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={handleLike}
            disabled={!currentUserId}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm transition-colors ${
              liked
                ? "bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400"
                : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            } disabled:opacity-50`}
            aria-label={liked ? "Unlike" : "Like"}
          >
            <span className="text-base">{liked ? "❤️" : "🤍"}</span>
            <span>{likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}