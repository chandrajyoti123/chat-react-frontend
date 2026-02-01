import { useAuthControllerCompleteSignup, type CompleteSignupDto } from '@/api/generated';
import AuthContainer from '@/components/AuthContainer';
import { useAuthStore } from '@/store/auth';
import { Box, Button, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Mail, User } from 'lucide-react';
import { TextFormField } from '@/components/FormFields/TextFormField';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const SetupProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);

  const { phone, otpToken } = location.state || {};

  const signupMutation = useAuthControllerCompleteSignup();

  const handleSubmit = async (values: { name: string; email: string }) => {
    try {
      const payload: CompleteSignupDto = {
        phone,
        name: values.name,
        email: values.email,
        otpToken,
      };

      const response = await signupMutation.mutateAsync({ data: payload });

      console.log('Signup completed:', response);

      setTokens(response.access_token, response.refresh_token);
      setUser(response.user);
      navigate('/');
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  // if (!phone || !otpToken) {
  //     return <Typography color="error">Invalid signup session.</Typography>;
  // }
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
            <User size={32} color="#3F51B5" />
          </Box>
        </Box>
        <Typography variant="h4" sx={{ color: 'text.primary', mb: 1 }}>
          Setup Profile
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Tell us about yourself
        </Typography>
      </Box>

      <Formik
        initialValues={{ name: '', email: '' }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <Field
              name="name"
              label="Full Name"
              placeholder="Enter your name"
              isRequired
              type="text"
              component={TextFormField}
              startAdornmentIcon={<User size={20} color="#9CA3AF" />}
            />

            <Box mt={2} />

            <Field
              name="email"
              label="Email"
              placeholder="Enter your email"
              isRequired
              type="email"
              component={TextFormField}
              startAdornmentIcon={<Mail size={20} color="#9CA3AF" />}
            />
            <Box mt={2} />
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
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? 'Starting' : 'Start Chatting'}
            </Button>
          </Form>
        )}
      </Formik>
    </AuthContainer>
  );
};

export default SetupProfile;
