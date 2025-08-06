'use client';
import React, { useState, useEffect } from "react";

export default function Time() {
  const [currenttime, setcurrenttime] = useState<string>("");
  const [message, setmessage] = useState<string>("");

  useEffect(() => {
    const updatetime = () => {
      const now = new Date();
      const hours = now.getHours();
      const timestring: string = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setcurrenttime(timestring);

   
      if (hours > 5 && hours <= 12) {
        setmessage("Good Morning");
      } else if (hours > 12 && hours <= 16) {
        setmessage("Good Afternoon");
      } else if (hours > 16 && hours <= 19) {
        setmessage("Good Evening");
      } else {
        setmessage("Good Night");
      }
    };

    updatetime(); 
    const interval = setInterval(updatetime, 1000); 

    return () => clearInterval(interval); 
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center justify-center relative top-10 sm:top-20 md:top-30 lg:top-35 font-[540]"
      style={{ fontSize: '7rem' }}>
        {currenttime}
        <div className="text-4xl  font-sans">{message}</div>
        <div className="w-full flex justify-center">
  <div className="text-3xl w-4/12 font-medium  text-center md:mt-5 sm:mt-2">
    What is your main goal for today?
  </div>
 
</div>
<input
  className="text-2xl border-b-2 border-white  focus:outline-none bg-transparent text-white font-bold text-center md:mt-5 sm:mt-2"
/>
      </div>
      
    </div>
  );
}
