'use client';
import React from 'react';
import { Box, Chip, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { lora } from '@/utils/fonts/fonts';
import { motion, AnimatePresence } from 'framer-motion';

const MotionChip = motion(Chip);

interface ActiveFilter {
  type: string;
  label: string;
  value: string | number;
}

interface ActiveFiltersChipsProps {
  activeFilters: ActiveFilter[];
  onRemove: (type: string) => void;
  onClearAll: () => void;
}

export const ActiveFiltersChips: React.FC<ActiveFiltersChipsProps> = ({
  activeFilters,
  onRemove,
  onClearAll,
}) => {
  if (activeFilters.length === 0) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 1.5,
        py: 2,
        px: { xs: 0.5, md: 1 },
      }}
    >
      <AnimatePresence mode="popLayout">
        {activeFilters.map((filter) => (
          <MotionChip
            key={filter.type}
            label={filter.label}
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            onDelete={() => onRemove(filter.type)}
            deleteIcon={<CloseIcon sx={{ fontSize: '1rem' }} />}
            sx={{
              background:
                'linear-gradient(135deg, rgba(147, 51, 234, 0.25) 0%, rgba(168, 85, 247, 0.2) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(147, 51, 234, 0.4)',
              color: '#e9d5ff',
              fontFamily: lora.style.fontFamily,
              fontWeight: 600,
              fontSize: '0.9rem',
              height: 36,
              borderRadius: '18px',
              boxShadow: '0 4px 12px rgba(147, 51, 234, 0.2)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '& .MuiChip-label': {
                px: 2,
              },
              '& .MuiChip-deleteIcon': {
                color: '#e9d5ff',
                opacity: 0.8,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#fff',
                  opacity: 1,
                },
              },
              '&:hover': {
                background:
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.35) 0%, rgba(168, 85, 247, 0.3) 100%)',
                border: '1px solid rgba(147, 51, 234, 0.6)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(147, 51, 234, 0.3)',
              },
            }}
          />
        ))}
      </AnimatePresence>

      {activeFilters.length > 1 && (
        <Button
          size="small"
          onClick={onClearAll}
          startIcon={<ClearAllIcon />}
          sx={{
            color: '#f87171',
            fontFamily: lora.style.fontFamily,
            fontWeight: 600,
            fontSize: '0.85rem',
            textTransform: 'none',
            px: 2,
            py: 0.75,
            borderRadius: '18px',
            background: 'rgba(248, 113, 113, 0.1)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'rgba(248, 113, 113, 0.2)',
              border: '1px solid rgba(248, 113, 113, 0.5)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(248, 113, 113, 0.3)',
            },
          }}
        >
          Clear All
        </Button>
      )}
    </Box>
  );
};
