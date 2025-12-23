"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { VerifyOtp } from "@/app/(protected)/services/csv/api";

interface OtpModalProps {
  open: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export default function OtpModal({
  open,
  onClose,
  onVerified,
}: OtpModalProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Reset OTP every time modal opens
  useEffect(() => {
    if (open) {
      setOtp("");
      setLoading(false);
    }
  }, [open]);

  const verifyOtp = async () => {
    if (otp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 4-digit OTP",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await VerifyOtp(otp);

      if (res.success) {
        toast({
          title: "OTP Verified",
          description: "You can now export data",
        });

        onVerified(); 
        onClose();    
      }
    } catch (err) {
      toast({
        title: "OTP Failed",
        description: "Invalid or expired OTP",
        variant: "destructive",
      });
      // ❌ DO NOT close modal here
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>OTP Verification</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Enter the OTP sent to your registered email.
          </p>

          <Input
            type="text"
            maxLength={4}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            placeholder="Enter 4-digit OTP"
            className="text-center text-lg tracking-widest"
          />

          <Button
            onClick={verifyOtp}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
