'use client';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SpeedIcon from '@mui/icons-material/Speed';
import { Box, Typography } from '@mui/material';
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
} from '@mui/x-charts/Gauge';
import React from 'react';

interface AvgReadingDaysProps {
  avgReadingDays: number;
  fontFamily: string;
}

function getSpeedLabel(days: number): { label: string; color: string } {
  if (days === 0)
    return { label: 'No data yet', color: 'rgba(255,255,255,0.4)' };
  if (days <= 5) return { label: 'Speed reader', color: '#34d399' };
  if (days <= 14) return { label: 'Steady reader', color: '#60a5fa' };
  if (days <= 30) return { label: 'Casual reader', color: '#a855f7' };
  return { label: 'Slow & steady', color: '#f59e0b' };
}

// Gauge goes 0–60 days; clamp to 60 for display
const MAX_DAYS = 60;

const AvgReadingDays: React.FC<AvgReadingDaysProps> = ({
  avgReadingDays,
  fontFamily,
}) => {
  const { label, color } = getSpeedLabel(avgReadingDays);
  const gaugeValue = Math.min(avgReadingDays, MAX_DAYS);

  if (avgReadingDays === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 300,
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <AccessTimeIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 40 }} />
        <Typography
          sx={{ color: 'rgba(255,255,255,0.5)', fontFamily, fontSize: 15 }}
        >
          Add start & end dates to your books to see this stat
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        width: '100%',
        height: '100%',
      }}
    >
      {/* Gauge */}
      <Box sx={{ position: 'relative', width: 200, height: 130 }}>
        <GaugeContainer
          width={200}
          height={130}
          startAngle={-110}
          endAngle={110}
          value={gaugeValue}
          valueMin={0}
          valueMax={MAX_DAYS}
        >
          <GaugeReferenceArc />
          <GaugeValueArc style={{ fill: color }} />
        </GaugeContainer>

        {/* Center label */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              color,
              fontFamily,
              fontSize: '2rem',
              fontWeight: 'bold',
              lineHeight: 1,
            }}
          >
            {avgReadingDays}
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.5)',
              fontFamily,
              fontSize: '0.75rem',
            }}
          >
            days
          </Typography>
        </Box>
      </Box>

      {/* Label */}
      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: 'center',
          }}
        >
          <SpeedIcon sx={{ color, fontSize: 20 }} />
          <Typography
            sx={{ color, fontFamily, fontSize: '1.1rem', fontWeight: 600 }}
          >
            {label}
          </Typography>
        </Box>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.5)',
            fontFamily,
            fontSize: '0.85rem',
            mt: 0.5,
          }}
        >
          Avg. days per book
        </Typography>
      </Box>

      {/* Scale reference */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          mt: 1,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {[
          { label: '≤5d · Speed reader', color: '#34d399' },
          { label: '≤14d · Steady', color: '#60a5fa' },
          { label: '≤30d · Casual', color: '#a855f7' },
          { label: '>30d · Slow & steady', color: '#f59e0b' },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: item.color,
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.45)',
                fontFamily,
                fontSize: '0.7rem',
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AvgReadingDays;
