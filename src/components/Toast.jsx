import React from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const Toast = () => {
  const { toastMessage } = useAudio();
  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-bounce flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-900/95 border border-amber-500/40 text-white shadow-2xl backdrop-blur-lg">
      {isSuccess ? (
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-spin-slow" />
      ) : (
        <Info className="w-5 h-5 text-blue-400 shrink-0" />
      )}
      <span className="text-sm font-semibold tracking-wide">
        {toastMessage.message}
      </span>
    </div>
  );
};
