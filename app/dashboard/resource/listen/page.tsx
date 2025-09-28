"use client"
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Play, Pause, Volume2, Download, SkipBack, SkipForward } from 'lucide-react'

export default function ListenPage() {
  const params = useSearchParams()
  const src = params.get('src') || ''
  const title = params.get('title') || 'Audio'
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  const handlePlayPause = () => {
    const audio = document.getElementById('audio-player') as HTMLAudioElement
    if (audio) {
      if (isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    const audio = document.getElementById('audio-player') as HTMLAudioElement
    if (audio) {
      setCurrentTime(audio.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    const audio = document.getElementById('audio-player') as HTMLAudioElement
    if (audio) {
      setDuration(audio.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = document.getElementById('audio-player') as HTMLAudioElement
    if (audio) {
      const newTime = parseFloat(e.target.value)
      audio.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleSkipBackward = () => {
    const audio = document.getElementById('audio-player') as HTMLAudioElement
    if (audio) {
      const newTime = Math.max(0, audio.currentTime - 10)
      audio.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleSkipForward = () => {
    const audio = document.getElementById('audio-player') as HTMLAudioElement
    if (audio) {
      // Use audio.duration if duration state is not set yet
      const audioDuration = audio.duration || duration
      if (audioDuration > 0) {
        const newTime = Math.min(audioDuration, audio.currentTime + 10)
        audio.currentTime = newTime
        setCurrentTime(newTime)
      }
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = document.getElementById('audio-player') as HTMLAudioElement
    const newVolume = parseFloat(e.target.value)
    if (audio) {
      audio.volume = newVolume
    }
    setVolume(newVolume)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center p-4">
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
        }
        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
        }
      `}</style>
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800 text-center">{title}</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Volume2 className="w-16 h-16 text-white" />
            </div>
          </div>

          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  onInput={handleSeek}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${duration > 0 ? (currentTime / duration) * 100 : 0}%, #e5e7eb ${duration > 0 ? (currentTime / duration) * 100 : 0}%, #e5e7eb 100%)`
                  }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleSkipBackward}
                className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors"
                title="Skip backward 10s"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              <button
                onClick={handlePlayPause}
                className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>

              <button
                onClick={handleSkipForward}
                className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-colors"
                title="Skip forward 10s"
              >
                <SkipForward className="w-6 h-6" />
              </button>
              
              <div className="flex items-center space-x-2 ml-4">
                <Volume2 className="w-5 h-5 text-gray-600" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <a
                href={src}
                download
                className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
              >
                <Download className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Hidden audio element */}
          <audio
            id="audio-player"
            src={src}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      </div>
    </div>
  )
}
