'use client';

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const router = useRouter();
  
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState("Connecting to ScraperAPI...");

  useEffect(() => {
    if (!url) {
      setError("No URL provided.");
      return;
    }

    let isMounted = true;

    const runAnalysis = async () => {
      try {
        // Stage 1
        if (isMounted) setLoadingText("Connecting to proxy network...");
        
        // Stage 2 (simulate delay for visual feedback if scrape is too fast)
        setTimeout(() => {
          if (isMounted && !error) setLoadingText("Extracting product data with Gemini AI...");
        }, 2000);

        setTimeout(() => {
          if (isMounted && !error) setLoadingText("Analyzing price history and sentiment...");
        }, 4500);

        const res = await fetch("/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        
        const data = await res.json();
        
        if (isMounted) {
          if (data.productId) {
            setLoadingText("Analysis complete! Redirecting...");
            router.replace(`/product/${data.productId}`);
          } else {
            setError(data.error || "Failed to analyze this product.");
          }
        }
      } catch (err) {
        if (isMounted) setError("Network error occurred during analysis.");
      }
    };

    runAnalysis();

    return () => { isMounted = false; };
  }, [url, router, error]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Analysis Failed</h2>
        <p className="text-gray-400 mb-8 max-w-md">{error}</p>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto pt-32 px-4 pb-24">
      {/* Skeleton Bento Box Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Image & Main Info) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="w-full h-96 bg-white/5 animate-pulse rounded-[2rem] border border-white/5 backdrop-blur-md"></div>
          
          <div className="space-y-4">
            <div className="w-3/4 h-10 bg-white/5 animate-pulse rounded-xl"></div>
            <div className="w-1/2 h-6 bg-white/5 animate-pulse rounded-lg"></div>
          </div>
        </div>

        {/* Right Column (Price & AI Stats) */}
        <div className="space-y-8">
          {/* Price Card Skeleton */}
          <div className="w-full h-48 bg-white/5 animate-pulse rounded-[2rem] border border-white/5 backdrop-blur-md"></div>
          
          {/* Pros Skeleton */}
          <div className="w-full h-32 bg-white/5 animate-pulse rounded-[2rem] border border-white/5 backdrop-blur-md"></div>
          
          {/* Cons Skeleton */}
          <div className="w-full h-32 bg-white/5 animate-pulse rounded-[2rem] border border-white/5 backdrop-blur-md"></div>
        </div>
        
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
      </div>
      
      <Navbar />
      
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div></div>}>
        <AnalyzeContent />
      </Suspense>
    </div>
  );
}
