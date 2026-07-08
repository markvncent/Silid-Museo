import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

let globalPlayTransition = false;
const listeners = new Set();

export function setPlayTransition(value) {
  globalPlayTransition = value;
  listeners.forEach((listener) => listener(value));
}

const activeVariants = {
  initial: {
    opacity: 0,
    scale: 1.04,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 1.08,
    filter: 'blur(8px)',
    transition: {
      duration: 0.4,
      ease: 'easeIn',
    },
  },
};

const disabledVariants = {
  initial: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 1, scale: 1, filter: 'blur(0px)' },
};

export default function PageTransition({ children }) {
  const [shouldAnimate, setShouldAnimate] = useState(globalPlayTransition);

  useEffect(() => {
    const handleUpdate = (val) => {
      setShouldAnimate(val);
    };
    listeners.add(handleUpdate);

    if (globalPlayTransition) {
      setTimeout(() => {
        setPlayTransition(false);
      }, 100);
    }

    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const variants = shouldAnimate ? activeVariants : disabledVariants;

  return (
    <motion.div
      initial={shouldAnimate ? "initial" : "animate"}
      animate="animate"
      exit={shouldAnimate ? "exit" : "animate"}
      variants={variants}
      style={{ willChange: shouldAnimate ? 'transform, opacity, filter' : 'auto' }}
      className="w-full min-h-screen flex flex-col flex-1"
    >
      {children}
    </motion.div>
  );
}
