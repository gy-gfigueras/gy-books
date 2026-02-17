import { CustomButton } from '@/app/components/atoms/CustomButton/customButton';
import { lora } from '@/utils/fonts/fonts';
import { Box, Paper, TextField, Typography } from '@mui/material';
import React from 'react';

interface BiographySectionProps {
  biography: string;
  isEditing: boolean;
  isLoading: boolean;
  onChange: (bio: string) => void;
  onSave: () => void;
  onCancel: () => void;
  canEdit?: boolean;
  compact?: boolean;
}

export const BiographySection: React.FC<BiographySectionProps> = ({
  biography,
  isEditing,
  isLoading,
  onChange,
  onSave,
  onCancel,
  canEdit = true,
  compact = false,
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: compact ? '100%' : { xs: '100%', sm: 340, md: 400 },
      }}
    >
      <>
        {canEdit && isEditing ? (
          <>
            <TextField
              value={biography}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Write your biography here..."
              multiline
              minRows={3}
              maxRows={8}
              autoFocus
              sx={{
                mb: '8px',
                width: '100%',
                background:
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(168, 85, 247, 0.05) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '2px solid rgba(147, 51, 234, 0.3)',
                fontFamily: lora.style.fontFamily,
                '& .MuiOutlinedInput-root': {
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(147, 51, 234, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderRadius: '12px',
                    borderColor: '#9333ea',
                  },
                  '&.MuiFormLabel-root': {
                    color: 'transparent',
                    fontFamily: lora.style.fontFamily,
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'transparent',
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  fontFamily: lora.style.fontFamily,
                },
                '& .MuiInputLabel-root': {
                  color: 'white',
                  fontFamily: lora.style.fontFamily,
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'white',
                  fontSize: '18px',
                  fontFamily: lora.style.fontFamily,
                },
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <CustomButton
                sx={{
                  letterSpacing: '.05rem',
                  minWidth: { xs: 0, md: 'auto' },
                  width: { xs: '50%', md: 'auto' },
                  fontSize: { xs: 11, md: 15 },
                  height: '44px',
                  paddingTop: '14px',
                  textAlign: 'center',
                  fontFamily: lora.style.fontFamily,
                }}
                onClick={onSave}
                disabled={isLoading}
                variant="outlined"
              >
                Save
              </CustomButton>
              <CustomButton
                type="CANCEL"
                sx={{
                  letterSpacing: '.05rem',
                  minWidth: { xs: 0, md: 'auto' },
                  width: { xs: '50%', md: 'auto' },
                  fontFamily: lora.style.fontFamily,
                  background: 'rgba(255, 100, 100, 0.15)',
                  boxShadow: 'none',
                  paddingTop: '14px',
                  height: '44px',
                  textAlign: 'center',
                  fontSize: { xs: 11, md: 15 },
                  color: 'rgba(255, 100, 100, 0.8)',
                  '&:hover': {
                    background: 'rgba(255, 100, 100, 0.25)',
                    transform: 'translateY(-2px)',
                  },
                }}
                onClick={onCancel}
                disabled={isLoading}
                variant="outlined"
              >
                Cancel
              </CustomButton>
            </Box>
          </>
        ) : (
          <Paper
            elevation={0}
            sx={{
              border: '2px solid rgba(147, 51, 234, 0.4)',
              borderRadius: '12px',
              background:
                'linear-gradient(135deg, rgba(147, 51, 234, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
              backdropFilter: 'blur(10px)',
              p: compact ? 1 : 1.5,
              mb: compact ? 0 : 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#fff',
                fontFamily: lora.style.fontFamily,
                fontSize: compact ? { xs: 13, md: 15 } : 18,
                minHeight: compact ? 'auto' : 32,
                display: compact ? '-webkit-box' : 'block',
                overflow: compact ? 'hidden' : 'visible',
                textOverflow: compact ? 'ellipsis' : 'clip',
                WebkitLineClamp: compact ? 2 : 'unset',
                WebkitBoxOrient: compact ? 'vertical' : 'unset',
                lineClamp: compact ? 2 : 'unset',
              }}
            >
              {biography || "The user's biography will go here."}
            </Typography>
          </Paper>
        )}
      </>
    </Box>
  );
};
