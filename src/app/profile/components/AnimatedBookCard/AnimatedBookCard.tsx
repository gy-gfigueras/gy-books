'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { BookCardCompact } from '@/app/components/atoms/BookCardCompact/BookCardCompact';
import HardcoverBook from '@/domain/HardcoverBook';

interface AnimatedBookCardProps {
  book: HardcoverBook;
  index: number;
}

export const AnimatedBookCard: React.FC<AnimatedBookCardProps> = ({
  book,
  index,
}) => {
  // Only stagger the first 7 cards — after that animate immediately to avoid
  // hiding LCP candidates behind a long accumulated delay.
  const delay = Math.min(index, 6) * 0.04;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.3,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <BookCardCompact book={book} />
    </motion.div>
  );
};
