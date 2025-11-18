"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dropdown } from "primereact/dropdown";
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
import { SelectedValues } from "../components/Leads";

// Define types for props
interface Offer {
  id: string;
  title: string;
  isActive: boolean;
  thumbnail?: {
    mobile: string;
    web: string;

  }
  offerBanner?: {
    banner: string;
  }
  offerImage?: {
    mobile: string;

  }

}

interface OfferSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOffer: (offer: Offer) => void;
  selectedRowsData: DataProps[];
  selected: string;
  selectedValues: SelectedValues;
}

const OfferSelectionModal: React.FC<OfferSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectOffer,
  selectedRowsData,
  selected,
  selectedValues,
}) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") || null;
  console.log(selectedOffer," Selected Offer State")

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
    if (!selectedOffer) return;

    try {
      setLoading(true);
      console.log("Submitting selected offer:", selectedOffer);

      const sending = type === "Notification" ? "Application" : type || "";

      const payload = {
        offerIds: [selectedOffer.id],
        userIds:
          selectedRowsData.length >= 1
            ? selectedRowsData.map((row) => row.id)
            : selected === "all"
            ? "all"
            : [],
        type: `${sending}_create`,
        selectedValues,
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
      console.error(
        "Error submitting offer:",
        error?.response?.data || error.message
      );
      toast.error("Notification not sent");
      onClose();
    } finally {
      setLoading(false);
    }
  };
 // ✅ Template for dropdown item and selected value
const offerTemplate = (offer: Offer) => {
  if (!offer) return null;

  const imageSrc =
    offer?.thumbnail?.mobile ||
    offer?.offerBanner?.banner ||
    offer?.offerImage?.mobile || "/images/auth/credit_logo.png"



  return (
    <div className="flex items-center gap-3">
      <Image
        src={imageSrc}
        alt={offer.title}
        width={40}
        height={40}
        className="rounded-md object-cover border"
      />
      <span>{offer.title}</span>
    </div>
  );
};
const valueTemplate = (offer: Offer | null) => {
  if (!offer) return <span className="text-gray-400">Select an Offer</span>;
  return offerTemplate(offer);
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
          itemTemplate={offerTemplate}
          valueTemplate={valueTemplate}
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
