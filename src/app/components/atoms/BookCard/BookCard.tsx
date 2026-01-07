import type HardcoverBook from '@/domain/HardcoverBook';
import { useBookDisplay } from '@/hooks/useBookDisplay';
import { lora } from '@/utils/fonts/fonts';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface BookCardProps {
  book: HardcoverBook;
  compact?: boolean;
}

export function BookCard({ book, compact = false }: BookCardProps) {
  const { title, coverUrl } = useBookDisplay(book);
  return (
    <MotionBox
      component="a"
      href={`/books/${book.id}`}
      key={book.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -6 }}
      transition={{ duration: 0.3 }}
      sx={{
        width: '100%',
        textDecoration: 'none',
        minWidth: 0,
        maxWidth: '100%',
        height: compact
          ? ['120px', '150px', '180px']
          : ['180px', '280px', '280px'],
        display: 'flex',
        flexDirection: 'row',
        justifyContent: ['start', 'start', 'start'],
        background:
          'linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(168, 85, 247, 0.05) 100%)',
        backdropFilter: 'blur(15px)',
        borderRadius: '24px',
        padding: compact ? '12px' : '16px',
        overflow: 'hidden',
        border: '1px solid rgba(147, 51, 234, 0.25)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s ease',
        '&:hover': {
          border: '1px solid rgba(147, 51, 234, 0.4)',
          boxShadow:
            '0 12px 32px rgba(147, 51, 234, 0.2), 0 0 40px rgba(147, 51, 234, 0.1)',
        },
      }}
    >
      <Box
        sx={{
          width: compact
            ? ['70px', '90px', '110px']
            : ['100px', '140px', '180px'],
          flexShrink: 0,
          height: '100%',
          borderRadius: '16px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Box
          component="img"
          sx={{
            width: { xs: '100%', md: '100%' },
            height: { xs: '100%', md: '100%' },
            objectFit: 'cover',
            borderRadius: '16px',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
          src={coverUrl}
          alt={title}
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'start',
          padding: compact ? { xs: '8px', md: '12px' } : '25px',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'start', md: 'center' },
            justifyContent: 'start',
            gap: { xs: '0px', md: '8px' },
            width: '100%',
          }}
        >
          <Typography
            sx={{
              color: 'white',
              fontSize: compact
                ? { xs: '14px', md: '18px' }
                : { xs: '18px', md: '28px' },
              letterSpacing: '.05rem',
              fontWeight: '800',
              fontFamily: lora.style.fontFamily,
              textAlign: 'left',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              width: '100%',
            }}
            variant="h6"
          >
            {title}
          </Typography>
          {book.series && book.series.length > 0 && book.series[0]?.name && (
            <Typography
              sx={{
                color: '#FFFFFF45',
                fontSize: compact
                  ? { xs: '12px', md: '14px' }
                  : { xs: '16px', md: '22px' },
                fontWeight: 'thin',
                fontFamily: lora.style.fontFamily,
                letterSpacing: '.05rem',
                textAlign: 'left',
                fontStyle: 'italic',
                whiteSpace: 'nowrap',
              }}
              variant="h6"
            >
              ({book.series[0].name})
            </Typography>
          )}
        </Box>
        <Typography
          sx={{
            color: '#FFFFFF31',
            fontSize: compact
              ? { xs: '11px', md: '14px' }
              : { xs: '14px', md: '20px' },
            fontWeight: 'bold',
            textAlign: 'left',
            marginTop: { xs: '0px', md: '-10px' },
            letterSpacing: '.05rem',
            width: '100%',
            fontFamily: lora.style.fontFamily,
          }}
          variant="h6"
        >
          {book.author.name}
        </Typography>
        {book.description && !compact && (
          <Typography
            sx={{
              display: { xs: 'none', md: '-webkit-box' },
              color: '#FFFFFF',
              marginTop: '10px',
              fontSize: '16px',
              fontFamily: lora.style.fontFamily,
              fontWeight: 'thin',
              flexDirection: 'row',
              alignItems: 'start',
              justifyContent: 'start',
              whiteSpace: 'pre-wrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              lineClamp: 4,
              boxOrient: 'vertical',
              width: '100%',
              textAlign: 'left',
            }}
            dangerouslySetInnerHTML={{ __html: book.description }}
            variant="h6"
          />
        )}
        <Typography
          sx={{
            color: '#FFFFFF50',
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'left',
            marginTop: '10px',
            position: 'absolute',
            fontFamily: lora.style.fontFamily,
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'start',
            gap: '5px',
            letterSpacing: '.05rem',

            bottom: '0',
            transition: 'all 0.3s ease',
            '&:hover': {
              color: '#FFFFFF',
              transform: 'translateX(5px)',
            },
          }}
        >
          Leer Más{' '}
          <ArrowForwardIcon sx={{ fontSize: '14px', marginLeft: '5px' }} />
        </Typography>
      </Box>
    </MotionBox>
  );
}
