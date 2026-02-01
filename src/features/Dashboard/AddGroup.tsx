import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Avatar,
  Badge,
  Paper,
  Alert,
  InputAdornment,
} from '@mui/material';
import { ArrowLeft, Users, Check, Search, AlertCircle, CheckCircle } from 'lucide-react';

import {
  useContactControllerGetAllContacts,
  useConversationControllerCreateGroup,
} from '@/api/generated';
import { useNavigate } from 'react-router-dom';

type CreateGroupProps = {};

const AddGroup: React.FC<CreateGroupProps> = ({}) => {
  const navigate = useNavigate();
  const addGroupMutation = useConversationControllerCreateGroup();
  const { data: contacts } = useContactControllerGetAllContacts();
  console.log(contacts, 'contat');
  const [groupName, setGroupName] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const toggleContact = (contactId: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedContacts(newSelected);
    setError('');
  };

  const filteredContacts = contacts?.filter((contact) =>
    contact?.friend?.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!groupName.trim()) {
      setError('Please enter a group name');
      return;
    }

    if (selectedContacts.size < 1) {
      setError('Please select at least 1 contacts for the group');
      return;
    }

    // const selectedIds = contacts?.filter(c => selectedContacts.has(c.friend.id))?.map(c => c.friend.id);

    const selectedIds =
      contacts?.filter((c) => selectedContacts.has(c.friend.id))?.map((c) => c.friend.id) ?? [];

    const payload = {
      name: groupName,
      members: selectedIds,
    };
    addGroupMutation.mutate(
      { data: payload },
      {
        onSuccess: () => {
          console.log('group created successfully');
          setSuccess(true);
        },
        onError: (error: any) => {
          setError(error?.message);
          console.error('Error adding contact:', error);
        },
      },
    );

    // onCreateGroup(groupName, selected);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
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
            Create New Group
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 672,
          mx: 'auto',
          width: '100%',
          p: 2,
        }}
      >
        {/* Group Name Section */}
        <Paper elevation={3} sx={{ borderRadius: 3, p: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === 'light' ? '#E8EAF6' : 'rgba(63, 81, 181, 0.2)',
                borderRadius: 3,
                p: 1.5,
              }}
            >
              <Users size={32} color="#3F51B5" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.primary', mb: 1 }}>
                Group Name
              </Typography>
              <TextField
                type="text"
                value={groupName}
                onChange={(e: { target: { value: React.SetStateAction<string> } }) => {
                  setGroupName(e.target.value);
                  setError('');
                }}
                placeholder="Enter group name"
                fullWidth
                size="small"
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
            </Box>
          </Box>

          {/* Selected Count */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1.5,
              bgcolor: (theme) =>
                theme.palette.mode === 'light' ? '#E8EAF6' : 'rgba(63, 81, 181, 0.1)',
              borderRadius: 2,
            }}
          >
            <Typography sx={{ color: 'text.primary' }}>Selected Contacts</Typography>
            <Box
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                px: 1.5,
                py: 0.5,
                borderRadius: 10,
                fontSize: '0.875rem',
                boxShadow: 1,
              }}
            >
              {selectedContacts.size}
            </Box>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ borderRadius: 3, p: 2, mb: 2 }}>
          <TextField
            value={searchQuery}
            onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search contacts..."
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
        </Paper>

        {/* Contacts List */}
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: (theme) =>
                theme.palette.mode === 'light' ? '#FAFAFA' : 'rgba(55, 65, 81, 0.5)',
            }}
          >
            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              Select Contacts
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Choose at least 2 contacts to create a group
            </Typography>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            {filteredContacts?.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 6,
                  color: 'text.secondary',
                }}
              >
                <Users size={48} />
                <Typography sx={{ mt: 1 }}>No contacts found</Typography>
              </Box>
            ) : (
              filteredContacts?.map((contact) => {
                const isSelected = selectedContacts.has(contact.friend.id);
                return (
                  <Box
                    key={contact.contactId}
                    onClick={() => toggleContact(contact.friend.id)}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      borderBottom: 1,
                      borderColor: (theme) =>
                        theme.palette.mode === 'light' ? '#F5F5F5' : '#374151',
                      bgcolor: isSelected
                        ? (theme) =>
                            theme.palette.mode === 'light' ? '#E8EAF6' : 'rgba(63, 81, 181, 0.2)'
                        : 'transparent',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        bgcolor: isSelected
                          ? (theme) =>
                              theme.palette.mode === 'light' ? '#E8EAF6' : 'rgba(63, 81, 181, 0.2)'
                          : (theme) => (theme.palette.mode === 'light' ? '#FAFAFA' : '#374151'),
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: contact.friend.isOnline ? '#10B981' : 'transparent',
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
                        <Typography sx={{ color: 'text.primary' }}>
                          {contact.friend.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {contact.friend.about}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          border: 2,
                          borderColor: isSelected ? 'primary.main' : 'grey.300',
                          bgcolor: isSelected ? 'primary.main' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}
                      >
                        {isSelected && <Check size={16} color="white" />}
                      </Box>
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </Paper>

        {/* Error Message */}
        {error && (
          <Alert
            severity="error"
            icon={<AlertCircle size={20} />}
            sx={{
              mt: 2,
              borderRadius: 3,
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

        {/* Create Button */}
        <Box sx={{ mt: 2 }}>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              py: 1.75,
              boxShadow: 3,
              textTransform: 'none',
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            Create Group ({selectedContacts.size} members)
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddGroup;
