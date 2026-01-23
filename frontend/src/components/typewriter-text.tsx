import { useState, useEffect } from "react"

interface TypewriterTextProps {
  text: string
  speed?: number // milliseconds per word
  onComplete?: () => void
  className?: string
}

export function TypewriterText({ 
  text, 
  speed = 30, 
  onComplete,
  className = ""
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!text) {
      setDisplayedText("")
      setIsComplete(true)
      return
    }

    // Reset when text changes
    setDisplayedText("")
    setIsComplete(false)

    const words = text.split(" ")
    let currentIndex = 0

    const interval = setInterval(() => {
      currentIndex++
      setDisplayedText(words.slice(0, currentIndex).join(" "))

      if (currentIndex >= words.length) {
        clearInterval(interval)
        setIsComplete(true)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && (
        <span className="inline-block w-2 h-4 ml-1 bg-primary/50 animate-pulse" />
      )}
    </span>
  )
}
