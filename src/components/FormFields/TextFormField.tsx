import React, { useState } from 'react';
import { type FieldInputProps, type FormikProps, getIn } from 'formik';
import {
  FormControl,
  // InputLabel,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Alert,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { AlertCircle } from 'lucide-react';
// import { TextFieldProps } from '@mui/material';

interface TextFormFieldProps {
  field: FieldInputProps<string>;
  form: FormikProps<any>;
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  type?: string;
  inputProps?: any;
  startAdornmentIcon?: any;
}

export const TextFormField: React.FC<TextFormFieldProps> = ({
  field,
  form,
  label,
  isRequired,
  placeholder,
  type = 'text',
  inputProps,
  startAdornmentIcon,
}) => {
  const errorText = getIn(form.touched, field.name) && getIn(form.errors, field.name);

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Restrict name: only alphabets + space
    if (type === 'name') {
      value = value.replace(/[^a-zA-Z\s]/g, '');
    }

    form.setFieldValue(field.name, value);
  };

  return (
    <FormControl fullWidth error={!!errorText}>
      {label && (
        // <InputLabel shrink htmlFor={field.name}>
        <Typography variant="body2" sx={{ color: 'text.primary', mb: 1 }}>
          {label}
          {isRequired && (
            <Typography variant="body2" color="error" component="span">
              {' *'}
            </Typography>
          )}
        </Typography>
        // </InputLabel>
      )}

      <TextField
        {...field}
        fullWidth
        id={field.name}
        placeholder={placeholder}
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        // sx={{
        //   mt: 2,
        //   borderRadius: '6px',
        //   '& fieldset': { border: '1px solid #ccc' },
        //   '& .MuiInputBase-input': { padding: '10px 14px' },
        // }}
        onChange={handleChange}
        onBlur={form.handleBlur}
        inputProps={inputProps}
        InputProps={{
          endAdornment:
            type === 'password' ? (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePassword} edge="end">
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ) : undefined,
          startAdornment: (
            <InputAdornment position="start">
              {startAdornmentIcon && startAdornmentIcon}
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
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

      {/* {errorText && (
        <Typography variant="body2" fontSize="10px" color="#DC143C" sx={{ mt: 0.5 }}>
          {errorText}
        </Typography>
      )} */}

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
