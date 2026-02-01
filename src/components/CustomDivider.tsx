import { Divider } from '@mui/material';
import type { SxProps, Theme } from '@mui/system';

interface CustomDividerProps {
  orientation?: 'horizontal' | 'vertical';
  flexItem?: boolean;
  size?: string | number;
  sx?: SxProps<Theme>;
}

const CustomDivider: React.FC<CustomDividerProps> = ({
  orientation = 'horizontal',
  flexItem = false,
  sx = {},
  size,
}) => {
  return (
    <Divider
      orientation={orientation}
      flexItem={flexItem}
      sx={{
        ...(orientation === 'vertical'
          ? { width: size || '30px', height: 'auto' }
          : { height: size || '30px', width: 'auto' }),
        border: 'none',
        ...sx,
      }}
    />
  );
};

export const VerticalDivider: React.FC = () => {
  return <Divider orientation="vertical" flexItem sx={{ borderRight: '1px solid #B3B3B3' }} />;
};

export default CustomDivider;
