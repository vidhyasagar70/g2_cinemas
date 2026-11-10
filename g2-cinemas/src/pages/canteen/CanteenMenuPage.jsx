import React from "react";
import { UtensilsCrossed, CheckCircle2, XCircle, ShoppingBag, Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";

export const CanteenMenuPage = () => {
  const { products, toggleProductAvailability } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#292929] pb-4">
        <div>
          <h1 className="text-2xl font-black text-white">Kitchen Menu & Live Stock</h1>
          <p className="text-xs text-[#888]">
            Enable or disable products instantly based on kitchen inventory.
          </p>
        </div>

        <span className="text-xs text-[#888] bg-[#171717] px-3 py-1.5 rounded-xl border border-[#292929]">
          Total Products: {products.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p) => (
          <div
            key={p.id}
            className={`p-4 rounded-2xl border transition flex gap-4 items-center justify-between ${
              p.isAvailable
                ? "bg-[#141414] border-[#292929]"
                : "bg-[#141414]/60 border-[#222] opacity-60"
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={p.image}
                alt={p.name}
                className="w-14 h-14 rounded-xl object-cover border border-[#333] shrink-0"
              />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-1">
                  {p.name}
                </h4>
                <div className="text-[11px] text-[#888]">{p.category} • ₹{p.price}</div>
                <div className="text-[10px] text-[#FFC914] mt-0.5">Stock: {p.stock} units</div>
              </div>
            </div>

            <button
              onClick={() => toggleProductAvailability(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                p.isAvailable
                  ? "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 hover:bg-[#22C55E]/25"
                  : "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25"
              }`}
            >
              {p.isAvailable ? "In Stock" : "Disabled"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

