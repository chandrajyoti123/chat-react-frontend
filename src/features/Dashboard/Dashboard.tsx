import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  Badge,
  InputAdornment,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  UserPlus,
  Users,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Phone,
  CheckCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  useContactControllerGetAllContacts,
  useConversationControllerGetMyGroups,
  useConversationControllerStartConversation,
  type ConversationParticipantDto,
} from '@/api/generated';
import { useAuthStore } from '@/store/auth';
import { getLastSeen } from '@/shared/formatter';

type DashboardProps = {
  // user: User;
  // contacts: Contact[];
  // onChatSelect: (contact: Contact) => void;
  // onOpenSettings: () => void;
  // onSimulateIncomingCall: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  // onOpenAddContact: () => void;
  // onOpenCreateGroup: () => void;
};

const Dashboard: React.FC<DashboardProps> = ({ theme, onToggleTheme }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: contacts } = useContactControllerGetAllContacts();
  const { data: groups } = useConversationControllerGetMyGroups();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'groups'>('all');

  const filteredContacts = contacts?.filter((contact) => {
    const matchesSearch = contact.friend.name.toLowerCase().includes(searchQuery.toLowerCase());
    // const matchesTab = activeTab === 'all' || (activeTab === 'groups' && contact.contactId === '3');
    return matchesSearch;
  });

  const filteredGroups = groups?.filter((group) => {
    const matchesSearch = group?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    // const matchesTab = activeTab === 'all' || (activeTab === 'groups' && contact.contactId === '3');
    return matchesSearch;
  });

  const createConversationMutation = useConversationControllerStartConversation();

  // FIXED: friendId should be a string
  const handleContactClick = (friendId: string, contactId: string) => {
    createConversationMutation.mutate(
      { data: { friendId } },
      {
        onSuccess: (res) => {
          console.log('Conversation created:', res);
          navigate('/ChatScreen', { state: { conversationId: res.id, contactId: contactId } });
          // res.id is conversation ID
          // setActiveConversationId(res.id);
        },
        onError: (err) => {
          console.error('Failed to create conversation', err);
        },
      },
    );
  };

  const handleGroupClick = (conversationId: string) => {
    navigate('/ChatScreen', { state: { conversationId: conversationId } });
  };

  const isMessageRead = (conversation: any) => {
    // if (!conversation?.isGroup) {
    //   // one-to-one chat
    //   return conversation?.lastMessageReads?.length > 0;
    // }

    // group chat
    // remove sender from participants
    const otherParticipantsCount = conversation.participants.filter(
      (p: ConversationParticipantDto) => p.userId !== conversation.lastMessageBy,
    ).length;

    return conversation.lastMessageReads?.length === otherParticipantsCount;
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>
      {/* Top Bar - Full Width */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bgcolor: 'primary.main',
          px: 3,
          py: 2,
          boxShadow: 4,
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: 1280,
            mx: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: 'secondary.main',
                boxShadow: 3,
              }}
            >
              {user?.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography sx={{ color: 'white' }}>{user?.name}</Typography>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(197, 202, 233, 1)', fontSize: '0.875rem' }}
              >
                {user?.about}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <IconButton
              onClick={onToggleTheme}
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </IconButton>
            <IconButton
              onClick={() => {
                navigate('/Setting');
              }}
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <SettingsIcon size={20} />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flex: 1, mt: 10, maxWidth: 1280, mx: 'auto', width: '100%' }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: { xs: '100%', md: 384 },
            bgcolor: 'background.paper',
            boxShadow: 5,
            borderTopLeftRadius: 16,
            borderRight: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Search */}
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <TextField
              value={searchQuery}
              onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Search conversations..."
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} color="#9CA3AF" />
                  </InputAdornment>
                ),
              }}
              sx={{
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
          </Box>

          {/* Tabs */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: (theme) =>
                theme.palette.mode === 'light' ? '#FAFAFA' : 'rgba(55, 65, 81, 0.5)',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_: any, value: any) => setActiveTab(value)}
              variant="fullWidth"
              TabIndicatorProps={{
                style: {
                  backgroundColor: '#3F51B5',
                  height: 2,
                },
              }}
            >
              <Tab
                label="All Chats"
                value="all"
                sx={{
                  textTransform: 'none',
                  color: activeTab === 'all' ? 'primary.main' : 'text.secondary',
                }}
              />
              <Tab
                label="Groups"
                value="groups"
                sx={{
                  textTransform: 'none',
                  color: activeTab === 'groups' ? 'primary.main' : 'text.secondary',
                }}
              />
            </Tabs>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Button
              onClick={() => {
                navigate('/AddContact');
              }}
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<UserPlus size={16} />}
              sx={{
                py: 1,
                boxShadow: 3,
                textTransform: 'none',
              }}
            >
              Add Contact
            </Button>
            <Button
              onClick={() => {
                navigate('/AddGroup');
              }}
              variant="contained"
              sx={{
                py: 1,
                boxShadow: 3,
                textTransform: 'none',
                bgcolor: 'secondary.main',
                '&:hover': {
                  bgcolor: 'secondary.dark',
                },
              }}
              fullWidth
              startIcon={<Users size={16} />}
            >
              New Group
            </Button>
          </Box>

          {/* Contacts List */}
          {activeTab === 'all' && (
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              {filteredContacts?.map((contact) => (
                <Box
                  key={contact.contactId}
                  onClick={() => {
                    handleContactClick(contact.friend.id, contact.contactId);
                  }}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    borderBottom: 1,
                    borderColor: (theme) =>
                      theme.palette.mode === 'light' ? '#F5F5F5' : '#374151',
                    '&:hover': {
                      bgcolor: (theme) => (theme.palette.mode === 'light' ? '#FAFAFA' : '#374151'),
                    },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: contact?.friend?.isOnline ? '#10B981' : 'transparent',
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          border: 2,
                          borderColor: 'background.paper',
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          background: 'linear-gradient(135deg, #3F51B5 0%, #42A5F5 100%)',
                          boxShadow: 3,
                        }}
                      >
                        {contact.friend.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            color: 'text.primary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {contact.friend.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            ml: 1,
                            flexShrink: 0,
                          }}
                        >
                      {contact?.lastMessageAt && getLastSeen(contact?.lastMessageAt)}    
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItem: 'center',
                            gap: 1,
                          }}
                        >
                          {contact.friend.id === user?.id && (
                            <Box sx={{ color: 'grey.600' }}>
                              {contact?.lastMessageRead?.[0]?.id ? (
                                <CheckCheck size={16} color="#42A5F5" />
                              ) : (
                                <CheckCheck size={16} />
                              )}
                            </Box>
                          )}
                          {contact?.lastMessage && `${contact?.lastMessage}`}
                        </Typography>
                        {contact.unreadCount! > 0 && (
                          <Box
                            sx={{
                              bgcolor: 'secondary.main',
                              color: 'white',
                              fontSize: '0.75rem',
                              borderRadius: 10,
                              px: 1,
                              py: 0.25,
                              ml: 1,
                              flexShrink: 0,
                              boxShadow: 1,
                            }}
                          >
                            {contact.unreadCount}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
          {activeTab === 'groups' && (
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              {filteredGroups?.map((contact) => (
                <Box
                  key={contact?.id}
                  onClick={() => {
                    handleGroupClick(contact.id);
                    // console.log('Group clicked:', contact?.id);
                  }}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    borderBottom: 1,
                    borderColor: (theme) =>
                      theme.palette.mode === 'light' ? '#F5F5F5' : '#374151',
                    '&:hover': {
                      bgcolor: (theme) => (theme.palette.mode === 'light' ? '#FAFAFA' : '#374151'),
                    },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant="dot"
                      // sx={{
                      //   '& .MuiBadge-badge': {
                      //     // backgroundColor: contact?.friend?.isOnline ? '#10B981' : 'transparent',
                      //     width: 14,
                      //     height: 14,
                      //     borderRadius: '50%',
                      //     border: 2,
                      //     borderColor: 'background.paper',
                      //   },
                      // }}
                    >
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          background: 'linear-gradient(135deg, #3F51B5 0%, #42A5F5 100%)',
                          boxShadow: 3,
                        }}
                      >
                        {contact?.name?.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            color: 'text.primary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {contact.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            ml: 1,
                            flexShrink: 0,
                          }}
                        >
                          {  contact?.lastMessageAt && getLastSeen(contact?.lastMessageAt)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'flex',
                            alignItem: 'center',
                            gap: 1,
                          }}
                        >
                          {contact.lastMessageBy === user?.id && (
                            <Box sx={{ color: 'grey.600' }}>
                              {isMessageRead(contact) ? (
                                <CheckCheck size={16} color="#42A5F5" />
                              ) : (
                                <CheckCheck size={16} />
                              )}
                            </Box>
                          )}
                          {contact?.lastMessage}
                        </Typography>
                        {contact.unreadCount! > 0 && (
                          <Box
                            sx={{
                              bgcolor: 'secondary.main',
                              color: 'white',
                              fontSize: '0.75rem',
                              borderRadius: 10,
                              px: 1,
                              py: 0.25,
                              ml: 1,
                              flexShrink: 0,
                              boxShadow: 1,
                            }}
                          >
                            {contact.unreadCount}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Demo Button */}
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: (theme) =>
                theme.palette.mode === 'light' ? '#FAFAFA' : 'rgba(55, 65, 81, 0.5)',
            }}
          >
            <Button
              onClick={() => {}}
              fullWidth
              variant="contained"
              startIcon={<Phone size={16} />}
              sx={{
                py: 1,
                background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #059669 0%, #047857 100%)',
                },
                boxShadow: 3,
                textTransform: 'none',
              }}
            >
              Simulate Incoming Call
            </Button>
          </Box>
        </Box>

        {/* Empty State */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  bgcolor: (theme) =>
                    theme.palette.mode === 'light' ? '#E8EAF6' : 'rgba(63, 81, 181, 0.2)',
                  borderRadius: 4,
                  p: 4,
                  boxShadow: 4,
                }}
              >
                <Users size={64} color="#3F51B5" />
              </Box>
            </Box>
            <Typography variant="h5" sx={{ color: 'text.primary', mb: 1 }}>
              Select a chat
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Choose a conversation to start messaging
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
