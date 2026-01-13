'use client';

import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { motion } from 'framer-motion';
import HardcoverBook from '@/domain/HardcoverBook';
import { getBookDisplayData } from '@/hooks/useBookDisplay';
import { EBookStatus } from '@gycoding/nebula';
import EditIcon from '@mui/icons-material/Edit';

interface ReadingGoalProgressProps {
  books: HardcoverBook[];
  isLoading: boolean;
}

export const ReadingGoalProgress: React.FC<ReadingGoalProgressProps> = ({
  books,
  isLoading,
}) => {
  const [goal, setGoal] = useState(50); // Default goal
  const [openDialog, setOpenDialog] = useState(false);
  const [tempGoal, setTempGoal] = useState(goal.toString());

  const currentYear = new Date().getFullYear();

  const booksReadByYear = useMemo(() => {
    console.log('📚 [ReadingGoal] Total books received:', books.length);

    const filtered = books.filter((book) => {
      const displayData = getBookDisplayData(book);
      if (displayData?.status !== EBookStatus.READ) return false;

      const endDate = book.userData?.endDate;
      if (!endDate) {
        console.log(
          '⚠️ [ReadingGoal] Book without endDate:',
          book.id,
          book.userData
        );
        return false;
      }

      console.log('✅ [ReadingGoal] Book with endDate:', {
        id: book.id,
        endDate,
        year: new Date(endDate).getFullYear(),
      });

      return true;
    });

    console.log('📊 [ReadingGoal] Books with endDate:', filtered.length);
    return filtered;
  }, [books]);

  const booksReadThisYear = useMemo(() => {
    const filtered = booksReadByYear.filter((book) => {
      const endDate = book.userData?.endDate;
      const finishedYear = new Date(endDate!).getFullYear();
      return finishedYear === currentYear;
    });

    console.log(
      `📅 [ReadingGoal] Books read in ${currentYear}:`,
      filtered.length
    );
    return filtered.length;
  }, [booksReadByYear, currentYear]);

  const booksReadLastYear = useMemo(() => {
    const lastYear = currentYear - 1;
    const filtered = booksReadByYear.filter((book) => {
      const endDate = book.userData?.endDate;
      const finishedYear = new Date(endDate!).getFullYear();
      return finishedYear === lastYear;
    });

    console.log(`📅 [ReadingGoal] Books read in ${lastYear}:`, filtered.length);
    return filtered.length;
  }, [booksReadByYear, currentYear]);

  // Si ha leído al menos 1 libro este año, mostrar este año; sino el anterior
  const displayYear = booksReadThisYear > 0 ? currentYear : currentYear - 1;
  const booksRead =
    booksReadThisYear > 0 ? booksReadThisYear : booksReadLastYear;

  console.log('🎯 [ReadingGoal] Display year:', displayYear);
  console.log('🎯 [ReadingGoal] Books to display:', booksRead);
  console.log('---');

  const progressPercentage =
    goal > 0 ? Math.min((booksRead / goal) * 100, 100) : 0;

  const motivationalMessage = useMemo(() => {
    if (progressPercentage === 0) return 'Start your reading journey!';
    if (progressPercentage < 25) return 'Great start! Keep going!';
    if (progressPercentage < 50) return "You're making progress!";
    if (progressPercentage < 75) return 'Halfway there! Amazing!';
    if (progressPercentage < 100) return 'Almost there! You got this!';
    return 'Goal achieved! 🎉';
  }, [progressPercentage]);

  const handleUpdateGoal = () => {
    const newGoal = parseInt(tempGoal);
    if (newGoal > 0 && newGoal <= 1000) {
      setGoal(newGoal);
      setOpenDialog(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 700,
              }}
            >
              {displayYear} Reading Goal
            </Typography>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => {
                setTempGoal(goal.toString());
                setOpenDialog(true);
              }}
              sx={{
                color: '#9333ea',
                textTransform: 'none',
                '&:hover': {
                  background: 'rgba(147, 51, 234, 0.1)',
                },
              }}
            >
              Edit
            </Button>
          </Box>

          <Paper
            sx={{
              background:
                'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(147, 51, 234, 0.05) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: 3,
              border: '1px solid rgba(147, 51, 234, 0.3)',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'inline-flex',
                mb: 2,
              }}
            >
              <CircularProgress
                variant="determinate"
                value={progressPercentage}
                size={140}
                thickness={4}
                sx={{
                  color: '#9333ea',
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                  },
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                  }}
                >
                  {isLoading ? '...' : booksRead}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  of {goal}
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                mb: 1,
              }}
            >
              {motivationalMessage}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: '#9333ea',
                fontWeight: 600,
              }}
            >
              {Math.round(progressPercentage)}% completed
            </Typography>
          </Paper>
        </Box>
      </motion.div>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            background:
              'linear-gradient(135deg, rgba(147, 51, 234, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(147, 51, 234, 0.3)',
          },
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Update Reading Goal</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={`Books to read in ${currentYear}`}
            type="number"
            fullWidth
            value={tempGoal}
            onChange={(e) => setTempGoal(e.target.value)}
            inputProps={{ min: 1, max: 1000 }}
            sx={{
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              '& .MuiInputBase-input': { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(147, 51, 234, 0.5)' },
                '&:hover fieldset': { borderColor: 'rgba(147, 51, 234, 0.7)' },
                '&.Mui-focused fieldset': { borderColor: '#9333ea' },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Cancel
          </Button>
          <Button onClick={handleUpdateGoal} sx={{ color: '#9333ea' }}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
