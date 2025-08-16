import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Phone,
  PhoneCall,
  Settings,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PeerConnection {
  pc: RTCPeerConnection;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

const ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export default function VideoChat() {
  const [isConnected, setIsConnected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [myId, setMyId] = useState("");
  const [remoteId, setRemoteId] = useState("");
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected"
  >("disconnected");
  const [error, setError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<PeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Generate random ID for user
  useEffect(() => {
    setMyId(Math.random().toString(36).substring(2, 8));
  }, []);

  // Initialize WebSocket connection
  const connectToSignalingServer = useCallback(() => {
    // In a real app, you'd connect to your signaling server
    // For demo purposes, we'll simulate the connection
    setConnectionStatus("connecting");

    // Simulate WebSocket connection
    setTimeout(() => {
      setIsConnected(true);
      setConnectionStatus("connected");
      setError(null);
    }, 1000);
  }, []);

  // Initialize local media stream
  const initializeLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideoEnabled,
        audio: isAudioEnabled,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (err) {
      setError("Failed to access camera/microphone. Please check permissions.");
      throw err;
    }
  }, [isVideoEnabled, isAudioEnabled]);

  // Create peer connection
  const createPeerConnection = useCallback((localStream: MediaStream) => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    const remoteStream = new MediaStream();

    // Add local stream tracks to peer connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    // Handle remote stream
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });

      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current) {
        // In a real app, send ICE candidate to remote peer via signaling server
        console.log("ICE Candidate:", event.candidate);
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log("Connection state:", pc.connectionState);
      if (pc.connectionState === "connected") {
        setIsCallActive(true);
      } else if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        setIsCallActive(false);
      }
    };

    return { pc, localStream, remoteStream };
  }, []);

  // Start call (create offer)
  const startCall = useCallback(async () => {
    if (!roomId.trim()) {
      setError("Please enter a room ID");
      return;
    }

    try {
      setError(null);
      const localStream = await initializeLocalStream();
      const peerConnection = createPeerConnection(localStream);
      peerConnectionRef.current = peerConnection;

      // Create offer
      const offer = await peerConnection.pc.createOffer();
      await peerConnection.pc.setLocalDescription(offer);

      // In a real app, send offer to remote peer via signaling server
      console.log("Offer created:", offer);
      setRemoteId("remote-user"); // Simulate remote user

      // Simulate receiving answer after 2 seconds
      setTimeout(async () => {
        if (peerConnectionRef.current) {
          // Simulate remote answer
          const answer: RTCSessionDescriptionInit = {
            type: "answer",
            sdp: "simulated-answer-sdp",
          };
          // In real implementation: await peerConnectionRef.current.pc.setRemoteDescription(answer);
          setIsCallActive(true);
        }
      }, 2000);
    } catch (err) {
      console.error("Error starting call:", err);
      setError("Failed to start call");
    }
  }, [roomId, initializeLocalStream, createPeerConnection]);

  // Join call (create answer)
  const joinCall = useCallback(async () => {
    if (!roomId.trim()) {
      setError("Please enter a room ID");
      return;
    }

    try {
      setError(null);
      const localStream = await initializeLocalStream();
      const peerConnection = createPeerConnection(localStream);
      peerConnectionRef.current = peerConnection;

      // Simulate receiving offer and creating answer
      setRemoteId("caller-user");
      setIsCallActive(true);
    } catch (err) {
      console.error("Error joining call:", err);
      setError("Failed to join call");
    }
  }, [roomId, initializeLocalStream, createPeerConnection]);

  // End call
  const endCall = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.pc.close();

      // Stop local stream
      if (peerConnectionRef.current.localStream) {
        peerConnectionRef.current.localStream
          .getTracks()
          .forEach((track) => track.stop());
      }

      peerConnectionRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setIsCallActive(false);
    setRemoteId("");
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (peerConnectionRef.current?.localStream) {
      const videoTrack =
        peerConnectionRef.current.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, []);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (peerConnectionRef.current?.localStream) {
      const audioTrack =
        peerConnectionRef.current.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, []);

  // Connect to signaling server on mount
  useEffect(() => {
    connectToSignalingServer();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      endCall();
    };
  }, [connectToSignalingServer, endCall]);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-full p-2">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Pathly</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Badge
            variant={connectionStatus === "connected" ? "default" : "secondary"}
          >
            {connectionStatus === "connected" ? "Connected" : "Connecting..."}
          </Badge>
          {myId && (
            <Badge variant="outline" className="text-white border-white/20">
              ID: {myId}
            </Badge>
          )}
        </div>
      </div>

      {error && (
        <Alert className="mb-4 bg-red-500/10 border-red-500/20">
          <AlertDescription className="text-red-200">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control Panel */}
        <div className="lg:col-span-1">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isCallActive ? (
                <>
                  <div>
                    <label className="text-sm text-white/80 mb-2 block">
                      Room ID
                    </label>
                    <Input
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      placeholder="Enter room ID"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={startCall}
                      disabled={!isConnected}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <PhoneCall className="w-4 h-4 mr-2" />
                      Start Call
                    </Button>
                    <Button
                      onClick={joinCall}
                      disabled={!isConnected}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Join Call
                    </Button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">Connected to:</span>
                    <Badge
                      variant="outline"
                      className="text-white border-white/20"
                    >
                      {remoteId}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={toggleVideo}
                      variant={isVideoEnabled ? "default" : "destructive"}
                      size="sm"
                      className="flex-1"
                    >
                      {isVideoEnabled ? (
                        <Camera className="w-4 h-4" />
                      ) : (
                        <CameraOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={toggleAudio}
                      variant={isAudioEnabled ? "default" : "destructive"}
                      size="sm"
                      className="flex-1"
                    >
                      {isAudioEnabled ? (
                        <Mic className="w-4 h-4" />
                      ) : (
                        <MicOff className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <Button
                    onClick={endCall}
                    variant="destructive"
                    className="w-full"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    End Call
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Video Area */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-96 lg:h-[500px]">
            {/* Remote Video */}
            <Card className="bg-black/50 backdrop-blur-sm border-white/20 overflow-hidden">
              <CardContent className="p-0 h-full">
                <div className="relative h-full">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {!isCallActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white/60">
                        <Users className="w-12 h-12 mx-auto mb-2" />
                        <p>Waiting for remote peer...</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="secondary"
                      className="bg-black/50 text-white"
                    >
                      Remote
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Local Video */}
            <Card className="bg-black/50 backdrop-blur-sm border-white/20 overflow-hidden">
              <CardContent className="p-0 h-full">
                <div className="relative h-full">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  {!isVideoEnabled && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <CameraOff className="w-12 h-12 text-white/60" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="secondary"
                      className="bg-black/50 text-white"
                    >
                      You
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-6 text-center text-white/60 text-sm">
        {isCallActive ? (
          <p>
            Call active with {remoteId} • Room: {roomId}
          </p>
        ) : (
          <p>Ready to connect • Enter a room ID to start or join a call</p>
        )}
      </div>
    </>
  );
}
