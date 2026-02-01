import React, { useState } from 'react';
import { Box, Typography, Button, IconButton, Paper, Alert } from '@mui/material';
import { ArrowLeft, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { useContactControllerAddContact, type AddContactDto } from '@/api/generated';
import { Field, Formik, Form, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { PhoneInputFormField } from '@/components/FormFields/PhoneInputFormField';
import CustomDivider from '@/components/CustomDivider';
import { useNavigate } from 'react-router-dom';
type AddContactProps = {};

const AddContactSchema = Yup.object().shape({
  friendPhone: Yup.string().required('Phone number is required').min(10, 'Invalid phone number'),
});

const AddContact: React.FC<AddContactProps> = ({}) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const addContactMutation = useContactControllerAddContact();
  const handleSubmit = (values: AddContactDto, { resetForm }: FormikHelpers<AddContactDto>) => {
    addContactMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          console.log('Contact added successfully');
          setSuccess(true);
          resetForm();
        },
        onError: (error: any) => {
          setError(error?.message);
          console.error('Error adding contact:', error);
        },
      },
    );
  };
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
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
            Add New Contact
          </Typography>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 448, mx: 'auto', p: 3, mt: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === 'light' ? '#E8EAF6' : 'rgba(63, 81, 181, 0.2)',
                borderRadius: 4,
                p: 3,
                boxShadow: 4,
              }}
            >
              <UserPlus size={48} color="#3F51B5" />
            </Box>
          </Box>
          <Typography variant="h5" sx={{ color: 'text.primary', mb: 1 }}>
            Add a new contact
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Enter their phone number to add them to your contacts
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ borderRadius: 3, p: 3 }}>
          <Formik
            initialValues={{ friendPhone: '' }}
            validationSchema={AddContactSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form>
                <Field
                  name="friendPhone"
                  label="Phone Number"
                  component={PhoneInputFormField}
                  isRequired
                  // onChange={() => {
                  //   setError('');
                  //   setSuccess(false);
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

                {success && (
                  <Alert
                    severity="success"
                    icon={<CheckCircle size={20} />}
                    sx={{
                      mt: 1,
                      py: 0,
                      '& .MuiAlert-message': {
                        fontSize: '0.875rem',
                      },
                    }}
                  >
                    Contact added successfully!
                  </Alert>
                )}
                <CustomDivider size={'1rem'} />
                <Button
                  type="submit"
                  variant="contained"
                  color={success ? 'success' : 'primary'}
                  fullWidth
                  disabled={addContactMutation.isPending || success}
                  sx={{
                    py: 1.5,
                    boxShadow: 3,
                    textTransform: 'none',
                    '&:hover': {
                      boxShadow: 4,
                    },
                  }}
                >
                  {success ? 'Contact Added!' : 'Add Contact'}
                </Button>
              </Form>
            )}
          </Formik>

          {/* Helper Text */}
          <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              Make sure you enter the phone number with country code for international contacts
            </Typography>
          </Box>
        </Paper>

        {/* Tips Section */}
        <Box
          sx={{
            mt: 3,
            bgcolor: (theme) =>
              theme.palette.mode === 'light' ? '#E8EAF6' : 'rgba(63, 81, 181, 0.1)',
            borderRadius: 3,
            p: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'primary.main', mb: 1 }}>
            Tips for adding contacts
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2, color: 'text.primary', fontSize: '0.875rem' }}>
            <li style={{ marginBottom: 8 }}>
              <Typography variant="body2" component="span">
                Include country code (e.g., +91 for IND)
              </Typography>
            </li>
            <li style={{ marginBottom: 8 }}>
              <Typography variant="body2" component="span">
                Phone number should be 10-15 digits
              </Typography>
            </li>
            <li>
              <Typography variant="body2" component="span">
                Remove any special characters except + for country code
              </Typography>
            </li>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddContact;
