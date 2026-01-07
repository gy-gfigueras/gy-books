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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
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
