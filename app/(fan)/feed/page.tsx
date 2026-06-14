"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getFeedPosts, type Post } from "@/lib/db";
import PostCard from "@/components/shared/PostCard";

type VideoPost = Post;

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
    <div className="mx-auto flex min-h-screen max-w-lg flex-col gap-6 overflow-x-hidden break-words bg-zinc-50 px-4 py-8 dark:bg-black">
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
            <PostCard key={post.id} post={post} currentUserId={user?.uid ?? null} />
          ))}
        </div>
      )}
    </div>
  );
}