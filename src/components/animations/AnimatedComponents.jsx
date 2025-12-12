import { motion } from "framer-motion";

// Page transition animations
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
};

export const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

// Card animations
export const cardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.05,
    y: -10,
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Stagger container for multiple items
export const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1
    }
  }
};

// Individual item in stagger
export const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Button animations
export const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.95
  }
};

// Modal animations
export const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Slide in animations
export const slideInVariants = {
  left: {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  },
  right: {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  },
  up: {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  },
  down: {
    hidden: { opacity: 0, y: -100 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }
};

// Floating animation
export const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Pulse animation
export const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Animated Page Wrapper
export const AnimatedPage = ({ children, className = "" }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className={className}
  >
    {children}
  </motion.div>
);

// Animated Card Component
export const AnimatedCard = ({ children, className = "", ...props }) => (
  <motion.div
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    whileHover="hover"
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

// Animated Button Component
export const AnimatedButton = ({ children, className = "", ...props }) => (
  <motion.button
    variants={buttonVariants}
    whileHover="hover"
    whileTap="tap"
    className={className}
    {...props}
  >
    {children}
  </motion.button>
);

// Stagger Container
export const StaggerContainer = ({ children, className = "" }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className={className}
  >
    {children}
  </motion.div>
);

// Stagger Item
export const StaggerItem = ({ children, className = "" }) => (
  <motion.div
    variants={itemVariants}
    className={className}
  >
    {children}
  </motion.div>
);

// Slide In Component
export const SlideIn = ({ children, direction = "up", className = "" }) => (
  <motion.div
    variants={slideInVariants[direction]}
    initial="hidden"
    animate="visible"
    className={className}
  >
    {children}
  </motion.div>
);

// Floating Component
export const FloatingElement = ({ children, className = "" }) => (
  <motion.div
    variants={floatingVariants}
    animate="animate"
    className={className}
  >
    {children}
  </motion.div>
);

// Count Up Animation
export const CountUp = ({ from = 0, to, duration = 2, className = "" }) => {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.span
          animate={{ 
            scale: [1, 1.1, 1],
            color: ["#000", "#ef4444", "#000"]
          }}
          transition={{ 
            duration: duration,
            ease: "easeInOut"
          }}
        >
          {to}
        </motion.span>
      </motion.span>
    </motion.span>
  );
};