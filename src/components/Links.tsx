'use client';
import { useState } from "react";
import { motion } from 'framer-motion';
import { FiExternalLink } from "react-icons/fi";
import { IoIosAdd } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { GrFormPreviousLink } from "react-icons/gr";
import { CiGlobe } from "react-icons/ci";
export default function Links(){
  const [openlinks,setopenlinks]=useState<boolean>(false);
  const [openinput,setopeninput]=useState<boolean>(false);
  const [link,setlink]=useState<string>("");
  const [title,settitle]=useState<string>("");
  return (
    <div>
      <div className="flex flex-col gap-1 p-7 justify-center cursor-pointer"> 
         <div className="hover:bg-transparent w-4 ml-1 ">
        <FiExternalLink
        size={20}
        onClick={()=>{
          setopenlinks(!openlinks);
          setopeninput(false);
          
        }}/>
      </div>
      <div>
        Links
        </div>{openlinks && (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex justify-between bg-black p-5 opacity-80 rounded-xl w-80 relative">
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
        <BsThreeDots size={25} />
      </div>
    </div>
  </motion.div>
)}

        <div>{openinput && (
  <motion.div
    initial={{ opacity: 0, y: 0 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex flex-col justify-between bg-black p-5 opacity-80 rounded-xl w-70 absolute top-20">
      <div className="flex justify-between w-full">
        <GrFormPreviousLink
          size={25}
          onClick={() => {
            setopeninput(false);
            setopenlinks(true);
          }}
        />
        <div>Creating a Link</div>
        <BsThreeDots size={25} />
      </div>

      <div>
        <div className="pt-4 text-sm">TITLE</div>
        <input
          className="border-b w-full border-gray-400 focus:outline-none focus:border-white transition duration-200"
          value={title}
          onChange={(e) => settitle(e.target.value)}
        />
        <div className="pt-4 text-sm">LINKS</div>
        <div className="flex">
          <CiGlobe className="mr-2 mt-3" size={20} />
          <input
            className="border-b border-gray-400 focus:outline-none focus:border-white transition duration-200 w-full"
            value={link}
            onChange={(e) => setlink(e.target.value)}
            type="text"
            placeholder="example.com"
          />
        </div>
        <div className="text-center">
          <button className="p-1 border w-full rounded-full mt-8 bg-teal-700">
            Add
          </button>
        </div>
      </div>
    </div>
  </motion.div>
)}

        </div>
      </div>
     
    </div>
  )
}