

## Plano: Transformar Skincare, Carreira e Viagens na identidade Notion-style

### Problema
Os módulos de Skincare (Beleza), Carreira e Viagens usam cards genéricos com gradientes, bordas suaves e estados vazios ("Nenhuma candidatura", "Adicionar viagem"). O usuário quer que sigam o mesmo padrão visual dos módulos de Estudos, Rotina e Finanças: cards com **faixas de cabeçalho coloridas**, títulos em **uppercase com emojis**, e conteúdo **pré-populado** (nunca tela vazia).

### O que muda visualmente

Todos os 3 módulos passam a usar:
- Cards `rounded-xl border border-border overflow-hidden` com header colorido (`bg-[cor]-200/300`) e body (`bg-[cor]-50`)
- Títulos em `font-black uppercase tracking-wider` com emoji
- Tabelas/listas já renderizadas com estrutura visível (colunas, linhas) mesmo sem dados do usuário
- Formulários de adição inline (input na última linha da tabela, não botão que abre formulário separado)

### Módulo 1: Skincare (Beleza)

**Arquivo principal:** `src/pages/Beleza.tsx` + sub-componentes em `src/components/beleza/`

Mudanças nos 4 sub-componentes:

1. **DailyMirror.tsx** — Trocar `sk-card` por card Notion com header verde-menta `bg-emerald-200`. Check-in de pele como tags horizontais dentro do card.

2. **SkincareRoutine.tsx** — Rotina AM: header `bg-green-300` com "☀️ ROTINA DA MANHÃ". Rotina PM: header `bg-purple-300` com "🌙 ROTINA DA NOITE". Skin Cycling: header `bg-indigo-200`. Passos já listados como tabela com checkbox, nome do passo e produto — nunca vazio.

3. **ProductShelf.tsx** — Bancada como tabela Notion: header `bg-pink-200` "🧴 MINHA BANCADA". Colunas: Produto | Marca | Categoria | PAO | Status. Linha de exemplo pré-populada. Input de adição inline na última linha.

4. **SkinDiary.tsx** — Header `bg-amber-200` "📸 DIÁRIO DE PELE". Grid de fotos estilo galeria com bordas definidas.

**Beleza.tsx:** Tabs trocam `bg-card/60 backdrop-blur-sm` por `TabsList` padrão dos outros módulos (sem blur/transparência).

### Módulo 2: Carreira

**Arquivo:** `src/pages/Carreira.tsx` (444 linhas, tudo inline)

Mudanças em cada seção interna:

1. **JobTracker** — Cards de vagas trocam `Card` genérico por Notion cards. Pipeline visual fica dentro de um card com header `bg-indigo-200` "📊 PIPELINE". Lista de vagas vira tabela: Empresa | Cargo | Status | Data | Salário. Exemplo pré-populado ("Empresa Exemplo | Dev Frontend | Aplicado | 2026-03-21").

2. **Portfolio** — Header `bg-amber-200` "🏆 CONQUISTAS". Tabela: Título | Categoria | Data | Link. Exemplo pré-populado.

3. **Networking** — Header `bg-purple-200` "🤝 REDE DE CONTATOS". Tabela: Nome | Empresa | Cargo | Último Contato. Follow-up pendente como badge no header.

4. **SkillsTracker** — Header `bg-green-200` "💻 SKILLS". Tabela com barras de nível inline.

5. **InterviewPrep** — Header `bg-sky-200` "📝 PREP ENTREVISTA". Lista de perguntas já pré-populada (mantém as 5 existentes).

**Stat cards do topo:** Trocar gradientes por Notion cards com headers coloridos.

### Módulo 3: Viagens

**Arquivo principal:** `src/pages/Viagens.tsx` + 10 sub-componentes em `src/components/travel/`

Cada sub-componente precisa de:

1. **BucketList.tsx** — Tabela Notion: Destino | País | Continente | Prioridade | Visitado. Exemplo: "Tokyo | Japão | Ásia | 💭 Sonho | ☐". Header `bg-teal-200`.

2. **DailyTimeline.tsx** — Em vez de "Adicionar dia", mostrar template pré-montado com "DIA 1" já aberto, com linhas de exemplo (Voo, Hotel, Atividade). Header `bg-blue-200`.

3. **PackingChecklist.tsx** — Tabela com categorias pré-populadas (Roupas, Eletrônicos, Documentos) já com itens exemplo. Header `bg-orange-200`.

4. **TravelBudget.tsx** — Tabela: Categoria | Estimado | Real. Com linhas exemplo (Hospedagem, Alimentação, Transporte). Header `bg-green-200`.

5. **BillSplitter.tsx** — Tabela de despesas com exemplo. Header `bg-pink-200`.

6. **PlacesBoard.tsx** — Já tem cards Notion mas precisa de exemplo pré-populado.

7. **TravelDiary.tsx** — Template com entrada exemplo. Header `bg-amber-200`.

8. **CurrencyConverter.tsx, SafetyCard.tsx, TripCountdown.tsx** — Aplicar headers coloridos e remover estados vazios.

### Regra de "Nunca Vazio"

Para cada tabela/lista, adicionar dados de exemplo como valor default no `usePersistedState`. Esses exemplos funcionam como template visual. O usuário pode editá-los ou deletá-los. Isso garante que ao abrir qualquer módulo, a tela já parece uma "planilha inteligente preenchida".

### Detalhes Técnicos

- **Arquivos editados:** ~15 arquivos (3 páginas + 12 sub-componentes)
- **Padrão CSS consistente:** Todos usam `rounded-xl border border-border overflow-hidden` + header `bg-[cor]-200 dark:bg-[cor]-800/50 px-4 py-2.5` + body `bg-[cor]-50 dark:bg-[cor]-950/20`
- **Sem glassmorphism/blur:** Remover qualquer `backdrop-blur`, `bg-card/60`, transparências
- **Dark mode:** Headers usam `dark:bg-[cor]-800/50`, bodies usam `dark:bg-[cor]-950/20`
- **Dados exemplo:** Inseridos como default do `usePersistedState` — se o usuário já tem dados, os defaults são ignorados (comportamento normal do hook)

### Ordem de Implementação

1. Skincare: Beleza.tsx + 4 sub-componentes
2. Carreira: Carreira.tsx (tudo inline)
3. Viagens: Viagens.tsx + 10 sub-componentes

