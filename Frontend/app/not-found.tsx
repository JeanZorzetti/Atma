"use client"

import { motion } from "framer-motion"
import { Star, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 404 Animation */}
        <motion.div
          className="mb-8"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <h1 className="text-9xl font-bold text-slate-300 mb-4">404</h1>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="text-3xl font-bold text-slate-900 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Página não encontrada
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-slate-600 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          A página que você está procurando não existe ou foi movida.
          Que tal explorar nossos tratamentos de ortodontia digital?
        </motion.p>

        {/* Quick Links */}
        <motion.div
          className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
            Links populares:
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 text-left">
            <li>
              <Link href="/pacientes" className="hover:text-blue-600 transition-colors">
                → Para Pacientes - Conheça nossos alinhadores
              </Link>
            </li>
            <li>
              <Link href="/pacientes/encontre-doutor" className="hover:text-blue-600 transition-colors">
                → Encontre um Ortodontista
              </Link>
            </li>
            <li>
              <Link href="/pacientes/precos" className="hover:text-blue-600 transition-colors">
                → Preços e Financiamento
              </Link>
            </li>
            <li>
              <Link href="/ortodontistas/seja-parceiro" className="hover:text-blue-600 transition-colors">
                → Seja um Parceiro Atma
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            className="flex items-center px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.history.back()
              }
            }}
          >
            <Star className="h-4 w-4 mr-2" />
            Voltar
          </button>

          <Link
            href="/"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Star className="h-4 w-4 mr-2" />
            Página Inicial
          </Link>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-sm text-blue-800">
            <p className="mb-2">Precisa de ajuda?</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <a
                href="tel:+551199999999"
                className="hover:underline font-medium"
              >
                📞 (11) 9999-9999
              </a>
              <a
                href="https://wa.me/5511999999999"
                className="hover:underline font-medium"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}