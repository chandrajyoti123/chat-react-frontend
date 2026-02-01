import React, { useState } from 'react';
import type { FieldProps } from 'formik';
import { Box, Button, Typography, LinearProgress } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
interface FileUploadFieldProps extends FieldProps {
  onUploadSuccess?: (meta: any) => void;
}

export const FormikFileUpload: React.FC<FileUploadFieldProps> = ({
  field,
  form,
  onUploadSuccess,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        'https://crud-nest-production-ac29.up.railway.app/upload/chat-file',
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();

      // Save in Formik
      form.setFieldValue(field.name, { fileMeta: result, file });

      // 🔥 Notify ChatModule
      onUploadSuccess?.(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <input type="file" hidden id={field.name} onChange={handleFileChange} />
      <label htmlFor={field.name}>
        <Button component="span" startIcon={<AttachFileIcon />} variant="outlined">
          Attach
        </Button>
      </label>

      {uploading && <LinearProgress />}
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};
