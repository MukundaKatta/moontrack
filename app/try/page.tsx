"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

interface CycleData {
  startDate: string; // ISO date string YYYY-MM-DD
  moods: Record<string, string>; // date string → mood note
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function parseDate(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function displayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getNextWeekDates(from: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(from, i));
}

export default function TryPage() {
  const [cycleData, setCycleData] = useState<CycleData | null>(null);
  const [inputDate, setInputDate] = useState(formatDate(new Date()));
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("moontrack_cycle");
      if (raw) {
        setCycleData(JSON.parse(raw) as CycleData);
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  function saveCycle(data: CycleData) {
    setCycleData(data);
    try {
      localStorage.setItem("moontrack_cycle", JSON.stringify(data));
    } catch {
      // ignore
    }
  }

  function handleLogCycle(e: React.FormEvent) {
    e.preventDefault();
    saveCycle({ startDate: inputDate, moods: {} });
  }

  function handleMoodChange(dateStr: string, value: string) {
    if (!cycleData) return;
    const updated: CycleData = {
      ...cycleData,
      moods: { ...cycleData.moods, [dateStr]: value },
    };
    saveCycle(updated);
  }

  function handleReset() {
    setCycleData(null);
    try {
      localStorage.removeItem("moontrack_cycle");
    } catch {
      // ignore
    }
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-fuchsia-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const nextDate = cycleData ? addDays(parseDate(cycleData.startDate), 28) : null;
  const weekDates = nextDate ? getNextWeekDates(addDays(nextDate, -3)) : null;

  return (
    <div className="min-h-screen bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-fuchsia-500" />
          Moontrack
        </Link>
        <Link
          href="/#waitlist"
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700"
        >
          Get early access
        </Link>
      </nav>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-600">
            Private tracker
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Your cycle. Your data. Right here.
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Everything stays in your browser. No account, no cloud, no tracking.
          </p>
        </div>

        {/* Log / update cycle start */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold tracking-tight">
            {cycleData ? "Last cycle start" : "Log your cycle start"}
          </h2>
          <form onSubmit={handleLogCycle} className="mt-4 flex gap-3 flex-wrap">
            <input
              type="date"
              value={inputDate}
              max={formatDate(new Date())}
              onChange={(e) => setInputDate(e.target.value)}
              required
              className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-900/10"
            />
            <button
              type="submit"
              className="rounded-full bg-fuchsia-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-fuchsia-700"
            >
              {cycleData ? "Update" : "Save"}
            </button>
            {cycleData && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-600 transition hover:border-neutral-500"
              >
                Reset
              </button>
            )}
          </form>

          {cycleData && (
            <p className="mt-3 text-xs text-neutral-400">
              Logged:{" "}
              <span className="font-medium text-neutral-600">
                {displayDate(parseDate(cycleData.startDate))}
              </span>
            </p>
          )}
        </div>

        {/* Prediction */}
        {nextDate && (
          <div className="mt-6 rounded-3xl border border-fuchsia-200 bg-fuchsia-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-600">
              Next predicted cycle
            </p>
            <p className="mt-2 text-2xl font-bold text-neutral-900">
              {displayDate(nextDate)}
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Based on a 28-day cycle from your logged start date.
            </p>
          </div>
        )}

        {/* Mood notes for next 7 days around predicted date */}
        {weekDates && cycleData && (
          <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold tracking-tight">
              Mood notes — week around next cycle
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              Jot how you feel each day. Stays local, never leaves your browser.
            </p>
            <div className="mt-4 grid gap-3">
              {weekDates.map((date) => {
                const dateStr = formatDate(date);
                const dayLabel = DAYS_OF_WEEK[date.getDay()];
                const isNext = formatDate(date) === formatDate(nextDate!);
                return (
                  <div key={dateStr} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex-shrink-0 w-16 text-right text-xs font-semibold ${
                        isNext ? "text-fuchsia-600" : "text-neutral-400"
                      }`}
                    >
                      <div>{dayLabel}</div>
                      <div className="font-normal">
                        {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                      {isNext && (
                        <div className="mt-0.5 rounded-full bg-fuchsia-100 px-1.5 py-0.5 text-[10px] text-fuchsia-700">
                          day 1
                        </div>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="How are you feeling?"
                      value={cycleData.moods[dateStr] ?? ""}
                      onChange={(e) => handleMoodChange(dateStr, e.target.value)}
                      className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm placeholder-neutral-400 focus:border-fuchsia-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-fuchsia-500/10"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-neutral-400">
          This is a v0 preview. All data lives in your browser&apos;s localStorage — nothing is
          sent anywhere.{" "}
          <Link href="/#waitlist" className="underline hover:text-neutral-600">
            Join the waitlist
          </Link>{" "}
          for the full adaptive experience.
        </p>
      </div>
    </div>
  );
}
