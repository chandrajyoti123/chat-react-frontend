import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuthControllerVerifyOtp, type VerifyOtpDto } from '@/api/generated';
import OtpFormField from '@/components/FormFields/OtpFormField';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const VerifyOtpSchema = Yup.object().shape({
  otp: Yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
});

const VerifyOtp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const verifyOtpMutation = useAuthControllerVerifyOtp();
  const { phone, type } = location.state as { phone: string; type: 'login' | 'signup' };
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);

  const handleSubmit = async (values: { otp: string }) => {
    try {
      const dto: VerifyOtpDto = { phone, otp: values.otp, type };
      const response = await verifyOtpMutation.mutateAsync({ data: dto });

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
    } catch (err) {
      console.error('OTP verification failed:', err);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" mb={3}>
        Enter OTP
      </Typography>

      <Formik
        initialValues={{ otp: '' }}
        validationSchema={VerifyOtpSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <Field name="otp" component={OtpFormField} isRequired />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={verifyOtpMutation.isPending}
            >
              {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default VerifyOtp;
