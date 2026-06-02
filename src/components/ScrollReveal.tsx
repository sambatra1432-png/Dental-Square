import React from 'react';
import { motion } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'scale-up' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'text-reveal';
  delay?: number; // delay in milliseconds
  duration?: number; // duration in milliseconds
  threshold?: number; // percentage of elements in viewport (0 to 1)
  className?: string;
  id?: string;
  key?: React.Key;
}

export default function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 800,
  threshold = 0.05,
  className = '',
  id,
}: ScrollRevealProps) {
  
  // Custom high-end text reveal splitting algorithm
  if (variant === 'text-reveal') {
    if (typeof children === 'string') {
      const words = children.split(' ');
      return (
        <div className={`inline-flex flex-wrap gap-x-[0.22em] ${className}`} id={id}>
          {words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em]">
              <motion.span
                className="inline-block"
                initial={{ y: '115%', opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: threshold }}
                transition={{
                  type: 'spring',
                  stiffness: 80,
                  damping: 17,
                  delay: (delay + i * 35) / 1000,
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </div>
      );
    }
    
    if (React.isValidElement(children) && typeof children.props.children === 'string') {
      const text = children.props.children as string;
      const words = text.split(' ');
      const elementProps = children.props as any;
      
      return React.cloneElement(
        children,
        {
          ...elementProps,
          id,
          className: `${elementProps.className || ''} ${className} inline-flex flex-wrap gap-x-[0.22em]`,
          children: words.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em]">
              <motion.span
                className="inline-block"
                initial={{ y: '115%', opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: threshold }}
                transition={{
                  type: 'spring',
                  stiffness: 80,
                  damping: 17,
                  delay: (delay + i * 35) / 1000,
                }}
              >
                {word}
              </motion.span>
            </span>
          ))
        } as any
      );
    }
  }

  const getVariants = () => {
    // Spring physics configuration to feel luxurious and crisp
    const springConfig = {
      type: 'spring',
      stiffness: 70, // low stiffness for smoother sliding motion
      damping: 18,   // elegant deceleration
      mass: 0.9,     // lighter feel
      delay: delay / 1000,
    };

    switch (variant) {
      case 'fade-up':
        return {
          initial: { opacity: 0, y: 35 },
          animate: { opacity: 1, y: 0 },
          transition: springConfig
        };
      case 'fade-down':
        return {
          initial: { opacity: 0, y: -35 },
          animate: { opacity: 1, y: 0 },
          transition: springConfig
        };
      case 'fade-left':
        return {
          initial: { opacity: 0, x: 45 },
          animate: { opacity: 1, x: 0 },
          transition: springConfig
        };
      case 'fade-right':
        return {
          initial: { opacity: 0, x: -45 },
          animate: { opacity: 1, x: 0 },
          transition: springConfig
        };
      case 'zoom-in':
        return {
          initial: { opacity: 0, scale: 0.92 },
          animate: { opacity: 1, scale: 1 },
          transition: {
            type: 'spring',
            stiffness: 90,
            damping: 18,
            delay: delay / 1000,
          }
        };
      case 'scale-up':
        return {
          initial: { opacity: 0, scale: 0.85 },
          animate: { opacity: 1, scale: 1 },
          transition: {
            type: 'spring',
            stiffness: 85,
            damping: 17,
            delay: delay / 1000,
          }
        };
      case 'slide-up':
        return {
          initial: { opacity: 0, y: 70 },
          animate: { opacity: 1, y: 0 },
          transition: springConfig
        };
      case 'slide-down':
        return {
          initial: { opacity: 0, y: -70 },
          animate: { opacity: 1, y: 0 },
          transition: springConfig
        };
      case 'slide-left':
        return {
          initial: { opacity: 0, x: 80 },
          animate: { opacity: 1, x: 0 },
          transition: springConfig
        };
      case 'slide-right':
        return {
          initial: { opacity: 0, x: -80 },
          animate: { opacity: 1, x: 0 },
          transition: springConfig
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: duration / 1000, delay: delay / 1000, ease: 'easeOut' }
        };
    }
  };

  const anim = getVariants();

  return (
    <motion.div
      id={id}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: threshold }}
      variants={{
        initial: anim.initial,
        animate: anim.animate
      }}
      transition={anim.transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
