
import React, { useRef, useEffect, useState } from 'react';
import { EventData } from '../types';

interface ResultViewProps {
  eventData: EventData;
  videoUrl: string;
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ eventData, videoUrl, onReset }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackStyle, setPlaybackStyle] = useState<'normal' | 'slowmo' | 'ramp'>('slowmo');
  
  // Using a public QR API for a realistic production simulation
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(videoUrl)}`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playbackStyle === 'slowmo') {
      video.playbackRate = 0.5;
    } else if (playbackStyle === 'normal') {
      video.playbackRate = 1.0;
    }

    // Dynamic speed ramping effect for the 'ramp' style
    let rampInterval: number;
    if (playbackStyle === 'ramp') {
      rampInterval = window.setInterval(() => {
        const time = video.currentTime;
        // Simple ramp: First 3s normal, 3-12s slow, 12-15s normal
        if (time < 3 || time > 12) {
          video.playbackRate = 1.2; // Slightly faster for energy
        } else {
          video.playbackRate = 0.4; // Deep slow motion
        }
      }, 100);
    }

    return () => {
      if (rampInterval) clearInterval(rampInterval);
    };
  }, [playbackStyle, videoUrl]);

  return (
    <div className="flex-1 flex flex-col animate-fade-in pb-10">
      <div className="glass-effect rounded-3xl overflow-hidden mb-6 relative">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-md">
          <div className="flex flex-col">
            <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest">Effect Applied</h3>
            <span className="text-blue-400 font-bold text-sm">
              {playbackStyle === 'slowmo' ? '✨ 0.5x Slow Motion' : playbackStyle === 'ramp' ? '⚡ Pro Speed Ramp' : 'Original Speed'}
            </span>
          </div>
          <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Ready</span>
        </div>
        
        <div className="aspect-[9/16] bg-neutral-900 relative">
          <video 
            ref={videoRef}
            src={videoUrl} 
            className="w-full h-full object-cover" 
            autoPlay 
            loop 
            playsInline
          />
          
          {/* Style Selector Overlay */}
          <div className="absolute top-20 right-4 flex flex-col gap-2 z-30">
            {(['normal', 'slowmo', 'ramp'] as const).map((style) => (
              <button
                key={style}
                onClick={() => setPlaybackStyle(style)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tighter transition-all ${
                  playbackStyle === style 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-105' 
                    : 'bg-black/60 text-gray-400 border border-white/10 hover:bg-black/80'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Simulated Watermark */}
          <div className="absolute bottom-6 right-6 opacity-60">
             <div className="text-white font-black text-xl tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] italic">
                360° {eventData.name.split(' ')[0]}
             </div>
          </div>

          {/* FX Badge */}
          <div className="absolute bottom-6 left-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest drop-shadow-md">AI Processing Active</span>
          </div>
        </div>
      </div>

      <div className="glass-effect p-8 rounded-3xl flex flex-col items-center text-center">
        <h2 className="text-xl font-bold mb-2">Scan & Share</h2>
        <p className="text-gray-400 text-xs mb-6 px-4">The slow-motion effect is applied to the playback. Scan the QR code to open the link on your phone.</p>
        
        <div className="bg-white p-3 rounded-2xl mb-8 shadow-2xl shadow-blue-500/20 relative group">
          <img 
            src={qrCodeUrl} 
            alt="Scan to download" 
            className="w-44 h-44"
          />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-bold px-3 py-1 rounded-full whitespace-nowrap uppercase tracking-widest border-2 border-black">
            Scan for Video
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
           <a 
            href={videoUrl} 
            download={`${eventData.name.replace(/\s+/g, '_')}_360_slowmo.mp4`}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Save
          </a>
          <button
            onClick={onReset}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Next
          </button>
        </div>
      </div>

      <div className="mt-8 text-center opacity-40">
        <p className="text-xs font-medium italic">"{eventData.name}" — {eventData.location}</p>
        <div className="flex justify-center gap-4 mt-2">
          <p className="text-[10px] uppercase tracking-tighter">Code: {Math.random().toString(36).slice(2, 8).toUpperCase()}</p>
          <p className="text-[10px] uppercase tracking-tighter text-blue-400">FPS: 60 (Ramped)</p>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
