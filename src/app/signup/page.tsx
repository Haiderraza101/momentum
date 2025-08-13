'use client';
import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {  UserSignUpFormData } from "@/types/users";
import Link from "next/link";
import momentumlogo from '../../images/momentumlogo.png';

export default function SignUpPage() {
  const router = useRouter();
  const [formdata, setformdata] = useState<UserSignUpFormData>({
    username: "",
    email: "",
    passwordhash: "",
    confirmpassword: ""
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, seterror] = useState<string>('');
  const [successmessage,setsuccessmessage]= useState<string>('');
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    seterror('');
    setsuccessmessage('');

    if (formdata.passwordhash!=formdata.confirmpassword){
      seterror('Password do not match');
      setLoading(false);
      return ;
    }
   console.log(formdata);
    try{
      const res = await fetch (`/api/auth/signup`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          username:formdata.username,
          email:formdata.email,
          passwordhash:formdata.passwordhash,
        })
      });

      const data = await res.json();

      if (!res.ok){
        throw new Error(data.error||"Failed to SignUp");
      }

      localStorage.setItem('token',data.token);
      setsuccessmessage('Registration Successfull ');
      formdata.username="";
      formdata.email="";
      formdata.passwordhash="";
      formdata.confirmpassword="";
    }
    catch (err) {
      console.error("Login error:", err);
      if (err instanceof Error) {
        const errorMessage = err.message.includes("Credential") 
          ? "Invalid email or password" 
          : err.message;
        seterror(errorMessage);
      } else {
        seterror("Something went wrong during login");
      }
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#0f172a",
          backgroundImage: `
            linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 w-full max-w-sm bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-700">
        <div className="flex flex-col items-center mb-5">
          <Image
            src={momentumlogo}
            alt="Momentum Logo"
            width={150}
            height={60}
            className="mb-3"
          />
          <h1 className="text-xl font-bold text-white">Join the Momentum</h1>
          <p className="text-xs text-gray-400 mt-1">
            Sign up today and start your journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
           {successmessage && (
            <div className="p-2 bg-green-900/50 border border-green-700 text-green-100 rounded-md text-xs">
              {successmessage}
            </div>
          )}

          {error && (
            <div className="p-2 bg-red-900/50 border border-red-700 text-red-100 rounded-md text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-300 text-sm mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={formdata.username}
              onChange={(e) => setformdata({ ...formdata, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={formdata.email}
              onChange={(e) => setformdata({ ...formdata, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={formdata.passwordhash}
              onChange={(e) => setformdata({ ...formdata, passwordhash: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-1" htmlFor="confirmpassword">
              Confirm Password
            </label>
            <input
              id="confirmpassword"
              type="password"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={formdata.confirmpassword}
              onChange={(e) => setformdata({ ...formdata, confirmpassword: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
            } transition text-white font-semibold py-2 px-3 rounded-md text-sm flex justify-center items-center`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing up...
              </>
            ) : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
