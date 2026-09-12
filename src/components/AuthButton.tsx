'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthButton() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session && session.user) {
    return (
      <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-full shadow-lg">
        <Link href="/profile">
          {session.user.image && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={session.user.image} alt="User" className="w-9 h-9 rounded-full border-2 border-white/20 hover:border-green-400 transition-colors cursor-pointer" />
            </>
          )}
        </Link>
        <button onClick={() => signOut()} className="text-sm font-bold text-gray-300 hover:text-white transition-colors">
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={() => router.push("/login")}
      className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-full text-[13px] uppercase font-black tracking-[0.2em] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] hover:-translate-y-0.5"
    >
      Sign In
    </button>
  );
}
