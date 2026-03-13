"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  `${(process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "")}/api`;

export default function Recover() {
  const [identifier, setIdentifier] = useState("");
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setResetLink("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/recover/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = (await response.json()) as {
        detail?: string;
        uid?: string;
        token?: string;
      };

      if (!response.ok) {
        throw new Error(data.detail ?? "Unable to start account recovery.");
      }

      setMessage(data.detail ?? "Recovery flow started.");

      if (data.uid && data.token) {
        setResetLink(
          `/reset?uid=${encodeURIComponent(data.uid)}&token=${encodeURIComponent(data.token)}`,
        );
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to start account recovery.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Recover Password
        </h1>
        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
          Enter your student email or student ID to request a reset token.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="identifier"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Student Email or Student ID
            </label>
            <input
              id="identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              required
            />
          </div>

          {message ? (
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              {message}
            </p>
          ) : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {loading ? "Submitting..." : "Request recovery"}
          </button>
        </form>

        {resetLink ? (
          <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300">
            Continue reset:{" "}
            <Link href={resetLink} className="font-medium underline">
              Open reset page
            </Link>
          </p>
        ) : null}

        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Remembered your password?{" "}
          <Link href="/login" className="font-medium underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
