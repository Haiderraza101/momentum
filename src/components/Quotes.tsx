'use client';

import { useState, useEffect } from 'react';
import { fetchQuotes } from'../lib/api/Quotes';
import { Quotes } from '@/types/quotes';
import { BsThreeDots } from "react-icons/bs";

export default function QuotesComponent() {
  const [hovered, setHovered] = useState<boolean>(false);
  const [quotes, setQuotes] = useState<Quotes>({ quote: "", author: "" });

  useEffect(() => {
    async function getQuote() {
      const data = await fetchQuotes();
       console.log("Fetched Quote:", data);
      setQuotes(data);
    }
    getQuote();
  }, []);

  return (
    <div
      className="flex items-center justify-center relative h-48"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`
          relative -bg-conic top-5 sm:top-10 md:top-20
          lg:top-22 transition-all text-center text-lg italic font-semibold w-8/12 cursor-pointer 
          duration-500 ${hovered ? '-translate-y-6' : ''}
        `}
      >
        " {quotes.quote} "
      </div>

      {hovered && (
        <div className="absolute top-35 sm:top-35 md:top-43 left-1/2 -translate-x-1/2 mt-2 text-sm text-white flex items-center gap-2">
          <span> {quotes.author}</span>
          <BsThreeDots size={20}/>
        </div>
      )}
    </div>
  );
}
