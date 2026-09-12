'use client';

import { useEffect, useState } from "react";
import { FastAverageColor } from "fast-average-color";
import { motion, Variants } from "framer-motion";
import { User } from "@prisma/client";
import { BellRing, Tag, TrendingDown, Settings } from "lucide-react";

export default function ProfileClient({ user }: { user: User }) {
  const [bgColor, setBgColor] = useState("rgba(52,211,153,0.1)");
  const [isLoaded, setIsLoaded] = useState(!user.image);

  useEffect(() => {
    if (user.image) {
      const fac = new FastAverageColor();
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = user.image;
      
      img.onload = () => {
        try {
          const color = fac.getColor(img);
          setBgColor(`rgba(${color.value[0]}, ${color.value[1]}, ${color.value[2]}, 0.15)`);
        } catch (e) {
          console.error("Color extraction failed", e);
        }
        setTimeout(() => setIsLoaded(true), 400); // slight delay for smooth skeleton transition
      };
      
      img.onerror = () => setIsLoaded(true);
    }
  }, [user.image]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
  };

  return (
    <div className="min-h-screen relative flex flex-col text-white pt-32 pb-24 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 bg-[#050505]">
        <motion.div 
          animate={{ backgroundColor: bgColor }}
          transition={{ duration: 1.5 }}
          className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] rounded-full blur-[120px] opacity-60"
        />
      </div>

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
        {!isLoaded ? (
          // Skeleton Loading
          <div className="space-y-8 animate-pulse">
            <div className="flex items-center gap-8 glass-panel p-8 md:p-10 rounded-[2.5rem]">
              <div className="w-32 h-32 bg-white/10 rounded-full"></div>
              <div className="space-y-4">
                <div className="w-64 h-10 bg-white/10 rounded-xl"></div>
                <div className="w-40 h-5 bg-white/10 rounded-lg"></div>
                <div className="flex gap-2 pt-2">
                  <div className="w-24 h-8 bg-white/10 rounded-full"></div>
                  <div className="w-24 h-8 bg-white/10 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-48 bg-white/10 rounded-[2rem] glass-panel"></div>
              ))}
            </div>
          </div>
        ) : (
          // Loaded Dashboard
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
            
            {/* Header Profile Card */}
            <motion.div variants={itemVariants} className="glass-panel p-8 md:p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6">
                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10">
                  <Settings className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {user.image && (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={user.image} alt={user.username || "Profile"} className="w-32 h-32 rounded-full border-4 border-white/10 shadow-2xl relative z-10" />
                  <motion.div 
                    animate={{ backgroundColor: bgColor }} 
                    className="absolute inset-0 rounded-full blur-2xl z-0 scale-150"
                  />
                </div>
              )}
              
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black mb-2">@{user.username}</h1>
                  <p className="text-gray-400 text-lg">{user.email}</p>
                </div>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                  {user.interests.map(interest => (
                    <span key={interest} className="px-4 py-1.5 bg-white/10 border border-white/20 rounded-full text-sm font-bold uppercase tracking-wider text-gray-300">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Bento Box Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div whileHover={{ y: -5 }} className="glass-panel p-8 rounded-[2rem] flex flex-col gap-4 group cursor-pointer hover:border-green-500/30 transition-colors">
                <div className="p-4 bg-green-500/10 rounded-2xl w-fit group-hover:bg-green-500/20 transition-colors">
                  <TrendingDown className="w-8 h-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-5xl font-black mb-2">12</h3>
                  <p className="text-gray-400 font-semibold uppercase tracking-wider text-sm">Active Price Drops</p>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="glass-panel p-8 rounded-[2rem] flex flex-col gap-4 group cursor-pointer hover:border-blue-500/30 transition-colors">
                <div className="p-4 bg-blue-500/10 rounded-2xl w-fit group-hover:bg-blue-500/20 transition-colors">
                  <BellRing className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-5xl font-black mb-2">28</h3>
                  <p className="text-gray-400 font-semibold uppercase tracking-wider text-sm">Items Tracked</p>
                </div>
              </motion.div>

              <motion.div whileHover={{ y: -5 }} className="glass-panel p-8 rounded-[2rem] flex flex-col gap-4 group cursor-pointer hover:border-purple-500/30 transition-colors">
                <div className="p-4 bg-purple-500/10 rounded-2xl w-fit group-hover:bg-purple-500/20 transition-colors">
                  <Tag className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-5xl font-black mb-2">$412</h3>
                  <p className="text-gray-400 font-semibold uppercase tracking-wider text-sm">Money Saved</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
