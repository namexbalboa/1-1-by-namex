import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border-2 border-border bg-card/50 px-3 py-2 text-base backdrop-blur-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 md:text-sm hover:shadow-md hover:shadow-primary/5 resize-none",
        className
      )}
      style={{
        boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = '0 0 0 2px hsl(var(--primary) / 0.2), 0 4px 12px rgba(91, 127, 255, 0.15), inset 0 1px 2px rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.background = 'linear-gradient(to bottom, hsl(var(--card)), hsl(var(--muted) / 0.3))';
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.background = '';
      }}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
