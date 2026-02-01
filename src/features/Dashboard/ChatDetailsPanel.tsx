import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Paper,
  Button,
  Drawer,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  X,
  Phone,
  Mail,
  Image as ImageIcon,
  Link as LinkIcon,
  FileText,
  UserPlus,
  LogOut,
  Volume2,
  VolumeX,
  Ban,
  ChevronRight,
} from 'lucide-react';
// import type { Contact } from '../App';
import {
  useContactControllerGetContact,
  useConversationControllerGetConversationById,
} from '@/api/generated';
import { useLocation } from 'react-router-dom';

export type ChatMedia = {
  id: string;
  type: 'image' | 'video' | 'document' | 'link';
  url: string;
  thumbnail?: string;
  name?: string;
  date?: string;
};

// export type GroupParticipant = Contact & {
//   role: 'admin' | 'member';
// };

type ChatDetailsPanelProps = {
  open: boolean;
  onClose: () => void;
  // contact: Contact;
  isGroup?: boolean;
  // participants?: GroupParticipant[];
  media?: ChatMedia[];
  // onAddParticipants?: () => void;
  // onExitGroup?: () => void;
  // onMuteToggle?: () => void;
  // onBlock?: () => void;
  isMuted?: boolean;
  // theme: 'light' | 'dark';
};

export function ChatDetailsPanel({
  open,
  onClose,
  // contact,
  // isGroup = false,
  // participants = [],
  media = [],
  // onAddParticipants,
  // onExitGroup,
  // onMuteToggle,
  // onBlock,
  isMuted = false,
  // theme,
}: ChatDetailsPanelProps) {
  const location = useLocation();
  const { conversationId, contactId } = location.state as {
    conversationId: string;
    contactId: string;
  };
  const { data: contact } = useContactControllerGetContact(contactId);
  const { data: conversation } = useConversationControllerGetConversationById(conversationId);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState<'media' | 'links' | 'docs'>('media');

  const mediaItems = media.filter((m) => m.type === 'image' || m.type === 'video');
  const linkItems = media.filter((m) => m.type === 'link');
  const docItems = media.filter((m) => m.type === 'document');

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 400 },
            bgcolor: 'background.default',
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              {conversation?.isGroup ? 'Group Info' : 'Contact Info'}
            </Typography>
            <IconButton onClick={onClose}>
              <X size={24} />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {/* Profile Section */}
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                bgcolor: (theme) => (theme.palette.mode === 'light' ? '#FAFAFA' : '#1F2937'),
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(135deg, #3F51B5 0%, #42A5F5 100%)',
                  fontSize: '3rem',
                  boxShadow: 4,
                }}
              >
                {conversation?.isGroup
                  ? conversation?.name?.charAt(0)?.toUpperCase()
                  : contact?.friend?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" sx={{ color: 'text.primary', mb: 1 }}>
                {conversation?.isGroup ? `${conversation?.name}` : `${contact?.friend.name}`}
              </Typography>
              {!conversation?.isGroup && (
                <Typography sx={{ color: 'text.secondary' }}>{contact?.friend?.about}</Typography>
              )}
              {conversation?.isGroup && (
                <Typography sx={{ color: 'text.secondary' }}>
                  Group • {conversation?.participants.length} participants
                </Typography>
              )}
            </Box>

            {/* One-to-One Contact Details */}
            {!conversation?.isGroup && (
              <Box sx={{ p: 2 }}>
                <Paper elevation={2} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        bgcolor: (theme) =>
                          theme.palette.mode === 'light' ? '#E8EAF6' : 'rgba(63, 81, 181, 0.2)',
                        borderRadius: 2,
                        p: 1.5,
                      }}
                    >
                      <Phone size={20} color="#3F51B5" />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Phone
                      </Typography>
                      <Typography sx={{ color: 'text.primary' }}>
                        {contact?.friend?.phone}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        bgcolor: (theme) =>
                          theme.palette.mode === 'light' ? '#E8EAF6' : 'rgba(63, 81, 181, 0.2)',
                        borderRadius: 2,
                        p: 1.5,
                      }}
                    >
                      <Mail size={20} color="#3F51B5" />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Email
                      </Typography>
                      <Typography sx={{ color: 'text.primary' }}>
                        {contact?.friend?.email}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}

            {/* Group Participants */}
            {conversation?.isGroup && conversation?.participants?.length && (
              <Box sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    {conversation?.participants?.length} Participants
                  </Typography>
                  {/* {onAddParticipants && ( */}
                  <IconButton
                    onClick={() => {}}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    }}
                    size="small"
                  >
                    <UserPlus size={20} />
                  </IconButton>
                  {/* )} */}
                </Box>

                <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  {conversation?.participants.map((participant) => (
                    <Box
                      key={participant.id}
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        borderBottom: 1,
                        borderColor: 'divider',
                        '&:last-child': {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          background: 'linear-gradient(135deg, #3F51B5 0%, #42A5F5 100%)',
                        }}
                      >
                        {participant?.user?.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: 'text.primary' }}>
                          {participant?.user?.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {participant?.user?.about}
                        </Typography>
                      </Box>
                      {participant?.role === 'admin' && (
                        <Chip
                          label="Admin"
                          size="small"
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            height: 24,
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Paper>
              </Box>
            )}

            {/* Media, Links, and Documents */}
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
                Media, Links and Docs
              </Typography>

              {/* Tabs */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                  onClick={() => setActiveMediaTab('media')}
                  variant={activeMediaTab === 'media' ? 'contained' : 'outlined'}
                  size="small"
                  startIcon={<ImageIcon size={16} />}
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    py: 1,
                  }}
                >
                  Media ({mediaItems.length})
                </Button>
                <Button
                  onClick={() => setActiveMediaTab('links')}
                  variant={activeMediaTab === 'links' ? 'contained' : 'outlined'}
                  size="small"
                  startIcon={<LinkIcon size={16} />}
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    py: 1,
                  }}
                >
                  Links ({linkItems.length})
                </Button>
                <Button
                  onClick={() => setActiveMediaTab('docs')}
                  variant={activeMediaTab === 'docs' ? 'contained' : 'outlined'}
                  size="small"
                  startIcon={<FileText size={16} />}
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    py: 1,
                  }}
                >
                  Docs ({docItems.length})
                </Button>
              </Box>

              {/* Media Grid */}
              {activeMediaTab === 'media' && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 1,
                  }}
                >
                  {mediaItems.length > 0 ? (
                    mediaItems.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          aspectRatio: '1',
                          borderRadius: 1,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          '&:hover': {
                            opacity: 0.9,
                          },
                        }}
                      >
                        <img
                          src={item.thumbnail || item.url}
                          alt={item.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    ))
                  ) : (
                    <Box
                      sx={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        py: 4,
                        color: 'text.secondary',
                      }}
                    >
                      <ImageIcon size={48} style={{ opacity: 0.3 }} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        No media yet
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {/* Links List */}
              {activeMediaTab === 'links' && (
                <Paper elevation={2} sx={{ borderRadius: 2 }}>
                  {linkItems.length > 0 ? (
                    linkItems.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          p: 2,
                          borderBottom: 1,
                          borderColor: 'divider',
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: (theme) =>
                              theme.palette.mode === 'light' ? '#FAFAFA' : '#374151',
                          },
                          '&:last-child': {
                            borderBottom: 0,
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            color: 'primary.main',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.url}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {item.date}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      <LinkIcon size={48} style={{ opacity: 0.3 }} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        No links yet
                      </Typography>
                    </Box>
                  )}
                </Paper>
              )}

              {/* Documents List */}
              {activeMediaTab === 'docs' && (
                <Paper elevation={2} sx={{ borderRadius: 2 }}>
                  {docItems.length > 0 ? (
                    docItems.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          p: 2,
                          borderBottom: 1,
                          borderColor: 'divider',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: (theme) =>
                              theme.palette.mode === 'light' ? '#FAFAFA' : '#374151',
                          },
                          '&:last-child': {
                            borderBottom: 0,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor: 'secondary.main',
                            borderRadius: 1.5,
                            p: 1.5,
                          }}
                        >
                          <FileText size={24} color="white" />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              color: 'text.primary',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {item.date}
                          </Typography>
                        </Box>
                        <ChevronRight size={20} color="#9CA3AF" />
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      <FileText size={48} style={{ opacity: 0.3 }} />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        No documents yet
                      </Typography>
                    </Box>
                  )}
                </Paper>
              )}
            </Box>

            {/* Actions */}
            <Box sx={{ p: 2 }}>
              <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box
                  onClick={() => {}}
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                    borderBottom: 1,
                    borderColor: 'divider',
                    '&:hover': {
                      bgcolor: (theme) => (theme.palette.mode === 'light' ? '#FAFAFA' : '#374151'),
                    },
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: (theme) =>
                        theme.palette.mode === 'light' ? '#E8EAF6' : 'rgba(63, 81, 181, 0.2)',
                      borderRadius: 2,
                      p: 1.5,
                    }}
                  >
                    {isMuted ? (
                      <Volume2 size={20} color="#3F51B5" />
                    ) : (
                      <VolumeX size={20} color="#3F51B5" />
                    )}
                  </Box>
                  <Typography sx={{ color: 'text.primary', flex: 1 }}>
                    {isMuted ? 'Unmute notifications' : 'Mute notifications'}
                  </Typography>
                </Box>

                {!conversation?.isGroup && (
                  <Box
                    onClick={() => {}}
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: (theme) =>
                          theme.palette.mode === 'light'
                            ? 'rgba(239, 68, 68, 0.1)'
                            : 'rgba(220, 38, 38, 0.2)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: (theme) =>
                          theme.palette.mode === 'light'
                            ? 'rgba(239, 68, 68, 0.1)'
                            : 'rgba(220, 38, 38, 0.2)',
                        borderRadius: 2,
                        p: 1.5,
                      }}
                    >
                      <Ban size={20} color="#EF4444" />
                    </Box>
                    <Typography sx={{ color: 'error.main', flex: 1 }}>
                      Block {contact?.friend?.name}
                    </Typography>
                  </Box>
                )}

                {conversation?.isGroup && (
                  <Box
                    onClick={() => setShowExitConfirm(true)}
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: (theme) =>
                          theme.palette.mode === 'light'
                            ? 'rgba(239, 68, 68, 0.1)'
                            : 'rgba(220, 38, 38, 0.2)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: (theme) =>
                          theme.palette.mode === 'light'
                            ? 'rgba(239, 68, 68, 0.1)'
                            : 'rgba(220, 38, 38, 0.2)',
                        borderRadius: 2,
                        p: 1.5,
                      }}
                    >
                      <LogOut size={20} color="#EF4444" />
                    </Box>
                    <Typography sx={{ color: 'error.main', flex: 1 }}>Exit group</Typography>
                  </Box>
                )}
              </Paper>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Exit Group Confirmation */}
      <Dialog
        open={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ color: 'text.primary' }}>Exit Group?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
            Are you sure you want to exit "{contact?.friend?.name}"? You will no longer receive
            messages from this group.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ gap: 1.5, px: 3, pb: 2 }}>
          <Button
            onClick={() => setShowExitConfirm(false)}
            variant="outlined"
            sx={{
              flex: 1,
              py: 1,
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // onExitGroup?.();
              setShowExitConfirm(false);
            }}
            variant="contained"
            sx={{
              flex: 1,
              py: 1,
              bgcolor: 'error.main',
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'error.dark',
              },
            }}
          >
            Exit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
