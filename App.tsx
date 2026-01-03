
import React, { useState, useCallback } from 'react';
import { AppStep, EventData } from './types';
import EventSetup from './components/EventSetup';
import Recorder from './components/Recorder';
import ProcessingScreen from './components/ProcessingScreen';
import ResultView from './components/ResultView';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.SETUP);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleEventCreated = (data: EventData) => {
    setEventData(data);
    setStep(AppStep.RECORDING);
  };

  const handleRecordingFinished = (blobUrl: string) => {
    setVideoUrl(blobUrl);
    setStep(AppStep.PROCESSING);
  };

  const handleProcessingComplete = () => {
    setStep(AppStep.RESULT);
  };

  const resetFlow = () => {
    setVideoUrl(null);
    setStep(AppStep.RECORDING);
  };

  const editEvent = () => {
    setEventData(null);
    setVideoUrl(null);
    setStep(AppStep.SETUP);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500">
      <main className="max-w-md mx-auto min-h-screen relative p-4 flex flex-col">
        {step === AppStep.SETUP && (
          <EventSetup onComplete={handleEventCreated} />
        )}

        {step === AppStep.RECORDING && eventData && (
          <Recorder 
            eventData={eventData} 
            onFinish={handleRecordingFinished}
            onBack={editEvent}
          />
        )}

        {step === AppStep.PROCESSING && (
          <ProcessingScreen 
            onComplete={handleProcessingComplete} 
          />
        )}

        {step === AppStep.RESULT && eventData && videoUrl && (
          <ResultView 
            eventData={eventData}
            videoUrl={videoUrl}
            onReset={resetFlow}
          />
        )}
      </main>
    </div>
  );
};

export default App;
