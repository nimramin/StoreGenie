import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {user ? (
          <div>
            <h1 className="text-2xl font-bold text-center text-gray-900">
              Welcome, {user.email}
            </h1>
            <p className="text-center text-gray-600">You are now logged in.</p>
            <form action="/api/auth/logout" method="post">
              <button
                type="submit"
                className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-center text-gray-900">
              Welcome to Store Genie
            </h1>
            <p className="text-center text-gray-600">
              Please{" "}
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                login
              </Link>{" "}
              or{" "}
              <Link
                href="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                sign up
              </Link>{" "}
              to continue.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
