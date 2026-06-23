"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getCreatorSettings,
  updateCreatorSettings,
} from "@/lib/db";

export default function CreatorSettingsPage() {
  const { user, loading: authLoading } = useAuth();

  const [fanPrice, setFanPrice] = useState("");
  const [superFanPrice, setSuperFanPrice] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Load existing settings on mount
  useEffect(() => {
    if (!user) return;
    (async () => {
      const settings = await getCreatorSettings(user.uid);
      if (settings) {
        setFanPrice(String(settings.fanPrice ?? ""));
        setSuperFanPrice(String(settings.superFanPrice ?? ""));
        setBio(settings.bio ?? "");
      }
    })();
  }, [user]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) return;
      setSaving(true);
      setMessage(null);

      const fan = parseFloat(fanPrice);
      const superFan = parseFloat(superFanPrice);

      if (isNaN(fan) || fan < 0) {
        setMessage({ type: "error", text: "Fan price must be a valid number ≥ 0." });
        setSaving(false);
        return;
      }
      if (isNaN(superFan) || superFan < 0) {
        setMessage({ type: "error", text: "Super Fan price must be a valid number ≥ 0." });
        setSaving(false);
        return;
      }

      try {
        await updateCreatorSettings(user.uid, {
          fanPrice: fan,
          superFanPrice: superFan,
          bio: bio.trim(),
        });
        setMessage({ type: "success", text: "Settings saved successfully!" });
      } catch (err) {
        setMessage({
          type: "error",
          text: err instanceof Error ? err.message : "Failed to save settings.",
        });
      } finally {
        setSaving(false);
      }
    },
    [user, fanPrice, superFanPrice, bio],
  );

  if (authLoading) {
    return (
      <div className="mx-auto flex max-w-lg items-center justify-center py-20 text-sm text-zinc-500">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-lg items-center justify-center py-20 text-sm text-zinc-500">
        Please sign in to access settings.
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Creator Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Configure your subscription tiers and profile bio.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Fan Tier */}
          <div>
            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Fan Tier Price ($/mo)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={fanPrice}
              onChange={(e) => setFanPrice(e.target.value)}
              placeholder="4.99"
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>

          {/* Super Fan Tier */}
          <div>
            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Super Fan Tier Price ($/mo)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={superFanPrice}
              onChange={(e) => setSuperFanPrice(e.target.value)}
              placeholder="9.99"
              className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>

          {/* Custom Bio */}
          <div>
            <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Custom Bio Message
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell fans about yourself…"
              className="mt-1 block w-full resize-none rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>

          {/* Message */}
          {message && (
            <div
              className={`rounded-lg px-4 py-3 text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                  : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full cursor-pointer rounded-lg bg-purple-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-purple-500 dark:hover:bg-purple-600"
          >
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}
