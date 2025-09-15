# Fluff Inc. - AI Coding Agent Instructions

## Project Overview
Fluff Inc. is a complex incremental/idle game built with vanilla JavaScript, featuring a pet business simulation with multiple interconnected systems. The game uses a modular architecture across ~30 JavaScript files, each handling specific game mechanics like generators, character interactions, prestige systems, and resource management.

## Critical Architecture Patterns

### State Management & Data Flow
- **Global State Object**: Primary game state lives in `window.state` with resources like `fluff`, `swaria`, `feathers`, `artifacts`
- **Decimal.js Integration**: ALL numeric values use `break_eternity.js` Decimals for large number support
- **DecimalUtils Helper**: Always use `DecimalUtils.toDecimal()`, `DecimalUtils.isDecimal()`, and formatting functions


### Resource & Currency Patterns
```javascript
// Correct Decimal handling pattern
if (!DecimalUtils.isDecimal(state.fluff)) {
  state.fluff = new Decimal(state.fluff || 0);
}

// State serialization pattern for save systems
const serializedValue = DecimalUtils.isDecimal(value) ? value.toString() : value;
```

### Generator System Architecture
- **Box Generators**: Core progression loop producing 5 box types (common → mythic)
- **Light Generators**: Prism-based system with 6 light types
- **Mk.2 Unified System**: Friendship level 10+ unlocks combined upgrade mechanics
- **Cost Scaling**: Uses `gen.baseCost * gen.costMultiplier^gen.upgrades` pattern

### Character & Friendship System
- **Departmental Structure**: Characters belong to departments (Cargo, Generator, Lab, Kitchen, Terrarium)
- **Friendship Levels**: Unlock major mechanics at specific levels (esp. level 10 = Mk.2 mode)
- **Hunger System**: Characters have hunger/fullness states affecting productivity

## Development Conventions

### File Organization
- `script.js`: Core game loop, generators, UI
- `script2.js`: Extended game mechanics, state management  
- `script3.js`: Advanced features, cooldown systems
- Domain files: `prism.js`, `terrarium.js`, `kitchen.js`, etc.
- `decimal_utils.js`: Decimal arithmetic helpers

### Code Style Requirements
1. **No AI traces**: Never add comments indicating AI involvement
2. **No debug output**: No `console.log`, `alert`, or debugging statements
3. **No emoji usage**: Unless explicitly requested by user
4. **Memory safety**: Always check for memory leaks in long-running processes
5. **Preserve existing functionality**: Don't break current game mechanics

### Global Namespace Pattern
```javascript
// Make functions globally accessible
window.functionName = functionName;

// Check for existing functions before overriding
if (typeof window.existingFunction === 'function') {
  // Safe to call
}
```

### Save/Load Integration Pattern
```javascript
// Save pattern (currently disabled)
function saveFeatureState() {
  // localStorage.setItem('featureState', JSON.stringify(data)); // Save system disabled
}

// Load pattern with defaults
function loadFeatureState() {
  try {
    const saved = localStorage.getItem('featureState'); // Usually returns null
    return saved ? JSON.parse(saved) : getDefaultState();
  } catch (error) {
    return getDefaultState();
  }
}
```

## Critical Integration Points

### UI Update Flow
- `updateUI()`: Primary UI refresh for main resources
- `renderGenerators()`: Box generator interface updates
- `updateKnowledgeUI()`: Research/knowledge display updates
- **Performance**: Use throttling for high-frequency updates (see optimization patterns)

### Game Loop Integration
- `tickGenerators(diff)`: Core progression tick function
- **Timing**: Uses `Date.now()` for delta calculations
- **Background Processing**: Handle visibility changes and tab switching

### Cross-System Dependencies
- **Element System**: `boughtElements` array controls feature unlocks
- **Grade System**: Expansion resets that unlock new content tiers
- **Infinity System**: Late-game prestige that resets core progress but not friendship lvl, inventory tokens, quest progress
- **Anomaly System**: Can modify game behavior and UI presentation
- **Power System**: Day/night cycle affects multiple systems

## Key Anti-Patterns to Avoid
- Never directly modify Decimal values without using DecimalUtils
- Don't assume localStorage persistence works (save system disabled)
- Avoid breaking the generator Mk.2 unified upgrade system
- Don't create memory leaks in interval-based systems
- Never bypass friendship level requirements for unlocks



When working with this codebase, always consider the interconnected nature of systems and the disabled save functionality. Focus on maintaining the complex balance between progression systems while respecting the established architectural patterns.