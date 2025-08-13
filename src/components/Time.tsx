'use client';
import React, { useState, useEffect } from "react";
import { JWTPayloadwithUserName } from "@/types/users";
import { jwtDecode } from "jwt-decode";

export default function Time({loadQuotes}:any) {
  const [currenttime, setCurrentTime] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [openquotebutton,setopenquotebutton]=useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token Found');
      return;
    }

    const decoded: JWTPayloadwithUserName = jwtDecode(token);
    const rawUsername = decoded.username || "";
    const firstName = rawUsername.split(" ")[0];
    setUsername(firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase());
  }, []);

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

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const submitQuote = async () => {
    if (!goal.trim()) {
      setSuccessMessage("Please enter a quote");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setSuccessMessage("You must be logged in to add a quote");
      return;
    }

    try {
      const decoded: JWTPayloadwithUserName = jwtDecode(token);
      const userid = decoded.userid;

      const res = await fetch("/api/customquotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userid,
          quotes: goal,
          author: username || "Anonymous"
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        setSuccessMessage(`Failed to add quote: ${errorText}`);
        return;
      }

      await loadQuotes();


      setSuccessMessage("Your quote has been added");
      setGoal("");
    } catch (error) {
      setSuccessMessage("Error submitting quote");
      console.error("Submit Quote Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-white text-center px-4">
      <div className="text-5xl sm:text-6xl md:text-8xl font-bold">{currenttime}</div>
      <div className="text-2xl sm:text-3xl md:text-4xl font-medium mt-2">{message}</div>

      <div className="text-xl sm:text-2xl md:text-3xl font-light mt-6">
        {username && `${username}, What is your quote for today?`}
      </div>

      <div>
<input
  type="text"
  value={goal}
  onChange={(e) => {
    const value = e.target.value;
    setGoal(value);
    setopenquotebutton(value.trim() !== "");
  }}
  placeholder="Enter your Quote..."
  className="mt-4 w-full max-w-xl text-lg sm:text-xl border-b-2 border-white bg-transparent text-white font-bold text-center focus:outline-none placeholder-white/60 truncate overflow-hidden whitespace-nowrap z-50 "
/>
{
  openquotebutton && (
     <button
          onClick={submitQuote}
          className="mt-4 px-6 py-2 bg-white/15 rounded-md hover:bg-white/20 transition text-white font-semibold cursor-pointer"
        >
          Add Quote
        </button>
  )
}
       
      </div>

      {successMessage && (
        <div className="mt-4 text-green-400 font-semibold">
          {successMessage}
        </div>
      )}
    </div>
  );
}
