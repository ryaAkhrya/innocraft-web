"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-2xl px-8 py-4 text-[15px] font-bold transition-all duration-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-peach/50 focus-visible:ring-offset-2 [&_svg]:transition-transform [&_svg]:duration-400 group relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "border border-transparent bg-coral text-white shadow-color-peach hover:bg-[#ff7165] hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:shadow-md [&_svg]:hover:translate-x-1",
        secondary: "border-2 border-softBlue bg-white text-heading shadow-soft hover:border-skyBlue hover:bg-softBlue/20 hover:shadow-soft-lg hover:-translate-y-1 active:translate-y-0 active:shadow-soft-sm [&_svg]:hover:translate-x-1",
        ghost: "border-2 border-transparent bg-transparent text-heading hover:bg-softBlue/40 hover:text-heading active:bg-softBlue/60 [&_svg]:hover:translate-x-1",
        navy: "border border-transparent bg-heading text-white shadow-soft hover:bg-heading/80 hover:shadow-soft-lg hover:-translate-y-1 active:translate-y-0 active:shadow-soft-sm [&_svg]:hover:translate-x-1",
      },
      size: {
        default: "h-14",
        sm: "h-11 px-5 text-sm",
        lg: "h-16 px-10 text-base",
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
