"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getFeedPosts, type Post } from "@/lib/db";

type VideoPost = Post;

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
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeedPosts(user?.uid ?? null)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col gap-6 bg-zinc-50 px-4 py-8 dark:bg-black">
      <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        Feed
      </h1>

      {loading ? (
        <p className="py-12 text-center text-sm text-zinc-400">Loading posts…</p>
      ) : posts.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">
          No posts yet. Follow some creators!
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
