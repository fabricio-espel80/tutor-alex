<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 🗺️ Roteiro do Projeto: Tutor Chopper ("One Piece" Edition)

- **Persona**: **Tutor Chopper** 🦌🎩 (Tony Tony Chopper), um tutor paciente, fofo e alegre que usa falas de piratas (Nakama) e analogias do anime para ensinar.
- **Servidor**: O projeto roda via `npm run dev -- -p 3005` (porta 3005 é recomendada para evitar conflito).
- **Configuração de Performance**: `next.config.ts` está configurado com `turbopack.root: "."` para evitar travamento de escaneamento de arquivos em `/Users/hagensadmin`.

## 📦 Funcionalidades Prontas:
- [x] **Base de Tópicos Prontos**: Ciências, História, Geografia e Matemática em `src/utils/knowledgeBase.ts`.
- [x] **Upload de PDFs ("Baú do Capitão")**: Extração de texto de PDFs no navegador usando PDF.js via CDN em `src/utils/pdfExtractor.ts`.
- [x] **Voz Customizada**: Text-to-Speech calibrado em `TutorChat.tsx` com `pitch: 1.35` e `rate: 1.05` e avatar atualizado para o Luffy (👒).
- [x] **Gamificação**: Timer "Log Pose" 🧭 com som de sino de navio e checklist "Rota do Tesouro" 🏴‍☠️ com moedas douradas `🟡`.
- [x] **Estilo Temático**: Paleta de cores de pergaminho antigo (areia/marinho/ouro pirata) em `globals.css` e layout do "Mundo do Luffy".
- [x] **Adaptação de API (Gemini V2/AQ. Key)**: Refatoração da API interna usando REST bruto (`fetch`) com Header `x-goog-api-key` no lugar do SDK, superando o bloqueio de "OAuth False Positive" (`ACCESS_TOKEN_TYPE_UNSUPPORTED`) e impedindo os "Enters" (quebra de linha) acidentais de copia e cola da Vercel.

## 🚀 Próximos Passos (Onde paramos):
- [ ] O Nakama (Pedro/Fabrício) fará o teste final de funcionamento no link público da Vercel após o deploy para validar a liberação do tráfego do Google e da API Key AQ.
- [ ] Adicionar efeitos sonoros extras de piratas.
- [ ] Refinar ou expandir os temas pré-cadastrados.

---

## ⚙️ Regras de Desenvolvimento (Desenvolvedor AI):
- **Idioma**: Todas as descrições de ferramentas (`toolAction` e `toolSummary`), planos de implementação, walkthroughs e mensagens de commits devem ser escritos obrigatoriamente em **Português (Brasil)**.


