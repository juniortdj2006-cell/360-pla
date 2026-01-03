
import React, { useState } from 'react';
import { EventData } from '../types';

interface EventSetupProps {
  onComplete: (data: EventData) => void;
}

const EventSetup: React.FC<EventSetupProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    themeColor: '#3b82f6'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    onComplete({
      id: Math.random().toString(36).substr(2, 9),
      ...formData
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-center animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          360 PRO PLATFORM
        </h1>
        <p className="text-gray-400 mt-2">Setup your event to start recording</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 glass-effect p-8 rounded-3xl">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Event Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Wedding of Joe & Jane"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Date</label>
            <input
              type="date"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Theme Color</label>
            <input
              type="color"
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl cursor-pointer"
              value={formData.themeColor}
              onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Location</label>
          <input
            type="text"
            placeholder="City, Venue"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95"
        >
          START EVENT
        </button>
      </form>
    </div>
  );
};

export default EventSetup;
