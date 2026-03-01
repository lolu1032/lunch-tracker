"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddRecord() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || parseInt(amount) <= 0) return;

    setSaving(true);
    await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        amount: parseInt(amount),
        memo: memo.trim() || null,
      }),
    });
    router.push("/");
  }

  // 빠른 입력 프리셋
  const presets = [7000, 8000, 9000, 10000, 12000, 15000];

  return (
    <div className="px-4 pt-8 pb-8">
      {/* 헤더 */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-500 mr-3 text-xl"
        >
          ←
        </button>
        <h1 className="text-lg font-bold text-gray-800">점심 기록</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 날짜 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            날짜
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base bg-white"
          />
        </div>

        {/* 금액 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            금액
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-2xl font-bold bg-white pr-12"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              원
            </span>
          </div>

          {/* 프리셋 버튼 */}
          <div className="flex flex-wrap gap-2 mt-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAmount(String(p))}
                className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600 active:bg-gray-200"
              >
                {p.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* 메모 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            메모 (선택)
          </label>
          <input
            type="text"
            placeholder="식당명, 메뉴 등"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            maxLength={200}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base bg-white"
          />
        </div>

        {/* 저장 */}
        <button
          type="submit"
          disabled={saving || !amount || parseInt(amount) <= 0}
          className="w-full bg-emerald-500 text-white py-4 rounded-xl text-base font-semibold disabled:opacity-40 active:bg-emerald-600 transition-colors"
        >
          {saving ? "저장 중..." : "저장"}
        </button>
      </form>
    </div>
  );
}
