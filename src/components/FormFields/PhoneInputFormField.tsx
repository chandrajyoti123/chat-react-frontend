import React from 'react';
import { type FieldInputProps, type FormikProps, getIn } from 'formik';
import { Alert, Box, FormControl, Typography } from '@mui/material';
import PhoneInput, { type Value } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { AlertCircle } from 'lucide-react';

interface PhoneInputFormFieldProps {
  field: FieldInputProps<string>;
  form: FormikProps<any>;
  label?: string;
  isRequired?: boolean;
  onChange?: (value: Value) => void; // 👈 support custom onChange
}

export const PhoneInputFormField: React.FC<PhoneInputFormFieldProps> = ({
  field,
  form,
  label,
  isRequired,
  onChange,
  ...props
}) => {
  const errorText =
    getIn(form.touched, field.name) && getIn(form.errors, field.name);

  const handleChange = (value: Value) => {
    // 1️⃣ Update Formik
    form.setFieldValue(field.name, value ?? '');

    // 2️⃣ Call external onChange if provided
    onChange?.(value);
  };

  return (
    <FormControl fullWidth>
      {label && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          {label}
          {isRequired && (
            <Typography component="span" color="error">
              {' *'}
            </Typography>
          )}
        </Typography>
      )}

      <Box
        sx={{
          border: '2px solid',
          borderColor: (theme) =>
            errorText
              ? theme.palette.error.main
              : theme.palette.mode === 'light'
              ? '#E5E7EB'
              : '#4B5563',
          borderRadius: 1,
          px: 1.5,
          py: 1.5,
          transition: 'border-color 0.2s',
          '&:focus-within': {
            borderColor: 'primary.main',
          },
          '& .PhoneInput': {
            display: 'flex',
            alignItems: 'center',
          },
          '& .PhoneInputInput': {
            border: 'none',
            outline: 'none',
            fontSize: '15px',
            width: '100%',
            background: 'transparent',
          },
        }}
      >
        <PhoneInput
          international
          defaultCountry="IN"
          countryCallingCodeEditable={false}
          value={field.value}
          onChange={handleChange}   
          onBlur={() => form.setFieldTouched(field.name, true, true)}
          {...props}
        />
      </Box>

      {errorText && (
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
          {errorText}
        </Alert>
      )}
    </FormControl>
  );
};
