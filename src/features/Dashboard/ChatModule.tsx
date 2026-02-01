import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextFormField } from '@/components/FormFields/TextFormField';
import { FormikFileUpload } from '@/components/FormFields/UploadChatFileForm';
import { useChat } from '@/shared/hook/useChat';
import { useAuthStore } from '@/store/auth';
import { useMenu } from '@/shared/hook/useMenu';
import MenuPopover from '@/components/MenuPopover';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  useMessageControllerDeleteForEveryone,
  useMessageControllerDeleteForMe,
} from '@/api/generated';

import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import { useCall } from '@/shared/hook/useCall';

interface ChatModuleProps {
  conversationId: string;
  onClose?: () => void;
  title?: string;
  side?: 'left' | 'right';
}

const ChatModule: React.FC<ChatModuleProps> = ({
  conversationId,
  onClose,
  title = 'Chat Room',
  side = 'right',
}) => {
  const { anchorEl, openMenu, handleMenuOpen, handleMenuClose } = useMenu();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { messages, sendMessage, typingUsers, emitTypingStart, emitTypingStop } =
    useChat(conversationId);
  const { startCall, acceptCall, rejectCall, incomingCall } = useCall(conversationId);
  const { user } = useAuthStore();

  const [filePreview, setFilePreview] = useState<any | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string>('');
  const isMyMessage = messages.find((m) => m.id === selectedMessageId)?.sender.id === user?.id;
  const deleteForEveryOneMutation = useMessageControllerDeleteForEveryone();
  const deleteForMeMutation = useMessageControllerDeleteForMe();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const menuItems = [
    ...(isMyMessage
      ? [
          {
            label: 'Delete for Everyone',
            onClick: () => {
              deleteForEveryOneMutation.mutate(
                { messageId: selectedMessageId },
                { onSuccess: handleMenuClose },
              );
            },
          },
        ]
      : []),
    {
      label: 'Delete for Me',
      onClick: () => {
        deleteForMeMutation.mutate(
          { messageId: selectedMessageId },
          { onSuccess: handleMenuClose },
        );
      },
    },
    {
      label: 'Replay',
      onClick: () => {},
    },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        [side]: 0,
        top: 0,
        height: '100vh',
        width: '400px',
        bgcolor: '#fff',
        borderLeft: side === 'right' ? '1px solid #ddd' : 'none',
        borderRight: side === 'left' ? '1px solid #ddd' : 'none',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 2000,
      }}
    >
      {/* Header */}
      <Box sx={{ position: 'relative', p: 2 }}>
        <IconButton
          sx={{
            position: 'absolute',
            top: '20px',
            right: '5px',
            bgcolor: 'grey.200',
            p: 0.3,
            borderRadius: '50%',
            boxShadow: 2,
          }}
          onClick={onClose}
        >
          <CloseIcon sx={{ fontSize: '22px' }} />
        </IconButton>
        <IconButton onClick={() => startCall('AUDIO')}>
          <CallIcon />
        </IconButton>

        <IconButton onClick={() => startCall('VIDEO')}>
          <VideocamIcon />
        </IconButton>
      </Box>

      <Typography variant="h6" mb={2}>
        {title}
      </Typography>

      {/* Chat Messages */}
      <Paper
        sx={{
          flexGrow: 1,
          p: 2,
          overflowY: 'auto',
          mb: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 400,
          position: 'relative',
        }}
      >
        {messages.map((msg) => {
          console.log(msg, 'msge');
          const isMine = msg?.senderId === user?.id;

          return (
            <Box
              key={msg.id}
              sx={{
                mb: 2,
                textAlign: isMine ? 'right' : 'left',
              }}
            >
              <Box>
                <Typography variant="caption">
                  {isMine ? 'You' : msg.senderId} • {new Date(msg.createdAt).toLocaleTimeString()}
                </Typography>

                <IconButton
                  size="small"
                  sx={{ position: 'absolute' }}
                  onClick={(e) => {
                    handleMenuOpen(e);
                    setSelectedMessageId(msg.id);
                  }}
                >
                  <KeyboardArrowDownIcon />
                </IconButton>
              </Box>

              {/* Show image preview */}
              {/* {msg?.type === "IMAGE" ? (
                                <Box
                                    component="img"
                                    src={msg.content}
                                    alt="chat image"
                                    sx={{
                                        maxWidth: "70%",
                                        borderRadius: 2,
                                        mb: 0.5,
                                        display: "inline-block",
                                    }}
                                />
                            ) : <Typography
                                sx={{
                                    display: "inline-block",
                                    px: 1.5,
                                    py: 0.8,
                                    borderRadius: 2,
                                    maxWidth: "80%",
                                    bgcolor: isMine ? "primary.main" : "grey.300",
                                    color: isMine ? "white" : "black",
                                }}
                            >
                                {msg.content}
                            </Typography> } */}

              {msg.type === 'IMAGE' ? (
                <Box
                  component="img"
                  src={msg.content}
                  alt="chat image"
                  sx={{
                    maxWidth: '70%',
                    borderRadius: 2,
                    mb: 0.5,
                    display: 'inline-block',
                  }}
                />
              ) : msg.type === 'FILE' ? (
                <Paper
                  elevation={1}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: '80%',
                    bgcolor: isMine ? 'primary.light' : 'grey.200',
                  }}
                >
                  📎
                  <Box>
                    <Typography variant="body2" noWrap>
                      {msg.content.split('/').pop()}
                    </Typography>

                    <Button
                      size="small"
                      variant="text"
                      component="a"
                      href={msg.content}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </Button>
                  </Box>
                </Paper>
              ) : (
                <Typography
                  sx={{
                    display: 'inline-block',
                    px: 1.5,
                    py: 0.8,
                    borderRadius: 2,
                    maxWidth: '80%',
                    bgcolor: isMine ? 'primary.main' : 'grey.300',
                    color: isMine ? 'white' : 'black',
                  }}
                >
                  {msg.content}
                </Typography>
              )}
            </Box>
          );
        })}

        {typingUsers.length > 0 && (
          <Box
            sx={{
              position: 'sticky',
              bottom: 0,
              mt: 5,
              pb: 1,
              pointerEvents: 'none',
            }}
          >
            <Typography
              sx={{
                display: 'inline-block',
                px: 1.5,
                py: 0.8,
                borderRadius: 2,
                bgcolor: 'grey.300',
                fontSize: '0.85rem',
                fontStyle: 'italic',
              }}
            >
              Typing…
            </Typography>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Paper>

      {/* Input */}
      <Box mb={'2rem'}>
        <Formik
          initialValues={{
            message: '',
            chatFile: { file: null, fileMeta: null },
          }}
          validationSchema={Yup.object({
            message: Yup.string(),
            chatFile: Yup.object().shape({
              fileMeta: Yup.object().nullable(),
              file: Yup.mixed().nullable(),
            }),
          })}
          onSubmit={(values, { resetForm }) => {
            sendMessage({
              conversationId,
              content: values.message || filePreview?.url || '',
              meta: filePreview,
            });

            resetForm();
            setFilePreview(null);
          }}
        >
          {() => (
            <Form>
              {filePreview && (
                <Box
                  sx={{
                    mb: 1,
                    position: 'relative',
                    display: 'inline-block',
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: -8, right: -8 }}
                    onClick={() => setFilePreview(null)}
                  >
                    <CloseIcon />
                  </IconButton>

                  {filePreview.type.startsWith('image') ? (
                    <img
                      src={filePreview.url}
                      alt="preview"
                      style={{ maxWidth: 200, borderRadius: 8 }}
                    />
                  ) : (
                    <Typography>{filePreview.url.split('/').pop()}</Typography>
                  )}
                </Box>
              )}

              <Box display="flex" alignItems="center" gap={1}>
                <Field
                  name="chatFile"
                  component={FormikFileUpload}
                  label="Attach File"
                  onUploadSuccess={(meta: any) => setFilePreview(meta)}
                />

                <Field
                  name="message"
                  placeholder="Type message..."
                  component={TextFormField}
                  fullWidth
                  inputProps={{
                    onChange: () => emitTypingStart(),
                    onBlur: () => emitTypingStop(),
                  }}
                />

                <Button variant="contained" type="submit" sx={{ mt: '15px' }}>
                  Send
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>

      <MenuPopover
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        menuItems={menuItems}
      />

      <Dialog open={!!incomingCall}>
        <DialogTitle>Incoming {incomingCall?.callType} Call</DialogTitle>
        <DialogActions>
          <Button onClick={acceptCall}>Accept</Button>
          <Button onClick={rejectCall}>Reject</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatModule;
