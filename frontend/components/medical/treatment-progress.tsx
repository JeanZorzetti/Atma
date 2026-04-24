/**
 * Medical Treatment Progress System - FASE 2 Micro-Interações
 * Animações avançadas para visualização de progresso ortodôntico
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { progressVariants } from '@/lib/motion';
import { useMedicalProgress } from '@/hooks/use-motion';
import {
  Calendar,
  Star,
  CheckCircle,
  Users,
  Phone,
  Mail,
} from 'lucide-react';

interface TreatmentStage {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'upcoming';
  progress: number;
  milestones: string[];
}

interface TreatmentProgressProps {
  stages: TreatmentStage[];
  overallProgress: number;
  startDate: string;
  estimatedEndDate: string;
  currentStage: number;
}

const TreatmentProgress: React.FC<TreatmentProgressProps> = ({
  stages,
  overallProgress,
  startDate,
  estimatedEndDate,
  currentStage,
}) => {
  const { progress, controls, currentStep, goToStep } = useMedicalProgress(stages.length);
  const [selectedStage, setSelectedStage] = useState(currentStage);

  useEffect(() => {
    goToStep(currentStage);
  }, [currentStage, goToStep]);

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'current':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      default:
        return 'text-slate-400 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Overall Progress */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Progresso do Tratamento
            </h2>
            <p className="text-slate-600">
              Iniciado em {startDate} • Previsão: {estimatedEndDate}
            </p>
          </div>
          <motion.div
            className="text-right"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <div className="text-3xl font-bold text-blue-600">
              {overallProgress}%
            </div>
            <div className="text-sm text-slate-500">Concluído</div>
          </motion.div>
        </div>

        {/* Overall Progress Bar */}
        <div className="relative">
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
              variants={progressVariants}
              initial="initial"
              animate="animate"
              style={{ width: `${overallProgress}%` }}
            />
          </div>

          {/* Progress Milestones */}
          <div className="absolute top-0 w-full h-3 flex justify-between items-center">
            {stages.map((_, index) => {
              const isCompleted = index < currentStage;
              const isCurrent = index === currentStage;

              return (
                <motion.div
                  key={index}
                  className={cn(
                    'w-4 h-4 rounded-full border-2 -mt-0.5',
                    isCompleted
                      ? 'bg-green-500 border-green-500'
                      : isCurrent
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-white border-slate-300'
                  )}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  whileHover={{ scale: 1.2 }}
                />
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Treatment Stages */}
      <div className="grid gap-6">
        {stages.map((stage, index) => {
          const isSelected = selectedStage === index;
          const isCompleted = stage.status === 'completed';
          const isCurrent = stage.status === 'current';

          return (
            <motion.div
              key={stage.id}
              className={cn(
                'border rounded-xl p-6 cursor-pointer transition-all duration-300',
                getStageColor(stage.status),
                isSelected && 'ring-2 ring-blue-300 ring-offset-2'
              )}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => setSelectedStage(index)}
              layout
            >
              <div className="flex items-start space-x-4">
                {/* Stage Icon */}
                <motion.div
                  className={cn(
                    'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center',
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-200 text-slate-400'
                  )}
                  animate={{
                    scale: isCurrent ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: isCurrent ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
                >
                  {isCompleted ? <CheckCircle className="h-6 w-6" /> : stage.icon}
                </motion.div>

                {/* Stage Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      {stage.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>{stage.duration}</span>
                    </div>
                  </div>

                  <p className="text-slate-600">{stage.description}</p>

                  {/* Stage Progress */}
                  {(isCurrent || isCompleted) && (
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span>Progresso da etapa</span>
                        <span className="font-semibold">{stage.progress}%</span>
                      </div>

                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                          className={cn(
                            'h-full rounded-full',
                            isCompleted
                              ? 'bg-green-500'
                              : 'bg-gradient-to-r from-blue-400 to-blue-500'
                          )}
                          initial={{ width: '0%' }}
                          animate={{ width: `${stage.progress}%` }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Milestones */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        className="space-y-2 pt-4 border-t border-slate-200"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <h4 className="font-medium text-slate-900">
                          Marcos desta etapa:
                        </h4>
                        <div className="space-y-2">
                          {stage.milestones.map((milestone, milestoneIndex) => (
                            <motion.div
                              key={milestoneIndex}
                              className="flex items-center space-x-2"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: milestoneIndex * 0.1 }}
                            >
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                              <span className="text-sm text-slate-600">
                                {milestone}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Status Indicator */}
                <motion.div
                  className="flex-shrink-0"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {isCompleted && (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  )}
                  {isCurrent && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <Star className="h-6 w-6 text-blue-500" />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Success Celebration */}
      <AnimatePresence>
        {overallProgress === 100 && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: 'spring', duration: 0.6 }}
            >
              <motion.div
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Star className="h-10 w-10 text-green-600" />
              </motion.div>

              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Parabéns! 🎉
              </h3>
              <p className="text-slate-600 mb-6">
                Você completou com sucesso seu tratamento ortodôntico!
              </p>

              {/* Confetti Effect */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-green-400 rounded-full"
                    initial={{
                      x: '50%',
                      y: '50%',
                      opacity: 1,
                    }}
                    animate={{
                      x: `${50 + (Math.random() - 0.5) * 400}%`,
                      y: `${50 + (Math.random() - 0.5) * 400}%`,
                      opacity: 0,
                      rotate: Math.random() * 360,
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Quick Stats Component
const TreatmentStats: React.FC<{
  stats: Array<{
    label: string;
    value: string;
    icon: React.ReactNode;
    trend?: 'up' | 'down';
    color: string;
  }>;
}> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-lg border border-slate-200 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          whileHover={{ y: -2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              {stat.icon}
            </div>
            {stat.trend && (
              <CheckCircle
                className={cn(
                  'h-4 w-4',
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                )}
              />
            )}
          </div>
          <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
          <div className="text-sm text-slate-600">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export { TreatmentProgress, TreatmentStats };