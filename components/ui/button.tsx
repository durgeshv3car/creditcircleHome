import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { color, shadow, rounded } from "@/lib/type"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center px-4 md:px-5 whitespace-nowrap rounded-sm text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B4A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      color: {
        default: "bg-[#0B1740] text-white hover:bg-[#15235A] shadow-sm",
        primary: "bg-gradient-to-r from-[#FF6B4A] to-[#F48220] text-white hover:from-[#E65A38] hover:to-[#D9532F] shadow-md shadow-orange-500/25",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm shadow-red-500/20",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-sm",
        info: "bg-info text-info-foreground hover:bg-info/90 shadow-sm shadow-blue-500/20",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-sm shadow-emerald-500/20",
      },
      variant: {
        default: "",
        outline: "border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-sm",
        soft: "text-primary bg-primary/10 hover:bg-primary/20",
        ghost: "text-slate-700 bg-transparent hover:bg-slate-100 hover:text-slate-900",
        shadow: "shadow-md",
        sidebar: "bg-transparent text-slate-300 hover:bg-white/[0.08] hover:text-white"
      },
      shadow: {
        sm: "shadow",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
      },
      rounded: {
        sm: "rounded",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
      },
      fullWidth: {
        true: "w-full",
      },
      size: {
        default: "h-11 md:px-6  px-4 ",
        sm: "h-7 text-xs md:px-4  px-3",
        md: "h-9",
        lg: "h-12  px-8 text-base md:px-10 px-7",
        icon: "h-10 w-10 p-0 md:px-0 flex justify-center items-center",

      }
    },
    compoundVariants: [
      {
        variant: "outline",
        color: "primary",
        className: "text-primary border-primary hover:text-primary-foreground hover:border-primary hover:bg-primary",
      },
      {
        variant: "outline",
        color: "secondary",
        className: "border-secondary hover:bg-secondary hover:text-secondary-foreground ",
      },
      {
        variant: "outline",
        color: "success",
        className:
          "text-success border-success hover:text-success-foreground hover:border-success hover:bg-success",
      },
      {
        variant: "outline",
        color: "info",
        className:
          "text-info border-info hover:text-info-foreground hover:border-info hover:bg-info",
      },
      {
        variant: "outline",
        color: "warning",
        className:
          "text-warning border-warning hover:text-warning-foreground hover:border-warning hover:bg-warning",
      },
      {
        variant: "outline",
        color: "destructive",
        className: "text-destructive  border-destructive hover:text-destructive-foreground hover:border-destructive hover:bg-destructive",
      },
      {
        variant: "outline",
        color: "info",
        className: "text-info hover:text-info-foreground hover:border-info hover:bg-info",
      },
      {
        variant: "soft",
        color: "primary",
        className: "text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground"
      },
      {
        variant: "soft",
        color: "secondary",
        className: "bg-secondary/90 hover:bg-secondary/80 hover:text-secondary-foreground"
      },
      {
        variant: "soft",
        color: "success",
        className: "text-success bg-success/10 hover:bg-success hover:text-success-foreground"
      },
      {
        variant: "soft",
        color: "info",
        className: "text-info bg-info/10 hover:bg-info hover:text-info-foreground"
      },
      {
        variant: "soft",
        color: "warning",
        className: "text-warning bg-warning/10 hover:bg-warning hover:text-warning-foreground"
      },
      {
        variant: "soft",
        color: "destructive",
        className: "text-destructive bg-destructive/10 hover:bg-destructive hover:text-destructive-foreground"
      },
      {
        variant: "ghost",
        color: "primary",
        className: "text-primary hover:bg-primary hover:text-primary-foreground ",
      },
      {
        variant: "ghost",
        color: "secondary",
        className: "hover:text-secondary-foreground hover:bg-secondary  text-secondary-foreground",
      },
      {
        variant: "ghost",
        color: "success",
        className: "text-success hover:text-success-foreground hover:bg-success",
      },
      {
        variant: "ghost",
        color: "info",
        className: "text-info hover:text-info-foreground hover:bg-info",
      },
      {
        variant: "ghost",
        color: "warning",
        className: "text-warning hover:text-warning-foreground hover:bg-warning",
      },

      {
        variant: "ghost",
        color: "destructive",
        className: "text-destructive hover:text-destructive-foreground hover:bg-destructive",
      }
    ],
    defaultVariants: {
      variant: "default",
      color: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  color?: color
  shadow?: shadow
  rounded?: rounded
  fullWidth?: boolean
  size?: "default" | "sm" | "md" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, color, fullWidth, shadow, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, rounded, color, shadow, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
