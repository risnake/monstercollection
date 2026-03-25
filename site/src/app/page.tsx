"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Zap,
  List,
  Package,
  Star,
  Hash,
  X,
} from "lucide-react";
import catalogData from "../../data/catalog.json";
import inventoryData from "../../data/inventory.json";
import {
  CatalogMonster,
  InventoryEntry,
  MonsterWithInventory,
  Tier,
} from "../types";

const TIER_COLORS: Record<Tier, { text: string; bg: string; border: string; glow: string }> = {
  S: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/50", glow: "shadow-[0_0_15px_rgba(239,68,68,0.3)]" },
  A: { text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/50", glow: "shadow-[0_0_15px_rgba(249,115,22,0.3)]" },
  B: { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/50", glow: "shadow-[0_0_15px_rgba(234,179,8,0.3)]" },
  C: { text: "text-lime-400", bg: "bg-lime-500/10", border: "border-lime-500/50", glow: "shadow-[0_0_15px_rgba(132,204,22,0.3)]" },
  D: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/50", glow: "shadow-[0_0_15px_rgba(52,211,153,0.3)]" },
  F: { text: "text-gray-400", bg: "bg-gray-500/10", border: "border-gray-500/50", glow: "shadow-[0_0_15px_rgba(156,163,175,0.3)]" },
};

type View = "inventory" | "tier";

export default function Home() {
  const [catalog, setCatalog] = useState<CatalogMonster[]>([]);
  const [inventory, setInventory] = useState<InventoryEntry[]>([]);
  const [view, setView] = useState<View>("inventory");
  const [selectedMonster, setSelectedMonster] = useState<MonsterWithInventory | null>(null);

  useEffect(() => {
    setCatalog(catalogData as CatalogMonster[]);
    setInventory(inventoryData as InventoryEntry[]);
  }, []);

  const inventoryMonsters: MonsterWithInventory[] = useMemo(() => {
    const inventoryMap = new Map<string, InventoryEntry>();
    for (const inv of inventory) {
      inventoryMap.set(inv.catalogId, inv);
    }
    return catalog
      .map((m) => ({
        ...m,
        inventory: inventoryMap.get(m.id),
      }))
      .filter((m) => m.inventory) as MonsterWithInventory[];
  }, [catalog, inventory]);

  const tiers: Tier[] = ["S", "A", "B", "C", "D", "F"];

  const totalCans = inventory.reduce((sum, inv) => sum + inv.quantity, 0);
  const uniqueFlavors = new Set(inventory.map((inv) => inv.catalogId)).size;
  const avgRating = inventory.length
    ? (inventory.reduce((sum, inv) => sum + inv.rating, 0) / inventory.length).toFixed(1)
    : "0";

  return (
    <main className="min-h-screen bg-[#080808] text-[#e5e5e5] uppercase tracking-wider relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#90C53F22] rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#90C53F11] rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-[#222] bg-[#080808]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Zap className="text-[#90C53F] w-7 h-7" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] skew-x-[-10deg]">
              rishabh's<span className="text-[#90C53F]">monsters</span>
            </h1>
          </div>

          <nav className="flex items-center gap-2 sm:gap-3">
            {([
              { key: "inventory" as View, icon: Package, label: "MY CANS" },
              { key: "tier" as View, icon: List, label: "TIER LIST" },
            ]).map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 border text-xs sm:text-sm transition-all duration-300 skew-x-[-10deg] ${
                  view === key
                    ? "border-[#90C53F] text-[#90C53F] shadow-[0_0_10px_#90C53F44] bg-[#90C53F08]"
                    : "border-[#333] text-[#666] hover:text-white hover:border-[#555]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-[#1a1a1a] bg-[#0c0c0c]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-center gap-6 sm:gap-12 text-xs sm:text-sm">
          <Stat icon={<Package className="w-4 h-4" />} value={String(totalCans)} label="TOTAL CANS" />
          <Stat icon={<Hash className="w-4 h-4" />} value={String(uniqueFlavors)} label="FLAVORS" />
          <Stat icon={<Star className="w-4 h-4" />} value={avgRating} label="AVG RATING" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {view === "inventory" && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {inventoryMonsters.length === 0 ? (
                <div className="text-center py-20 text-[#444]">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">NO CANS IN YOUR COLLECTION</p>
                  <p className="text-sm mt-2 normal-case tracking-normal">
                    Add monsters to inventory.json to start your collection
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inventoryMonsters.map((monster, i) => (
                    <InventoryCard
                      key={monster.id}
                      monster={monster}
                      index={i}
                      onClick={() => setSelectedMonster(monster)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {view === "tier" && (
            <motion.div
              key="tier"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="flex flex-col gap-4"
            >
              {tiers.map((tier) => (
                <TierRow
                  key={tier}
                  tier={tier}
                  monsters={inventoryMonsters.filter(
                    (m) => m.inventory?.tier === tier
                  )}
                  onMonsterClick={(m) => setSelectedMonster(m)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedMonster && (
          <MonsterModal
            monster={selectedMonster}
            onClose={() => setSelectedMonster(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ─── Stat Badge ─── */
function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[#888]">
      <span className="text-[#90C53F]">{icon}</span>
      <span className="text-white font-bold text-base sm:text-lg">{value}</span>
      <span className="text-[10px] sm:text-xs">{label}</span>
    </div>
  );
}

/* ─── Inventory Card ─── */
function InventoryCard({
  monster,
  index,
  onClick,
}: {
  monster: MonsterWithInventory;
  index: number;
  onClick: () => void;
}) {
  const inv = monster.inventory!;
  const tierStyle = TIER_COLORS[inv.tier];

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onClick}
      className="group flex gap-4 bg-[#111] border border-[#222] rounded-lg p-4 cursor-pointer transition-all duration-300 hover:border-[#90C53F] hover:shadow-[0_0_20px_#90C53F22] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#90C53F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]"
    >
      {/* Image */}
      <div className="relative w-20 h-28 sm:w-24 sm:h-32 flex-shrink-0 bg-[#0a0a0a] rounded-md overflow-hidden">
        <Image
          src={monster.imagePath}
          alt={monster.name}
          fill
          className="object-contain p-1"
          sizes="96px"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm sm:text-base font-bold truncate group-hover:text-[#90C53F] transition-colors">
              {monster.name}
            </h3>
            <span
              className={`text-xs font-black px-2 py-0.5 border rounded-sm shrink-0 skew-x-[-10deg] ${tierStyle.text} ${tierStyle.border} ${tierStyle.bg}`}
            >
              {inv.tier}
            </span>
          </div>
          <p className="text-[11px] text-[#666] mt-1 normal-case tracking-normal">
            {monster.flavorProfile}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-[#888]">
            <Package className="w-3.5 h-3.5 text-[#90C53F]" />
            <span className="font-bold text-white">{inv.quantity}</span>
            <span className="text-[10px]">CANS</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#888]">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-white">{inv.rating}</span>
            <span className="text-[10px]">/10</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

/* ─── Tier Row ─── */
function TierRow({
  tier,
  monsters,
  onMonsterClick,
}: {
  tier: Tier;
  monsters: MonsterWithInventory[];
  onMonsterClick: (m: MonsterWithInventory) => void;
}) {
  const style = TIER_COLORS[tier];

  return (
    <div className="flex flex-col sm:flex-row bg-[#0c0c0c] border border-[#222] rounded-lg overflow-hidden">
      <div
        className={`w-full sm:w-20 sm:min-w-[5rem] flex items-center justify-center p-3 sm:p-4 border-b sm:border-b-0 sm:border-r border-[#222] ${style.bg} ${style.text} ${style.glow}`}
      >
        <span className="text-3xl sm:text-4xl font-black skew-x-[-15deg]">
          {tier}
        </span>
      </div>
      <div className="flex-1 p-3 flex flex-wrap gap-3 min-h-[80px] items-center">
        {monsters.length > 0 ? (
          monsters.map((monster, i) => (
            <motion.button
              type="button"
              key={monster.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onMonsterClick(monster)}
              className="group relative w-16 h-24 sm:w-20 sm:h-28 bg-[#111] border border-[#333] hover:border-[#90C53F] rounded-md overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-[0_0_10px_#90C53F33] hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#90C53F]"
            >
              <Image
                src={monster.imagePath}
                alt={monster.name}
                fill
                className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
                sizes="80px"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-1">
                <p className="text-[8px] sm:text-[9px] text-center font-bold truncate">
                  {monster.name}
                </p>
              </div>
            </motion.button>
          ))
        ) : (
          <span className="text-[#333] text-xs w-full text-center">
            NO CANS IN THIS TIER
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Monster Detail Modal ─── */
function MonsterModal({
  monster,
  onClose,
}: {
  monster: MonsterWithInventory;
  onClose: () => void;
}) {
  const inv = monster.inventory;
  const tierStyle = inv ? TIER_COLORS[inv.tier] : null;
  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    const closeBtn = modalRef.current?.querySelector<HTMLElement>("button");
    closeBtn?.focus();
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
      />

      <motion.div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${monster.name} details`}
        onKeyDown={handleKeyDown}
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg bg-[#111] border border-[#333] rounded-xl z-[70] overflow-hidden flex flex-col max-h-[90vh]"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 p-1.5 bg-[#222] border border-[#444] rounded-md hover:bg-[#333] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#90C53F]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative w-full h-64 sm:h-72 bg-[#0a0a0a] flex-shrink-0">
          <Image
            src={monster.imagePath}
            alt={monster.name}
            fill
            className="object-contain p-6"
            sizes="(max-width: 640px) 100vw, 512px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-xl font-bold">{monster.name}</h2>
              <span className="text-xs text-[#90C53F] capitalize">{monster.category}</span>
            </div>
            {inv && tierStyle && (
              <span
                className={`text-lg font-black px-3 py-1 border rounded-sm skew-x-[-10deg] ${tierStyle.text} ${tierStyle.border} ${tierStyle.bg}`}
              >
                {inv.tier}
              </span>
            )}
          </div>

          <p className="text-sm text-[#aaa] normal-case tracking-normal mb-4">
            {monster.description}
          </p>

          <div className="text-xs text-[#666] normal-case tracking-normal mb-4">
            <span className="text-[#90C53F] uppercase tracking-wider font-bold text-[10px]">
              Flavor Profile
            </span>
            <p className="mt-1">{monster.flavorProfile}</p>
          </div>

          {inv && tierStyle && (
            <div className="bg-[#0a0a0a] border border-[#222] rounded-lg p-4 space-y-3">
              <p className="text-[10px] text-[#90C53F] uppercase tracking-widest font-bold mb-2">
                Your Collection
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{inv.quantity}</p>
                  <p className="text-[10px] text-[#666]">CANS</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-yellow-400">{inv.rating}/10</p>
                  <p className="text-[10px] text-[#666]">RATING</p>
                </div>
                <div className="text-center">
                  <p className={`text-lg font-bold ${tierStyle.text}`}>{inv.tier}</p>
                  <p className="text-[10px] text-[#666]">TIER</p>
                </div>
              </div>
              {inv.notes && (
                <p className="text-xs text-[#888] normal-case tracking-normal border-t border-[#222] pt-3 mt-3">
                  &ldquo;{inv.notes}&rdquo;
                </p>
              )}
              <p className="text-[10px] text-[#555] normal-case tracking-normal">
                Added {inv.dateAdded}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
