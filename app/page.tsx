import { HeroSection } from "@/components/Herosection/component"
import React from 'react'; // Import React for JSX

// Define the height of the navbar for spacing

export default function Page() {
  return (
    <main className="bg-black relative h-screen w-screen">
      <HeroSection />
    </main>
  );
}
