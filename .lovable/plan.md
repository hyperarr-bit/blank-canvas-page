

# Reformulação Completa do Módulo Beleza (Skincare & Self-Care)

## Estrutura de Abas (reorganizada)

```text
[ Rotina ] [ Inventário ] [ Análise ] [ Capilar ]
```

---

## 1. Header de Status ("O Agora")
Card translúcido no topo (fora das abas) mostrando:
- Fase atual da pele (baseado no último check-in do diário)
- Indicador "Próximo Passo" (manhã → Morning Routine, noite → Night Routine)
- Streak de consistência

## 2. Aba "Rotina" (refatorada)
- Rotina Manhã/Noite com **ícones representativos** por passo (ex: 🧹 Limpeza, 💧 Tônico, 🧴 Sérum) em vez de texto puro
- **Verificador de Conflitos**: botão que analisa os produtos selecionados e mostra avisos (banco de dados fixo de incompatibilidades: Retinol + AHA/BHA, Vitamina C + Niacinamida em alta concentração, etc.)
- Alertas amarelos ⚠️ inline quando combinações problemáticas são detectadas

## 3. Aba "Inventário" (expandida)
- **Campos novos no formulário**: Data de Abertura, PAO (6M/12M/18M/24M), Preço (R$), Tamanho (ml/g), Foto (URL)
- **Modal de Produto** ao clicar: foto, barra de progresso visual de validade, frequência de uso, custo por dose calculado automaticamente
- **Card "Próximos do Vencimento"**: aviso com contagem regressiva de dias
- **Custo por Dose**: calcula automaticamente (preço ÷ estimativa de aplicações)
- **Botão "Acabou"**: move para lista "Compras Futuras" e opção "Lançar gasto no Financeiro"
- **Lista de Compras Futuras**: produtos marcados como acabados + itens com flag "Recomprar"

## 4. Aba "Análise" (nova — substitui Diário)
- **Diário de Pele** com check-in diário (tipo de pele, humor 5 emojis, notas, produtos usados, upload de foto via URL)
- **Carrossel Antes & Depois**: timeline vertical com miniatura da foto, data, emoji de humor
- **Gráficos simples**: frequência de cada tipo de pele ao longo do mês, tendência de humor

## 5. Aba "Capilar" (expandida)
- **Teste de Porosidade**: formulário de 3 perguntas → sugere ciclo ideal (foco Hidratação/Nutrição/Reconstrução)
- **Checklist de Lavagem**: ao clicar no dia, abre modal com passos (Pré-shampoo, Shampoo, Máscara, Condicionador, Finalizador) — conecta com Inventário para selecionar produto
- **Log de Resultados**: após marcar dia como feito, tags rápidas (Brilho ✨, Frizz ⚡, Maciez ☁️, Peso ⚖️) — resumo mensal
- **Timeline de Químicas e Cortes**: marcar eventos (Último Corte, Última Coloração, Progressiva) com data e lembretes automáticos ("Faz X meses desde...")

---

## Funções Novas Criadas

1. **Calculadora de Custo por Dose** — preço ÷ (tamanho ÷ dose estimada por categoria)
2. **Verificador de Conflitos de Ativos** — banco de dados fixo de combinações incompatíveis com alertas visuais
3. **Teste de Porosidade Capilar** — questionário que gera recomendação automática de ciclo
4. **Checklist de Lavagem Detalhado** — passos integrados com inventário de produtos
5. **Sistema "Acabou" + Compras Futuras** — gestão de reposição com integração financeira
6. **Timeline de Químicas/Cortes** — log de eventos capilares com lembretes
7. **Tags de Resultado Capilar** — feedback pós-lavagem com resumo mensal
8. **Barra de Progresso de Validade** — visual de quanto tempo resta no produto aberto (PAO)

## Detalhes Técnicos

- Arquivo único `src/pages/Beleza.tsx` será reescrito com componentes internos organizados
- Persistência via `usePersistedState` (mantém padrão existente)
- Banco de conflitos de ativos como constante no código (array de regras)
- Fotos como URLs (sem storage backend necessário)
- Integração com finanças via chave `core-expenses` do usePersistedState

