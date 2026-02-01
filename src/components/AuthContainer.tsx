import React, { type ReactNode } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type AuthContainerProps = {
  children: ReactNode;
};

const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) => theme.palette.gradient.primary,
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 6,
          p: 6,
          width: '100%',
          maxWidth: 448,
          mx: 2,
        }}
      >
        <IconButton
          onClick={() => {
            navigate(-1);
          }}
          sx={{
            mb: 3,
            color: 'primary.main',
            '&:hover': {
              color: 'primary.dark',
            },
          }}
        >
          <ArrowLeft size={24} />
        </IconButton>
        {children}
      </Box>
    </Box>
  );
};

export default AuthContainer;
