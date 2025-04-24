"use client";
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

// Define types for props
interface Offer {
  id: string;
  title: string;
  isActive: boolean;
}

interface SelectedRowData {
  id: string | number;
}

interface OfferSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOffer: (offer: Offer) => void;
  selectedRowsData: SelectedRowData[];
}

const OfferSelectionModal: React.FC<OfferSelectionModalProps> = ({ isOpen, onClose, onSelectOffer, selectedRowsData }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") || null;



  console.log("Type:", type);

  // Fetch offers when the modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchOffers = async () => {
      try {
        console.log("Fetching offers from API...");
        const response = await fetch("http://localhost:5000/api/offer/offer");

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Offers fetched successfully:", data);
        const offers = data.offers.filter((offer: Offer) => offer.isActive === true);
        setOffers(offers);
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
      console.log("Submitting selected offer:", selectedOffer);
      console.log("Selected rows:", selectedRowsData);
      let sending: string;
      if (type === "Notification") {
        sending = "Application";
      } else {
        sending = type || "";
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
        toast.error("Notification not send again")
        onClose()
        throw new Error(`HTTP error! Status: ${response.status}`);
        
        
      }

      const result = await response.json();
      console.log("Offer submitted successfully:", result);
      if (type === "Email") {
        router.push("/Tools/messageCenter/email");
      } else if (type === "Notification") {
        router.push("/Tools/messageCenter/application");
      } else if (type === "Sms") {
        router.push("/Tools/messageCenter/sms");
      } else if (type === "Whatsapp") {
        router.push("/Tools/messageCenter/whatsapp");
      }

      // Notify parent component
      onSelectOffer(selectedOffer);

      // Close modal only after submitting
      onClose();
    } catch (error: any) {
      console.error("Error submitting offer:", error.message);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select an Offer</DialogTitle>
        </DialogHeader>

        {/* ShadCN Combobox */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
              {selectedOffer ? selectedOffer.title : "Select an Offer"}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search offer..." className="h-9" />
              <CommandList>
                <CommandEmpty>No offers found.</CommandEmpty>
                <CommandGroup>
                  {offers.map((offer) => (
                    <CommandItem
                      key={offer.id}
                      value={offer.id}
                      onSelect={() => handleSelectOffer(offer)}
                    >
                      {offer.title}
                      <Check className={`ml-auto ${selectedOffer?.id === offer.id ? "opacity-100" : "opacity-0"}`} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Submit Button (Only active when an offer is selected) */}
        <Button
          className="mt-4 w-full"
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
