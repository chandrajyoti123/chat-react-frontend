import { useState, type SetStateAction } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  LinearProgress,
} from '@mui/material';
import { X, Send, FileText, Image as ImageIcon, Video } from 'lucide-react';

export type AttachmentFile = {
  file: File;
  type: 'image' | 'video' | 'document';
  preview?: string;
  size: string;
};

type AttachmentPreviewProps = {
  attachment: AttachmentFile;
  onSend: (caption: string) => void;
  onCancel: () => void;
  uploading?: boolean;
  uploadProgress?: number;
};

export function AttachmentPreview({
  attachment,
  onSend,
  onCancel,
  uploading = false,
  uploadProgress = 0,
}: AttachmentPreviewProps) {
  const [caption, setCaption] = useState('');

  const handleSend = () => {
    onSend(caption);
  };

  const getFileIcon = () => {
    switch (attachment.type) {
      case 'image':
        return <ImageIcon size={48} color="#3F51B5" />;
      case 'video':
        return <Video size={48} color="#3F51B5" />;
      default:
        return <FileText size={48} color="#3F51B5" />;
    }
  };

  const getFileExtension = (filename: string) => {
    const ext = filename.split('.').pop()?.toUpperCase();
    return ext || 'FILE';
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 1300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      {/* Close Button */}
      <IconButton
        onClick={onCancel}
        disabled={uploading}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          color: 'white',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.2)',
          },
        }}
      >
        <X size={24} />
      </IconButton>

      {/* Preview Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 3,
          maxHeight: '60vh',
        }}
      >
        {attachment.type === 'image' || attachment.type === 'video' ? (
          <Box
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 6,
            }}
          >
            {attachment.type === 'image' ? (
              <img
                src={attachment.preview}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '60vh',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            ) : (
              <video
                src={attachment.preview}
                controls
                style={{
                  maxWidth: '100%',
                  maxHeight: '60vh',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            )}
          </Box>
        ) : (
          <Paper
            elevation={6}
            sx={{
              p: 4,
              bgcolor: 'background.paper',
              borderRadius: 3,
              textAlign: 'center',
              minWidth: 320,
            }}
          >
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === 'light' ? '#E8EAF6' : 'rgba(63, 81, 181, 0.2)',
                  borderRadius: 3,
                  p: 3,
                }}
              >
                {getFileIcon()}
              </Box>
            </Box>
            <Typography
              sx={{
                color: 'primary.main',
                mb: 1,
                px: 2,
                py: 0.5,
                bgcolor: (theme: { palette: { mode: string } }) =>
                  theme.palette.mode === 'light' ? '#E8EAF6' : 'rgba(63, 81, 181, 0.2)',
                borderRadius: 1,
                display: 'inline-block',
              }}
            >
              {getFileExtension(attachment.file.name)}
            </Typography>
            <Typography
              sx={{
                color: 'text.primary',
                mb: 1,
                maxWidth: 280,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {attachment.file.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {attachment.size}
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Caption and Controls */}
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 600,
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 3,
        }}
      >
        {uploading && (
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Uploading...
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {uploadProgress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: (theme: { palette: { mode: string } }) =>
                  theme.palette.mode === 'light' ? '#E8EAF6' : 'rgba(63, 81, 181, 0.2)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #3F51B5 0%, #42A5F5 100%)',
                },
              }}
            />
          </Box>
        )}

        <TextField
          value={caption}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setCaption(e.target.value)
          }
          placeholder="Add a caption..."
          multiline
          maxRows={3}
          fullWidth
          disabled={uploading}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              bgcolor: (theme: { palette: { mode: string } }) =>
                theme.palette.mode === 'light' ? '#FAFAFA' : '#374151',
              borderRadius: 2,
              '& fieldset': {
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

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={onCancel}
            variant="outlined"
            disabled={uploading}
            fullWidth
            sx={{
              py: 1.5,
              textTransform: 'none',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            variant="contained"
            disabled={uploading}
            fullWidth
            startIcon={<Send size={20} />}
            sx={{
              py: 1.5,
              textTransform: 'none',
              boxShadow: 3,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
