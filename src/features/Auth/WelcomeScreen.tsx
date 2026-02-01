import AuthContainer from '@/components/AuthContainer';
import { Box, Button, Typography } from '@mui/material';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  return (
    <AuthContainer>
      <Box sx={{ textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box
            sx={{
              background: (theme) => theme.palette.gradient.secondary,
              borderRadius: 4,
              p: 3,
              boxShadow: 4,
            }}
          >
            <MessageCircle size={64} color="white" strokeWidth={2.5} />
          </Box>
        </Box>

        <Typography variant="h2" sx={{ color: 'text.primary', mb: 1 }}>
          Welcome to ChatConnect
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          Connect with friends and family seamlessly
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              navigate('/EnterPhoneSignup');
            }}
            fullWidth
            sx={{
              py: 1.5,
              px: 3,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            Sign Up
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              navigate('/EnterPhoneLogin');
            }}
            fullWidth
            sx={{
              py: 1.5,
              px: 3,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </AuthContainer>
  );
};

export default WelcomeScreen;
