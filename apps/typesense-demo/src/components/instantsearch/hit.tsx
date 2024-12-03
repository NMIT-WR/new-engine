"use client";
import { Card } from "@/components/ui/card";
import { typesenseSchema } from "@/lib/schema";
import { Package, Tag } from "lucide-react";
import { z } from "zod";

type Item = z.infer<typeof typesenseSchema>;

function formatPrice(price: number) {
  return `${price.toFixed(2)} Kč`;
}

export default function Hit({ hit }: { hit: Item }) {
  return (
    <div className="w-full flex flex-col aspect-3/4 transition-all pb-[10px]">
      <Card className="flex flex-col relative rounded-lg transition-all hover:shadow-xl items-center p-4 bg-white dark:bg-zinc-900">
        {hit.image && (
          <div className="w-full h-48 mb-4">
            <img src={hit.image} alt={hit.name} className="w-full h-full object-contain" />
          </div>
        )}
        <div className="w-full mb-4">
          <h3 className="text-xl truncate tracking-tight font-bold">{hit.name}</h3>
          <p className="text-sm text-muted-foreground">{hit.description}</p>
        </div>
        <div className="flex justify-between w-full mb-2">
          {hit.brand && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Package size={16} />
              <span>{hit.brand}</span>
            </div>
          )}
          {hit.categories && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Tag size={16} />
              <span>{hit.categories.join(", ")}</span>
            </div>
          )}
        </div>
        <div className="absolute mb-[-16px] mr-3 border-green-400 dark:border-background border-2 bottom-0 font-extrabold right-0 text-green-400 bg-green-50 dark:bg-green-800 py-1 px-2 rounded-lg">
          <h1 className="text-xl">{formatPrice(hit.price)}</h1>
        </div>
      </Card>
    </div>
  );
}
