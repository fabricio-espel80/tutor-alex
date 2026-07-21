'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Coffee } from 'lucide-react';
import styles from './FocusTimer.module.css';

export default function FocusTimer() {
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [duration, setDuration] = useState(15 * 60); // Default 15 minutes
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [tickEnabled, setTickEnabled] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play a synthesized beep/chime using Web Audio API
  const playChime = (type: 'success' | 'break' | 'tick') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        // High double beep for completing study
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);

        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
          gain2.gain.setValueAtTime(0.1, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.4);
        }, 150);
      } else if (type === 'break') {
        // Soft double tone for break complete
        osc.frequency.setValueAtTime(392.00, ctx.currentTime); // G4
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'tick') {
        // Very subtle woodblock-like tick
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch (e) {
      console.warn('Falha ao reproduzir áudio:', e);
    }
  };

  // Change preset study duration
  const selectDuration = (mins: number) => {
    setIsRunning(false);
    setMode('study');
    setDuration(mins * 60);
    setTimeLeft(mins * 60);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            if (mode === 'study') {
              playChime('success');
              // Automatically switch to break mode (5 minutes)
              setMode('break');
              setDuration(5 * 60);
              return 5 * 60;
            } else {
              playChime('break');
              // Switch back to study mode (15 minutes)
              setMode('study');
              setDuration(15 * 60);
              return 15 * 60;
            }
          }
          if (tickEnabled) {
            playChime('tick');
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, tickEnabled, soundEnabled]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className={`${styles.timerCard} ${mode === 'break' ? styles.breakMode : ''}`}>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          {mode === 'study' ? (
            <>
              <Sparkles className={styles.iconStudy} size={20} />
              <span>Hora de Focar!</span>
            </>
          ) : (
            <>
              <Coffee className={styles.iconBreak} size={20} />
              <span>Hora do Descanso!</span>
            </>
          )}
        </div>
        <div className={styles.controlsLeft}>
          <button
            onClick={() => setTickEnabled(!tickEnabled)}
            className={`${styles.iconButton} ${tickEnabled ? styles.active : ''}`}
            title={tickEnabled ? 'Desativar som do tique-taque' : 'Ativar som de tique-taque'}
          >
            Timer Ticking
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={styles.iconButton}
            title={soundEnabled ? 'Mutar sons' : 'Ativar som de alerta'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      <div className={styles.timerDisplay}>
        <div className={styles.circleProgress}>
          <div
            className={styles.progressFill}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <h2 className={styles.timeText}>{formatTime(timeLeft)}</h2>
      </div>

      <div className={styles.actions}>
        <button onClick={toggleTimer} className={styles.mainButton}>
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          {isRunning ? 'Pausar' : 'Começar'}
        </button>
        <button onClick={resetTimer} className={styles.secondaryButton} title="Recomeçar">
          <RotateCcw size={16} />
        </button>
      </div>

      {mode === 'study' && (
        <div className={styles.presets}>
          <button
            onClick={() => selectDuration(10)}
            className={`${styles.presetBtn} ${duration === 10 * 60 ? styles.presetActive : ''}`}
          >
            10 min
          </button>
          <button
            onClick={() => selectDuration(15)}
            className={`${styles.presetBtn} ${duration === 15 * 60 ? styles.presetActive : ''}`}
          >
            15 min
          </button>
          <button
            onClick={() => selectDuration(20)}
            className={`${styles.presetBtn} ${duration === 20 * 60 ? styles.presetActive : ''}`}
          >
            20 min
          </button>
        </div>
      )}
    </div>
  );
}
