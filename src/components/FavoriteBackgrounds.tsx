import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { JWTPayload } from "@/types/users";

export default function FavoriteBackground() {
  const [favoritebackground, setfavoritebackgrounds] = useState({});
  const [userid, setUserid] = useState<number>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const decoded: JWTPayload = jwtDecode(token);
    setUserid(decoded.userid);

    fetchfavoritebackground(decoded.userid);
  }, []);

  const fetchfavoritebackground = async (uid: number) => {
    try {
      const res = await fetch(`/api/favoritebackground?backgroundid=${uid}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        
        setfavoritebackgrounds(data);
      } else {
        console.error("Failed to fetch favorites", await res.text());
      }
    } catch (error) {
      console.error("Error Fetching Favorite Backgrounds", error);
    }
  };

  return (
    <div>
      <div className="absolute top-20 right-0 w-[50vw] sm:w-64 bg-black bg-opacity-80 backdrop-blur-md text-white rounded-xl shadow-lg p-4 space-y-3 border border-white/20 z-40">
        
      </div>
    </div>
  );
}
