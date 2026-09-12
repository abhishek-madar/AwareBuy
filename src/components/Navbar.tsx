import Link from "next/link";
import AuthButton from "./AuthButton";
import { ShoppingBag } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="absolute top-0 w-full z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-28 flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="ABuy" className="h-12" />
        </Link>
        <AuthButton />
      </div>
    </nav>
  );
}
