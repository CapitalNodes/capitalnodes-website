import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-sm",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-indigo-100/80 text-indigo-700 shadow-sm hover:bg-indigo-200/80 hover:shadow-md",
        secondary:
          "border-transparent bg-gray-100/80 text-gray-700 shadow-sm hover:bg-gray-200/80",
        destructive:
          "border-transparent bg-red-100/80 text-red-700 shadow-sm hover:bg-red-200/80",
        outline: "border-indigo-200 text-indigo-600 bg-white/60 hover:bg-indigo-50/80 hover:border-indigo-300",
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
