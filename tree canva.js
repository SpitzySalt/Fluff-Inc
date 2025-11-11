// Tree of Horrors Canvas Rendering System
// This file handles all upgrade node generation and positioning for the Halloween Tree
//
// HOW TO ADD NEW UPGRADES:
// 1. Add upgrade definition to treeUpgrades object in halloween event.js
// 2. Add position and connection info to treeUpgradeLayout below
// 3. Use addConnectionLine() to create connecting lines between upgrades
// 4. Call renderTreeUpgrades() to refresh the display
// 5. (Optional) Add hex effect description to upgradeHexEffects below

// Manual mapping for upgrade labels (overrides automatic ordering)
window.upgradeLabelMapping = {
  'swandy_start': 'S1',
  'swandy_multiply': 'S2',
  'need_more_swandies': 'S3',
  'tree_game_upgrade': 'S4',
  'kp_boost_upgrade': 'S5',
  'devilish_swandy': 'S6',
  'less_devilish_swandy': 'S7',
  'worst_upgrades': 'S8',
  'revolution_upcoming': 'S9',
  'crush_swandies': 'S10',
  'swandy_resety': 'S11',
  'swandies_boost_shards': 'S12',
  'need_more_shards': 'S13',
  'just_out_of_reach': 'S14',
  'remote_power_recharge': 'S15',
  'something_in_distance': 'S16',
  'wooden_building': 'S17',
  'witch_hut': 'S18',
  'someone_inside': 'S19',
  'break_in': 'S20',
  'excuse_me_price_increase': 'S21',
  'recovering_from_hexion': 'S22',
  'shards_multi': 'SH1',
  'shards_multi_2': 'SH2',
  'super_shard_multi': 'SH3',
  'combo_breaker': 'SH4',
  'stronger_shattery_prod': 'SH5',
  'swandy_blaster': 'SH6',
  'blaster_requirement_5': 'SH7',
  'shattery_shards': 'SH8',
  'expansion_shard_boost': 'SH9',
  'ultimate_swandy_orb': 'SH10',
  'orb_requirement_8': 'SH11',
  'little_bit_more_shards': 'SH12',
  'second_half_key': 'SH13',
  'tree_age_shard_boost': 'SH14',
  'extending_softcap': 'SH15',
  'hexed_shard_multi_1': 'HSS1'
};

// Hex effect descriptions - displayed when upgrade is fully hexed
// Add new entries here to automatically show secondary descriptions
window.upgradeHexEffects = {
  'swandy_start': 'Start aging the tree of horrors',
  'swandy_multiply': 'Swandy cap increased by 1.5x',
  'need_more_swandies': 'Another 1.5x to swandy cap',
  'tree_game_upgrade': 'Tree age is finaly usefull, Tree age boost swandy gain',
  'kp_boost_upgrade': 'Tree age boost swandy cap!',
  'devilish_swandy': 'X6.66 to swandy shards',
  'less_devilish_swandy': 'X3.33 to swandy shards',
  'shards_multi': 'Have even more swandy shards, 1.5X',
  'shards_multi_2': 'Hexes effects can still boost hexed swandy shard, X1.5 to HSS',
  'worst_upgrades': '2.22X to swandy shards',
  'revolution_upcoming': '1.111^ to swandy shards gain',
  'crush_swandies': 'You\'ve hexed the swandy crusher, hexed tiles can now spawn'
  // Add more hex effects here as needed:
  // 'upgrade_id': 'Description text when fully hexed'
};

// Initialize tree canvas state in window.state
function initializeTreeCanvasState() {
  if (!window.state.halloweenEvent) {
    window.state.halloweenEvent = {};
  }
  
  if (!window.state.halloweenEvent.treeCanvas) {
    window.state.halloweenEvent.treeCanvas = {
      position: { x: 0, y: 0 },
      zoom: 1,
      layoutVersion: 1 // For future compatibility if we change the layout
    };
  }
  
  // Ensure position and zoom are valid numbers
  if (typeof window.state.halloweenEvent.treeCanvas.position.x !== 'number') {
    window.state.halloweenEvent.treeCanvas.position.x = 0;
  }
  if (typeof window.state.halloweenEvent.treeCanvas.position.y !== 'number') {
    window.state.halloweenEvent.treeCanvas.position.y = 0;
  }
  if (typeof window.state.halloweenEvent.treeCanvas.zoom !== 'number') {
    window.state.halloweenEvent.treeCanvas.zoom = 1;
  }
}

// Tree upgrade definitions with positioning and connections
const treeUpgradeLayout = {
  'swandy_start': {
    position: { x: 200, y: 100 },
    connections: ['swandy_multiply']
  },
  'swandy_multiply': {
    position: { x: 200, y: 500 },
    connections: ['need_more_swandies'],
    prerequisite: 'swandy_start'
  },
  'need_more_swandies': {
    position: { x: 200, y: 900 },
    connections: ['tree_game_upgrade', 'kp_boost_upgrade', 'crush_swandies'],
    prerequisite: 'swandy_multiply'
  },
  'tree_game_upgrade': {
    position: { x: -350, y: 900 },
    connections: ['devilish_swandy', 'worst_upgrades'],
    prerequisite: 'swandy_multiply',
    visibilityPrerequisite: 'swandy_multiply',
    unlockPrerequisite: 'need_more_swandies'
  },
  'kp_boost_upgrade': {
    position: { x: 750, y: 900 },
    connections: ['less_devilish_swandy', 'revolution_upcoming'],
    prerequisite: 'swandy_multiply',
    visibilityPrerequisite: 'swandy_multiply',
    unlockPrerequisite: 'need_more_swandies'
  },
  'devilish_swandy': {
    position: { x: -350, y: 500 },
    connections: [],
    prerequisite: 'tree_game_upgrade',
    visibilityPrerequisite: 'tree_game_upgrade',
    unlockPrerequisite: 'tree_game_upgrade'
  },
  'less_devilish_swandy': {
    position: { x: 750, y: 500 },
    connections: [],
    prerequisite: 'kp_boost_upgrade',
    visibilityPrerequisite: 'kp_boost_upgrade',
    unlockPrerequisite: 'kp_boost_upgrade'
  },
  'worst_upgrades': {
    position: { x: -900, y: 500 },
    connections: ['need_more_shards'],
    prerequisite: 'tree_game_upgrade',
    visibilityPrerequisite: 'tree_game_upgrade',
    unlockPrerequisite: 'tree_game_upgrade'
  },
  'need_more_shards': {
    position: { x: -900, y: 100 },
    connections: ['excuse_me_price_increase'],
    prerequisite: 'worst_upgrades',
    visibilityPrerequisite: 'worst_upgrades',
    unlockPrerequisite: 'worst_upgrades'
  },
  'excuse_me_price_increase': {
    position: { x: -1450, y: 100 },
    connections: ['recovering_from_hexion'],
    prerequisite: 'need_more_shards',
    visibilityPrerequisite: 'need_more_shards',
    unlockPrerequisite: 'need_more_shards'
  },
  'recovering_from_hexion': {
    position: { x: -1450, y: -300 },
    connections: [],
    prerequisite: 'excuse_me_price_increase',
    visibilityPrerequisite: 'excuse_me_price_increase',
    unlockPrerequisite: 'excuse_me_price_increase'
  },
  'revolution_upcoming': {
    position: { x: 1300, y: 500 },
    connections: ['just_out_of_reach'],
    prerequisite: 'kp_boost_upgrade',
    visibilityPrerequisite: 'kp_boost_upgrade',
    unlockPrerequisite: 'kp_boost_upgrade'
  },
  'just_out_of_reach': {
    position: { x: 1300, y: 100 },
    connections: [],
    prerequisite: 'revolution_upcoming',
    visibilityPrerequisite: 'revolution_upcoming',
    unlockPrerequisite: 'revolution_upcoming'
  },
  'crush_swandies': {
    position: { x: 200, y: 1300 },
    connections: ['swandy_resety', 'shards_multi', 'hexed_shard_multi_1'],
    prerequisite: 'need_more_swandies',
    visibilityPrerequisite: 'need_more_swandies',
    unlockPrerequisite: 'need_more_swandies'
  },
  'hexed_shard_multi_1': {
    position: { x: -900, y: 1300 },
    connections: [],
    prerequisite: 'crush_swandies',
    hexedVisibilityPrerequisite: 'crush_swandies',
    unlockPrerequisite: 'crush_swandies'
  },
  'swandy_resety': {
    position: { x: 200, y: 1700 },
    connections: ['swandies_boost_shards'],
    prerequisite: 'crush_swandies',
    visibilityPrerequisite: 'crush_swandies',
    unlockPrerequisite: 'crush_swandies'
  },
  'swandies_boost_shards': {
    position: { x: 200, y: 2100 },
    connections: ['remote_power_recharge'],
    prerequisite: 'swandy_resety',
    visibilityPrerequisite: 'swandy_resety',
    unlockPrerequisite: 'swandy_resety'
  },
  'remote_power_recharge': {
    position: { x: 200, y: 2500 },
    connections: ['something_in_distance'],
    prerequisite: 'swandies_boost_shards',
    visibilityPrerequisite: 'swandies_boost_shards',
    unlockPrerequisite: 'swandies_boost_shards'
  },
  'something_in_distance': {
    position: { x: 200, y: 2900 },
    connections: ['wooden_building'],
    prerequisite: 'remote_power_recharge',
    visibilityPrerequisite: 'remote_power_recharge',
    unlockPrerequisite: 'remote_power_recharge'
  },
  'wooden_building': {
    position: { x: 200, y: 3300 },
    connections: ['break_in', 'witch_hut', 'someone_inside'],
    prerequisite: 'something_in_distance',
    visibilityPrerequisite: 'something_in_distance',
    unlockPrerequisite: 'something_in_distance'
  },
  'witch_hut': {
    position: { x: -350, y: 3300 },
    connections: [],
    prerequisite: 'wooden_building',
    visibilityPrerequisite: 'wooden_building',
    unlockPrerequisite: 'wooden_building'
  },
  'someone_inside': {
    position: { x: 750, y: 3300 },
    connections: [],
    prerequisite: 'wooden_building',
    visibilityPrerequisite: 'wooden_building',
    unlockPrerequisite: 'wooden_building'
  },
  'break_in': {
    position: { x: 200, y: 3700 },
    connections: [],
    prerequisite: 'wooden_building',
    visibilityPrerequisite: 'wooden_building',
    unlockPrerequisite: 'wooden_building'
  },
  'shards_multi': {
    position: { x: 1300, y: 1300 },
    connections: ['shards_multi_2'],
    prerequisite: 'crush_swandies',
    visibilityPrerequisite: 'crush_swandies',
    unlockPrerequisite: 'crush_swandies'
  },
  'shards_multi_2': {
    position: { x: 1850, y: 1300 },
    connections: ['super_shard_multi'],
    prerequisite: 'shards_multi',
    visibilityPrerequisite: 'shards_multi',
    unlockPrerequisite: 'shards_multi'
  },
  'super_shard_multi': {
    position: { x: 2400, y: 1300 },
    connections: ['combo_breaker', 'stronger_shattery_prod', 'swandy_blaster'],
    prerequisite: 'shards_multi_2',
    visibilityPrerequisite: 'shards_multi_2',
    unlockPrerequisite: 'shards_multi_2'
  },
  'combo_breaker': {
    position: { x: 2400, y: 900 },
    connections: ['shattery_shards'],
    prerequisite: 'super_shard_multi',
    visibilityPrerequisite: 'super_shard_multi',
    unlockPrerequisite: 'super_shard_multi'
  },
  'stronger_shattery_prod': {
    position: { x: 2400, y: 1700 },
    connections: ['expansion_shard_boost'],
    prerequisite: 'super_shard_multi',
    visibilityPrerequisite: 'super_shard_multi',
    unlockPrerequisite: 'super_shard_multi'
  },
  'expansion_shard_boost': {
    position: { x: 2400, y: 2100 },
    connections: ['little_bit_more_shards'],
    prerequisite: 'stronger_shattery_prod',
    visibilityPrerequisite: 'stronger_shattery_prod',
    unlockPrerequisite: 'stronger_shattery_prod'
  },
  'little_bit_more_shards': {
    position: { x: 2950, y: 2100 },
    connections: ['second_half_key'],
    prerequisite: 'expansion_shard_boost',
    visibilityPrerequisite: 'expansion_shard_boost',
    unlockPrerequisite: 'expansion_shard_boost'
  },
  'second_half_key': {
    position: { x: 3500, y: 2100 },
    connections: [],
    prerequisite: 'little_bit_more_shards',
    visibilityPrerequisite: 'little_bit_more_shards',
    unlockPrerequisite: 'little_bit_more_shards'
  },
  'swandy_blaster': {
    position: { x: 2950, y: 1300 },
    connections: ['blaster_requirement_5'],
    prerequisite: 'super_shard_multi',
    visibilityPrerequisite: 'super_shard_multi',
    unlockPrerequisite: 'super_shard_multi'
  },
  'blaster_requirement_5': {
    position: { x: 3500, y: 1300 },
    connections: [],
    prerequisite: 'swandy_blaster',
    visibilityPrerequisite: 'swandy_blaster',
    unlockPrerequisite: 'swandy_blaster'
  },
  'shattery_shards': {
    position: { x: 2400, y: 500 },
    connections: ['ultimate_swandy_orb'],
    prerequisite: 'combo_breaker',
    visibilityPrerequisite: 'combo_breaker',
    unlockPrerequisite: 'combo_breaker'
  },
  'ultimate_swandy_orb': {
    position: { x: 2950, y: 500 },
    connections: ['orb_requirement_8'],
    prerequisite: 'shattery_shards',
    visibilityPrerequisite: 'shattery_shards',
    unlockPrerequisite: 'shattery_shards'
  },
  'orb_requirement_8': {
    position: { x: 3500, y: 500 },
    connections: ['tree_age_shard_boost'],
    prerequisite: 'ultimate_swandy_orb',
    visibilityPrerequisite: 'ultimate_swandy_orb',
    unlockPrerequisite: 'ultimate_swandy_orb'
  },
  'tree_age_shard_boost': {
    position: { x: 3500, y: 100 },
    connections: ['extending_softcap'],
    prerequisite: 'orb_requirement_8',
    visibilityPrerequisite: 'orb_requirement_8',
    unlockPrerequisite: 'orb_requirement_8'
  },
  'extending_softcap': {
    position: { x: 3500, y: -300 },
    connections: [],
    prerequisite: 'tree_age_shard_boost',
    visibilityPrerequisite: 'tree_age_shard_boost',
    unlockPrerequisite: 'tree_age_shard_boost'
  }
};

// Connection line definitions (will be dynamically calculated)
const connectionLines = [
  {
    id: 'connection_s1_s2',
    from: 'swandy_start',
    to: 'swandy_multiply'
  },
  {
    id: 'connection_s2_s3',
    from: 'swandy_multiply',
    to: 'need_more_swandies'
  },
  {
    id: 'connection_s3_s4',
    from: 'need_more_swandies',
    to: 'tree_game_upgrade'
  },
  {
    id: 'connection_s3_s5',
    from: 'need_more_swandies',
    to: 'kp_boost_upgrade'
  },
  {
    id: 'connection_s4_s6',
    from: 'tree_game_upgrade',
    to: 'devilish_swandy'
  },
  {
    id: 'connection_s5_s7',
    from: 'kp_boost_upgrade',
    to: 'less_devilish_swandy'
  },
  {
    id: 'connection_s4_s8',
    from: 'tree_game_upgrade',
    to: 'worst_upgrades'
  },
  {
    id: 'connection_s8_s13',
    from: 'worst_upgrades',
    to: 'need_more_shards'
  },
  {
    id: 'connection_s13_s21',
    from: 'need_more_shards',
    to: 'excuse_me_price_increase'
  },
  {
    id: 'connection_s21_s22',
    from: 'excuse_me_price_increase',
    to: 'recovering_from_hexion'
  },
  {
    id: 'connection_s5_s9',
    from: 'kp_boost_upgrade',
    to: 'revolution_upcoming'
  },
  {
    id: 'connection_s9_s14',
    from: 'revolution_upcoming',
    to: 'just_out_of_reach'
  },
  {
    id: 'connection_s3_s10',
    from: 'need_more_swandies',
    to: 'crush_swandies'
  },
  {
    id: 'connection_s10_s11',
    from: 'crush_swandies',
    to: 'swandy_resety'
  },
  {
    id: 'connection_s11_s12',
    from: 'swandy_resety',
    to: 'swandies_boost_shards'
  },
  {
    id: 'connection_s12_s15',
    from: 'swandies_boost_shards',
    to: 'remote_power_recharge'
  },
  {
    id: 'connection_s15_s16',
    from: 'remote_power_recharge',
    to: 'something_in_distance'
  },
  {
    id: 'connection_s16_s17',
    from: 'something_in_distance',
    to: 'wooden_building'
  },
  {
    id: 'connection_s17_s18',
    from: 'wooden_building',
    to: 'witch_hut'
  },
  {
    id: 'connection_s17_s19',
    from: 'wooden_building',
    to: 'someone_inside'
  },
  {
    id: 'connection_s17_s20',
    from: 'wooden_building',
    to: 'break_in'
  },
  {
    id: 'connection_s10_sh1',
    from: 'crush_swandies',
    to: 'shards_multi'
  },
  {
    id: 'connection_s10_hss1',
    from: 'crush_swandies',
    to: 'hexed_shard_multi_1'
  },
  {
    id: 'connection_sh1_sh2',
    from: 'shards_multi',
    to: 'shards_multi_2'
  },
  {
    id: 'connection_sh2_sh3',
    from: 'shards_multi_2',
    to: 'super_shard_multi'
  },
  {
    id: 'connection_sh3_sh4',
    from: 'super_shard_multi',
    to: 'combo_breaker'
  },
  {
    id: 'connection_sh4_sh8',
    from: 'combo_breaker',
    to: 'shattery_shards'
  },
  {
    id: 'connection_sh3_sh5',
    from: 'super_shard_multi',
    to: 'stronger_shattery_prod'
  },
  {
    id: 'connection_sh5_sh9',
    from: 'stronger_shattery_prod',
    to: 'expansion_shard_boost'
  },
  {
    id: 'connection_sh9_sh12',
    from: 'expansion_shard_boost',
    to: 'little_bit_more_shards'
  },
  {
    id: 'connection_sh12_sh13',
    from: 'little_bit_more_shards',
    to: 'second_half_key'
  },
  {
    id: 'connection_sh3_sh6',
    from: 'super_shard_multi',
    to: 'swandy_blaster'
  },
  {
    id: 'connection_sh6_sh7',
    from: 'swandy_blaster',
    to: 'blaster_requirement_5'
  },
  {
    id: 'connection_sh8_sh10',
    from: 'shattery_shards',
    to: 'ultimate_swandy_orb'
  },
  {
    id: 'connection_sh10_sh11',
    from: 'ultimate_swandy_orb',
    to: 'orb_requirement_8'
  },
  {
    id: 'connection_sh11_sh14',
    from: 'orb_requirement_8',
    to: 'tree_age_shard_boost'
  },
  {
    id: 'connection_sh14_sh15',
    from: 'tree_age_shard_boost',
    to: 'extending_softcap'
  }
];

// Render all tree upgrades and connections
function renderTreeUpgrades() {
  const treeNodesContainer = document.getElementById('treeNodes');
  if (!treeNodesContainer) return;
  
  // Clear existing content
  treeNodesContainer.innerHTML = '';
  
  // Render connection lines first (so they appear behind upgrades)
  renderConnectionLines();
  
  // Render upgrade nodes
  renderUpgradeNodes();
  
  // Update button states
  if (typeof updateTreeUpgradeButtons === 'function') {
    updateTreeUpgradeButtons();
  }
}

// Render all connection lines
function renderConnectionLines() {
  const treeNodesContainer = document.getElementById('treeNodes');
  
  connectionLines.forEach((connection, connectionIndex) => {
    // Check if the prerequisite upgrade (from) has been purchased
    // Only show connection lines if the previous upgrade is bought
    if (!window.state.halloweenEvent.treeUpgrades.purchased[connection.from]) {
      return; // Skip rendering this connection line
    }
    
    // Special check for connections to upgrades that require hexed prerequisites
    const toLayout = treeUpgradeLayout[connection.to];
    if (toLayout?.hexedVisibilityPrerequisite === connection.from) {
      const fromHexData = window.state.halloweenEvent.treeUpgrades.hexData?.[connection.from];
      const fromFullyHexed = fromHexData?.isFullyHexed || false;
      if (!fromFullyHexed) {
        return;
      }
    }
    
    // Calculate dynamic line style based on upgrade positions
    const calculatedStyles = calculateConnectionLine(connection.from, connection.to);
    
    if (!calculatedStyles) {
      console.warn(`Could not calculate connection line for ${connection.id}`);
      return;
    }
    
    // Handle both single line and multi-segment lines
    const stylesArray = Array.isArray(calculatedStyles) ? calculatedStyles : [calculatedStyles];
    
    stylesArray.forEach((calculatedStyle, segmentIndex) => {
      const lineElement = document.createElement('div');
      lineElement.className = 'upgrade-connection-line';
      lineElement.id = `${connection.id}_segment_${segmentIndex}`;
      
      // Apply calculated styles with z-index to place behind buttons
      lineElement.style.cssText = `
        position: absolute;
        left: ${calculatedStyle.left}px;
        top: ${calculatedStyle.top}px;
        width: ${calculatedStyle.width}px;
        height: ${calculatedStyle.height}px;
        background: ${calculatedStyle.background};
        opacity: 0.3;
        transition: opacity 0.5s ease;
        z-index: -1;
        pointer-events: none;
      `;
      
      treeNodesContainer.appendChild(lineElement);
    });
  });
}

// Render all upgrade nodes
function renderUpgradeNodes() {
  const treeNodesContainer = document.getElementById('treeNodes');
  
  // Get upgrade definitions from halloween event.js
  if (typeof treeUpgrades === 'undefined') {
    console.warn('treeUpgrades not found - make sure halloween event.js is loaded');
    // Try again after a short delay
    setTimeout(renderTreeUpgrades, 100);
    return;
  }
  
  // Render each upgrade
  Object.keys(treeUpgrades).forEach((upgradeId, index) => {
    const upgrade = treeUpgrades[upgradeId];
    const layout = treeUpgradeLayout[upgradeId];
    
    if (!layout) {
      console.warn(`No layout defined for upgrade: ${upgradeId}`);
      return;
    }
    
    // Create upgrade node container
    const nodeElement = document.createElement('div');
    nodeElement.className = 'tree-upgrade-node';
    nodeElement.id = `upgrade_${upgradeId}`;
    nodeElement.setAttribute('data-upgrade-id', upgradeId);
    
    // Set position with z-index to appear above connection lines
    nodeElement.style.cssText = `
      position: absolute;
      left: ${layout.position.x}px;
      top: ${layout.position.y}px;
      z-index: 2;
    `;
    
    // Create upgrade button
    const buttonElement = document.createElement('div');
    buttonElement.className = 'upgrade-button';
    
    // Check if this is a swandy shard upgrade and add special class
    if (upgrade.costCurrency === 'swandyShards') {
      buttonElement.classList.add('shard-upgrade');
    }
    
    // Check if this is a hexed swandy shard upgrade and add special class
    if (upgrade.costCurrency === 'hexedSwandyShards') {
      buttonElement.classList.add('hexed-shard-upgrade');
    }
    
    buttonElement.onclick = () => {
      // Only allow purchase if not already purchased, or if milestone 1 is unlocked for hexing
      const milestone1Unlocked = window.state?.halloweenEvent?.jadeca?.hexomancyMilestones?.milestone1;
      const alreadyPurchased = isPurchased;
      
      // If already purchased and milestone 1 is unlocked, ignore click (hexing is handled by mousedown)
      if (alreadyPurchased && milestone1Unlocked) {
        return;
      }
      
      if (typeof purchaseTreeUpgrade === 'function') {
        purchaseTreeUpgrade(upgradeId);
      }
    };
    
    // Create upgrade content elements
    const titleElement = document.createElement('div');
    titleElement.className = 'upgrade-title';
    
    const descriptionElement = document.createElement('div');
    descriptionElement.className = 'upgrade-description';
    
    const effectElement = document.createElement('div');
    effectElement.className = 'upgrade-effect';
    effectElement.style.display = 'none'; // Hidden by default, shown for specific upgrades
    
    const costElement = document.createElement('div');
    costElement.className = 'upgrade-cost';
    
    // Check if already purchased
    const isPurchased = window.state.halloweenEvent.treeUpgrades.purchased[upgradeId];
    
    // Check visibility prerequisite (when upgrade becomes visible but transparent)
    let isVisible = true;
    if (isPurchased) {
      // If already purchased, always show it
      isVisible = true;
    } else if (layout.hexedVisibilityPrerequisite) {
      const prereqUpgradeId = layout.hexedVisibilityPrerequisite;
      const prereqPurchased = window.state.halloweenEvent.treeUpgrades.purchased[prereqUpgradeId];
      const prereqHexData = window.state.halloweenEvent.treeUpgrades.hexData?.[prereqUpgradeId];
      const prereqFullyHexed = prereqHexData?.isFullyHexed || false;
      isVisible = prereqPurchased && prereqFullyHexed;
    } else if (layout.visibilityPrerequisite) {
      isVisible = window.state.halloweenEvent.treeUpgrades.purchased[layout.visibilityPrerequisite];
    } else if (layout.prerequisite) {
      // If no visibilityPrerequisite but has prerequisite, use prerequisite for visibility
      isVisible = window.state.halloweenEvent.treeUpgrades.purchased[layout.prerequisite];
    }
    
    // Check unlock prerequisite (when upgrade becomes fully opaque and purchasable)
    let isUnlocked = true;
    if (isPurchased) {
      // If already purchased, it's unlocked
      isUnlocked = true;
    } else if (layout.hexedVisibilityPrerequisite) {
      const prereqUpgradeId = layout.hexedVisibilityPrerequisite;
      const prereqPurchased = window.state.halloweenEvent.treeUpgrades.purchased[prereqUpgradeId];
      const prereqHexData = window.state.halloweenEvent.treeUpgrades.hexData?.[prereqUpgradeId];
      const prereqFullyHexed = prereqHexData?.isFullyHexed || false;
      isUnlocked = prereqPurchased && prereqFullyHexed;
    } else if (layout.unlockPrerequisite) {
      isUnlocked = window.state.halloweenEvent.treeUpgrades.purchased[layout.unlockPrerequisite];
    } else if (layout.prerequisite) {
      isUnlocked = window.state.halloweenEvent.treeUpgrades.purchased[layout.prerequisite];
    } else {
      isUnlocked = true; // No prerequisites means unlocked
    }
    
    if (isVisible) {
      // Show real content for visible upgrades
      titleElement.textContent = upgrade.title;
      
      // Dynamic description for swandies_boost_shards upgrade
      if (upgradeId === 'swandies_boost_shards') {
        const swandyCount = DecimalUtils.isDecimal(window.state.halloweenEvent.swandy)
          ? window.state.halloweenEvent.swandy
          : new Decimal(window.state.halloweenEvent.swandy || 0);
        
        const currentMultiplier = swandyCount.gte(10) 
          ? Math.pow(1.1, swandyCount.log10()).toFixed(2)
          : '1.00';
        
        descriptionElement.textContent = `Swandies boost shard gain by ×1.1 per 10× swandies (Currently: ×${currentMultiplier})`;
      } else if (window.upgradeHexMultiplierConfig?.[upgradeId]) {
        const config = window.upgradeHexMultiplierConfig[upgradeId];
        
        if (config.baseMultiplier !== undefined && config.maxMultiplier !== undefined) {
          try {
            const isPurchased = window.state?.halloweenEvent?.treeUpgrades?.purchased?.[upgradeId];
            if (isPurchased) {
              const multiplier = typeof getUpgradeHexMultiplier === 'function' 
                ? getUpgradeHexMultiplier(upgradeId) 
                : (config.baseMultiplier || 1);
              // Determine what the upgrade boosts based on boostType
              const boostText = config.boostType === 'shards' ? 'Swandy shard gain' : 'Swandy production';
              descriptionElement.textContent = `×${multiplier.toFixed(1)} to ${boostText}`;
            } else {
              descriptionElement.textContent = upgrade.description;
            }
          } catch (e) {
            descriptionElement.textContent = upgrade.description;
          }
        } else {
          descriptionElement.textContent = upgrade.description;
        }
      } else {
        descriptionElement.textContent = upgrade.description;
      }
      
      // Display cost based on purchase status and milestone unlock
      const milestone1Unlocked = window.state?.halloweenEvent?.jadeca?.hexomancyMilestones?.milestone1;
      
      // Debug logging for S1
      if (upgradeId === 'swandy_start') {
    
      }
      
      if (isPurchased && milestone1Unlocked) {
        // Show hex cost for purchased upgrades when milestone 1 is unlocked
        const hexCost = typeof getUpgradeHexCost === 'function' ? getUpgradeHexCost(upgradeId) : 1;
        const hexData = window.state?.halloweenEvent?.treeUpgrades?.hexData?.[upgradeId];
        
        let hexDepositedFormatted = '0';
        if (hexData?.hexDeposited) {
          const hexDeposited = DecimalUtils.isDecimal(hexData.hexDeposited) 
            ? hexData.hexDeposited 
            : new Decimal(hexData.hexDeposited || 0);
          hexDepositedFormatted = DecimalUtils.formatDecimal(hexDeposited);
        }
        
        const hexCostFormatted = DecimalUtils.isDecimal(hexCost) 
          ? DecimalUtils.formatDecimal(hexCost) 
          : hexCost;
        
        if (upgradeId === 'swandy_start') {

         
        }
        costElement.textContent = `Hex: ${hexDepositedFormatted}/${hexCostFormatted}`;
        if (upgradeId === 'swandy_start') {
        
        }
        // Set color based on whether upgrade is fully hexed
        const isFullyHexed = hexData?.isFullyHexed || false;
        costElement.style.setProperty('color', isFullyHexed ? '#ffffff' : '#b967ff', 'important');
        costElement.style.fontWeight = 'bold';
      } else {
        // Show normal cost for unpurchased upgrades (or if milestone 1 not unlocked)
        let currencyName = 'Swandy';
        if (upgrade.costCurrency === 'swandyShards') {
          currencyName = 'Swandy Shards';
        } else if (upgrade.costCurrency === 'hexedSwandyShards') {
          currencyName = 'Hexed Swandy Shards';
        }
        costElement.textContent = `Cost: ${formatUpgradeCost(upgrade.cost)} ${currencyName}`;
        costElement.style.color = ''; // Reset color
      }
      
      if (!isUnlocked) {
        // Visible but not unlocked - show as semi-transparent
        nodeElement.classList.add('semi-locked');
        buttonElement.classList.add('semi-locked');
      }
    } else {
      // Show placeholder content for invisible upgrades
      titleElement.textContent = '???';
      descriptionElement.textContent = 'Requirements not met';
      costElement.textContent = 'Cost: ???';
      
      nodeElement.classList.add('locked');
      buttonElement.classList.add('locked');
      
      // Hide the node completely if not visible
      nodeElement.style.display = 'none';
    }
    
    // Apply purchased class if upgrade is purchased
    if (isPurchased) {
      buttonElement.classList.add('purchased');
      
      // Check if milestone 1 is unlocked and upgrade can be hexed
      const milestone1Unlocked = window.state?.halloweenEvent?.jadeca?.hexomancyMilestones?.milestone1;
      if (milestone1Unlocked) {
        const hexData = window.state?.halloweenEvent?.treeUpgrades?.hexData?.[upgradeId];
        if (hexData?.isFullyHexed) {
          buttonElement.classList.add('fully-hexed');
          buttonElement.classList.remove('can-hex');
        } else {
          buttonElement.classList.add('can-hex');
          buttonElement.classList.remove('fully-hexed');
        }
      }
    }
    
    // Append elements
    buttonElement.appendChild(titleElement);
    buttonElement.appendChild(descriptionElement);
    
    // Special effect display for kp_boost_upgrade (S5)
    if (upgradeId === 'kp_boost_upgrade' && isPurchased) {
      effectElement.style.display = 'block';
      effectElement.style.color = '#4CAF50';
      effectElement.style.fontWeight = 'bold';
      effectElement.style.marginTop = '5px';
      effectElement.style.padding = '4px 8px';
      effectElement.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
      effectElement.style.borderRadius = '4px';
      
      const kp = DecimalUtils.isDecimal(window.state.knowledge)
        ? window.state.knowledge
        : new Decimal(window.state.knowledge || 0);
      
      const currentMultiplier = (1 + kp.add(1).log10() * 0.2).toFixed(2);
      
      effectElement.textContent = `Current: ×${currentMultiplier}`;
      buttonElement.appendChild(effectElement);
    }
    
    // Special effect display for swandies_boost_shards (S12)
    if (upgradeId === 'swandies_boost_shards' && isPurchased) {
      effectElement.style.display = 'block';
      effectElement.style.color = '#4CAF50';
      effectElement.style.fontWeight = 'bold';
      effectElement.style.marginTop = '5px';
      effectElement.style.padding = '4px 8px';
      effectElement.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
      effectElement.style.borderRadius = '4px';
      
      const swandyCount = DecimalUtils.isDecimal(window.state.halloweenEvent.swandy)
        ? window.state.halloweenEvent.swandy
        : new Decimal(window.state.halloweenEvent.swandy || 0);
      
      const currentMultiplier = swandyCount.gte(10) 
        ? Math.pow(1.1, swandyCount.log10()).toFixed(2)
        : '1.00';
      
      effectElement.textContent = `Current: ×${currentMultiplier}`;
      buttonElement.appendChild(effectElement);
    }
    
    // Special effect display for expansion_shard_boost (SH9)
    if (upgradeId === 'expansion_shard_boost' && isPurchased) {
      effectElement.style.display = 'block';
      effectElement.style.color = '#4CAF50';
      effectElement.style.fontWeight = 'bold';
      effectElement.style.marginTop = '5px';
      effectElement.style.padding = '4px 8px';
      effectElement.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
      effectElement.style.borderRadius = '4px';
      
      const currentGrade = DecimalUtils.isDecimal(window.state.grade) 
        ? window.state.grade.toNumber() 
        : (window.state.grade || 1);
      
      const currentMultiplier = (1 + (currentGrade - 1) * 0.25).toFixed(2);
      
      effectElement.textContent = `Current: ×${currentMultiplier}`;
      buttonElement.appendChild(effectElement);
    }
    
    // Special effect display for tree_age_shard_boost (SH14)
    if (upgradeId === 'tree_age_shard_boost' && isPurchased) {
      effectElement.style.display = 'block';
      effectElement.style.color = '#4CAF50';
      effectElement.style.fontWeight = 'bold';
      effectElement.style.marginTop = '5px';
      effectElement.style.padding = '4px 8px';
      effectElement.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
      effectElement.style.borderRadius = '4px';
      effectElement.style.border = '1px solid #4CAF50';
      
      const treeAge = window.state.halloweenEvent.treeAge || 0;
      const currentMultiplier = (1 + 0.9 * Math.log(1 + treeAge / 600)).toFixed(2);
      
      effectElement.textContent = `Current: ×${currentMultiplier}`;
      buttonElement.appendChild(effectElement);
    }
    
    // Debug: Check costElement text before appending
    if (upgradeId === 'swandy_start') {
    
    }
    
    // Add hex effect description BEFORE cost element if fully hexed
    if (isPurchased && window.state.halloweenEvent.jadeca?.hexomancyMilestones?.milestone1) {
      const hexData = window.state.halloweenEvent.treeUpgrades.hexData?.[upgradeId];
      if (hexData?.isFullyHexed) {
        // Check if this upgrade has a hex effect description defined
        const hexEffectText = window.upgradeHexEffects?.[upgradeId];
        if (hexEffectText) {
          const hexEffectElement = document.createElement('div');
          hexEffectElement.className = 'hex-effect-description';
          hexEffectElement.style.cssText = `
            color: #b967ff;
            font-size: 0.85em;
            margin-top: 8px;
            font-style: italic;
            padding: 4px 8px;
            background: rgba(138, 43, 226, 0.1);
            border-radius: 4px;
            border: 1px solid rgba(138, 43, 226, 0.3);
          `;
          
          hexEffectElement.textContent = hexEffectText;
          buttonElement.appendChild(hexEffectElement);
        }
      }
    }
    
    buttonElement.appendChild(costElement);
    
    // Add hex progress bar if upgrade is purchased and milestone 1 is unlocked
    if (isPurchased && window.state.halloweenEvent.jadeca?.hexomancyMilestones?.milestone1) {
      // Add hex progress bar
      const hexProgressContainer = document.createElement('div');
      hexProgressContainer.className = 'hex-progress-container';
      hexProgressContainer.style.cssText = `
        width: 100%;
        height: 8px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        margin-top: 8px;
        overflow: hidden;
      `;
      
      const hexProgressBar = document.createElement('div');
      hexProgressBar.id = `hex-progress-${upgradeId}`;
      hexProgressBar.className = 'hex-progress-bar';
      hexProgressBar.style.cssText = `
        width: 0%;
        height: 100%;
        background: #ffffff;
        border-radius: 4px;
        transition: width 0.1s linear;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
      `;
      
      // Initialize progress from saved data
      if (typeof window.initializeUpgradeHexData === 'function') {
        const hexDataForProgress = window.initializeUpgradeHexData(upgradeId);
        const progress = (hexDataForProgress.hexDeposited / hexDataForProgress.hexRequired) * 100;
        hexProgressBar.style.width = `${progress}%`;
      }
      
      hexProgressContainer.appendChild(hexProgressBar);
      buttonElement.appendChild(hexProgressContainer);
      
      // Add mousedown/touchstart and mouseup/touchend events for hex deposit
      buttonElement.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (typeof startHexDeposit === 'function') {
          startHexDeposit(upgradeId);
        }
      });
      
      buttonElement.addEventListener('mouseup', (e) => {
        if (typeof stopHexDeposit === 'function') {
          stopHexDeposit();
        }
      });
      
      buttonElement.addEventListener('mouseleave', (e) => {
        if (typeof stopHexDeposit === 'function') {
          stopHexDeposit();
        }
      });
      
      buttonElement.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (typeof startHexDeposit === 'function') {
          startHexDeposit(upgradeId);
        }
      });
      
      buttonElement.addEventListener('touchend', (e) => {
        if (typeof stopHexDeposit === 'function') {
          stopHexDeposit();
        }
      });
    }
    
    // Assemble the node
    nodeElement.appendChild(buttonElement);
    
    // Add hexagon overlay if upgrade has hex progress
    if (isPurchased && window.state.halloweenEvent.jadeca?.hexomancyMilestones?.milestone1) {
      if (typeof createHexagonOverlay === 'function') {
        const hexOverlay = createHexagonOverlay(upgradeId, nodeElement);
        if (hexOverlay) {
          nodeElement.appendChild(hexOverlay);
        }
      }
    }
    
    // Add to container
    treeNodesContainer.appendChild(nodeElement);
  });
}

// Helper function to format upgrade costs
function formatUpgradeCost(cost) {
  // Ensure cost is a Decimal before formatting
  const costDecimal = DecimalUtils.isDecimal(cost) ? cost : new Decimal(cost || 0);
  
  // Use DecimalUtils if available, otherwise use toString
  if (typeof DecimalUtils !== 'undefined' && DecimalUtils.formatDecimal) {
    return DecimalUtils.formatDecimal(costDecimal);
  }
  return costDecimal.toString();
}

// Function to calculate the center point of an upgrade button
function getUpgradeButtonCenter(upgradeId) {
  const layout = treeUpgradeLayout[upgradeId];
  if (!layout) {
    console.warn(`No layout found for upgrade: ${upgradeId}`);
    return null;
  }
  
  // CSS deep dive:
  // .tree-upgrade-node has margin: 10px
  // .upgrade-button has:
  //   - width: 280px (this is the content width)
  //   - border: 3px solid (adds 3px on each side = 6px total)
  //   - padding: 15px (adds 15px on each side = 30px total)
  //   - border-radius: 12px
  // So total rendered width = 280px + 6px (border) + 30px (padding) = 316px
  // But CSS width: 280px means the CONTENT area is 280px, border and padding are INSIDE
  
  const nodeMargin = 10;
  const contentWidth = 280;        // CSS width (content area)
  const contentHeight = 120;       // CSS min-height (content area)
  
  // The actual center of the RENDERED button
  // Adding small empirical adjustment for perfect visual centering
  return {
    x: layout.position.x + nodeMargin + (contentWidth / 2) + 5, // +5px empirical adjustment for perfect center
    y: layout.position.y + nodeMargin + (contentHeight / 2)
  };
}

// Function to calculate connection line between two upgrades
function calculateConnectionLine(fromUpgradeId, toUpgradeId) {
  const fromLayout = treeUpgradeLayout[fromUpgradeId];
  const toLayout = treeUpgradeLayout[toUpgradeId];
  
  if (!fromLayout || !toLayout) {
    return null;
  }
  
  // Button dimensions for calculations
  const nodeMargin = 10;
  const visualButtonWidth = 280;
  const visualButtonHeight = 120;
  
  // Calculate exact button centers and edges
  const fromButtonCenterX = fromLayout.position.x + nodeMargin + (visualButtonWidth / 2);
  const fromButtonBottomY = fromLayout.position.y + nodeMargin + visualButtonHeight;
  
  const toButtonCenterX = toLayout.position.x + nodeMargin + (visualButtonWidth / 2);
  const toButtonTopY = toLayout.position.y + nodeMargin;
  
  // Check if this is a straight vertical connection (same X position)
  if (Math.abs(fromButtonCenterX - toButtonCenterX) < 10) {
    // Vertical connection
    const connectionHeight = toButtonTopY - fromButtonBottomY;
    
    if (connectionHeight >= 0) {
      // Normal downward connection
      return [{
        left: fromButtonCenterX - 1.5,
        top: fromButtonBottomY,
        width: 3,
        height: connectionHeight,
        background: 'linear-gradient(180deg, #ff8800, #ff6600)'
      }];
    } else {
      // Upward connection (target is above source)
      const fromButtonTopY = fromLayout.position.y + nodeMargin;
      const toButtonBottomY = toLayout.position.y + nodeMargin + visualButtonHeight;
      
      return [{
        left: fromButtonCenterX - 1.5,
        top: toButtonBottomY,
        width: 3,
        height: fromButtonTopY - toButtonBottomY,
        background: 'linear-gradient(180deg, #ff8800, #ff6600)'
      }];
    }
  } else {
    // L-shaped connection (horizontal then vertical)
    const connectionHeight = toButtonTopY - fromButtonBottomY;
    
    if (connectionHeight >= 0) {
      // Normal downward L-shaped connection
      const midY = fromButtonBottomY + connectionHeight / 2;
      
      return [
        // Vertical line from source button down to midpoint
        {
          left: fromButtonCenterX - 1.5,
          top: fromButtonBottomY,
          width: 3,
          height: midY - fromButtonBottomY,
          background: 'linear-gradient(180deg, #ff8800, #ff6600)'
        },
        // Horizontal line from source X to target X
        {
          left: Math.min(fromButtonCenterX, toButtonCenterX),
          top: midY - 1.5,
          width: Math.abs(toButtonCenterX - fromButtonCenterX),
          height: 3,
          background: 'linear-gradient(90deg, #ff8800, #ff6600)'
        },
        // Vertical line from midpoint to target button
        {
          left: toButtonCenterX - 1.5,
          top: midY,
          width: 3,
          height: toButtonTopY - midY,
          background: 'linear-gradient(180deg, #ff8800, #ff6600)'
        }
      ];
    } else {
      // Upward L-shaped connection (target is above source)
      const fromButtonTopY = fromLayout.position.y + nodeMargin;
      const toButtonBottomY = toLayout.position.y + nodeMargin + visualButtonHeight;
      const midY = toButtonBottomY + (fromButtonTopY - toButtonBottomY) / 2;
      
      return [
        // Vertical line from target button down to midpoint
        {
          left: toButtonCenterX - 1.5,
          top: toButtonBottomY,
          width: 3,
          height: midY - toButtonBottomY,
          background: 'linear-gradient(180deg, #ff8800, #ff6600)'
        },
        // Horizontal line from target X to source X
        {
          left: Math.min(fromButtonCenterX, toButtonCenterX),
          top: midY - 1.5,
          width: Math.abs(toButtonCenterX - fromButtonCenterX),
          height: 3,
          background: 'linear-gradient(90deg, #ff8800, #ff6600)'
        },
        // Vertical line from midpoint to source button
        {
          left: fromButtonCenterX - 1.5,
          top: midY,
          width: 3,
          height: fromButtonTopY - midY,
          background: 'linear-gradient(180deg, #ff8800, #ff6600)'
        }
      ];
    }
  }
}

// Save current canvas position and zoom to state
function saveCanvasState() {
  if (!window.state.halloweenEvent || !window.state.halloweenEvent.treeCanvas) {
    return;
  }
  
  // Get current canvas state from halloween event.js treeCanvasState
  if (typeof treeCanvasState !== 'undefined') {
    window.state.halloweenEvent.treeCanvas.position.x = treeCanvasState.currentX;
    window.state.halloweenEvent.treeCanvas.position.y = treeCanvasState.currentY;
    window.state.halloweenEvent.treeCanvas.zoom = treeCanvasState.scale;
  }
}

// Restore canvas position and zoom from state
function restoreCanvasState() {
  if (!window.state.halloweenEvent || !window.state.halloweenEvent.treeCanvas) {
    return;
  }
  
  // Apply saved state to treeCanvasState if it exists
  if (typeof treeCanvasState !== 'undefined') {
    treeCanvasState.currentX = window.state.halloweenEvent.treeCanvas.position.x;
    treeCanvasState.currentY = window.state.halloweenEvent.treeCanvas.position.y;
    treeCanvasState.scale = window.state.halloweenEvent.treeCanvas.zoom;
    
    // Apply the transform to the canvas
    if (typeof updateTreeCanvasTransform === 'function') {
      updateTreeCanvasTransform();
    }
  }
}

// Initialize tree canvas rendering and state management
function initializeTreeCanvasRendering() {
  // Initialize canvas state in window.state
  initializeTreeCanvasState();
  
  // Restore canvas position and zoom
  setTimeout(() => {
    restoreCanvasState();
  }, 100);
  
  // Render the tree upgrades
  renderTreeUpgrades();
}

// Enhanced version of initializeTreeCanvas that includes rendering
function enhancedInitializeTreeCanvas() {
  // Call the original initializeTreeCanvas from halloween event.js if it exists
  if (typeof window.originalInitializeTreeCanvas === 'function') {
    window.originalInitializeTreeCanvas();
  }
  
  // Add our canvas rendering functionality
  initializeTreeCanvasRendering();
}

// Add new upgrade to layout (for easy expansion)
function addTreeUpgrade(upgradeId, position, connections = [], prerequisite = null) {
  treeUpgradeLayout[upgradeId] = {
    position: position,
    connections: connections,
    prerequisite: prerequisite
  };
}

// Add new connection line (for easy expansion)
function addConnectionLine(id, fromUpgradeId, toUpgradeId) {
  const fromLayout = treeUpgradeLayout[fromUpgradeId];
  const toLayout = treeUpgradeLayout[toUpgradeId];
  
  if (!fromLayout || !toLayout) {
    console.warn(`Cannot create connection ${id}: upgrade layout not found`);
    return;
  }
  
  // Add connection to the array (style will be calculated dynamically)
  connectionLines.push({
    id: id,
    from: fromUpgradeId,
    to: toUpgradeId
  });
}

// Make functions globally accessible
window.renderTreeUpgrades = renderTreeUpgrades;
window.renderConnectionLines = renderConnectionLines;
window.renderUpgradeNodes = renderUpgradeNodes;
window.addTreeUpgrade = addTreeUpgrade;
window.addConnectionLine = addConnectionLine;
window.initializeTreeCanvasState = initializeTreeCanvasState;
window.initializeTreeCanvasRendering = initializeTreeCanvasRendering;
window.saveCanvasState = saveCanvasState;
window.restoreCanvasState = restoreCanvasState;

// Store original function to preserve existing functionality
if (typeof window.initializeTreeCanvas === 'function') {
  window.originalInitializeTreeCanvas = window.initializeTreeCanvas;
}

// Replace with our enhanced version
window.initializeTreeCanvas = enhancedInitializeTreeCanvas;

// Auto-render when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Wait for all scripts to load, then render
  setTimeout(() => {
    // Only render if we're on the Tree of Horrors tab
    const treeContent = document.getElementById('halloweenTreeContent');
    if (treeContent && treeContent.style.display !== 'none') {
      renderTreeUpgrades();
    }
  }, 200);
});

// Auto-save canvas state when it changes
function setupCanvasAutoSave() {
  // Set up periodic auto-save for canvas state (every 2 seconds when canvas is active)
  setInterval(() => {
    const treeContent = document.getElementById('halloweenTreeContent');
    if (treeContent && treeContent.style.display !== 'none') {
      saveCanvasState();
    }
  }, 2000);
}

// Hook into the existing switchHalloweenSubTab function
// This will be called after halloween event.js sets up its wrapper
function setupTreeCanvasSwitchHook() {
  const existingFunction = window.switchHalloweenSubTab;
  if (existingFunction) {
    window.switchHalloweenSubTab = function(tabId) {
      // Call the existing function first
      existingFunction(tabId);
      
      // Add our tree canvas specific logic
      if (tabId === 'treeOfHorrors') {
        setTimeout(renderTreeUpgrades, 50);
      } else {
        // Save canvas state when leaving the tree tab
        saveCanvasState();
      }
    };
  }
}

// Initialize auto-save and function hooks when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    setupCanvasAutoSave();
    setupTreeCanvasSwitchHook();
  }, 1000);
});