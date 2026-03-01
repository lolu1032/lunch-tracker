"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Summary {
  budget: number;
  totalSpent: number;
  remaining: number;
  remainingDays: number;
  dailyAvg: number;
  recordCount: number;
}

interface Record {
  id: number;
  date: string;
  amount: number;
  memo: string | null;
}

function formatMoney(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export default function Home() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [records, setRecords] = useState<Record[]>([]);

  function reload() {
    fetch("/api/summary")
      .then((r) => r.json())
      .then(setSummary);
    fetch("/api/records")
      .then((r) => r.json())
      .then((data) => setRecords(data.slice(0, 5)));
  }

  useEffect(() => { reload(); }, []);

  async function handleDelete(id: number) {
    if (!confirm("삭제할까요?")) return;
    await fetch(`/api/records/${id}`, { method: "DELETE" });
    reload();
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-400">로딩 중...</div>
      </div>
    );
  }

  const ratio = summary.totalSpent / summary.budget;
  const barColor =
    ratio > 0.9 ? "bg-red-500" : ratio > 0.7 ? "bg-orange-400" : "bg-emerald-500";
  const remainColor =
    summary.remaining < 30000
      ? "text-red-600"
      : summary.remaining < 70000
        ? "text-orange-500"
        : "text-emerald-600";

  return (
    <div className="px-4 pt-8 pb-24">
      {/* 헤더 */}
      <h1 className="text-lg font-bold text-gray-800 mb-6">점심 계산기</h1>

      {/* 잔액 카드 */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-4">
        <p className="text-sm text-gray-500 mb-1">이번 달 남은 금액</p>
        <p className={`text-4xl font-extrabold ${remainColor}`}>
          {formatMoney(summary.remaining)}
        </p>

        {/* 프로그레스 바 */}
        <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${Math.min(ratio * 100, 100)}%` }}
          />
        </div>

        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>{formatMoney(summary.totalSpent)} 사용</span>
          <span>{formatMoney(summary.budget)}</span>
        </div>
      </div>

      {/* 일평균 카드 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400">남은 영업일</p>
            <p className="text-lg font-bold text-gray-800">
              {summary.remainingDays}일
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">하루 평균 사용 가능</p>
            <p className="text-lg font-bold text-gray-800">
              {formatMoney(summary.dailyAvg)}
            </p>
          </div>
        </div>
      </div>

      {/* 최근 기록 */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-gray-700">최근 기록</h2>
        <Link href="/history" className="text-xs text-blue-500">
          전체 보기
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center text-gray-400 text-sm">
          아직 기록이 없어요
        </div>
      ) : (
        <div className="space-y-2">
          {records.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-xl px-4 py-3 shadow-sm flex justify-between items-center"
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
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-700">
                  -{formatMoney(r.amount)}
                </p>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="text-red-400 text-xs px-1.5 py-0.5 rounded hover:bg-red-50"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 추가 버튼 */}
      <Link
        href="/add"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-lg active:scale-95 transition-transform"
      >
        +
      </Link>
    </div>
  );
}
