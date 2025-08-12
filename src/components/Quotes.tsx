"use client";

import { useState, useEffect,useCallback } from "react";
import { fetchQuotes } from '../lib/api/quotes';
import { quotedata } from "@/types/quotes";
import { BsThreeDots } from "react-icons/bs";
import { FaHeart, FaHistory, FaRegCopy } from "react-icons/fa";
import { JWTPayload } from "@/types/users";
import { jwtDecode } from "jwt-decode";
import { IoMdClose } from "react-icons/io";
import FavoriteQuote from "./FavoriteQuote";


export default function QuotesComponent() {
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [successmessage,setsuccessmessage]=useState<string>('');
  const [copyquote,setcopyquote]=useState<string>('');
  const [favoritequote,setfavoritequote]=useState<boolean>(false);
  const [quotedata,setquotedata]=useState<quotedata|null>(null);

  // useEffect(() => {
  //   async function getQuote() {
  //     const data = await fetchQuotes();
  //     console.log("Fetched Quote:", data);
  //     setQuotes(data);
  //   }
  //   getQuote();
  // }, []);

  const loadQuotes = useCallback(async () =>{
     try{
      let userid :number|null = null;
      const token = localStorage.getItem('token');

      if (token){
        const decoded :JWTPayload = jwtDecode(token);
        userid=decoded.userid;
      }

      if (userid){
        const res = await fetch(`/api/getactivequotes?userid=${userid}`,{
          headers:{
            'Authorization':`Bearer ${token}`
          }
        });
        const data = await res.json();

        if (data.success&&data.quote){
          setquotedata({
            quote:data.quote.text,
            author:data.quote.author
          });
          return;
        }
      }

  

      const randomquote = await fetchQuotes();
      setquotedata({
        quote:randomquote.quote,
        author:randomquote.author
      });
     }
     catch(error){
      console.error('Error loading Quote',error);
     }
  },[]);

      useEffect(() => {
  loadQuotes();
}, [loadQuotes]);

  const copyQuote = async () => {
    try {
      await navigator.clipboard.writeText(`"${quotedata?.quote}" - ${quotedata?.author}`);
     setcopyquote('Quote Copied to Clipboard')
    } catch (err) {
       setcopyquote('');
    }
  };

  const submitFavoriteQuote = async () => {
   try{
    const token=localStorage.getItem('token');
    if (!token){
      console.error('No Token Found');
      return;
    }
    const decoded : JWTPayload = jwtDecode(token);
    const userid = decoded.userid;

    const res = await fetch (`/api/favoritequotes`,{
      method:"POST",
      headers:{
        'Content-Type':'application/json',
         'Authorization':`Bearer ${token}`
      },
      body:JSON.stringify({
        userid:userid,
        quotes:quotedata?.quote,
        author:quotedata?.author
      })
    });

    if (!res.ok){
      console.error('Favorite Quote Api failed');
      return ;
    }

    setsuccessmessage('Quote added to Favorites')
    
   }
   catch(error){
    console.error('Favorite Quote Error',error);
   }
   
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
        "{quotedata?.quote}"
      </div>

      {hovered && (
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 mt-2 text-sm text-white flex items-center gap-2">
          <span className="text-white">{quotedata?.author}</span>
          <div onClick={() => {
              setMenuOpen(!menuOpen);
              setsuccessmessage('');
              setcopyquote('');
              setfavoritequote(false);
            }}
            className="cursor-pointer">
          {
            !menuOpen && !favoritequote ? (<BsThreeDots
            size={20}
          />):(
         <IoMdClose size={20}/>
          )
          }
          </div>
          
        </div>
      )}

      {menuOpen && (
         <div className="absolute bottom-[60%] left-1/2 -translate-x-1/2 w-[70vw] sm:w-64 bg-black bg-opacity-80 backdrop-blur-md text-white rounded-xl shadow-lg p-4 space-y-3 border border-white/20 z-60">
          <ul>
            <div
            onClick={copyQuote}>
            <QuoteMenuItem icon={<FaRegCopy size={18} />} label = {
              copyquote ? <span className="text-green-500">{copyquote}</span>:"Copy Quote"
            } />
            </div>
            <div onClick={submitFavoriteQuote}>
            <QuoteMenuItem icon={<FaHeart size={18} className="hover:text-rose-500"/>} label = {
              successmessage ? <span className="text-green-500">{successmessage}</span>:"Mark as favorite"
            } />
            </div>
            <div onClick={()=>{
              setfavoritequote(true);
              setMenuOpen(false);
            }}>
            <QuoteMenuItem icon={<FaHistory size={18} />} label="View favorite history" />
            </div>
          </ul>
        </div>
      )}
      {
        favoritequote && (
          <FavoriteQuote
          setfavoritequote={setfavoritequote}
          refreshQuote={loadQuotes}>
          
          </FavoriteQuote>
        )
      }
    </div>
  );
}

function QuoteMenuItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
}) {
  return (
    <li

      className="flex items-center gap-3 cursor-pointer hover:bg-white/20 transition rounded-lg px-3 py-2"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </li>
  );
}
