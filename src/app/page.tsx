'use client';

import React, { useState, useEffect } from 'react';
import { Sun, Moon, Eye, EyeOff, Compass } from 'lucide-react';
import FocusTimer from '@/components/FocusTimer';
import SubjectSelector from '@/components/SubjectSelector';
import Checklist, { ChecklistItem } from '@/components/Checklist';
import TutorChat, { ChatMessage } from '@/components/TutorChat';

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [material, setMaterial] = useState('');
  const [activeTopicTitle, setActiveTopicTitle] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [focusMode, setFocusMode] = useState(false);

  // Load API key and theme from localStorage after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('gemini_api_key') || '';
      setApiKey(savedKey);

      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
      const initialTheme = savedTheme || 'light';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  }, []);

  // Update theme helper
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  // Start study session when a topic is selected
  const handleTopicSelect = async (content: string, title: string) => {
    setMaterial(content);
    setActiveTopicTitle(title);
    setIsLoading(true);

    const initialMessage: ChatMessage = {
      role: 'user',
      content: `Olá Capitão Luffy! Vamos iniciar uma nova aventura de estudos sobre "${title}". Por favor, crie uma Rota do Tesouro (checklist) com 3 a 5 ilhas (tópicos de aprendizado) e dê as boas-vindas ao Pedro com o seu jeito super animado, e em seguida faça a primeira pergunta de fixação de múltipla escolha baseada nesse material.`,
    };

    setMessages([initialMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [initialMessage],
          material: content,
          apiKey: apiKey || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
          },
        ]);
        if (data.checklist && data.checklist.length > 0) {
          setChecklist(data.checklist);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Ops! Algo deu errado na nossa viagem: ${
              data.message || 'Verifique se inseriu a Chave API do Gemini na engrenagem ⚙️.'
            }`,
          },
        ]);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Tive um pequeno enjoo de navio na conexão. Pode escolher o assunto de novo?',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle student sending a reply in chat
  const handleSendMessage = async (text: string) => {
    if (isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          material: material,
          apiKey: apiKey || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
          },
        ]);
        if (data.checklist && data.checklist.length > 0) {
          setChecklist(data.checklist);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Ops! Houve uma tormenta no sinal: ${data.message || 'Erro desconhecido'}`,
          },
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Fiquei sem sinal com a gaivota de notícias. Pode reenviar sua resposta?',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle local checkbox clicks for manual interaction
  const handleToggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  return (
    <div className={`app-container ${focusMode ? 'focus-mode' : ''}`}>
      {/* Sidebar containing study widgets */}
      <aside className="side-panel">
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <div style={{ background: 'var(--primary-light)', padding: '0.5rem', borderRadius: '12px' }}>
              <Compass style={{ color: 'var(--primary)' }} size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Mundo do Luffy 👒</h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Navegando nos Estudos!</p>
            </div>
          </div>

          <SubjectSelector
            onTopicSelect={handleTopicSelect}
            activeTopicTitle={activeTopicTitle}
          />

          <Checklist items={checklist} onToggleItem={handleToggleChecklistItem} />

          <FocusTimer />
        </div>
      </aside>

      {/* Main chat section */}
      <main className="main-content">
        {/* Floating actions (Theme Toggle & Focus Mode) */}
        <div
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '4.5rem', // Offset slightly to avoid overlap with settings gear
            zIndex: 20,
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          <button
            onClick={() => setFocusMode(!focusMode)}
            style={{
              backgroundColor: 'var(--panel-bg)',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={focusMode ? 'Mostrar ferramentas de apoio' : 'Modo Luneta (ocultar barras)'}
          >
            {focusMode ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          <button
            onClick={toggleTheme}
            style={{
              backgroundColor: 'var(--panel-bg)',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={theme === 'light' ? 'Mudar para Tema Escuro' : 'Mudar para Tema Claro'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        <TutorChat
          messages={messages.filter((m) => m.content !== '')} // Filter empty init triggers
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          apiKey={apiKey}
          onApiKeyChange={handleApiKeyChange}
        />
      </main>
    </div>
  );
}
