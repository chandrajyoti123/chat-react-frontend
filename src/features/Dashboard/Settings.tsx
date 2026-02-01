import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MessageSquare,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { useAuthControllerLogout } from '@/api/generated';
import { useNavigate } from 'react-router-dom';

type SettingsProps = {
  // user: UserType;
  // onBack: () => void;
  // onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

const Settings: React.FC<SettingsProps> = ({ theme, onToggleTheme }) => {
  const navigate = useNavigate();
  const logoutFn = useAuthStore.getState().logout;
  const { user } = useAuthStore();
  const logoutMutation = useAuthControllerLogout();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', px: 2, py: 1.5, boxShadow: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton
            onClick={() => {
              navigate(-1);
            }}
            sx={{
              color: 'white',
              '&:hover': {
                color: 'rgba(197, 202, 233, 1)',
              },
            }}
          >
            <ArrowLeft size={24} />
          </IconButton>
          <Typography variant="h6" sx={{ color: 'white' }}>
            Settings
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: 672,
          mx: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 2,
        }}
      >
        {/* Profile Section */}
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
              Profile Information
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #3F51B5 0%, #42A5F5 100%)',
                  fontSize: '2rem',
                  boxShadow: 4,
                }}
              >
                {user?.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ color: 'text.primary' }}>
                  {user?.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {user?.about}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  bgcolor: (theme) => (theme.palette.mode === 'light' ? '#FAFAFA' : '#374151'),
                  borderRadius: 2,
                  border: 1,
                  borderColor: (theme) => (theme.palette.mode === 'light' ? '#E5E7EB' : '#4B5563'),
                }}
              >
                <User size={20} color="#3F51B5" />
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Name
                  </Typography>
                  <Typography sx={{ color: 'text.primary' }}>{user?.name}</Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  bgcolor: (theme) => (theme.palette.mode === 'light' ? '#FAFAFA' : '#374151'),
                  borderRadius: 2,
                  border: 1,
                  borderColor: (theme) => (theme.palette.mode === 'light' ? '#E5E7EB' : '#4B5563'),
                }}
              >
                <Mail size={20} color="#3F51B5" />
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Email
                  </Typography>
                  <Typography sx={{ color: 'text.primary' }}>{user?.email}</Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  bgcolor: (theme) => (theme.palette.mode === 'light' ? '#FAFAFA' : '#374151'),
                  borderRadius: 2,
                  border: 1,
                  borderColor: (theme) => (theme.palette.mode === 'light' ? '#E5E7EB' : '#4B5563'),
                }}
              >
                <Phone size={20} color="#3F51B5" />
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Phone
                  </Typography>
                  <Typography sx={{ color: 'text.primary' }}>{user?.phone}</Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  bgcolor: (theme) => (theme.palette.mode === 'light' ? '#FAFAFA' : '#374151'),
                  borderRadius: 2,
                  border: 1,
                  borderColor: (theme) => (theme.palette.mode === 'light' ? '#E5E7EB' : '#4B5563'),
                }}
              >
                <MessageSquare size={20} color="#3F51B5" />
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Status
                  </Typography>
                  <Typography sx={{ color: 'text.primary' }}>{user?.about}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* App Settings */}
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
              App Settings
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box
                onClick={onToggleTheme}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  cursor: 'pointer',
                  borderRadius: 2,
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    bgcolor: (theme) => (theme.palette.mode === 'light' ? '#FAFAFA' : '#374151'),
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {theme === 'light' ? (
                    <Moon size={20} color="#3F51B5" />
                  ) : (
                    <Sun size={20} color="#3F51B5" />
                  )}
                  <Typography sx={{ color: 'text.primary' }}>Theme</Typography>
                </Box>
                <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                  {theme}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  cursor: 'pointer',
                  borderRadius: 2,
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    bgcolor: (theme) => (theme.palette.mode === 'light' ? '#FAFAFA' : '#374151'),
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Bell size={20} color="#3F51B5" />
                  <Typography sx={{ color: 'text.primary' }}>Notifications</Typography>
                </Box>
                <Typography sx={{ color: 'text.secondary' }}>Enabled</Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  cursor: 'pointer',
                  borderRadius: 2,
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    bgcolor: (theme) => (theme.palette.mode === 'light' ? '#FAFAFA' : '#374151'),
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Shield size={20} color="#3F51B5" />
                  <Typography sx={{ color: 'text.primary' }}>Privacy</Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.5,
                  cursor: 'pointer',
                  borderRadius: 2,
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    bgcolor: (theme) => (theme.palette.mode === 'light' ? '#FAFAFA' : '#374151'),
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <HelpCircle size={20} color="#3F51B5" />
                  <Typography sx={{ color: 'text.primary' }}>Help & Support</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Logout Section */}
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 3 }}>
            <Button
              onClick={() => setShowLogoutConfirm(true)}
              fullWidth
              startIcon={<LogOut size={20} />}
              sx={{
                py: 1.5,
                bgcolor: (theme) =>
                  theme.palette.mode === 'light'
                    ? 'rgba(239, 68, 68, 0.1)'
                    : 'rgba(220, 38, 38, 0.2)',
                color: 'error.main',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: (theme) =>
                    theme.palette.mode === 'light'
                      ? 'rgba(239, 68, 68, 0.2)'
                      : 'rgba(220, 38, 38, 0.3)',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Logout Confirmation Modal */}
      <Dialog
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ color: 'text.primary' }}>Logout</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions sx={{ gap: 1.5, px: 3, pb: 2 }}>
          <Button
            onClick={() => setShowLogoutConfirm(false)}
            variant="outlined"
            sx={{
              flex: 1,
              py: 1,
              textTransform: 'none',
              borderColor: (theme) => (theme.palette.mode === 'light' ? '#E5E7EB' : '#4B5563'),
              color: 'text.primary',
              '&:hover': {
                borderColor: (theme) => (theme.palette.mode === 'light' ? '#D1D5DB' : '#374151'),
                bgcolor: (theme) => (theme.palette.mode === 'light' ? '#F5F5F5' : '#4B5563'),
              },
            }}
          >
            Cancel
          </Button>
          <Button
            // onClick={onLogout}
            onClick={
              () =>
                logoutMutation.mutate(undefined, {
                  onSuccess: () => logoutFn(),
                })
              //  logoutFn()
            }
            variant="contained"
            sx={{
              flex: 1,
              py: 1,
              bgcolor: 'error.main',
              textTransform: 'none',
              boxShadow: 3,
              '&:hover': {
                bgcolor: 'error.dark',
              },
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default Settings;
