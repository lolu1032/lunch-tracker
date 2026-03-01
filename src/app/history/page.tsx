"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Record {
  id: number;
  date: string;
  amount: number;
  memo: string | null;
}

function formatMoney(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export default function History() {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthLabel = `${now.getFullYear()}년 ${now.getMonth() + 1}월`;
  const [records, setRecords] = useState<Record[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editMemo, setEditMemo] = useState("");

  useEffect(() => {
    fetch(`/api/records?month=${month}`)
      .then((r) => r.json())
      .then(setRecords);
  }, [month]);

  const total = records.reduce((sum, r) => sum + r.amount, 0);

  async function handleDelete(id: number) {
    if (!confirm("삭제할까요?")) return;
    await fetch(`/api/records/${id}`, { method: "DELETE" });
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  function startEdit(r: Record) {
    setEditingId(r.id);
    setEditAmount(String(r.amount));
    setEditMemo(r.memo || "");
  }

  async function handleSaveEdit(id: number) {
    await fetch(`/api/records/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: parseInt(editAmount),
        memo: editMemo.trim() || null,
      }),
    });
    setEditingId(null);
    // 다시 불러오기
    const data = await fetch(`/api/records?month=${month}`).then((r) =>
      r.json()
    );
    setRecords(data);
  }

  return (
    <div className="px-4 pt-8 pb-8">
      {/* 헤더 */}
      <div className="flex items-center mb-6">
        <Link href="/" className="text-gray-500 mr-3 text-xl">
          ←
        </Link>
        <h1 className="text-lg font-bold text-gray-800">기록 관리</h1>
      </div>

      {/* 현재 월 */}
      <div className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-700 font-medium mb-4">
        {monthLabel}
      </div>

      {/* 합계 */}
      <div className="bg-white rounded-xl px-4 py-3 shadow-sm mb-4 flex justify-between">
        <span className="text-sm text-gray-500">
          {records.length}건
        </span>
        <span className="text-sm font-semibold text-gray-800">
          합계 {formatMoney(total)}
        </span>
      </div>

      {/* 기록 리스트 */}
      {records.length === 0 ? (
        <div className="text-center text-gray-400 text-sm py-12">
          이 달에는 기록이 없어요
        </div>
      ) : (
        <div className="space-y-2">
          {records.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-xl px-4 py-3 shadow-sm"
            >
              {editingId === r.id ? (
                /* 수정 모드 */
                <div className="space-y-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={editAmount}
                    onChange={(e) =>
                      setEditAmount(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-base"
                  />
                  <input
                    type="text"
                    value={editMemo}
                    onChange={(e) => setEditMemo(e.target.value)}
                    placeholder="메모"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(r.id)}
                      className="flex-1 bg-emerald-500 text-white py-2 rounded-lg text-sm"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-sm"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                /* 보기 모드 */
                <div
                  className="flex justify-between items-center"
                  onClick={() => startEdit(r)}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {r.memo || "점심"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(r.date).toLocaleDateString("ko-KR", {
                        month: "long",
                        day: "numeric",
                        weekday: "short",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-gray-700">
                      {formatMoney(r.amount)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(r.id);
                      }}
                      className="text-red-400 text-xs px-2 py-1"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
