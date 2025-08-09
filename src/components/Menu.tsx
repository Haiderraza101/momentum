"use client";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { FaHistory } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { MdOutlineHistoryToggleOff } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { useRouter } from "next/navigation";

export default function Menu() {
    const router = useRouter();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

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

  return (
    <div className="relative">
     
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="z-50 py-10 text-white hover:rotate-90 transition duration-300 "
      >
        <BsThreeDots size={28} />
      </button>

  
      {menuOpen && (
        <div className=" absolute top-20 right-0  w-[50vw] sm:w-64 bg-black bg-opacity-80 backdrop-blur-md text-white rounded-xl shadow-lg p-4 space-y-3 border border-white/20 z-40">
          <ul>
            <MenuItem icon={<CiHeart size={20} />} label="Mark background as favorite" />
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

function MenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <li className="flex items-center gap-3 cursor-pointer hover:bg-white/20 transition rounded-lg px-3 py-2">
      {icon}
      <span className="text-sm">{label}</span>
    </li>
  );
}
