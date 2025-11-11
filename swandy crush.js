// This file handles the Swandy Crusher grid game mechanics

// Initialize Swandy Crusher state
if (!window.state.halloweenEvent) {
  window.state.halloweenEvent = {};
}

if (!window.state.halloweenEvent.swandyCrusher) {
  window.state.halloweenEvent.swandyCrusher = {
    level: 1,
    score: new Decimal(0),
    grid: [],
    selectedCell: null,
    combo: 0,
    isComboActive: false,
    isProcessing: false,
    multipliers: {
      swandyProduction: new Decimal(1),
      scoreMultiplier: new Decimal(1)
    },
    resety: {
      count: 0,
      highestLevelReached: 0,
      capMultiplier: new Decimal(1),
      productionMultiplier: new Decimal(1)
    }
  };
}

// Ensure resety state exists even if swandyCrusher was already initialized
if (!window.state.halloweenEvent.swandyCrusher.resety) {
  window.state.halloweenEvent.swandyCrusher.resety = {
    count: 0,
    highestLevelReached: 0,
    capMultiplier: new Decimal(1),
    productionMultiplier: new Decimal(1)
  };
}

// Always reset isProcessing on page load to prevent softlock
if (window.state.halloweenEvent.swandyCrusher) {
  window.state.halloweenEvent.swandyCrusher.isProcessing = false;
  
  // Also set it after a short delay to ensure it overrides any auto-processing
  setTimeout(() => {
    window.state.halloweenEvent.swandyCrusher.isProcessing = false;
  }, 100);
}

// Ensure highestLevelReached exists for existing saves
if (window.state.halloweenEvent.swandyCrusher.resety && 
    window.state.halloweenEvent.swandyCrusher.resety.highestLevelReached === undefined) {
  window.state.halloweenEvent.swandyCrusher.resety.highestLevelReached = 
    window.state.halloweenEvent.swandyCrusher.resety.count > 0 
      ? window.state.halloweenEvent.swandyCrusher.resety.count + 4
      : 0;
}

// Ensure hexedTiles tracking exists
if (!window.state.halloweenEvent.swandyCrusher.hexedTiles) {
  window.state.halloweenEvent.swandyCrusher.hexedTiles = {};
}

// Ensure Swandy Breaker Hex Staff state exists
if (!window.state.halloweenEvent.swandyCrusher.hexStaff) {
  window.state.halloweenEvent.swandyCrusher.hexStaff = {
    enabled: false,
    selectedMode: 'normal',
    normal: {
      progress: 0,
      required: 50,
      uses: 0,
      maxUses: 3
    },
    blaster: {
      progress: 0,
      required: 10,
      uses: 0,
      maxUses: 3
    },
    orb: {
      progress: 0,
      required: 5,
      uses: 0,
      maxUses: 3
    }
  };
}

// Grid cell structure: { type: 'red', isBlaster: false, blasterDirection: null, isOrb: false }
// blasterDirection can be 'horizontal' or 'vertical'
// Hexed positions are tracked separately in crusherState.hexedPositions as { "row,col": true }

// Swandy types with their icons
const swandyTypes = [
  { id: 'red', icon: 'assets/icons/red swandy.png', color: '#ff4444' },
  { id: 'orange', icon: 'assets/icons/orange swandy.png', color: '#ff8800' },
  { id: 'yellow', icon: 'assets/icons/yellow swandy.png', color: '#ffdd00' },
  { id: 'green', icon: 'assets/icons/green swandy.png', color: '#44ff44' },
  { id: 'blue', icon: 'assets/icons/blue swandy.png', color: '#4444ff' },
  { id: 'purple', icon: 'assets/icons/purple swandy.png', color: '#aa44ff' },
  { id: 'white', icon: 'assets/icons/white swandy.png', color: '#ffffff' }
];

// Grid configuration
const GRID_SIZE = 8;
const CELL_SIZE = 60; // pixels

// Initialize the grid with random Swandies
function initializeSwandyCrusherGrid() {
  const grid = [];
  
  for (let row = 0; row < GRID_SIZE; row++) {
    grid[row] = [];
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col] = createSwandyCell(getRandomSwandyType());
    }
  }
  
  // Ensure no initial matches
  while (hasMatches(grid)) {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (isPartOfMatch(grid, row, col)) {
          grid[row][col] = createSwandyCell(getRandomSwandyType());
        }
      }
    }
  }
  
  window.state.halloweenEvent.swandyCrusher.grid = grid;
  return grid;
}

// Create a swandy cell object
function createSwandyCell(type, isBlaster = false, blasterDirection = null, isOrb = false) {
  return {
    type: type,
    isBlaster: isBlaster,
    blasterDirection: blasterDirection,
    isOrb: isOrb
  };
}

// Get the type from a cell (handles both old string format and new object format)
function getCellType(cell) {
  if (!cell) return null;
  return typeof cell === 'string' ? cell : cell.type;
}

// Check if a cell is a blaster
function isBlasterCell(cell) {
  if (!cell) return false;
  return typeof cell === 'object' && cell.isBlaster === true;
}

// Check if a cell is an orb
function isOrbCell(cell) {
  if (!cell) return false;
  return typeof cell === 'object' && cell.isOrb === true;
}


// Get a random Swandy type
function getRandomSwandyType() {
  const randomIndex = Math.floor(Math.random() * swandyTypes.length);
  return swandyTypes[randomIndex].id;
}

// Check if a cell is part of a match
function isPartOfMatch(grid, row, col) {
  const cell = grid[row][col];
  const type = getCellType(cell);
  
  if (isOrbCell(cell)) {
    return false;
  }
  
  // Check horizontal match - orbs do NOT count toward match requirements
  let horizontalCount = 1;
  // Count left
  for (let c = col - 1; c >= 0; c--) {
    const leftCell = grid[row][c];
    if (isOrbCell(leftCell)) break; // Stop at orbs, don't count them
    if (getCellType(leftCell) !== type) break;
    horizontalCount++;
  }
  // Count right
  for (let c = col + 1; c < GRID_SIZE; c++) {
    const rightCell = grid[row][c];
    if (isOrbCell(rightCell)) break; // Stop at orbs, don't count them
    if (getCellType(rightCell) !== type) break;
    horizontalCount++;
  }
  
  if (horizontalCount >= 3) return true;
  
  // Check vertical match - orbs do NOT count toward match requirements
  let verticalCount = 1;
  // Count up
  for (let r = row - 1; r >= 0; r--) {
    const upCell = grid[r][col];
    if (isOrbCell(upCell)) break; // Stop at orbs, don't count them
    if (getCellType(upCell) !== type) break;
    verticalCount++;
  }
  // Count down
  for (let r = row + 1; r < GRID_SIZE; r++) {
    const downCell = grid[r][col];
    if (isOrbCell(downCell)) break; // Stop at orbs, don't count them
    if (getCellType(downCell) !== type) break;
    verticalCount++;
  }
  
  if (verticalCount >= 3) return true;
  
  return false;
}

function checkAdjacentForOrb(grid, row, col) {
  const adjacentPositions = [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1]
  ];
  
  for (const [r, c] of adjacentPositions) {
    if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
      const adjacentCell = grid[r][c];
      if (adjacentCell) {
        return true;
      }
    }
  }
  
  return false;
}

// Check if the grid has any matches
function hasMatches(grid) {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (isPartOfMatch(grid, row, col)) {
        return true;
      }
    }
  }
  return false;
}

// Find all adjacent cells of the same color (flood fill algorithm)
function findAdjacentSameColor(grid, row, col, targetType, visited) {
  const cellKey = `${row},${col}`;
  
  // Check bounds
  if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
    return;
  }
  
  // Check if already visited
  if (visited.has(cellKey)) {
    return;
  }
  
  // Check if same type
  if (getCellType(grid[row][col]) !== targetType) {
    return;
  }
  
  // Add to visited
  visited.add(cellKey);
  
  // Recursively check all 4 adjacent cells (up, down, left, right)
  findAdjacentSameColor(grid, row - 1, col, targetType, visited);
  findAdjacentSameColor(grid, row + 1, col, targetType, visited);
  findAdjacentSameColor(grid, row, col - 1, targetType, visited);
  findAdjacentSameColor(grid, row, col + 1, targetType, visited);
}

// Check if there are any possible moves on the grid
function hasPossibleMoves(grid) {
  // Check all possible swaps to see if any would create a match
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      // Try swapping with right neighbor
      if (col < GRID_SIZE - 1) {
        // Simulate swap
        const temp = grid[row][col];
        grid[row][col] = grid[row][col + 1];
        grid[row][col + 1] = temp;
        
        // Check if this creates a match
        if (isPartOfMatch(grid, row, col) || isPartOfMatch(grid, row, col + 1)) {
          // Swap back
          grid[row][col + 1] = grid[row][col];
          grid[row][col] = temp;
          return true;
        }
        
        // Swap back
        grid[row][col + 1] = grid[row][col];
        grid[row][col] = temp;
      }
      
      // Try swapping with bottom neighbor
      if (row < GRID_SIZE - 1) {
        // Simulate swap
        const temp = grid[row][col];
        grid[row][col] = grid[row + 1][col];
        grid[row + 1][col] = temp;
        
        // Check if this creates a match
        if (isPartOfMatch(grid, row, col) || isPartOfMatch(grid, row + 1, col)) {
          // Swap back
          grid[row + 1][col] = grid[row][col];
          grid[row][col] = temp;
          return true;
        }
        
        // Swap back
        grid[row + 1][col] = grid[row][col];
        grid[row][col] = temp;
      }
    }
  }
  return false;
}

// Reshuffle the grid when no moves are available
function reshuffleGrid() {
  const grid = window.state.halloweenEvent.swandyCrusher.grid;
  
  if (!window.state.halloweenEvent.swandyCrusher.reshuffleCount) {
    window.state.halloweenEvent.swandyCrusher.reshuffleCount = 0;
  }
  
  window.state.halloweenEvent.swandyCrusher.reshuffleCount++;
  
  const swandies = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      swandies.push(grid[row][col]);
    }
  }
  
  for (let i = swandies.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [swandies[i], swandies[j]] = [swandies[j], swandies[i]];
  }
  
  let index = 0;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      grid[row][col] = swandies[index++];
    }
  }
  
  let reshuffleIterations = 0;
  while (hasMatches(grid) || !hasPossibleMoves(grid)) {
    reshuffleIterations++;
    
    for (let i = swandies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [swandies[i], swandies[j]] = [swandies[j], swandies[i]];
    }
    
    index = 0;
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        grid[row][col] = swandies[index++];
      }
    }
  }
  
  if (window.state.halloweenEvent.swandyCrusher.reshuffleCount >= 2) {
    if (typeof window.unlockSecretAchievement === 'function') {
      window.unlockSecretAchievement('halloween_secret1');
    }
  }
  
  renderSwandyCrusherGrid();
}

// Render the Swandy Crusher grid
function renderSwandyCrusherGrid(animate = false) {
  const container = document.getElementById('swandyCrusherGrid');
  if (!container) return;
  
  const grid = window.state.halloweenEvent.swandyCrusher.grid;
  const hexedPositions = window.state.halloweenEvent.swandyCrusher.hexedPositions || {};
  
  // Remove only swandy cells, not hexagon projectiles
  const existingCells = container.querySelectorAll('.swandy-cell');
  existingCells.forEach(cell => cell.remove());
  
  // Create grid cells
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cell = document.createElement('div');
      cell.className = 'swandy-cell';
      cell.setAttribute('data-row', row);
      cell.setAttribute('data-col', col);
      
      // Add dropping animation if requested
      if (animate) {
        cell.style.animation = `dropIn 0.5s ease-out ${(row * GRID_SIZE + col) * 0.02}s both`;
      }
      
      const cellData = grid[row][col];
      const swandyType = getCellType(cellData);
      const swandyData = swandyTypes.find(s => s.id === swandyType);
      
      if (swandyData) {
        const img = document.createElement('img');
        img.src = swandyData.icon;
        img.alt = `${swandyType} swandy`;
        img.className = 'swandy-icon';
        cell.appendChild(img);
        
        // Check if position is hexed
        const posKey = `${row},${col}`;
        if (hexedPositions[posKey]) {
          cell.classList.add('hexed');
        }
        
        if (isOrbCell(cellData)) {
          cell.classList.add('swandy-orb');
          cell.classList.add(`orb-color-${swandyType}`);
          
          img.src = 'assets/icons/swandy orb.png';
          img.alt = 'swandy orb';
          
          cell.style.boxShadow = `0 0 20px rgba(255,0,0,0.8), 0 0 35px rgba(255,127,0,0.6), 0 0 50px rgba(255,255,0,0.4), 0 0 65px rgba(0,255,0,0.3), 0 0 80px rgba(0,127,255,0.2), 0 0 95px rgba(138,43,226,0.1)`;
          
          const orbGlow = document.createElement('div');
          orbGlow.className = 'orb-glow';
          orbGlow.style.background = `radial-gradient(circle, rgba(255,0,0,0.6) 0%, rgba(255,127,0,0.5) 15%, rgba(255,255,0,0.4) 30%, rgba(0,255,0,0.3) 45%, rgba(0,127,255,0.2) 60%, rgba(138,43,226,0.1) 75%, transparent 100%)`;
          cell.appendChild(orbGlow);
        } else if (isBlasterCell(cellData)) {
          cell.classList.add('swandy-blaster');
          cell.classList.add(`blaster-${cellData.blasterDirection}`);
          cell.classList.add(`blaster-color-${swandyType}`);
          
          cell.style.boxShadow = `0 0 15px ${swandyData.color}, 0 0 25px ${swandyData.color}`;
          
          const arrowContainer = document.createElement('div');
          arrowContainer.className = 'blaster-arrows';
          
          if (cellData.blasterDirection === 'horizontal') {
            arrowContainer.innerHTML = '<span class="arrow-left">←</span><span class="arrow-right">→</span>';
          } else {
            arrowContainer.innerHTML = '<span class="arrow-up">↑</span><span class="arrow-down">↓</span>';
          }
          
          cell.appendChild(arrowContainer);
        }
      }
      
      // Add click handler
      cell.onclick = () => handleCellClick(row, col);
      
      container.appendChild(cell);
    }
  }
  
  // Check for secret achievement: all tiles hexed
  checkAllTilesHexed();
}

// Check if all tiles in the grid are hexed (for secret achievement)
function checkAllTilesHexed() {
  if (!window.state?.halloweenEvent?.swandyCrusher) return;
  
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  const hexedPositions = crusherState.hexedPositions || {};
  
  // Check if hexed tiles feature is unlocked
  if (!isHexedTilesUnlocked()) return;
  
  // Count total hexed tiles
  let hexedCount = 0;
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const posKey = `${row},${col}`;
      if (hexedPositions[posKey]) {
        hexedCount++;
      }
    }
  }
  
  // If all 64 tiles are hexed, unlock the secret achievement
  if (hexedCount === GRID_SIZE * GRID_SIZE) {
    if (typeof window.unlockSecretAchievement === 'function') {
      window.unlockSecretAchievement('halloween_secret4');
    }
  }
}

// Handle cell click for swapping
function handleCellClick(row, col) {
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  
  // Prevent clicks during processing
  if (crusherState.isProcessing) {
    return;
  }
  
  // Check if hex staff is active
  if (crusherState.hexStaff && crusherState.hexStaff.enabled) {
    const handled = handleHexStaffClick(row, col);
    if (handled) return;
  }
  
  if (!crusherState.selectedCell) {
    // First cell selected
    crusherState.selectedCell = { row, col };
    highlightCell(row, col, true);
  } else {
    // Second cell selected - check if adjacent
    const firstCell = crusherState.selectedCell;
    
    if (isAdjacent(firstCell.row, firstCell.col, row, col)) {
      // Swap the cells
      swapCells(firstCell.row, firstCell.col, row, col);
      highlightCell(firstCell.row, firstCell.col, false);
      crusherState.selectedCell = null;
    } else {
      // Not adjacent - select this cell instead
      highlightCell(firstCell.row, firstCell.col, false);
      crusherState.selectedCell = { row, col };
      highlightCell(row, col, true);
    }
  }
}

// Check if two cells are adjacent
function isAdjacent(row1, col1, row2, col2) {
  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);
  
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

// Highlight a cell
function highlightCell(row, col, highlight) {
  const cell = document.querySelector(`.swandy-cell[data-row="${row}"][data-col="${col}"]`);
  if (cell) {
    if (highlight) {
      cell.classList.add('selected');
    } else {
      cell.classList.remove('selected');
    }
  }
}

// Swap two cells
function swapCells(row1, col1, row2, col2) {
  const grid = window.state.halloweenEvent.swandyCrusher.grid;
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  
  // Get the cells for animation
  const cell1 = document.querySelector(`.swandy-cell[data-row="${row1}"][data-col="${col1}"]`);
  const cell2 = document.querySelector(`.swandy-cell[data-row="${row2}"][data-col="${col2}"]`);
  
  if (!cell1 || !cell2) return;
  
  // Get the swandy icons (not the entire cell)
  const icon1 = cell1.querySelector('.swandy-icon');
  const icon2 = cell2.querySelector('.swandy-icon');
  
  if (!icon1 || !icon2) return;
  
  // Calculate the translation needed
  const dx = (col2 - col1) * 60; // 60px is CELL_SIZE
  const dy = (row2 - row1) * 60;
  
  // Add swapping class to icons only
  icon1.classList.add('swapping');
  icon2.classList.add('swapping');
  
  // Force a reflow to ensure the transition is applied
  icon1.offsetHeight;
  icon2.offsetHeight;
  
  // Apply transform to icons only (this way hexed background stays in place)
  requestAnimationFrame(() => {
    icon1.style.transform = `translate(${dx}px, ${dy}px)`;
    icon2.style.transform = `translate(${-dx}px, ${-dy}px)`;
    icon1.style.transition = 'transform 0.3s ease';
    icon2.style.transition = 'transform 0.3s ease';
  });
  
  // Swap in grid
  const temp = grid[row1][col1];
  grid[row1][col1] = grid[row2][col2];
  grid[row2][col2] = temp;
  
  // Wait for animation to complete
  setTimeout(() => {
    // Check if this swap creates a match or activates a blaster
    const cell1Data = grid[row1][col1];
    const cell2Data = grid[row2][col2];
    
    // Special case: Check if swapping with an orb
    const hasOrb = isOrbCell(cell1Data) || isOrbCell(cell2Data);
    
    // Special case: Check if swapping two blasters of the same color
    const isTwoBlastersMerge = isBlasterCell(cell1Data) && isBlasterCell(cell2Data) && 
                               getCellType(cell1Data) === getCellType(cell2Data);
    
    // Check if this swap creates a match (blasters can match with regular swandies)
    const isValidMove = hasOrb || isTwoBlastersMerge || isPartOfMatch(grid, row1, col1) || isPartOfMatch(grid, row2, col2);
    
    if (!isValidMove) {
      // Invalid move - animate swap back smoothly
      setTimeout(() => {
        // Reset transform to animate back to original position
        icon1.style.transform = '';
        icon2.style.transform = '';
        
        // Wait for the return animation to complete
        setTimeout(() => {
          // Swap back in grid
          grid[row2][col2] = grid[row1][col1];
          grid[row1][col1] = temp;
          
          // Remove swapping class
          icon1.classList.remove('swapping');
          icon2.classList.remove('swapping');
          
          // Re-render to show the original positions
          renderSwandyCrusherGrid();
        }, 300);
      }, 100);
      return;
    }
    
    // Valid move - reset combo since this is a player move
    crusherState.combo = 0;
    crusherState.isComboActive = false;
    
    // Remove transform and swapping class
    icon1.style.transform = '';
    icon2.style.transform = '';
    icon1.classList.remove('swapping');
    icon2.classList.remove('swapping');
    
    // Re-render
    renderSwandyCrusherGrid();
    
    // Check if this was an orb swap - manually activate the orb
    if (hasOrb) {
      setTimeout(async () => {
        let orbRow, orbCol, swandyRow, swandyCol, swandyColor;
        
        if (isOrbCell(cell1Data)) {
          orbRow = row1;
          orbCol = col1;
          swandyRow = row2;
          swandyCol = col2;
          swandyColor = getCellType(cell2Data);
        } else {
          orbRow = row2;
          orbCol = col2;
          swandyRow = row1;
          swandyCol = col1;
          swandyColor = getCellType(cell1Data);
        }
        
        // Check if swapped with a blaster
        const swappedWithBlaster = (isOrbCell(cell1Data) && isBlasterCell(cell2Data)) || 
                                   (isOrbCell(cell2Data) && isBlasterCell(cell1Data));
        
        // Check if swapped with another orb
        const swappedWithOrb = isOrbCell(cell1Data) && isOrbCell(cell2Data);
        
        let secondOrbPos = null;
        if (swappedWithOrb) {
          secondOrbPos = { row: swandyRow, col: swandyCol };
        }
        
        const result = await activateOrb(
          grid,
          orbRow,
          orbCol,
          swandyColor,
          false,
          swappedWithBlaster,
          swappedWithOrb,
          secondOrbPos
        );
        
        const matchedCells = result.cellsToRemove;
        
        if (result.totalShards) {
          crusherState.score = crusherState.score.add(result.totalShards);
        }
        
        matchedCells.forEach(cellKey => {
          const [r, c] = cellKey.split(',').map(Number);
          grid[r][c] = null;
        });
        
        const hasAnimations = applyGravity();
        fillEmptyCells();
        renderSwandyCrusherGrid();
        updateSwandyCrusherUI();
        
        const animationDelay = hasAnimations ? 600 : 300;
        
        setTimeout(() => {
          if (hasMatches(grid)) {
            crusherState.isProcessing = true;
            processMatches(false);
          } else {
            crusherState.combo = 0;
            crusherState.isComboActive = false;
            crusherState.isProcessing = false;
       
            
            if (!hasPossibleMoves(grid)) {
              reshuffleGrid();
            }
          }
        }, animationDelay);
      }, 100);
    } else {
      // Check for matches
      setTimeout(() => {
        processMatches(true);
      }, 100);
    }
  }, 300);
}

// Check if blaster feature is unlocked
function isBlasterUnlocked() {
  // Check if the upgrade that unlocks blasters is purchased
  const treeUpgrades = window.state?.halloweenEvent?.treeUpgrades?.purchased || {};
  return treeUpgrades.swandy_blaster === true;
}

// Check if orb feature is unlocked
function isOrbUnlocked() {
  // Check if the upgrade that unlocks orbs is purchased (SH10: ultimate_swandy_orb)
  const treeUpgrades = window.state?.halloweenEvent?.treeUpgrades?.purchased || {};
  return treeUpgrades.ultimate_swandy_orb === true;
}

// Determine if a match should create a blaster (6+ swandies matched)
function shouldCreateBlaster(matchedCells, grid) {
  if (!isBlasterUnlocked()) {
    return false;
  }
  
  const treeUpgrades = window.state.halloweenEvent.treeUpgrades.purchased || {};
  const requiredSize = treeUpgrades.blaster_requirement_5 ? 5 : 6;
  
  if (matchedCells.size < requiredSize) {
    return false;
  }
  
  const cellsArray = Array.from(matchedCells);
  const [firstRow, firstCol] = cellsArray[0].split(',').map(Number);
  const firstColor = getCellType(grid[firstRow][firstCol]);
  
  for (let i = 1; i < cellsArray.length; i++) {
    const [row, col] = cellsArray[i].split(',').map(Number);
    const cellColor = getCellType(grid[row][col]);
    if (cellColor !== firstColor) {
      return false;
    }
  }
  
  return true;
}

// Determine if a match should create an orb (8+ swandies matched, or 7+ with SH11)
function shouldCreateOrb(matchedCells, grid) {
  if (!isOrbUnlocked()) {
    return false;
  }
  
  const treeUpgrades = window.state.halloweenEvent.treeUpgrades.purchased || {};
  const requiredSize = treeUpgrades.orb_requirement_8 ? 7 : 8;
  
  if (matchedCells.size < requiredSize) {
    return false;
  }
  
  const cellsArray = Array.from(matchedCells);
  const [firstRow, firstCol] = cellsArray[0].split(',').map(Number);
  const firstColor = getCellType(grid[firstRow][firstCol]);
  
  for (let i = 1; i < cellsArray.length; i++) {
    const [row, col] = cellsArray[i].split(',').map(Number);
    const cellColor = getCellType(grid[row][col]);
    if (cellColor !== firstColor) {
      return false;
    }
  }
  
  return true;
}

// Determine blaster direction based on match pattern
function getBlasterDirection(matchedCells, grid) {
  const treeUpgrades = window.state.halloweenEvent.treeUpgrades.purchased || {};
  const requiredSize = treeUpgrades.blaster_requirement_5 ? 5 : 6;
  
  if (matchedCells.size < requiredSize) return null;
  
  const cells = Array.from(matchedCells).map(key => {
    const [row, col] = key.split(',').map(Number);
    return { row, col };
  });
  
  // Check if matches are more horizontal or vertical
  const rows = new Set(cells.map(c => c.row));
  const cols = new Set(cells.map(c => c.col));
  
  // More horizontal spread = horizontal blaster, more vertical = vertical blaster
  if (cols.size > rows.size) {
    return 'horizontal';
  } else {
    return 'vertical';
  }
}

// Activate a blaster when matched with same-color swandy
function activateBlaster(grid, blasterRow, blasterCol, matchColor, isChainActivation = false) {
  const blasterCell = grid[blasterRow][blasterCol];
  const cellsToRemove = new Set();
  const chainBlasters = [];
  const orbsHit = [];
  const direction = blasterCell.blasterDirection;
  
  cellsToRemove.add(`${blasterRow},${blasterCol}`);
  
  const gridElement = document.getElementById('swandyCrusherGrid');
  if (gridElement) {
    createBlasterBeam(gridElement, blasterRow, blasterCol, direction);
    
    if (direction === 'horizontal') {
      for (let col = 0; col < GRID_SIZE; col++) {
        const cell = grid[blasterRow][col];
        
        if (col !== blasterCol && isOrbCell(cell)) {
          orbsHit.push({ row: blasterRow, col: col });
        } else {
          cellsToRemove.add(`${blasterRow},${col}`);
        }
        
        const cellElement = gridElement.children[blasterRow * GRID_SIZE + col];
        if (cellElement) {
          cellElement.classList.add('blaster-wipe-horizontal');
        }
        
        if (col !== blasterCol && isBlasterCell(cell)) {
          chainBlasters.push({ row: blasterRow, col: col });
        }
      }
    } else if (direction === 'vertical') {
      for (let row = 0; row < GRID_SIZE; row++) {
        const cell = grid[row][blasterCol];
        
        if (row !== blasterRow && isOrbCell(cell)) {
          orbsHit.push({ row: row, col: blasterCol });
        } else {
          cellsToRemove.add(`${row},${blasterCol}`);
        }
        
        const cellElement = gridElement.children[row * GRID_SIZE + blasterCol];
        if (cellElement) {
          cellElement.classList.add('blaster-wipe-vertical');
        }
        
        if (row !== blasterRow && isBlasterCell(cell)) {
          chainBlasters.push({ row: row, col: blasterCol });
        }
      }
    }
  }
  
  return { cellsToRemove, chainBlasters, orbsHit, isChainActivation };
}

function activateOrb(grid, orbRow, orbCol, matchColor, isChainActivation = false, matchedWithBlaster = false, matchedWithOrb = false, secondOrbPos = null) {
  return new Promise((resolve) => {
    const crusherState = window.state.halloweenEvent.swandyCrusher;
    crusherState.isProcessing = true;

    
    const cellsToRemove = new Set();
    const chainOrbs = [];
    const chainBlasters = [];
    const targetCells = [];
    
    cellsToRemove.add(`${orbRow},${orbCol}`);
    
    const gridElement = document.getElementById('swandyCrusherGrid');
    const orbElement = gridElement?.children[orbRow * GRID_SIZE + orbCol];
    
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const cell = grid[row][col];
        if (!cell) continue;
        
        const cellType = getCellType(cell);
        
        if (cellType === matchColor && (row !== orbRow || col !== orbCol)) {
          targetCells.push({ row, col, cell });
          
          if (!matchedWithBlaster && !matchedWithOrb) {
            cellsToRemove.add(`${row},${col}`);
          }
          
          if (isOrbCell(cell)) {
            chainOrbs.push({ row, col });
          } else if (isBlasterCell(cell)) {
            chainBlasters.push({ row, col });
          }
        }
      }
    }
    
    if (orbElement) {
      orbElement.classList.add('orb-activating');
    }
    
    // Track orb activation for Hex Staff
    if (typeof isHexStaffUnlocked === 'function' && isHexStaffUnlocked()) {
      const hexStaff = crusherState.hexStaff;
      if (hexStaff && hexStaff.orb) {
        hexStaff.orb.progress += 1;
        
        
        // Check if we earned a use
        while (hexStaff.orb.progress >= hexStaff.orb.required && hexStaff.orb.uses < hexStaff.orb.maxUses) {
          hexStaff.orb.progress -= hexStaff.orb.required;
          hexStaff.orb.uses++;
         
        }
        
        // Cap progress at required amount if at max uses
        if (hexStaff.orb.uses >= hexStaff.orb.maxUses) {
          hexStaff.orb.progress = Math.min(hexStaff.orb.progress, hexStaff.orb.required);
        }
      }
    }
    
    if (matchedWithOrb && secondOrbPos) {
      const secondOrbElement = gridElement?.children[secondOrbPos.row * GRID_SIZE + secondOrbPos.col];
      if (secondOrbElement) {
        secondOrbElement.classList.add('orb-activating');
        cellsToRemove.add(`${secondOrbPos.row},${secondOrbPos.col}`);
      }
      
      setTimeout(() => {
        if (orbElement) {
          orbElement.classList.add('orb-exploding');
        }
        if (secondOrbElement) {
          secondOrbElement.classList.add('orb-exploding');
        }
        
        // Unlock secret achievement for matching 2 orbs
        if (typeof window.updateSecretAchievementProgress === 'function') {
          window.updateSecretAchievementProgress('halloween_secret5', 1);
        }
      }, 500);
      
      setTimeout(() => {
        const allSwandies = [];
        
        for (let row = 0; row < GRID_SIZE; row++) {
          for (let col = 0; col < GRID_SIZE; col++) {
            const cell = grid[row][col];
            if (cell && !isOrbCell(cell) && (row !== orbRow || col !== orbCol) && (row !== secondOrbPos.row || col !== secondOrbPos.col)) {
              allSwandies.push({ row, col, cell });
            }
          }
        }
        
        let currentMultiplier = 1.0;
        let totalShards = 0;
        const baseShardValue = 10;
        
        const levelScoreMultiplier = DecimalUtils.isDecimal(crusherState.multipliers.scoreMultiplier)
          ? crusherState.multipliers.scoreMultiplier.toNumber()
          : (crusherState.multipliers.scoreMultiplier || 1);
        
        let shardsUpgradeMultiplier = 1;
        const treeUpgrades = window.state.halloweenEvent.treeUpgrades.purchased || {};
        if (treeUpgrades.shards_multi) {
          const sh1Multiplier = typeof getUpgradeHexMultiplier === 'function' 
            ? getUpgradeHexMultiplier('shards_multi') 
            : 1.5;
          shardsUpgradeMultiplier *= sh1Multiplier;
        }
        if (treeUpgrades.shards_multi_2) shardsUpgradeMultiplier *= 1.25;
        if (treeUpgrades.need_more_shards) shardsUpgradeMultiplier *= 1.49;
        if (treeUpgrades.excuse_me_price_increase) shardsUpgradeMultiplier *= 2.5;
        if (treeUpgrades.recovering_from_hexion) shardsUpgradeMultiplier *= 2.5;
        if (treeUpgrades.just_out_of_reach) shardsUpgradeMultiplier *= 1.5;
        if (treeUpgrades.something_in_distance) shardsUpgradeMultiplier *= 1.5;
        if (treeUpgrades.wooden_building) shardsUpgradeMultiplier *= 1.75;
        if (treeUpgrades.someone_inside) shardsUpgradeMultiplier *= 1.5;
        if (treeUpgrades.little_bit_more_shards) shardsUpgradeMultiplier *= 5;
        if (treeUpgrades.devilish_swandy) {
          const s6Multiplier = typeof getUpgradeHexMultiplier === 'function' 
            ? getUpgradeHexMultiplier('devilish_swandy') 
            : 1.666;
          shardsUpgradeMultiplier *= s6Multiplier;
        }
        if (treeUpgrades.less_devilish_swandy) {
          const s7Multiplier = typeof getUpgradeHexMultiplier === 'function' 
            ? getUpgradeHexMultiplier('less_devilish_swandy') 
            : 1.333;
          shardsUpgradeMultiplier *= s7Multiplier;
        }
        
        const shatteryShardsMultiplier = DecimalUtils.isDecimal(crusherState.resety.shardsMultiplier)
          ? crusherState.resety.shardsMultiplier.toNumber()
          : (crusherState.resety.shardsMultiplier || 1);
        
        let expansionShardMultiplier = 1;
        if (treeUpgrades.expansion_shard_boost) {
          const currentGrade = DecimalUtils.isDecimal(window.state.grade) ? window.state.grade.toNumber() : (window.state.grade || 1);
          expansionShardMultiplier = 1 + (currentGrade - 1) * 0.25;
        }
        
        const swandyBoostMultiplier = getSwandyShardBoostMultiplier();
        const treeAgeBoostMultiplier = getTreeAgeShardBoostMultiplier();
        const hexedShardBoostMultiplier = getHexedSwandyShardBoostMultiplier();
        
        function hitSwandyWithShockwave(index) {
          if (index >= allSwandies.length) {
            setTimeout(() => {
              if (orbElement) {
                orbElement.classList.remove('orb-activating', 'orb-exploding');
              }
              if (secondOrbElement) {
                secondOrbElement.classList.remove('orb-activating', 'orb-exploding');
              }
              
              allSwandies.forEach(swandy => {
                cellsToRemove.add(`${swandy.row},${swandy.col}`);
              });
              
              resolve({ cellsToRemove, chainOrbs: [], chainBlasters: [], isChainActivation, totalShards });
            }, 200);
            return;
          }
          
          const swandy = allSwandies[index];
          const swandyElement = gridElement?.children[swandy.row * GRID_SIZE + swandy.col];
          
          if (gridElement && swandyElement) {
            createShockwaveEffect(gridElement, orbRow, orbCol, swandy.row, swandy.col);
            if (secondOrbPos) {
              createShockwaveEffect(gridElement, secondOrbPos.row, secondOrbPos.col, swandy.row, swandy.col);
            }
          }
          
          currentMultiplier *= 1.1;
          
          // Check if this swandy is on a hexed tile
          const crusherState = window.state.halloweenEvent.swandyCrusher;
          const hexedPositions = crusherState.hexedPositions || {};
          const posKey = `${swandy.row},${swandy.col}`;
          const isHexed = hexedPositions[posKey];
          const hexedMultiplier = isHexed ? 5 : 1;
          
          const shardsForThisSwandy = baseShardValue * currentMultiplier * levelScoreMultiplier * shardsUpgradeMultiplier * shatteryShardsMultiplier * expansionShardMultiplier * swandyBoostMultiplier * treeAgeBoostMultiplier * hexedShardBoostMultiplier * hexedMultiplier;
          totalShards += shardsForThisSwandy;
          
          if (swandyElement) {
            swandyElement.classList.add('shockwave-hit');
            showScorePopup(swandy.row, swandy.col, shardsForThisSwandy);
            
            setTimeout(() => {
              swandyElement.classList.add('orb-wipe');
            }, 100);
          }
          
          setTimeout(() => hitSwandyWithShockwave(index + 1), 80);
        }
        
        hitSwandyWithShockwave(0);
      }, 1000);
      
    } else if (matchedWithBlaster) {
      const createdBlasters = [];
      
      function shootLaserToConvert(index) {
        if (index >= targetCells.length) {
          setTimeout(() => {
            if (orbElement) {
              orbElement.classList.remove('orb-activating');
            }
            
            activateBlasterChain(createdBlasters, 0, grid, gridElement).then((totalShards) => {
              resolve({ cellsToRemove, chainOrbs, chainBlasters, isChainActivation, totalShards });
            });
          }, 200);
          return;
        }
        
        const target = targetCells[index];
        const targetElement = gridElement?.children[target.row * GRID_SIZE + target.col];
        
        if (gridElement && orbElement && targetElement) {
          createOrbLaser(gridElement, orbRow, orbCol, target.row, target.col);
        }
        
        if (targetElement) {
          targetElement.classList.add('orb-laser-hit');
          
          setTimeout(() => {
            const isAlreadyBlaster = isBlasterCell(target.cell);
            
            if (!isAlreadyBlaster) {
              const randomDirection = Math.random() < 0.5 ? 'horizontal' : 'vertical';
              grid[target.row][target.col] = createSwandyCell(matchColor, true, randomDirection);
              createdBlasters.push({ row: target.row, col: target.col, direction: randomDirection });
              
              targetElement.classList.add('converting-to-blaster');
              renderSwandyCrusherGrid();
            }
          }, 100);
        }
        
        setTimeout(() => shootLaserToConvert(index + 1), 150);
      }
      
      setTimeout(() => shootLaserToConvert(0), 500);
      
    } else {
      let currentMultiplier = 1.0;
      let totalShards = 0;
      const baseShardValue = 10;
      
      const levelScoreMultiplier = DecimalUtils.isDecimal(crusherState.multipliers.scoreMultiplier)
        ? crusherState.multipliers.scoreMultiplier.toNumber()
        : (crusherState.multipliers.scoreMultiplier || 1);
      
      let shardsUpgradeMultiplier = 1;
      const treeUpgrades = window.state.halloweenEvent.treeUpgrades.purchased || {};
      if (treeUpgrades.shards_multi) {
        const sh1Multiplier = typeof getUpgradeHexMultiplier === 'function' 
          ? getUpgradeHexMultiplier('shards_multi') 
          : 1.5;
        shardsUpgradeMultiplier *= sh1Multiplier;
      }
      if (treeUpgrades.shards_multi_2) shardsUpgradeMultiplier *= 1.25;
      if (treeUpgrades.need_more_shards) shardsUpgradeMultiplier *= 1.49;
      if (treeUpgrades.excuse_me_price_increase) shardsUpgradeMultiplier *= 2.5;
      if (treeUpgrades.recovering_from_hexion) shardsUpgradeMultiplier *= 2.5;
      if (treeUpgrades.just_out_of_reach) shardsUpgradeMultiplier *= 1.5;
      if (treeUpgrades.something_in_distance) shardsUpgradeMultiplier *= 1.5;
      if (treeUpgrades.wooden_building) shardsUpgradeMultiplier *= 1.75;
      if (treeUpgrades.someone_inside) shardsUpgradeMultiplier *= 1.5;
      if (treeUpgrades.little_bit_more_shards) shardsUpgradeMultiplier *= 5;
      if (treeUpgrades.devilish_swandy) {
        const s6Multiplier = typeof getUpgradeHexMultiplier === 'function' 
          ? getUpgradeHexMultiplier('devilish_swandy') 
          : 1.666;
        shardsUpgradeMultiplier *= s6Multiplier;
      }
      if (treeUpgrades.less_devilish_swandy) {
        const s7Multiplier = typeof getUpgradeHexMultiplier === 'function' 
          ? getUpgradeHexMultiplier('less_devilish_swandy') 
          : 1.333;
        shardsUpgradeMultiplier *= s7Multiplier;
      }
      
      const shatteryShardsMultiplier = DecimalUtils.isDecimal(crusherState.resety.shardsMultiplier)
        ? crusherState.resety.shardsMultiplier.toNumber()
        : (crusherState.resety.shardsMultiplier || 1);
      
      let expansionShardMultiplier = 1;
      if (treeUpgrades.expansion_shard_boost) {
        const currentGrade = DecimalUtils.isDecimal(window.state.grade) ? window.state.grade.toNumber() : (window.state.grade || 1);
        expansionShardMultiplier = 1 + (currentGrade - 1) * 0.25;
      }
      
      const swandyBoostMultiplier = getSwandyShardBoostMultiplier();
      const treeAgeBoostMultiplier = getTreeAgeShardBoostMultiplier();
      const hexedShardBoostMultiplier = getHexedSwandyShardBoostMultiplier();
      
      function shootLaserAtTarget(index) {
        if (index >= targetCells.length) {
          setTimeout(() => {
            if (orbElement) {
              orbElement.classList.remove('orb-activating');
            }
            resolve({ cellsToRemove, chainOrbs, chainBlasters, isChainActivation, totalShards });
          }, 200);
          return;
        }
        
        const target = targetCells[index];
        const targetElement = gridElement?.children[target.row * GRID_SIZE + target.col];
        
        if (gridElement && orbElement && targetElement) {
          createOrbLaser(gridElement, orbRow, orbCol, target.row, target.col);
        }
        
        currentMultiplier *= 1.3;
        const shardsForThisSwandy = baseShardValue * currentMultiplier * levelScoreMultiplier * shardsUpgradeMultiplier * shatteryShardsMultiplier * expansionShardMultiplier * swandyBoostMultiplier * treeAgeBoostMultiplier * hexedShardBoostMultiplier;
        totalShards += shardsForThisSwandy;
        
        if (targetElement) {
          targetElement.classList.add('orb-laser-hit');
          showScorePopup(target.row, target.col, shardsForThisSwandy);
          
          setTimeout(() => {
            targetElement.classList.add('orb-wipe');
          }, 100);
        }
        
        setTimeout(() => shootLaserAtTarget(index + 1), 150);
      }
      
      setTimeout(() => shootLaserAtTarget(0), 500);
    }
  });
}

function activateBlasterChain(blasters, index, grid, gridElement, currentMultiplier = 1.0) {
  return new Promise((resolve) => {
    if (index >= blasters.length) {
      resolve(0);
      return;
    }
    
    const blaster = blasters[index];
    const blasterCell = grid[blaster.row][blaster.col];
    const matchColor = getCellType(blasterCell);
    const direction = blaster.direction;
    
    const affectedCells = new Set();
    
    createBlasterBeam(gridElement, blaster.row, blaster.col, direction);
    
    if (direction === 'horizontal') {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[blaster.row][col]) {
          affectedCells.add(`${blaster.row},${col}`);
          const cellElement = gridElement?.children[blaster.row * GRID_SIZE + col];
          if (cellElement) {
            cellElement.classList.add('blaster-wipe-horizontal');
          }
        }
      }
    } else {
      for (let row = 0; row < GRID_SIZE; row++) {
        if (grid[row][blaster.col]) {
          affectedCells.add(`${row},${blaster.col}`);
          const cellElement = gridElement?.children[row * GRID_SIZE + blaster.col];
          if (cellElement) {
            cellElement.classList.add('blaster-wipe-vertical');
          }
        }
      }
    }
    
    const crusherState = window.state.halloweenEvent.swandyCrusher;
    const baseShardValue = 10;
    let blasterMultiplier = currentMultiplier;
    let totalShards = 0;
    
    const levelScoreMultiplier = DecimalUtils.isDecimal(crusherState.multipliers.scoreMultiplier)
      ? crusherState.multipliers.scoreMultiplier.toNumber()
      : (crusherState.multipliers.scoreMultiplier || 1);
    
    let shardsUpgradeMultiplier = 1;
    const treeUpgrades = window.state.halloweenEvent.treeUpgrades.purchased || {};
    if (treeUpgrades.shards_multi) {
      const sh1Multiplier = typeof getUpgradeHexMultiplier === 'function' 
        ? getUpgradeHexMultiplier('shards_multi') 
        : 1.5;
      shardsUpgradeMultiplier *= sh1Multiplier;
    }
    if (treeUpgrades.shards_multi_2) shardsUpgradeMultiplier *= 1.25;
    if (treeUpgrades.need_more_shards) shardsUpgradeMultiplier *= 1.49;
    if (treeUpgrades.excuse_me_price_increase) shardsUpgradeMultiplier *= 2.5;
    if (treeUpgrades.recovering_from_hexion) shardsUpgradeMultiplier *= 2.5;
    if (treeUpgrades.just_out_of_reach) shardsUpgradeMultiplier *= 1.5;
    if (treeUpgrades.something_in_distance) shardsUpgradeMultiplier *= 1.5;
    if (treeUpgrades.wooden_building) shardsUpgradeMultiplier *= 1.75;
    if (treeUpgrades.someone_inside) shardsUpgradeMultiplier *= 1.5;
    if (treeUpgrades.little_bit_more_shards) shardsUpgradeMultiplier *= 5;
    if (treeUpgrades.devilish_swandy) {
      const s6Multiplier = typeof getUpgradeHexMultiplier === 'function' 
        ? getUpgradeHexMultiplier('devilish_swandy') 
        : 1.666;
      shardsUpgradeMultiplier *= s6Multiplier;
    }
    if (treeUpgrades.less_devilish_swandy) {
      const s7Multiplier = typeof getUpgradeHexMultiplier === 'function' 
        ? getUpgradeHexMultiplier('less_devilish_swandy') 
        : 1.333;
      shardsUpgradeMultiplier *= s7Multiplier;
    }
    
    const shatteryShardsMultiplier = DecimalUtils.isDecimal(crusherState.resety.shardsMultiplier)
      ? crusherState.resety.shardsMultiplier.toNumber()
      : (crusherState.resety.shardsMultiplier || 1);
    
    let expansionShardMultiplier = 1;
    if (treeUpgrades.expansion_shard_boost) {
      const currentGrade = DecimalUtils.isDecimal(window.state.grade) ? window.state.grade.toNumber() : (window.state.grade || 1);
      expansionShardMultiplier = 1 + (currentGrade - 1) * 0.25;
    }
    
    const swandyBoostMultiplier = getSwandyShardBoostMultiplier();
    const treeAgeBoostMultiplier = getTreeAgeShardBoostMultiplier();
    
    affectedCells.forEach(cellKey => {
      const [row, col] = cellKey.split(',').map(Number);
      blasterMultiplier *= 1.1;
      const shardsForThisSwandy = baseShardValue * blasterMultiplier * levelScoreMultiplier * shardsUpgradeMultiplier * shatteryShardsMultiplier * expansionShardMultiplier * swandyBoostMultiplier * treeAgeBoostMultiplier;
      totalShards += shardsForThisSwandy;
      
      showScorePopup(row, col, shardsForThisSwandy);
      grid[row][col] = null;
    });
    
    crusherState.score = crusherState.score.add(totalShards);
    
    setTimeout(() => {
      activateBlasterChain(blasters, index + 1, grid, gridElement, blasterMultiplier).then((remainingShards) => {
        resolve(totalShards + remainingShards);
      });
    }, 400);
  });
}

// Create visual beam effect for blaster
function createBlasterBeam(gridElement, row, col, direction) {
  const beam = document.createElement('div');
  beam.className = `blaster-beam blaster-beam-${direction}`;
  
  const cellSize = 60;
  const gap = 5;
  const padding = 15;
  beam.style.position = 'absolute';
  beam.style.zIndex = '50';
  beam.style.pointerEvents = 'none';
  
  if (direction === 'horizontal') {
    const rowTop = padding + (row * (cellSize + gap));
    beam.style.top = `${rowTop + cellSize / 2}px`;
    beam.style.left = `${padding}px`;
    beam.style.width = `${GRID_SIZE * cellSize + (GRID_SIZE - 1) * gap}px`;
    beam.style.height = `${cellSize}px`;
    beam.style.transform = 'translateY(-50%)';
  } else {
    const colLeft = padding + (col * (cellSize + gap));
    beam.style.left = `${colLeft + cellSize / 2}px`;
    beam.style.top = `${padding}px`;
    beam.style.width = `${cellSize}px`;
    beam.style.height = `${GRID_SIZE * cellSize + (GRID_SIZE - 1) * gap}px`;
    beam.style.transform = 'translateX(-50%)';
  }
  
  gridElement.style.position = 'relative';
  gridElement.appendChild(beam);
  
  setTimeout(() => {
    beam.remove();
  }, 500);
}

function createOrbExplosion(gridElement, row, col) {
  const explosion = document.createElement('div');
  explosion.className = 'orb-explosion';
  
  const cellSize = 60;
  const gap = 5;
  const padding = 15;
  
  const centerX = padding + (col * (cellSize + gap)) + cellSize / 2;
  const centerY = padding + (row * (cellSize + gap)) + cellSize / 2;
  
  explosion.style.position = 'absolute';
  explosion.style.left = `${centerX}px`;
  explosion.style.top = `${centerY}px`;
  explosion.style.width = '0';
  explosion.style.height = '0';
  explosion.style.borderRadius = '50%';
  explosion.style.background = 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,200,0,0.6) 50%, rgba(255,100,0,0) 100%)';
  explosion.style.transform = 'translate(-50%, -50%)';
  explosion.style.zIndex = '100';
  explosion.style.pointerEvents = 'none';
  explosion.style.animation = 'orbExplosion 0.6s ease-out';
  
  gridElement.style.position = 'relative';
  gridElement.appendChild(explosion);
  
  setTimeout(() => {
    explosion.remove();
  }, 600);
}

function createOrbLaser(gridElement, fromRow, fromCol, toRow, toCol) {
  // Get the actual cell elements
  const fromCell = gridElement.children[fromRow * GRID_SIZE + fromCol];
  const toCell = gridElement.children[toRow * GRID_SIZE + toCol];
  
  if (!fromCell || !toCell) {
    return;
  }
  
  // Get bounding rectangles
  const gridRect = gridElement.getBoundingClientRect();
  const fromRect = fromCell.getBoundingClientRect();
  const toRect = toCell.getBoundingClientRect();
  
  // Calculate center positions relative to grid
  const fromX = fromRect.left - gridRect.left + fromRect.width / 2;
  const fromY = fromRect.top - gridRect.top + fromRect.height / 2;
  const toX = toRect.left - gridRect.left + toRect.width / 2;
  const toY = toRect.top - gridRect.top + toRect.height / 2;
  
  // Calculate distance and angle
  const deltaX = toX - fromX;
  const deltaY = toY - fromY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  
  const laser = document.createElement('div');
  laser.className = 'orb-laser';
  laser.style.position = 'absolute';
  laser.style.left = `${fromX}px`;
  laser.style.top = `${fromY}px`;
  laser.style.width = `${distance}px`;
  laser.style.height = '4px';
  laser.style.background = 'linear-gradient(90deg, rgba(255,0,0,0.9), rgba(255,127,0,0.9), rgba(255,255,0,0.9), rgba(0,255,0,0.9), rgba(0,127,255,0.9), rgba(138,43,226,0.9))';
  laser.style.transformOrigin = '0 50%';
  laser.style.transform = `rotate(${angle}deg)`;
  laser.style.boxShadow = '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.5)';
  laser.style.zIndex = '99';
  laser.style.pointerEvents = 'none';
  laser.style.transition = 'none';
  
  // Ensure parent has position relative
  if (!gridElement.style.position || gridElement.style.position === 'static') {
    gridElement.style.position = 'relative';
  }
  
  gridElement.appendChild(laser);
  
  setTimeout(() => {
    laser.remove();
  }, 300);
}

function createShockwaveEffect(gridElement, fromRow, fromCol, toRow, toCol) {
  const cellSize = 60;
  const gap = 5;
  const padding = 15;
  
  const fromX = padding + (fromCol * (cellSize + gap)) + cellSize / 2;
  const fromY = padding + (fromRow * (cellSize + gap)) + cellSize / 2;
  const toX = padding + (toCol * (cellSize + gap)) + cellSize / 2;
  const toY = padding + (toRow * (cellSize + gap)) + cellSize / 2;
  
  const shockwave = document.createElement('div');
  shockwave.className = 'orb-shockwave';
  shockwave.style.position = 'absolute';
  shockwave.style.left = `${fromX}px`;
  shockwave.style.top = `${fromY}px`;
  shockwave.style.width = '0px';
  shockwave.style.height = '0px';
  shockwave.style.border = '3px solid rgba(255,255,255,0.9)';
  shockwave.style.borderRadius = '50%';
  shockwave.style.transform = 'translate(-50%, -50%)';
  shockwave.style.boxShadow = '0 0 20px rgba(255,255,255,0.8), inset 0 0 20px rgba(255,255,255,0.5)';
  shockwave.style.zIndex = '98';
  shockwave.style.pointerEvents = 'none';
  
  gridElement.style.position = 'relative';
  gridElement.appendChild(shockwave);
  
  const deltaX = toX - fromX;
  const deltaY = toY - fromY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  setTimeout(() => {
    shockwave.style.width = `${distance * 2}px`;
    shockwave.style.height = `${distance * 2}px`;
    shockwave.style.opacity = '0';
    shockwave.style.transition = 'all 0.5s ease-out';
  }, 10);
  
  setTimeout(() => {
    shockwave.remove();
  }, 520);
}

// Activate double blaster for 3 row and 3 column wipe
function activateDoubleBlaster(grid, blaster1Row, blaster1Col, blaster2Row, blaster2Col) {
  const cellsToRemove = new Set();
  const chainBlasters = []; // Track blasters hit by this wipe for chain reaction
  
  // Determine the center point between the two blasters
  const centerRow = Math.round((blaster1Row + blaster1Col) / 2);
  const centerCol = Math.round((blaster2Col + blaster2Col) / 2);
  
  // Apply animation to cells
  const gridElement = document.getElementById('swandyCrusherGrid');
  
  // Create 3 horizontal beams (for 3 rows)
  if (gridElement) {
    // Center row beam
    createBlasterBeam(gridElement, blaster1Row, blaster1Col, 'horizontal');
    // Row above
    if (blaster1Row - 1 >= 0) {
      createBlasterBeam(gridElement, blaster1Row - 1, blaster1Col, 'horizontal');
    }
    // Row below
    if (blaster1Row + 1 < GRID_SIZE) {
      createBlasterBeam(gridElement, blaster1Row + 1, blaster1Col, 'horizontal');
    }
    
    // Create 3 vertical beams (for 3 columns)
    // Center column beam
    createBlasterBeam(gridElement, blaster2Row, blaster2Col, 'vertical');
    // Column to the left
    if (blaster2Col - 1 >= 0) {
      createBlasterBeam(gridElement, blaster2Row, blaster2Col - 1, 'vertical');
    }
    // Column to the right
    if (blaster2Col + 1 < GRID_SIZE) {
      createBlasterBeam(gridElement, blaster2Row, blaster2Col + 1, 'vertical');
    }
  }
  
  // Remove 3 entire rows centered on blaster1
  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    const row = blaster1Row + rowOffset;
    if (row >= 0 && row < GRID_SIZE) {
      for (let col = 0; col < GRID_SIZE; col++) {
        cellsToRemove.add(`${row},${col}`);
        
        // Check for other blasters in these rows (excluding the original two blasters)
        if ((row !== blaster1Row || col !== blaster1Col) && 
            (row !== blaster2Row || col !== blaster2Col) && 
            isBlasterCell(grid[row][col])) {
          chainBlasters.push({ row: row, col: col });
        }
      }
    }
  }
  
  // Remove 3 entire columns centered on blaster2
  for (let colOffset = -1; colOffset <= 1; colOffset++) {
    const col = blaster2Col + colOffset;
    if (col >= 0 && col < GRID_SIZE) {
      for (let row = 0; row < GRID_SIZE; row++) {
        cellsToRemove.add(`${row},${col}`);
        
        // Check for other blasters in these columns (excluding the original two blasters)
        if ((row !== blaster1Row || col !== blaster1Col) && 
            (row !== blaster2Row || col !== blaster2Col) && 
            isBlasterCell(grid[row][col])) {
          const blasterKey = `${row},${col}`;
          // Only add if not already in chainBlasters
          if (!chainBlasters.some(b => b.row === row && b.col === col)) {
            chainBlasters.push({ row: row, col: col });
          }
        }
      }
    }
  }
  
  // Add both blasters themselves
  cellsToRemove.add(`${blaster1Row},${blaster1Col}`);
  cellsToRemove.add(`${blaster2Row},${blaster2Col}`);
  
  return { cellsToRemove, chainBlasters };
}

// Process matches and update score
function processMatches(isPlayerMove = false) {
  const grid = window.state.halloweenEvent.swandyCrusher.grid;
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  let matchFound = false;
  const matchedCells = new Set();
  
  if (isPlayerMove && crusherState.reshuffleCount) {
    crusherState.reshuffleCount = 0;
  }
  
  let blasterActivated = false;
  let isDoubleBlaster = false;
  let hasChainBlasters = false;
  let blasterCellsToRemove = new Set();
  
  // First, check for adjacent same-color blasters (merge priority - only on player moves)
  if (isPlayerMove) {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const cell = grid[row][col];
        if (isBlasterCell(cell)) {
          const cellColor = getCellType(cell);
          
          // Check right neighbor
          if (col < GRID_SIZE - 1) {
            const rightCell = grid[row][col + 1];
            if (isBlasterCell(rightCell) && getCellType(rightCell) === cellColor) {
              // Found two adjacent same-color blasters!
              matchFound = true;
              blasterActivated = true;
              isDoubleBlaster = true; // Mark as double blaster
              matchedCells.add(`${row},${col}`);
              matchedCells.add(`${row},${col + 1}`);
              const result = activateDoubleBlaster(grid, row, col, row, col + 1);
              result.cellsToRemove.forEach(cell => matchedCells.add(cell));
              
              // Process chain blasters from double blaster
              if (result.chainBlasters.length > 0) {
                hasChainBlasters = true;
                const processedBlasters = new Set([`${row},${col}`, `${row},${col + 1}`]);
                const blastersToProcess = [...result.chainBlasters];
                
                while (blastersToProcess.length > 0) {
                  const blaster = blastersToProcess.shift();
                  const blasterKey = `${blaster.row},${blaster.col}`;
                  
                  if (processedBlasters.has(blasterKey)) continue;
                  processedBlasters.add(blasterKey);
                  
                  const chainResult = activateBlaster(
                    grid,
                    blaster.row,
                    blaster.col,
                    getCellType(grid[blaster.row][blaster.col]),
                    true
                  );
                  
                  chainResult.cellsToRemove.forEach(cell => matchedCells.add(cell));
                  
                  chainResult.chainBlasters.forEach(chainBlaster => {
                    const chainKey = `${chainBlaster.row},${chainBlaster.col}`;
                    if (!processedBlasters.has(chainKey)) {
                      blastersToProcess.push(chainBlaster);
                    }
                  });
                }
              }
            }
          }
          
          // Check bottom neighbor
          if (row < GRID_SIZE - 1) {
            const bottomCell = grid[row + 1][col];
            if (isBlasterCell(bottomCell) && getCellType(bottomCell) === cellColor) {
              // Found two adjacent same-color blasters!
              matchFound = true;
              blasterActivated = true;
              isDoubleBlaster = true; // Mark as double blaster
              matchedCells.add(`${row},${col}`);
              matchedCells.add(`${row + 1},${col}`);
              const result = activateDoubleBlaster(grid, row, col, row + 1, col);
              result.cellsToRemove.forEach(cell => matchedCells.add(cell));
              
              // Process chain blasters from double blaster
              if (result.chainBlasters.length > 0) {
                hasChainBlasters = true;
                const processedBlasters = new Set([`${row},${col}`, `${row + 1},${col}`]);
                const blastersToProcess = [...result.chainBlasters];
                
                while (blastersToProcess.length > 0) {
                  const blaster = blastersToProcess.shift();
                  const blasterKey = `${blaster.row},${blaster.col}`;
                  
                  if (processedBlasters.has(blasterKey)) continue;
                  processedBlasters.add(blasterKey);
                  
                  const chainResult = activateBlaster(
                    grid,
                    blaster.row,
                    blaster.col,
                    getCellType(grid[blaster.row][blaster.col]),
                    true
                  );
                  
                  chainResult.cellsToRemove.forEach(cell => matchedCells.add(cell));
                  
                  chainResult.chainBlasters.forEach(chainBlaster => {
                    const chainKey = `${chainBlaster.row},${chainBlaster.col}`;
                    if (!processedBlasters.has(chainKey)) {
                      blastersToProcess.push(chainBlaster);
                    }
                  });
                }
              }
            }
          }
        }
      }
    }
  }
  
  // If double blaster was triggered, skip regular match detection
  if (blasterActivated) {
    // Jump directly to scoring and removal
  } else {
    // Find all regular matches
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cell = grid[row][col];
      
      if (!isPlayerMove && isOrbCell(cell)) {
        continue;
      }
      
      if (isPartOfMatch(grid, row, col)) {
        matchFound = true;
        matchedCells.add(`${row},${col}`);
        
        const type = getCellType(cell);
        
        // Horizontal
        for (let c = col - 1; c >= 0; c--) {
          const leftCell = grid[row][c];
          if (isOrbCell(leftCell) && !isPlayerMove) break;
          if (getCellType(leftCell) !== type) break;
          matchedCells.add(`${row},${c}`);
        }
        for (let c = col + 1; c < GRID_SIZE; c++) {
          const rightCell = grid[row][c];
          if (isOrbCell(rightCell) && !isPlayerMove) break;
          if (getCellType(rightCell) !== type) break;
          matchedCells.add(`${row},${c}`);
        }
        
        // Vertical
        for (let r = row - 1; r >= 0; r--) {
          const upCell = grid[r][col];
          if (isOrbCell(upCell) && !isPlayerMove) break;
          if (getCellType(upCell) !== type) break;
          matchedCells.add(`${r},${col}`);
        }
        for (let r = row + 1; r < GRID_SIZE; r++) {
          const downCell = grid[r][col];
          if (isOrbCell(downCell) && !isPlayerMove) break;
          if (getCellType(downCell) !== type) break;
          matchedCells.add(`${r},${col}`);
        }
      }
    }
  }
  } // Close the else block for regular match detection
  
  // Check if any matched cells contain an orb or blaster (prioritize orb)
  let orbsInMatch = [];
  let blastersInMatch = [];
  
  if (matchFound && !blasterActivated) {
    matchedCells.forEach(cellKey => {
      const [row, col] = cellKey.split(',').map(Number);
      const cell = grid[row][col];
      if (isOrbCell(cell)) {
        orbsInMatch.push({ row, col, cell: cell });
      } else if (isBlasterCell(cell)) {
        blastersInMatch.push({ row, col, cell: cell });
      }
    });
    
   
    
    if (orbsInMatch.length > 0 && isPlayerMove) {
   
      blasterActivated = true;
      
      const hasBlasterInMatch = blastersInMatch.length > 0;
      const hasMultipleOrbs = orbsInMatch.length >= 2;
      
      (async () => {
        const processedOrbs = new Set();
        const orbsToProcess = [...orbsInMatch];
        let totalOrbShards = 0;
        
        while (orbsToProcess.length > 0) {
          const orb = orbsToProcess.shift();
          const orbKey = `${orb.row},${orb.col}`;
          
          if (processedOrbs.has(orbKey)) continue;
          
          const isChain = processedOrbs.size > 0;
          processedOrbs.add(orbKey);
          
          let secondOrbPos = null;
          if (hasMultipleOrbs && orbsToProcess.length > 0 && !isChain) {
            const secondOrb = orbsToProcess.shift();
            secondOrbPos = { row: secondOrb.row, col: secondOrb.col };
            processedOrbs.add(`${secondOrb.row},${secondOrb.col}`);
          }
          
          const result = await activateOrb(
            grid,
            orb.row,
            orb.col,
            getCellType(orb.cell),
            isChain,
            hasBlasterInMatch && !secondOrbPos,
            !!secondOrbPos,
            secondOrbPos
          );
          
          if (isChain) hasChainBlasters = true;
          
          totalOrbShards += result.totalShards || 0;
          
          result.cellsToRemove.forEach(cell => matchedCells.add(cell));
          
          result.chainOrbs.forEach(chainOrb => {
            const chainKey = `${chainOrb.row},${chainOrb.col}`;
            if (!processedOrbs.has(chainKey)) {
              orbsToProcess.push(chainOrb);
            }
          });
          
          result.chainBlasters.forEach(chainBlaster => {
            const chainKey = `${chainBlaster.row},${chainBlaster.col}`;
            matchedCells.add(chainKey);
          });
        }
        
        crusherState.score = crusherState.score.add(totalOrbShards);
        
        matchedCells.forEach(cellKey => {
          const [row, col] = cellKey.split(',').map(Number);
          grid[row][col] = null;
        });
        
        const hasAnimations = applyGravity();
        fillEmptyCells();
        renderSwandyCrusherGrid();
        updateSwandyCrusherUI();
        
        const animationDelay = hasAnimations ? 600 : 300;
        
        setTimeout(() => {
          if (hasMatches(grid)) {
            crusherState.isProcessing = true;
            processMatches(false);
          } else {
            crusherState.combo = 0;
            crusherState.isComboActive = false;
            crusherState.isProcessing = false;            
            if (!hasPossibleMoves(grid)) {
              reshuffleGrid();
            }
          }
        }, animationDelay);
      })();
      
      return;
    } else if (blastersInMatch.length >= 2) {
      // Check if both blasters are same color for double activation
      const sameColor = blastersInMatch.every(b => getCellType(b.cell) === getCellType(blastersInMatch[0].cell));
      
      if (sameColor) {
        // Double blaster activation!
        blasterActivated = true;
        isDoubleBlaster = true; // Mark as double blaster
        const result = activateDoubleBlaster(
          grid, 
          blastersInMatch[0].row, blastersInMatch[0].col,
          blastersInMatch[1].row, blastersInMatch[1].col
        );
        // Add blaster wipe cells to the matched cells
        result.cellsToRemove.forEach(cell => matchedCells.add(cell));
        
        // Process chain blasters from double blaster
        if (result.chainBlasters.length > 0) {
          hasChainBlasters = true;
          const processedBlasters = new Set([
            `${blastersInMatch[0].row},${blastersInMatch[0].col}`,
            `${blastersInMatch[1].row},${blastersInMatch[1].col}`
          ]);
          const blastersToProcess = [...result.chainBlasters];
          
          while (blastersToProcess.length > 0) {
            const blaster = blastersToProcess.shift();
            const blasterKey = `${blaster.row},${blaster.col}`;
            
            if (processedBlasters.has(blasterKey)) continue;
            processedBlasters.add(blasterKey);
            
            const chainResult = activateBlaster(
              grid,
              blaster.row,
              blaster.col,
              getCellType(grid[blaster.row][blaster.col]),
              true
            );
            
            chainResult.cellsToRemove.forEach(cell => matchedCells.add(cell));
            
            chainResult.chainBlasters.forEach(chainBlaster => {
              const chainKey = `${chainBlaster.row},${chainBlaster.col}`;
              if (!processedBlasters.has(chainKey)) {
                blastersToProcess.push(chainBlaster);
              }
            });
          }
        }
      } else {
        // Multiple blasters of different colors - activate each one
        blasterActivated = true;
        const processedBlasters = new Set();
        const blastersToProcess = [...blastersInMatch];
        const orbsToActivate = [];
        
        while (blastersToProcess.length > 0) {
          const blaster = blastersToProcess.shift();
          const blasterKey = `${blaster.row},${blaster.col}`;
          
          if (processedBlasters.has(blasterKey)) continue;
          
          const isChain = processedBlasters.size > 0;
          processedBlasters.add(blasterKey);
          
          const result = activateBlaster(
            grid,
            blaster.row,
            blaster.col,
            getCellType(blaster.cell),
            isChain
          );
          
          if (isChain) hasChainBlasters = true;
          
          result.cellsToRemove.forEach(cell => matchedCells.add(cell));
          
          if (result.orbsHit && result.orbsHit.length > 0) {
            result.orbsHit.forEach(orb => {
              orbsToActivate.push({ 
                orb, 
                blasterColor: getCellType(blaster.cell) 
              });
            });
          }
          
          result.chainBlasters.forEach(chainBlaster => {
            const chainKey = `${chainBlaster.row},${chainBlaster.col}`;
            if (!processedBlasters.has(chainKey)) {
              blastersToProcess.push(chainBlaster);
            }
          });
        }
        
        if (orbsToActivate.length > 0) {
          (async () => {
            for (const { orb, blasterColor } of orbsToActivate) {
              const orbResult = await activateOrb(
                grid,
                orb.row,
                orb.col,
                blasterColor,
                false,
                false,
                false,
                null
              );
              
              orbResult.cellsToRemove.forEach(cell => matchedCells.add(cell));
            }
            
            matchedCells.forEach(cellKey => {
              const [row, col] = cellKey.split(',').map(Number);
              grid[row][col] = null;
            });
            
            const hasAnimations = applyGravity();
            fillEmptyCells();
            renderSwandyCrusherGrid();
            updateSwandyCrusherUI();
            
            const animationDelay = hasAnimations ? 600 : 300;
            
            setTimeout(() => {
              if (hasMatches(grid)) {
                crusherState.isProcessing = true;
                processMatches(false);
              } else {
                crusherState.combo = 0;
                crusherState.isComboActive = false;
                crusherState.isProcessing = false;
                
                if (!hasPossibleMoves(grid)) {
                  reshuffleGrid();
                }
              }
            }, animationDelay);
          })();
          
          return;
        }
      }
    } else if (blastersInMatch.length === 1) {
      blasterActivated = true;
      const processedBlasters = new Set();
      const blastersToProcess = [blastersInMatch[0]];
      const orbsToActivate = [];
      
      while (blastersToProcess.length > 0) {
        const blaster = blastersToProcess.shift();
        const blasterKey = `${blaster.row},${blaster.col}`;
        
        if (processedBlasters.has(blasterKey)) continue;
        
        const isChain = processedBlasters.size > 0;
        processedBlasters.add(blasterKey);
        
        const result = activateBlaster(
          grid,
          blaster.row,
          blaster.col,
          getCellType(blaster.cell),
          isChain
        );
        
        if (isChain) hasChainBlasters = true;
        
        result.cellsToRemove.forEach(cell => matchedCells.add(cell));
        
        if (result.orbsHit && result.orbsHit.length > 0) {
          result.orbsHit.forEach(orb => {
            orbsToActivate.push({ 
              orb, 
              blasterColor: getCellType(blaster.cell) 
            });
          });
        }
        
        result.chainBlasters.forEach(chainBlaster => {
          const chainKey = `${chainBlaster.row},${chainBlaster.col}`;
          if (!processedBlasters.has(chainKey)) {
            blastersToProcess.push(chainBlaster);
          }
        });
      }
      
      if (orbsToActivate.length > 0) {
        (async () => {
          for (const { orb, blasterColor } of orbsToActivate) {
            const orbResult = await activateOrb(
              grid,
              orb.row,
              orb.col,
              blasterColor,
              false,
              false,
              false,
              null
            );
            
            orbResult.cellsToRemove.forEach(cell => matchedCells.add(cell));
          }
          
          matchedCells.forEach(cellKey => {
            const [row, col] = cellKey.split(',').map(Number);
            grid[row][col] = null;
          });
          
          const hasAnimations = applyGravity();
          fillEmptyCells();
          renderSwandyCrusherGrid();
          updateSwandyCrusherUI();
          
          const animationDelay = hasAnimations ? 600 : 300;
          
          setTimeout(() => {
            if (hasMatches(grid)) {
              crusherState.isProcessing = true;
              processMatches(false);
            } else {
              crusherState.combo = 0;
              crusherState.isComboActive = false;
              crusherState.isProcessing = false;
              
              if (!hasPossibleMoves(grid)) {
                reshuffleGrid();
              }
            }
          }, animationDelay);
        })();
        
        return;
      }
    }
  }
  
  // Expand matches to include all adjacent swandies of the same color (only if not blaster)
  // BUT save the original match info for orb/blaster detection
  let originalMatchedCells = new Set(matchedCells);
  
  if (matchFound && !blasterActivated) {
    const expandedMatches = new Set();
    const firstCellKey = Array.from(matchedCells)[0];
    const [firstRow, firstCol] = firstCellKey.split(',').map(Number);
    const type = getCellType(grid[firstRow][firstCol]);
    
    matchedCells.forEach(cellKey => {
      const [row, col] = cellKey.split(',').map(Number);
      findAdjacentSameColor(grid, row, col, type, expandedMatches);
    });
    
    // Use expanded matches
    expandedMatches.forEach(cell => matchedCells.add(cell));
  }
  
  if (matchFound) {
    // Handle combo system
    const treeUpgrades = window.state.halloweenEvent.treeUpgrades.purchased || {};
    
    if (isPlayerMove) {
      // First match from player move - activate combo but don't apply multiplier yet
      crusherState.isComboActive = true;
      crusherState.combo = 0;
    } else if (crusherState.isComboActive) {
      // Cascading match - increase combo
      crusherState.combo++;
    }
    
    // Calculate exponential combo multiplier with upgrade scaling
    // Base: 1.5x per combo, or 1.75x if SH4 upgrade is purchased
    const comboBase = treeUpgrades.combo_breaker ? 1.75 : 1.5;
    const comboMultiplier = crusherState.isComboActive && !isPlayerMove 
      ? Math.pow(comboBase, crusherState.combo) 
      : 1;
    
    // Calculate match size multiplier based on number of swandies matched (if SH3 upgrade is purchased)
    // 3 swandies: 1.0x, 4: 1.2x, 5: 1.4x, 6: 1.6x, 7: 1.8x, 8+: 2.0x
    let matchSizeMultiplier = 1.0;
    if (treeUpgrades.super_shard_multi) {
      const matchCount = matchedCells.size;
      if (matchCount >= 8) {
        matchSizeMultiplier = 2.0;
      } else if (matchCount >= 4) {
        matchSizeMultiplier = 1.0 + (matchCount - 3) * 0.2;
      }
    }
    
    // Get level-based score multiplier
    const levelScoreMultiplier = DecimalUtils.isDecimal(crusherState.multipliers.scoreMultiplier)
      ? crusherState.multipliers.scoreMultiplier.toNumber()
      : (crusherState.multipliers.scoreMultiplier || 1);
    
    // Get shard multiplier from upgrades (SH1, SH2, S13)
    // Calculate shardsUpgradeMultiplier from purchased upgrades (flag-based)
    let shardsUpgradeMultiplier = 1;
    if (treeUpgrades.shards_multi) {
      const sh1Multiplier = typeof getUpgradeHexMultiplier === 'function' 
        ? getUpgradeHexMultiplier('shards_multi') 
        : 1.5;
      shardsUpgradeMultiplier *= sh1Multiplier; // SH1
    }
    if (treeUpgrades.shards_multi_2) {
      const sh2Multiplier = typeof getUpgradeHexMultiplier === 'function' 
        ? getUpgradeHexMultiplier('shards_multi_2') 
        : 1.25;
      shardsUpgradeMultiplier *= sh2Multiplier; // SH2
    }
    if (treeUpgrades.need_more_shards) shardsUpgradeMultiplier *= 1.49; // S13
    if (treeUpgrades.excuse_me_price_increase) shardsUpgradeMultiplier *= 2.5; // S21
    if (treeUpgrades.recovering_from_hexion) shardsUpgradeMultiplier *= 2.5; // S22
    if (treeUpgrades.just_out_of_reach) shardsUpgradeMultiplier *= 1.5; // S14
    if (treeUpgrades.something_in_distance) shardsUpgradeMultiplier *= 1.5; // S16
    if (treeUpgrades.wooden_building) shardsUpgradeMultiplier *= 1.75; // S17
    if (treeUpgrades.someone_inside) shardsUpgradeMultiplier *= 1.5; // S19
    if (treeUpgrades.little_bit_more_shards) shardsUpgradeMultiplier *= 5; // SH12
    if (treeUpgrades.devilish_swandy) {
      const s6Multiplier = typeof getUpgradeHexMultiplier === 'function' 
        ? getUpgradeHexMultiplier('devilish_swandy') 
        : 1.666;
      shardsUpgradeMultiplier *= s6Multiplier; // S6
    }
    if (treeUpgrades.less_devilish_swandy) {
      const s7Multiplier = typeof getUpgradeHexMultiplier === 'function' 
        ? getUpgradeHexMultiplier('less_devilish_swandy') 
        : 1.333;
      shardsUpgradeMultiplier *= s7Multiplier; // S7
    }
    
    // Get shattery shards multiplier from resety (SH8 upgrade, starts at level 10+)
    const shatteryShardsMultiplier = DecimalUtils.isDecimal(crusherState.resety.shardsMultiplier)
      ? crusherState.resety.shardsMultiplier.toNumber()
      : (crusherState.resety.shardsMultiplier || 1);
    
    // Get expansion grade shard multiplier (SH9 upgrade)
    let expansionShardMultiplier = 1;
    if (treeUpgrades.expansion_shard_boost) {
      const currentGrade = DecimalUtils.isDecimal(window.state.grade) ? window.state.grade.toNumber() : (window.state.grade || 1);
      expansionShardMultiplier = 1 + (currentGrade - 1) * 0.25;
    }
    
    // Get swandy-based shard boost multiplier
    const swandyBoostMultiplier = getSwandyShardBoostMultiplier();
    
    // Get tree age shard boost multiplier (SH14 upgrade)
    const treeAgeBoostMultiplier = getTreeAgeShardBoostMultiplier();
    
    // Get hexed swandy shard boost multiplier
    const hexedShardBoostMultiplier = getHexedSwandyShardBoostMultiplier();
    
    // Calculate base points and apply multipliers
    let totalPoints = 0;
    
    if (blasterActivated) {
      // Blaster activation: Apply cascading multiplier for each swandy
      // 1.05x for chain blasters, 1.15x for double blaster, 1.3x for single blaster
      let cascadingRate;
      let blasterType;
      if (hasChainBlasters) {
        cascadingRate = 1.05;
        blasterType = 'Chain Blaster';
      } else if (isDoubleBlaster) {
        cascadingRate = 1.15;
        blasterType = 'Double Blaster';
      } else {
        cascadingRate = 1.3;
        blasterType = 'Single Blaster';
      }
      
      const basePointsPerSwandy = 10 * levelScoreMultiplier * shardsUpgradeMultiplier * shatteryShardsMultiplier * expansionShardMultiplier * swandyBoostMultiplier * treeAgeBoostMultiplier * hexedShardBoostMultiplier;
      let cascadingMultiplier = 1.0;
      
      // Detailed shard calculation logging for blaster
      const formatNumber = (num) => {
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toFixed(2);
      };
      
    
      
      matchedCells.forEach(cellKey => {
        const pointsForThisSwandy = basePointsPerSwandy * cascadingMultiplier;
        totalPoints += pointsForThisSwandy;
        cascadingMultiplier *= cascadingRate; // Each subsequent swandy gives cascadingRate more
      });
      
  
    } else {
      // Normal match: Apply combo and match size multipliers
      const basePoints = matchedCells.size * 10;
      totalPoints = basePoints * comboMultiplier * matchSizeMultiplier * levelScoreMultiplier * shardsUpgradeMultiplier * shatteryShardsMultiplier * expansionShardMultiplier * swandyBoostMultiplier * treeAgeBoostMultiplier * hexedShardBoostMultiplier;
      
      // Detailed shard calculation logging
      const formatNumber = (num) => {
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toFixed(2);
      };
      
  
    }
    
    if (!DecimalUtils.isDecimal(crusherState.score)) {
      crusherState.score = new Decimal(crusherState.score || 0);
    }
    
    crusherState.score = crusherState.score.add(totalPoints);
    
    // Show combo text notification if combo is active
    if (comboMultiplier > 1) {
      showComboText(crusherState.combo, comboMultiplier);
    }
    
    // Show individual score popups for each matched Swandy
    if (blasterActivated) {
      // Blaster: Show cascading values
      // 1.05x for chain blasters, 1.15x for double blaster, 1.3x for single blaster
      let cascadingRate;
      if (hasChainBlasters) {
        cascadingRate = 1.05;
      } else if (isDoubleBlaster) {
        cascadingRate = 1.15;
      } else {
        cascadingRate = 1.3;
      }
      
      const basePointsPerSwandy = 10 * levelScoreMultiplier * shardsUpgradeMultiplier * shatteryShardsMultiplier * expansionShardMultiplier * swandyBoostMultiplier * treeAgeBoostMultiplier * hexedShardBoostMultiplier;
      let cascadingMultiplier = 1.0;
      
      const hexedPositions = crusherState.hexedPositions || {};
      matchedCells.forEach(cellKey => {
        const [row, col] = cellKey.split(',').map(Number);
        const posKey = `${row},${col}`;
        const isHexed = hexedPositions[posKey];
        const hexedMultiplier = isHexed ? 5 : 1;
        const pointsForThisSwandy = basePointsPerSwandy * cascadingMultiplier * hexedMultiplier;
        showScorePopup(row, col, pointsForThisSwandy);
        cascadingMultiplier *= cascadingRate;
      });
    } else {
      // Normal match: All swandies give same value
      const pointsPerSwandy = 10 * comboMultiplier * matchSizeMultiplier * levelScoreMultiplier * shardsUpgradeMultiplier * shatteryShardsMultiplier * expansionShardMultiplier * swandyBoostMultiplier * treeAgeBoostMultiplier * hexedShardBoostMultiplier;
      const hexedPositions = crusherState.hexedPositions || {};
      matchedCells.forEach(cellKey => {
        const [row, col] = cellKey.split(',').map(Number);
        const posKey = `${row},${col}`;
        const isHexed = hexedPositions[posKey];
        const hexedMultiplier = isHexed ? 5 : 1;
        showScorePopup(row, col, pointsPerSwandy * hexedMultiplier);
      });
    }
    
    // Token spawning chance
    // 25% chance for manual player matches, 10% for cascade matches
    const tokenSpawnChance = isPlayerMove ? 0.25 : 0.10;
    if (Math.random() < tokenSpawnChance && typeof spawnIngredientToken === 'function') {
      const gridElement = document.getElementById('swandyCrusherGrid');
      if (gridElement) {
        spawnIngredientToken('crusher', gridElement);
      }
    }
    
    // Check for hexed tile bonuses
    const hexedPositions = crusherState.hexedPositions || {};
    let hexedTileCount = 0;
    let hexedTileBonusShards = new Decimal(0);
    
    matchedCells.forEach(cellKey => {
      const [row, col] = cellKey.split(',').map(Number);
      const posKey = `${row},${col}`;
      if (hexedPositions[posKey]) {
        hexedTileCount++;
        
        // Award hexed swandy shards based on formula: softcap((SS/1e6)^0.4, 1e4, 0.5)
        // SS = total swandy shards after all multipliers (totalPoints)
        if (!DecimalUtils.isDecimal(window.state.halloweenEvent.hexedSwandyShards)) {
          window.state.halloweenEvent.hexedSwandyShards = new Decimal(0);
        }
        
        // Calculate base HSS gain: (SS / 1e6) ^ 0.4
        const baseHSSGain = Math.pow(totalPoints / 1e6, 0.4);
        
        // Apply softcap: if baseHSSGain > 1e4, use softcap formula
        let finalHSSGain;
        if (baseHSSGain <= 1e4) {
          finalHSSGain = baseHSSGain;
        } else {
          // Softcap formula: 1e4 * ((baseHSSGain / 1e4) ^ 0.5)
          finalHSSGain = 1e4 * Math.pow(baseHSSGain / 1e4, 0.5);
        }
        
        // Apply HSS multipliers from upgrades
        let hssMultiplier = 1;
        const treeUpgrades = window.state.halloweenEvent.treeUpgrades.purchased || {};
        if (treeUpgrades.hexed_shard_multi_1) {
          hssMultiplier *= 2;
        }
        
        // Apply SH2 hex multiplier (1.5x when fully hexed)
        if (typeof getUpgradeHexMultiplier === 'function') {
          const sh2HexMult = getUpgradeHexMultiplier('shards_multi_2');
          hssMultiplier *= sh2HexMult;
        }
        
        const hssToAdd = finalHSSGain * hssMultiplier;
        window.state.halloweenEvent.hexedSwandyShards = window.state.halloweenEvent.hexedSwandyShards.add(hssToAdd);
        
        // Show hexed shard popup
        showHexedShardPopup(row, col, hssToAdd);
        
        // Remove hexed status from this position
        delete crusherState.hexedPositions[posKey];
      }
    });
    
    // Apply 5x score bonus for hexed tiles
    if (hexedTileCount > 0) {
      const hexedBonus = totalPoints * 4;
      crusherState.score = crusherState.score.add(hexedBonus);
    }
    
    // Check for hexed tile spawning (2% chance per matched swandy if S10 is fully hexed)
    if (isHexedTilesUnlocked()) {
      matchedCells.forEach(cellKey => {
        if (Math.random() < 0.02) {
          const [row, col] = cellKey.split(',').map(Number);
          triggerHexedTileSpawn(row, col);
        }
      });
    }
    
    // Track Hex Staff progress (only if unlocked)
    if (typeof isHexStaffUnlocked === 'function' && isHexStaffUnlocked()) {
      const hexStaff = crusherState.hexStaff;
      
      // Track normal matches for normal break
      if (!blasterActivated && matchedCells.size >= 3) {
        hexStaff.normal.progress += matchedCells.size;
        
        // Check if we earned a use
        while (hexStaff.normal.progress >= hexStaff.normal.required && hexStaff.normal.uses < hexStaff.normal.maxUses) {
          hexStaff.normal.progress -= hexStaff.normal.required;
          hexStaff.normal.uses++;
        }
        
        // Cap progress at required amount if at max uses
        if (hexStaff.normal.uses >= hexStaff.normal.maxUses) {
          hexStaff.normal.progress = Math.min(hexStaff.normal.progress, hexStaff.normal.required);
        }
      }
      
      // Track blasters matched for blaster break (check blastersInMatch if available)
      if (blasterActivated) {
        let blasterCount = 1;
        if (typeof blastersInMatch !== 'undefined' && blastersInMatch) {
          blasterCount = Math.max(1, blastersInMatch.length);
        }
        hexStaff.blaster.progress += blasterCount;
        
        // Check if we earned a use
        while (hexStaff.blaster.progress >= hexStaff.blaster.required && hexStaff.blaster.uses < hexStaff.blaster.maxUses) {
          hexStaff.blaster.progress -= hexStaff.blaster.required;
          hexStaff.blaster.uses++;
        }
        
        // Cap progress at required amount if at max uses
        if (hexStaff.blaster.uses >= hexStaff.blaster.maxUses) {
          hexStaff.blaster.progress = Math.min(hexStaff.blaster.progress, hexStaff.blaster.required);
        }
      }
    }
    
    // Remove matched cells with animation
    matchedCells.forEach(cellKey => {
      const [row, col] = cellKey.split(',').map(Number);
      const cell = document.querySelector(`.swandy-cell[data-row="${row}"][data-col="${col}"]`);
      if (cell) {
        // Only add matching animation if it doesn't already have a blaster wipe animation
        if (!cell.classList.contains('blaster-wipe-horizontal') && 
            !cell.classList.contains('blaster-wipe-vertical') && 
            !cell.classList.contains('blaster-wipe-explosion')) {
          cell.classList.add('matching');
          createShatterEffect(cell, row, col);
        }
      }
    });
    
    // Wait for match animation to complete, then apply gravity
    setTimeout(() => {
      // Check if we should create an orb (8+ swandies) or blaster (6+ swandies)
      // Priority: orb > blaster (check orb first since it has higher threshold)
      // Use ORIGINAL matched cells before flood-fill expansion for detection
      let blasterCreated = false;
      let orbCreated = false;
      let blasterPosition = null;
      let blasterType = null;
      let blasterDirection = null;
      let orbPosition = null;
      let orbType = null;
      
      if (!blasterActivated && shouldCreateOrb(originalMatchedCells, grid)) {
        const firstCell = Array.from(originalMatchedCells)[0];
        const [orbRow, orbCol] = firstCell.split(',').map(Number);
        orbPosition = { row: orbRow, col: orbCol };
        orbType = getCellType(grid[orbRow][orbCol]);
        orbCreated = true;
      } else if (!blasterActivated && shouldCreateBlaster(originalMatchedCells, grid)) {
        const firstCell = Array.from(originalMatchedCells)[0];
        const [blasterRow, blasterCol] = firstCell.split(',').map(Number);
        blasterPosition = { row: blasterRow, col: blasterCol };
        blasterType = getCellType(grid[blasterRow][blasterCol]);
        blasterDirection = getBlasterDirection(originalMatchedCells, grid);
        blasterCreated = true;
      }
      
      matchedCells.forEach(cellKey => {
        const [row, col] = cellKey.split(',').map(Number);
        grid[row][col] = null;
      });
      
      if (orbCreated && orbPosition) {
        grid[orbPosition.row][orbPosition.col] = createSwandyCell(orbType, false, null, true);
      } else if (blasterCreated && blasterPosition) {
        grid[blasterPosition.row][blasterPosition.col] = createSwandyCell(blasterType, true, blasterDirection);
      }
      
      // Apply gravity and get animation info
      const hasAnimations = applyGravity();
      
      // Fill empty cells
      fillEmptyCells();
      
      // Re-render
      renderSwandyCrusherGrid();
      
      // Update UI
      updateSwandyCrusherUI();
      
      // Calculate delay based on animation time
      const animationDelay = hasAnimations ? 600 : 300;
      
      // Check for more matches (cascading)
      setTimeout(() => {
        if (hasMatches(grid)) {
          crusherState.isProcessing = true;
          processMatches(false); // false = not a player move, enable combo
        } else {
          // No more matches - reset combo
          crusherState.combo = 0;
          crusherState.isComboActive = false;
          crusherState.isProcessing = false;
          
          // Check if there are any possible moves left
          if (!hasPossibleMoves(grid)) {
            // No possible moves - reshuffle the grid
            reshuffleGrid();
            if (typeof showToast === 'function') {
              showToast('No moves available! Reshuffling...', 'info');
            }
          }
        }
      }, animationDelay);
    }, 500);
  } else {
    // No matches found - reset combo
    crusherState.combo = 0;
    crusherState.isComboActive = false;
    crusherState.isProcessing = false;
  }
}

// Apply gravity to make Swandies fall with animation
function applyGravity() {
  const grid = window.state.halloweenEvent.swandyCrusher.grid;
  const fallAnimations = [];
  
  for (let col = 0; col < GRID_SIZE; col++) {
    let fallDistance = 0;
    
    // Start from bottom and move up
    for (let row = GRID_SIZE - 1; row >= 0; row--) {
      if (grid[row][col] === null) {
        fallDistance++;
      } else if (fallDistance > 0) {
        // This cell needs to fall
        const fromRow = row;
        const toRow = row + fallDistance;
        
        fallAnimations.push({
          col: col,
          fromRow: fromRow,
          toRow: toRow,
          type: grid[fromRow][col],
          distance: fallDistance
        });
        
        // Move the swandy (hexed status is tracked separately in hexedPositions)
        grid[toRow][col] = createSwandyCell(
          getCellType(grid[fromRow][col]),
          isBlasterCell(grid[fromRow][col]),
          grid[fromRow][col].blasterDirection,
          isOrbCell(grid[fromRow][col]),
          false // isHexed is now tracked separately
        );
        grid[fromRow][col] = null;
      }
    }
  }
  
  // Apply falling animations
  if (fallAnimations.length > 0) {
    animateFallingSwandies(fallAnimations);
  }
  
  return fallAnimations.length > 0;
}

// Create shatter effect for matched Swandies
function createShatterEffect(cell, row, col) {
  const grid = window.state.halloweenEvent.swandyCrusher.grid;
  const swandyType = grid[row][col];
  const swandyData = swandyTypes.find(s => s.id === swandyType);
  
  if (!swandyData) return;
  
  const cellRect = cell.getBoundingClientRect();
  const container = document.getElementById('swandyCrusherGrid');
  if (!container) return;
  
  const containerRect = container.getBoundingClientRect();
  
  const fragmentCount = 6;
  
  for (let i = 0; i < fragmentCount; i++) {
    const fragment = document.createElement('div');
    fragment.className = 'shatter-fragment';
    fragment.style.cssText = `
      position: absolute;
      left: ${cellRect.left - containerRect.left + cellRect.width / 2 - 15}px;
      top: ${cellRect.top - containerRect.top + cellRect.height / 2 - 15}px;
      width: 30px;
      height: 30px;
      background-image: url('${swandyData.icon}');
      background-size: cover;
      background-position: center;
      pointer-events: none;
      z-index: 100;
      animation: shatter-fragment-${i + 1} 0.5s ease-out forwards;
    `;
    
    container.appendChild(fragment);
    
    setTimeout(() => {
      fragment.remove();
    }, 500);
  }
}

// Show score popup on a specific tile
function showScorePopup(row, col, points) {
  const cell = document.querySelector(`.swandy-cell[data-row="${row}"][data-col="${col}"]`);
  if (!cell) return;
  
  // Get the grid container instead of appending to the cell
  const gridContainer = document.getElementById('swandyCrusherGrid');
  if (!gridContainer) return;
  
  // Get cell position relative to grid
  const cellRect = cell.getBoundingClientRect();
  const gridRect = gridContainer.getBoundingClientRect();
  
  const popup = document.createElement('div');
  popup.className = 'score-popup';
  
  // Convert to Decimal and format properly
  const pointsDecimal = DecimalUtils.isDecimal(points) ? points : new Decimal(points);
  const displayPoints = DecimalUtils.formatDecimal(pointsDecimal);
  
  popup.textContent = `+${displayPoints}`;
  popup.style.cssText = `
    position: absolute;
    left: ${cellRect.left - gridRect.left + cellRect.width / 2}px;
    top: ${cellRect.top - gridRect.top + cellRect.height / 2}px;
    transform: translate(-50%, -50%);
    font-size: 1.5em;
    font-weight: bold;
    color: #ffdd00;
    text-shadow: 0 0 8px rgba(255, 221, 0, 0.9), 0 0 15px rgba(255, 136, 0, 0.6), 0 0 5px rgba(0, 0, 0, 0.8);
    z-index: 100;
    pointer-events: none;
    animation: scorePopup 0.8s ease-out forwards;
  `;
  
  gridContainer.style.position = 'relative';
  gridContainer.appendChild(popup);
  
  setTimeout(() => {
    popup.remove();
  }, 800);
}

function showHexedShardPopup(row, col, shards) {
  const cell = document.querySelector(`.swandy-cell[data-row="${row}"][data-col="${col}"]`);
  if (!cell) return;
  
  const gridContainer = document.getElementById('swandyCrusherGrid');
  if (!gridContainer) return;
  
  const cellRect = cell.getBoundingClientRect();
  const gridRect = gridContainer.getBoundingClientRect();
  
  const popup = document.createElement('div');
  popup.className = 'hexed-shard-popup';
  
  const shardsDecimal = DecimalUtils.isDecimal(shards) ? shards : new Decimal(shards);
  const displayShards = DecimalUtils.formatDecimal(shardsDecimal);
  
  popup.textContent = `+${displayShards}`;
  popup.style.cssText = `
    position: absolute;
    left: ${cellRect.left - gridRect.left + cellRect.width / 2}px;
    top: ${cellRect.top - gridRect.top + cellRect.height / 2 + 40}px;
    transform: translate(-50%, -50%);
    font-size: 1.5em;
    font-weight: bold;
    color: #b19cd9;
    text-shadow: 0 0 8px rgba(177, 156, 217, 0.9), 0 0 15px rgba(138, 43, 226, 0.6), 0 0 5px rgba(0, 0, 0, 0.8);
    z-index: 100;
    pointer-events: none;
    animation: scorePopup 0.8s ease-out forwards;
  `;
  
  gridContainer.style.position = 'relative';
  gridContainer.appendChild(popup);
  
  setTimeout(() => {
    popup.remove();
  }, 800);
}

// Animate falling Swandies
function animateFallingSwandies(fallAnimations) {
  fallAnimations.forEach(anim => {
    const cell = document.querySelector(`.swandy-cell[data-row="${anim.toRow}"][data-col="${anim.col}"]`);
    if (cell) {
      // Calculate animation duration based on fall distance
      const duration = anim.distance * 0.1; // 0.1s per tile
      cell.style.animation = `swandy-fall ${duration}s ease-out`;
      
      // Remove animation after it completes
      setTimeout(() => {
        cell.style.animation = '';
      }, duration * 1000);
    }
  });
}

// Fill empty cells with new Swandies (with falling animation)
function fillEmptyCells() {
  const grid = window.state.halloweenEvent.swandyCrusher.grid;
  const newSwandies = [];
  
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === null) {
        // Don't fill hexed tile positions - they stay empty when shattered
        grid[row][col] = createSwandyCell(getRandomSwandyType());
        newSwandies.push({ row, col });
      }
    }
  }
  
  // Apply falling animation to new Swandies
  if (newSwandies.length > 0) {
    setTimeout(() => {
      newSwandies.forEach(pos => {
        const cell = document.querySelector(`.swandy-cell[data-row="${pos.row}"][data-col="${pos.col}"]`);
        if (cell) {
          // New swandies fall from above the grid
          const fallDistance = pos.row + 1;
          const duration = fallDistance * 0.1;
          cell.style.animation = `swandy-fall ${duration}s ease-out`;
          
          setTimeout(() => {
            cell.style.animation = '';
          }, duration * 1000);
        }
      });
    }, 50);
  }
}

// Check if hexed tiles feature is unlocked (S10 fully hexed)
function isHexedTilesUnlocked() {
  const treeUpgrades = window.state.halloweenEvent?.treeUpgrades;
  if (!treeUpgrades) return false;
  
  const hexData = treeUpgrades.hexData?.['crush_swandies'];
  if (!hexData) return false;
  
  const config = window.upgradeHexMultiplierConfig?.['crush_swandies'];
  if (!config) return false;
  
  return hexData.hexDeposited >= config.hexRequired;
}

// Trigger hexed tile spawn animation and conversion
function triggerHexedTileSpawn(sourceRow, sourceCol) {
  const grid = window.state.halloweenEvent.swandyCrusher.grid;
  
  // Find all non-hexed tiles
  const availableTiles = [];
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] && !grid[row][col].isHexed) {
        availableTiles.push({ row, col });
      }
    }
  }
  
  if (availableTiles.length === 0) return;
  
  // Pick a random tile to hex
  const targetTile = availableTiles[Math.floor(Math.random() * availableTiles.length)];
  
  // Create hexagon projectile animation
  createHexagonProjectile(sourceRow, sourceCol, targetTile.row, targetTile.col);
}

// Create visual hexagon projectile that moves to target and hexes it
function createHexagonProjectile(fromRow, fromCol, toRow, toCol) {
  const gridElement = document.getElementById('swandyCrusherGrid');
  if (!gridElement) {
  
    return;
  }
  
  // Get the actual cell elements to position accurately
  const startCell = document.querySelector(`.swandy-cell[data-row="${fromRow}"][data-col="${fromCol}"]`);
  const endCell = document.querySelector(`.swandy-cell[data-row="${toRow}"][data-col="${toCol}"]`);
  
  if (!startCell || !endCell) {

    return;
  }
  
  // Get positions relative to grid
  const gridRect = gridElement.getBoundingClientRect();
  const startRect = startCell.getBoundingClientRect();
  const endRect = endCell.getBoundingClientRect();
  
  const startX = startRect.left - gridRect.left + startRect.width / 2;
  const startY = startRect.top - gridRect.top + startRect.height / 2;
  const endX = endRect.left - gridRect.left + endRect.width / 2;
  const endY = endRect.top - gridRect.top + endRect.height / 2;
  
  // Create container
  const hexagon = document.createElement('div');
  hexagon.className = 'hexagon-projectile';
  
  // Create inner white hexagon
  const innerHex = document.createElement('div');
  innerHex.className = 'hexagon-projectile-inner';
  hexagon.appendChild(innerHex);
  
  // Position at source cell center
  hexagon.style.left = `${startX}px`;
  hexagon.style.top = `${startY}px`;
  hexagon.style.transform = 'translate(-50%, -50%) scale(0)';
  
  gridElement.appendChild(hexagon);
  
  // Phase 1: Grow in size (1.5 seconds)
  setTimeout(() => {
    hexagon.style.transition = 'transform 1.5s ease-out';
    hexagon.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 10);
  
  // Phase 2: After growing, spin and fire toward target (1.5s delay + 0.5s travel)
  setTimeout(() => {
    hexagon.classList.add('spinning');
    hexagon.style.transition = 'left 0.5s ease-in-out, top 0.5s ease-in-out';
    hexagon.style.left = `${endX}px`;
    hexagon.style.top = `${endY}px`;
  }, 1500);
  
  // Phase 3: On impact, shatter and hex the tile (1.5s + 0.5s = 2.0s total)
  setTimeout(() => {
    // Stop spinning
    hexagon.classList.remove('spinning');
    
    // Hex the target position
    const crusherState = window.state.halloweenEvent.swandyCrusher;
    const posKey = `${toRow},${toCol}`;
    crusherState.hexedPositions[posKey] = true;
    
    // Re-render to show hexed tile
    renderSwandyCrusherGrid();
    
    // Create shatter effect
    createHexagonShatter(endX, endY, gridElement);
    
    // Remove hexagon immediately
    hexagon.remove();
  }, 2000);
}

function createHexagonShatter(x, y, container) {
  const fragmentCount = 8;
  const colors = ['#9d4edd', '#c77dff', '#e0aaff'];
  
  for (let i = 0; i < fragmentCount; i++) {
    const fragment = document.createElement('div');
    fragment.className = 'hexagon-fragment';
    
    const angle = (360 / fragmentCount) * i;
    const distance = 40 + Math.random() * 20;
    const endX = Math.cos(angle * Math.PI / 180) * distance;
    const endY = Math.sin(angle * Math.PI / 180) * distance;
    const rotation = Math.random() * 360;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    fragment.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 8px;
      height: 8px;
      background: ${color};
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      transform: translate(-50%, -50%);
      z-index: 1000;
      pointer-events: none;
      box-shadow: 0 0 5px ${color};
    `;
    
    container.appendChild(fragment);
    
    setTimeout(() => {
      fragment.style.transition = 'all 0.6s ease-out';
      fragment.style.transform = `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) rotate(${rotation}deg) scale(0)`;
      fragment.style.opacity = '0';
    }, 10);
    
    setTimeout(() => {
      fragment.remove();
    }, 650);
  }
}

// Calculate swandy-based shard boost multiplier
function getSwandyShardBoostMultiplier() {
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  
  // Check if the upgrade is purchased
  if (!crusherState.swandiesBoostShardsEnabled) {
    return 1;
  }
  
  // Get current swandy count
  const swandyCount = DecimalUtils.isDecimal(window.state.halloweenEvent.swandy)
    ? window.state.halloweenEvent.swandy
    : new Decimal(window.state.halloweenEvent.swandy || 0);
  
  // If less than 10 swandies, no boost
  if (swandyCount.lt(10)) {
    return 1;
  }
  
  // Calculate multiplier: 1.1^(log10(swandies))
  // For 10 swandies: 1.1^1 = 1.1
  // For 100 swandies: 1.1^2 = 1.21
  // For 1000 swandies: 1.1^3 = 1.331
  const log10Swandies = swandyCount.log10();
  const multiplier = Math.pow(1.1, log10Swandies);
  
  return multiplier;
}

// Calculate tree age boost to swandy shards (SH14 upgrade)
function getTreeAgeShardBoostMultiplier() {
  const treeUpgrades = window.state.halloweenEvent.treeUpgrades.purchased;
  
  // Check if SH14 is purchased
  if (!treeUpgrades || !treeUpgrades.tree_age_shard_boost) {
    return 1;
  }
  
  // Get tree age in seconds
  const treeAge = window.state.halloweenEvent.treeAge || 0;
  
  // Formula: 1 + 0.9 × ln(1 + t/600)
  // Where t is tree age in seconds
  const multiplier = 1 + 0.9 * Math.log(1 + treeAge / 600);
  
  return multiplier;
}

// Calculate hexed swandy shard boost to swandy shards
// Formula: 1 + 0.25 × ln(1 + HSS/120)
function getHexedSwandyShardBoostMultiplier() {
  // Get current hexed swandy shards
  const hexedShards = window.state.halloweenEvent.hexedSwandyShards;
  
  if (!hexedShards || !DecimalUtils.isDecimal(hexedShards)) {
    return 1;
  }
  
  const hssAmount = hexedShards.toNumber();
  
  // Formula: 1 + 0.25 × ln(1 + HSS/120)
  const multiplier = 1 + 0.25 * Math.log(1 + hssAmount / 120);
  
  return multiplier;
}

// Get combo tier message based on combo level
function getComboTierMessage(combo, multiplier) {
  const messages = [
    { text: "Swawesome!", color: "#ffdd00" },      
    { text: "Swabulous!", color: "#ffaa00" },      
    { text: "Swamazing!", color: "#ff8800" },      
    { text: "Swunbelievable!", color: "#ff6600" }, 
    { text: "Swastounding!!!", color: "#ff4400" }  
  ];
  
  const tier = Math.min(combo - 1, messages.length - 1);
  const message = messages[tier];
  
  return {
    text: `${message.text} ${multiplier.toFixed(2)}X`,
    color: message.color
  };
}

// Show combo text notification above grid
function showComboText(combo, multiplier) {
  const grid = document.getElementById('swandyCrusherGrid');
  if (!grid) return;
  
  const comboInfo = getComboTierMessage(combo, multiplier);
  
  const notification = document.createElement('div');
  notification.className = 'combo-notification';
  notification.style.cssText = `
    position: absolute;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2.5em;
    font-weight: bold;
    color: ${comboInfo.color};
    text-shadow: 0 0 15px ${comboInfo.color}, 0 0 30px rgba(255, 136, 0, 0.6), 0 0 5px rgba(0, 0, 0, 0.8);
    z-index: 1000;
    pointer-events: none;
    animation: comboTextPulse 1s ease-out forwards;
    white-space: nowrap;
  `;
  notification.textContent = comboInfo.text;
  
  grid.parentElement.style.position = 'relative';
  grid.parentElement.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 1000);
}

// Show combo notification
function showComboNotification(combo, multiplier, points) {
  const grid = document.getElementById('swandyCrusherGrid');
  if (!grid) return;
  
  const notification = document.createElement('div');
  notification.className = 'combo-notification';
  notification.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2em;
    font-weight: bold;
    color: #ffdd00;
    text-shadow: 0 0 10px rgba(255, 221, 0, 0.8), 0 0 20px rgba(255, 136, 0, 0.6);
    z-index: 1000;
    pointer-events: none;
    animation: comboPopup 1s ease-out forwards;
  `;
  notification.textContent = `COMBO x${multiplier}! +${points}`;
  
  grid.parentElement.style.position = 'relative';
  grid.parentElement.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 1000);
}

// Calculate score required for a specific level
function getScoreRequirementForLevel(level) {
  if (level <= 1) return 0;
  // Level 2 requires 1000, each level after is 3x more
  // Level 2: 1000, Level 3: 3000, Level 4: 9000, Level 5: 27000, etc.
  return 1000 * Math.pow(3, level - 2);
}

// Check and update level based on score
function checkLevelUp() {
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  const score = DecimalUtils.isDecimal(crusherState.score) 
    ? crusherState.score.toNumber() 
    : crusherState.score;
  
  // Check if player has enough score for next level
  const nextLevelRequirement = getScoreRequirementForLevel(crusherState.level + 1);
  
  if (score >= nextLevelRequirement) {
    crusherState.level++;
    
    // Update multipliers based on new level
    updateLevelMultipliers();
    
    // Update UI to reflect new level and Resety card changes
    updateSwandyCrusherUI();
    
    // Show level up notification
    if (typeof showToast === 'function') {
      showToast(`Level Up! You are now Level ${crusherState.level}!`, 'success');
    }
    
    // Check again in case they leveled up multiple times
    checkLevelUp();
  }
}

// Calculate and update multipliers based on level
function updateLevelMultipliers() {
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  const level = crusherState.level;
  
  // Swandy production multiplier: 1.3x per level (starting at 1.3x for level 1)
  const swandyProductionMult = Math.pow(1.3, level);
  crusherState.multipliers.swandyProduction = new Decimal(swandyProductionMult);
  
  // Score multiplier: 1.5x per level (starting at 1.5x for level 1)
  const scoreMult = Math.pow(1.5, level);
  crusherState.multipliers.scoreMultiplier = new Decimal(scoreMult);
}

// Update Swandy Crusher UI
function updateSwandyCrusherUI() {
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  
  // Check for level up
  checkLevelUp();
  
  // Update score display
  const scoreElement = document.getElementById('crusherScore');
  if (scoreElement) {
    const score = DecimalUtils.isDecimal(crusherState.score) 
      ? crusherState.score 
      : new Decimal(crusherState.score || 0);
    scoreElement.textContent = DecimalUtils.formatDecimal(score);
  }
  
  // Update level display
  const levelElement = document.getElementById('crusherLevel');
  if (levelElement) {
    levelElement.textContent = crusherState.level;
  }
  
  // Update level progress bar
  const progressBar = document.getElementById('crusherLevelProgress');
  const progressText = document.getElementById('crusherProgressText');
  if (progressBar && progressText) {
    const score = DecimalUtils.isDecimal(crusherState.score) 
      ? crusherState.score.toNumber() 
      : crusherState.score;
    
    const currentLevelRequirement = getScoreRequirementForLevel(crusherState.level);
    const nextLevelRequirement = getScoreRequirementForLevel(crusherState.level + 1);
    const scoreNeeded = nextLevelRequirement - currentLevelRequirement;
    const scoreProgress = score - currentLevelRequirement;
    
    const percentage = Math.min(100, (scoreProgress / scoreNeeded) * 100);
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `Progress: ${Math.floor(percentage)}%`;
  }
  
  // Update Swandy production multiplier display
  const multiplierElement = document.getElementById('crusherMultiplier');
  if (multiplierElement) {
    const mult = DecimalUtils.isDecimal(crusherState.multipliers.swandyProduction)
      ? crusherState.multipliers.swandyProduction
      : new Decimal(crusherState.multipliers.swandyProduction || 1);
    multiplierElement.textContent = `${DecimalUtils.formatDecimal(mult)}x`;
  }
  
  // Update score multiplier display
  const scoreMultiplierElement = document.getElementById('crusherScoreMultiplier');
  if (scoreMultiplierElement) {
    const scoreMult = DecimalUtils.isDecimal(crusherState.multipliers.scoreMultiplier)
      ? crusherState.multipliers.scoreMultiplier
      : new Decimal(crusherState.multipliers.scoreMultiplier || 1);
    scoreMultiplierElement.textContent = `${DecimalUtils.formatDecimal(scoreMult)}x`;
  }
  
  // Update Resety button display
  const resetyButton = document.getElementById('swandyResetyButton');
  if (resetyButton && window.state.halloweenEvent.swandyResetyUnlocked) {
    resetyButton.style.display = 'block';
    
    // Ensure resety state exists
    if (!crusherState.resety) {
      crusherState.resety = {
        count: 0,
        capMultiplier: new Decimal(1),
        productionMultiplier: new Decimal(1),
        shardsMultiplier: new Decimal(1)
      };
    }
    
    // Ensure shardsMultiplier exists
    if (!crusherState.resety.shardsMultiplier) {
      crusherState.resety.shardsMultiplier = new Decimal(1);
    }
    
    // Update current boosts
    const currentBoostsElement = document.getElementById('resetyCurrentBoosts');
    if (currentBoostsElement) {
      const capMult = DecimalUtils.isDecimal(crusherState.resety.capMultiplier)
        ? crusherState.resety.capMultiplier.toNumber()
        : (crusherState.resety.capMultiplier || 1);
      const prodMult = DecimalUtils.isDecimal(crusherState.resety.productionMultiplier)
        ? crusherState.resety.productionMultiplier.toNumber()
        : (crusherState.resety.productionMultiplier || 1);
      
      // If level >= 5, show progression format (current -> next)
      if (crusherState.level >= 5) {
        const previousHighest = crusherState.resety.highestLevelReached || 0;
        const currentLevel = crusherState.level;
        const newLevelsGained = Math.max(0, currentLevel - Math.max(4, previousHighest));
        
        if (newLevelsGained > 0) {
          const totalBoostLevels = crusherState.resety.count + newLevelsGained;
          // Use upgraded scaling if SH5 is purchased
          const treeUpgrades = window.state.halloweenEvent.treeUpgrades.purchased || {};
          const prodBase = treeUpgrades.stronger_shattery_prod ? 1.22 : 1.1;
          
          // Cap multiplier: 1.5x per level, or 1.75x for levels gained at crusher level 25+ with SH15
          let nextCapMult;
          if (treeUpgrades.extending_softcap) {
            // Count how many boost levels came from being at crusher level 25+
            // Boost levels are gained when resetting at levels 5, 6, 7, ... 24, 25, 26, 27...
            // So boost level 20 = crusher level 24, boost level 21 = crusher level 25
            const existingBoostLevelsBelow25 = Math.min(crusherState.resety.count, 20); // Levels 5-24 = 20 boost levels
            const existingBoostLevelsFrom25Plus = Math.max(0, crusherState.resety.count - 20);
            
            // Calculate new boost levels that will come from level 25+
            const newBoostLevelsFrom25Plus = Math.max(0, currentLevel - Math.max(24, previousHighest));
            const newBoostLevelsBelow25 = newLevelsGained - newBoostLevelsFrom25Plus;
            
            const totalBelow25 = existingBoostLevelsBelow25 + newBoostLevelsBelow25;
            const totalFrom25Plus = existingBoostLevelsFrom25Plus + newBoostLevelsFrom25Plus;
            
            nextCapMult = Math.pow(1.5, totalBelow25) * Math.pow(1.75, totalFrom25Plus);
          } else {
            nextCapMult = Math.pow(1.5, totalBoostLevels);
          }
          
          const nextProdMult = Math.pow(prodBase, totalBoostLevels);
          
          let boostsHTML = `Swandy cap: ${DecimalUtils.formatDecimal(new Decimal(capMult))}x → ${DecimalUtils.formatDecimal(new Decimal(nextCapMult))}x<br>Swandy prod: ${DecimalUtils.formatDecimal(new Decimal(prodMult))}x → ${DecimalUtils.formatDecimal(new Decimal(nextProdMult))}x`;
          
          // Calculate current and next shards multiplier if SH8 is purchased
          if (treeUpgrades.shattery_shards) {
            let currentShardsMult = DecimalUtils.isDecimal(crusherState.resety.shardsMultiplier)
              ? crusherState.resety.shardsMultiplier.toNumber()
              : (crusherState.resety.shardsMultiplier || 1);
            
            // Calculate what it will be after reset (based on current level)
            const levelsAbove10 = Math.max(0, currentLevel - 9);
            const nextShardsMult = Math.pow(1.25, levelsAbove10);
            
            // Only show next if it's higher than current
            if (nextShardsMult > currentShardsMult) {
              boostsHTML += `<br>Shards: ${DecimalUtils.formatDecimal(new Decimal(currentShardsMult))}x → ${DecimalUtils.formatDecimal(new Decimal(nextShardsMult))}x`;
            } else {
              boostsHTML += `<br>Shards: ${DecimalUtils.formatDecimal(new Decimal(currentShardsMult))}x`;
            }
          }
          
          currentBoostsElement.innerHTML = boostsHTML;
        } else {
          let boostsHTML = `Swandy cap: ${DecimalUtils.formatDecimal(new Decimal(capMult))}x<br>Swandy prod: ${DecimalUtils.formatDecimal(new Decimal(prodMult))}x`;
          if (treeUpgrades.shattery_shards) {
            const currentShardsMult = DecimalUtils.isDecimal(crusherState.resety.shardsMultiplier)
              ? crusherState.resety.shardsMultiplier.toNumber()
              : (crusherState.resety.shardsMultiplier || 1);
            
            // If level >= 10, show current → next format for shards only if next is higher
            if (currentLevel >= 10) {
              const levelsAbove10 = Math.max(0, currentLevel - 9);
              const nextShardsMult = Math.pow(1.25, levelsAbove10);
              
              // Only show next if it's higher than current
              if (nextShardsMult > currentShardsMult) {
                boostsHTML += `<br>Shards: ${DecimalUtils.formatDecimal(new Decimal(currentShardsMult))}x → ${DecimalUtils.formatDecimal(new Decimal(nextShardsMult))}x`;
              } else {
                boostsHTML += `<br>Shards: ${DecimalUtils.formatDecimal(new Decimal(currentShardsMult))}x`;
              }
            } else {
              boostsHTML += `<br>Shards: ${DecimalUtils.formatDecimal(new Decimal(currentShardsMult))}x`;
            }
          }
          currentBoostsElement.innerHTML = boostsHTML;
        }
      } else {
        // Just show current boosts
        let boostsHTML = `Swandy cap: ${DecimalUtils.formatDecimal(new Decimal(capMult))}x<br>Swandy prod: ${DecimalUtils.formatDecimal(new Decimal(prodMult))}x`;
        if (treeUpgrades.shattery_shards) {
          const shardsMult = DecimalUtils.isDecimal(crusherState.resety.shardsMultiplier)
            ? crusherState.resety.shardsMultiplier.toNumber()
            : (crusherState.resety.shardsMultiplier || 1);
          boostsHTML += `<br>Shards: ${DecimalUtils.formatDecimal(new Decimal(shardsMult))}x`;
        }
        currentBoostsElement.innerHTML = boostsHTML;
      }
    }
    
    // Update button state based on level requirement
    const performButton = document.getElementById('performResetyButton');
    if (performButton) {
      const previousHighest = crusherState.resety.highestLevelReached || 0;
      const currentLevel = crusherState.level;
      const newLevelsGained = Math.max(0, currentLevel - Math.max(4, previousHighest));
      
      if (crusherState.level >= 5 && newLevelsGained > 0) {
        performButton.disabled = false;
        performButton.style.opacity = '1';
        performButton.style.cursor = 'pointer';
        performButton.textContent = 'Reset';
      } else if (crusherState.level < 5) {
        performButton.disabled = true;
        performButton.style.opacity = '0.5';
        performButton.style.cursor = 'not-allowed';
        performButton.textContent = `Reach level 5`;
      } else {
        performButton.disabled = true;
        performButton.style.opacity = '0.5';
        performButton.style.cursor = 'not-allowed';
        performButton.textContent = `Reach level ${previousHighest + 1}`;
      }
    }
  }
  
  // Update hexed swandy shard display if S10 is fully hexed
  const hexedCard = document.getElementById('hexedSwandyShardsCard');
  const hexedCount = document.getElementById('hexedSwandyShardsCount');
  const hexedBoost = document.getElementById('hexedSwandyShardsBoost');
  
  if (hexedCard && hexedCount) {
    if (isHexedTilesUnlocked()) {
      hexedCard.style.display = 'block';
      
      const hexedShards = DecimalUtils.isDecimal(window.state.halloweenEvent.hexedSwandyShards)
        ? window.state.halloweenEvent.hexedSwandyShards
        : new Decimal(window.state.halloweenEvent.hexedSwandyShards || 0);
      
      hexedCount.textContent = DecimalUtils.formatDecimal(hexedShards);
      
      // Update boost display
      if (hexedBoost) {
        const boostMultiplier = getHexedSwandyShardBoostMultiplier();
        const boostDecimal = new Decimal(boostMultiplier);
        hexedBoost.textContent = `×${DecimalUtils.formatDecimal(boostDecimal)} SS boost`;
      }
    } else {
      hexedCard.style.display = 'none';
    }
  }
  
  // Update hex staff UI
  updateSwandyBreakerUI();
}

// Initialize Swandy Crusher when tab is opened
function initializeSwandyCrusher() {
  // Ensure state exists
  if (!window.state.halloweenEvent) {
    window.state.halloweenEvent = {};
  }
  
  if (!window.state.halloweenEvent.swandyCrusher) {
    window.state.halloweenEvent.swandyCrusher = {
      level: 1,
      score: new Decimal(0),
      grid: [],
      hexedPositions: {},
      selectedCell: null,
      combo: 0,
      isComboActive: false,
      multipliers: {
        swandyProduction: new Decimal(1.3),  // 1.3x for level 1
        scoreMultiplier: new Decimal(1.5)    // 1.5x for level 1
      }
    };
  }
  
  // Initialize hexedPositions if it doesn't exist
  if (!window.state.halloweenEvent.swandyCrusher.hexedPositions) {
    window.state.halloweenEvent.swandyCrusher.hexedPositions = {};
  }
  
  // Ensure resety state exists
  if (!window.state.halloweenEvent.swandyCrusher.resety) {
    window.state.halloweenEvent.swandyCrusher.resety = {
      count: 0,
      highestLevelReached: 0,
      capMultiplier: new Decimal(1),
      productionMultiplier: new Decimal(1)
    };
  }
  
  // Migration: Ensure highestLevelReached exists and is properly set for existing saves
  const resety = window.state.halloweenEvent.swandyCrusher.resety;
  if ((resety.highestLevelReached === undefined || resety.highestLevelReached === 0) && resety.count > 0) {
    // If they've done resets before but don't have highestLevelReached set,
    // calculate it based on their count
    // count = 1 means they reset once at level 5, so highestLevelReached = 5
    resety.highestLevelReached = resety.count + 4;
  }
  
  // Update multipliers based on current level (for existing saves)
  updateLevelMultipliers();
  
  // Initialize grid if it doesn't exist or is empty
  if (!window.state.halloweenEvent.swandyCrusher.grid || 
      window.state.halloweenEvent.swandyCrusher.grid.length === 0) {
    initializeSwandyCrusherGrid();
  }
  
  // Render the grid
  renderSwandyCrusherGrid();
  
  // Update UI
  updateSwandyCrusherUI();
  
  // Initialize hex staff cursor
  updateHexStaffCursor();
}

// Perform Swandy Resety reset
function performSwandyResety() {
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  
  // Check if player meets requirements
  if (crusherState.level < 5) {
    showToast('You need to reach level 5 to perform a Swandy Resety!', 'error');
    return;
  }
  
  // Calculate new levels gained since last reset
  const currentLevel = crusherState.level;
  const previousHighest = crusherState.resety.highestLevelReached || 0;
  
  // Only grant boosts for NEW levels beyond the previous highest
  // If this is the first reset at level 5, highestLevelReached is 0, so we get 5 - 4 = 1 level
  // If resetting at level 5 again, highestLevelReached is 5, so we get 5 - 5 = 0 levels (no boost)
  // If resetting at level 6, highestLevelReached is 5, so we get 6 - 5 = 1 level (next boost tier)
  const newLevelsGained = Math.max(0, currentLevel - Math.max(4, previousHighest));
  
  if (newLevelsGained === 0) {
    showToast('You need to reach a higher level than before to gain more boosts!', 'error');
    return;
  }
  
  // Update highest level reached
  crusherState.resety.highestLevelReached = currentLevel;
  
  // Calculate total boost levels (cumulative)
  crusherState.resety.count += newLevelsGained;
  const totalBoostLevels = crusherState.resety.count;
  
  // Calculate multipliers based on total boost levels
  // Production multiplier: 1.1x (base) or 1.22x (with SH5 upgrade) per level
  const treeUpgrades = window.state.halloweenEvent.treeUpgrades.purchased || {};
  const prodBase = treeUpgrades.stronger_shattery_prod ? 1.22 : 1.1;
  
  // Cap multiplier: 1.5x per level, or 1.75x for levels gained at crusher level 25+ with SH15
  let nextCapMult;
  if (treeUpgrades.extending_softcap) {
    // Count how many boost levels came from being at crusher level 25+
    // Boost levels are gained when resetting at levels 5, 6, 7, ... 24, 25, 26, 27...
    // So boost level 20 = crusher level 24, boost level 21 = crusher level 25
    const boostLevelsBelow25 = Math.min(totalBoostLevels, 20); // Levels 5-24 = 20 boost levels
    const boostLevelsFrom25Plus = Math.max(0, totalBoostLevels - 20);
    
    nextCapMult = Math.pow(1.5, boostLevelsBelow25) * Math.pow(1.75, boostLevelsFrom25Plus);
  } else {
    nextCapMult = Math.pow(1.5, totalBoostLevels);
  }
  
  const nextProdMult = Math.pow(prodBase, totalBoostLevels);
  
  crusherState.resety.capMultiplier = new Decimal(nextCapMult);
  crusherState.resety.productionMultiplier = new Decimal(nextProdMult);
  
  // Calculate shards multiplier if SH8 upgrade is purchased (starts at level 10+)
  if (treeUpgrades.shattery_shards) {
    const levelsAbove10 = Math.max(0, currentLevel - 9); // Starts at level 10
    const nextShardsMult = Math.pow(1.25, levelsAbove10);
    crusherState.resety.shardsMultiplier = new Decimal(nextShardsMult);
  } else {
    crusherState.resety.shardsMultiplier = new Decimal(1);
  }
  
  // Reset Swandy to 0
  window.state.halloweenEvent.swandy = new Decimal(0);
  
  // Reset crusher score and level
  crusherState.score = new Decimal(0);
  crusherState.level = 1;
  
  // Reset level-based multipliers
  updateLevelMultipliers();
  
  // Reset grid
  initializeSwandyCrusherGrid();
  renderSwandyCrusherGrid(true);
  
  // Reset tree upgrades that use Swandy currency (keep upgrades that use swandyShards and upgrade 10+11+15)
  const treePurchasedUpgrades = window.state.halloweenEvent.treeUpgrades.purchased;
  if (treePurchasedUpgrades && typeof treePurchasedUpgrades === 'object') {
    // Get all upgrade IDs that should be reset (only those using Swandy currency, not swandyShards)
    const upgradesToReset = [];
    
    if (typeof treeUpgrades !== 'undefined') {
      Object.keys(treeUpgrades).forEach(upgradeId => {
        const upgrade = treeUpgrades[upgradeId];
        // Reset only if it uses regular Swandy currency (not swandyShards)
        // Also keep 'crush_swandies', 'swandy_resety', and 'remote_power_recharge' since they unlock features
        if (upgradeId !== 'crush_swandies' && 
            upgradeId !== 'swandy_resety' && 
            upgradeId !== 'remote_power_recharge' &&
            (!upgrade.costCurrency || upgrade.costCurrency !== 'swandyShards')) {
          upgradesToReset.push(upgradeId);
        }
      });
    }
    
    upgradesToReset.forEach(upgradeId => {
      delete treePurchasedUpgrades[upgradeId];
    });
  }
  
  // Reset swandyGeneration to 0 (will be re-applied when upgrades are re-purchased)
  window.state.halloweenEvent.treeUpgrades.swandyGeneration = new Decimal(0);
  window.state.halloweenEvent.treeUpgrades.kpBoostEnabled = false;
  
  // Update all UIs
  updateSwandyCrusherUI();
  if (typeof updateHalloweenUI === 'function') {
    updateHalloweenUI();
  }
  if (typeof updateTreeOfHorrorsUI === 'function') {
    updateTreeOfHorrorsUI();
  }
  if (typeof renderTreeUpgrades === 'function') {
    renderTreeUpgrades();
  }
  
  let toastMessage = `Swandy Resety performed! Swandy cap: ${nextCapMult.toFixed(2)}x, Swandy prod: ${nextProdMult.toFixed(2)}x`;
  if (treeUpgrades.shattery_shards) {
    const nextShardsMult = DecimalUtils.isDecimal(crusherState.resety.shardsMultiplier)
      ? crusherState.resety.shardsMultiplier.toNumber()
      : (crusherState.resety.shardsMultiplier || 1);
    toastMessage += `, Shards: ${nextShardsMult.toFixed(2)}x`;
  }
  
  showToast(toastMessage, 'success');
}

// Open Swandy Resety confirmation modal
function openSwandyResetyModal() {
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  
  if (crusherState.level < 5) {
    showToast('You need to reach level 5 to perform a Swandy Resety!', 'error');
    return;
  }
  
  const modal = document.getElementById('swandyResetyModal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

// Close Swandy Resety confirmation modal
function closeSwandyResetyModal() {
  const modal = document.getElementById('swandyResetyModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Confirm and perform Swandy Resety
function confirmSwandyResety() {
  closeSwandyResetyModal();
  performShatteringSequence();
}

// Perform the shattering animation sequence
function performShatteringSequence() {
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  
  if (crusherState.level < 5) {
    showToast('You need to reach level 5 to perform a Swandy Shattery!', 'error');
    return;
  }
  
  const grid = crusherState.grid;
  const allCells = [];
  
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      allCells.push({ row, col });
    }
  }
  
  shuffleArray(allCells);
  
  let delay = 0;
  const shakeDelay = 50;
  const shatterDelay = 100;
  
  allCells.forEach((cellPos, index) => {
    const { row, col } = cellPos;
    
    setTimeout(() => {
      const cell = document.querySelector(`.swandy-cell[data-row="${row}"][data-col="${col}"]`);
      if (cell && !cell.classList.contains('shattering')) {
        cell.classList.add('shaking');
      }
    }, delay + index * shakeDelay);
    
    setTimeout(() => {
      const cell = document.querySelector(`.swandy-cell[data-row="${row}"][data-col="${col}"]`);
      if (cell) {
        cell.classList.remove('shaking');
        cell.classList.add('shattering', 'matching');
        createShatterEffect(cell, row, col);
      }
    }, delay + index * shakeDelay + 500);
  });
  
  const totalAnimationTime = delay + allCells.length * shakeDelay + 1000;
  
  setTimeout(() => {
    performSwandyResetyReset();
  }, totalAnimationTime);
}

// Shuffle array helper function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Perform the actual reset after animation
function performSwandyResetyReset() {
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  
  const currentLevel = crusherState.level;
  const previousHighest = crusherState.resety.highestLevelReached || 0;
  
  const newLevelsGained = Math.max(0, currentLevel - Math.max(4, previousHighest));
  
  if (newLevelsGained === 0) {
    showToast('You need to reach a higher level than before to gain more boosts!', 'error');
    return;
  }
  
  crusherState.resety.highestLevelReached = currentLevel;
  
  crusherState.resety.count += newLevelsGained;
  const totalBoostLevels = crusherState.resety.count;
  
  // Production multiplier: 1.1x (base) or 1.22x (with SH5 upgrade) per level
  const treeUpgrades = window.state.halloweenEvent.treeUpgrades.purchased || {};
  const prodBase = treeUpgrades.stronger_shattery_prod ? 1.22 : 1.1;
  
  // Cap multiplier: 1.5x per level, or 1.75x for levels gained at crusher level 25+ with SH15
  let nextCapMult;
  if (treeUpgrades.extending_softcap) {
    // Count how many boost levels came from being at crusher level 25+
    // Boost levels are gained when resetting at levels 5, 6, 7, ... 24, 25, 26, 27...
    // So boost level 20 = crusher level 24, boost level 21 = crusher level 25
    const boostLevelsBelow25 = Math.min(totalBoostLevels, 20); // Levels 5-24 = 20 boost levels
    const boostLevelsFrom25Plus = Math.max(0, totalBoostLevels - 20);
    
    nextCapMult = Math.pow(1.5, boostLevelsBelow25) * Math.pow(1.75, boostLevelsFrom25Plus);
  } else {
    nextCapMult = Math.pow(1.5, totalBoostLevels);
  }
  
  const nextProdMult = Math.pow(prodBase, totalBoostLevels);
  
  crusherState.resety.capMultiplier = new Decimal(nextCapMult);
  crusherState.resety.productionMultiplier = new Decimal(nextProdMult);
  
  // Calculate shards multiplier if SH8 upgrade is purchased (starts at level 10+)
  if (treeUpgrades.shattery_shards) {
    const levelsAbove10 = Math.max(0, currentLevel - 9); // Starts at level 10
    const nextShardsMult = Math.pow(1.25, levelsAbove10);
    crusherState.resety.shardsMultiplier = new Decimal(nextShardsMult);
  } else {
    crusherState.resety.shardsMultiplier = new Decimal(1);
  }
  
  window.state.halloweenEvent.swandy = new Decimal(0);
  
  crusherState.score = new Decimal(0);
  crusherState.level = 1;
  
  // No need to reset multiplier states anymore - they're calculated from flags
  
  updateLevelMultipliers();
  
  initializeSwandyCrusherGrid();
  renderSwandyCrusherGrid(true);
  
  // Reset tree upgrades that use Swandy currency (keep upgrades that use swandyShards, hexedSwandyShards, and upgrade 10+11+15)
  const treePurchasedUpgrades = window.state.halloweenEvent.treeUpgrades.purchased;
  if (treePurchasedUpgrades && typeof treePurchasedUpgrades === 'object') {
    // Get all upgrade IDs that should be reset (only those using Swandy currency, not swandyShards or hexedSwandyShards)
    const upgradesToReset = [];
    
    // Need to access the actual upgrade definitions from halloween event.js
    if (typeof window.treeUpgrades !== 'undefined') {
      Object.keys(treePurchasedUpgrades).forEach(upgradeId => {
        // Look up the actual upgrade definition
        const upgradeDefinition = window.treeUpgrades[upgradeId];
        
        if (!upgradeDefinition) {
          return; // Skip if upgrade definition not found
        }
        
        // Reset only if it uses regular Swandy currency (not swandyShards or hexedSwandyShards)
        // Also keep 'crush_swandies', 'swandy_resety', and 'remote_power_recharge' since they unlock features
        // HSS upgrades (hexedSwandyShards currency) are automatically kept
        if (upgradeId !== 'crush_swandies' && 
            upgradeId !== 'swandy_resety' && 
            upgradeId !== 'remote_power_recharge' &&
            (!upgradeDefinition.costCurrency || 
             (upgradeDefinition.costCurrency !== 'swandyShards' && 
              upgradeDefinition.costCurrency !== 'hexedSwandyShards'))) {
          upgradesToReset.push(upgradeId);
        }
      });
    }
    
    // IMPORTANT: Hex progress is NOT reset! It persists through Shattery resets
    // When an upgrade is repurchased, it will restore its hex progress
    // If it was fully hexed before, it will be immediately tier 2 after purchase
    
    upgradesToReset.forEach(upgradeId => {
      delete treePurchasedUpgrades[upgradeId];
    });
  }
  
  // No need to reset flag states - they're automatically reset when upgrades are deleted above
  
  updateSwandyCrusherUI();
  if (typeof updateHalloweenUI === 'function') {
    updateHalloweenUI();
  }
  if (typeof updateTreeOfHorrorsUI === 'function') {
    updateTreeOfHorrorsUI();
  }
  if (typeof renderTreeUpgrades === 'function') {
    renderTreeUpgrades();
  }
  
  let toastMessage = `Swandy Shattery performed!`;
  if (treeUpgrades.shattery_shards) {
    const nextShardsMult = DecimalUtils.isDecimal(crusherState.resety.shardsMultiplier)
      ? crusherState.resety.shardsMultiplier.toNumber()
      : (crusherState.resety.shardsMultiplier || 1);
   
  }
  
  showToast(toastMessage, 'success');
}

// Hex Staff Feature Functions

// Check if hex staff is unlocked (Hexomancy milestone 2)
function isHexStaffUnlocked() {
  if (typeof window.state.halloweenEvent === 'undefined' || 
      typeof window.state.halloweenEvent.jadeca === 'undefined') {
    return false;
  }
  
  const jadecaState = window.state.halloweenEvent.jadeca;
  
  if (!jadecaState.hexomancyMilestones) {
    return false;
  }
  
  return jadecaState.hexomancyMilestones.milestone2 === true;
}

// Toggle hex staff on/off
function toggleHexStaff() {
  if (!window.state.halloweenEvent.swandyCrusher.hexStaff) return;
  
  const hexStaff = window.state.halloweenEvent.swandyCrusher.hexStaff;
  hexStaff.enabled = !hexStaff.enabled;
  
  updateHexStaffCursor();
  updateSwandyBreakerUI();
}

// Select hex staff mode (normal, blaster, orb)
function selectHexStaffMode(mode) {
  if (!window.state.halloweenEvent.swandyCrusher.hexStaff) return;
  
  const hexStaff = window.state.halloweenEvent.swandyCrusher.hexStaff;
  hexStaff.selectedMode = mode;
  updateSwandyBreakerUI();
}

// Update cursor based on hex staff state
function updateHexStaffCursor() {
  if (!window.state.halloweenEvent.swandyCrusher.hexStaff) return;
  
  const hexStaff = window.state.halloweenEvent.swandyCrusher.hexStaff;
  
  // Apply cursor to all Halloween event tab containers
  const containers = [
    document.getElementById('halloweenCrusherContent'),
    document.getElementById('halloweenHubContent'),
    document.getElementById('halloweenTreeContent'),
    document.getElementById('halloweenJadecasHutContent')
  ];
  
  containers.forEach(container => {
    if (!container) return;
    
    if (hexStaff.enabled) {
      // Set cursor with hotspot slightly down and right (makes image appear up and left)
      container.style.cursor = 'url("assets/icons/hex staff cursor.png") 24 24, auto';
    } else {
      container.style.cursor = 'default';
    }
  });
}

// Handle hex staff click on grid
function handleHexStaffClick(row, col) {
  if (!window.state.halloweenEvent.swandyCrusher.hexStaff) return false;
  
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  const hexStaff = crusherState.hexStaff;
  const grid = crusherState.grid;
  
  if (!hexStaff.enabled) return false;
  
  const mode = hexStaff.selectedMode;
  
  // Check if we have uses available for the selected mode
  if (hexStaff[mode].uses <= 0) {
    if (typeof showToast === 'function') {
      showToast(`No ${mode} break uses available!`, 'error');
    }
    return false;
  }
  
  // Show action cursor temporarily
  showHexStaffActionCursor();
  
  // Consume one use
  hexStaff[mode].uses--;
  
  // Apply effect based on mode
  if (mode === 'normal') {
    applyNormalBreak(row, col);
  } else if (mode === 'blaster') {
    applyBlasterBreak(row, col);
  } else if (mode === 'orb') {
    applyOrbBreak(row, col);
  }
  
  updateSwandyBreakerUI();
  return true;
}

// Show action cursor temporarily
function showHexStaffActionCursor() {
  // Apply to all Halloween event tab containers
  const containers = [
    document.getElementById('halloweenCrusherContent'),
    document.getElementById('halloweenHubContent'),
    document.getElementById('halloweenTreeContent'),
    document.getElementById('halloweenJadecasHutContent')
  ];
  
  // Force cursor change with important flag via inline style
  const actionCursorUrl = 'url("assets/icons/hex staff cursor action.png") 24 24, auto';
  
  containers.forEach(container => {
    if (container) {
      container.style.setProperty('cursor', actionCursorUrl, 'important');
    }
  });
  
  setTimeout(() => {
    // Clear the important flag and restore normal cursor
    containers.forEach(container => {
      if (container) {
        container.style.removeProperty('cursor');
      }
    });
    updateHexStaffCursor();
  }, 1000);
}

// Calculate total shard multiplier (same as used in normal crushing)
function getTotalShardMultiplier() {
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  
  // Level score multiplier
  const levelScoreMultiplier = DecimalUtils.isDecimal(crusherState.multipliers.scoreMultiplier)
    ? crusherState.multipliers.scoreMultiplier.toNumber()
    : (crusherState.multipliers.scoreMultiplier || 1);
  
  // Tree upgrades multiplier
  let shardsUpgradeMultiplier = 1;
  const treeUpgrades = window.state.halloweenEvent.treeUpgrades.purchased || {};
  if (treeUpgrades.shards_multi) {
    const sh1Multiplier = typeof getUpgradeHexMultiplier === 'function' 
      ? getUpgradeHexMultiplier('shards_multi') 
      : 1.5;
    shardsUpgradeMultiplier *= sh1Multiplier;
  }
  if (treeUpgrades.shards_multi_2) {
    const sh2Multiplier = typeof getUpgradeHexMultiplier === 'function' 
      ? getUpgradeHexMultiplier('shards_multi_2') 
      : 1.25;
    shardsUpgradeMultiplier *= sh2Multiplier;
  }
  if (treeUpgrades.need_more_shards) shardsUpgradeMultiplier *= 1.49;
  if (treeUpgrades.excuse_me_price_increase) shardsUpgradeMultiplier *= 2.5;
  if (treeUpgrades.recovering_from_hexion) shardsUpgradeMultiplier *= 2.5;
  if (treeUpgrades.just_out_of_reach) shardsUpgradeMultiplier *= 1.5;
  if (treeUpgrades.something_in_distance) shardsUpgradeMultiplier *= 1.5;
  if (treeUpgrades.wooden_building) shardsUpgradeMultiplier *= 1.75;
  if (treeUpgrades.someone_inside) shardsUpgradeMultiplier *= 1.5;
  if (treeUpgrades.little_bit_more_shards) shardsUpgradeMultiplier *= 5;
  if (treeUpgrades.devilish_swandy) {
    const s6Multiplier = typeof getUpgradeHexMultiplier === 'function' 
      ? getUpgradeHexMultiplier('devilish_swandy') 
      : 1.666;
    shardsUpgradeMultiplier *= s6Multiplier;
  }
  if (treeUpgrades.less_devilish_swandy) {
    const s7Multiplier = typeof getUpgradeHexMultiplier === 'function' 
      ? getUpgradeHexMultiplier('less_devilish_swandy') 
      : 1.333;
    shardsUpgradeMultiplier *= s7Multiplier;
  }
  
  // Shattery shards multiplier
  const shatteryShardsMultiplier = DecimalUtils.isDecimal(crusherState.resety.shardsMultiplier)
    ? crusherState.resety.shardsMultiplier.toNumber()
    : (crusherState.resety.shardsMultiplier || 1);
  
  // Expansion shard multiplier
  let expansionShardMultiplier = 1;
  if (treeUpgrades.expansion_shard_boost) {
    const currentGrade = DecimalUtils.isDecimal(window.state.grade) ? window.state.grade.toNumber() : (window.state.grade || 1);
    expansionShardMultiplier = 1 + (currentGrade - 1) * 0.25;
  }
  
  // Other boost multipliers
  const swandyBoostMultiplier = getSwandyShardBoostMultiplier();
  const treeAgeBoostMultiplier = getTreeAgeShardBoostMultiplier();
  const hexedShardBoostMultiplier = getHexedSwandyShardBoostMultiplier();
  
  // Hexomancy milestone multiplier (X2 per milestone starting from milestone 2)
  let hexomancyMilestoneMultiplier = 1;
  if (window.state.halloweenEvent.jadeca && window.state.halloweenEvent.jadeca.hexomancyMilestones) {
    const milestones = window.state.halloweenEvent.jadeca.hexomancyMilestones;
    if (milestones.milestone2) hexomancyMilestoneMultiplier *= 2;
    if (milestones.milestone3) hexomancyMilestoneMultiplier *= 2;
  }
  
  // Combine all multipliers
  return levelScoreMultiplier * shardsUpgradeMultiplier * shatteryShardsMultiplier * 
         expansionShardMultiplier * swandyBoostMultiplier * treeAgeBoostMultiplier * 
         hexedShardBoostMultiplier * hexomancyMilestoneMultiplier;
}

// Apply normal break effect (single tile, 20x shards, hex center tile only)
function applyNormalBreak(row, col) {
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  const grid = crusherState.grid;
  
  const cell = grid[row][col];
  if (!cell) return;
  
  // Check if the cell is a blaster or orb - activate them instead of destroying
  if (isBlasterCell(cell)) {
    // Activate the blaster instead of breaking it
    const cellType = getCellType(cell);
    const result = activateBlaster(grid, row, col, cellType, false);
    
    // Calculate shards for each cell hit by the blaster
    const baseShards = 10;
    const hexStaffMultiplier = 5; // 5x multiplier for blaster activation
    const totalMultiplier = getTotalShardMultiplier();
    let totalShardsEarned = 0;
    
    // Award shards for each cell hit and show popups
    result.cellsToRemove.forEach(cellKey => {
      const [r, c] = cellKey.split(',').map(Number);
      if (grid[r][c]) {
        const shardsForCell = baseShards * hexStaffMultiplier * totalMultiplier;
        totalShardsEarned += shardsForCell;
        
        // Show popup for this cell
        setTimeout(() => {
          showScorePopup(r, c, shardsForCell);
        }, 100);
      }
      grid[r][c] = null;
    });
    
    // Award total shards
    if (!DecimalUtils.isDecimal(crusherState.score)) {
      crusherState.score = new Decimal(crusherState.score || 0);
    }
    crusherState.score = crusherState.score.add(totalShardsEarned);
    
    // Apply gravity and refill after animation
    setTimeout(() => {
      applyGravity();
      fillEmptyCells();
      renderSwandyCrusherGrid();
      updateSwandyCrusherUI();
      
      // Check for matches after settling
      setTimeout(() => {
        if (hasMatches(grid)) {
          crusherState.isProcessing = true;
          processMatches(false);
        }
      }, 300);
    }, 600); // Wait for blaster animation
    
    // Hex only the clicked tile after everything settles
    if (isHexedTilesUnlocked()) {
      if (!crusherState.hexedPositions) {
        crusherState.hexedPositions = {};
      }
      
      setTimeout(() => {
        const posKey = `${row},${col}`;
        if (grid[row][col] && !crusherState.hexedPositions[posKey]) {
          crusherState.hexedPositions[posKey] = true;
          renderSwandyCrusherGrid();
        }
      }, 1200); // Wait for blaster animation and refill
    }
    
    return;
  }
  
  if (isOrbCell(cell)) {
    // Activate the orb with a random color instead of breaking it
    const availableColors = swandyTypes.map(type => type.id);
    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    
    // Unlock secret achievement for using hex staff on orb
    if (typeof window.unlockSecretAchievement === 'function') {
      window.unlockSecretAchievement('halloween_secret3');
    }
    
    // Await the orb activation and handle cell removal
    activateOrb(grid, row, col, randomColor, false, false, false, null).then(result => {
      // The orb already calculated and awarded shards internally (via result.totalShards)
      // Add those shards to the score
      if (result.totalShards > 0) {
        if (!DecimalUtils.isDecimal(crusherState.score)) {
          crusherState.score = new Decimal(crusherState.score || 0);
        }
        crusherState.score = crusherState.score.add(result.totalShards);
      }
      
      // Remove cells that were hit by the orb
      result.cellsToRemove.forEach(cellKey => {
        const [r, c] = cellKey.split(',').map(Number);
        grid[r][c] = null;
      });
      
      // Apply gravity and refill after orb finishes
      setTimeout(() => {
        applyGravity();
        fillEmptyCells();
        renderSwandyCrusherGrid();
        updateSwandyCrusherUI();
        
        // Check for matches after settling
        setTimeout(() => {
          if (hasMatches(grid)) {
            crusherState.isProcessing = true;
            processMatches(false);
          }
        }, 300);
      }, 200);
      
      // Hex only the clicked tile after everything settles
      if (isHexedTilesUnlocked()) {
        if (!crusherState.hexedPositions) {
          crusherState.hexedPositions = {};
        }
        
        setTimeout(() => {
          const posKey = `${row},${col}`;
          if (grid[row][col] && !crusherState.hexedPositions[posKey]) {
            crusherState.hexedPositions[posKey] = true;
            renderSwandyCrusherGrid();
          }
        }, 1000); // Wait for everything to settle
      }
    });
    
    return;
  }
  
  // Normal swandy - break it
  // Calculate shards with 20x multiplier ON TOP of existing multipliers
  const baseShards = 10;
  const hexStaffMultiplier = 20;
  const totalMultiplier = getTotalShardMultiplier();
  const shardsEarned = baseShards * hexStaffMultiplier * totalMultiplier;
  
  // Award shards
  if (!DecimalUtils.isDecimal(crusherState.score)) {
    crusherState.score = new Decimal(crusherState.score || 0);
  }
  crusherState.score = crusherState.score.add(shardsEarned);
  
  // Show popup
  showScorePopup(row, col, shardsEarned);
  
  // Visual effect
  const cellElement = document.querySelector(`.swandy-cell[data-row="${row}"][data-col="${col}"]`);
  if (cellElement) {
    cellElement.classList.add('hex-staff-break');
    createShatterEffect(cellElement, row, col);
  }
  
  // Remove cell
  grid[row][col] = null;
  
  // Hex only the center tile (clicked tile) if hexed tiles feature is unlocked
  if (isHexedTilesUnlocked()) {
    if (!crusherState.hexedPositions) {
      crusherState.hexedPositions = {};
    }
    
    // Only hex the clicked position after new tile falls
    setTimeout(() => {
      const posKey = `${row},${col}`;
      if (grid[row][col] && !crusherState.hexedPositions[posKey]) {
        crusherState.hexedPositions[posKey] = true;
        renderSwandyCrusherGrid();
      }
    }, 550); // Wait for gravity and refill to complete
  }
  
  // Apply gravity and refill after delay
  setTimeout(() => {
    applyGravity();
    fillEmptyCells();
    renderSwandyCrusherGrid();
    updateSwandyCrusherUI();
    
    // Check for matches
    setTimeout(() => {
      if (hasMatches(grid)) {
        crusherState.isProcessing = true;
        processMatches(false);
      }
    }, 300);
  }, 500);
}

// Apply blaster break effect (row or column, 5x shards)
function applyBlasterBreak(row, col) {
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  const grid = crusherState.grid;
  const gridElement = document.getElementById('swandyCrusherGrid');
  
  // Create visual beams for both horizontal and vertical
  if (gridElement) {
    createBlasterBeam(gridElement, row, col, 'horizontal');
    setTimeout(() => {
      createBlasterBeam(gridElement, row, col, 'vertical');
    }, 100);
  }
  
  const cellsToRemove = [];
  const shardsMultiplier = 5;
  
  // Add all cells in the row
  for (let c = 0; c < GRID_SIZE; c++) {
    if (grid[row][c]) {
      cellsToRemove.push({ row, col: c });
    }
  }
  
  // Add all cells in the column (excluding center tile to avoid duplicate)
  for (let r = 0; r < GRID_SIZE; r++) {
    if (r !== row && grid[r][col]) {
      cellsToRemove.push({ row: r, col });
    }
  }
  
  // Calculate and award shards with 5x multiplier ON TOP of existing multipliers
  const baseShards = 10;
  const hexStaffMultiplier = 5;
  const totalMultiplier = getTotalShardMultiplier();
  let totalShards = 0;
  
  // Hex all affected tiles if feature is unlocked
  if (isHexedTilesUnlocked()) {
    if (!crusherState.hexedPositions) {
      crusherState.hexedPositions = {};
    }
  }
  
  cellsToRemove.forEach(pos => {
    const shardsEarned = baseShards * hexStaffMultiplier * totalMultiplier;
    totalShards += shardsEarned;
    showScorePopup(pos.row, pos.col, shardsEarned);
    
    const cellElement = document.querySelector(`.swandy-cell[data-row="${pos.row}"][data-col="${pos.col}"]`);
    if (cellElement) {
      cellElement.classList.add('hex-staff-break');
      createShatterEffect(cellElement, pos.row, pos.col);
    }
    
    grid[pos.row][pos.col] = null;
  });
  
  if (!DecimalUtils.isDecimal(crusherState.score)) {
    crusherState.score = new Decimal(crusherState.score || 0);
  }
  crusherState.score = crusherState.score.add(totalShards);
  
  // Apply gravity and refill after delay
  setTimeout(() => {
    applyGravity();
    fillEmptyCells();
    
    // Now hex the newly filled tiles in the affected positions
    if (isHexedTilesUnlocked()) {
      cellsToRemove.forEach(pos => {
        const posKey = `${pos.row},${pos.col}`;
        if (grid[pos.row][pos.col]) {
          crusherState.hexedPositions[posKey] = true;
        }
      });
    }
    
    renderSwandyCrusherGrid();
    updateSwandyCrusherUI();
    
    // Check for matches
    setTimeout(() => {
      if (hasMatches(grid)) {
        crusherState.isProcessing = true;
        processMatches(false);
      }
    }, 300);
  }, 500);
}

// Apply orb break effect (break all swandies of target color and hex 3x3 around each)
async function applyOrbBreak(row, col) {
  const crusherState = window.state.halloweenEvent.swandyCrusher;
  const grid = crusherState.grid;
  
  const cell = grid[row][col];
  if (!cell) return;
  
  const targetColor = getCellType(cell);
  console.log('[ORB BREAK] Breaking all', targetColor, 'swandies');
  
  // Find all cells of this color
  const targetPositions = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const gridCell = grid[r][c];
      if (gridCell && getCellType(gridCell) === targetColor) {
        targetPositions.push({ row: r, col: c });
      }
    }
  }
  
  console.log('[ORB BREAK] Found', targetPositions.length, 'swandies to break');
  
  // Calculate shard rewards with multipliers
  const totalShardMultiplier = getTotalShardMultiplier();
  const shardsPerSwandy = 20 * totalShardMultiplier; // 20x base for orb break
  const totalShards = shardsPerSwandy * targetPositions.length;
  
  // Award shards
  crusherState.swandyShards = DecimalUtils.add(
    crusherState.swandyShards,
    totalShards
  );
  
  console.log('[ORB BREAK] Awarding', totalShards, 'swandy shards');
  
  // Determine which tiles to hex (3x3 around each target swandy)
  const tilesToHex = new Set();
  if (isHexedTilesUnlocked()) {
    for (const pos of targetPositions) {
      // Hex 3x3 area around this swandy
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const hexRow = pos.row + dr;
          const hexCol = pos.col + dc;
          
          if (hexRow >= 0 && hexRow < GRID_SIZE && hexCol >= 0 && hexCol < GRID_SIZE) {
            tilesToHex.add(`${hexRow},${hexCol}`);
          }
        }
      }
    }
    console.log('[ORB BREAK] Will hex', tilesToHex.size, 'tiles');
  }
  
  // Animate the target swandies
  const gridElement = document.getElementById('swandyCrusherGrid');
  
  targetPositions.forEach(pos => {
    const element = gridElement?.children[pos.row * GRID_SIZE + pos.col];
    if (element) {
      element.classList.add('orb-activating');
    }
  });
  
  // Explode and show popups
  setTimeout(() => {
    targetPositions.forEach(pos => {
      const element = gridElement?.children[pos.row * GRID_SIZE + pos.col];
      if (element) {
        element.classList.add('orb-exploding');
      }
      showScorePopup(pos.row, pos.col, shardsPerSwandy);
    });
  }, 300);
  
  // Remove all target swandies
  setTimeout(() => {
    targetPositions.forEach(pos => {
      grid[pos.row][pos.col] = null;
    });
    
    renderSwandyCrusherGrid();
    
    // Apply gravity
    applyGravity();
    
    setTimeout(() => {
      // Now hex the tiles (after gravity, tiles have settled)
      if (isHexedTilesUnlocked()) {
        if (!crusherState.hexedPositions) {
          crusherState.hexedPositions = {};
        }
        
        tilesToHex.forEach(posKey => {
          crusherState.hexedPositions[posKey] = true;
        });
        
        console.log('[ORB BREAK] Hexed', tilesToHex.size, 'tiles');
      }
      
      fillEmptyCells();
      renderSwandyCrusherGrid();
      updateSwandyCrusherUI();
      
      // Check for matches after a delay
      setTimeout(() => {
        if (hasMatches(grid)) {
          crusherState.isProcessing = true;
          processMatches(false);
        } else {
          crusherState.isProcessing = false;
        }
      }, 300);
    }, 550);
  }, 800);
}

// Update Swandy Breaker UI
function updateSwandyBreakerUI() {
  const card = document.getElementById('swandyBreakerCard');
  
  if (!card) return;
  
  // Check if hexStaff exists, initialize if needed but milestone is unlocked
  if (!window.state.halloweenEvent.swandyCrusher.hexStaff) {
    if (isHexStaffUnlocked()) {
      // Initialize hex staff state if unlocked but not yet created
      window.state.halloweenEvent.swandyCrusher.hexStaff = {
        enabled: false,
        selectedMode: 'normal',
        normal: { progress: 0, required: 50, uses: 0, maxUses: 3 },
        blaster: { progress: 0, required: 10, uses: 0, maxUses: 3 },
        orb: { progress: 0, required: 5, uses: 0, maxUses: 3 }
      };
    } else {
      card.style.display = 'none';
      return;
    }
  }
  
  // Show/hide card based on unlock
  if (!isHexStaffUnlocked()) {
    card.style.display = 'none';
    return;
  }
  
  const hexStaff = window.state.halloweenEvent.swandyCrusher.hexStaff;
  
  card.style.display = 'block';
  
  // Update progress bars
  ['normal', 'blaster', 'orb'].forEach(mode => {
    const progressBar = document.getElementById(`hexStaff${mode.charAt(0).toUpperCase() + mode.slice(1)}Progress`);
    const progressText = document.getElementById(`hexStaff${mode.charAt(0).toUpperCase() + mode.slice(1)}Text`);
    const usesText = document.getElementById(`hexStaff${mode.charAt(0).toUpperCase() + mode.slice(1)}Uses`);
    
    if (progressBar && progressText && usesText && hexStaff[mode]) {
      const progress = hexStaff[mode].progress;
      const required = hexStaff[mode].required;
      const uses = hexStaff[mode].uses;
      const maxUses = hexStaff[mode].maxUses;
      
      const percentage = Math.min((progress / required) * 100, 100);
      progressBar.style.width = `${percentage}%`;
      progressText.textContent = `${progress}/${required}`;
      usesText.textContent = `${uses}/${maxUses} uses`;
    }
  });
  
  // Update toggle button
  const toggleBtn = document.getElementById('hexStaffToggleBtn');
  if (toggleBtn && hexStaff.enabled !== undefined) {
    toggleBtn.classList.toggle('active', hexStaff.enabled);
  }
  
  // Update mode selection buttons
  if (hexStaff.selectedMode) {
    ['normal', 'blaster', 'orb'].forEach(mode => {
      const btn = document.getElementById(`hexStaffMode${mode.charAt(0).toUpperCase() + mode.slice(1)}`);
      if (btn) {
        btn.classList.toggle('active', hexStaff.selectedMode === mode);
      }
    });
  }
}

// Make functions globally accessible
window.initializeSwandyCrusher = initializeSwandyCrusher;
window.renderSwandyCrusherGrid = renderSwandyCrusherGrid;
window.updateSwandyCrusherUI = updateSwandyCrusherUI;
window.performSwandyResety = performSwandyResety;
window.openSwandyResetyModal = openSwandyResetyModal;
window.closeSwandyResetyModal = closeSwandyResetyModal;
window.confirmSwandyResety = confirmSwandyResety;
window.performShatteringSequence = performShatteringSequence;
window.performSwandyResetyReset = performSwandyResetyReset;
window.getSwandyShardBoostMultiplier = getSwandyShardBoostMultiplier;
window.getTreeAgeShardBoostMultiplier = getTreeAgeShardBoostMultiplier;
window.getHexedSwandyShardBoostMultiplier = getHexedSwandyShardBoostMultiplier;
window.createSwandyCell = createSwandyCell;
window.getCellType = getCellType;
window.isBlasterCell = isBlasterCell;
window.isOrbCell = isOrbCell;
window.isBlasterUnlocked = isBlasterUnlocked;
window.isOrbUnlocked = isOrbUnlocked;
window.shouldCreateBlaster = shouldCreateBlaster;
window.shouldCreateOrb = shouldCreateOrb;
window.getBlasterDirection = getBlasterDirection;
window.activateBlaster = activateBlaster;
window.activateOrb = activateOrb;
window.activateDoubleBlaster = activateDoubleBlaster;
window.createBlasterBeam = createBlasterBeam;
window.createOrbExplosion = createOrbExplosion;
window.createShockwaveEffect = createShockwaveEffect;
window.swandyTypes = swandyTypes;
window.isHexedTilesUnlocked = isHexedTilesUnlocked;
window.triggerHexedTileSpawn = triggerHexedTileSpawn;
window.createHexagonProjectile = createHexagonProjectile;
window.isHexStaffUnlocked = isHexStaffUnlocked;
window.toggleHexStaff = toggleHexStaff;
window.selectHexStaffMode = selectHexStaffMode;
window.updateHexStaffCursor = updateHexStaffCursor;
window.handleHexStaffClick = handleHexStaffClick;
window.updateSwandyBreakerUI = updateSwandyBreakerUI;
window.checkAllTilesHexed = checkAllTilesHexed;

// Test function to temporarily enable hex staff (for debugging)
window.testUnlockHexStaff = function() {
  if (!window.state.halloweenEvent.jadeca) {
    window.state.halloweenEvent.jadeca = { hexomancyMilestones: {} };
  }
  if (!window.state.halloweenEvent.jadeca.hexomancyMilestones) {
    window.state.halloweenEvent.jadeca.hexomancyMilestones = {};
  }
  window.state.halloweenEvent.jadeca.hexomancyMilestones.milestone1 = true;
  updateSwandyBreakerUI();

};

window.spawnOrb = function(row, col, color = null) {
  const crusherState = window.state?.halloweenEvent?.swandyCrusher;
  if (!crusherState || !crusherState.grid) {
    return;
  }
  
  const gridSize = 8;
  
  if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
    return;
  }
  
  const colors = ['yellow', 'blue', 'green', 'red', 'purple', 'orange'];
  const targetColor = color || colors[Math.floor(Math.random() * colors.length)];
  
  if (!colors.includes(targetColor)) {
    return;
  }
  
  crusherState.grid[row][col] = createSwandyCell(targetColor, false, null, true);
  renderSwandyCrusherGrid();
  
};

// Test function: Hex all tiles in the grid (for testing the secret achievement)
window.testHexAllTiles = function() {
  console.log('[TEST] Hexing all tiles...');
  
  const crusherState = window.state?.halloweenEvent?.swandyCrusher;
  if (!crusherState) {
    console.error('[TEST] Crusher state not initialized!');
    return;
  }
  
  if (!isHexedTilesUnlocked()) {
    console.error('[TEST] Hexed tiles feature not unlocked! Need S10 fully hexed.');
    return;
  }
  
  if (!crusherState.hexedPositions) {
    crusherState.hexedPositions = {};
  }
  
  // Hex all 64 tiles
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      crusherState.hexedPositions[`${row},${col}`] = true;
    }
  }
  
 
  renderSwandyCrusherGrid();

};

// Test function: Create a horizontal row of 7 same-colored swandies
window.testCreateSevenRow = function(row = 3, startCol = 0, color = null) {

  
  const crusherState = window.state?.halloweenEvent?.swandyCrusher;
  if (!crusherState || !crusherState.grid) {

    return;
  }
  
  const gridSize = 8;
  
  if (row < 0 || row >= gridSize || startCol < 0 || startCol + 7 > gridSize) {

    return;
  }
  
  const colors = ['yellow', 'blue', 'green', 'red', 'purple', 'orange', 'white'];
  const targetColor = color || colors[Math.floor(Math.random() * colors.length)];
  
  if (!colors.includes(targetColor)) {
  
    return;
  }
  
  
  
  // Create 7 same-colored swandies in a row
  for (let i = 0; i < 7; i++) {
    crusherState.grid[row][startCol + i] = createSwandyCell(targetColor, false, null, false);
  }
  
  renderSwandyCrusherGrid();

};

// Debug function: Check current orb/blaster requirements
window.checkOrbBlasterRequirements = function() {

  const treeUpgrades = window.state.halloweenEvent.treeUpgrades.purchased || {};
  
  
};


