"use client"

import * as React from "react"
import { Sun, Moon, Eye, Palette } from "lucide-react"
import { useTheme } from "./theme-provider"

export function FloatingThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="fixed top-20 right-5 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center hover:scale-110 transition-transform"
        title="Change Theme"
      >
        <Palette className="w-5 h-5 text-slate-700 dark:text-slate-200" />
      </button>

      {/* Theme Options */}
      {isOpen && (
        <div className="absolute top-14 right-0 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-200 dark:border-slate-700 p-2 min-w-[160px]">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => {
                setTheme("light")
                setIsOpen(false)
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                theme === "light" ? "bg-slate-100 dark:bg-slate-700" : ""
              }`}
            >
              <Sun className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Light</span>
            </button>
            
            <button
              onClick={() => {
                setTheme("dark")
                setIsOpen(false)
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                theme === "dark" ? "bg-slate-100 dark:bg-slate-700" : ""
              }`}
            >
              <Moon className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Dark</span>
            </button>
            
            <button
              onClick={() => {
                setTheme("colorblind")
                setIsOpen(false)
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                theme === "colorblind" ? "bg-slate-100 dark:bg-slate-700" : ""
              }`}
            >
              <Eye className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Colorblind</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
