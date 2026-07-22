'use client';
import React, { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [errorLog, setErrorLog] = useState('');
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setErrorLog('');
    setResponse('');
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: input }]
        })
      });

      const data = await res.json();

      if (!res.ok) {
        // Exibe o erro EXATO retornado pelo servidor na tela
        setErrorLog(`Erro HTTP ${res.status}: \n${JSON.stringify(data, null, 2)}`);
      } else {
        setResponse(data.reply);
      }
    } catch (e: any) {
      setErrorLog(`Erro de Rede/Frontend: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>🧪 Laboratório de Testes API (Fase 2 - Vertex AI)</h1>
      <p style={{ color: '#555', marginBottom: '2rem' }}>
        A autenticação agora é feita 100% no servidor (Vercel) usando a sua Conta de Serviço (JSON).
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <label>Mensagem Teste:</label><br/>
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Diga 'Oi, Vertex AI!'"
          style={{ width: '400px', padding: '0.5rem', marginTop: '0.5rem' }} 
        />
      </div>

      <button onClick={testApi} disabled={loading} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
        {loading ? 'Testando...' : 'Enviar Teste (Vertex AI)'}
      </button>

      {/* Observabilidade na UI */}
      {errorLog && (
        <pre style={{ marginTop: '2rem', padding: '1rem', background: '#ffebee', color: '#c62828', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {errorLog}
        </pre>
      )}

      {response && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#e8f5e9', color: '#2e7d32' }}>
          <strong>Resposta da API:</strong><br/>
          {response}
        </div>
      )}
    </div>
  );
}
