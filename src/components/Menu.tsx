"use client";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { MenuProp } from "@/types/background";
import { jwtDecode } from "jwt-decode";
import { JWTPayload } from "@/types/users";
import FavoriteBackground from "./FavoriteBackgrounds";
import { FaListCheck } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

export default function Menu({ backgroundurl, backgrounddescription, refreshBackground }: MenuProp) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [successmessage, setsuccessmessage] = useState("");
  const [favoritebackground, setfavoritebackground] = useState<boolean>(false);

  const handlelogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) {
        console.error("Logout API failed:", await res.text());
        return;
      }
      localStorage.removeItem("token");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const submitfavoritebackground = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const decoded: JWTPayload = jwtDecode(token);
      const userid = decoded.userid;

      const res = await fetch(`/api/favoritebackground`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userid,
          backgroundurl,
          backgrounddescription,
        }),
      });

      if (!res.ok) {
        console.error("Favorite background API failed", await res.text());
        return;
      }

      setsuccessmessage("Background added to Favorites ");
    } catch (error) {
      console.error("Favorite Background Error", error);
    }
  };

 const downloadBackground = async () => {
  if (!backgroundurl) return;

  try {
    const response = await fetch(backgroundurl, { mode: "cors" });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = backgrounddescription || "background.jpg";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

  return (
    <div className="relative">
      <button
        onClick={() => {
          setMenuOpen(!menuOpen);
          setsuccessmessage("");
          setfavoritebackground(false);
        }}
        className="z-50 py-10 text-white cursor-pointer"
      >{ 
        !menuOpen && !favoritebackground ? (
          <BsThreeDots size={28} />
        ) : <IoMdClose size={24}/>
      }
        
      </button>

      {menuOpen && (
        <div className="absolute top-20 right-0 w-[50vw] sm:w-64 bg-black bg-opacity-80 backdrop-blur-md text-white rounded-xl shadow-lg p-4 space-y-3 border border-white/20 z-40">
          <ul>
            <div onClick={submitfavoritebackground}>
              <MenuItem
                icon={<FaHeart size={20} className="hover:text-rose-500" />}
                label={
                  successmessage ? (
                    <span className="text-green-500">{successmessage}</span>
                  ) : (
                    "Mark background as favorite"
                  )
                }
              />
            </div>

            <div
              onClick={() => {
                setfavoritebackground(true);
                setMenuOpen(false);
              }}
            >
              <MenuItem icon={<FaHistory size={18} />} label="View favorite history" />
            </div>

            <div onClick={downloadBackground}>
              <MenuItem icon={<FiDownload size={18} />} label="Download background" />
            </div>

            <div onClick={handlelogout}>
              <MenuItem icon={<CiLogout size={20} />} label="Logout" />
            </div>
          </ul>
        </div>
      )}

      {favoritebackground && (
        <FavoriteBackground backgroundurl={backgroundurl} refreshBackground={refreshBackground}
        setfavoritebackground={setfavoritebackground} />
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
