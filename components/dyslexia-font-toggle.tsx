"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function DyslexiaFontToggle() {
  const [isDyslexiaFontEnabled, setIsDyslexiaFontEnabled] = React.useState(false);

  React.useEffect(() => {
    // Load saved preference from localStorage
    const saved = localStorage.getItem("dyslexia-font-enabled");
    if (saved !== null) {
      setIsDyslexiaFontEnabled(JSON.parse(saved));
    }
  }, []);

  const toggleDyslexiaFont = (enabled: boolean) => {
    setIsDyslexiaFontEnabled(enabled);
    localStorage.setItem("dyslexia-font-enabled", JSON.stringify(enabled));
    
    // Apply or remove dyslexia font class to body
    if (enabled) {
      document.body.classList.add("dyslexia-font");
    } else {
      document.body.classList.remove("dyslexia-font");
    }
  };

  // Apply initial state on mount
  React.useEffect(() => {
    if (isDyslexiaFontEnabled) {
      document.body.classList.add("dyslexia-font");
    }
  }, [isDyslexiaFontEnabled]);

  return (
    <div className="flex items-center space-x-2 px-3 py-2">
      <Switch
        id="dyslexia-font"
        checked={isDyslexiaFontEnabled}
        onCheckedChange={toggleDyslexiaFont}
      />
      <Label htmlFor="dyslexia-font" className="text-sm font-medium">
        <div className="flex items-center space-x-2">
          {isDyslexiaFontEnabled ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
          <span>Dyslexia Font</span>
        </div>
      </Label>
    </div>
  );
} 