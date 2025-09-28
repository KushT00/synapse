"use client"
import React, { useMemo, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function WatchContent() {
  const params = useSearchParams()
  const src = params.get('src') || ''
  const title = params.get('title') || 'Video'
  const poster = params.get('poster') || ''
  const [playError, setPlayError] = useState<string | null>(null)

  // Derive a potential WebM fallback alongside the MP4 source
  const webmSrc = useMemo(() => {
    if (!src) return ''
    try {
      const url = new URL(src, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
      return url.pathname.replace(/\.[^.]+$/, '.webm')
    } catch {
      // If relative path, simple replacement
      return src.replace(/\.[^.]+$/, '.webm')
    }
  }, [src])

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-xl font-semibold mb-3 text-gray-800">{title}</h1>
        <div className="rounded-lg overflow-hidden shadow">
          <div className="bg-black">
            <video
              controls
              playsInline
              preload="metadata"
              poster={poster || undefined}
              className="w-full h-full"
              style={{ aspectRatio: '16 / 9' }}
              onError={() => setPlayError('This browser cannot decode the video track. Please try another browser or a different format (H.264/MP4 or WebM).')}
            >
              {src && <source src={src} type="video/mp4" />}
              {webmSrc && <source src={webmSrc} type="video/webm" />}
            </video>
          </div>
        </div>
        {playError && (
          <p className="mt-3 text-sm text-red-600">{playError}</p>
        )}
      </div>
    </div>
  )
}

export default function WatchPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-3"></div>
          <div className="bg-gray-200 rounded-lg aspect-video"></div>
        </div>
      </div>
    </div>}>
      <WatchContent />
    </Suspense>
  )
}
