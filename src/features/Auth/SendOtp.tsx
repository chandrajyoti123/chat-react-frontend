import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Typography } from '@mui/material';
import { SendOtpDtoType, useAuthControllerSendOtp, type SendOtpDto } from '@/api/generated';
import { PhoneInputFormField } from '@/components/FormFields/PhoneInputFormField';
import { useNavigate } from 'react-router-dom';

const SendOtpSchema = Yup.object().shape({
  phone: Yup.string().required('Phone number is required').min(10, 'Invalid phone number'),
});
interface SendOtpProps {
  type: SendOtpDtoType;
}

const SendOtp: React.FC<SendOtpProps> = ({ type }) => {
  const sendOtpMutation = useAuthControllerSendOtp();
  const navigate = useNavigate();
  const handleSubmit = async (values: SendOtpDto) => {
    try {
      await sendOtpMutation.mutateAsync({ data: values });
      console.log('OTP sent successfully!');
      navigate('/VerifyOtp', { state: { phone: values.phone, type: values.type } });
    } catch (err) {
      console.error('Error sending OTP:', err);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" mb={3}>
        Send OTP
      </Typography>
      <Formik
        initialValues={{ phone: '', type: type }}
        validationSchema={SendOtpSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <Field name="phone" label="Phone Number" component={PhoneInputFormField} isRequired />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={sendOtpMutation.isPending}
            >
              {sendOtpMutation.isPending ? 'Sending...' : 'Send OTP'}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SendOtp;
