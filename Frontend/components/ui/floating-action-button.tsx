"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Star, CheckCircle, Calendar } from "lucide-react"
import { AnimatedButton } from "./animated-button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface FloatingAction {
  icon: React.ReactNode
  label: string
  action: () => void
  color?: string
}

interface FloatingActionButtonProps {
  actions?: FloatingAction[]
  className?: string
  position?: "bottom-right" | "bottom-left" | "bottom-center"
}

export function FloatingActionButton({
  actions,
  className,
  position = "bottom-right"
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const defaultActions: FloatingAction[] = [
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Ligar",
      action: () => typeof window !== 'undefined' && window.open("tel:+551199999999"),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: <Star className="h-5 w-5" />,
      label: "WhatsApp",
      action: () => typeof window !== 'undefined' && window.open("https://wa.me/5511999999999"),
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Agendar",
      action: () => router.push("/contato"),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Localização",
      action: () => router.push("/pacientes/encontre-doutor"),
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ]

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2"
  }

  return (
    <div className={cn(
      "fixed z-50",
      positionClasses[position],
      className
    )}>
      {/* Action Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 flex flex-col space-y-3"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2, staggerChildren: 0.1 }}
          >
            {(actions || defaultActions).map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center space-x-3"
              >
                {/* Action Label */}
                <motion.div
                  className="bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                >
                  {action.label}
                </motion.div>

                {/* Action Button */}
                <motion.button
                  className={cn(
                    "w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white",
                    action.color || "bg-blue-500 hover:bg-blue-600"
                  )}
                  onClick={() => {
                    action.action()
                    setIsOpen(false)
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  {action.icon}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button - Positioned for one-handed use */}
      <motion.button
        className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white touch-target-large"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
        aria-label={isOpen ? "Fechar menu de ações" : "Abrir menu de ações"}
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CheckCircle className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="plus"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Star className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Backdrop for closing when tapping outside */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Quick contact FAB for mobile optimization
export function QuickContactFAB() {
  const quickActions: FloatingAction[] = [
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Ligar Agora",
      action: () => typeof window !== 'undefined' && window.open("tel:+551199999999"),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: <Star className="h-5 w-5" />,
      label: "WhatsApp",
      action: () => typeof window !== 'undefined' && window.open("https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre os alinhadores Atma."),
      color: "bg-green-600 hover:bg-green-700"
    }
  ]

  return (
    <FloatingActionButton
      actions={quickActions}
      className="md:hidden" // Only show on mobile
    />
  )
}