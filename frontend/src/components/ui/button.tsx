import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group [&>*]:relative [&>*]:z-10",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-secondary !text-white shadow-md hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 [&>*]:!text-white hover:!text-white [&_*]:!text-white",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/70 !text-white shadow-md hover:shadow-xl hover:shadow-destructive/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 [&>*]:!text-white hover:!text-white [&_*]:!text-white",
        outline:
          "bg-gradient-to-r from-primary to-secondary !text-white shadow-md hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 [&>*]:!text-white hover:!text-white [&_*]:!text-white",
        secondary:
          "bg-gradient-to-r from-secondary to-primary !text-white shadow-md hover:shadow-xl hover:shadow-secondary/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 [&>*]:!text-white hover:!text-white [&_*]:!text-white",
        ghost: "bg-muted text-muted-foreground hover:bg-muted/80 transition-all duration-200",
        link: "text-primary underline-offset-4 hover:underline transition-colors",
        success: "bg-gradient-to-r from-success to-success/70 !text-white shadow-md hover:shadow-xl hover:shadow-success/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 [&>*]:!text-white hover:!text-white [&_*]:!text-white",
        gradient: "bg-gradient-to-r from-primary to-secondary !text-white shadow-lg hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 [&>*]:!text-white hover:!text-white [&_*]:!text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
