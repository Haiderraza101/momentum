'use client';

import Background from "@/components/Background";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getaccountdetails } from "@/middleware/userauth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // localStorage.removeItem('token');
        const account = await getaccountdetails();
        if (!account) {
          router.push("/login");
        }
        else{
          router.push('/home');
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

}