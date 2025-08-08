'use client'

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getaccountdetails } from "@/middleware/clientauth.middleware";
import Image from "next/image";

interface FormData {
  email: string;
  passwordhash: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [formdata, setformdata] = useState<FormData>({
    email: "",
    passwordhash: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Trim whitespace from inputs before sending
      const loginData = {
        email: formdata.email.trim(),
        passwordhash: formdata.passwordhash.trim()
      };

      console.log("Sending login data:", loginData);

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!res.ok) {
        // Try to get JSON error first, fall back to text
        let errorText;
        try {
          const errorData = await res.json();
          errorText = errorData.error || "Login failed";
        } catch {
          errorText = await res.text();
        }
        console.error("Login error response:", errorText);
        throw new Error(errorText || "Login failed");
      }

      const data = await res.json();
      console.log("Login success:", data);

      // Store tokens securely
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshtoken", data.refreshtoken);

      // Redirect to home page
      window.location.href = "/";
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof Error) {
        // Handle specific error messages more gracefully
        const errorMessage = err.message.includes("Credential") 
          ? "Invalid email or password" 
          : err.message;
        setError(errorMessage);
      } else {
        setError("Something went wrong during login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getaccountdetails().then((account) => {
      if (account) {
        router.push('/');
      }
    });
  }, [router]);

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
            {error && (
              <div className="p-3 bg-red-900/50 border border-red-700 text-red-100 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
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
                autoComplete="current-password"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={formdata.passwordhash}
                onChange={(e) =>
                  setformdata({ ...formdata, passwordhash: e.target.value })
                }
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} transition text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 flex justify-center items-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}