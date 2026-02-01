import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthControllerCompleteSignup, type CompleteSignupDto } from '@/api/generated';
import { TextFormField } from '@/components/FormFields/TextFormField';
import { useAuthStore } from '@/store/auth';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const Signup: React.FC = () => {
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

  if (!phone || !otpToken) {
    return <Typography color="error">Invalid signup session.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 450, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" mb={3}>
        Complete Signup
      </Typography>
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
              placeholder="Enter full name"
              isRequired
              type="text"
              component={TextFormField}
            />

            <Box mt={2} />

            <Field
              name="email"
              label="Email"
              placeholder="Enter your email"
              isRequired
              type="text"
              component={TextFormField}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? 'Saving...' : 'Complete Signup'}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default Signup;
