'use client';

import { activequote, quoteitem } from "@/types/quotes";
import { JWTPayload } from "@/types/users";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

export default function FavoriteQuote({setfavoritequote,refreshQuote}:any) {
  const [userid, setuserid] = useState<number>();
  const [favoritequotes, setfavoritequotes] = useState<quoteitem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    const decoded: JWTPayload = jwtDecode(token);
    setuserid(decoded.userid);
    fetchfavoritequote(decoded.userid);
  }, []);

  const fetchfavoritequote = async (userid: number) => {
    try {
      const res = await fetch(`/api/favoritequotes?userid=${userid}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        const data: quoteitem[] = await res.json();
        setfavoritequotes(data);
      } else {
        console.error(
          "Failed to fetch favorite Quotes ",
          await res.text()
        );
      }
    } catch (error) {
      console.error("Error fetching Favorite Quotes");
    }
  };

  const markQuoteAsActive = async (quoteid: number) => {
    if (!userid){
      return;
    }
    const payload:activequote= {userid,quoteid};

    try{
      const res = await fetch(`/api/setactivequote`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        },
        body:JSON.stringify(payload)
      });

      if (res.ok){
        await fetchfavoritequote(userid);
        await refreshQuote();
      } else{
        console.error('Failed to set active Quote',await res.text());
      }
    }
    catch(error){
     console.error('Error setting active Quote',error);
    }

  };
  const unactiveQuote = async (quoteid: number) => {
 
    if (!userid){
      return;
    }
    try{
      const res = await fetch(`/api/setunactivequotes`,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        },
        body:JSON.stringify({userid,quoteid})
      });
      if (res.ok){
        await fetchfavoritequote(userid);
        await refreshQuote();
      }
      else{
        console.error('Failed to unactive Quote ',await res.text());
      }
    }
    catch(error){
        console.error('Error unactivating Quote',error);
    }


  };
  const removeQuote = async (quoteid: number) => {
    if (!userid){
      return;
    }
    try{
      const res = await fetch (`/api/removefavoritequotes`,{
        method:'DELETE',
        headers:{
          'Content-Type':"application/json",
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        },
        body:JSON.stringify({userid,quoteid})
      });

      if (res.ok){
        await fetchfavoritequote(userid);
        await refreshQuote();
      }
      else{
        console.error('Failed to remove Quotes ',await res.text());
      }
    }
    catch(error){
      console.error('Error removing Quote ',error);
    }
  };

  return (
    <div className="fixed top-20 right-4 sm:right-50 z-40 max-w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-3xl xl:max-w-4xl">
      <div className="bg-black/80 backdrop-blur-md text-white rounded-xl shadow-xl p-4 sm:p-6 space-y-4 border border-white/20 max-h-[80vh] overflow-y-auto custom-scrollbar">
<div className="flex items-center justify-between border-b border-white/20 sticky top-0 bg-black/80 backdrop-blur-md z-50 pt-2">
        <h2 className="text-lg sm:text-xl font-semibold  pb-2">
          Favorite Quotes
        </h2>
        <div className="cursor-pointer" onClick={()=>setfavoritequote(false)}>
        <IoMdClose size={20}/>
        </div>
     </div>
        {favoritequotes.length === 0 ? (
          <p className="text-sm text-gray-300">
            No Favorite Quotes
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {favoritequotes.map((quote) => (
              <div
                key={quote.id}
                className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition"
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm sm:text-base text-gray-100 whitespace-pre-wrap break-words leading-relaxed">
                    “{quote.text || "No Quote"}”
                  </span>
                  <span className="mt-1 text-xs sm:text-sm text-blue-300">
                    ~ {quote.author}
                  </span>
                </div>

                <div className="flex gap-2 flex-wrap sm:flex-nowrap shrink-0">
                  {quote.isactive ? (
                    <button
                      onClick={() => unactiveQuote(quote.id)}
                      className="px-3 py-1 bg-red-900/50 border border-red-700 text-red-100 rounded-md text-xs sm:text-sm hover:bg-red-800 transition"
                    >
                      Unactive
                    </button>
                  ) : (
                    <button
                      onClick={() => markQuoteAsActive(quote.id)}
                      className="px-3 py-1 bg-gray-800 border border-gray-600 text-white rounded-md text-xs sm:text-sm hover:bg-gray-700 transition"
                    >
                      Set Active
                    </button>
                  )}

                  <button
                    onClick={() => removeQuote(quote.id)}
                    className="px-3 py-1 bg-red-900/50 border border-red-700 text-red-100 rounded-md text-xs sm:text-sm hover:bg-red-800 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
