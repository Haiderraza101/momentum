'use client';
import { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { FiExternalLink } from "react-icons/fi";
import { IoIosAdd } from "react-icons/io";
import { GrFormPreviousLink } from "react-icons/gr";
import { CiGlobe } from "react-icons/ci";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { JWTPayload } from "@/types/users";
import { jwtDecode } from "jwt-decode";

export default function Links() {
  const [openlinks, setopenlinks] = useState(false);
  const [openinput, setopeninput] = useState(false);
  const [link, setlink] = useState("");
  const [title, settitle] = useState("");
  const [linksList, setLinksList] = useState<{ id: number; title: string; url: string }[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [userid, setUserid] = useState<number | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded: JWTPayload = jwtDecode(storedToken);
        setUserid(decoded.userid);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  useEffect(() => {
    if (token && userid) {
      fetchLinks();
    }
  }, [token, userid]);

  const fetchLinks = async () => {
    if (!token || !userid) return;
    try {
      const res = await fetch(`/api/getlinks?userid=${userid}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      setLinksList(data);
    } catch (err) {
      console.error("Error fetching links", err);
    }
  };

  const submitlinks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !userid) {
      console.error("No token or userid found — cannot submit link");
      return;
    }
    try {
      const res = await fetch(`/api/submitlinks`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, url: link, userid })
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('Error submitting the Links:', data);
      } else {
        settitle("");
        setlink("");
        setopeninput(false);
        setopenlinks(true);
        fetchLinks();
      }
    } catch (error) {
      console.error('Error in sending request', error);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-1 p-7 justify-center cursor-pointer"> 
        <div className="hover:bg-transparent w-4 ml-1 ">
          <FiExternalLink
            size={20}
            onClick={() => {
              setopenlinks(!openlinks);
              setopeninput(false);
            }}
          />
        </div>
        <div>Links</div>

        {openlinks && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col gap-4 bg-black p-5 opacity-80 rounded-xl w-80 absolute z-50 pointer-events-auto">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <FiExternalLink size={20} />
                  <h2>Links</h2>
                </div>
                <div className="flex gap-2">
                  <IoIosAdd
                    size={25}
                    onClick={() => {
                      setopenlinks(false);
                      setopeninput(true);
                    }}
                  />
                  <IoMdClose size={18}
                    className="mt-1"
                    onClick={() => {
                      setopenlinks(false);
                    }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {linksList.length > 0 ? (
                  linksList.map((item) => (
                    <Link
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/60 
                                 hover:bg-gray-700/80 hover:scale-[1.02] transition-all duration-200 
                                 text-white shadow-sm hover:shadow-md"
                    >
                      <FiExternalLink size={18} className="text-gray-400" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No links yet</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {openinput && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col justify-between bg-black p-5 opacity-80 rounded-xl w-70 absolute top-20 z-50">
              <div className="flex justify-between w-full ">
                <GrFormPreviousLink
                  size={25}
                  onClick={() => {
                    setopeninput(false);
                    setopenlinks(true);
                  }}
                />
                <div>Creating a Link</div>
                <IoMdClose size={20} 
                  onClick={() => {
                    setopeninput(false);
                    setopenlinks(false);
                  }}
                />
              </div>

              <form onSubmit={submitlinks}>
                <div className="pt-4 text-sm">TITLE</div>
                <input
                  className="border-b w-full border-gray-400 focus:outline-none focus:border-white transition duration-200"
                  value={title}
                  onChange={(e) => settitle(e.target.value)}
                  required
                />
                <div className="pt-4 text-sm">LINK</div>
                <div className="flex">
                  <CiGlobe className="mr-2 mt-3" size={20} />
                  <input
                    className="border-b border-gray-400 focus:outline-none focus:border-white transition duration-200 w-full"
                    value={link}
                    onChange={(e) => setlink(e.target.value)}
                    type="text"
                    placeholder="example.com"
                    required
                  />
                </div>
                <div className="text-center">
                  <button 
                    type="submit" 
                    className="p-1 border w-full rounded-full mt-8 bg-teal-700 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
