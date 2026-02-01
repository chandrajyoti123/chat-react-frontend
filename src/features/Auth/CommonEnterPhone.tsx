import { useAuthControllerSendOtp, type SendOtpDto, type SendOtpDtoType } from '@/api/generated';
import AuthContainer from '@/components/AuthContainer';
import { Alert, Box, Button, Typography } from '@mui/material';
import { AlertCircle, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { PhoneInputFormField } from '@/components/FormFields/PhoneInputFormField';
import * as Yup from 'yup';
import CustomDivider from '@/components/CustomDivider';
import { useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';

const SendOtpSchema = Yup.object().shape({
  phone: Yup.string()
    .required('Phone number is required')
    .test(
      'is-valid-phone',
      'Invalid phone number',
      (value) => !!value && isValidPhoneNumber(value),
    ),
});

interface CommonEnterPhoneProps {
  type: SendOtpDtoType;
}

const CommonEnterPhone: React.FC<CommonEnterPhoneProps> = ({ type }) => {
  const sendOtpMutation = useAuthControllerSendOtp();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  // const handleSubmit = async (values: SendOtpDto) => {
  //     try {
  //         await sendOtpMutation.mutateAsync({ data: values });
  //         console.log('OTP sent successfully!');
  //         navigate('/VerifyOtp', { state: { phone: values.phone, type: values.type } });
  //     } catch (err) {
  //         console.error('Error sending OTP:', err);
  //     }
  // };

  const handleSubmit = (values: SendOtpDto) => {
    sendOtpMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          console.log('OTP sent successfully!');
          navigate('/VerifyOtp', { state: { phone: values.phone, type: values.type } });
          //   setSuccess(true);
        },
        onError: (error: any) => {
          setError(error?.message);
          console.error('Error adding contact:', error);
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
            <Phone size={32} color="#3F51B5" />
          </Box>
        </Box>
        <Typography variant="h4" sx={{ color: 'text.primary', mb: 1 }}>
          {type === 'signup' ? 'Create Account' : 'Welcome Back'}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Enter your phone number to continue
        </Typography>
      </Box>

      {/* <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                        <Typography variant="body2" sx={{ color: 'text.primary', mb: 1 }}>
                            Phone Number
                        </Typography>
                        <TextField
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            required
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderWidth: 2,
                                        borderColor: (theme) => theme.palette.mode === 'light' ? '#E5E7EB' : '#4B5563',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: (theme) => theme.palette.mode === 'light' ? '#E5E7EB' : '#4B5563',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                        />
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
                    >
                        Continue
                    </Button>
                </Box> */}

      <Formik
        initialValues={{ phone: '', type: type }}
        validationSchema={SendOtpSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <Field
              name="phone"
              label="Phone Number"
              component={PhoneInputFormField}
              isRequired
              // onChange={() => {
              //     setError('');
              // }}
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
            <CustomDivider size={'1.5rem'} />

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
              disabled={sendOtpMutation.isPending}
            >
              {sendOtpMutation.isPending ? 'Sending...' : 'Send OTP'}
            </Button>
          </Form>
        )}
      </Formik>
    </AuthContainer>
  );
};

export default CommonEnterPhone;
