import { EBookStatus } from '@gycoding/nebula';
import { Button, Stack } from '@mui/material';
import React from 'react';
import { StatusOption, statusOptions } from './BookRatingOptions';

interface Props {
  tempStatus: EBookStatus;
  setTempStatus: (status: EBookStatus) => void;
  fontFamily: string;
}

const BookRatingStatusButtons: React.FC<Props> = ({
  tempStatus,
  setTempStatus,
  fontFamily,
}) => (
  <Stack direction="row" spacing={1.5} justifyContent="flex-start">
    {statusOptions.map((opt: StatusOption) => (
      <Button
        key={opt.value}
        variant={tempStatus === opt.value ? 'contained' : 'outlined'}
        startIcon={React.cloneElement(opt.icon, {
          sx: {
            color:
              tempStatus === opt.value ? '#fff' : 'rgba(147, 51, 234, 0.8)',
            fontSize: 18,
          },
        })}
        onClick={() => setTempStatus(opt.value)}
        sx={{
          flex: 1,
          borderRadius: '10px',
          fontWeight: 600,
          fontSize: 14,
          color: tempStatus === opt.value ? '#fff' : 'rgba(147, 51, 234, 0.9)',
          background:
            tempStatus === opt.value
              ? 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)'
              : 'rgba(147, 51, 234, 0.05)',
          borderColor:
            tempStatus === opt.value
              ? 'transparent'
              : 'rgba(147, 51, 234, 0.2)',
          px: 2,
          py: 1.2,
          textTransform: 'none',
          fontFamily,
          whiteSpace: 'nowrap',
          transition: 'all 0.2s ease',
          '&:hover': {
            background:
              tempStatus === opt.value
                ? 'linear-gradient(135deg, #7e22ce 0%, #6b21a8 100%)'
                : 'rgba(147, 51, 234, 0.1)',
            borderColor:
              tempStatus === opt.value
                ? 'transparent'
                : 'rgba(147, 51, 234, 0.3)',
            transform: 'translateY(-1px)',
          },
        }}
      >
        {opt.label}
      </Button>
    ))}
  </Stack>
);

export default BookRatingStatusButtons;
