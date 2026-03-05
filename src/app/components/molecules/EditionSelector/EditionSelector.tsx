import React, { useState, useMemo } from 'react';
import { Edition } from '@/domain/book.model';
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import { DEFAULT_COVER_IMAGE } from '@/utils/constants/constants';
import { lora } from '@/utils/fonts/fonts';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface EditionSelectorProps {
  editions: Edition[];
  selectedEdition: Edition | null;
  onEditionChange: (edition: Edition | null) => void;
  disabled?: boolean;
}

const MotionBox = motion(Box);

export const EditionSelector: React.FC<EditionSelectorProps> = ({
  editions,
  selectedEdition,
  onEditionChange,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const getLanguageCode = (language: string): string => {
    if (language === 'all') return 'ALL';
    return language.substring(0, 3).toUpperCase();
  };

  const availableLanguages = useMemo(() => {
    const languages = new Set<string>();
    editions.forEach((edition) => {
      if (edition.language?.language) languages.add(edition.language.language);
    });
    return Array.from(languages).sort();
  }, [editions]);

  const filteredEditions = useMemo(() => {
    if (selectedLanguage === 'all') return editions;
    return editions.filter((e) => e.language?.language === selectedLanguage);
  }, [editions, selectedLanguage]);

  const handleSelect = (edition: Edition | null) => {
    onEditionChange(edition);
    setOpen(false);
  };

  if (!editions || editions.length === 0) return null;

  const triggerLabel = selectedEdition
    ? selectedEdition.title.length > 22
      ? selectedEdition.title.slice(0, 22) + '…'
      : selectedEdition.title
    : 'Default';

  return (
    <>
      {/* ── Trigger button ── */}
      <Box
        component="button"
        onClick={() => !disabled && setOpen(true)}
        disabled={disabled}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.25,
          py: 0.4,
          borderRadius: '100px',
          border: '1px solid rgba(147,51,234,0.3)',
          background: selectedEdition
            ? 'rgba(147,51,234,0.12)'
            : 'rgba(255,255,255,0.04)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.2s',
          outline: 'none',
          '&:hover': {
            borderColor: 'rgba(147,51,234,0.55)',
            background: 'rgba(147,51,234,0.18)',
          },
        }}
      >
        <CollectionsBookmarkIcon sx={{ fontSize: 12, color: '#c084fc' }} />
        <Typography
          sx={{
            fontFamily: lora.style.fontFamily,
            fontSize: '0.72rem',
            color: selectedEdition ? '#c084fc' : 'rgba(255,255,255,0.45)',
            fontWeight: selectedEdition ? 600 : 400,
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {triggerLabel}
        </Typography>
      </Box>

      {/* ── Dialog ── */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: '#0f0f0f',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '20px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            overflow: 'hidden',
            maxHeight: '85vh',
          },
        }}
        slotProps={{
          backdrop: {
            sx: { backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.6)' },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            pt: 3,
            pb: 2,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: lora.style.fontFamily,
                fontWeight: 700,
                fontSize: '1.3rem',
                color: '#fff',
                lineHeight: 1.2,
              }}
            >
              Choose edition
            </Typography>
            <Typography
              sx={{
                fontFamily: lora.style.fontFamily,
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.3)',
                mt: 0.4,
              }}
            >
              {editions.length} editions available
            </Typography>
          </Box>
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              color: 'rgba(255,255,255,0.4)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              p: 0.75,
              '&:hover': {
                color: '#fff',
                background: 'rgba(255,255,255,0.06)',
              },
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <DialogContent
          sx={{
            px: 3,
            py: 2.5,
            overflow: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#9333ea transparent',
          }}
        >
          {/* Language pills */}
          {availableLanguages.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
              {['all', ...availableLanguages].map((lang) => (
                <Box
                  key={lang}
                  component="button"
                  onClick={() => setSelectedLanguage(lang)}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '100px',
                    border: '1px solid',
                    borderColor:
                      selectedLanguage === lang
                        ? 'rgba(147,51,234,0.6)'
                        : 'rgba(255,255,255,0.1)',
                    background:
                      selectedLanguage === lang
                        ? 'rgba(147,51,234,0.15)'
                        : 'transparent',
                    color:
                      selectedLanguage === lang
                        ? '#c084fc'
                        : 'rgba(255,255,255,0.4)',
                    fontFamily: lora.style.fontFamily,
                    fontSize: '0.75rem',
                    fontWeight: selectedLanguage === lang ? 700 : 400,
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.18s',
                    letterSpacing: '0.05em',
                    '&:hover': {
                      borderColor: 'rgba(147,51,234,0.4)',
                      color: '#c084fc',
                    },
                  }}
                >
                  {getLanguageCode(lang)}
                </Box>
              ))}
            </Box>
          )}

          {/* "Default edition" option */}
          <MotionBox
            layout
            onClick={() => handleSelect(null)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 1.5,
              mb: 1,
              borderRadius: '14px',
              border: '1px solid',
              borderColor: !selectedEdition
                ? 'rgba(147,51,234,0.5)'
                : 'rgba(255,255,255,0.06)',
              background: !selectedEdition
                ? 'rgba(147,51,234,0.08)'
                : 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              transition: 'all 0.18s',
              '&:hover': {
                borderColor: 'rgba(147,51,234,0.35)',
                background: 'rgba(147,51,234,0.06)',
              },
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 60,
                borderRadius: '8px',
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <Image
                src={DEFAULT_COVER_IMAGE}
                alt="default"
                fill
                style={{ objectFit: 'cover' }}
                sizes="44px"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontFamily: lora.style.fontFamily,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: !selectedEdition ? '#c084fc' : 'rgba(255,255,255,0.7)',
                }}
              >
                Default edition
              </Typography>
            </Box>
            {!selectedEdition && (
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'rgba(147,51,234,0.3)',
                  border: '1px solid rgba(147,51,234,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CheckIcon sx={{ fontSize: 13, color: '#c084fc' }} />
              </Box>
            )}
          </MotionBox>

          {/* Edition grid */}
          <AnimatePresence mode="popLayout">
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 1,
              }}
            >
              {filteredEditions.map((edition, i) => {
                const isSelected = selectedEdition?.id === edition.id;
                const coverUrl =
                  edition.cached_image?.url || DEFAULT_COVER_IMAGE;
                const langCode = edition.language
                  ? getLanguageCode(edition.language.language)
                  : null;
                return (
                  <MotionBox
                    key={edition.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.18,
                      delay: Math.min(i * 0.025, 0.25),
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(edition)}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1.5,
                      p: 1.25,
                      borderRadius: '14px',
                      border: '1px solid',
                      borderColor: isSelected
                        ? 'rgba(147,51,234,0.55)'
                        : 'rgba(255,255,255,0.05)',
                      background: isSelected
                        ? 'rgba(147,51,234,0.1)'
                        : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'border-color 0.18s, background 0.18s',
                      '&:hover': {
                        borderColor: 'rgba(147,51,234,0.35)',
                        background: 'rgba(147,51,234,0.06)',
                      },
                    }}
                  >
                    {/* Cover */}
                    <Box
                      sx={{
                        width: 44,
                        height: 60,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        position: 'relative',
                        border: isSelected
                          ? '1.5px solid rgba(147,51,234,0.5)'
                          : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: isSelected
                          ? '0 0 12px rgba(147,51,234,0.25)'
                          : 'none',
                      }}
                    >
                      <Image
                        src={coverUrl}
                        alt={edition.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="44px"
                      />
                    </Box>

                    {/* Info */}
                    <Box sx={{ flex: 1, minWidth: 0, pt: 0.25 }}>
                      <Typography
                        sx={{
                          fontFamily: lora.style.fontFamily,
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: '0.8rem',
                          color: isSelected ? '#fff' : 'rgba(255,255,255,0.75)',
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 0.75,
                        }}
                      >
                        {edition.title}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                          flexWrap: 'wrap',
                        }}
                      >
                        {langCode && (
                          <Box
                            sx={{
                              px: 0.75,
                              py: 0.15,
                              borderRadius: '4px',
                              background: 'rgba(147,51,234,0.18)',
                              border: '1px solid rgba(147,51,234,0.25)',
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: lora.style.fontFamily,
                                fontSize: '0.62rem',
                                color: '#c084fc',
                                fontWeight: 700,
                                letterSpacing: '0.06em',
                              }}
                            >
                              {langCode}
                            </Typography>
                          </Box>
                        )}
                        {edition.pages && edition.pages > 0 && (
                          <Typography
                            sx={{
                              fontFamily: lora.style.fontFamily,
                              fontSize: '0.72rem',
                              color: 'rgba(255,255,255,0.3)',
                            }}
                          >
                            {edition.pages}p
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Check */}
                    {isSelected && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: 'rgba(147,51,234,0.35)',
                          border: '1px solid rgba(147,51,234,0.7)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckIcon sx={{ fontSize: 11, color: '#c084fc' }} />
                      </Box>
                    )}
                  </MotionBox>
                );
              })}
            </Box>
          </AnimatePresence>

          {filteredEditions.length === 0 && (
            <Typography
              sx={{
                fontFamily: lora.style.fontFamily,
                color: 'rgba(255,255,255,0.25)',
                fontSize: '0.9rem',
                textAlign: 'center',
                py: 4,
                fontStyle: 'italic',
              }}
            >
              No editions for this language.
            </Typography>
          )}

          {disabled && (
            <Typography
              sx={{
                fontFamily: lora.style.fontFamily,
                color: '#9333ea',
                mt: 2,
                textAlign: 'center',
                fontSize: '0.8rem',
                fontStyle: 'italic',
              }}
            >
              Saving edition…
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
