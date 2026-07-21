import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TUTOR_CHOPPER_SYSTEM_PROMPT } from '@/utils/prompt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, material, apiKey: bodyApiKey } = body;

    // Resolve API key: body > header > env
    const headerApiKey = req.headers.get('x-api-key');
    const apiKey = bodyApiKey || headerApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Chave de API do Gemini não encontrada.',
          message: 'Por favor, insira sua chave de API nas configurações do Chopper (ícone de engrenagem ⚙️) ou defina a variável de ambiente GEMINI_API_KEY.',
        },
        { status: 400 }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Formato inválido', message: 'A lista de mensagens é obrigatória.' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Construct instructions combining base persona + material context
    let systemInstruction = TUTOR_CHOPPER_SYSTEM_PROMPT;
    if (material && material.trim().length > 0) {
      systemInstruction += `\n\nIMPORTANTE: Use o seguinte material de apoio/livro escolar como base principal de conhecimentos para as explicações e perguntas:\n"""\n${material}\n"""`;
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction,
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    // Format messages for Gemini Chat API
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Start chat with history (all messages except the latest one)
    const history = contents.slice(0, -1);
    const lastMessage = contents[contents.length - 1].parts[0].text;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    // Parse response to ensure it's valid JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (e) {
      // If parsing fails (unlikely due to responseMimeType), format it manually
      console.error('Failed to parse Gemini response as JSON:', responseText, e);
      parsedResponse = {
        reply: responseText,
        checklist: [],
      };
    }

    return NextResponse.json(parsedResponse);
  } catch (error: any) {
    console.error('Erro na rota de chat:', error);
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        message: error.message || 'Ocorreu um erro ao processar a resposta do Chopper.',
      },
      { status: 500 }
    );
  }
}
