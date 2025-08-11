"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { JWTPayload } from "@/types/users";
import Link from "next/link";
import { backgroundItem, activebackground, FavoriteBackgroundProp } from "@/types/background";

export default function FavoriteBackground({
  backgroundurl,
  refreshBackground
}: FavoriteBackgroundProp) {
  const [favoritebackground, setFavoritebackgrounds] = useState<backgroundItem[]>([]);
  const [userid, setUserid] = useState<number>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    const decoded: JWTPayload = jwtDecode(token);
    setUserid(decoded.userid);
    fetchFavoriteBackground(decoded.userid);
  }, []);

  const fetchFavoriteBackground = async (uid: number) => {
    try {
      const res = await fetch(`/api/favoritebackground?backgroundid=${uid}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      if (res.ok) {
        const data: backgroundItem[] = await res.json();
        setFavoritebackgrounds(data);
      } else {
        console.error("Failed to fetch favorites", await res.text());
      }
    } catch (error) {
      console.error("Error fetching favorite backgrounds", error);
    }
  };

  const markBackgroundAsActive = async (backgroundid: number) => {
    if (!userid) return;

    const payload: activebackground = { userid, backgroundid };

    try {
      const res = await fetch(`/api/setactivebackground`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchFavoriteBackground(userid);
        await refreshBackground();
      } else {
        console.error("Failed to set active background", await res.text());
      }
    } catch (error) {
      console.error("Error setting active background", error);
    }
  };

  const unactiveBackground = async (backgroundid: number) => {
    if (!userid) return;

    try {
      const res = await fetch(`/api/setunactivebackground`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ userid, backgroundid })
      });

      if (res.ok) {
        await fetchFavoriteBackground(userid);
        await refreshBackground();
      } else {
        console.error("Failed to unactive background", await res.text());
      }
    } catch (error) {
      console.error("Error unactivating background", error);
    }
  };

  const removeBackground = async (backgroundid: number) => {
    if (!userid) return;

    try {
      const res = await fetch(`/api/removefavoritebackground`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ userid, backgroundid })
      });

      if (res.ok) {
        await fetchFavoriteBackground(userid);
        await refreshBackground();
      } else {
        console.error("Failed to remove background", await res.text());
      }
    } catch (error) {
      console.error("Error removing background", error);
    }
  };

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-40 max-w-[90vw] sm:max-w-md md:max-w-lg lg:w-3xl xl:w-4xl lg:max-w-7xl">
      <div className="bg-black/80 backdrop-blur-md text-white rounded-xl shadow-xl p-4 sm:p-6 space-y-4 border border-white/20">
        <h2 className="text-lg sm:text-xl font-semibold border-b border-white/20 pb-2">
          Favorite Backgrounds
        </h2>

        {favoritebackground.length === 0 ? (
          <p className="text-sm text-gray-300">No Favorite Background</p>
        ) : (
          <div className="flex flex-col gap-3">
            {favoritebackground.map((favorite) => (
              <div
                key={favorite.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
              >
                <span className="whitespace-normal break-words text-sm sm:text-base flex-1">
                  {favorite.description || "No description"}
                </span>

                <div className="flex gap-2 flex-wrap">
                  <Link
                    href={favorite.imageurl}
                    target="_blank"
                    className="px-3 py-1 bg-blue-900/50 border border-blue-700 text-blue-100 rounded-md text-xs sm:text-sm hover:bg-blue-800 transition"
                  >
                    View
                  </Link>

                  {favorite.isactive ? (
                    <button
                      onClick={() => unactiveBackground(favorite.id)}
                      className="px-3 py-1 bg-red-900/50 border border-red-700 text-red-100 rounded-md text-xs sm:text-sm hover:bg-red-800 transition"
                    >
                      Unactive
                    </button>
                  ) : (
                    <button
                      onClick={() => markBackgroundAsActive(favorite.id)}
                      className="px-3 py-1 bg-gray-800 border border-gray-600 text-white rounded-md text-xs sm:text-sm hover:bg-gray-700 transition"
                    >
                      Set Active
                    </button>
                  )}

                  <button
                    onClick={() => removeBackground(favorite.id)}
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
    </div>
  );
}
