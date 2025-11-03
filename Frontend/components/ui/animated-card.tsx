/**
 * Animated Card System - FASE 2 Micro-Interações
 * Cards inteligentes com hover states contextuais e feedback médico
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { cardVariants } from '@/lib/motion';
import { useHoverAnimation } from '@/hooks/use-motion';
import { ArrowRight, Star, Heart, Shield, Clock, Users } from 'lucide-react';

interface AnimatedCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'medical' | 'service' | 'testimonial' | 'feature';
  className?: string;
  onClick?: () => void;
  href?: string;
  interactive?: boolean;
  medical?: boolean;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  href,
  interactive = true,
  medical = false,
}) => {
  const { isHovered, controls, hoverProps } = useHoverAnimation();
  const [isPressed, setIsPressed] = useState(false);

  const Component = href ? motion.a : motion.div;
  const componentProps = href ? { href } : {};

  const baseClasses = cn(
    'relative overflow-hidden rounded-xl border shadow-sm transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    {
      'cursor-pointer': interactive || onClick || href,
      'border-slate-200 hover:border-slate-300 bg-white': variant === 'default',
      'border-blue-200 hover:border-blue-300':
        variant === 'medical' || medical,
      'border-green-200 hover:border-green-300':
        variant === 'service',
      'border-purple-200 hover:border-purple-300 bg-gradient-to-br from-purple-50 to-white':
        variant === 'testimonial',
      'border-indigo-200 hover:border-indigo-300 bg-gradient-to-br from-indigo-50 to-white':
        variant === 'feature',
    },
    className
  );

  return (
    <Component
      className={baseClasses}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={interactive ? "hover" : undefined}
      whileTap={interactive ? "tap" : undefined}
      animate={controls}
      viewport={{ once: true, margin: '-50px' }}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...hoverProps}
      {...componentProps}
    >
      {/* Hover Gradient Overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={cn(
              'absolute inset-0 opacity-0',
              {
                'bg-gradient-to-br from-blue-100/50 to-blue-200/30': variant === 'medical' || medical,
                'bg-gradient-to-br from-green-100/50 to-green-200/30': variant === 'service',
                'bg-gradient-to-br from-purple-100/50 to-purple-200/30': variant === 'testimonial',
                'bg-gradient-to-br from-indigo-100/50 to-indigo-200/30': variant === 'feature',
                'bg-gradient-to-br from-slate-100/50 to-slate-200/30': variant === 'default',
              }
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Press Ripple Effect */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-xl"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* Medical Pulse Border */}
      {(medical || variant === 'medical') && (
        <motion.div
          className="absolute inset-0 border-2 border-blue-400/30 rounded-xl pointer-events-none"
          animate={{
            opacity: [0, 0.5, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Hover Arrow Indicator */}
      {(onClick || href) && (
        <motion.div
          className="absolute top-4 right-4 opacity-0"
          animate={{
            opacity: isHovered ? 1 : 0,
            x: isHovered ? 0 : 10,
          }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRight className="h-5 w-5 text-blue-500" />
        </motion.div>
      )}
    </Component>
  );
};

// Specialized Medical Treatment Card
const MedicalTreatmentCard: React.FC<{
  title: string;
  description: string;
  duration: string;
  price?: string;
  features: string[];
  popular?: boolean;
  icon?: React.ReactNode;
}> = ({
  title,
  description,
  duration,
  price,
  features,
  popular = false,
  icon,
}) => {
  return (
    <AnimatedCard variant="medical" className="p-6">
      {/* Popular Badge */}
      {popular && (
        <motion.div
          className="absolute -top-3 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
            Mais Popular
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <motion.div
                className="p-2 bg-blue-100 rounded-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.div>
            )}
            <div>
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Clock className="h-4 w-4" />
                <span>{duration}</span>
              </div>
            </div>
          </div>

          {price && (
            <motion.div
              className="text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-2xl font-bold text-blue-600">{price}</div>
              <div className="text-sm text-slate-500">por mês</div>
            </motion.div>
          )}
        </div>

        {/* Description */}
        <p className="text-slate-600">{description}</p>

        {/* Features */}
        <motion.div
          className="space-y-2"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-2"
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0 }
              }}
            >
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <span className="text-sm text-slate-700">{feature}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </AnimatedCard>
  );
};

// Service Card with Stats
const ServiceCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  stats?: {
    value: string;
    label: string;
  };
  gradient?: string;
}> = ({
  title,
  description,
  icon,
  stats,
  gradient = 'from-blue-500 to-blue-600',
}) => {
  return (
    <AnimatedCard variant="service" className="p-6">
      <div className="space-y-4">
        {/* Icon Header */}
        <motion.div
          className={`inline-flex p-3 bg-gradient-to-r ${gradient} rounded-lg text-white`}
          whileHover={{
            scale: 1.1,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>

        {/* Content */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-600">{description}</p>
        </div>

        {/* Stats */}
        {stats && (
          <motion.div
            className="pt-4 border-t border-slate-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-2xl font-bold text-green-600">{stats.value}</div>
            <div className="text-sm text-slate-500">{stats.label}</div>
          </motion.div>
        )}
      </div>
    </AnimatedCard>
  );
};

// Testimonial Card
const TestimonialCard: React.FC<{
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating?: number;
}> = ({
  name,
  role,
  content,
  avatar,
  rating = 5,
}) => {
  return (
    <AnimatedCard variant="testimonial" className="p-6">
      <div className="space-y-4">
        {/* Rating */}
        <motion.div
          className="flex space-x-1"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          initial="hidden"
          animate="visible"
        >
          {[...Array(rating)].map((_, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, scale: 0 },
                visible: { opacity: 1, scale: 1 }
              }}
            >
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </motion.div>
          ))}
        </motion.div>

        {/* Content */}
        <blockquote className="text-slate-700 italic">
          "{content}"
        </blockquote>

        {/* Author */}
        <div className="flex items-center space-x-3">
          {avatar ? (
            <motion.img
              src={avatar}
              alt={name}
              className="w-10 h-10 rounded-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            />
          ) : (
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-semibold text-sm">
                {name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <div className="font-semibold text-slate-900">{name}</div>
            <div className="text-sm text-slate-500">{role}</div>
          </div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export {
  AnimatedCard,
  MedicalTreatmentCard,
  ServiceCard,
  TestimonialCard,
};