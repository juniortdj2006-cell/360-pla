
import React, { useEffect, useState } from 'react';

interface ProcessingScreenProps {
  onComplete: () => void;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Analyzing capture...');

  const tasks = [
    { threshold: 10, text: 'Stabilizing frame sequence...' },
    { threshold: 25, text: 'Interpolating for High-FPS Slow-Mo...' },
    { threshold: 45, text: 'Applying AI Speed Ramping...' },
    { threshold: 65, text: 'Enhancing dynamic range & color...' },
    { threshold: 85, text: 'Injecting event branding...' },
    { threshold: 95, text: 'Finalizing 360-degree loop...' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 1.2; // Slightly slower for effect
        const task = tasks.find(t => next < t.threshold);
        if (task) setCurrentTask(task.text);
        
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center glass-effect rounded-3xl p-10 text-center">
      <div className="relative w-48 h-48 mb-10">
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-[ping_3s_linear_infinite]" />
        <svg className="w-full h-full relative z-10" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="6"
          />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="6"
            strokeDasharray="283"
            strokeDashoffset={283 - (progress / 100) * 283}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-3xl font-black text-white">{Math.round(progress)}%</span>
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1">Processing</span>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">Applying Effects</h2>
      <div className="h-12 flex items-center justify-center">
        <p className="text-blue-400 font-medium animate-pulse transition-all">{currentTask}</p>
      </div>
      
      <div className="mt-12 space-y-3 w-full max-w-xs opacity-50">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <span>Engine: OptiFlow v3.1</span>
          <span>Slow-Mo Render</span>
        </div>
        <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
          <div className="h-full bg-blue-500/50 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

export default ProcessingScreen;
