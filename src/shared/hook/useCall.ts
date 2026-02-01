import { socket } from '@/src/socket/socket';
import { useRef, useState, useEffect } from 'react';

export function useCall(conversationId: string) {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream>(new MediaStream());

  const [inCall, setInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [callId, setCallId] = useState<string | null>(null);

  /* ---------------- MEDIA ---------------- */

  const getMedia = async (video = true) => {
    localStreamRef.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video,
    });
    return localStreamRef.current;
  };

  /* ---------------- PEER ---------------- */

  const createPeer = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.ontrack = (e) => {
      e.streams[0].getTracks().forEach((track) => remoteStreamRef.current.addTrack(track));
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit('webrtc:ice-candidate', {
          conversationId,
          candidate: e.candidate,
        });
      }
    };

    pcRef.current = pc;
    return pc;
  };

  /* ---------------- CALL ACTIONS ---------------- */

  const startCall = async (type: 'AUDIO' | 'VIDEO') => {
    await getMedia(type === 'VIDEO');

    socket.emit('call:start', {
      conversationId,
      callType: type,
    });
  };

  const acceptCall = async () => {
    if (!callId) return;

    setInCall(true);
    socket.emit('call:accept', { callId });
  };

  const rejectCall = () => {
    if (!callId) return;

    socket.emit('call:reject', { callId });
    cleanup();
  };

  const endCall = () => {
    if (!callId) return;

    socket.emit('call:end', { callId });
    cleanup();
  };

  /* ---------------- CLEANUP ---------------- */

  const cleanup = () => {
    pcRef.current?.close();
    pcRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    remoteStreamRef.current = new MediaStream();
    setIncomingCall(null);
    setCallId(null);
    setInCall(false);
  };

  /* ---------------- SOCKET LISTENERS ---------------- */

  useEffect(() => {
    /* Incoming ring */
    socket.on('call:ring', (data) => {
      setIncomingCall(data);
      setCallId(data.callId);
    });

    /* Call accepted → create offer */
    socket.on('call:accepted', async () => {
      const pc = createPeer();
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit('webrtc:offer', {
        conversationId,
        offer,
      });
    });

    /* Receive offer */
    socket.on('webrtc:offer', async ({ offer }) => {
      await getMedia(true);

      const pc = createPeer();
      await pc.setRemoteDescription(offer);

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('webrtc:answer', {
        conversationId,
        answer,
      });

      setInCall(true);
    });

    socket.on('webrtc:answer', async ({ answer }) => {
      await pcRef.current?.setRemoteDescription(answer);
    });

    socket.on('webrtc:ice-candidate', ({ candidate }) => {
      pcRef.current?.addIceCandidate(candidate);
    });

    socket.on('call:ended', cleanup);
    socket.on('call:rejected', cleanup);
    socket.on('call:missed', cleanup);

    return () => {
      socket.off('call:ring');
      socket.off('call:accepted');
      socket.off('webrtc:offer');
      socket.off('webrtc:answer');
      socket.off('webrtc:ice-candidate');
      socket.off('call:ended');
      socket.off('call:rejected');
      socket.off('call:missed');
    };
  }, [conversationId, callId]);

  return {
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    inCall,
    incomingCall,
    localStream: localStreamRef,
    remoteStream: remoteStreamRef,
  };
}
