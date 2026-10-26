"use client";
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";

interface Offer {
  id: string;
  title: string;
}

interface OfferSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOffer: (offer: Offer) => void;
  selectedRowsData: { id: string }[];
}

const OfferSelectionModal: React.FC<OfferSelectionModalProps> = ({ isOpen, onClose, onSelectOffer, selectedRowsData }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams?.get("type");



  // Fetch offers when the modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchOffers = async () => {
      try {

        const response = await fetch("http://localhost:5000/api/offer/offer");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        setOffers(data.offers);
      } catch (error: any) {
        console.error("Error fetching offers:", error.message);
      }
    };

    fetchOffers();
  }, [isOpen]);

  // Handle offer selection (Dropdown stays open)
  const handleSelectOffer = (offer: Offer) => {
    setSelectedOffer(offer);
  };

  // Submit the selected offer
  const handleSubmit = async () => {
    if (!selectedOffer || !selectedRowsData.length) return;

    try {
      setLoading(true);
      let sending;
      if (type === "Notification") {
        sending = "Application";
      } else {
        sending = type;
      }

      const response = await fetch("http://localhost:5000/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerIds: [selectedOffer.id], // Array format
          userIds: selectedRowsData.map((row) => String(row.id)), // Array of row IDs
          type: `${sending}_create`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (type === "Email") {
        router.push("/messageCenter/email");
      } else if (type === "Notification") {
        router.push("/messageCenter/application");
      } else if (type === "Sms") {
        router.push("/messageCenter/sms");
      } else if (type === "Whatsapp") {
        router.push("/messageCenter/whatsapp");
      }

      // Notify parent component
      onSelectOffer(selectedOffer);

      // Close modal only after submitting
      onClose();
    } catch (error: any) {
      console.error("Error submitting offer:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 rounded-lg border border-slate-200 bg-white shadow-xl">
        <DialogHeader className="pb-3 border-b border-slate-100">
          <DialogTitle className="text-sm font-bold text-slate-900">
            Select an Offer
          </DialogTitle>
        </DialogHeader>

        {/* ShadCN Combobox */}
        <div className="pt-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between h-10 px-3 rounded-md text-xs border-slate-200"
              >
                <span className="truncate">
                  {selectedOffer ? selectedOffer.title : "Select an Offer..."}
                </span>
                <ChevronsUpDown className="w-3.5 h-3.5 opacity-50 shrink-0 ml-auto" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-[var(--radix-popover-trigger-width)] min-w-[280px] p-0 rounded-lg border border-slate-200 shadow-xl bg-white overflow-hidden z-50"
            >
              <Command>
                <div className="border-b border-slate-100">
                  <CommandInput
                    placeholder="Search offer..."
                    className="text-xs h-9 py-1.5"
                  />
                </div>
                <CommandList className="max-h-56 overflow-y-auto p-1 clean-scrollbar">
                  <CommandEmpty className="py-4 text-center text-xs text-slate-400">
                    No offers found.
                  </CommandEmpty>
                  <CommandGroup>
                    {offers.map((offer) => (
                      <CommandItem
                        key={offer.id}
                        value={`${offer.id} ${offer.title}`}
                        onSelect={() => handleSelectOffer(offer)}
                        className="text-xs rounded-md cursor-pointer py-1.5 px-2 flex items-center justify-between"
                      >
                        <span className="truncate">{offer.title}</span>
                        <Check
                          className={`w-3.5 h-3.5 ml-auto text-[#FF6B4A] ${
                            selectedOffer?.id === offer.id
                              ? "opacity-100"
                              : "opacity-0"
                          }`}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Submit Button (Only active when an offer is selected) */}
        <Button
          className="mt-4 w-full h-10 rounded-md bg-[#FF6B4A] hover:bg-[#E65A38] text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          disabled={!selectedOffer || loading}
          onClick={handleSubmit}
        >
          {loading ? "Submitting..." : "Submit Offer"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default OfferSelectionModal;
