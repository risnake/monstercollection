"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, List, Grid3X3, Beaker } from "lucide-react";
import data from "../../data/monsters.json";
import { MonsterEnergy, Tier } from "../types";

export default function Home() {
  const [monsters, setMonsters] = useState<MonsterEnergy[]>([]);
  const [view, setView] = useState<"grid" | "tier">("tier");

  useEffect(() => {
    // In a real app we'd fetch from an API route, here data is imported static
    setMonsters(data as MonsterEnergy[]);
  }, []);

  const tiers: Tier[] = ["S", "A", "B", "C", "D", "F"];

  return (
    <main className="min-h-screen bg-background text-foreground uppercase tracking-widest relative overflow-hidden">
      {/* Background neon elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[var(--color-monster-glow)] rounded-full blur-[120px] pointer-events-none opacity-20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[var(--color-monster-glow)] rounded-full blur-[150px] pointer-events-none opacity-10" />

      <header className="border-b border-border bg-[#080808]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center gap-3">
            <Zap className="text-[var(--color-monster)] w-8 h-8" />
            <h1 className="text-3xl font-bold tracking-[0.2em] transform skew-x-[-10deg]">
              MNSTR<span className="text-[var(--color-monster)]">.</span>CLCTN
            </h1>
          </div>
          
          <nav className="flex items-center gap-4 mt-4 sm:mt-0">
            <button
              onClick={() => setView("grid")}
              className={`flex items-center gap-2 px-4 py-2 border transition-all duration-300 transform skew-x-[-10deg] ${
                view === "grid" 
                  ? "border-[var(--color-monster)] text-[var(--color-monster)] shadow-[0_0_10px_var(--color-monster-glow)]" 
                  : "border-border text-gray-500 hover:text-white"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span>COLLECTION</span>
            </button>
            <button
              onClick={() => setView("tier")}
              className={`flex items-center gap-2 px-4 py-2 border transition-all duration-300 transform skew-x-[-10deg] ${
                view === "tier" 
                  ? "border-[var(--color-monster)] text-[var(--color-monster)] shadow-[0_0_10px_var(--color-monster-glow)]" 
                  : "border-border text-gray-500 hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
              <span>TIER LIST</span>
            </button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {view === "grid" ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              {monsters.map((monster, i) => (
                <CanCard key={monster.id} monster={monster} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="tier"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col gap-6"
            >
              {tiers.map((tier) => (
                <TierSection key={tier} tier={tier} monsters={monsters.filter(m => m.tier === tier)} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

const CanCard = ({ monster, index }: { monster: MonsterEnergy; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative bg-[#111] border border-[#222] overflow-hidden rounded-md transition-all hover:border-[var(--color-monster)]"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#000] to-transparent opacity-80 z-10" />
      <div className="relative h-[300px] w-full p-6 flex justify-center items-center">
        {/* Placeholder for image */}
        <div className="w-24 h-48 border-2 border-dashed border-[#333] group-hover:border-[var(--color-monster)] transition-colors flex items-center justify-center text-[#444] group-hover:text-[var(--color-monster)] transform group-hover:scale-110 group-hover:-rotate-3 duration-500 z-0">
          IMAGE
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform">
          <div className="text-[var(--color-monster)] font-bold text-xl mb-1 flex justify-between items-center">
            {monster.name}
            <span className="bg-[#222] text-[#fff] text-xs px-2 py-1 rounded-sm border border-[#333]">
              {monster.tier} TIER
            </span>
          </div>
          <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
            <Beaker className="w-3 h-3" />
            {monster.flavorProfile}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const TierSection = ({ tier, monsters }: { tier: Tier; monsters: MonsterEnergy[] }) => {
  const getTierColor = (tier: Tier) => {
    switch(tier) {
      case 'S': return 'text-[#ff7f7f] border-[#ff7f7f] shadow-[0_0_15px_rgba(255,127,127,0.3)]';
      case 'A': return 'text-[#ffbf7f] border-[#ffbf7f] shadow-[0_0_15px_rgba(255,191,127,0.3)]';
      case 'B': return 'text-[#ffdf7f] border-[#ffdf7f] shadow-[0_0_15px_rgba(255,223,127,0.3)]';
      case 'C': return 'text-[#ffff7f] border-[#ffff7f] shadow-[0_0_15px_rgba(255,255,127,0.3)]';
      case 'D': return 'text-[#bfff7f] border-[#bfff7f] shadow-[0_0_15px_rgba(191,255,127,0.3)]';
      case 'F': return 'text-[#7fff7f] border-[#7fff7f] shadow-[0_0_15px_rgba(127,255,127,0.3)]';
      default: return 'text-white border-white';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row bg-[#0c0c0c] border border-[#222] rounded-md overflow-hidden">
      <div className={`w-full sm:w-24 sm:min-w-[6rem] flex items-center justify-center p-4 border-b sm:border-b-0 sm:border-r bg-[#111] ${getTierColor(tier)}`}>
        <span className="text-4xl sm:text-5xl font-black transform skew-x-[-15deg]">{tier}</span>
      </div>
      <div className="flex-1 p-4 grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 min-h-[120px]">
        {monsters.length > 0 ? (
          monsters.map((monster, i) => (
            <motion.div
              key={monster.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#1a1a1a] border border-[#333] hover:border-[var(--color-monster)] p-2 rounded transform hover:-translate-y-1 transition-all cursor-pointer group"
            >
              <div className="h-20 w-full mb-2 bg-[#222] rounded flex items-center justify-center border border-dashed border-[#444] text-[10px] text-[#555] group-hover:border-[var(--color-monster)] text-center">
                {monster.name}
              </div>
              <div className="text-xs font-bold text-center truncate w-full group-hover:text-[var(--color-monster)] transition-colors">
                {monster.name}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center text-[#333] text-sm">
            NO CANS IN THIS TIER
          </div>
        )}
      </div>
    </div>
  );
};
