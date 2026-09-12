'use client';

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { motion } from "framer-motion";
import { Check, X, Loader2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const AVAILABLE_INTERESTS = [
  { id: "sneakers", label: "👟 Sneakers" },
  { id: "laptops", label: "💻 Laptops" },
  { id: "gaming", label: "🎮 Gaming" },
  { id: "audio", label: "🎧 Audio" },
  { id: "cameras", label: "📷 Cameras" },
  { id: "watches", label: "⌚ Watches" },
  { id: "fitness", label: "🏋️ Fitness" },
  { id: "appliances", label: "🍳 Appliances" },
];

export default function OnboardingClient() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [debouncedUsername] = useDebounce(username, 500);
  const [isValidating, setIsValidating] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function checkUsername() {
      if (!debouncedUsername) {
        setIsAvailable(null);
        return;
      }
      
      // Simple regex for valid username (alphanumeric and underscores)
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(debouncedUsername)) {
        setIsAvailable(false);
        return;
      }

      setIsValidating(true);
      try {
        const res = await fetch(`/api/user/check-username?username=${debouncedUsername}`);
        const data = await res.json();
        setIsAvailable(data.available);
      } catch (error) {
        console.error("Failed to check username");
      }
      setIsValidating(false);
    }
    
    checkUsername();
  }, [debouncedUsername]);

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!isAvailable || selectedInterests.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: debouncedUsername, interests: selectedInterests }),
      });

      if (res.ok) {
        // Force refresh to update server components and redirect to profile
        router.refresh();
        router.push("/profile");
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen mesh-bg flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-xl w-full space-y-12 z-10"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-5xl font-black mb-4 tracking-tight">Claim Your Username</h1>
          <p className="text-gray-400 text-lg">Your unique identity in the ABuy ecosystem.</p>
        </motion.div>

        {/* Username Input */}
        <motion.div variants={itemVariants} className="relative">
          <div className={`relative flex items-center p-2 glass-panel rounded-full border-2 transition-colors duration-300 ${
            isAvailable === true ? 'border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : 
            isAvailable === false ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 
            'border-white/10'
          }`}>
            <span className="pl-6 pr-2 text-2xl font-bold text-gray-500">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="username"
              className="flex-1 bg-transparent border-none text-white text-2xl font-bold focus:ring-0 placeholder-gray-600 py-4 outline-none w-full"
              maxLength={20}
            />
            <div className="pr-6 flex items-center justify-center w-12 h-12">
              {isValidating && <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />}
              {!isValidating && isAvailable === true && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-green-500 rounded-full p-1 text-black">
                  <Check className="w-5 h-5" />
                </motion.div>
              )}
              {!isValidating && isAvailable === false && username.length > 2 && (
                <motion.div 
                  initial={{ x: -10 }} 
                  animate={{ x: 0 }} 
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                  className="bg-red-500 rounded-full p-1 text-black"
                >
                  <X className="w-5 h-5" />
                </motion.div>
              )}
            </div>
          </div>
          {isAvailable === false && username.length > 2 && (
             <p className="text-red-400 text-center mt-3 font-semibold text-sm">Username is invalid or taken.</p>
          )}
        </motion.div>

        {/* Interests Grid - Progressive Disclosure */}
        {isAvailable === true && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="space-y-6 pt-4"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">What do you hunt?</h2>
              <p className="text-gray-400 text-sm">Select at least one category to track.</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              {AVAILABLE_INTERESTS.map(interest => {
                const isSelected = selectedInterests.includes(interest.id);
                return (
                  <motion.button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-4 rounded-2xl font-bold transition-all duration-300 border-2 ${
                      isSelected 
                        ? 'bg-green-500/20 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                        : 'glass-panel border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                    }`}
                  >
                    {interest.label}
                  </motion.button>
                )
              })}
            </div>

            <div className="flex justify-center pt-8">
              <motion.button
                whileHover={selectedInterests.length > 0 ? { scale: 1.05 } : {}}
                whileTap={selectedInterests.length > 0 ? { scale: 0.95 } : {}}
                onClick={handleSubmit}
                disabled={selectedInterests.length === 0 || isSubmitting}
                className={`flex items-center gap-2 px-12 py-5 rounded-full font-black text-xl transition-all duration-300 ${
                  selectedInterests.length > 0 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-600 text-black shadow-[0_0_30px_rgba(52,211,153,0.5)] cursor-pointer' 
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
                Complete Setup
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
