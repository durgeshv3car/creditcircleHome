"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { createUser } from "@/app/(protected)/services/adminUsers/api";
import { cn } from "@/lib/utils";

type Inputs = {
  name: string;
  email: string;
  password: string;
  role: string;
};

const RegForm = ({ roleType, token }: { roleType: string; token: string }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>();

  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const toggleDialog = () => {
    setDialogOpen((prev) => !prev);
  };

  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);

    // Replace role with customRole if "Other" is selected
    if (selectedRole === "Other") {
      data.role = customRole;
    }

    try {
      const response = await createUser(data, token);

      if (response.data.user?.id) {
        toast.success("User created successfully");
        toggleDialog();
        router.push(`/permissions?id=${response.data.user?.id}`);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create user");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
      {/* Name */}
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-xs font-normal text-slate-700">
          Name
        </Label>
        <Input
          id="name"
          placeholder="John Doe"
          className={cn(
            "h-10 text-sm rounded-sm border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:border-slate-400 shadow-2xs",
            errors.name && "border-rose-400 focus-visible:ring-rose-500"
          )}
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 4,
              message: "Name must be at least 4 characters",
            },
          })}
        />
        {errors.name && (
          <p className="text-xs text-rose-500 font-medium mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
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
              message: "Invalid email format",
            },
          })}
        />
        {errors.email && (
          <p className="text-xs text-rose-500 font-medium mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-xs font-normal text-slate-700">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Your password"
            className={cn(
              "h-10 text-sm rounded-sm border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:border-slate-400 shadow-2xs pr-10",
              errors.password && "border-rose-400 focus-visible:ring-rose-500"
            )}
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
                message:
                  "At least 8 chars, with uppercase, lowercase, number & symbol",
              },
            })}
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
          <p className="text-xs text-rose-500 font-medium mt-1">{errors.password.message}</p>
        )}
      </div>

      {/* Role Select */}
      <div className="space-y-1.5">
        <Label htmlFor="role" className="text-xs font-normal text-slate-700">
          Role
        </Label>
        <Controller
          control={control}
          name="role"
          rules={{ required: "Role is required" }}
          render={({ field }) => (
            <Select
              onValueChange={(val) => {
                field.onChange(val);
                setSelectedRole(val);
              }}
              value={field.value}
            >
              <SelectTrigger className="w-full h-10 text-sm rounded-sm border-slate-200 bg-white text-slate-700 focus:ring-1 focus:ring-slate-400 shadow-2xs cursor-pointer">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="rounded-sm border-slate-200 bg-white shadow-lg p-1 z-50">
                {roleType === "Super Admin" && (
                  <>
                    <SelectItem value="Admin" className="text-xs rounded-sm cursor-pointer">Admin</SelectItem>
                    <SelectItem value="Employee" className="text-xs rounded-sm cursor-pointer">Employee</SelectItem>
                    <SelectItem value="Partner" className="text-xs rounded-sm cursor-pointer">Partner</SelectItem>
                    <SelectItem value="Developer" className="text-xs rounded-sm cursor-pointer">Developer</SelectItem>
                    <SelectItem value="Custom" className="text-xs rounded-sm cursor-pointer">Custom</SelectItem>
                    <SelectItem value="Other" className="text-xs rounded-sm cursor-pointer">Other</SelectItem>
                  </>
                )}
                {roleType === "Admin" && (
                  <>
                    <SelectItem value="Employee" className="text-xs rounded-sm cursor-pointer">Employee</SelectItem>
                    <SelectItem value="Partner" className="text-xs rounded-sm cursor-pointer">Partner</SelectItem>
                    <SelectItem value="Developer" className="text-xs rounded-sm cursor-pointer">Developer</SelectItem>
                    <SelectItem value="Custom" className="text-xs rounded-sm cursor-pointer">Custom</SelectItem>
                    <SelectItem value="Other" className="text-xs rounded-sm cursor-pointer">Other</SelectItem>
                  </>
                )}
                {roleType !== "Super Admin" && roleType !== "Admin" && (
                  <>
                    <SelectItem value="Employee" className="text-xs rounded-sm cursor-pointer">Employee</SelectItem>
                    <SelectItem value="Partner" className="text-xs rounded-sm cursor-pointer">Partner</SelectItem>
                    <SelectItem value="Developer" className="text-xs rounded-sm cursor-pointer">Developer</SelectItem>
                    <SelectItem value="Custom" className="text-xs rounded-sm cursor-pointer">Custom</SelectItem>
                    <SelectItem value="Other" className="text-xs rounded-sm cursor-pointer">Other</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          )}
        />
        {errors.role && (
          <p className="text-xs text-rose-500 font-medium mt-1">{errors.role.message}</p>
        )}
      </div>

      {/* Custom Role Input if "Other" selected */}
      {selectedRole === "Other" && (
        <div className="space-y-1.5">
          <Label htmlFor="customRole" className="text-xs font-normal text-slate-700">
            Specify Custom Role
          </Label>
          <Input
            id="customRole"
            value={customRole}
            placeholder="Type your role name"
            onChange={(e) => setCustomRole(e.target.value)}
            className="h-10 text-sm rounded-sm border-slate-200 bg-white placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400 focus-visible:border-slate-400 shadow-2xs"
          />
        </div>
      )}

      {/* Terms Checkbox */}
      <div className="flex items-start gap-2.5 pt-1">
        <Checkbox
          id="checkbox"
          defaultChecked
          className="mt-0.5 rounded-sm data-[state=checked]:bg-[#0f172a] data-[state=checked]:border-[#0f172a]"
        />
        <Label htmlFor="checkbox" className="text-xs text-slate-600 font-normal leading-tight cursor-pointer select-none">
          You accept our Terms and Conditions and Privacy Policy
        </Label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        fullWidth
        disabled={loading}
        className="h-10 rounded-sm font-medium bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-2xs transition-colors cursor-pointer mt-2"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
            <span>Creating Member Account...</span>
          </>
        ) : (
          <span>Create An Account</span>
        )}
      </Button>
    </form>
  );
};

export default RegForm;
