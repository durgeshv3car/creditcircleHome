import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { InputColor } from "@/lib/type";

export const inputVariants = cva(
  "w-full bg-white rounded-sm py-2 px-3.5 h-10 border text-sm font-normal border-slate-200 text-slate-800 outline-none focus:outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium read-only:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm",
  {
    variants: {
      color: {
        default:
          "border-slate-200 text-slate-800 focus:outline-none focus:border-[#FF6B4A] focus:ring-2 focus:ring-[#FF6B4A]/20 placeholder:text-slate-400",
        primary:
          "border-primary/50 text-primary focus:border-primary disabled:bg-primary/30 disabled:placeholder:text-primary  placeholder:text-primary/70",
        secondary:
          "border-default-300 text-default-700  focus:border-secondary  disabled:bg-secondary/30 disabled:placeholder:text-secondary  placeholder:text-default-600",
        info: "border-info/50 text-info focus:border-info  disabled:bg-info/30 disabled:placeholder:text-info  placeholder:text-info/70",
        warning:
          "border-warning/50 text-warning  focus:border-warning disabled:bg-warning/30 disabled:placeholder:text-info  placeholder:text-warning/70",
        success:
          "border-success/50 text-success focus:border-success   disabled:bg-success/30 disabled:placeholder:text-info  placeholder:text-success/70",
        destructive:
          "border-destructive/50 text-destructive focus:border-destructive  disabled:bg-destructive/30 disabled:placeholder:text-destructive  placeholder:text-destructive/70",
      },

      size: {
        sm: "h-8 text-xs read-only:leading-8",
        default: "h-9 text-xs read-only:leading-none",
        md: "h-10 text-sm read-only:leading-10",
        lg: "h-12  text-sm read-only:leading-[48px]",
      },
    },

    defaultVariants: {
      color: "default",
      size: "default",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
  VariantProps<typeof inputVariants> {
  color?: InputColor
  size?: any
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      size,
      color,
      ...props
    },
    ref
  ) =>
    <div className="flex-1 w-full">
      <input
        type={type}
        className={cn(
          inputVariants({ color, size }),
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
);
Input.displayName = "Input";

export { Input };
