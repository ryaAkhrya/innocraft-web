"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heading focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-buttonBg bg-buttonBg text-white hover:bg-buttonHover",
        secondary: "border-border bg-white text-heading hover:bg-primaryBg/20",
        ghost: "border-transparent bg-transparent text-heading hover:bg-primaryBg/20",
      },
      size: {
        default: "h-11",
        sm: "h-10 px-4",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);

Button.displayName = "Button";

export const PrimaryButton = ({ children, ...props }: ButtonProps) => (
  <Button variant="default" {...props}>
    {children}
  </Button>
);

export const SecondaryButton = ({ children, ...props }: ButtonProps) => (
  <Button variant="secondary" {...props}>
    {children}
  </Button>
);

export { Button, buttonVariants };
