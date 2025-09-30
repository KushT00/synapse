"use client"

import * as React from "react"

type Theme = "light" | "dark" | "colorblind"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(
  undefined
)

export function ThemeProvider({
  children,
  defaultTheme = "light",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)

  React.useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("theme") as Theme | null
    if (savedTheme) {
      setThemeState(savedTheme)
      applyTheme(savedTheme)
    } else {
      applyTheme(defaultTheme)
    }
  }, [defaultTheme])

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark", "colorblind")
    if (newTheme !== "light") {
      root.classList.add(newTheme)
    }
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
