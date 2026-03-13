import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const displayName =
    session.user.first_name?.trim() ||
    session.user.name?.trim() ||
    session.user.username ||
    "there";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <h1 className="text-6xl font-bold mb-4 text-center">
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome, {displayName}
        </span>
      </h1>
    </div>
  );
}
