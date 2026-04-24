"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface TickerTapeProps {
  messages: string[]
  speed?: number
  className?: string
}

export function TickerTape({ messages, speed = 30, className = "" }: TickerTapeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length)
    }, 5000) // Troca mensagem a cada 5 segundos

    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <div className={`w-full overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 py-3 ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center text-white font-medium text-sm md:text-base"
        >
          {messages[currentIndex]}
        </motion.div>
      </div>
    </div>
  )
}
