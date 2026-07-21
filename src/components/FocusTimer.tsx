'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Coffee, Compass } from 'lucide-react';
import styles from './FocusTimer.module.css';

export default function FocusTimer() {
  const [mode, setMode] = useState<'study' | 'break'>('study');
  const [duration, setDuration] = useState(15 * 60); // Default 15 minutes
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [tickEnabled, setTickEnabled] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play a synthesized ship bell / chime using Web Audio API
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
        // Play a triple high ring like a ship bell (Sino do Navio!)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);

        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
          gain2.gain.setValueAtTime(0.12, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.4);
        }, 150);

        setTimeout(() => {
          const osc3 = ctx.createOscillator();
          const gain3 = ctx.createGain();
          osc3.connect(gain3);
          gain3.connect(ctx.destination);
          osc3.frequency.setValueAtTime(1046.50, ctx.currentTime); // C6
          gain3.gain.setValueAtTime(0.15, ctx.currentTime);
          gain3.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
          osc3.start();
          osc3.stop(ctx.currentTime + 0.6);
        }, 300);

      } else if (type === 'break') {
        // Soft double chime for resting
        osc.frequency.setValueAtTime(440.00, ctx.currentTime); // A4
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'tick') {
        // Subtle woodblock tick
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
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
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, mode, tickEnabled]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className={`${styles.timerCard} ${mode === 'break' ? styles.breakCard : ''}`}>
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <Compass size={18} className={styles.titleIcon} />
          <h3 className={styles.title}>Desafio do Log Pose 🧭</h3>
        </div>
        <div className={styles.audioControls}>
          <button
            onClick={() => setTickEnabled(!tickEnabled)}
            className={`${styles.iconButton} ${tickEnabled ? styles.iconActive : ''}`}
            title={tickEnabled ? 'Desativar Tique-Taque' : 'Ativar Tique-Taque'}
          >
            <Sparkles size={16} />
          </button>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={styles.iconButton}
            title={soundEnabled ? 'Mutar alertar' : 'Ativar sino de alerta'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      <div className={styles.statusBadge}>
        {mode === 'study' ? (
          <>
            <Sparkles size={14} className={styles.pulseIcon} />
            <span>Navegando! ⛵</span>
          </>
        ) : (
          <>
            <Coffee size={14} />
            <span>Pausa na Ilha! 🌴</span>
          </>
        )}
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
          {isRunning ? 'Lançar Âncora' : 'Zarpar Navio ⛵'}
        </button>
        <button onClick={resetTimer} className={styles.secondaryButton} title="Recomeçar Rota">
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
