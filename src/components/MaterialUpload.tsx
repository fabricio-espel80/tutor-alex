'use client';

import React, { useState } from 'react';
import { Upload, FileText, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from './MaterialUpload.module.css';

interface MaterialUploadProps {
  onMaterialSubmit: (text: string) => void;
  currentMaterial: string;
}

export default function MaterialUpload({ onMaterialSubmit, currentMaterial }: MaterialUploadProps) {
  const [inputText, setInputText] = useState(currentMaterial);
  const [fileName, setFileName] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    setSuccessMsg(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg(null);
    setSuccessMsg(false);

    if (file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInputText(text);
      };
      reader.onerror = () => {
        setErrorMsg('Erro ao ler o arquivo.');
      };
      reader.readAsText(file);
    } else {
      setErrorMsg('Apenas arquivos de texto (.txt ou .md) são suportados diretamente. Para PDFs, copie e cole o texto na caixa abaixo.');
      setFileName(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setErrorMsg('Por favor, cole um texto ou suba um arquivo antes de enviar.');
      return;
    }
    
    onMaterialSubmit(inputText);
    setSuccessMsg(true);
    setErrorMsg(null);
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handleClear = () => {
    setInputText('');
    setFileName(null);
    setSuccessMsg(false);
    setErrorMsg(null);
  };

  return (
    <div className={styles.uploadCard}>
      <h3 className={styles.title}>Material de Apoio</h3>
      <p className={styles.subtitle}>
        Cole a matéria da prova, lição de casa ou suba um arquivo de texto para o Tutor Alex usar de base.
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.textareaWrapper}>
          <textarea
            value={inputText}
            onChange={handleTextChange}
            placeholder="Cole o texto do seu estudo aqui... (Ex: Fotossíntese é o processo pelo qual as plantas produzem seu próprio alimento usando luz solar...)"
            className={styles.textarea}
            rows={6}
          />
        </div>

        <div className={styles.fileArea}>
          <label className={styles.fileLabel}>
            <Upload size={16} />
            <span>Subir arquivo (.txt / .md)</span>
            <input
              type="file"
              accept=".txt,.md"
              onChange={handleFileUpload}
              className={styles.fileInput}
            />
          </label>
          {fileName && (
            <div className={styles.fileName}>
              <FileText size={14} />
              <span>{fileName}</span>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className={styles.errorMessage}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className={styles.successMessage}>
            <CheckCircle2 size={16} />
            <span>Material carregado com sucesso!</span>
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            disabled={!inputText}
          >
            <Trash2 size={16} />
            Limpar
          </button>
          <button type="submit" className={styles.submitButton} disabled={!inputText.trim()}>
            Estudar esse Assunto
          </button>
        </div>
      </form>
    </div>
  );
}
