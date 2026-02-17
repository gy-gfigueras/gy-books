/* eslint-disable @typescript-eslint/no-explicit-any */

import { lora } from '@/utils/fonts/fonts';
import { EBookStatus } from '@gycoding/nebula';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import {
  Badge,
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { BooksViewToggle, ViewType } from '../BooksViewToggle/BooksViewToggle';
import { ActiveFiltersChips } from './ActiveFiltersChips';
import { BooksFilterMobileDrawer } from './BooksFilterMobileDrawer';

const MotionIconButton = motion(IconButton);

interface CompactBooksFilterProps {
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
  view?: ViewType;
  onViewChange?: (view: ViewType) => void;
  isOwnProfile?: boolean;
}

export const CompactBooksFilter: React.FC<CompactBooksFilterProps> = ({
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
  view,
  onViewChange,
  isOwnProfile = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [orderMenuAnchor, setOrderMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Opciones de ordenamiento
  const orderOptions = [
    { label: 'Original', value: '' },
    { label: 'Author', value: 'author' },
    { label: 'Rating', value: 'rating' },
    { label: 'Series', value: 'series' },
    { label: 'Title', value: 'title' },
  ];

  // Active filters calculation
  const activeFilters = [
    statusFilter && {
      type: 'status',
      label: `Status: ${statusOptions.find((o) => o.value === statusFilter)?.label}`,
      value: statusFilter,
    },
    authorFilter && {
      type: 'author',
      label: `Author: ${authorFilter}`,
      value: authorFilter,
    },
    seriesFilter && {
      type: 'series',
      label: `Series: ${seriesFilter}`,
      value: seriesFilter,
    },
    ratingFilter &&
      ratingFilter > 0 && {
        type: 'rating',
        label: `Rating: ${'★'.repeat(ratingFilter)}+`,
        value: ratingFilter,
      },
    search && {
      type: 'search',
      label: `Search: ${search}`,
      value: search,
    },
  ].filter(Boolean);

  const activeFiltersCount = activeFilters.length;

  const handleOrderMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOrderMenuAnchor(event.currentTarget);
  };

  const handleOrderMenuClose = () => {
    setOrderMenuAnchor(null);
  };

  const handleOrderChange = (value: string) => {
    onOrderByChange(value);
    handleOrderMenuClose();
  };

  const handleRemoveFilter = (type: string) => {
    switch (type) {
      case 'status':
        onStatusChange(null);
        break;
      case 'author':
        onAuthorChange('');
        break;
      case 'series':
        onSeriesChange('');
        break;
      case 'rating':
        onRatingChange(0);
        break;
      case 'search':
        onSearchChange('');
        break;
    }
  };

  const handleClearAll = () => {
    onStatusChange(null);
    onAuthorChange('');
    onSeriesChange('');
    onRatingChange(0);
    onSearchChange('');
  };

  // Rating options
  const ratingOptions = [
    { label: 'All', value: 0 },
    ...[1, 2, 3, 4, 5].map((star) => ({
      label: `${'★'.repeat(star)} ${star}${star < 5 ? '+' : ''}`,
      value: star,
    })),
  ];

  const renderSelect = (
    value: any,
    onChange: (v: any) => void,
    options: any[],
    placeholder: string
  ) => (
    <FormControl sx={{ minWidth: 100, flex: 1 }}>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        size="small"
        sx={{
          color: '#fff',
          fontWeight: 500,
          fontSize: 13,
          fontFamily: lora.style.fontFamily,
          background:
            'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(147, 51, 234, 0.3)',
          borderRadius: '8px',
          boxShadow: 'none',
          minHeight: 32,
          '.MuiOutlinedInput-notchedOutline': { border: 0 },
          '& .MuiSvgIcon-root': { color: '#9333ea', fontSize: 18 },
          '&:hover': {
            border: '1px solid rgba(147, 51, 234, 0.5)',
          },
        }}
      >
        <MenuItem
          value=""
          sx={{
            color: '#9333ea',
            fontWeight: 500,
            fontSize: 13,
            fontFamily: lora.style.fontFamily,
          }}
        >
          {placeholder}
        </MenuItem>
        {options.map((opt: any) => (
          <MenuItem
            key={opt.value ?? opt}
            value={opt.value ?? opt}
            sx={{ color: '#fff', fontWeight: 500, fontSize: 13 }}
          >
            <span style={{ fontFamily: lora.style.fontFamily }}>
              {opt.label ?? opt}
            </span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderOrderButton = () => (
    <Tooltip title="Sort" arrow>
      <MotionIconButton
        onClick={handleOrderMenuOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        sx={{
          background: orderBy
            ? 'rgba(147, 51, 234, 0.15)'
            : 'rgba(147, 51, 234, 0.1)',
          backdropFilter: 'blur(10px)',
          border: `1px solid rgba(147, 51, 234, ${orderBy ? '0.3' : '0.2'})`,
          color: orderBy ? '#9333ea' : '#a855f7',
          width: 32,
          height: 32,
          '&:hover': {
            background: 'rgba(147, 51, 234, 0.2)',
            borderColor: 'rgba(147, 51, 234, 0.3)',
          },
        }}
      >
        <SortIcon sx={{ fontSize: 16 }} />
      </MotionIconButton>
    </Tooltip>
  );

  // Mobile version - solo botón que abre drawer
  if (isMobile) {
    return (
      <>
        {/* Botón de filtros */}
        <Tooltip title="Filters & Views" arrow>
          <Badge badgeContent={activeFiltersCount} color="secondary">
            <MotionIconButton
              onClick={() => setMobileDrawerOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                background: 'rgba(147, 51, 234, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(147, 51, 234, 0.2)',
                color: '#a855f7',
                width: 36,
                height: 36,
                '&:hover': {
                  background: 'rgba(147, 51, 234, 0.2)',
                  borderColor: 'rgba(147, 51, 234, 0.3)',
                },
              }}
            >
              <FilterListIcon sx={{ fontSize: 18 }} />
            </MotionIconButton>
          </Badge>
        </Tooltip>

        {/* Mobile Drawer con todo (view toggle + filtros + orden) */}
        <BooksFilterMobileDrawer
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          statusOptions={statusOptions}
          statusFilter={statusFilter}
          authorOptions={authorOptions}
          seriesOptions={seriesOptions}
          authorFilter={authorFilter}
          seriesFilter={seriesFilter}
          ratingFilter={ratingFilter}
          search={search}
          onStatusChange={onStatusChange}
          onAuthorChange={onAuthorChange}
          onSeriesChange={onSeriesChange}
          onRatingChange={onRatingChange}
          onSearchChange={onSearchChange}
          orderBy={orderBy}
          orderDirection={orderDirection}
          onOrderByChange={onOrderByChange}
          onOrderDirectionChange={onOrderDirectionChange}
          view={view}
          onViewChange={onViewChange}
          isOwnProfile={isOwnProfile}
        />
      </>
    );
  }

  // Desktop version - view toggle + botón, filtros se expanden hacia ABAJO
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Línea superior: View Toggle + Botón de Filtros */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {/* View Toggle */}
        {onViewChange && view !== undefined && (
          <BooksViewToggle
            view={view}
            onViewChange={onViewChange}
            isOwnProfile={isOwnProfile}
          />
        )}

        {/* Botón de expandir/colapsar filtros */}
        <Tooltip
          title={filtersExpanded ? 'Hide Filters' : 'Show Filters'}
          arrow
        >
          <MotionIconButton
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              background: filtersExpanded
                ? 'rgba(147, 51, 234, 0.15)'
                : 'rgba(147, 51, 234, 0.1)',
              backdropFilter: 'blur(10px)',
              border: `1px solid rgba(147, 51, 234, ${filtersExpanded ? '0.3' : '0.2'})`,
              color: filtersExpanded ? '#9333ea' : '#a855f7',
              width: 32,
              height: 32,
              position: 'relative',
              '&:hover': {
                background: 'rgba(147, 51, 234, 0.2)',
                borderColor: 'rgba(147, 51, 234, 0.3)',
              },
            }}
          >
            <Badge
              badgeContent={activeFiltersCount}
              color="secondary"
              sx={{
                '& .MuiBadge-badge': {
                  right: 2,
                  top: 2,
                  fontSize: 9,
                  height: 14,
                  minWidth: 14,
                  padding: '0 4px',
                },
              }}
            >
              {filtersExpanded ? (
                <ExpandLessIcon sx={{ fontSize: 16 }} />
              ) : (
                <FilterAltIcon sx={{ fontSize: 16 }} />
              )}
            </Badge>
          </MotionIconButton>
        </Tooltip>
      </Box>

      {/* Filtros expandidos - aparecen DEBAJO con posición absoluta */}
      <AnimatePresence>
        {filtersExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              zIndex: 1000,
              overflow: 'hidden',
              width: '100%',
              maxWidth: '700px',
              marginTop: 8,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                p: 2,
                background:
                  'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(20, 10, 40, 0.9) 100%)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Search */}
              <TextField
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search books..."
                size="small"
                fullWidth
                sx={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                  input: {
                    color: '#fff',
                    fontFamily: lora.style.fontFamily,
                    fontSize: 13,
                    py: 0.5,
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(147, 51, 234, 0.3)',
                      borderRadius: '8px',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(147, 51, 234, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#9333ea',
                      borderWidth: 1,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#9333ea', fontSize: 16 }} />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Active Filters Chips */}
              {activeFilters.length > 0 && (
                <ActiveFiltersChips
                  activeFilters={activeFilters}
                  onRemove={handleRemoveFilter}
                  onClearAll={handleClearAll}
                />
              )}

              {/* Filtros en fila */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  flexWrap: 'wrap',
                }}
              >
                {/* Status */}
                {renderSelect(
                  statusFilter ?? '',
                  onStatusChange,
                  statusOptions,
                  'Status'
                )}

                {/* Author */}
                {renderSelect(
                  authorFilter,
                  onAuthorChange,
                  authorOptions,
                  'Author'
                )}

                {/* Series */}
                {renderSelect(
                  seriesFilter,
                  onSeriesChange,
                  seriesOptions,
                  'Series'
                )}

                {/* Rating */}
                {renderSelect(
                  ratingFilter,
                  onRatingChange,
                  ratingOptions,
                  'Rating'
                )}

                {/* Sort button */}
                {renderOrderButton()}

                {/* Sort direction */}
                {orderBy && (
                  <Tooltip
                    title={`Sort ${orderDirection === 'asc' ? 'Ascending' : 'Descending'}`}
                    arrow
                  >
                    <MotionIconButton
                      onClick={() =>
                        onOrderDirectionChange(
                          orderDirection === 'asc' ? 'desc' : 'asc'
                        )
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      sx={{
                        background: 'rgba(147, 51, 234, 0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(147, 51, 234, 0.3)',
                        color: '#9333ea',
                        width: 32,
                        height: 32,
                        '&:hover': {
                          background: 'rgba(147, 51, 234, 0.2)',
                          borderColor: 'rgba(147, 51, 234, 0.3)',
                        },
                      }}
                    >
                      {orderDirection === 'asc' ? (
                        <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                      ) : (
                        <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                      )}
                    </MotionIconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu de ordenamiento */}
      <Menu
        anchorEl={orderMenuAnchor}
        open={Boolean(orderMenuAnchor)}
        onClose={handleOrderMenuClose}
        PaperProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            mt: 1,
          },
        }}
      >
        {orderOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleOrderChange(option.value)}
            selected={orderBy === option.value}
            sx={{
              color: orderBy === option.value ? '#9333ea' : '#fff',
              fontSize: 13,
              fontFamily: lora.style.fontFamily,
              '&.Mui-selected': {
                background: 'rgba(147, 51, 234, 0.2)',
              },
              '&:hover': {
                background: 'rgba(147, 51, 234, 0.1)',
              },
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
