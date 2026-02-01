import React, { useRef } from 'react';
import { Alert, Box, TextField } from '@mui/material';

import { type FieldInputProps, type FormikProps, getIn } from 'formik';
import { AlertCircle } from 'lucide-react';

interface OtpFieldProps {
  field: FieldInputProps<string>;
  form: FormikProps<any>;
  label?: string;
  length?: number;
  isRequired?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const OtpFormField: React.FC<OtpFieldProps> = ({ field, form, length = 6, inputProps }) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const value = field.value || '';
  const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name);

  const handleChange = (digit: string, index: number) => {
    const otp = value.split('');

    if (/^[0-9]$/.test(digit)) {
      otp[index] = digit;
      form.setFieldValue(field.name, otp.join(''));

      if (index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    } else if (digit === '') {
      otp[index] = '';
      form.setFieldValue(field.name, otp.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').trim();

    if (/^[0-9]+$/.test(text)) {
      const otp = text.slice(0, length).split('');
      form.setFieldValue(field.name, otp.join(''));
      inputsRef.current[otp.length - 1]?.focus();
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Box display="flex" gap={1.5}>
        {Array.from({ length }).map((_, index) => (
          <TextField
            key={index}
            value={value[index] || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(e.target.value, index)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            inputRef={(el: HTMLInputElement | null) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            inputProps={{
              ...inputProps,
              maxLength: 1,
              style: {
                ...inputProps?.style,
                textAlign: 'center',
              },
            }}
            sx={{
              width: 48,
              '& .MuiOutlinedInput-root': {
                '& input': {
                  padding: '14px 0',
                  fontSize: '1.25rem',
                },
                '& fieldset': {
                  borderWidth: 2,
                  borderColor: (theme: { palette: { mode: string } }) =>
                    theme.palette.mode === 'light' ? '#E5E7EB' : '#4B5563',
                },
                '&:hover fieldset': {
                  borderColor: (theme: { palette: { mode: string } }) =>
                    theme.palette.mode === 'light' ? '#E5E7EB' : '#4B5563',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        ))}
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
    </Box>
  );
};

export default OtpFormField;
