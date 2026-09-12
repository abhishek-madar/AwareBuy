'use client';

import Navbar from "@/components/Navbar";
import PriceChart from "@/components/PriceChart";
import { CheckCircle2, XCircle, Globe, BellRing, ArrowUpRight, ShieldCheck } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function ProductClientView({ product, currentPrice }: { product: any, currentPrice: number }) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  // Extract pros and cons safely
  const aiData = product?.ai_pros_cons || { pros: [], cons: [] };
  const pros = Array.isArray(aiData.pros) ? aiData.pros : [];
  const cons = Array.isArray(aiData.cons) ? aiData.cons : [];

  return (
    <div className="min-h-screen mesh-bg flex flex-col text-white pb-32 relative">
      {/* Background Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-600/30 rounded-full mix-blend-screen filter blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-600/30 rounded-full mix-blend-screen filter blur-[120px]"></div>
      </div>

      <Navbar />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-36 z-10 relative">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Header Card */}
          <motion.div variants={itemVariants} className="glass-panel p-8 rounded-[2rem] flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-40 h-40 bg-black/60 border border-white/10 rounded-2xl flex-shrink-0 flex items-center justify-center text-gray-400 shadow-inner overflow-hidden relative group">
              {product.image_url ? (
                <img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="text-center p-4">
                  <ShieldCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <span className="text-xs uppercase tracking-widest font-bold">No Image</span>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                {product.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                {product.brand && (
                  <span className="bg-white/10 px-4 py-2 rounded-full border border-white/10 shadow-lg backdrop-blur-md">
                    Brand: <span className="text-gray-300">{product.brand}</span>
                  </span>
                )}
                {product.origin_country && (
                  <span className="bg-white/10 px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 shadow-lg backdrop-blur-md">
                    <Globe className="h-4 w-4 text-blue-400" />
                    Origin: <span className="text-gray-300">{product.origin_country}</span>
                  </span>
                )}
                <a 
                  href={product.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/20 flex items-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.15)] hover:bg-green-500/30 transition-colors cursor-pointer"
                >
                  <ArrowUpRight className="h-4 w-4" />
                  View Original
                </a>
              </div>
            </div>
          </motion.div>

          {/* AI Insights Card */}
          <motion.div variants={itemVariants} className="glass-panel p-8 md:p-10 rounded-[2rem] border-t border-white/20">
            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
              <span className="bg-gradient-to-br from-green-400 to-emerald-600 p-2 rounded-xl text-black shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                <CheckCircle2 className="h-6 w-6" strokeWidth={2.5} />
              </span>
              AI Purchase Analysis
            </h2>
            
            <div className="grid md:grid-cols-2 gap-10">
              {/* Pros Cluster */}
              <div className="space-y-6">
                <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Key Advantages
                </h3>
                <div className="flex flex-col gap-3">
                  {pros.length > 0 ? (
                    pros.map((pro: string, i: number) => (
                      <motion.div key={i} whileHover={{ x: 5 }} className="bg-green-500/10 border border-green-500/30 text-green-400/90 px-5 py-4 rounded-2xl text-sm font-semibold flex items-start gap-3 shadow-[0_0_15px_rgba(52,211,153,0.05)]">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" /> 
                        <span className="leading-relaxed">{pro}</span>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-gray-500 italic">No pros identified by AI.</div>
                  )}
                </div>
              </div>
              
              {/* Cons Cluster */}
              <div className="space-y-6">
                <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Risk Factors
                </h3>
                <div className="flex flex-col gap-3">
                  {cons.length > 0 ? (
                    cons.map((con: string, i: number) => (
                      <motion.div key={i} whileHover={{ x: 5 }} className="bg-red-500/10 border border-red-500/30 text-red-400/90 px-5 py-4 rounded-2xl text-sm font-semibold flex items-start gap-3 shadow-[0_0_15px_rgba(248,113,113,0.05)]">
                        <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" /> 
                        <span className="leading-relaxed">{con}</span>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-gray-500 italic">No major risks identified.</div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Price Chart */}
          <motion.div variants={itemVariants} className="glass-panel p-8 md:p-10 rounded-[2rem] border-t border-white/20">
            <h2 className="text-2xl font-black text-white mb-6">Price History Trend</h2>
            <div className="bg-[#0a0a0a]/80 p-6 rounded-2xl border border-white/5 shadow-inner">
              <PriceChart data={product.priceHistories || []} />
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Sticky Action Footer */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-0 left-0 w-full z-50 p-4 md:p-6"
      >
        <div className="max-w-4xl mx-auto bg-[#111111]/90 backdrop-blur-3xl border border-white/10 rounded-full p-4 px-8 flex items-center justify-between shadow-[0_-10px_50px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col md:flex-row md:items-end gap-1 md:gap-3">
            <span className="text-gray-400 text-sm font-black uppercase tracking-widest">Current Price</span>
            <span className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-none">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-400 to-emerald-600 text-black px-6 md:px-10 py-3 md:py-4 rounded-full font-black text-lg md:text-xl flex items-center gap-2 shadow-[0_0_30px_rgba(52,211,153,0.3)] hover:shadow-[0_0_40px_rgba(52,211,153,0.6)] transition-shadow"
          >
            <BellRing className="h-6 w-6 fill-current" />
            Set Alert
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
