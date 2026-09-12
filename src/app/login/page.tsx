'use client';

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Cormorant, Fraunces } from "next/font/google";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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

export default function LoginPage() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">

      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-pink-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[30rem] h-[30rem] bg-emerald-600/20 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <Link href="/" className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors z-20 flex items-center gap-2">
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </Link>


      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-10 bg-[#1a1717]/80 backdrop-blur-3xl border border-white/10 border-t-white/20 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] flex flex-col items-center text-center"
      >

        <div className="mb-8 flex justify-center">
          <img src="/logo.png" alt="ABuy" className="h-16" />
        </div>

        <h1 className={`text-4xl md:text-5xl font-bold text-white mb-4 ${cormorant.className}`}>
          Track the Unseen.<br/>
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Buy the Truth.</span>
        </h1>

        <p className={`text-lg text-gray-400 mb-10 ${fraunces.className}`}>
          Join the smart shoppers uncovering the real price history.
        </p>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => signIn("google", { callbackUrl: "/profile" })}
          className="w-full h-16 bg-white hover:bg-gray-50 text-black rounded-full text-lg font-bold flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
            <path d="M1 1h22v22H1z" fill="none" />
          </svg>
          Continue with Google
        </motion.button>



      </motion.div>
    </div>
  );
}
