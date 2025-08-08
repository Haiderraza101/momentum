"use client";

import { useState, useEffect } from "react";
import { fetchQuotes } from "../lib/api/Quotes";
import { Quotes } from "@/types/quotes";
import { BsThreeDots } from "react-icons/bs";
import { FaHeart, FaHistory, FaRegCopy } from "react-icons/fa";

export default function QuotesComponent() {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quotes, setQuotes] = useState<Quotes>({ quote: "", author: "" });

  useEffect(() => {
    async function getQuote() {
      const data = await fetchQuotes();
      console.log("Fetched Quote:", data);
      setQuotes(data);
    }
    getQuote();
  }, []);

  const copyQuote = async () => {
    try {
      await navigator.clipboard.writeText(`"${quotes.quote}" - ${quotes.author}`);
      alert("Quote copied to clipboard!");
    } catch (err) {
      alert("Failed to copy quote.");
    }
  };

  const markFavorite = () => {
   
    alert("Quote marked as favorite!");
  };

  const viewHistory = () => {
   
    alert("Navigating to quote history...");
  };

  return (
    <div
      className="flex flex-col items-center justify-center relative h-40 sm:h-26 "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setMenuOpen(false);
      }}
    >
      <div
        className={`transition-all text-center text-lg italic font-semibold w-8/12 cursor-pointer duration-500 ${
          hovered ? "-translate-y-6" : ""
        }`}
      >
        "{quotes.quote}"
      </div>

      {hovered && (
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 mt-2 text-sm text-white flex items-center gap-2">
          <span className="text-white">{quotes.author}</span>
          <BsThreeDots
            size={20}
            className="cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>
      )}

      {menuOpen && (
         <div className="absolute bottom-[60%] left-1/2 -translate-x-1/2 w-[70vw] sm:w-64 bg-black bg-opacity-80 backdrop-blur-md text-white rounded-xl shadow-lg p-4 space-y-3 border border-white/20 z-60">
          <ul>
            <QuoteMenuItem icon={<FaRegCopy size={18} />} label="Copy quote" onClick={copyQuote} />
            <QuoteMenuItem icon={<FaHeart size={18} />} label="Mark as favorite" onClick={markFavorite} />
            <QuoteMenuItem icon={<FaHistory size={18} />} label="View history" onClick={viewHistory} />
          </ul>
        </div>
      )}
    </div>
  );
}

function QuoteMenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <li
      onClick={onClick}
      className="flex items-center gap-3 cursor-pointer hover:bg-white/20 transition rounded-lg px-3 py-2"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </li>
  );
}
