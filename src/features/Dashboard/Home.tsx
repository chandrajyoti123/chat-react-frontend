import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
  Badge,
} from '@mui/material';

import {
  useAuthControllerLogout,
  useContactControllerGetAllContacts,
  useConversationControllerStartConversation,
} from '@/api/generated';
import { useAuthStore } from '@/store/auth';
// import AddContact from './AddContact';
import ChatModule from './ChatModule';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const logoutFn = useAuthStore.getState().logout;
  const logoutMutation = useAuthControllerLogout();

  const { data: contacts, isLoading, error } = useContactControllerGetAllContacts();

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const createConversationMutation = useConversationControllerStartConversation();

  // FIXED: friendId should be a string
  const handleContactClick = (friendId: string) => {
    createConversationMutation.mutate(
      { data: { friendId } },
      {
        onSuccess: (res) => {
          console.log('Conversation created:', res);

          // res.id is conversation ID
          setActiveConversationId(res.id);
        },
        onError: (err) => {
          console.error('Failed to create conversation', err);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography color="error">
          {error instanceof Error ? error.message : 'Failed to fetch contacts'}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
        <Button
          onClick={() =>
            logoutMutation.mutate(undefined, {
              onSuccess: () => logoutFn(),
            })
          }
        >
          Logout
        </Button>

        {/* <AddContact /> */}
        <Button
          onClick={() => {
            navigate('/AddContact');
          }}
        >
          Add Contact
        </Button>
        <Button
          onClick={() => {
            navigate('/AddGroup');
          }}
        >
          Add group
        </Button>

        <Typography variant="h5" mb={2}>
          Contacts List
        </Typography>

        <List>
          {contacts?.map((contact) => (
            <ListItem
              key={contact.contactId}
              divider
              onClick={() => handleContactClick(contact.friend.id)}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <ListItemText
                primary={contact.friend.name}
                secondary={`Email: ${contact.friend.email} | Phone: ${contact.friend.phone}`}
              />

              {contact.unreadCount > 0 && (
                <Badge color="error" badgeContent={contact.unreadCount} />
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      {activeConversationId && (
        <ChatModule
          conversationId={activeConversationId}
          onClose={() => setActiveConversationId(null)}
        />
      )}
    </>
  );
};

export default Home;
