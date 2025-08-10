"use client";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { FaHistory } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { MdOutlineHistoryToggleOff } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { MenuProp } from "@/types/background";
import {jwtDecode} from "jwt-decode";
import { JWTPayload } from "@/types/users";
import Popup from "./Popup";
export default function Menu({backgroundurl}:MenuProp) {

    const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [successmessage,setsuccessmessage]=useState<string>('');

const handlelogout = async () => {
  try {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (!res.ok) {
      console.error("Logout API failed:", await res.text());
      return;
    }
    localStorage.removeItem('token');
    router.push('/login');
  } catch (error) {
    console.error("Logout failed", error);
  }
};

const submitfavoritebackground = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const decoded: JWTPayload = jwtDecode(token);
    const userid = decoded.userid;

    const res = await fetch(`/api/favoritebackground`, {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userid: userid,
        backgroundurl: backgroundurl
      })
    });

    if (!res.ok) {
      console.error('Favorite background API failed', await res.text());
      return;
    }

    setsuccessmessage('Background added to favorites ');
  } catch (error) {
    console.error('Favorite Background Error', error);
  }
};


  return (

    <div className="relative">
      <button
        onClick={() =>{
          setMenuOpen(!menuOpen);
          setsuccessmessage('');
        }}
        className="z-50 py-10 text-white hover:rotate-90 transition duration-300 "
      >
        <BsThreeDots size={28} />
      </button>

  
      {menuOpen && (
        <div className=" absolute top-20 right-0  w-[50vw] sm:w-64 bg-black bg-opacity-80 backdrop-blur-md text-white rounded-xl shadow-lg p-4 space-y-3 border border-white/20 z-40">
          <ul>
            <div onClick={submitfavoritebackground}>
<MenuItem
  icon={<CiHeart size={20} className="hover:text-rose-500" />}
  label={
    successmessage
      ? <span className="text-green-500">{successmessage}</span>
      : "Mark background as favorite"
  }
/>
            </div>
            <MenuItem icon={<FaHistory size={18} />} label="View favorite history" />
            <MenuItem icon={<FiDownload size={18} />} label="Download background" />
            <MenuItem icon={<MdOutlineHistoryToggleOff size={20} />} label="Background history" />
            <div onClick={handlelogout}>
            <MenuItem icon=
            {<CiLogout size={20} />} label="Logout" />
            </div>
          </ul>
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label }: { icon: React.ReactNode; label: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 cursor-pointer hover:bg-white/20 transition rounded-lg px-3 py-2">
      {icon}
      <span className="text-sm">{label}</span>
    </li>
  );
}
