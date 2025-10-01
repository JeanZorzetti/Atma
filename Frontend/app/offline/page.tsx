"use client"

import { motion } from "framer-motion"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Star, CheckCircle, Calendar, Phone } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OfflinePage() {
  const router = useRouter()

  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Offline Icon Animation */}
        <motion.div
          className="relative mb-8"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Star className="h-12 w-12 text-white" />
          </div>

          {/* Pulse effect */}
          <motion.div
            className="absolute inset-0 bg-slate-400/30 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl font-bold text-slate-900 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Você está offline
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-slate-600 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Sem problemas! Algumas funcionalidades da Atma Aligner ainda estão disponíveis offline.
          Conecte-se à internet para acessar todo o conteúdo.
        </motion.p>

        {/* Available Offline Features */}
        <motion.div
          className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            Disponível offline:
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 text-left">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
              Página inicial navegável
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
              Informações sobre tratamentos
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
              Dados de contato
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
              Formulários (enviados quando conectar)
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <AnimatedButton
            onClick={handleRetry}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
            icon={<Calendar className="h-5 w-5" />}
          >
            Tentar Novamente
          </AnimatedButton>

          <AnimatedButton
            onClick={handleGoHome}
            variant="outline"
            className="w-full"
            size="lg"
            icon={<Star className="h-5 w-5" />}
          >
            Ir para Página Inicial
          </AnimatedButton>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-2 text-blue-800">
            <Phone className="h-4 w-4" />
            <span className="text-sm font-medium">
              Urgência? Ligue: <a href="tel:+551199999999" className="underline">(11) 9999-9999</a>
            </span>
          </div>
        </motion.div>

        {/* Network Status Indicator */}
        <motion.div
          className="mt-6 flex items-center justify-center space-x-2 text-xs text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span>Aguardando conexão com a internet...</span>
        </motion.div>
      </motion.div>
    </div>
  )
}