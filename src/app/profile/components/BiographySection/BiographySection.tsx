import React from 'react';
import { Box, Paper, Typography, TextField } from '@mui/material';
import { CustomButton } from '@/app/components/atoms/CustomButton/customButton';
import { lora } from '@/utils/fonts/fonts';

interface BiographySectionProps {
  biography: string;
  isEditing: boolean;
  isLoading: boolean;
  onChange: (bio: string) => void;
  onSave: () => void;
  onCancel: () => void;
  canEdit?: boolean;
}

export const BiographySection: React.FC<BiographySectionProps> = ({
  biography,
  isEditing,
  isLoading,
  onChange,
  onSave,
  onCancel,
  canEdit = true,
}) => (
  <Box sx={{ width: { xs: '100%', sm: 340, md: 400 }, maxWidth: '100%' }}>
    <>
      {canEdit && isEditing ? (
        <>
          <TextField
            value={biography}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your biography here..."
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
                background: 'rgba(255, 0, 0, 0.43)',
                boxShadow: '0 4px 14px rgba(255, 0, 0, 0.4)',
                paddingTop: '14px',
                height: '44px',
                textAlign: 'center',
                fontSize: { xs: 11, md: 15 },
                '&:hover': {
                  background: 'rgba(255, 0, 0, 0.65)',
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
            p: 1.5,
            mb: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#fff',
              fontFamily: lora.style.fontFamily,
              fontSize: 18,
              minHeight: 32,
            }}
          >
            {biography || 'Aquí irá la biografía del usuario.'}
          </Typography>
        </Paper>
      )}
    </>
  </Box>
);
