"use client";
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dropdown } from 'primereact/dropdown';
import { fetchOffers } from "@/app/(protected)/services/offers/api";
import axios from "axios";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { DataProps } from "../table/columns";
import { createNotifications } from "@/app/(protected)/services/notifications/app/api";

// Define types for props
interface Offer {
  id: string;
  title: string;
  isActive: boolean;
}

interface OfferSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOffer: (offer: Offer) => void;
  selectedRowsData: DataProps[];
}

const OfferSelectionModal: React.FC<OfferSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectOffer,
  selectedRowsData,
}) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") || null;

  // Fetch offers when the modal opens
useEffect(() => {
  if (!isOpen) return;

  const fetchOffersData = async () => {
    try {
      console.log("Fetching offers from API...");
      const response = await fetchOffers();

      const activeOffers = response.filter(
        (offer: Offer) => offer.isActive === true
      );

      console.log("Offers fetched successfully:", activeOffers);
      setOffers(activeOffers);
    } catch (error: any) {
      console.error("Error fetching offers:", error.message);
    }
  };

  fetchOffersData();
}, [isOpen]);


  // Handle offer selection (Dropdown stays open)
  const handleSelectOffer = (offer: Offer) => {
    console.log("Selected offer:", offer);
    setSelectedOffer(offer);
  };

  // Submit the selected offer
 const handleSubmit = async () => {
  
  if (!selectedOffer || !selectedRowsData.length) return;

  try {
    setLoading(true);
    console.log("Submitting selected offer:", selectedOffer);
    console.log("Selected rows:", selectedRowsData);

    const sending = type === "Notification" ? "Application" : (type || "");

    const payload = {
      offerIds: [selectedOffer.id],
      userIds: selectedRowsData.map((row) => String(row.id)),
      type: `${sending}_create`,
    };

    const response = await createNotifications(payload);

    console.log("Offer submitted successfully:", response?.data);

    // Redirect based on type
    if (type === "Email") {
      router.push("/Tools/messageCenter/email");
    } else if (type === "Notification") {
      router.push("/Tools/messageCenter/application");
    } else if (type === "Sms") {
      router.push("/Tools/messageCenter/sms");
    } else if (type === "Whatsapp") {
      router.push("/Tools/messageCenter/whatsapp");
    }

    onSelectOffer(selectedOffer);
    onClose();
  } catch (error: any) {
    console.error("Error submitting offer:", error?.response?.data || error.message);
    toast.error("Notification not sent");
    onClose();
  } finally {
    setLoading(false);
  }
};


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Select an Offer</DialogTitle>
        </DialogHeader>

        {/* ShadCN Combobox */}

        <Dropdown
          value={selectedOffer}
          onChange={(e) => handleSelectOffer(e.value)}
          options={offers}
          optionLabel="title"
          placeholder="Select an Offer"
          className="w-full"
          appendTo="self" 
          checkmark
          highlightOnSelect={false}
        />

        {/* Submit Button (Only active when an offer is selected) */}
        <Button
          className="mt-4 w-full"
          disabled={!selectedOffer || loading}
          onClick={handleSubmit}
        >
          {loading ? "Submitting..." : "Send Offer"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default OfferSelectionModal;
