
export enum AppStep {
  SETUP = 'SETUP',
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT'
}

export interface EventData {
  id: string;
  name: string;
  date: string;
  location: string;
  themeColor: string;
  watermarkUrl?: string;
}

export interface VideoEffect {
  id: string;
  name: string;
  description: string;
}

export const VIDEO_DURATION = 15; // seconds
