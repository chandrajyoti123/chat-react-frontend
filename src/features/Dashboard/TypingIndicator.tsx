import { useConversationControllerGetConversationById } from '@/api/generated';
import { Box, Typography, Avatar } from '@mui/material';

type TypingIndicatorProps = {
  conversationId: string;
  typingUsers: string[]; // array of userIds who are typing
};

export function TypingIndicator({ conversationId, typingUsers }: TypingIndicatorProps) {
  const { data: conversation } = useConversationControllerGetConversationById(conversationId);

  if (!conversation || typingUsers.length === 0) return null;

  // Find typing users from participants
  const typingParticipants = conversation.participants.filter((p) =>
    typingUsers.includes(p.user.id),
  );

  if (typingParticipants.length === 0) return null;

  const isGroup = conversation.isGroup;

  // Text to show
  const typingText = isGroup
    ? typingParticipants.length === 1
      ? `${typingParticipants[0].user.name} is typing`
      : `${typingParticipants.map((p) => p.user.name).join(', ')} are typing`
    : 'Typing';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 3,
        py: 1.5,
        bgcolor: (theme) => (theme.palette.mode === 'light' ? '#E8EAF6' : 'rgba(63, 81, 181, 0.1)'),
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      {/* Avatar only for group */}
      {isGroup && (
        <Avatar
          sx={{
            width: 24,
            height: 24,
            background: 'linear-gradient(135deg, #3F51B5 0%, #42A5F5 100%)',
            fontSize: '0.75rem',
          }}
        >
          {typingParticipants[0].user.name.charAt(0).toUpperCase()}
        </Avatar>
      )}

      <Typography variant="body2" sx={{ color: 'primary.main', fontStyle: 'italic' }}>
        {typingText}
      </Typography>

      {/* Animated dots */}
      <Box sx={{ display: 'flex', gap: 0.5, ml: 0.5 }}>
        {[0, 0.2, 0.4].map((delay) => (
          <Box
            key={delay}
            sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              animation: `typing 1.4s infinite ${delay}s`,
              '@keyframes typing': {
                '0%, 60%, 100%': {
                  opacity: 0.3,
                  transform: 'translateY(0)',
                },
                '30%': {
                  opacity: 1,
                  transform: 'translateY(-4px)',
                },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
