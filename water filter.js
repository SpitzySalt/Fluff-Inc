// Water Filtration System - Floor 2 Department
// Initial state: Ruined/broken, needs repair

class WaterFiltration {
  constructor() {
    this.isRepaired = false;
    this.waterPurity = 0;
    this.filtrationRate = 0;
    this.repairProgress = 0;
    this.requiredRepairMaterials = {
      feathers: 1000,
      artifacts: 100,
      swariaBucks: 500
    };
    
    this.init();
  }

  init() {
    this.loadState();
    this.setupUI();
  }

  loadState() {
    // Load saved state from localStorage if available
    try {
      const saved = localStorage.getItem('waterFiltrationState');
      if (saved) {
        const data = JSON.parse(saved);
        this.isRepaired = data.isRepaired || false;
        this.waterPurity = data.waterPurity || 0;
        this.filtrationRate = data.filtrationRate || 0;
        this.repairProgress = data.repairProgress || 0;
      }
    } catch (error) {

    }
  }

  saveState() {
    const state = {
      isRepaired: this.isRepaired,
      waterPurity: this.waterPurity,
      filtrationRate: this.filtrationRate,
      repairProgress: this.repairProgress
    };
    localStorage.setItem('waterFiltrationState', JSON.stringify(state));
  }

  setupUI() {
    // This will be called when the water filtration tab is shown
    this.renderWaterFiltrationUI();
  }

  renderWaterFiltrationUI() {
    const generatorMainTab = document.getElementById('generatorMainTab');
    if (!generatorMainTab) return;

    // Check if we're on floor 2
    if (window.currentFloor !== 2) return;

    // Clear existing content and replace with water filtration content
    generatorMainTab.innerHTML = `
      <div class="water-filtration-container">
        ${this.isRepaired ? this.getRepairedHTML() : this.getRuinedHTML()}
      </div>
    `;

    this.bindEvents();
  }

  getRuinedHTML() {
    return `
      <!-- Broken Water Containers - Top Middle -->
      <div class="broken-containers" style="display: flex; justify-content: center; gap: 2em; margin: 2em 0; padding: 2em;">
        <div class="water-container broken" style="background: #2a2a2a; border: 3px solid #666; border-radius: 15px; padding: 2em; text-align: center; width: 200px; position: relative;">
          <div style="font-size: 3em; color: #666; margin-bottom: 0.5em;">🚰</div>
          <div style="position: absolute; top: 10px; right: 10px; color: #cc4444; font-size: 1.5em;">❌</div>
          <p style="color: #888; margin: 0;">Container A</p>
          <p style="color: #cc4444; font-size: 0.9em; margin-top: 0.5em;">DAMAGED</p>
        </div>
        
        <div class="water-container broken" style="background: #2a2a2a; border: 3px solid #666; border-radius: 15px; padding: 2em; text-align: center; width: 200px; position: relative;">
          <div style="font-size: 3em; color: #666; margin-bottom: 0.5em;">🚰</div>
          <div style="position: absolute; top: 10px; right: 10px; color: #cc4444; font-size: 1.5em;">❌</div>
          <p style="color: #888; margin: 0;">Container B</p>
          <p style="color: #cc4444; font-size: 0.9em; margin-top: 0.5em;">DAMAGED</p>
        </div>
      </div>

      <!-- Character Cards - Bottom -->
      <div class="character-cards" style="display: flex; justify-content: center; gap: 3em; margin-top: 4em; padding: 2em;">
        <!-- Swaria Card -->
        <div id="character-swaria" class="card swaria-character-box" style="width: 220px; height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
          <div style="position: relative; display: inline-block;">
            <img src="swa normal.png" alt="Swaria" class="character-image" style="width: 160px; height: 160px; object-fit: cover; border-radius: 12px;">
            <img src="swa talking.png" alt="Swaria speaking" class="character-image speaking" style="width: 160px; height: 160px; object-fit: cover; border-radius: 12px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: none;">
          </div>
          <div class="swaria-speech" style="position: absolute; top: -60px; left: 50%; transform: translateX(-50%); background: white; color: #111; padding: 10px 14px; border-radius: 12px; font-size: 0.9rem; font-weight: bold; box-shadow: 0 4px 16px 2px rgba(0,0,0,0.18); max-width: 260px; z-index: 10; display: none; text-align: center;">
            "These water containers used to keep the whole terrarium hydrated... Such a shame to see them broken like this."
          </div>
        </div>

        <!-- Fluzzer Card -->
        <div id="character-fluzzer" class="card swaria-character-box" style="width: 220px; height: 220px; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
          <div style="position: relative; display: inline-block;">
            <img src="assets/icons/fluzzer.png" alt="Fluzzer" class="character-image" style="width: 160px; height: 160px; object-fit: cover; border-radius: 12px; transform: scaleX(-1);">
            <img src="assets/icons/fluzzer talking.png" alt="Fluzzer speaking" class="character-image speaking" style="width: 160px; height: 160px; object-fit: cover; border-radius: 12px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scaleX(-1); display: none;">
          </div>
          <div class="swaria-speech" style="position: absolute; top: -60px; left: 50%; transform: translateX(-50%); background: white; color: #111; padding: 10px 14px; border-radius: 12px; font-size: 0.9rem; font-weight: bold; box-shadow: 0 4px 16px 2px rgba(0,0,0,0.18); max-width: 260px; z-index: 10; display: none; text-align: center;">
            "Without clean water, my flowers can't grow properly... We really need to get this system working again!"
          </div>
        </div>
      </div>
    `;
  }

  getRepairedHTML() {
    return ``;
  }

  bindEvents() {
    const repairBtn = document.getElementById('beginRepairBtn');
    if (repairBtn && !this.isRepaired) {
      repairBtn.addEventListener('click', () => this.beginRepair());
    }
  }

  // Resource checking methods
  getCurrentFeathers() {
    return window.state ? window.formatNumber(window.state.feathers) : '0';
  }

  getCurrentArtifacts() {
    return window.state ? window.formatNumber(window.state.artifacts) : '0';
  }

  getCurrentSwaBucks() {
    return window.state ? window.formatNumber(window.state.swabucks) : '0';
  }

  hasEnoughFeathers() {
    return window.state && window.state.feathers >= this.requiredRepairMaterials.feathers;
  }

  hasEnoughArtifacts() {
    return window.state && window.state.artifacts >= this.requiredRepairMaterials.artifacts;
  }

  hasEnoughSwaBucks() {
    return window.state && window.state.swabucks >= this.requiredRepairMaterials.swariaBucks;
  }

  canBeginRepair() {
    return this.hasEnoughFeathers() && this.hasEnoughArtifacts() && this.hasEnoughSwaBucks();
  }

  beginRepair() {
    if (!this.canBeginRepair()) return;

    // Deduct resources
    window.state.feathers -= this.requiredRepairMaterials.feathers;
    window.state.artifacts -= this.requiredRepairMaterials.artifacts;
    window.state.swabucks -= this.requiredRepairMaterials.swariaBucks;

    // Mark as repaired
    this.isRepaired = true;
    this.waterPurity = 85;
    this.filtrationRate = 150;

    // Save state
    this.saveState();

    // Show success message
    this.showRepairSuccess();

    // Re-render UI
    setTimeout(() => {
      this.renderWaterFiltrationUI();
    }, 3000);
  }

  showRepairSuccess() {
    const container = document.querySelector('.water-filtration-container');
    if (container) {
      const successMsg = document.createElement('div');
      successMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #1a3d1a;
        color: #66ff66;
        padding: 2em;
        border-radius: 15px;
        border: 3px solid #4a7c4a;
        text-align: center;
        z-index: 1000;
        font-size: 1.2em;
      `;
      successMsg.innerHTML = `
        <h2>🎉 Repair Successful!</h2>
        <p>The Water Filtration System is now operational!</p>
        <p style="font-size: 0.9em; opacity: 0.8;">The terrarium's ecosystem will begin to flourish...</p>
      `;
      document.body.appendChild(successMsg);

      setTimeout(() => {
        document.body.removeChild(successMsg);
      }, 3000);
    }
  }
}

// Initialize Water Filtration System
window.waterFiltration = new WaterFiltration();
