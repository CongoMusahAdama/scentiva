"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;
const viewport = { once: true, amount: 0.2 as const };

type BaseProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function ScrollEyebrow({ children, className = "", delay = 0 }: BaseProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
    >
      {children}
    </motion.p>
  );
}

export function ScrollHeading({
  children,
  className = "",
  delay = 0.1,
  as = "h2",
}: BaseProps & { as?: "h1" | "h2" | "h3" }) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.75, delay, ease }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

export function ScrollText({ children, className = "", delay = 0.2 }: BaseProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
    >
      {children}
    </motion.p>
  );
}
