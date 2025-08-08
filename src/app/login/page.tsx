'use client'

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getaccountdetails } from "@/middleware/clientauth.middleware";
import Image from "next/image";

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [formdata, setformdata] = useState<FormData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("hello");

   
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#0f172a",
          backgroundImage: `
            linear-gradient(to right, rgba(148,163,184,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148,163,184,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-700">
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/momentumlogo.png"
              alt="Momentum Logo"
              width={200}
              height={80}
              className="mb-4"
            />
            <h1 className="text-2xl font-bold text-white">Boost Your Momentum</h1>
<p className="text-sm text-gray-400">Log in and take charge of your day</p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
          {
            error && (
              <div className=" text-red-600 text-sm ">
               {error}
              </div>
            )
          }
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={formdata.email}
                onChange={(e) =>
                  setformdata({ ...formdata, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={formdata.password}
                onChange={(e) =>
                  setformdata({ ...formdata, password: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
