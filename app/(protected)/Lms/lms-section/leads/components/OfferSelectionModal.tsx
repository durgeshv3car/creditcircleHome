"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Send,
  Loader2,
  Mail,
  MessageSquare,
  Bell,
  Smartphone,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dropdown } from "primereact/dropdown";
import { fetchOffers } from "@/app/(protected)/services/offers/api";
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
import { cn } from "@/lib/utils";

// Define types for props
interface Offer {
  id: string;
  title: string;
  isActive: boolean;
  thumbnail?: {
    mobile: string;
    web: string;
  };
  offerBanner?: {
    banner: string;
  };
  offerImage?: {
    mobile: string;
  };
}

interface OfferSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOffer: (offer: Offer) => void;
  selectedRowsData: DataProps[];
  selected: string;
  selectedValues: SelectedValues;
}

const getChannelIcon = (type: string | null) => {
  switch (type?.toLowerCase()) {
    case "email":
      return Mail;
    case "sms":
      return MessageSquare;
    case "whatsapp":
      return Smartphone;
    case "notification":
    default:
      return Bell;
  }
};

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
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams?.get("type") || null;

  // Fetch offers when the modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchOffersData = async () => {
      try {
        const response = await fetchOffers();
        const activeOffers = response.filter(
          (offer: Offer) => offer.isActive === true
        );
        setOffers(activeOffers);
      } catch (error: any) {
        console.error("Error fetching offers:", error?.message);
      }
    };

    fetchOffersData();
  }, [isOpen]);

  // Handle offer selection
  const handleSelectOffer = (offer: Offer) => {
    setSelectedOffer(offer);
  };

  // Submit the selected offer
  const handleSubmit = async () => {
    if (!selectedOffer) return;

    try {
      setLoading(true);
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

      await createNotifications(payload);

      toast.success("Campaign dispatch initiated successfully!");

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
      toast.error("Notification could not be dispatched");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const ChannelIcon = getChannelIcon(type);

  // Template for dropdown item and selected value
  const offerTemplate = (offer: Offer) => {
    if (!offer) return null;

    const imageSrc =
      offer?.thumbnail?.mobile ||
      offer?.offerBanner?.banner ||
      offer?.offerImage?.mobile ||
      "/images/auth/credit_logo.png";

    return (
      <div className="flex items-center gap-3 py-1">
        <Image
          src={imageSrc}
          alt={offer.title}
          width={36}
          height={36}
          className="rounded-lg object-cover border border-slate-200/80 shadow-2xs shrink-0"
        />
        <div className="min-w-0">
          <p className="font-bold text-xs text-slate-800 truncate">{offer.title}</p>
          <span className="text-[10px] text-emerald-600 font-bold">Active Offer</span>
        </div>
      </div>
    );
  };

  const valueTemplate = (offer: Offer | null) => {
    if (!offer) return <span className="text-slate-400 text-xs">Choose an active campaign offer...</span>;
    return offerTemplate(offer);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={undefined}
        className="sm:max-w-md rounded-lg border border-slate-200/90 shadow-2xl p-6 bg-white overflow-hidden"
      >
        <DialogHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#101E4E] text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Launch {type || "Offer"} Campaign
                </DialogTitle>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF1ED] text-[#EA580C] border border-orange-200/70">
                  <ChannelIcon className="w-3 h-3" />
                  <span>{type || "Campaign"}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span>
                    {selectedRowsData.length >= 1
                      ? `${selectedRowsData.length} selected lead(s)`
                      : "All filtered leads"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="pt-3 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">
              Select Campaign Offer
            </label>
            <div className="rounded-md border border-slate-200/90 bg-slate-50/50 hover:bg-white focus-within:bg-white focus-within:border-[#FF6B4A] focus-within:ring-2 focus-within:ring-orange-500/20 shadow-2xs transition-all overflow-hidden">
              <Dropdown
                value={selectedOffer}
                onChange={(e) => handleSelectOffer(e.value)}
                options={offers}
                optionLabel="title"
                placeholder="Select an Offer"
                className="w-full text-xs border-0 bg-transparent shadow-none"
                appendTo="self"
                itemTemplate={offerTemplate}
                valueTemplate={valueTemplate}
                checkmark
                highlightOnSelect={false}
              />
            </div>
          </div>

          {/* Selected Offer Preview Card */}
          {selectedOffer && (
            <div className="p-3 bg-gradient-to-r from-[#FFF1ED] to-orange-50/80 rounded-md border border-orange-200/80 flex items-center gap-3 animate-in fade-in-0 duration-200">
              <CheckCircle2 className="w-5 h-5 text-[#FF6B4A] shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  Ready to dispatch: {selectedOffer.title}
                </p>
                <p className="text-[10px] text-slate-500">
                  Target: {selectedRowsData.length >= 1 ? `${selectedRowsData.length} leads` : "All filtered leads"} via {type || "Notification"}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 h-10 rounded-md border-slate-200/90 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-10 rounded-md bg-gradient-to-r from-[#FF6B4A] to-[#F48220] hover:from-[#E65A38] hover:to-[#D9532F] text-white text-xs font-bold shadow-xs hover:shadow-md hover:shadow-orange-500/25 active:scale-95 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              disabled={!selectedOffer || loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Campaign</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfferSelectionModal;
