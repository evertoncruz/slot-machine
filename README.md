# 🎰 Slot Machine - PIXI.js v8

Um slot machine interativo com arquitetura modular, 100% TypeScript e totalmente configurável.

## 🎯 Visão Geral

✅ **3+ rolos dinâmicos** com animação suave  
✅ **Símbolos configuráveis** via `constants.ts`  
✅ **State machine** (IDLE → SPINNING → SETTLING → RESULT)  
✅ **Parada sequencial** de rolos  
✅ **Linha de resultado** (win line) no meio dos rolos  
✅ **100% TypeScript** com validação centralizada  

## 🏗️ Arquitetura
| Pasta | Responsabilidade |
|-------|-----------------|
| **components/** | Componentes visuais (PIXI) |
| ├─ **button/** | Botões interativos |
| ├─ **popup/** | Painel overlay e UI |
| ├─ **reel/** | Rolos individuais e animação |
| ├─ **slot/** | Orquestrador de rolos |
| **models/** | Tipos e Factories com validação |
| **services/** | Lógica de negócio |
| **utils/** | Configurações e helpers |

## 🧩 Componentes Principais

### **SlotMachine.ts** (Orquestrador)
- Gerencia múltiplos rolos
- Centraliza dinamicamente baseado em `constants.ts`
- Coordena animação e parada sequencial

### **Reel.ts + ReelContainer.ts + ReelAnimator.ts** (Rolo Individual)
- **Reel.ts**: Interface pública
- **ReelContainer.ts**: Renderização com máscara (loop infinito 20x)
- **ReelAnimator.ts**: Animação GSAP com 3 fases (aceleração → constante → desaceleração)

### **StateMachine.ts** (Máquina de Estados)
- Garante transições válidas
- Previne estados impossíveis
- Desacopla lógica de estado da UI

### **Factories** (ReelConfig, SlotMachineConfig, SpinResult)
- Validação centralizada
- Garantem dados válidos
- Facilitam testes

## 🚀 Como Usar


bash
Copiar

# Instalar
npm install

# Desenvolver
npm run dev

# Build
npm run build




## ⚙️ Configuração (DATA-DRIVEN)

Tudo em `src/utils/constants.ts`:


## ⚙️ Configuração (DATA-DRIVEN)

Tudo em `src/utils/constants.ts`:

```typescript
export const DEFAULT_CONFIG = {
  // ============================================
  // CONFIGURAÇÃO DE ROLOS
  // ============================================
  REEL_COUNT: 3,
  SYMBOLS: ['🍎', '🍒', '🍋', '🍊', '🍓', '🍌', '🍉', '⭐', '💎', '👑'],
  SYMBOL_HEIGHT: 80,
  VISIBLE_SYMBOLS: 7,

  // ============================================
  // CONFIGURAÇÃO DE ANIMAÇÃO (SPIN)
  // ============================================
  SPIN_DURATION: 3,
  ACCELERATION_DURATION: 0.5,
  DECELERATION_DURATION: 1,
  MAX_VELOCITY: 800,

  // ============================================
  // CONFIGURAÇÃO DE PARADA SEQUENCIAL (STOP)
  // ============================================
  TRANSITION_DELAY: 300,
  STOP_DELAY_BETWEEN_REELS: 0.3,
  STOP_DURATION: 0.5,

  // ============================================
  // CONFIGURAÇÃO DE LAYOUT
  // ============================================
  get CONTAINER_WIDTH(): number {
    const reelWidth = 80;
    const spacing = 30;
    const totalWidth = this.REEL_COUNT * reelWidth + (this.REEL_COUNT - 1) * spacing;
    return totalWidth + 100;
  },

  get CONTAINER_HEIGHT(): number {
    const contentHeight = this.SYMBOL_HEIGHT * this.VISIBLE_SYMBOLS;
    return contentHeight + 50;
  },

  REEL_SPACING: 30,

  // ============================================
  // CONFIGURAÇÃO VISUAL (UI)
  // ============================================
  get POPUP_WIDTH(): number {
    const reelWidth = 80;
    const spacing = 30;
    const totalWidth = this.REEL_COUNT * reelWidth + (this.REEL_COUNT - 1) * spacing;
    const calculatedWidth = totalWidth + 150;
    return Math.max(calculatedWidth, 600);
  },

  get POPUP_HEIGHT(): number {
    const contentHeight = this.SYMBOL_HEIGHT * this.VISIBLE_SYMBOLS;
    return Math.max(contentHeight + 50, 400);
  },

  OVERLAY_ALPHA: 0.5,
  OVERLAY_COLOR: 0x000000,
};
```

**Altere aqui e tudo se ajusta automaticamente!**

### Exemplos de Uso

```typescript
// Aumentar número de rolos
REEL_COUNT: 5,  // ✅ Automático!

// Alterar símbolos
SYMBOLS: ['🎰', '🎲', '🃏', '🎯', '🎪'],

// Mudar duração do spin
SPIN_DURATION: 5,  // 5 segundos

// Alterar símbolos visíveis
VISIBLE_SYMBOLS: 5,  // Mostrar 5 símbolos
```


## 🔄 Fluxo de Execução
Usuário clica em GIRAR ↓

StateMachine: IDLE → SPINNING ↓

SlotMachine.spin(targetResult) ├─ Todos os rolos animam em paralelo (Promise.all) ↓

Parada sequencial ├─ Rolo 1 para ├─ Rolo 2 para ├─ Rolo 3 para ↓

StateMachine: SPINNING → SETTLING → RESULT → IDLE ↓

WinLine mostra resultado no meio dos rolos

### Descrição Detalhada

**Fase 1: Iniciação**
- Usuário clica no botão GIRAR
- Estado muda para SPINNING
- Botão é desabilitado

**Fase 2: Animação**
- SlotMachine.spin() é chamado com resultado alvo
- Todos os 3 rolos animam **em paralelo** usando Promise.all()
- Cada rolo tem duração diferente (efeito cascata)

**Fase 3: Parada Sequencial**
- Rolos param **um por um** (não simultâneo)
- Delay entre paradas: 0.3s
- Efeito visual de "cascata" de parada

**Fase 4: Resultado**
- StateMachine transiciona: SPINNING → SETTLING → RESULT → IDLE
- WinLine mostra qual símbolo parou no meio
- Botão é re-habilitado
- Pronto para novo spin

## 📊 Trade-offs

| Decisão | Por quê |
|---------|---------|
| **Loop infinito (20x)** | Suavidade > performance |
| **Factories com validação** | Previne bugs de dados inválidos |
| **Getters dinâmicos** | Manutenibilidade > performance |
| **State Machine** | Segurança > simplicidade |

## 🔮 Melhorias Futuras (Com Mais Tempo)

1. **Win Detection**: Detectar vitória automática
2. **Animações de Vitória**: Piscar, sons, prêmios
3. **Histórico de Spins**: Rastrear estatísticas
4. **Persistência**: LocalStorage
5. **Testes Unitários**: Cobertura 100%
6. **Múltiplas Linhas**: 5, 9, 25 linhas
7. **Responsividade Total**: Redimensionar com janela
8. **Storybook**: Documentação interativa

## 📦 Dependências

- **PIXI.js v8**: Renderização 2D
- **GSAP**: Animações
- **TypeScript**: Type-safety

## 🎓 Lições Aprendidas

1. **Factories são ouro**: Validação centralizada evita bugs
2. **State machines garantem segurança**: Nunca há estados inválidos
3. **Separação de responsabilidades funciona**: Cada classe = UMA responsabilidade
4. **Data-driven é flexível**: Altere `constants.ts` sem tocar no código
5. **Loop infinito é essencial**: Suavidade é mais importante que economia de memória

## 📝 Licença

MIT

---

**Última atualização**: Agosto 2026  
**Versão**: 1.0.0
