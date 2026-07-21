'use client';

import React, { useEffect, useRef } from 'react';
import { CheckCircle2, Circle, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import styles from './Checklist.module.css';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface ChecklistProps {
  items: ChecklistItem[];
  onToggleItem: (id: string) => void;
}

export default function Checklist({ items, onToggleItem }: ChecklistProps) {
  const previousCompletedCount = useRef(0);

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Trigger confetti when completedCount increases to 100%
  useEffect(() => {
    if (totalCount > 0 && completedCount === totalCount && previousCompletedCount.current < totalCount) {
      // Trigger a beautiful confetti burst!
      try {
        const duration = 2 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 1000 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 40 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      } catch (e) {
        console.error('Confetti error:', e);
      }
    }
    previousCompletedCount.current = completedCount;
  }, [completedCount, totalCount]);

  if (items.length === 0) {
    return (
      <div className={styles.checklistCard}>
        <h3 className={styles.title}>Etapas do Aprendizado</h3>
        <p className={styles.emptyText}>
          O Tutor Alex criará um roteiro de estudos assim que você enviar o material acima!
        </p>
      </div>
    );
  }

  return (
    <div className={styles.checklistCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>Minha Jornada</h3>
        {percentComplete === 100 && (
          <span className={styles.trophyBadge} title="Todo o roteiro concluído!">
            <Trophy size={14} />
            <span>Sucesso!</span>
          </span>
        )}
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressInfo}>
          <span className={styles.progressText}>
            {completedCount} de {totalCount} concluídos
          </span>
          <span className={styles.percentText}>{percentComplete}%</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      <div className={styles.list}>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onToggleItem(item.id)}
            className={`${styles.itemButton} ${item.completed ? styles.completed : ''}`}
            aria-label={`Marcar ${item.text} como ${item.completed ? 'pendente' : 'concluído'}`}
          >
            {item.completed ? (
              <CheckCircle2 className={styles.checkIcon} size={18} />
            ) : (
              <Circle className={styles.circleIcon} size={18} />
            )}
            <span className={styles.itemText}>{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
