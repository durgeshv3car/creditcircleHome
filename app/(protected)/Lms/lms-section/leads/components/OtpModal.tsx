"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, KeyRound, Lock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { VerifyOtp } from "@/app/(protected)/services/csv/api";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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
        description: "Please enter the complete 4-digit security code",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await VerifyOtp(otp);

      if (res.success) {
        toast({
          title: "Authorization Verified",
          description: "Data export has been authorized successfully",
        });

        onVerified();
        onClose();
      } else {
        toast({
          title: "Verification Failed",
          description: res.message || "Invalid or expired security code",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Security Error",
        description: "Something went wrong during code verification",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg border border-slate-200/90 shadow-2xl p-6 bg-white overflow-hidden text-center">
        <DialogHeader className="items-center pb-2">
          {/* Animated Security Vault Badge */}
          <div className="relative mb-2">
            <div className="w-16 h-16 rounded-md bg-gradient-to-tr from-[#FF6B4A]/10 via-orange-500/15 to-[#F48220]/20 border border-orange-200/80 text-[#FF6B4A] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-8 h-8 text-[#FF6B4A]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FF6B4A] text-white flex items-center justify-center shadow-2xs">
              <Lock className="w-3 h-3" />
            </div>
          </div>

          <DialogTitle className="text-xl font-extrabold text-slate-900 tracking-tight text-center">
            Export Authorization
          </DialogTitle>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
            Enter the 4-digit security code sent to authorize downloading borrower lead records.
          </p>
        </DialogHeader>

        <div className="space-y-5 pt-3">
          {/* Bank-grade 4-Digit Input Boxes */}
          <div className="flex justify-center">
            <InputOTP
              maxLength={4}
              value={otp}
              onChange={(value) => setOtp(value)}
              autoFocus
            >
              <InputOTPGroup className="gap-2.5">
                {[0, 1, 2, 3].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-14 w-12 sm:w-14 rounded-md border-2 border-slate-200/90 text-2xl font-mono font-extrabold text-slate-900 bg-slate-50/70 focus-within:bg-white focus-within:border-[#FF6B4A] focus-within:ring-4 focus-within:ring-orange-500/15 shadow-2xs transition-all"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 h-11 rounded-md border-slate-200/90 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={verifyOtp}
              disabled={loading || otp.length !== 4}
              className="flex-1 h-11 rounded-md bg-gradient-to-r from-[#FF6B4A] to-[#F48220] hover:from-[#E65A38] hover:to-[#D9532F] text-white text-xs font-bold shadow-xs hover:shadow-md hover:shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Verify & Download</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
