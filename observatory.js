// Observatory System - Floor 2 Department
// Initial state: Ruined/broken, needs repair

class Observatory {
  constructor() {
    this.isRepaired = false;
    this.telescopeCalibration = 0;
    this.starMapProgress = 0;
    this.celestialDiscoveries = 0;
    this.repairProgress = 0;
    this.requiredRepairMaterials = {
      artifacts: 500,
      swariaBucks: 1000,
      chargedPrisma: 50
    };
    
    this.discoveries = [];
    this.init();
  }

  init() {
    this.loadState();
    this.setupUI();
  }

  loadState() {
    // Load saved state from localStorage if available
    try {
      const saved = localStorage.getItem('observatoryState');
      if (saved) {
        const data = JSON.parse(saved);
        this.isRepaired = data.isRepaired || false;
        this.telescopeCalibration = data.telescopeCalibration || 0;
        this.starMapProgress = data.starMapProgress || 0;
        this.celestialDiscoveries = data.celestialDiscoveries || 0;
        this.repairProgress = data.repairProgress || 0;
        this.discoveries = data.discoveries || [];
      }
    } catch (error) {

    }
  }

  saveState() {
    const state = {
      isRepaired: this.isRepaired,
      telescopeCalibration: this.telescopeCalibration,
      starMapProgress: this.starMapProgress,
      celestialDiscoveries: this.celestialDiscoveries,
      repairProgress: this.repairProgress,
      discoveries: this.discoveries
    };
    localStorage.setItem('observatoryState', JSON.stringify(state));
  }

  setupUI() {
    // This will be called when the observatory tab is shown
    this.renderObservatoryUI();
  }

  renderObservatoryUI() {
    const prismSubTab = document.getElementById('prismSubTab');
    if (!prismSubTab) return;

    // Check if we're on floor 2
    if (window.currentFloor !== 2) return;

    // Clear existing content and replace with observatory content
    prismSubTab.innerHTML = `
      <div class="observatory-container">
        ${this.isRepaired ? this.getRepairedHTML() : this.getRuinedHTML()}
      </div>
    `;

    this.bindEvents();
  }

  getRuinedHTML() {
    return `
      <div class="card fullwidth ruined-department">
        <h2 style="color: #cc4444;">🔭 Stellar Observatory - DAMAGED</h2>
        
        <div class="ruined-visual" style="text-align: center; margin: 2em 0;">
          <div style="font-size: 4em; opacity: 0.6;">🔭⭐💥</div>
          <p style="color: #888; font-style: italic;">The once-grand observatory sits in darkness...</p>
        </div>

        <div class="damage-assessment" style="background: #2a2a2a; padding: 1.5em; border-radius: 10px; margin: 1.5em 0;">
          <h3 style="color: #ffaa44;">Damage Assessment</h3>
          <ul style="color: #ccc; line-height: 1.6;">
            <li>🔴 Primary telescope: Mirror shattered</li>
            <li>🔴 Star tracking systems: Completely offline</li>
            <li>🔴 Celestial mapping array: Corrupted data</li>
            <li>🔴 Observation dome: Structural damage</li>
            <li>🔴 Navigation equipment: Missing components</li>
          </ul>
        </div>

        <div class="repair-section" style="background: #1a1a3d; padding: 1.5em; border-radius: 10px; border: 2px solid #4a4a7c;">
          <h3 style="color: #6666ff;">🔧 Repair Requirements</h3>
          <div class="repair-materials" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1em; margin: 1em 0;">
            <div class="material-requirement">
              <img src="assets/icons/wing artifact.png" style="width: 24px; height: 24px; vertical-align: middle;">
              <span style="margin-left: 8px;">Artifacts: ${this.requiredRepairMaterials.artifacts}</span>
              <div class="requirement-status" style="color: ${this.hasEnoughArtifacts() ? '#66ff66' : '#ff6666'};">
                (Have: ${this.getCurrentArtifacts()})
              </div>
            </div>
            <div class="material-requirement">
              <img src="assets/icons/swaria coins.png" style="width: 24px; height: 24px; vertical-align: middle;">
              <span style="margin-left: 8px;">Swa Bucks: ${this.requiredRepairMaterials.swariaBucks}</span>
              <div class="requirement-status" style="color: ${this.hasEnoughSwaBucks() ? '#66ff66' : '#ff6666'};">
                (Have: ${this.getCurrentSwaBucks()})
              </div>
            </div>
            <div class="material-requirement">
              <img src="assets/icons/charged prism token.png" style="width: 24px; height: 24px; vertical-align: middle;">
              <span style="margin-left: 8px;">Charged Prisma: ${this.requiredRepairMaterials.chargedPrisma}</span>
              <div class="requirement-status" style="color: ${this.hasEnoughChargedPrisma() ? '#66ff66' : '#ff6666'};">
                (Have: ${this.getCurrentChargedPrisma()})
              </div>
            </div>
          </div>
          
          <button id="beginObservatoryRepairBtn" class="repair-button" 
                  style="background: ${this.canBeginRepair() ? '#4a4a7c' : '#666'}; 
                         color: white; 
                         border: none; 
                         padding: 12px 24px; 
                         border-radius: 8px; 
                         font-size: 1.1em; 
                         cursor: ${this.canBeginRepair() ? 'pointer' : 'not-allowed'};"
                  ${this.canBeginRepair() ? '' : 'disabled'}>
            ${this.canBeginRepair() ? '🔧 Begin Observatory Repair' : '❌ Insufficient Materials'}
          </button>
        </div>

        <div class="broken-equipment" style="background: #3a2a2a; padding: 1.5em; border-radius: 10px; margin: 1.5em 0;">
          <h3 style="color: #ffcc66;">🔍 Broken Equipment Analysis</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1em;">
            <div class="equipment-item" style="background: #2a2a2a; padding: 1em; border-radius: 8px;">
              <h4 style="color: #ff9999;">🔭 Main Telescope</h4>
              <p style="color: #ccc; font-size: 0.9em;">A massive reflecting telescope that once peered deep into space. The primary mirror is cracked beyond repair.</p>
            </div>
            <div class="equipment-item" style="background: #2a2a2a; padding: 1em; border-radius: 8px;">
              <h4 style="color: #ff9999;">⭐ Star Charts</h4>
              <p style="color: #ccc; font-size: 0.9em;">Ancient celestial maps scattered across the floor. Some constellations are still partially visible.</p>
            </div>
            <div class="equipment-item" style="background: #2a2a2a; padding: 1em; border-radius: 8px;">
              <h4 style="color: #ff9999;">📡 Tracking Array</h4>
              <p style="color: #ccc; font-size: 0.9em;">Sophisticated equipment for tracking celestial objects. All electronics appear to be fried.</p>
            </div>
          </div>
        </div>

        <div class="exploration-notes" style="background: #2a2a3a; padding: 1em; border-radius: 8px; margin-top: 1.5em;">
          <h4 style="color: #aaccff;">📝 Exploration Notes</h4>
          <p style="color: #ccc; font-style: italic;">
            "This observatory must have been used for navigation and astronomical research. 
            The sophisticated equipment suggests it was capable of incredibly precise measurements. 
            I can only imagine what secrets of the cosmos were discovered here... 
            Perhaps repairing it could unlock new knowledge about the universe and even enhance our abilities."
          </p>
        </div>
      </div>
    `;
  }

  getRepairedHTML() {
    return `
      <div class="card fullwidth">
        <h2 style="color: #4a4a7c;">🔭 Stellar Observatory - OPERATIONAL</h2>
        
        <div class="observatory-status" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5em; margin: 2em 0;">
          <div class="status-card" style="background: #1a1a3d; padding: 1.5em; border-radius: 10px;">
            <h3>🔭 Telescope Status</h3>
            <div style="font-size: 2em; color: #6666ff;">${this.telescopeCalibration}%</div>
            <p style="color: #ccc; font-size: 0.9em;">Calibration</p>
          </div>
          <div class="status-card" style="background: #1a1a3d; padding: 1.5em; border-radius: 10px;">
            <h3>⭐ Star Map</h3>
            <div style="font-size: 2em; color: #6666ff;">${this.starMapProgress}%</div>
            <p style="color: #ccc; font-size: 0.9em;">Mapped</p>
          </div>
          <div class="status-card" style="background: #1a1a3d; padding: 1.5em; border-radius: 10px;">
            <h3>🌌 Discoveries</h3>
            <div style="font-size: 2em; color: #6666ff;">${this.celestialDiscoveries}</div>
            <p style="color: #ccc; font-size: 0.9em;">Objects Found</p>
          </div>
        </div>

        <div class="observatory-controls" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5em; margin: 2em 0;">
          <button id="observeStarsBtn" class="observatory-btn" style="background: #2a2a4a; color: white; border: none; padding: 1.5em; border-radius: 10px; cursor: pointer;">
            <h3>🌟 Observe Stars</h3>
            <p style="margin: 0.5em 0; opacity: 0.8;">Study distant stars and gain knowledge</p>
          </button>
          <button id="scanGalaxiesBtn" class="observatory-btn" style="background: #2a2a4a; color: white; border: none; padding: 1.5em; border-radius: 10px; cursor: pointer;">
            <h3>🌌 Scan Galaxies</h3>
            <p style="margin: 0.5em 0; opacity: 0.8;">Search for new celestial phenomena</p>
          </button>
          <button id="calibrateTelescopeBtn" class="observatory-btn" style="background: #2a2a4a; color: white; border: none; padding: 1.5em; border-radius: 10px; cursor: pointer;">
            <h3>🔧 Calibrate</h3>
            <p style="margin: 0.5em 0; opacity: 0.8;">Improve telescope precision</p>
          </button>
        </div>

        <div class="cosmic-benefits" style="background: #2a2a4a; padding: 1.5em; border-radius: 10px;">
          <h3 style="color: #6666ff;">🌌 Cosmic Insights</h3>
          <ul style="color: #ccc; line-height: 1.8;">
            <li>🧠 Knowledge Point generation increased by 15%</li>
            <li>🔬 Research speed boosted by 20%</li>
            <li>⭐ Chance to discover rare celestial events</li>
            <li>🌠 Unlock cosmic-themed upgrades and abilities</li>
          </ul>
        </div>

        ${this.discoveries.length > 0 ? this.getDiscoveriesHTML() : ''}
      </div>
    `;
  }

  getDiscoveriesHTML() {
    return `
      <div class="discoveries-log" style="background: #1a1a2a; padding: 1.5em; border-radius: 10px; margin-top: 1.5em;">
        <h3 style="color: #ffcc66;">📜 Discovery Log</h3>
        <div class="discoveries-list" style="max-height: 300px; overflow-y: auto;">
          ${this.discoveries.map(discovery => `
            <div class="discovery-item" style="background: #2a2a3a; padding: 1em; margin: 0.5em 0; border-radius: 8px;">
              <h4 style="color: #66ccff;">${discovery.name}</h4>
              <p style="color: #ccc; font-size: 0.9em;">${discovery.description}</p>
              <small style="color: #888;">Discovered: ${discovery.date}</small>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  bindEvents() {
    const repairBtn = document.getElementById('beginObservatoryRepairBtn');
    if (repairBtn && !this.isRepaired) {
      repairBtn.addEventListener('click', () => this.beginRepair());
    }

    // Bind operational buttons
    if (this.isRepaired) {
      const observeBtn = document.getElementById('observeStarsBtn');
      const scanBtn = document.getElementById('scanGalaxiesBtn');
      const calibrateBtn = document.getElementById('calibrateTelescopeBtn');

      if (observeBtn) observeBtn.addEventListener('click', () => this.observeStars());
      if (scanBtn) scanBtn.addEventListener('click', () => this.scanGalaxies());
      if (calibrateBtn) calibrateBtn.addEventListener('click', () => this.calibrateTelescope());
    }
  }

  // Resource checking methods
  getCurrentArtifacts() {
    return window.state ? window.formatNumber(window.state.artifacts) : '0';
  }

  getCurrentSwaBucks() {
    return window.state ? window.formatNumber(window.state.swabucks) : '0';
  }

  getCurrentChargedPrisma() {
    return window.state ? window.formatNumber(window.state.chargedPrisma) : '0';
  }

  hasEnoughArtifacts() {
    return window.state && window.state.artifacts >= this.requiredRepairMaterials.artifacts;
  }

  hasEnoughSwaBucks() {
    return window.state && window.state.swabucks >= this.requiredRepairMaterials.swariaBucks;
  }

  hasEnoughChargedPrisma() {
    return window.state && window.state.chargedPrisma >= this.requiredRepairMaterials.chargedPrisma;
  }

  canBeginRepair() {
    return this.hasEnoughArtifacts() && this.hasEnoughSwaBucks() && this.hasEnoughChargedPrisma();
  }

  beginRepair() {
    if (!this.canBeginRepair()) return;

    // Deduct resources
    window.state.artifacts -= this.requiredRepairMaterials.artifacts;
    window.state.swabucks -= this.requiredRepairMaterials.swariaBucks;
    window.state.chargedPrisma -= this.requiredRepairMaterials.chargedPrisma;

    // Mark as repaired
    this.isRepaired = true;
    this.telescopeCalibration = 75;
    this.starMapProgress = 25;
    this.celestialDiscoveries = 1;

    // Add first discovery
    this.discoveries.push({
      name: "Local Star Cluster",
      description: "A beautiful cluster of young, hot stars in the nearby galactic region.",
      date: new Date().toLocaleDateString()
    });

    // Save state
    this.saveState();

    // Show success message
    this.showRepairSuccess();

    // Re-render UI
    setTimeout(() => {
      this.renderObservatoryUI();
    }, 3000);
  }

  showRepairSuccess() {
    const container = document.querySelector('.observatory-container');
    if (container) {
      const successMsg = document.createElement('div');
      successMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #1a1a3d;
        color: #6666ff;
        padding: 2em;
        border-radius: 15px;
        border: 3px solid #4a4a7c;
        text-align: center;
        z-index: 1000;
        font-size: 1.2em;
      `;
      successMsg.innerHTML = `
        <h2>🎉 Observatory Restored!</h2>
        <p>The telescope is now gazing at the stars once again!</p>
        <p style="font-size: 0.9em; opacity: 0.8;">The cosmos awaits your exploration...</p>
      `;
      document.body.appendChild(successMsg);

      setTimeout(() => {
        document.body.removeChild(successMsg);
      }, 3000);
    }
  }

  // Observatory operational methods
  observeStars() {
    // Add KP boost and potential discoveries
    if (window.swariaKnowledge && window.addCurrency) {
      const kpGain = Math.floor(Math.random() * 50) + 25;
      window.addCurrency('kp', kpGain);
      this.showTemporaryMessage(`Observed distant stars! Gained ${kpGain} KP`, '#66ccff');
    }
  }

  scanGalaxies() {
    // Chance for rare discoveries
    const discoveryChance = Math.random();
    if (discoveryChance < 0.3) {
      const discoveries = [
        "Spiral Galaxy NGC-7421",
        "Pulsar Binary System",
        "Nebula Formation Zone",
        "Exoplanet Cluster",
        "Dark Matter Concentration"
      ];
      const newDiscovery = discoveries[Math.floor(Math.random() * discoveries.length)];
      this.discoveries.push({
        name: newDiscovery,
        description: "A fascinating celestial object discovered through deep space scanning.",
        date: new Date().toLocaleDateString()
      });
      this.celestialDiscoveries++;
      this.saveState();
      this.showTemporaryMessage(`New discovery: ${newDiscovery}!`, '#ffcc66');
    } else {
      this.showTemporaryMessage("Scanning complete. No new objects found this time.", '#cccccc');
    }
  }

  calibrateTelescope() {
    if (this.telescopeCalibration < 100) {
      this.telescopeCalibration = Math.min(100, this.telescopeCalibration + 5);
      this.saveState();
      this.showTemporaryMessage(`Telescope calibration improved to ${this.telescopeCalibration}%`, '#66ff66');
      // Update the display
      const statusElement = document.querySelector('.observatory-status .status-card:first-child div');
      if (statusElement) {
        statusElement.textContent = `${this.telescopeCalibration}%`;
      }
    } else {
      this.showTemporaryMessage("Telescope is already perfectly calibrated!", '#66ff66');
    }
  }

  showTemporaryMessage(message, color = '#ffffff') {
    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0,0,0,0.8);
      color: ${color};
      padding: 1em 1.5em;
      border-radius: 8px;
      z-index: 1000;
      font-weight: bold;
      border: 2px solid ${color};
    `;
    msgDiv.textContent = message;
    document.body.appendChild(msgDiv);

    setTimeout(() => {
      if (document.body.contains(msgDiv)) {
        document.body.removeChild(msgDiv);
      }
    }, 3000);
  }
}

// Initialize Observatory System
window.observatory = new Observatory();