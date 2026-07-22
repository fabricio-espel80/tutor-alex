import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, apiKey: bodyApiKey } = body;
    
    // 1. Resolve a Chave
    const apiKey = bodyApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('[GEMINI_ERR] Chave de API não fornecida.');
      return NextResponse.json({ error: 'Chave de API ausente.' }, { status: 400 });
    }

    // 2. Sanitiza a Chave (Remove quebras de linha/espaços em branco)
    const cleanApiKey = apiKey.split(/[\\s\\n\\r]+/)[0].trim();
    console.log('[GEMINI_REQ] Iniciando requisição fetch raw. Tamanho da chave:', cleanApiKey.length);
    console.log('[GEMINI_REQ] Prefixo da chave:', cleanApiKey.substring(0, 3));

    const prompt = messages[messages.length - 1].content;
    const contents = [{ role: 'user', parts: [{ text: prompt }] }];

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
    
    // 3. Chamada à API com timer e fetch raw (bypass do SDK)
    console.time('[GEMINI_RES] Tempo de resposta');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Ocultamos a chave de query params e forçamos no header para evitar o erro de OAuth com chaves AQ.
        'x-goog-api-key': cleanApiKey,
      },
      body: JSON.stringify({ contents }),
    });
    console.timeEnd('[GEMINI_RES] Tempo de resposta');

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[GEMINI_CRITICAL_ERR] Erro HTTP retornado pelo Google:', response.status, JSON.stringify(errorData));
      return NextResponse.json(
        {
          error: 'Erro na API do Gemini (Fetch Raw)',
          details: errorData,
          status: response.status
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    if (!result.candidates || result.candidates.length === 0) {
      console.error('[GEMINI_ERR] Resposta sem candidatos:', JSON.stringify(result));
      return NextResponse.json({ error: 'Resposta vazia da API.' }, { status: 500 });
    }

    const responseText = result.candidates[0].content.parts[0].text;
    
    // 4. Retorna com sucesso
    return NextResponse.json({ reply: responseText });

  } catch (error: any) {
    console.error('[GEMINI_CRITICAL_ERR] Falha ao executar o fetch:', error);
    
    return NextResponse.json(
      {
        error: 'Erro Interno de Rede',
        details: error.message || 'Erro desconhecido',
        status: 500
      },
      { status: 500 }
    );
  }
}
