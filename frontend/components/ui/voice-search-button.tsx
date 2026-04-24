"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Volume2, AlertCircle } from "lucide-react"
import { Button } from "./button"
import { useVoiceMedicalSearch } from "@/hooks/use-voice-search"
import { cn } from "@/lib/utils"

interface VoiceSearchButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost" | "fab"
  size?: "sm" | "md" | "lg"
  showTranscript?: boolean
}

export function VoiceSearchButton({
  className,
  variant = "outline",
  size = "md",
  showTranscript = true
}: VoiceSearchButtonProps) {
  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    confidence,
    error,
    toggleListening,
    clearTranscript,
    getAvailableCommands
  } = useVoiceMedicalSearch()

  if (!isSupported) {
    return null // Hide if not supported
  }

  const commands = getAvailableCommands()

  const getButtonContent = () => {
    if (isListening) {
      return (
        <>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Mic className="h-4 w-4" />
          </motion.div>
          <span className="ml-2">Ouvindo...</span>
        </>
      )
    }

    return (
      <>
        <MicOff className="h-4 w-4" />
        <span className="ml-2">Pesquisa por Voz</span>
      </>
    )
  }

  if (variant === "fab") {
    return (
      <div className="fixed bottom-24 right-6 z-40 md:hidden">
        <motion.button
          className={cn(
            "w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white touch-target-large",
            isListening
              ? "bg-red-500 hover:bg-red-600"
              : "bg-purple-500 hover:bg-purple-600",
            className
          )}
          onClick={toggleListening}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          aria-label={isListening ? "Parar pesquisa por voz" : "Iniciar pesquisa por voz"}
        >
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="listening"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <Mic className="h-6 w-6" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Volume2 className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Transcript Popup */}
        <AnimatePresence>
          {(transcript || interimTranscript || error) && (
            <motion.div
              className="absolute bottom-16 right-0 mb-2 w-64 p-3 bg-white rounded-lg shadow-xl border"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {error ? (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {transcript && (
                    <div className="text-sm text-slate-900 font-medium">
                      {transcript}
                    </div>
                  )}
                  {interimTranscript && (
                    <div className="text-sm text-slate-500 italic">
                      {interimTranscript}
                    </div>
                  )}
                  {confidence > 0 && (
                    <div className="text-xs text-slate-400">
                      Confiança: {Math.round(confidence * 100)}%
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Command Hints */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              className="absolute bottom-16 right-16 w-56 p-3 bg-slate-900 text-white rounded-lg shadow-xl text-xs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: 1, duration: 0.3 }}
            >
              <div className="font-medium mb-2">Comandos disponíveis:</div>
              <div className="space-y-1">
                {commands.slice(0, 4).map((command, index) => (
                  <div key={index} className="opacity-80">
                    "{command.patterns[0]}"
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Button
        variant={variant as any}
        size={size as any}
        onClick={toggleListening}
        className={cn(
          "transition-all duration-200",
          isListening && "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
          className
        )}
        disabled={!isSupported}
      >
        {getButtonContent()}
      </Button>

      {/* Transcript Display */}
      {showTranscript && (
        <AnimatePresence>
          {(transcript || interimTranscript || error) && (
            <motion.div
              className="p-4 rounded-lg border bg-slate-50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error ? (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {transcript && (
                    <div>
                      <div className="text-sm font-medium text-slate-700 mb-1">
                        Resultado:
                      </div>
                      <div className="text-slate-900 font-medium">
                        {transcript}
                      </div>
                    </div>
                  )}

                  {interimTranscript && (
                    <div>
                      <div className="text-sm font-medium text-slate-700 mb-1">
                        Ouvindo:
                      </div>
                      <div className="text-slate-600 italic">
                        {interimTranscript}
                      </div>
                    </div>
                  )}

                  {confidence > 0 && (
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Confiança: {Math.round(confidence * 100)}%</span>
                      <button
                        onClick={clearTranscript}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Limpar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Available Commands Help */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            className="p-4 rounded-lg bg-blue-50 border border-blue-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <div className="text-sm font-medium text-blue-900 mb-2">
              Comandos que você pode usar:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-700">
              {commands.map((command, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-blue-500 rounded-full" />
                  <span>"{command.patterns[0]}"</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Simplified voice search for mobile headers
export function VoiceSearchIcon({ className }: { className?: string }) {
  const { isSupported, isListening, toggleListening } = useVoiceMedicalSearch()

  if (!isSupported) return null

  return (
    <motion.button
      className={cn(
        "p-2 rounded-full hover:bg-slate-100 transition-colors touch-target",
        isListening && "bg-red-50 text-red-600",
        className
      )}
      onClick={toggleListening}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Pesquisa por voz"
    >
      {isListening ? (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Mic className="h-5 w-5" />
        </motion.div>
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
    </motion.button>
  )
}