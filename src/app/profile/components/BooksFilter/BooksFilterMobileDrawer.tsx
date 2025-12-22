import React, { useEffect } from 'react';
import {
  Drawer,
  Box,
  Stack,
  Typography,
  Divider,
  Button,
  FormControl,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloseIcon from '@mui/icons-material/Close';
import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';

interface BooksFilterMobileDrawerProps {
  open: boolean;
  onClose: () => void;
  statusOptions: { label: string; value: EBookStatus }[];
  statusFilter: EBookStatus | null;
  authorOptions: string[];
  seriesOptions: string[];
  authorFilter: string;
  seriesFilter: string;
  ratingFilter: number;
  search: string;
  onStatusChange: (status: EBookStatus | null) => void;
  onAuthorChange: (author: string) => void;
  onSeriesChange: (series: string) => void;
  onRatingChange: (rating: number) => void;
  onSearchChange: (search: string) => void;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
  onOrderByChange: (orderBy: string) => void;
  onOrderDirectionChange: (direction: 'asc' | 'desc') => void;
}

export const BooksFilterMobileDrawer: React.FC<
  BooksFilterMobileDrawerProps
> = ({
  open,
  onClose,
  statusOptions,
  statusFilter,
  authorOptions,
  seriesOptions,
  authorFilter,
  seriesFilter,
  ratingFilter,
  search,
  onStatusChange,
  onAuthorChange,
  onSeriesChange,
  onRatingChange,
  onSearchChange,
  orderBy,
  orderDirection,
  onOrderByChange,
  onOrderDirectionChange,
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  const orderOptions = [
    { label: 'Author', value: 'author' },
    { label: 'Rating', value: 'rating' },
    { label: 'Series', value: 'series' },
    { label: 'Title', value: 'title' },
  ];
  const ratingOptions = [
    { label: 'All', value: 0 },
    ...[1, 2, 3, 4, 5].map((star) => ({
      label: `${'★'.repeat(star)} ${star}${star < 5 ? '+' : ''}`,
      value: star,
    })),
  ];

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          pb: 2,
          background:
            'linear-gradient(135deg, rgba(147, 51, 234, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(147, 51, 234, 0.3)',
          minHeight: 380,
        },
      }}
    >
      <Box sx={{ p: 3, position: 'relative' }}>
        {/* Botón X para cerrar el drawer */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: '#fff',
            zIndex: 10,
            background:
              'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            borderRadius: '50%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            '&:hover': {
              background:
                'linear-gradient(135deg, rgba(147, 51, 234, 0.25) 0%, rgba(168, 85, 247, 0.15) 100%)',
              border: '1px solid rgba(147, 51, 234, 0.5)',
            },
          }}
          aria-label="Close filters"
        >
          <CloseIcon sx={{ fontSize: 28 }} />
        </IconButton>
        <Stack spacing={2} alignItems="stretch" sx={{ mt: 2 }}>
          <Typography
            sx={{
              color: '#fff',
              fontWeight: 'bold',
              mb: 0.5,
              fontSize: 20,
              fontFamily: lora.style.fontFamily,
              letterSpacing: '.05rem',
            }}
          >
            Filters
          </Typography>
          <TextField
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search books..."
            variant="outlined"
            size="small"
            sx={{
              background:
                'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(147, 51, 234, 0.3)',
              borderRadius: '10px',
              minWidth: 110,
              input: {
                color: '#fff',
                fontFamily: lora.style.fontFamily,
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                  borderRadius: '10px',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(147, 51, 234, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#9333ea',
                  borderWidth: 2,
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9333ea' }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ minWidth: 110 }}>
            <Select
              value={ratingFilter}
              onChange={(e) => onRatingChange(Number(e.target.value))}
              displayEmpty
              sx={{
                color: '#fff',
                fontWeight: 500,
                fontSize: 15,
                fontFamily: lora.style.fontFamily,
                background:
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                borderRadius: '10px',
                boxShadow: 'none',
                minHeight: 40,
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                '& .MuiSvgIcon-root': { color: '#9333ea' },
                '&:hover': {
                  border: '1px solid rgba(147, 51, 234, 0.5)',
                },
              }}
            >
              {ratingOptions.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                  sx={{ color: '#fff', fontWeight: 500 }}
                >
                  <span style={{ fontFamily: lora.style.fontFamily }}>
                    {opt.label}
                  </span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 110 }}>
            <Select
              value={statusFilter ?? ''}
              onChange={(e) => onStatusChange(e.target.value as EBookStatus)}
              displayEmpty
              sx={{
                color: '#fff',
                fontWeight: 500,
                fontSize: 15,
                fontFamily: lora.style.fontFamily,
                background:
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                borderRadius: '10px',
                boxShadow: 'none',
                minHeight: 40,
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                '& .MuiSvgIcon-root': { color: '#9333ea' },
                '&:hover': {
                  border: '1px solid rgba(147, 51, 234, 0.5)',
                },
              }}
            >
              <MenuItem
                value=""
                sx={{
                  color: '#8C54FF',
                  fontWeight: 500,
                  fontFamily: lora.style.fontFamily,
                }}
              >
                Status
              </MenuItem>
              {statusOptions.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                  sx={{ color: '#fff', fontWeight: 500 }}
                >
                  <span style={{ fontFamily: lora.style.fontFamily }}>
                    {opt.label}
                  </span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 110 }}>
            <Select
              value={authorFilter}
              onChange={(e) => onAuthorChange(e.target.value)}
              displayEmpty
              sx={{
                color: '#fff',
                fontWeight: 500,
                fontSize: 15,
                fontFamily: lora.style.fontFamily,
                background:
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                borderRadius: '10px',
                boxShadow: 'none',
                minHeight: 40,
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                '& .MuiSvgIcon-root': { color: '#9333ea' },
                '&:hover': {
                  border: '1px solid rgba(147, 51, 234, 0.5)',
                },
              }}
            >
              <MenuItem
                value=""
                sx={{
                  color: '#8C54FF',
                  fontWeight: 500,
                  fontFamily: lora.style.fontFamily,
                }}
              >
                Author
              </MenuItem>
              {authorOptions.map((opt) => (
                <MenuItem
                  key={opt}
                  value={opt}
                  sx={{ color: '#fff', fontWeight: 500 }}
                >
                  <span style={{ fontFamily: lora.style.fontFamily }}>
                    {opt}
                  </span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 110 }}>
            <Select
              value={seriesFilter}
              onChange={(e) => onSeriesChange(e.target.value)}
              displayEmpty
              sx={{
                color: '#fff',
                fontWeight: 500,
                fontSize: 15,
                fontFamily: lora.style.fontFamily,
                background:
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                borderRadius: '10px',
                boxShadow: 'none',
                minHeight: 40,
                '.MuiOutlinedInput-notchedOutline': { border: 0 },
                '& .MuiSvgIcon-root': { color: '#9333ea' },
                '&:hover': {
                  border: '1px solid rgba(147, 51, 234, 0.5)',
                },
              }}
            >
              <MenuItem
                value=""
                sx={{
                  color: '#8C54FF',
                  fontWeight: 500,
                  fontFamily: lora.style.fontFamily,
                }}
              >
                Series
              </MenuItem>
              {seriesOptions.map((opt) => (
                <MenuItem
                  key={opt}
                  value={opt}
                  sx={{ color: '#fff', fontWeight: 500 }}
                >
                  <span style={{ fontFamily: lora.style.fontFamily }}>
                    {opt}
                  </span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Divider sx={{ borderColor: '#8C54FF30' }} />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography
              sx={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 18,
                fontFamily: lora.style.fontFamily,
              }}
            >
              Order by
            </Typography>
            <FormControl sx={{ minWidth: 110 }}>
              <Select
                value={orderBy}
                onChange={(e) => onOrderByChange(e.target.value)}
                displayEmpty
                sx={{
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: 15,
                  fontFamily: lora.style.fontFamily,
                  background:
                    'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(147, 51, 234, 0.3)',
                  borderRadius: '10px',
                  boxShadow: 'none',
                  minHeight: 40,
                  '.MuiOutlinedInput-notchedOutline': { border: 0 },
                  '& .MuiSvgIcon-root': { color: '#9333ea' },
                  '&:hover': {
                    border: '1px solid rgba(147, 51, 234, 0.5)',
                  },
                }}
              >
                {orderOptions.map((opt) => (
                  <MenuItem
                    key={opt.value}
                    value={opt.value}
                    sx={{ color: '#fff', fontWeight: 500 }}
                  >
                    <span style={{ fontFamily: lora.style.fontFamily }}>
                      {opt.label}
                    </span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={() =>
                onOrderDirectionChange(
                  orderDirection === 'asc' ? 'desc' : 'asc'
                )
              }
              sx={{
                minWidth: 40,
                height: 40,
                borderRadius: '10px',
                px: 0,
                color: '#fff',
                background:
                  'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(147, 51, 234, 0.3)',
                fontFamily: lora.style.fontFamily,
                fontWeight: 500,
                fontSize: 15,
                boxShadow: 'none',
                textTransform: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                '&:hover': {
                  background:
                    'linear-gradient(135deg, rgba(147, 51, 234, 0.25) 0%, rgba(168, 85, 247, 0.15) 100%)',
                  border: '1px solid rgba(147, 51, 234, 0.5)',
                },
              }}
            >
              {orderDirection === 'asc' ? (
                <ArrowUpwardIcon fontSize="small" />
              ) : (
                <ArrowDownwardIcon fontSize="small" />
              )}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
};
