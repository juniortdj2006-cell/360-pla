
import React, { useRef, useState, useEffect } from 'react';
import { EventData, VIDEO_DURATION } from '../types';

interface RecorderProps {
  eventData: EventData;
  onFinish: (blobUrl: string) => void;
  onBack: () => void;
}

const Recorder: React.FC<RecorderProps> = ({ eventData, onFinish, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(VIDEO_DURATION);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: 1280, height: 720 }, 
          audio: true 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError("Camera access denied. Please enable permissions.");
      }
    };

    startCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const startRecording = () => {
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCountdown(null);
      beginActualRecording();
    }
  }, [countdown]);

  const beginActualRecording = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (!stream) return;

    const options = { mimeType: 'video/webm;codecs=vp9' };
    const mediaRecorder = new MediaRecorder(stream, options);
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      onFinish(url);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    setTimeLeft(VIDEO_DURATION);
  };

  useEffect(() => {
    if (!isRecording) return;

    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  }, [isRecording, timeLeft]);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-black rounded-3xl">
      {/* Header Info */}
      <div className="absolute top-0 left-0 w-full z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h2 className="text-lg font-bold">{eventData.name}</h2>
          <p className="text-xs text-blue-400">Ready for capture</p>
        </div>
        <button 
          onClick={onBack}
          className="text-xs bg-white/10 px-3 py-1 rounded-full hover:bg-white/20 transition-colors"
        >
          Edit Event
        </button>
      </div>

      {/* Video Viewport */}
      <div className="flex-1 relative bg-neutral-900 overflow-hidden flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="h-full w-full object-cover scale-x-[-1]"
        />

        {/* Recording Overlay */}
        {isRecording && (
          <div className="absolute inset-0 border-4 border-red-500 animate-pulse pointer-events-none" />
        )}

        {/* Countdown Overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-30">
            <span className="text-9xl font-black text-white animate-ping">
              {countdown}
            </span>
          </div>
        )}

        {/* Progress Bar */}
        {isRecording && (
          <div className="absolute bottom-24 left-10 right-10 h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-600 transition-all duration-1000 ease-linear"
              style={{ width: `${(1 - timeLeft / VIDEO_DURATION) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-8 text-center">
          <p className="text-red-400 font-bold">{error}</p>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="p-8 flex flex-col items-center justify-center bg-neutral-900 border-t border-white/5">
        {!isRecording && countdown === null ? (
          <button
            onClick={startRecording}
            className="group relative w-20 h-20 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-25 group-hover:bg-blue-400" />
            <div className="relative w-16 h-16 bg-blue-600 rounded-full border-4 border-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-6 h-6 bg-white rounded-full" />
            </div>
          </button>
        ) : isRecording ? (
          <div className="text-center">
            <p className="text-red-500 font-bold text-xl uppercase tracking-widest">Recording...</p>
            <p className="text-gray-400 text-sm">{timeLeft}s remaining</p>
          </div>
        ) : (
          <p className="text-white font-bold animate-pulse">Get ready!</p>
        )}
        
        <p className="text-gray-500 text-xs mt-4 font-medium uppercase tracking-tighter">
          15 Second Slow-Mo 360 Loop
        </p>
      </div>
    </div>
  );
};

export default Recorder;
