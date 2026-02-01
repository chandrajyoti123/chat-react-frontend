// import { useState, useEffect } from 'react';
// import { Box, Typography, IconButton, Avatar } from '@mui/material';
// import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2, VolumeX } from 'lucide-react';
// // import type { CallData } from '../App';
// import { useConversationControllerGetOppositeMember } from '@/api/generated';

// type OngoingCallProps = {
//   conversationId: string;
//   // callData: CallData;
//   onEndCall: () => void;
//   // theme: 'light' | 'dark';
// };

// export function OngoingCall({ onEndCall, conversationId }: OngoingCallProps) {
//   const callType: 'audio' | 'video' = 'audio';

//   const { data: oppositeMember } = useConversationControllerGetOppositeMember(conversationId);
//   const [muted, setMuted] = useState(false);
//   const [videoEnabled, setVideoEnabled] = useState(callType === 'video');
//   const [speakerOn, setSpeakerOn] = useState(false);
//   const [duration, setDuration] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setDuration((d) => d + 1);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const formatDuration = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         background: 'linear-gradient(135deg, #3F51B5 0%, #303F9F 50%, #1A237E 100%)',
//         p: 4,
//       }}
//     >
//       <Box
//         sx={{
//           textAlign: 'center',
//           flex: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//       >
//         <Box sx={{ mb: 4 }}>
//           {callType === 'video' && videoEnabled ? (
//             <Box
//               sx={{
//                 width: 288,
//                 height: 320,
//                 bgcolor: 'rgba(31, 41, 55, 0.5)',
//                 borderRadius: 6,
//                 mb: 3,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 position: 'relative',
//                 overflow: 'hidden',
//                 boxShadow: 6,
//                 backdropFilter: 'blur(8px)',
//                 border: 2,
//                 borderColor: 'rgba(255, 255, 255, 0.1)',
//               }}
//             >
//               <Box
//                 sx={{
//                   position: 'absolute',
//                   inset: 0,
//                   background:
//                     'linear-gradient(135deg, rgba(66, 165, 245, 0.3) 0%, rgba(30, 136, 229, 0.3) 100%)',
//                 }}
//               />
//               <Typography
//                 sx={{
//                   position: 'relative',
//                   zIndex: 10,
//                   color: 'white',
//                   fontSize: '4rem',
//                 }}
//               >
//                 {oppositeMember?.user?.name?.charAt(0).toUpperCase()}
//               </Typography>
//               {/* Small preview of self */}
//               <Box
//                 sx={{
//                   position: 'absolute',
//                   top: 2,
//                   right: 2,
//                   width: 96,
//                   height: 128,
//                   bgcolor: 'rgba(17, 24, 39, 0.8)',
//                   borderRadius: 4,
//                   border: 2,
//                   borderColor: 'rgba(255, 255, 255, 0.3)',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   boxShadow: 4,
//                   backdropFilter: 'blur(8px)',
//                 }}
//               >
//                 <Typography sx={{ color: 'white' }}>You</Typography>
//               </Box>
//             </Box>
//           ) : (
//             <Avatar
//               sx={{
//                 width: 128,
//                 height: 128,
//                 mx: 'auto',
//                 background: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
//                 fontSize: '3rem',
//                 mb: 3,
//                 boxShadow: 6,
//               }}
//             >
//               {oppositeMember?.user?.name?.charAt(0).toUpperCase()}
//             </Avatar>
//           )}
//           <Typography variant="h3" sx={{ color: 'white', mb: 1 }}>
//             {oppositeMember?.user?.name}
//           </Typography>
//           <Typography variant="h6" sx={{ color: 'rgba(197, 202, 233, 1)' }}>
//             {formatDuration(duration)}
//           </Typography>
//         </Box>
//       </Box>

//       {/* Controls */}
//       <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', pb: 4 }}>
//         {callType === 'audio' && (
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
//             <IconButton
//               onClick={() => setSpeakerOn(!speakerOn)}
//               sx={{
//                 width: 56,
//                 height: 56,
//                 bgcolor: speakerOn ? 'secondary.main' : 'rgba(255, 255, 255, 0.2)',
//                 color: 'white',
//                 boxShadow: 4,
//                 transition: 'all 0.2s',
//                 backdropFilter: speakerOn ? 'none' : 'blur(8px)',
//                 '&:hover': {
//                   bgcolor: 'secondary.main',
//                 },
//               }}
//             >
//               {speakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
//             </IconButton>
//             <Typography variant="caption" sx={{ color: 'white' }}>
//               Speaker
//             </Typography>
//           </Box>
//         )}

//         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
//           <IconButton
//             onClick={() => setMuted(!muted)}
//             sx={{
//               width: 56,
//               height: 56,
//               bgcolor: muted ? 'error.main' : 'rgba(255, 255, 255, 0.2)',
//               color: 'white',
//               boxShadow: 4,
//               transition: 'all 0.2s',
//               backdropFilter: muted ? 'none' : 'blur(8px)',
//               '&:hover': {
//                 bgcolor: 'error.main',
//               },
//             }}
//           >
//             {muted ? <MicOff size={24} /> : <Mic size={24} />}
//           </IconButton>
//           <Typography variant="caption" sx={{ color: 'white' }}>
//             {muted ? 'Unmute' : 'Mute'}
//           </Typography>
//         </Box>

//         {callType === 'video' && (
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
//             <IconButton
//               onClick={() => setVideoEnabled(!videoEnabled)}
//               sx={{
//                 width: 56,
//                 height: 56,
//                 bgcolor: !videoEnabled ? 'error.main' : 'rgba(255, 255, 255, 0.2)',
//                 color: 'white',
//                 boxShadow: 4,
//                 transition: 'all 0.2s',
//                 backdropFilter: videoEnabled ? 'blur(8px)' : 'none',
//                 '&:hover': {
//                   bgcolor: 'error.main',
//                 },
//               }}
//             >
//               {videoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
//             </IconButton>
//             <Typography variant="caption" sx={{ color: 'white' }}>
//               {videoEnabled ? 'Stop' : 'Start'}
//             </Typography>
//           </Box>
//         )}

//         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
//           <IconButton
//             onClick={onEndCall}
//             sx={{
//               width: 56,
//               height: 56,
//               bgcolor: 'error.main',
//               color: 'white',
//               boxShadow: 4,
//               transition: 'all 0.2s',
//               '&:hover': {
//                 bgcolor: 'error.dark',
//                 boxShadow: 5,
//               },
//             }}
//           >
//             <PhoneOff size={24} />
//           </IconButton>
//           <Typography variant="caption" sx={{ color: 'white' }}>
//             End
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// }
