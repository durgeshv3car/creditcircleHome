"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/routing";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginUser } from "@/action/auth-action";
import { toast } from "sonner";
import { useRouter } from "@/components/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
};

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(4, { message: "Password must be at least 4 characters." }),
});

const LoginForm = ({ token }: { token: string }) => {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (token) {
      router.push("/dashboard");
    }
  }, [token, router]);

  if (token) return null;

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    startTransition(async () => {
      try {
        const response = await loginUser(data);
        localStorage.removeItem("endDate");
        localStorage.removeItem("endDateApi");
        localStorage.removeItem("endDateLoan");
        localStorage.removeItem("endDateLead");
        localStorage.removeItem("startDate");
        localStorage.removeItem("startDateApi");
        localStorage.removeItem("startDateLoan");
        localStorage.removeItem("startDateLead");

        if (response?.error) {
          toast.error(typeof response.error === "string" ? response.error : "Invalid email or password");
        } else {
          toast.success("Successfully logged in");
          router.push("/dashboard");
        }
      } catch (err) {
        toast.error((err as Error).message || "An unexpected error occurred during sign in");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
      {/* Email Field */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-normal text-slate-700">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          disabled={isPending}
          placeholder="you@example.com"
          {...register("email")}
          className={cn(
            "h-10 text-sm rounded-sm border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:border-slate-400 shadow-2xs",
            errors.email && "border-rose-400 focus-visible:ring-rose-500"
          )}
        />
        {errors.email && (
          <p className="text-xs text-rose-500 font-medium mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-xs font-normal text-slate-700">
            Password
          </Label>
          <Link
            href="/auth/forgot-password"
            className="text-xs text-slate-500 hover:text-slate-900 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            disabled={isPending}
            placeholder="Your password"
            {...register("password")}
            className={cn(
              "h-10 text-sm rounded-sm border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:border-slate-400 shadow-2xs pr-10",
              errors.password && "border-rose-400 focus-visible:ring-rose-500"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-rose-500 font-medium mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center gap-2 pt-0.5">
        <Checkbox
          id="remember-me"
          defaultChecked
          className="rounded-sm data-[state=checked]:bg-[#0f172a] data-[state=checked]:border-[#0f172a]"
        />
        <Label
          htmlFor="remember-me"
          className="text-xs text-slate-600 font-normal cursor-pointer select-none"
        >
          Remember my credentials on this device
        </Label>
      </div>

      {/* Sign In Button */}
      <Button
        type="submit"
        fullWidth
        disabled={isPending}
        className="h-10 rounded-sm font-medium bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-2xs transition-colors cursor-pointer mt-2"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
            <span>Signing In...</span>
          </>
        ) : (
          <span>Sign In</span>
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
