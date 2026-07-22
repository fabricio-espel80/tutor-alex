import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

    // 2. Sanitiza a Chave (Remove quebras de linha que quebram a Vercel)
    const cleanApiKey = apiKey.split(/[\\s\\n\\r]+/)[0].trim();
    console.log('[GEMINI_REQ] Iniciando requisição. Tamanho da chave:', cleanApiKey.length);

    // 3. Inicializa o SDK Oficial (Melhor Prática)
    const genAI = new GoogleGenerativeAI(cleanApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    // 4. Formata o payload
    const prompt = messages[messages.length - 1].content;
    console.log('[GEMINI_REQ] Prompt a ser enviado:', prompt.substring(0, 50) + '...');

    // 5. Chamada à API com timer de observabilidade
    console.time('[GEMINI_RES] Tempo de resposta');
    const result = await model.generateContent(prompt);
    console.timeEnd('[GEMINI_RES] Tempo de resposta');

    const responseText = result.response.text();
    
    // 6. Retorna com sucesso
    return NextResponse.json({ reply: responseText });

  } catch (error: any) {
    // 7. Observabilidade Crítica de Erros
    console.error('[GEMINI_CRITICAL_ERR] Falha ao comunicar com o Google:', error);
    
    return NextResponse.json(
      {
        error: 'Erro na API do Gemini',
        details: error.message || 'Erro desconhecido',
        status: error.status || 500
      },
      { status: 500 }
    );
  }
}
