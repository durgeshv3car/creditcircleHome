"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { fetchOffers } from "@/app/(protected)/services/offers/api";

interface OfferBanner {
  banner: string;
}

interface OfferItem {
  id: number;
  title: string;
  offerBanner: OfferBanner;
}

function Filter({
  selectedOffer,
  setSelectedOffer,
}: {
  selectedOffer: string;
  setSelectedOffer: (value: string) => void;
}) {
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchOffers();
        setOffers(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-72">
      <Select value={selectedOffer} onValueChange={setSelectedOffer}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Offer" />
        </SelectTrigger>

        <SelectContent>
          {offers?.map((item) => (
            <SelectItem
              key={item.id}
              value={String(item.id)}   // unique value
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.offerBanner?.banner}
                  alt={item.title}
                  className="w-8 h-8 rounded-md object-cover"
                />
                <span>{item.title}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default Filter;
