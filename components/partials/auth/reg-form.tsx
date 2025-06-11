"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import axios from "axios";
import { createUser } from "@/app/(protected)/services/adminUsers/api";


type Inputs = {
  name: string;
  email: string;
  password: string;
  role: string;
};

const RegForm = ({ roleType }: { roleType: string }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [customRole, setCustomRole] = useState("");
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
      const response = await createUser(data);

      if (response.data.user?.id) {
        toast.success("User created successfully");
        toggleDialog()
        router.push(`/permissions?id=${response.data.user?.id}`);
      }
    } catch (error: any) {
      toast.error("User not created")
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          {...register("name", {
            required: "name is required",
            minLength: {
              value: 4,
              message: "name must be at least 4 characters",
            },
          })}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="you@example.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Invalid email format",
            },
          })}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Your password"
          {...register("password", {
            required: "Password is required",
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
              message:
                "Password must be at least 8 characters, include upper & lowercase, number, and special character",
            },
          })}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Role Select */}
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
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
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {roleType === "Super Admin" && (
                  <>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Employee">Employee</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </>
                )}
                {roleType === "Admin" && (
                  <>
                    <SelectItem value="Employee">Employee</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </>
                )}
                {(roleType !== "Super Admin" && roleType !== "Admin") && (
                  <>
                    <SelectItem value="Employee">Employee</SelectItem>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          )}
        />
        {errors.role && (
          <p className="text-sm text-red-500">{errors.role.message}</p>
        )}
      </div>

      {/* Custom Role Input if "Other" selected */}
      {selectedRole === "Other" && (
        <div className="space-y-2">
          <Label htmlFor="customRole">Custom Role</Label>
          <Input
            id="customRole"
            value={customRole}
            placeholder="Type your role"
            onChange={(e) => setCustomRole(e.target.value)}
          />
        </div>
      )}

      {/* Terms Checkbox */}
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox" defaultChecked />
        <Label htmlFor="checkbox">
          You accept our Terms and Conditions and Privacy Policy
        </Label>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create An Account"}
      </Button>
    </form>

    </>
  );
};

export default RegForm;
