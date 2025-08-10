'use client';
import React, { useState, useEffect } from "react";
import { JWTPayloadwithUserName } from "@/types/users";
import { jwtDecode } from "jwt-decode";
export default function Time() {
  const [currenttime, setCurrentTime] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [goal, setGoal] = useState<string>("");

  const token = localStorage.getItem('token');
  if (!token){
    console.error('No token Found');
    return;
  }

  const decoded : JWTPayloadwithUserName = jwtDecode(token);

  const rawUsername = decoded.username || "";
  const firstName = rawUsername.split(" ")[0];
  const username = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const timeString: string = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setCurrentTime(timeString);

      if (hours > 5 && hours < 12) {
        setMessage("Good Morning");
      } else if (hours >= 12 && hours <= 16) {
        setMessage("Good Afternoon");
      } else if (hours > 16 && hours <= 19) {
        setMessage("Good Evening");
      } else {
        setMessage("Good Night");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-white  text-center px-4">
      <div className="text-5xl sm:text-6xl md:text-8xl font-bold">{currenttime}</div>
      <div className="text-2xl sm:text-3xl md:text-4xl font-medium mt-2">{message}</div>

      <div className="text-xl sm:text-2xl md:text-3xl font-light mt-6">
        {username}, {" "}What is your main goal for today?
      </div>

     
      <input
  type="text"
  value={goal} 
  onChange={(e) => setGoal(e.target.value)} 
  placeholder="Enter your goal..."
  className="mt-4 w-full max-w-xl text-lg sm:text-xl border-b-2 border-white bg-transparent text-white font-bold text-center focus:outline-none placeholder-white/60 z-49 truncate overflow-hidden whitespace-nowrap"
/>
    </div>
  );
}
