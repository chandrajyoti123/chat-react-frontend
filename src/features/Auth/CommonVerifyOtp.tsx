import { useAuthControllerVerifyOtp, type VerifyOtpDto } from '@/api/generated';
import AuthContainer from '@/components/AuthContainer';
import { useAuthStore } from '@/store/auth';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Typography } from '@mui/material';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import OtpFormField from '@/components/FormFields/OtpFormField';
import { useState } from 'react';
const VerifyOtpSchema = Yup.object().shape({
  otp: Yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
});

const CommonVerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const verifyOtpMutation = useAuthControllerVerifyOtp();
  const { phone, type } = location.state as { phone: string; type: 'login' | 'signup' };
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);

  // const handleSubmit = async (values: { otp: string }) => {
  //     try {
  //         const dto: VerifyOtpDto = { phone, otp: values.otp, type };
  //         const response = await verifyOtpMutation.mutateAsync({ data: dto });

  //         if (response.isNewUser) {
  //             navigate('/SetupProfile', {
  //                 state: {
  //                     phone: response.phone,
  //                     otpToken: response.otpToken,
  //                 },
  //             });
  //         } else {
  //             setTokens(response.access_token, response.refresh_token);
  //             setUser(response.user);
  //             navigate('/');
  //         }
  //     } catch (err) {
  //         console.error('OTP verification failed:', err);
  //     }
  // };

  const [error, setError] = useState('');
  const handleSubmit = (values: { otp: string }) => {
    const dto: VerifyOtpDto = { phone, otp: values.otp, type };
    verifyOtpMutation.mutate(
      { data: dto },
      {
        onSuccess: (response) => {
          if (response.isNewUser) {
            navigate('/SetupProfile', {
              state: {
                phone: response.phone,
                otpToken: response.otpToken,
              },
            });
          } else {
            setTokens(response.access_token, response.refresh_token);
            setUser(response.user);
            navigate('/');
          }
        },

        onError: (error: any) => {
          console.log(error, 'error');
          setError(error?.message);
          console.error('OTP verification failed:', error);
        },
      },
    );
  };
  return (
    <AuthContainer>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Box
            sx={{
              bgcolor: (theme) =>
                theme.palette.mode === 'light' ? '#E8EAF6' : 'rgba(63, 81, 181, 0.2)',
              borderRadius: 3,
              p: 2,
            }}
          >
            <ShieldCheck size={32} color="#3F51B5" />
          </Box>
        </Box>
        <Typography variant="h4" sx={{ color: 'text.primary', mb: 1 }}>
          Verify OTP
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Enter the 6-digit code sent to
          <br />
          <Box component="span" sx={{ color: 'primary.main' }}>
            {phone}
          </Box>
        </Typography>
      </Box>

      <Formik
        initialValues={{ otp: '' }}
        validationSchema={VerifyOtpSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <Field
              name="otp"
              component={OtpFormField}
              isRequired
              onChange={() => {
                setError('');
              }}
            />
            {error && (
              <Alert
                severity="error"
                icon={<AlertCircle size={20} />}
                sx={{
                  mt: 1,
                  py: 0,
                  '& .MuiAlert-message': {
                    fontSize: '0.875rem',
                  },
                }}
              >
                {error}
              </Alert>
            )}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                onClick={() => {}}
                sx={{
                  color: 'primary.main',
                  textTransform: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    bgcolor: 'transparent',
                  },
                }}
              >
                Resend Code
              </Button>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                py: 1.5,
                px: 3,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 4,
                },
              }}
              disabled={verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify '}
            </Button>
          </Form>
        )}
      </Formik>
    </AuthContainer>
  );
};

export default CommonVerifyOtp;
