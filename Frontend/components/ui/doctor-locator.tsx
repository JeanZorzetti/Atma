"use client"

import { useState } from "react"
import { MapPin, Search } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { motion } from "framer-motion"

interface DoctorLocatorProps {
  className?: string
  onSearch?: (cep: string, age: string) => void
}

export function DoctorLocator({ className = "", onSearch }: DoctorLocatorProps) {
  const [cep, setCep] = useState("")
  const [ageGroup, setAgeGroup] = useState("")

  const handleSearch = () => {
    if (onSearch) {
      onSearch(cep, ageGroup)
    } else {
      // Redirect to find doctor page with params
      const params = new URLSearchParams()
      if (cep) params.set("cep", cep)
      if (ageGroup) params.set("age", ageGroup)
      window.location.href = `/pacientes/encontre-doutor?${params.toString()}`
    }
  }

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 5) {
      return numbers
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value)
    setCep(formatted)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-2xl p-8 md:p-10 shadow-xl ${className}`}
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
          <MapPin className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">
          Encontre um ortodontista Atma
        </h2>
        <p className="text-gray-600 text-lg">
          Mais de <span className="font-bold text-blue-600">500 profissionais</span> em todo o Brasil
        </p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        {/* CEP Input */}
        <div className="space-y-2">
          <label htmlFor="cep" className="block text-sm font-medium text-gray-700 uppercase tracking-wide">
            📍 CEP ou Cidade
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="cep"
              type="text"
              placeholder="Digite seu CEP..."
              value={cep}
              onChange={handleCEPChange}
              maxLength={9}
              className="pl-10 h-14 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Age Group Select */}
        <div className="space-y-2">
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 uppercase tracking-wide">
            👤 Idade do paciente
          </label>
          <Select value={ageGroup} onValueChange={setAgeGroup}>
            <SelectTrigger id="age" className="h-14 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Selecione a faixa etária" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="criancas">Até 12 anos (Crianças)</SelectItem>
              <SelectItem value="adolescentes">13 a 17 anos (Adolescentes)</SelectItem>
              <SelectItem value="adultos">18 anos ou mais (Adultos)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={!cep}
          className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all"
        >
          <Search className="mr-2 h-5 w-5" />
          Encontrar ortodontista
        </Button>

        <p className="text-center text-sm text-gray-500 pt-2">
          ✨ Consulta de avaliação inicial <strong>gratuita</strong>
        </p>
      </div>
    </motion.div>
  )
}
