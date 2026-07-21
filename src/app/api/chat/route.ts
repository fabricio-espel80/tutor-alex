import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TUTOR_LUFFY_SYSTEM_PROMPT } from '@/utils/prompt';

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
          message: 'Por favor, insira sua chave de API nas configurações do Capitão Luffy (ícone de engrenagem ⚙️) ou defina a variável de ambiente GEMINI_API_KEY.',
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

    // Sanitização severa para resolver o problema da chave duplicada com quebra de linha
    const cleanApiKey = apiKey.split('\\n')[0].trim();
    const genAI = new GoogleGenerativeAI(cleanApiKey);
    
    // Vamos usar o modelo universal gemini-pro e INJETAR o sistema no prompt do usuário
    // porque muitas chaves antigas ou com restrição de país dão erro 404 no 1.5 e em systemInstruction.
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
    });

    // Format messages for Gemini Chat API
    const contents = messages.map((m: { role: string; content: string }, index: number) => {
      let content = m.content;
      // Se for a primeira mensagem, a gente injeta TUDO nela para evitar usar systemInstruction
      if (index === 0 && m.role === 'user' && content.startsWith('Iniciar uma nova aventura de estudos sobre:')) {
        let injectedPrompt = TUTOR_LUFFY_SYSTEM_PROMPT + '\\n\\n--- INÍCIO DA INTERAÇÃO ---\\n\\n';
        if (material && material.trim().length > 0) {
          injectedPrompt += `MATERIAL DE APOIO:\\n"""\\n${material}\\n"""\\n\\n`;
        }
        injectedPrompt += content + '\\n\\nPor favor, crie uma Rota do Tesouro (checklist) com 3 a 5 ilhas (tópicos de aprendizado) e dê as boas-vindas ao Pedro com o seu jeito super animado, e em seguida faça a primeira pergunta de fixação de múltipla escolha baseada nesse material.';
        content = injectedPrompt;
      }
      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: content }],
      };
    });

    const result = await model.generateContent({ contents });
    const responseText = result.response.text();

    // Parse response to ensure it's valid JSON
    let parsedResponse;
    try {
      const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      parsedResponse = JSON.parse(cleanedText);
    } catch (e) {
      console.error('Failed to parse Gemini response as JSON:', responseText, e);
      parsedResponse = {
        reply: responseText.replace(/```json/gi, '').replace(/```/g, '').trim(),
        checklist: [],
      };
    }

    return NextResponse.json(parsedResponse);
  } catch (error: any) {
    console.error('Erro na rota de chat:', error);
    return NextResponse.json(
      {
        error: 'Erro interno do servidor',
        message: error.message || 'Ocorreu um erro ao processar a resposta do Luffy.',
      },
      { status: 500 }
    );
  }
}
