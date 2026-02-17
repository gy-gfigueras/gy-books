import React, { useState, useMemo } from 'react';
import { Edition } from '@/domain/book.model';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Avatar,
  Typography,
  Chip,
} from '@mui/material';
import { DEFAULT_COVER_IMAGE } from '@/utils/constants/constants';
import { lora } from '@/utils/fonts/fonts';

interface EditionSelectorProps {
  editions: Edition[];
  selectedEdition: Edition | null;
  onEditionChange: (edition: Edition | null) => void;
  disabled?: boolean;
}

export const EditionSelector: React.FC<EditionSelectorProps> = ({
  editions,
  selectedEdition,
  onEditionChange,
  disabled = false,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  // Helper function to get abbreviated language code
  const getLanguageCode = (language: string): string => {
    if (language === 'all') return 'ALL';
    return language.substring(0, 3).toUpperCase();
  };

  // Get unique available languages
  const availableLanguages = useMemo(() => {
    const languages = new Set<string>();
    editions.forEach((edition) => {
      if (edition.language?.language) {
        languages.add(edition.language.language);
      }
    });
    return Array.from(languages).sort();
  }, [editions]);

  // Filter editions by selected language
  const filteredEditions = useMemo(() => {
    if (selectedLanguage === 'all') return editions;
    return editions.filter(
      (edition) => edition.language?.language === selectedLanguage
    );
  }, [editions, selectedLanguage]);

  const handleChange = (event: SelectChangeEvent<number>) => {
    const editionId = event.target.value as number;
    const edition = editions.find((e) => e.id === editionId) || null;
    onEditionChange(edition);
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    setSelectedLanguage(event.target.value);
    // Reset selected edition when changing language filter
    onEditionChange(null);
  };

  if (!editions || editions.length === 0) return null;

  return (
    <Box mt={3} width="100%">
      {/* Edition and Language filters in row */}
      <Box display="flex" gap={2} alignItems="center" flexDirection="row">
        {/* Edition Selector - FIRST */}
        <Box sx={{ flex: 1, minWidth: '200px' }}>
          <FormControl fullWidth size="small" disabled={disabled}>
            <Select
              value={selectedEdition?.id ?? ''}
              onChange={handleChange}
              displayEmpty
              disabled={disabled}
              renderValue={(value) => {
                if (!value) {
                  return (
                    <Typography
                      sx={{
                        color: '#9333ea',
                        fontFamily: lora.style.fontFamily,
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Default Edition
                    </Typography>
                  );
                }
                const edition = editions.find((e) => e.id === value);
                return (
                  <Typography
                    sx={{
                      color: '#FFFFFF',
                      fontFamily: lora.style.fontFamily,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {edition?.title || 'Default Edition'}
                  </Typography>
                );
              }}
              sx={{
                color: '#FFFFFF',
                fontFamily: lora.style.fontFamily,
                background: 'rgba(35, 35, 35, 0.6)',
                borderRadius: '12px',
                overflow: 'hidden',
                flexShrink: 0,
                flexWrap: 'nowrap',
                maxWidth: '200px',
                '.MuiOutlinedInput-notchedOutline': {
                  border: 0,
                },
                '.MuiSvgIcon-root': {
                  color: '#9333ea',
                },
                '.MuiSelect-select': {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  paddingRight: '32px !important',
                  maxWidth: 'calc(100% - 32px)',
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    boxShadow: '0 4px 12px rgba(147, 51, 234, 0.15)',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    scrollbarColor: '#9333ea transparent',
                    '&::-webkit-scrollbar': { width: 8 },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(147, 51, 234, 0.1)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background:
                        'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
                      borderRadius: 4,
                    },
                    '.MuiMenuItem-root': {
                      color: '#FFFFFF',
                      padding: '8px 12px',
                      margin: '2px 4px',
                      borderRadius: '8px',
                      minHeight: 'auto',
                      fontFamily: lora.style.fontFamily,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#9333ea20',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#9333ea30',
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="">
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Avatar
                    src={DEFAULT_COVER_IMAGE}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '6px',
                      border: '1px solid #FFFFFF20',
                    }}
                    variant="rounded"
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: lora.style.fontFamily,
                      color: '#9333ea',
                      fontWeight: 500,
                    }}
                  >
                    Default Edition
                  </Typography>
                </Box>
              </MenuItem>
              {filteredEditions.map((edition) => (
                <MenuItem key={edition.id} value={edition.id}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    width="100%"
                  >
                    <Avatar
                      src={edition.cached_image?.url || DEFAULT_COVER_IMAGE}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '6px',
                        border: '1px solid #FFFFFF20',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                      }}
                      variant="rounded"
                    />
                    <Box flex={1}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 'medium',
                          fontSize: '14px',
                          fontFamily: lora.style.fontFamily,
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {edition.title}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                        {edition.language && (
                          <Chip
                            label={getLanguageCode(edition.language.language)}
                            size="small"
                            sx={{
                              backgroundColor: '#9333ea20',
                              color: '#9333ea',
                              fontSize: '10px',
                              height: '18px',
                              fontFamily: lora.style.fontFamily,
                              fontWeight: 'bold',
                            }}
                          />
                        )}
                        {edition.pages && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#FFFFFF66',
                              fontSize: '11px',
                              fontFamily: lora.style.fontFamily,
                            }}
                          >
                            {edition.pages} pages
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Language Filter - SECOND */}
        {availableLanguages.length > 1 && (
          <Box sx={{ minWidth: '100px', flexShrink: 0 }}>
            <FormControl fullWidth size="small" disabled={disabled}>
              <Select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                displayEmpty
                disabled={disabled}
                sx={{
                  color: '#FFFFFF',
                  fontFamily: lora.style.fontFamily,
                  background: 'rgba(35, 35, 35, 0.6)',
                  borderRadius: '12px',
                  '.MuiOutlinedInput-notchedOutline': {
                    border: 0,
                  },
                  '.MuiSvgIcon-root': {
                    color: '#9333ea',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      boxShadow: '0 4px 12px rgba(147, 51, 234, 0.15)',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      scrollbarColor: '#9333ea transparent',
                      '&::-webkit-scrollbar': { width: 8 },
                      '&::-webkit-scrollbar-track': {
                        background: 'rgba(147, 51, 234, 0.1)',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background:
                          'linear-gradient(135deg, #9333ea 0%, #a855f7 100%)',
                        borderRadius: 4,
                      },
                      '.MuiMenuItem-root': {
                        color: '#FFFFFF',
                        padding: '8px 12px',
                        margin: '2px 4px',
                        borderRadius: '8px',
                        fontFamily: lora.style.fontFamily,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#9333ea20',
                        },
                        '&.Mui-selected': {
                          backgroundColor: '#9333ea30',
                        },
                      },
                    },
                  },
                }}
              >
                <MenuItem value="all">
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: lora.style.fontFamily,
                      fontWeight: 500,
                      color: '#9333ea',
                    }}
                  >
                    ALL
                  </Typography>
                </MenuItem>
                {availableLanguages.map((language) => (
                  <MenuItem key={language} value={language}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: lora.style.fontFamily,
                        fontWeight: 'bold',
                      }}
                    >
                      {getLanguageCode(language)}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>

      {disabled && (
        <Typography
          variant="caption"
          sx={{
            color: '#9333ea',
            mt: 1,
            display: 'block',
            textAlign: 'center',
            fontFamily: lora.style.fontFamily,
            fontStyle: 'italic',
          }}
        >
          Saving edition...
        </Typography>
      )}
    </Box>
  );
};
