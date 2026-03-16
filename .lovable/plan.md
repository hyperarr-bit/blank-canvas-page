

## Plano: Home vazia por padrão + modo de edição estilo iOS + widgets mais úteis

### 1. Home vazia na primeira abertura
- Alterar `DEFAULT_WIDGETS` em `use-home-widgets.ts` para `[]` (array vazio)
- Quando não há widgets, mostrar um empty state convidativo com botão "Montar minha Home"

### 2. Modo de edição estilo iOS (long press + jiggle)
- Adicionar **long press** (600ms) nos widgets para ativar modo de edição automaticamente
- No modo edição, todos os widgets ganham **animação de "jiggle"** (tremida sutil como iOS) via CSS keyframes
- Cada widget mostra badge de **remover (X)** e **redimensionar** no canto
- Botão fixo no rodapé para **adicionar mais widgets** enquanto em modo edição
- **Drag-and-drop** para reordenar: usar `@dnd-kit/core` + `@dnd-kit/sortable` (leve e compatível com touch)
- Toque fora da área de edição ou botão "Pronto" para sair do modo

### 3. Widgets mais úteis (não apenas botões para módulos)
Enriquecer os 6 widgets de módulo para ter **ações inline** sem precisar navegar:

- **FinancesWidget**: Mostrar saldo + últimas 2 transações resumidas. Botão "+" para adicionar despesa rápida inline
- **WorkoutWidget**: Mostrar treino do dia com checklist dos exercícios. Toggle "Concluído" direto no widget
- **CaloriesWidget**: Barra de macros (P/C/G) no tamanho large. Botão "+Refeição" rápido
- **HealthWidget**: Botões de "+" e "-" para adicionar copos de água direto no widget sem navegar
- **HabitsWidget**: Lista dos 3 primeiros hábitos do dia com checkbox inline para marcar como feito
- **ReadingWidget**: Slider de progresso editável + botão "Atualizar páginas"

### 4. Mudanças nos arquivos

| Arquivo | Mudança |
|---|---|
| `use-home-widgets.ts` | `DEFAULT_WIDGETS = []`; exportar `setActiveWidgets` |
| `Home.tsx` | Remover botão "Editar" separado; adicionar long-press handler; empty state; integrar dnd-kit para reorder; jiggle animation; footer "Adicionar widget" no modo edição |
| `FinancesWidget.tsx` | Ações inline (mini formulário de despesa) |
| `WorkoutWidget.tsx` | Toggle de conclusão inline |
| `CaloriesWidget.tsx` | Barra de macros + botão adicionar |
| `HealthWidget.tsx` | Botões +/- água inline |
| `HabitsWidget.tsx` | Checkboxes inline dos hábitos |
| `ReadingWidget.tsx` | Slider de progresso editável |
| `WidgetPicker.tsx` | Ajustes menores de UX |
| `index.css` | Keyframes do jiggle animation |
| `package.json` | Adicionar `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |

### Detalhes técnicos

**Long press**: Custom hook `useLongPress` com `onTouchStart`/`onMouseDown` + timeout de 600ms. Ativa `editingWidgets` state.

**Jiggle CSS**:
```text
@keyframes jiggle {
  0%, 100% { transform: rotate(-0.5deg); }
  50%      { transform: rotate(0.5deg); }
}
```

**Drag-and-drop**: `DndContext` + `SortableContext` envolvendo a lista flat de widgets. Cada widget wrapped em `useSortable`. No `onDragEnd`, chama `reorder(oldIndex, newIndex)`.

**Ações inline nos widgets**: Os widgets recebem callbacks via `useUserData`/`useLifeHubData` para modificar dados diretamente (ex: `setData("saude-agua", glasses + 1)`) com `e.stopPropagation()` para não navegar ao módulo.

