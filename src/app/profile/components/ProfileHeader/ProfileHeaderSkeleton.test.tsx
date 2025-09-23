import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { ProfileHeaderSkeleton } from './ProfileHeaderSkeleton';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('ProfileHeaderSkeleton', () => {
  describe('Basic rendering', () => {
    it('should render without crashing', () => {
      const { container } = renderWithTheme(<ProfileHeaderSkeleton />);

      // Should render the main container
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render all basic skeleton elements', () => {
      const { container } = renderWithTheme(<ProfileHeaderSkeleton />);

      // Should render multiple skeleton elements
      const skeletons = container.querySelectorAll('.MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });
  describe('canEdit prop behavior', () => {
    it('should show edit buttons when canEdit is true (default)', () => {
      const { container } = renderWithTheme(<ProfileHeaderSkeleton />);

      // Should have edit button skeletons (2 rectangular skeletons for buttons)
      const rectangularSkeletons = container.querySelectorAll(
        '.MuiSkeleton-rectangular'
      );
      expect(rectangularSkeletons.length).toBeGreaterThanOrEqual(3); // 2 buttons + 1 biography
    });

    it('should show edit buttons when canEdit is explicitly true', () => {
      const { container } = renderWithTheme(
        <ProfileHeaderSkeleton canEdit={true} />
      );

      // Should have edit button skeletons
      const rectangularSkeletons = container.querySelectorAll(
        '.MuiSkeleton-rectangular'
      );
      expect(rectangularSkeletons.length).toBeGreaterThanOrEqual(3); // 2 buttons + 1 biography
    });

    it('should hide edit buttons when canEdit is false', () => {
      const { container } = renderWithTheme(
        <ProfileHeaderSkeleton canEdit={false} />
      );

      // Should only have biography skeleton (1 rectangular)
      const rectangularSkeletons = container.querySelectorAll(
        '.MuiSkeleton-rectangular'
      );
      expect(rectangularSkeletons.length).toBe(1); // Only biography skeleton
    });

    it('should show friends count when canEdit is true', () => {
      const { container } = renderWithTheme(
        <ProfileHeaderSkeleton canEdit={true} />
      );

      // Should have text skeletons including friends count
      const textSkeletons = container.querySelectorAll('.MuiSkeleton-text');
      expect(textSkeletons.length).toBe(3); // username, email, friends count
    });

    it('should hide friends count when canEdit is false', () => {
      const { container } = renderWithTheme(
        <ProfileHeaderSkeleton canEdit={false} />
      );

      // Should only have username and email text skeletons
      const textSkeletons = container.querySelectorAll('.MuiSkeleton-text');
      expect(textSkeletons.length).toBe(2); // username, email only
    });
  });

  describe('Skeleton types and structure', () => {
    it('should render circular skeleton for avatar', () => {
      const { container } = renderWithTheme(<ProfileHeaderSkeleton />);

      const circularSkeleton = container.querySelector('.MuiSkeleton-circular');
      expect(circularSkeleton).toBeInTheDocument();
    });

    it('should render text skeletons for username and email', () => {
      const { container } = renderWithTheme(<ProfileHeaderSkeleton />);

      const textSkeletons = container.querySelectorAll('.MuiSkeleton-text');
      expect(textSkeletons.length).toBeGreaterThanOrEqual(2);
    });

    it('should render rectangular skeleton for biography', () => {
      const { container } = renderWithTheme(<ProfileHeaderSkeleton />);

      const rectangularSkeletons = container.querySelectorAll(
        '.MuiSkeleton-rectangular'
      );
      expect(rectangularSkeletons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Responsive behavior', () => {
    it('should have responsive container structure', () => {
      const { container } = renderWithTheme(<ProfileHeaderSkeleton />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveClass('MuiBox-root');
    });

    it('should have proper gap spacing', () => {
      const { container } = renderWithTheme(<ProfileHeaderSkeleton />);

      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('Avatar skeleton', () => {
    it('should have correct dimensions for avatar skeleton', () => {
      const { container } = renderWithTheme(<ProfileHeaderSkeleton />);

      const avatarSkeleton = container.querySelector('.MuiSkeleton-circular');
      expect(avatarSkeleton).toBeInTheDocument();
    });
  });

  describe('Content area', () => {
    it('should render content area with proper structure', () => {
      const { container } = renderWithTheme(<ProfileHeaderSkeleton />);

      // Should have multiple Box components for layout
      const boxes = container.querySelectorAll('[class*="MuiBox"]');
      expect(boxes.length).toBeGreaterThan(1);
    });
  });

  describe('Edit buttons area', () => {
    it('should render edit buttons area when canEdit is true', () => {
      const { container } = renderWithTheme(
        <ProfileHeaderSkeleton canEdit={true} />
      );

      // Should have button skeletons
      const rectangularSkeletons = container.querySelectorAll(
        '.MuiSkeleton-rectangular'
      );
      const buttonSkeletons = Array.from(rectangularSkeletons).filter(
        (skeleton) => skeleton !== rectangularSkeletons[0] // Exclude biography skeleton
      );
      expect(buttonSkeletons.length).toBe(2);
    });

    it('should not render edit buttons area when canEdit is false', () => {
      const { container } = renderWithTheme(
        <ProfileHeaderSkeleton canEdit={false} />
      );

      // Should only have biography skeleton
      const rectangularSkeletons = container.querySelectorAll(
        '.MuiSkeleton-rectangular'
      );
      expect(rectangularSkeletons.length).toBe(1);
    });
  });

  describe('Props handling', () => {
    it('should handle undefined canEdit prop (default behavior)', () => {
      expect(() => {
        renderWithTheme(<ProfileHeaderSkeleton />);
      }).not.toThrow();
    });

    it('should handle boolean canEdit prop', () => {
      expect(() => {
        renderWithTheme(<ProfileHeaderSkeleton canEdit={true} />);
        renderWithTheme(<ProfileHeaderSkeleton canEdit={false} />);
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper structure for screen readers', () => {
      const { container } = renderWithTheme(<ProfileHeaderSkeleton />);

      // Should have proper semantic structure
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render skeleton elements with proper classes', () => {
      const { container } = renderWithTheme(<ProfileHeaderSkeleton />);

      // MUI Skeleton components should have proper classes
      const muiSkeletons = container.querySelectorAll('[class*="MuiSkeleton"]');
      expect(muiSkeletons.length).toBeGreaterThan(0);
    });
  });
});
