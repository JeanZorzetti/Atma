"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "./button"
import Image from "next/image"

interface Step {
  number: number
  title: string
  description: string
  image: string
  imageAlt: string
  link?: string
}

interface StepCarouselProps {
  steps: Step[]
  className?: string
}

export function StepCarousel({ steps, className = "" }: StepCarouselProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length)
  }

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length)
  }

  const goToStep = (index: number) => {
    setCurrentStep(index)
  }

  const step = steps[currentStep]

  return (
    <div className={`w-full ${className}`}>
      {/* Progress indicators */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {steps.map((s, index) => (
          <button
            key={index}
            onClick={() => goToStep(index)}
            className="flex items-center gap-3 group"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                index === currentStep
                  ? "bg-blue-600 text-white scale-110 shadow-lg"
                  : index < currentStep
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {s.number}
            </div>
            <span
              className={`hidden md:inline-block text-sm font-medium transition-colors ${
                index === currentStep ? "text-blue-600" : "text-gray-400"
              }`}
            >
              {s.title}
            </span>
            {index < steps.length - 1 && (
              <div className="hidden md:block w-8 h-0.5 bg-gray-200" />
            )}
          </button>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="grid md:grid-cols-2 gap-8 items-center"
        >
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src={step.image}
              alt={step.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium">
              PASSO {step.number}
            </div>
            <h3 className="text-3xl font-heading font-bold text-gray-900">
              {step.title}
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              {step.description}
            </p>
            {step.link && (
              <Button
                variant="link"
                className="text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold group"
                onClick={() => window.location.href = step.link}
              >
                Saiba mais
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={prevStep}
          className="rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? "bg-blue-600 w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={nextStep}
          className="rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
