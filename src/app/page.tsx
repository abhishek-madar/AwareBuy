'use client';

import Navbar from "@/components/Navbar";
import { Search, ClipboardPaste, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cormorant, Fraunces } from "next/font/google";

const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export default function Home() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    // Instead of waiting here with a small spinner, instantly route to the
    // skeleton dashboard which will run the AI scrape in the background.
    router.push(`/analyze?url=${encodeURIComponent(url)}`);
  };

  return (
    <div className="min-h-screen mesh-bg flex flex-col text-white overflow-hidden relative">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-24 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6 max-w-5xl w-full mx-auto"
        >


          <h1 className={`text-7xl md:text-[7rem] tracking-tighter text-white mb-8 leading-[1.1] ${cormorant.className}`}>
            <span className="font-bold">Buy at the</span> <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 italic font-bold">
              Perfect Moment.
            </span>
          </h1>
          
          <p className={`text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed ${fraunces.className}`}>
            Paste any e-commerce link. We track the price history and use AI to tell you if it&apos;s a steal or a scam.
          </p>

          <form onSubmit={handleAnalyze} className="mt-16 flex items-center justify-center gap-4 w-full max-w-4xl mx-auto z-20">
            {/* Search Input Container - 3D Glass */}
            <div className="relative w-full">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste any product link..."
                className={`w-full h-[4.5rem] pl-10 md:pl-12 pr-8 text-left bg-gradient-to-b from-[#1a1717]/80 to-[#0a0808]/90 backdrop-blur-3xl border border-white/10 border-t-white/30 rounded-full text-white text-xl md:text-2xl font-medium placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-green-400/50 transition-all shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] ${fraunces.className}`}
                required
              />
            </div>

            {/* Icon Buttons Group - 3D Glass */}
            <div className="hidden md:flex items-center gap-4">
              <button 
                type="button" 
                onClick={async () => {
                  try {
                    const text = await navigator.clipboard.readText();
                    setUrl(text);
                  } catch (e) {
                    console.warn('Failed to read clipboard or permission denied');
                  }
                }}
                title="Paste Link" 
                className="flex items-center justify-center w-[4.5rem] h-[4.5rem] bg-gradient-to-b from-[#1a1717]/80 to-[#0a0808]/90 backdrop-blur-3xl border border-white/10 border-t-white/30 rounded-full text-gray-300 hover:text-white transition-all shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0 group"
              >
                <ClipboardPaste className="w-6 h-6 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              </button>

              <button 
                type="submit" 
                title="Search" 
                className="flex items-center justify-center w-[4.5rem] h-[4.5rem] bg-gradient-to-b from-[#1a1717]/80 to-[#0a0808]/90 backdrop-blur-3xl border border-white/10 border-t-white/30 rounded-full text-gray-300 hover:text-white transition-all shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0 group"
              >
                <Search className="w-6 h-6 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
