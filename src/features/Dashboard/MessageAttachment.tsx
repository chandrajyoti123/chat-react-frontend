import { Box, Typography, IconButton, Paper } from '@mui/material';
import { Download, FileText } from 'lucide-react';
import type { MessageMetaDto } from '@/api/generated';

type MessageAttachmentProps = {
  attachment: MessageMetaDto;
  isOwn: boolean;
};

export function MessageAttachment({ attachment, isOwn }: MessageAttachmentProps) {
  const getFileExtension = (filename: string) => {
    const ext = filename?.split('.').pop()?.toUpperCase();
    return ext || 'FILE';
  };

  const handleDownload = () => {
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.fileName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (attachment.fileType === 'image') {
    return (
      <Box
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          maxWidth: 320,
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.95,
          },
        }}
      >
        <img
          src={attachment.url}
          alt={attachment.fileName || 'Image'}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            maxHeight: 400,
            objectFit: 'cover',
          }}
        />
      </Box>
    );
  }

  if (attachment.fileType === 'video') {
    return (
      <Box
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          maxWidth: 320,
        }}
      >
        <video
          src={attachment.url}
          controls
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            maxHeight: 400,
          }}
        />
      </Box>
    );
  }

  // Document
  return (
    <Paper
      elevation={isOwn ? 0 : 2}
      sx={{
        p: 2,
        bgcolor: isOwn
          ? 'rgba(255, 255, 255, 0.5)'
          : (theme: { palette: { mode: string } }) =>
              theme.palette.mode === 'light' ? '#F5F5F5' : '#374151',
        borderRadius: 2,
        minWidth: 240,
        maxWidth: 320,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            bgcolor: isOwn ? 'primary.main' : 'secondary.main',
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <FileText size={32} color="white" />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              color: isOwn ? 'primary.main' : 'secondary.main',
              mb: 0.5,
              px: 1,
              py: 0.25,
              bgcolor: isOwn ? 'rgba(63, 81, 181, 0.1)' : 'rgba(66, 165, 245, 0.1)',
              borderRadius: 0.5,
              display: 'inline-block',
              fontSize: '0.75rem',
            }}
          >
            {getFileExtension(attachment.fileName || '')}
          </Typography>
          <Typography
            sx={{
              color: 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: '0.875rem',
              mb: 0.5,
            }}
          >
            {attachment.fileName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {attachment.fileSize}
          </Typography>
        </Box>
        <IconButton
          onClick={handleDownload}
          size="small"
          sx={{
            bgcolor: isOwn ? 'primary.main' : 'secondary.main',
            color: 'white',
            '&:hover': {
              bgcolor: isOwn ? 'primary.dark' : 'secondary.dark',
            },
            flexShrink: 0,
          }}
        >
          <Download size={16} />
        </IconButton>
      </Box>
    </Paper>
  );
}
