import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';
import { TUTOR_LUFFY_SYSTEM_PROMPT } from '@/utils/prompt';

export async function POST(req: NextRequest) {
  try {
    const { messages, material } = await req.json();

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
      return NextResponse.json({ error: 'O JSON da Service Account é inválido.' }, { status: 500 });
    }

    const vertex_ai = new VertexAI({
      project: projectId,
      location: 'us-central1', 
      googleAuthOptions: { credentials }
    });

    const model = vertex_ai.preview.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: {
        role: 'system',
        parts: [{ text: TUTOR_LUFFY_SYSTEM_PROMPT }]
      },
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const lastMessage = messages[messages.length - 1].content;
    const contextualPrompt = material 
      ? `Material Base/Contexto:\n${material}\n\nMensagem do Pedro: ${lastMessage}`
      : lastMessage;

    const request = { contents: [{ role: 'user', parts: [{ text: contextualPrompt }] }] };

    console.time('[VERTEX_RES] Tempo de resposta');
    const result = await model.generateContent(request);
    console.timeEnd('[VERTEX_RES] Tempo de resposta');

    if (!result.response.candidates || result.response.candidates.length === 0) {
      throw new Error('A API retornou uma resposta sem candidatos.');
    }

    const responseText = result.response.candidates[0].content.parts[0].text;
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText || '{}');
    } catch (e) {
      console.warn('[VERTEX_WARN] Falha ao fazer parse do JSON do modelo. Usando raw.', responseText);
      parsedResponse = { reply: responseText };
    }
    
    return NextResponse.json(parsedResponse);

  } catch (error: any) {
    console.error('[VERTEX_CRITICAL_ERR] Falha ao comunicar com o Vertex AI:', error);
    return NextResponse.json(
      { error: 'Erro no Vertex AI', details: error.message || 'Erro desconhecido', status: error.status || 500 },
      { status: 500 }
    );
  }
}
