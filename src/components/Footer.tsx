import { cn } from "@/lib/utils"
import type React from "react"

export function Footer({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t", className)}>
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <p className="text-sm text-muted-foreground">Ouckah LLC © {new Date().getFullYear()}</p>
          </nav>
        </div>
      </div>
    </footer>
  )
}

