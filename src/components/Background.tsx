"use client";
import { useEffect, useState, useCallback } from "react";
import { fetchBackgroundfromUnsplash } from '@/lib/api/unsplash';
import Links from '../components/Links';
import Weather from '../components/Weather';
import Time from './Time';
import QuotesComponent from './Quotes';
import Menu from './Menu';
import { jwtDecode } from "jwt-decode";
import { JWTPayload } from "@/types/users";
import { quotedata } from "@/types/quotes";
import {fetchQuotes} from '../lib/api/quotes';

export default function Background() {
  const [backgroundData, setBackgroundData] = useState<{ url: string; description: string } | null>(null);
  const [loading, setLoading] = useState(true);
   const [quotedata,setquotedata]=useState<quotedata|null>(null);

  const loadBackground = useCallback(async () => {
  try {
    let userid: number | null = null;
    const token = localStorage.getItem("token");

    if (token) {
      const decoded: JWTPayload = jwtDecode(token);
      userid = decoded.userid;
    }

    if (userid) {
      const res = await fetch(`/api/getactivebackground?userid=${userid}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success && data.background) {
        setBackgroundData({
          url: data.background.imageurl,
          description: data.background.description
        });
        return;
      }
    }

    const randomBg = await fetchBackgroundfromUnsplash();
    setBackgroundData({
      url: randomBg.url,
      description: randomBg.description
    });
  } catch (err) {
    console.error("Error loading background", err);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    loadBackground();
  }, [loadBackground]);


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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading background...
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundData?.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        transition: "background-image 0.5s ease-in-out"
      }}
    >
      <div className="flex justify-between items-start px-4 pt-4">
        <Links />
        <div className="flex gap-2">
          <Menu
            backgroundurl={backgroundData?.url || ""}
            backgrounddescription={backgroundData?.description || ""}
            refreshBackground={loadBackground}
          />
          <Weather />
        </div>
      </div>
      <div className="relative top-20 text-center">
        <Time loadQuotes={loadQuotes}/>
        <QuotesComponent quotedata={quotedata}
        loadQuotes={loadQuotes}/>
      </div>
    </div>
  );
}
