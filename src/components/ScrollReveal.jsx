import React from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollReveal Component
 * Wraps children with Framer Motion scroll animation variants.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children Elements to animate
 * @param {string} props.direction Transition entry point ('up' | 'down' | 'left' | 'right' | 'scale' | 'none')
 * @param {number} props.delay Initial start delay in seconds
 * @param {number} props.duration Animation speed in seconds
 * @param {number} props.distance Translation distance in pixels
 * @param {boolean} props.once If true, triggers only once on first scroll view
 * @param {string} props.className Optional Tailwind classes to apply to container
 * @param {boolean} props.cascade If true, staggers the entrance of child elements
 * @param {number} props.staggerAmount Timing delay between staggered child elements
 */
export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 30,
  once = true,
  className = '',
  cascade = false,
  staggerAmount = 0.08,
}) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  const initialVariant = {
    opacity: 0,
    ...directions[direction],
    scale: direction === 'scale' ? 0.96 : 1,
  };

  const animateVariant = {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration,
      delay,
      ease: [0.215, 0.61, 0.355, 1], // Cubic-bezier curve matching clean, native-feeling easing
    },
  };

  if (cascade) {
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerAmount,
          delayChildren: delay,
        },
      },
    };

    const itemVariants = {
      hidden: initialVariant,
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          duration,
          ease: [0.215, 0.61, 0.355, 1],
        },
      },
    };

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: '-60px' }}
        className={className}
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          return <motion.div variants={itemVariants}>{child}</motion.div>;
        })}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={initialVariant}
      whileInView={animateVariant}
      viewport={{ once, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
