'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Volume2, Settings, Key, Sparkles, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import styles from './TutorChat.module.css';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface TutorChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export default function TutorChat({
  messages,
  onSendMessage,
  isLoading,
}: TutorChatProps) {
  const [inputText, setInputText] = useState('');

  const [activeSpeechIndex, setActiveSpeechIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText);
    setInputText('');
  };



  // Text-To-Speech function calibrated for Luffy's voice
  const handleSpeak = (text: string, index: number) => {
    if (typeof window === 'undefined') return;

    if (activeSpeechIndex === index) {
      window.speechSynthesis.cancel();
      setActiveSpeechIndex(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown/symbols before speaking
    const cleanText = text
      .replace(/\*\*|__/g, '') // bold
      .replace(/\*|_/g, '')   // italic
      .replace(/#+/g, '')     // headers
      .replace(/- \[(x| )\]/gi, '') // checklists
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.pitch = 1.0; // Frequência normal/animada do Luffy
    utterance.rate = 1.05;  // Ritmo levemente apressado/entusiasmado
    utterance.onend = () => setActiveSpeechIndex(null);
    utterance.onerror = () => setActiveSpeechIndex(null);

    setActiveSpeechIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  // Stop reading if component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className={styles.chatContainer}>
      <header className={styles.chatHeader}>
        <div className={styles.tutorInfo}>
          <div className={styles.avatar}>👒</div>
          <div>
            <h2 className={styles.tutorName}>Capitão Luffy 👒🍖</h2>
            <span className={styles.tutorStatus}>Seu Nakama de estudos!</span>
          </div>
        </div>
      </header>

      {/* Messages List */}
      <div className={styles.messagesList}>
        {messages.length === 0 ? (
          <div className={styles.welcomeState}>
            <div className={styles.welcomeBox}>
              <Sparkles size={36} className={styles.welcomeIcon} />
              <h3>Yo, Pedro! Eu sou o Luffy! 👒🏴‍☠️</h3>
              <p>
                Estou super empolgado para navegar com você na sua jornada de estudos! Para começarmos nossa aventura, escolha um tema nas **Aventuras** ou coloque um livro no **Baú do Capitão** na lateral esquerda!
              </p>
              <p>
                Vou explicar cada conceito de forma rápida usando analogias de piratas e fazer desafios rápidos de fixação. Vamos nessa aprender e vencer juntos?
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.messageRow} ${
                msg.role === 'user' ? styles.userRow : styles.assistantRow
              }`}
            >
              <div className={styles.avatarIcon}>
                {msg.role === 'user' ? <User size={16} /> : <span>🦌</span>}
              </div>
              <div className={styles.messageBubble}>
                <div className={styles.messageContent}>
                  {/* Simplistic markdown formatter */}
                  {msg.content.split('\n').map((line, lIdx) => {
                    // Check for lists
                    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                      return (
                        <li key={lIdx} className={styles.bulletLine}>
                          {formatTextBold(line.trim().substring(2))}
                        </li>
                      );
                    }
                    return (
                      <p key={lIdx} className={styles.textLine}>
                        {formatTextBold(line)}
                      </p>
                    );
                  })}
                </div>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handleSpeak(msg.content, index)}
                    className={`${styles.speakBtn} ${
                      activeSpeechIndex === index ? styles.speaking : ''
                    }`}
                    title={activeSpeechIndex === index ? 'Parar leitura' : 'Ouvir em voz alta'}
                  >
                    <Volume2 size={16} />
                    <span>{activeSpeechIndex === index ? 'Parar' : 'Ouvir'}</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className={`${styles.messageRow} ${styles.assistantRow} ${styles.loadingRow}`}>
            <div className={styles.avatarIcon}>🦌</div>
            <div className={styles.messageBubble}>
              <div className={styles.typingIndicator}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
              </div>
              <span className={styles.loadingText}>Luffy está pensando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className={styles.chatForm}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            messages.length === 0
              ? 'Escolha um assunto na lateral esquerda para começar...'
              : 'Digite sua resposta aqui para o Luffy...'
          }
          className={styles.chatInput}
          disabled={isLoading || messages.length === 0}
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={!inputText.trim() || isLoading || messages.length === 0}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

// Simple helper to render bold text marked by **
function formatTextBold(text: string) {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <strong key={index}>{part}</strong>;
    }
    return part;
  });
}
