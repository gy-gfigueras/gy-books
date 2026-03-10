'use client';
import { lora } from '@/utils/fonts/fonts';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

const MotionBox = motion(Box);

interface HallOfFameQuoteInputProps {
  quote?: string;
  editedQuote: string;
  setEditedQuote: (q: string) => void;
  isEditing: boolean;
  setIsEditing: (b: boolean) => void;
  onSave: () => void;
  disabled?: boolean;
}

export const HallOfFameQuoteInput: React.FC<HallOfFameQuoteInputProps> = ({
  quote,
  editedQuote,
  setEditedQuote,
  isEditing,
  setIsEditing,
  onSave,
  disabled = false,
}) => {
  const hasQuote = editedQuote.trim().length > 0;

  const handleCancel = () => {
    setEditedQuote(quote || '');
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '680px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.5,
      }}
    >
      <AnimatePresence mode="wait">
        {isEditing ? (
          <MotionBox
            key="editing"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <TextField
              autoFocus
              multiline
              value={editedQuote}
              onChange={(e) => setEditedQuote(e.target.value)}
              placeholder="Write your motto here..."
              onKeyDown={(e) => {
                if (e.key === 'Escape') handleCancel();
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSave();
                }
              }}
              fullWidth
              inputProps={{ maxLength: 200 }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(245,158,11,0.05)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '14px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(245,158,11,0.28)',
                    borderWidth: '1.5px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(245,158,11,0.45)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(245,158,11,0.7)',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '1rem',
                  fontFamily: lora.style.fontFamily,
                  fontStyle: 'italic',
                  textAlign: 'center',
                  lineHeight: 1.7,
                  py: 1.5,
                },
                '& textarea::placeholder': {
                  color: 'rgba(255,255,255,0.25)',
                  fontStyle: 'italic',
                },
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                sx={{
                  fontFamily: lora.style.fontFamily,
                  fontSize: '11px',
                  color:
                    editedQuote.length > 180
                      ? '#f59e0b'
                      : 'rgba(255,255,255,0.22)',
                  transition: 'color 0.2s',
                }}
              >
                {editedQuote.length}/200
              </Typography>
              <Tooltip title="Cancel (Esc)" placement="top">
                <IconButton
                  onClick={handleCancel}
                  size="small"
                  sx={{
                    color: 'rgba(255,255,255,0.35)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    p: 0.5,
                    '&:hover': {
                      color: 'rgba(255,255,255,0.65)',
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save (Enter)" placement="top">
                <IconButton
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSave();
                  }}
                  size="small"
                  sx={{
                    color: '#f59e0b',
                    border: '1px solid rgba(245,158,11,0.35)',
                    borderRadius: '8px',
                    p: 0.5,
                    background: 'rgba(245,158,11,0.08)',
                    '&:hover': {
                      background: 'rgba(245,158,11,0.18)',
                      borderColor: 'rgba(245,158,11,0.6)',
                    },
                  }}
                >
                  <CheckIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </MotionBox>
        ) : (
          <MotionBox
            key="display"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            onClick={!disabled ? () => setIsEditing(true) : undefined}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: disabled ? 'default' : 'pointer',
              px: 4,
              py: 1.5,
              borderRadius: '14px',
              border: '1px solid transparent',
              transition: 'all 0.25s ease',
              position: 'relative',
              '&:hover': !disabled
                ? {
                    borderColor: 'rgba(245,158,11,0.18)',
                    background: 'rgba(245,158,11,0.04)',
                    '& .edit-hint': { opacity: 1 },
                  }
                : {},
            }}
          >
            <FormatQuoteIcon
              sx={{
                color: 'rgba(245,158,11,0.25)',
                fontSize: 30,
                transform: 'scaleX(-1)',
                mb: -0.5,
                alignSelf: 'flex-start',
                ml: 1,
              }}
            />
            <Typography
              sx={{
                fontFamily: lora.style.fontFamily,
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                fontStyle: 'italic',
                color: hasQuote
                  ? 'rgba(255,255,255,0.68)'
                  : 'rgba(255,255,255,0.2)',
                textAlign: 'center',
                lineHeight: 1.75,
                px: 1,
              }}
            >
              {hasQuote
                ? editedQuote
                : disabled
                  ? 'No motto yet.'
                  : 'Add your motto...'}
            </Typography>
            <FormatQuoteIcon
              sx={{
                color: 'rgba(245,158,11,0.25)',
                fontSize: 30,
                mt: -0.5,
                alignSelf: 'flex-end',
                mr: 1,
              }}
            />
            {!disabled && (
              <Box
                className="edit-hint"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.4,
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                }}
              >
                <EditIcon
                  sx={{ fontSize: 12, color: 'rgba(245,158,11,0.55)' }}
                />
                <Typography
                  sx={{
                    fontFamily: lora.style.fontFamily,
                    fontSize: '10px',
                    color: 'rgba(245,158,11,0.55)',
                    letterSpacing: '0.05em',
                  }}
                >
                  edit
                </Typography>
              </Box>
            )}
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};
