import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // 1. Lê as credenciais (Service Account JSON) da Vercel
    const rawCredentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

    if (!rawCredentials || !projectId) {
      console.error('[VERTEX_ERR] Credenciais do Google Cloud ausentes.');
      return NextResponse.json(
        { error: 'Faltam credenciais do Google Cloud na Vercel (GOOGLE_SERVICE_ACCOUNT_JSON ou GOOGLE_CLOUD_PROJECT_ID).' },
        { status: 500 }
      );
    }

    let credentials;
    try {
      credentials = JSON.parse(rawCredentials);
    } catch (e) {
      console.error('[VERTEX_ERR] Falha ao fazer parse do GOOGLE_SERVICE_ACCOUNT_JSON. Certifique-se de colar o JSON inteiro.');
      return NextResponse.json({ error: 'O JSON da Service Account é inválido.' }, { status: 500 });
    }

    // 2. Inicializa o SDK Enterprise
    const vertex_ai = new VertexAI({
      project: projectId,
      location: 'us-central1', // Região padrão para IA
      googleAuthOptions: { credentials }
    });

    const model = vertex_ai.preview.getGenerativeModel({
      model: 'gemini-2.5-flash', // Versão recém-lançada, disponível no painel do usuário
    });

    // 3. Formata o payload
    const prompt = messages[messages.length - 1].content;
    const request = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };

    console.log('[VERTEX_REQ] Enviando prompt para Vertex AI. Tamanho:', prompt.length);

    // 4. Chamada à API com timer de observabilidade
    console.time('[VERTEX_RES] Tempo de resposta');
    const result = await model.generateContent(request);
    console.timeEnd('[VERTEX_RES] Tempo de resposta');

    if (!result.response.candidates || result.response.candidates.length === 0) {
      throw new Error('A API retornou uma resposta sem candidatos.');
    }

    const responseText = result.response.candidates[0].content.parts[0].text;
    
    // 5. Retorna com sucesso
    return NextResponse.json({ reply: responseText });

  } catch (error: any) {
    // 6. Observabilidade Crítica de Erros
    console.error('[VERTEX_CRITICAL_ERR] Falha ao comunicar com o Vertex AI:', error);
    
    return NextResponse.json(
      {
        error: 'Erro no Vertex AI',
        details: error.message || 'Erro desconhecido',
        status: error.status || 500
      },
      { status: 500 }
    );
  }
}
