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
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export default function TutorChat({
  messages,
  onSendMessage,
  isLoading,
  apiKey,
  onApiKeyChange,
}: TutorChatProps) {
  const [inputText, setInputText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [localKey, setLocalKey] = useState(apiKey);
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

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    onApiKeyChange(localKey);
    setShowSettings(false);
  };

  // Text-To-Speech function
  const handleSpeak = (text: string, index: number) => {
    if (typeof window === 'undefined') return;

    if (activeSpeechIndex === index) {
      window.speechSynthesis.cancel();
      setActiveSpeechIndex(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown before speaking
    const cleanText = text
      .replace(/\*\*|__/g, '') // bold
      .replace(/\*|_/g, '')   // italic
      .replace(/#+/g, '')     // headers
      .replace(/- \[(x| )\]/gi, '') // checklists
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
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
          <div className={styles.avatar}>🎒</div>
          <div>
            <h2 className={styles.tutorName}>Tutor Alex</h2>
            <span className={styles.tutorStatus}>Online e pronto para ajudar!</span>
          </div>
        </div>
        <button
          onClick={() => {
            setLocalKey(apiKey);
            setShowSettings(!showSettings);
          }}
          className={styles.settingsBtn}
          title="Configurar Chave do Gemini"
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className={styles.settingsOverlay}>
          <div className={styles.settingsModal}>
            <h3 className={styles.modalTitle}>Configurações</h3>
            <p className={styles.modalText}>
              Por segurança, a chave da API é salva apenas no seu navegador localmente e é usada
              para conectar diretamente com os servidores do Google Gemini.
            </p>
            <form onSubmit={handleSaveKey}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <Key size={14} /> Chave API do Gemini
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={localKey}
                    onChange={(e) => setLocalKey(e.target.value)}
                    placeholder="Cole sua API Key aqui (AIzaSy...)"
                    className={styles.keyInput}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className={styles.eyeBtn}
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className={styles.cancelBtn}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.saveBtn}>
                  Salvar Chave
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Messages List */}
      <div className={styles.messagesList}>
        {messages.length === 0 ? (
          <div className={styles.welcomeState}>
            <div className={styles.welcomeBox}>
              <Sparkles size={36} className={styles.welcomeIcon} />
              <h3>Olá! Eu sou o Alex! 👋</h3>
              <p>
                Sou seu tutor de estudos pessoal. Para começarmos, digite o conteúdo que você quer aprender na caixa de **Material de Apoio** na lateral esquerda e clique em **Estudar esse Assunto**.
              </p>
              <p>
                Vou quebrar o assunto em pequenas partes fáceis de entender e farei perguntas simples para praticarmos juntos!
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
                {msg.role === 'user' ? <User size={16} /> : <span>🎓</span>}
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
            <div className={styles.avatarIcon}>🎓</div>
            <div className={styles.messageBubble}>
              <div className={styles.typingIndicator}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
              </div>
              <span className={styles.loadingText}>Alex está escrevendo...</span>
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
              ? 'Carregue um material ao lado para começar...'
              : 'Digite sua resposta aqui para o Alex...'
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
