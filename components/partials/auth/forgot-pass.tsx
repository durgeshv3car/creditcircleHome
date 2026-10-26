"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Inputs = {
  email: string;
};

const ForgotPass = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      toast.success("Password reset instructions dispatched to your email");
    } catch (err) {
      toast.error("Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 rounded-sm bg-slate-50 border border-slate-200 text-slate-800 space-y-2 text-center">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold">Check your inbox</h3>
        <p className="text-xs text-slate-600 leading-relaxed font-normal">
          We&apos;ve dispatched password reset instructions to your email address. Follow the link to choose a new password.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-normal text-slate-700">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className={cn(
            "h-10 text-sm rounded-sm border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:border-slate-400 shadow-2xs",
            errors.email && "border-rose-400 focus-visible:ring-rose-500"
          )}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Please enter a valid email address",
            },
          })}
        />
        {errors.email && (
          <p className="text-xs text-rose-500 font-medium mt-1">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        fullWidth
        disabled={loading}
        className="h-10 rounded-sm font-medium bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-2xs transition-colors cursor-pointer mt-2"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
            <span>Sending Recovery Email...</span>
          </>
        ) : (
          <span>Send Recovery Email</span>
        )}
      </Button>
    </form>
  );
};

export default ForgotPass;
