'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowDown, Bell, CheckCircle2, XCircle } from 'lucide-react';
import { Fraunces, Inter } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const calculateStats = (history: any[]) => {
  if (!history || history.length === 0) return { min: 0, max: 0, current: 0, avg: '0.00' };
  const prices = history.map(h => h.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    current: prices[prices.length - 1],
    avg: (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)
  };
};

export default function ProductClient({ product, priceHistory }: { product: any, priceHistory: any[] }) {
  const [isTracking, setIsTracking] = useState(false);


  const currentPrice = priceHistory.length > 0 ? priceHistory[priceHistory.length - 1].price : 0;
  const originalPrice = priceHistory.length > 0 ? priceHistory[0].price : currentPrice;
  const stats = calculateStats(priceHistory);

  return (
    <div className={`w-full p-4 md:p-8 pt-32 md:pt-40 selection:bg-blue-500/30 ${inter.className}`}>
      <div className="max-w-6xl mx-auto space-y-8 mt-4">
        

        <div className="relative overflow-hidden bg-[#0c0c0e] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row">
          

          {product.image && (
            <div className="w-full md:w-1/2 lg:w-5/12 bg-white/5 relative p-8 flex items-center justify-center min-h-[400px] md:rounded-l-[2.5rem] max-md:rounded-t-[2.5rem] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 pointer-events-none" />
              <img src={product.image} alt={product.title} className="max-h-[400px] w-full object-contain relative z-10 drop-shadow-2xl mix-blend-screen" />
            </div>
          )}
          

          <div className={`p-8 md:p-12 flex flex-col justify-center ${product.image ? 'w-full md:w-1/2 lg:w-7/12' : 'w-full text-center items-center'}`}>

            
            <h1 className={`text-3xl md:text-5xl font-extrabold mb-6 leading-[1.1] tracking-tight line-clamp-3 ${fraunces.className}`} title={product.title}>{product.title}</h1>
            
            <div className="flex items-end gap-6 mb-10">
              <span className={`text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br ${currentPrice > 0 ? 'from-white to-gray-500' : 'from-red-400 to-orange-500 text-4xl md:text-5xl'}`}>
                {currentPrice > 0 ? `₹${currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : 'Price Unavailable'}
              </span>
              {originalPrice > currentPrice && (
                <div className="flex flex-col mb-2">
                  <span className="text-xl text-gray-500 line-through font-medium">₹{originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  <span className="text-emerald-400 font-bold text-sm tracking-wide flex items-center gap-1">
                    <ArrowDown className="w-4 h-4" /> DROP
                  </span>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsTracking(!isTracking)}
              className={`flex items-center justify-center w-full sm:w-auto gap-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 ${
                isTracking 
                ? "bg-[#1a1a1a] text-emerald-400 border border-emerald-500/30 hover:bg-[#222]" 
                : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:-translate-y-1"
              }`}
            >
              {isTracking ? <CheckCircle2 className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
              {isTracking ? "Tracking Active" : "Track Price Drops"}
            </button>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          

          <div className="lg:col-span-2 p-8 bg-[#0c0c0e] border border-white/10 rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full filter blur-[80px]" />
            <h3 className={`text-2xl font-bold mb-8 flex items-center gap-3 ${fraunces.className}`}>
              Price History <span className={`text-xs font-bold px-3 py-1 bg-white/5 rounded-full text-gray-400 uppercase tracking-widest border border-white/10 ${inter.className}`}>All Time</span>
            </h3>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                    itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                  />
                  <Area type="stepAfter" dataKey="price" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorPrice)" activeDot={{ r: 8, fill: '#3b82f6', stroke: '#000', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>


            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-center ${inter.className}`}>
              <div>
                <div className="text-xs text-white/50 mb-1 font-bold tracking-widest uppercase">Lowest Ever</div>
                <div className="font-black text-emerald-400 text-xl">₹{stats.min.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1 font-bold tracking-widest uppercase">Highest Ever</div>
                <div className="font-black text-red-400 text-xl">₹{stats.max.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1 font-bold tracking-widest uppercase">Current</div>
                <div className="font-black text-white text-xl">₹{stats.current.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1 font-bold tracking-widest uppercase">Average</div>
                <div className="font-black text-white/70 text-xl">₹{Number(stats.avg).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              </div>
            </div>
          </div>


          <div className="space-y-8">
            <div className="p-8 bg-gradient-to-br from-[#0c1512] to-[#0c0c0e] border border-emerald-500/20 rounded-[2rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full filter blur-[40px]" />
              <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 text-emerald-400 ${fraunces.className}`}>
                <CheckCircle2 className="w-6 h-6" /> AI Pros
              </h3>
              <ul className="space-y-4">
                {product.pros?.length ? product.pros.map((pro: string, idx: number) => (
                  <li key={idx} className="text-sm md:text-base text-gray-300 flex items-start gap-3 leading-relaxed">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    {pro}
                  </li>
                )) : <li className="text-gray-500 italic">No pros available.</li>}
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-[#1a0e0e] to-[#0c0c0e] border border-red-500/20 rounded-[2rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full filter blur-[40px]" />
              <h3 className={`text-xl font-bold mb-6 flex items-center gap-3 text-red-400 ${fraunces.className}`}>
                <XCircle className="w-6 h-6" /> AI Cons
              </h3>
              <ul className="space-y-4">
                {product.cons?.length ? product.cons.map((con: string, idx: number) => (
                  <li key={idx} className="text-sm md:text-base text-gray-300 flex items-start gap-3 leading-relaxed">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0 shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
                    {con}
                  </li>
                )) : <li className="text-gray-500 italic">No cons available.</li>}
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
