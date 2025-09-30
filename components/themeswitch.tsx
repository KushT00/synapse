"use client"

import * as React from "react"
import { Sun, Moon, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./theme-provider"

export function ThemeSwitcher() {
  const { setTheme } = useTheme()

  return (
    <div className="flex items-center justify-center gap-2 px-2 py-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setTheme("light")}
        title="Light Theme"
      >
        <Sun className="h-5 w-5" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setTheme("dark")}
        title="Dark Theme"
      >
        <Moon className="h-5 w-5" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setTheme("colorblind")}
        title="Colorblind Theme"
      >
        <Eye className="h-5 w-5" />
      </Button>
    </div>
  )
}