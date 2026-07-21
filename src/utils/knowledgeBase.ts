export interface StudyTopic {
  id: string;
  title: string;
  description: string;
  content: string;
}

export interface StudySubject {
  id: string;
  name: string;
  icon: string;
  color: string;
  topics: StudyTopic[];
}

export const KNOWLEDGE_BASE: StudySubject[] = [
  {
    id: 'ciencias',
    name: 'Ciências',
    icon: '🔬',
    color: '#0284c7', // Ocean Blue
    topics: [
      {
        id: 'sistema-solar',
        title: 'O Sistema Solar 🌌',
        description: 'Viaje pelo espaço com o navio Thousand Sunny e descubra o Sol e os planetas!',
        content: `O Sistema Solar é o nosso endereço no espaço! No centro dele fica o **Sol**, uma estrela gigante e super quente, que brilha e brilha (parecendo o poder de fogo de uma Akuma no Mi). 

Ao redor do Sol, giram **8 planetas** que viajam pelo espaço como se fossem navios piratas em suas rotas. 

Aqui estão alguns desses planetas Nakamas:
- **Mercúrio**: O mais próximo do Sol. É super quente de dia e congelante de noite!
- **Vênus**: O planeta mais brilhante, coberto de nuvens quentes de ácido.
- **Terra**: A nossa casa! O único planeta conhecido com muita água líquida (o nosso Blue Sea) e vida.
- **Marte**: O planeta vermelho, cheio de poeira e vulcões gigantes desativados.
- **Júpiter**: O maior de todos! É uma bola gigante de gás onde caberiam mais de mil Terras dentro.
- **Saturno**: O planeta dos anéis lindos feitos de gelo e rochas brilhantes.
- **Urano e Netuno**: Os gigantes de gelo, muito frios e distantes do Sol.`
      },
      {
        id: 'fotosintese',
        title: 'Como as Plantas se Alimentam (Fotossíntese) 🌱',
        description: 'Descubra o superpoder que as plantas usam para fazer seu próprio lanchinho!',
        content: `As plantas têm um poder incrível, parecido com uma Akuma no Mi da natureza: elas conseguem fazer sua própria comida! Esse processo se chama **Fotossíntese**.

Para fazer esse banquete, a plantinha precisa de três ingredientes principais:
1. **Luz do Sol**: Que serve como a energia ou o "combustível" para a receita.
2. **Água**: Que a raiz suga do solo (como o Luffy bebendo água de canudinho).
3. **Gás Carbônico**: Um gás que está no ar e que nós expiramos ao respirar.

A mágica acontece nas folhas, que são cheias de uma substância verde chamada **clorofila**. A clorofila junta tudo isso e transforma em **glicose** (o açúcar que alimenta a planta) e **oxigênio** (o ar limpinho que nós respiramos!). Sem as plantas, nenhum Nakama conseguiria respirar no mundo.`
      },
      {
        id: 'ciclo-agua',
        title: 'O Ciclo da Água 💧',
        description: 'A grande aventura da água que viaja da terra para o céu e volta em forma de chuva!',
        content: `A água do nosso planeta é uma verdadeira pirata: ela nunca fica parada e vive viajando em círculos! Essa jornada se chama **Ciclo da Água** e tem 4 etapas principais:

1. **Evaporação**: O Sol aquece a água dos oceanos e rios. Ela vira vapor (como a fumaça de um banho quente) e sobe para o céu, parecendo o caminho para uma Ilha do Céu (Skypiea)!
2. **Condensação**: Lá no alto, onde é muito frio, o vapor de água se junta e forma as **nuvens**.
3. **Precipitação**: Quando as nuvens ficam muito pesadas e cheias de água, elas não aguentam mais e soltam tudo na forma de **chuva** (ou neve)!
4. **Coleta**: A água da chuva cai na terra, entra no solo, alimenta as plantas, enche os rios e volta para o mar, onde toda a aventura começa de novo!`
      }
    ]
  },
  {
    id: 'historia',
    name: 'História',
    icon: '📜',
    color: '#ca8a04', // Pirate Gold
    topics: [
      {
        id: 'dinossauros',
        title: 'A Era dos Dinossauros 🦖',
        description: 'Conheça os monstros gigantes que dominavam a Terra antes de nós, como em Little Garden!',
        content: `Muito antes dos seres humanos e dos piratas existirem, a Terra era habitada por criaturas gigantescas chamadas **Dinossauros** (muito parecidos com os monstros que Luffy e sua tripulação encontraram na ilha de Little Garden!). Eles viveram há milhões de anos.

Existiam dinossauros de vários tipos:
- **Herbívoros**: Comiam apenas plantas e folhas de árvores altas, como o enorme *Braquiossauro*.
- **Carnívoros**: Caçavam outros animais para comer carne, como o temível *Tiranossauro Rex* (com suas garras afiadas e dentes do tamanho de bananas!).

Os dinossauros desapareceram da Terra depois que um **asteroide gigante** (uma rocha espacial enorme) bateu no nosso planeta. Isso mudou o clima e eles não conseguiram sobreviver. Hoje, nós sabemos que eles existiram graças aos **fósseis** (ossos e pegadas de pedra) que arqueólogos como a Nico Robin encontram enterrados na terra!`
      },
      {
        id: 'egito-antigo',
        title: 'O Egito Antigo e as Pirâmides 🇪🇬',
        description: 'Desvende os mistérios dos faraós, múmias e o grande Rio Nilo!',
        content: `O Egito Antigo foi uma civilização fantástica que se desenvolveu no meio do deserto há milhares de anos (parecida com a ilha desértica de Alabasta!). Eles só sobreviveram por causa do **Rio Nilo**, que fornecia água doce e deixava a terra boa para plantar.

Os egípcios tinham costumes muito interessantes:
- **Faraó**: Era o rei absoluto do Egito, considerado quase como um deus na Terra (como o rei Cobra de Alabasta).
- **Pirâmides**: Eram túmulos gigantes de pedra construídos para guardar os corpos dos faraós quando eles morriam. Eles acreditavam na vida após a morte!
- **Múmias**: Para preservar o corpo do faraó, eles o enrolavam em faixas de tecido com óleos especiais, criando as múmias que duravam milhares de anos.`
      }
    ]
  },
  {
    id: 'geografia',
    name: 'Geografia',
    icon: '🌍',
    color: '#15803d', // Green Forest
    topics: [
      {
        id: 'vulcoes',
        title: 'Como Funcionam os Vulcões 🌋',
        description: 'Entenda como as montanhas cospem fogo lá de dentro da Terra!',
        content: `Um vulcão é como uma chaminé gigante ou uma panela de pressão ligada ao centro da Terra. Debaixo da casca do nosso planeta é tão, mas tão quente, que até as rochas derretem e viram um líquido de fogo chamado **magma** (parecido com o poder da Akuma no Mi do almirante Akainu!).

Como funciona uma erupção vulcânica:
1. **Pressão subindo**: O magma fica guardado em uma câmara embaixo do vulcão. Conforme mais magma se acumula, a pressão aumenta muito.
2. **A Explosão**: Quando a pressão fica forte demais, o vulcão entra em erupção, cuspindo magma, cinzas e gases para o céu.
3. **Lava**: Quando o magma sai do vulcão e escorre pelo chão, ele ganha o nome de **lava**. Quando a lava esfria no ar, ela endurece e vira pedra preta rígida, criando novas montanhas e ilhas no oceano!`
      }
    ]
  },
  {
    id: 'matematica',
    name: 'Matemática',
    icon: '🔢',
    color: '#b91c1c', // Pirate Red
    topics: [
      {
        id: 'fracoes-pizza',
        title: 'Entendendo Frações com Pizza 🍕',
        description: 'Aprenda a dividir frações dividindo pedaços de pizza com a tripulação!',
        content: `Uma **fração** é apenas uma forma de mostrar que dividimos algo inteiro em pedaços iguais. Imagine que o Sanji fez uma pizza deliciosa para a tripulação e dividiu ela em **8 pedaços iguais**.

Quando falamos de frações, usamos dois números divididos por uma linha:
- O número de **baixo** é o **Denominador**: Ele mostra em quantos pedaços a pizza inteira foi cortada (no nosso caso, 8).
- O número de **cima** é o **Numerador**: Ele mostra quantos pedaços nós pegamos ou comemos.

Vamos aos exemplos dos Nakamas:
- Se o **Luffy** atacar a janta e comer **3 pedaços**, dizemos que ele comeu **3/8** (três oitavos) da pizza.
- Se o **Zoro** comer **2 pedaços**, ele comeu **2/8** (dois oitavos) da pizza.
- Se somarmos o que os dois comeram: 3 pedaços + 2 pedaços = 5 pedaços de um total de 8. Ou seja, eles comeram **5/8** da pizza!`
      }
    ]
  }
];
