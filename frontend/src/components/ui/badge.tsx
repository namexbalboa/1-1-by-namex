import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "border-0 bg-gradient-to-r from-primary to-accent text-white shadow-md hover:shadow-lg hover:shadow-primary/25 hover:scale-105",
        secondary:
          "border-0 bg-gradient-to-r from-secondary to-secondary/80 text-white shadow-md hover:shadow-lg hover:shadow-secondary/25 hover:scale-105",
        destructive:
          "border-0 bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground shadow-md hover:shadow-lg hover:shadow-destructive/25 hover:scale-105",
        success:
          "border-0 bg-gradient-to-r from-success to-success/80 text-success-foreground shadow-md hover:shadow-lg hover:shadow-success/25 hover:scale-105",
        warning:
          "border-0 bg-gradient-to-r from-warning to-warning/80 text-warning-foreground shadow-md hover:shadow-lg hover:shadow-warning/25 hover:scale-105",
        info:
          "border-0 bg-gradient-to-r from-info to-info/80 text-info-foreground shadow-md hover:shadow-lg hover:shadow-info/25 hover:scale-105",
        outline: "border-2 border-primary/30 bg-background/50 text-foreground backdrop-blur-sm hover:border-primary hover:bg-primary/10 hover:scale-105",
        gradient: "border-0 bg-gradient-to-r from-primary via-accent to-secondary text-white shadow-lg hover:shadow-xl hover:shadow-primary/30 hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
