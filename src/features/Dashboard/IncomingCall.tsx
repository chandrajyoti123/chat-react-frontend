// import { useEffect, useState } from 'react';
// import { Box, Typography, IconButton, Avatar } from '@mui/material';
// import { Phone, PhoneOff, Volume2 } from 'lucide-react';
// // import type { CallData } from '../App';
// import { useConversationControllerGetOppositeMember } from '@/api/generated';

// type IncomingCallProps = {
//   conversationId: string;
//   // callData: CallData;
//   onAccept: () => void;
//   onReject: () => void;
//   // theme: 'light' | 'dark';
// };

// export function IncomingCall({ onAccept, onReject, conversationId }: IncomingCallProps) {
//   const [ringing, setRinging] = useState(true);
//   const { data: oppositeMember } = useConversationControllerGetOppositeMember(conversationId);
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setRinging((r) => !r);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         background: 'linear-gradient(135deg, #3F51B5 0%, #303F9F 50%, #1A237E 100%)',
//       }}
//     >
//       <Box sx={{ textAlign: 'center', p: 4 }}>
//         <Box sx={{ mb: 4 }}>
//           <Avatar
//             sx={{
//               width: 128,
//               height: 128,
//               mx: 'auto',
//               background: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)',
//               fontSize: '3rem',
//               mb: 3,
//               boxShadow: 6,
//               transform: ringing ? 'scale(1.1)' : 'scale(1)',
//               transition: 'transform 0.3s',
//             }}
//           >
//             {oppositeMember?.user?.name?.charAt(0).toUpperCase()}
//           </Avatar>
//           <Typography variant="h3" sx={{ color: 'white', mb: 1 }}>
//             {oppositeMember?.user?.name}
//           </Typography>
//           <Typography variant="h6" sx={{ color: 'rgba(197, 202, 233, 1)', mb: 3 }}>
//             Incoming
//             {/* {callData.type}  */}
//             call...
//           </Typography>
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: 1,
//               color: 'rgba(159, 166, 218, 1)',
//             }}
//           >
//             <Volume2 size={20} color={ringing ? '#42A5F5' : 'inherit'} />
//             <Typography>Ringing</Typography>
//           </Box>
//         </Box>

//         <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
//             <IconButton
//               onClick={onReject}
//               sx={{
//                 width: 64,
//                 height: 64,
//                 bgcolor: 'error.main',
//                 color: 'white',
//                 boxShadow: 4,
//                 transition: 'all 0.2s',
//                 '&:hover': {
//                   bgcolor: 'error.dark',
//                   boxShadow: 5,
//                   transform: 'scale(1.1)',
//                 },
//               }}
//             >
//               <PhoneOff size={32} />
//             </IconButton>
//             <Typography variant="body2" sx={{ color: 'white' }}>
//               Decline
//             </Typography>
//           </Box>
//           <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
//             <IconButton
//               onClick={onAccept}
//               sx={{
//                 width: 64,
//                 height: 64,
//                 bgcolor: 'success.main',
//                 color: 'white',
//                 boxShadow: 4,
//                 transition: 'all 0.2s',
//                 '&:hover': {
//                   bgcolor: 'success.dark',
//                   boxShadow: 5,
//                   transform: 'scale(1.1)',
//                 },
//               }}
//             >
//               <Phone size={32} />
//             </IconButton>
//             <Typography variant="body2" sx={{ color: 'white' }}>
//               Accept
//             </Typography>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// }
