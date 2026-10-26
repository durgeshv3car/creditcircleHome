"use client";
import React from "react";

function HeaderGreet({ admin }: { admin: string }) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
      return "Good evening";
    } else {
      return "Good night";
    }
  };

  const displayName = admin ? admin.charAt(0).toUpperCase() + admin.slice(1) : "Durgesh";

  return (
    <div className="flex flex-col justify-center">
      <div className="text-sm md:text-[15px] font-bold text-slate-800 flex items-center gap-1.5 leading-tight tracking-tight">
        <span className="text-base select-none inline-block hover:rotate-12 transition-transform duration-200 origin-bottom-right cursor-default">👋</span>
        <span>
          {getGreeting()},{" "}
          <span className="bg-gradient-to-r from-[#FF6B4A] to-[#F48220] bg-clip-text text-transparent font-extrabold">
            {displayName}
          </span>
        </span>
      </div>
      <p className="text-[11px] text-slate-500 font-medium hidden sm:flex items-center gap-1.5 tracking-normal mt-0.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
        Here&apos;s what&apos;s happening with your leads today.
      </p>
    </div>
  );
}

export default HeaderGreet;
