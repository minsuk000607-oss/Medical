"use client";

import { useState } from "react";

type Props = {
  documentId: string;
};

export function GenerateInsightButton({ documentId }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/insights/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: documentId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to generate insight");
      }

      setMessage("AI 인사이트가 생성되었습니다. 새로고침하면 반영됩니다.");
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Unknown generation error";

      setMessage(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="my-6 rounded-2xl border p-4">
      <button
        onClick={generate}
        disabled={loading}
        className="rounded-xl border px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {loading ? "생성 중..." : "AI 인사이트 생성"}
      </button>

      {message && <p className="mt-3 text-sm text-gray-500">{message}</p>}
    </div>
  );
}
