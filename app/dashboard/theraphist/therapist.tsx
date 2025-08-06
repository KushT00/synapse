"use client"

import Iridescence from '@/components/reactbits/background'
import RotatingText from '@/components/reactbits/textcomp'
import { LiquidButton } from "@/components/reactbits/button";
import { useRouter } from 'next/navigation'

export default function TherapistPage() {
  const router = useRouter()
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Component */}
      <div className="absolute inset-0 z-0">
        <Iridescence 
            color={[1, 1, 1]}
            mouseReact={false}
            amplitude={0.1}
            speed={1.0}
        />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center space-y-8">
          <h1 className="text-6xl font-bold text-black mb-8">
            " Simple <span className="bg-purple-900 bg-clip-text text-transparent">3</span> Steps Process "
          </h1>
          
          <div className="text-8xl font-extrabold">
            <RotatingText
              texts={[
                "EEG recording",
                "Session Monitoring",
                "Report Generation",
               
              ]}
              mainClassName="bg-gradient-to-r from-purple-600 to-black-600 bg-clip-text text-transparent"
              elementLevelClassName="bg-gradient-to-r from-purple-600 to-white-200 bg-clip-text text-transparent"
              rotationInterval={3000}
              staggerDuration={0.05}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 200
              }}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
            />
          </div>
          
          <div className="mt-8">
                        <LiquidButton
              onClick={() => router.push('theraphist/documents')}
              className="text-lg"
            >
              Get Started
            </LiquidButton>
          </div>
        </div>
      </div>
    </div>
  )
}


