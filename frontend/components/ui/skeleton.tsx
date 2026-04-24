/**
 * Skeleton Loading System - Micro-Interações FASE 2
 * Sistema inteligente de loading states com animações médicas
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { skeletonVariants } from '@/lib/motion';
import { useSkeletonLoader } from '@/hooks/use-motion';

interface SkeletonProps {
  className?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
  variant?: 'pulse' | 'shimmer' | 'wave';
}

const Skeleton = ({
  className,
  isLoading = true,
  children,
  variant = 'shimmer',
  ...props
}: SkeletonProps) => {
  const controls = useSkeletonLoader(isLoading);

  if (!isLoading && children) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    );
  }

  const skeletonClass = cn(
    'relative overflow-hidden rounded-md bg-slate-100',
    {
      'animate-pulse': variant === 'pulse',
      'bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-[shimmer_2s_infinite]': variant === 'shimmer',
    },
    className
  );

  return (
    <motion.div
      className={skeletonClass}
      variants={skeletonVariants}
      animate={controls}
      {...props}
    >
      {variant === 'wave' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </motion.div>
  );
};

// Skeleton especializado para cards médicos
const SkeletonCard = ({ isLoading = true }: { isLoading?: boolean }) => (
  <motion.div
    className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="space-y-4">
      <Skeleton className="h-4 w-3/4" isLoading={isLoading} />
      <Skeleton className="h-3 w-1/2" isLoading={isLoading} />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" isLoading={isLoading} />
        <Skeleton className="h-3 w-5/6" isLoading={isLoading} />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-8 w-20" isLoading={isLoading} />
        <Skeleton className="h-8 w-24" isLoading={isLoading} />
      </div>
    </div>
  </motion.div>
);

// Skeleton para formulários médicos
const SkeletonForm = ({ isLoading = true }: { isLoading?: boolean }) => (
  <motion.div
    className="w-full space-y-6 rounded-lg bg-white p-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" isLoading={isLoading} />
      <Skeleton className="h-10 w-full" isLoading={isLoading} />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-32" isLoading={isLoading} />
      <Skeleton className="h-10 w-full" isLoading={isLoading} />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" isLoading={isLoading} />
        <Skeleton className="h-10 w-full" isLoading={isLoading} />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" isLoading={isLoading} />
        <Skeleton className="h-10 w-full" isLoading={isLoading} />
      </div>
    </div>
    <Skeleton className="h-12 w-full" isLoading={isLoading} />
  </motion.div>
);

// Skeleton para dashboard médico
const SkeletonDashboard = ({ isLoading = true }: { isLoading?: boolean }) => (
  <motion.div
    className="w-full space-y-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, staggerChildren: 0.1 }}
  >
    {/* Header Stats */}
    <motion.div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="rounded-lg border border-slate-200 bg-white p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" isLoading={isLoading} />
            <Skeleton className="h-8 w-24" isLoading={isLoading} />
            <Skeleton className="h-3 w-20" isLoading={isLoading} />
          </div>
        </motion.div>
      ))}
    </motion.div>

    {/* Main Content */}
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <motion.div
          className="rounded-lg border border-slate-200 bg-white p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" isLoading={isLoading} />
            <Skeleton className="h-64 w-full" isLoading={isLoading} />
          </div>
        </motion.div>
      </div>

      <div className="space-y-6">
        <motion.div
          className="rounded-lg border border-slate-200 bg-white p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="space-y-4">
            <Skeleton className="h-5 w-32" isLoading={isLoading} />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" isLoading={isLoading} />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" isLoading={isLoading} />
                  <Skeleton className="h-3 w-1/2" isLoading={isLoading} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </motion.div>
);

// Skeleton para lista de pacientes/tratamentos
const SkeletonList = ({
  items = 5,
  isLoading = true
}: {
  items?: number;
  isLoading?: boolean
}) => (
  <motion.div
    className="w-full space-y-4"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
      }
    }}
    initial="hidden"
    animate="visible"
  >
    {[...Array(items)].map((_, i) => (
      <motion.div
        key={i}
        className="flex items-center space-x-4 rounded-lg border border-slate-200 bg-white p-4"
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0 }
        }}
      >
        <Skeleton className="h-12 w-12 rounded-full" isLoading={isLoading} />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" isLoading={isLoading} />
          <Skeleton className="h-3 w-1/2" isLoading={isLoading} />
        </div>
        <div className="text-right space-y-1">
          <Skeleton className="h-3 w-16" isLoading={isLoading} />
          <Skeleton className="h-2 w-20" isLoading={isLoading} />
        </div>
      </motion.div>
    ))}
  </motion.div>
);

export {
  Skeleton,
  SkeletonCard,
  SkeletonForm,
  SkeletonDashboard,
  SkeletonList
};
