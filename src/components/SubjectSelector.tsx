'use client';

import React, { useState } from 'react';
import { Compass, Anchor, Upload, FileText, Trash2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import styles from './SubjectSelector.module.css';
import { KNOWLEDGE_BASE, StudyTopic, StudySubject } from '../utils/knowledgeBase';
import { extractTextFromPDF } from '../utils/pdfExtractor';

interface SubjectSelectorProps {
  onTopicSelect: (content: string, title: string) => void;
  activeTopicTitle: string;
}

export default function SubjectSelector({ onTopicSelect, activeTopicTitle }: SubjectSelectorProps) {
  const [activeTab, setActiveTab] = useState<'adventures' | 'custom'>('adventures');
  const [expandedSubject, setExpandedSubject] = useState<string | null>('ciencias');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsingProgress, setParsingProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);
  const [customContent, setCustomContent] = useState('');

  const toggleSubject = (subjectId: string) => {
    setExpandedSubject(expandedSubject === subjectId ? null : subjectId);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg(null);
    setSuccessMsg(false);
    setCustomContent('');

    if (file.name.toLowerCase().endsWith('.pdf')) {
      setIsParsing(true);
      setParsingProgress(0);
      try {
        const text = await extractTextFromPDF(file, (percent) => {
          setParsingProgress(percent);
        });
        setCustomContent(text);
        setSuccessMsg(true);
      } catch (err: any) {
        console.error('PDF parsing error:', err);
        setErrorMsg(err.message || 'Erro ao ler o arquivo PDF. Tente copiar e colar o texto.');
        setFileName(null);
      } finally {
        setIsParsing(false);
      }
    } else if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCustomContent(text);
        setSuccessMsg(true);
      };
      reader.onerror = () => {
        setErrorMsg('Erro ao ler o arquivo.');
      };
      reader.readAsText(file);
    } else {
      setErrorMsg('Por favor, envie um arquivo PDF, TXT ou MD.');
      setFileName(null);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customContent.trim()) return;
    
    // Use filename as the title for the custom topic
    const title = fileName ? `Livro: ${fileName.replace(/\.[^/.]+$/, '')}` : 'Missão Personalizada 🗺️';
    onTopicSelect(customContent, title);
  };

  const handleClear = () => {
    setFileName(null);
    setCustomContent('');
    setSuccessMsg(false);
    setErrorMsg(null);
  };

  return (
    <div className={styles.container}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab('adventures')}
          className={`${styles.tabButton} ${activeTab === 'adventures' ? styles.tabActive : ''}`}
        >
          <Compass size={16} />
          <span>Aventuras</span>
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`${styles.tabButton} ${activeTab === 'custom' ? styles.tabActive : ''}`}
        >
          <Anchor size={16} />
          <span>Baú do Capitão</span>
        </button>
      </div>

      {/* Adventures Tab */}
      {activeTab === 'adventures' && (
        <div className={styles.adventuresPanel}>
          <h3 className={styles.title}>Escolha sua Aventura 🗺️</h3>
          <p className={styles.subtitle}>Escolha um assunto abaixo para começarmos a navegar pelos estudos!</p>
          
          <div className={styles.subjectList}>
            {KNOWLEDGE_BASE.map((subject) => {
              const isExpanded = expandedSubject === subject.id;
              return (
                <div
                  key={subject.id}
                  className={`${styles.subjectCard} ${isExpanded ? styles.subjectExpanded : ''}`}
                  style={{ '--subject-color': subject.color } as React.CSSProperties}
                >
                  <button
                    onClick={() => toggleSubject(subject.id)}
                    className={styles.subjectHeader}
                  >
                    <div className={styles.subjectInfo}>
                      <span className={styles.subjectIcon}>{subject.icon}</span>
                      <span className={styles.subjectName}>{subject.name}</span>
                    </div>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {isExpanded && (
                    <div className={styles.topicsList}>
                      {subject.topics.map((topic) => {
                        const isActive = activeTopicTitle === topic.title;
                        return (
                          <button
                            key={topic.id}
                            onClick={() => onTopicSelect(topic.content, topic.title)}
                            className={`${styles.topicButton} ${isActive ? styles.topicActive : ''}`}
                          >
                            <span className={styles.topicBullet}>⚓</span>
                            <div className={styles.topicText}>
                              <div className={styles.topicTitle}>{topic.title}</div>
                              <div className={styles.topicDesc}>{topic.description}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Tab (PDF upload) */}
      {activeTab === 'custom' && (
        <div className={styles.customPanel}>
          <h3 className={styles.title}>Baú do Capitão 🏴‍☠️</h3>
          <p className={styles.subtitle}>
            Pais: carreguem aqui o **PDF do livro escolar** ou arquivo de texto para criar um roteiro personalizado!
          </p>

          <form onSubmit={handleCustomSubmit} className={styles.form}>
            <div className={styles.dropzone}>
              <label className={styles.fileLabel}>
                {isParsing ? (
                  <Loader2 size={32} className={styles.loadingSpinner} />
                ) : (
                  <Upload size={32} className={styles.uploadIcon} />
                )}
                <span className={styles.uploadTitle}>
                  {isParsing ? 'Lendo o livro...' : 'Subir Livro Escolar'}
                </span>
                <span className={styles.uploadSubtitle}>Arquivos suportados: PDF, TXT ou MD</span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md"
                  onChange={handleFileUpload}
                  className={styles.fileInput}
                  disabled={isParsing}
                />
              </label>
            </div>

            {isParsing && (
              <div className={styles.progressBarWrapper}>
                <div className={styles.progressBarLabel}>Extraindo texto: {parsingProgress}%</div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${parsingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {fileName && !isParsing && (
              <div className={styles.fileNameBox}>
                <FileText size={16} />
                <span className={styles.fileName}>{fileName}</span>
                <button type="button" onClick={handleClear} className={styles.deleteBtn}>
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            {errorMsg && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && !isParsing && (
              <div className={styles.successMessage}>
                <CheckCircle2 size={16} />
                <span>Livro carregado com sucesso! Prontinho para estudar.</span>
              </div>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={!customContent || isParsing}
            >
              Começar Desafio 🚀
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
