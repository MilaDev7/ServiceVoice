import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Mock voice recorder hook.
 * Later replaced by Voxide integration — the API stays the same:
 *   const { status, duration, transcript, start, stop, cancel } = useVoiceRecorder()
 */
export function useVoiceRecorder() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'recording' | 'processing'
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState('');
  const timerRef = useRef(null);

  // Mock transcripts — cycles through for demo
  const MOCK_TRANSCRIPTS = [
    'I want to get a birth certificate',
    'What documents do I need for a Kebele ID?',
    'How do I get a marriage certificate?',
    'Where do I apply for an unmarried certificate?',
  ];

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = useCallback(() => {
    setStatus('recording');
    setDuration(0);
    setTranscript('');

    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    // Mock: reveal transcript progressively after 1.5s
    setTimeout(() => {
      const mock =
        MOCK_TRANSCRIPTS[Math.floor(Math.random() * MOCK_TRANSCRIPTS.length)];
      setTranscript(mock);
    }, 1500);
  }, []);

  const stop = useCallback(() => {
    clearTimer();
    setStatus('processing');

    // Mock: simulate Voxide processing delay
    setTimeout(() => {
      setStatus('idle');
    }, 600);
  }, []);

  const cancel = useCallback(() => {
    clearTimer();
    setStatus('idle');
    setDuration(0);
    setTranscript('');
  }, []);

  const reset = useCallback(() => {
    clearTimer();
    setStatus('idle');
    setDuration(0);
    setTranscript('');
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  return { status, duration, transcript, start, stop, cancel, reset };
}