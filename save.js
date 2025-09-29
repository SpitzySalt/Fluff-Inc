// Fluff Inc. New Save System


window.SaveSystem = {
  version: "2.1.0", // Updated version for IndexedDB support
  maxSaveSlots: 5,
  currentSlot: 1,
  
  // Storage configuration
  useIndexedDB: true,
  dbName: 'FluffIncGame',
  dbVersion: 1,
  storeName: 'saves',
  db: null,
  dbInitialized: false,
  
  // Throttling properties
  lastSaveTime: 0,
  lastExportTime: 0,
  lastImportTime: 0,
  saveThrottleDelay: 3000, // 3 seconds between saves
  exportThrottleDelay: 2000, // 2 seconds between exports
  importThrottleDelay: 5000, // 5 seconds between imports (more conservative)
  isSaving: false,
  isExporting: false,
  isImporting: false,
  pendingSave: false,

  // Initialize save system
  init() {
    // Clean up any existing redundant autosave intervals
    if (window.autosaveInterval) {
      clearInterval(window.autosaveInterval);
      window.autosaveInterval = null;
      console.log('Cleared redundant legacy autosave interval');
    }
    if (window.slotAutosaveInterval) {
      clearInterval(window.slotAutosaveInterval);
      window.slotAutosaveInterval = null;
      console.log('Cleared redundant slot autosave interval');
    }
    
    this.loadCurrentSlot();
    this.initIndexedDB().then(() => {
      return this.migrateFromLocalStorage();
    }).then(() => {
      this.setupAutoSave();
    }).catch(error => {
      console.warn("IndexedDB initialization failed, falling back to localStorage:", error);
      this.useIndexedDB = false;
      this.setupAutoSave();
    });
  },

  // Initialize IndexedDB
  async initIndexedDB() {
    if (!window.indexedDB) {
      throw new Error('IndexedDB not supported');
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        this.dbInitialized = true;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object store for saves
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'key' });
          store.createIndex('slot', 'slot', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  },

  // Migrate data from localStorage to IndexedDB
  async migrateFromLocalStorage() {
    if (!this.useIndexedDB) return;

    try {
      let migratedCount = 0;

      // Migrate all save slots
      for (let slot = 1; slot <= this.maxSaveSlots; slot++) {
        const tempSlot = this.currentSlot;
        this.currentSlot = slot;
        
        const saveKey = this.getSaveKey();
        const backupKey = this.getSaveKey('backup');
        const lastSaveKey = this.getSaveKey('lastSave');
        
        // Check if localStorage has data for this slot
        const saveData = localStorage.getItem(saveKey);
        const backupData = localStorage.getItem(backupKey);
        const lastSaveTime = localStorage.getItem(lastSaveKey);
        
        if (saveData) {
          // Store in IndexedDB
          await this.setIndexedDBItem(saveKey, saveData);
          migratedCount++;
          
          if (backupData) {
            await this.setIndexedDBItem(backupKey, backupData);
          }
          
          if (lastSaveTime) {
            await this.setIndexedDBItem(lastSaveKey, lastSaveTime);
          }
          
          // Remove from localStorage after successful migration
          localStorage.removeItem(saveKey);
          localStorage.removeItem(backupKey);
          localStorage.removeItem(lastSaveKey);
        }
        
        this.currentSlot = tempSlot;
      }

      // Migrate other important localStorage keys
      const otherKeys = ['currentSaveSlot', 'autosaveEnabled'];
      for (const key of otherKeys) {
        const value = localStorage.getItem(key);
        if (value !== null) {
          await this.setIndexedDBItem(key, value);
        }
      }

      if (migratedCount > 0) {
        this.showSaveNotification(`Migrated ${migratedCount} saves to improved storage!`);
      }
    } catch (error) {
      console.error('Migration from localStorage failed:', error);
    }
  },

  // IndexedDB utility functions
  async getIndexedDBItem(key) {
    if (!this.useIndexedDB || !this.db) {
      return localStorage.getItem(key);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };

      request.onerror = () => {
        console.warn('IndexedDB get failed, falling back to localStorage:', request.error);
        resolve(localStorage.getItem(key));
      };
    });
  },

  async setIndexedDBItem(key, data) {
    if (!this.useIndexedDB || !this.db) {
      localStorage.setItem(key, data);
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const saveObject = {
        key: key,
        data: data,
        timestamp: Date.now(),
        slot: this.currentSlot
      };
      
      const request = store.put(saveObject);

      request.onsuccess = () => resolve();
      
      request.onerror = () => {
        console.warn('IndexedDB set failed, falling back to localStorage:', request.error);
        localStorage.setItem(key, data);
        resolve();
      };
    });
  },

  async removeIndexedDBItem(key) {
    if (!this.useIndexedDB || !this.db) {
      localStorage.removeItem(key);
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      
      request.onerror = () => {
        console.warn('IndexedDB remove failed, falling back to localStorage:', request.error);
        localStorage.removeItem(key);
        resolve();
      };
    });
  },

  // Get current save slot from storage (IndexedDB or localStorage)
  async loadCurrentSlot() {
    const saved = await this.getIndexedDBItem('currentSaveSlot');
    if (saved && !isNaN(parseInt(saved))) {
      this.currentSlot = parseInt(saved);
    }
  },

  // Set current save slot
  async setCurrentSlot(slotNumber) {
    if (slotNumber >= 1 && slotNumber <= this.maxSaveSlots) {
      this.currentSlot = slotNumber;
      await this.setIndexedDBItem('currentSaveSlot', slotNumber.toString());
      return true;
    }
    return false;
  },

  // Get save key for current slot
  getSaveKey(suffix = '') {
    return `fluffIncSave_slot${this.currentSlot}${suffix ? '_' + suffix : ''}`;
  },

  // Serialize game state for saving
  serializeState() {
    // First, ensure all systems have saved their current state
    if (typeof window.saveChargerState === 'function') {
      window.saveChargerState();
    }
    
    const saveData = {
      version: this.version,
      timestamp: Date.now(),
      state: {},
      settings: {},
      other: {}
    };

    // Save main game state
    if (window.state) {
      saveData.state = this.serializeObject(window.state);
    }

    // Save settings
    if (window.settings) {
      saveData.settings = { ...window.settings };
    }

    // Achievements are now saved as part of window.state

    // Save other important game data
    // boughtElements are now saved as part of window.state
    if (window.generators) {
      saveData.other.generators = this.serializeObject(window.generators);
    }
    if (window.lightGenerators) {
      saveData.other.lightGenerators = this.serializeObject(window.lightGenerators);
    }
    if (window.infinitySystem) {
      saveData.other.infinitySystem = this.serializeObject(window.infinitySystem);
    }
    if (window.infinityUpgrades) {
      saveData.other.infinityUpgrades = this.serializeObject(window.infinityUpgrades);
    }
    if (window.currentSaveSlot !== undefined) {
      saveData.other.currentSaveSlot = window.currentSaveSlot;
    }
    
    // Save charger system data
    if (window.charger) {
      saveData.other.charger = this.serializeObject(window.charger);
    }
    
    // Save prism system data
    if (window.prismState) {
      saveData.other.prismState = this.serializeObject(window.prismState);
    }
    if (window.advancedPrismState) {
      saveData.other.advancedPrismState = this.serializeObject(window.advancedPrismState);
    }
    if (window.prismCoreState) {
      saveData.other.prismCoreState = this.serializeObject(window.prismCoreState);
    }
    
    // Save premium system data
    if (window.premiumState) {
      saveData.other.premiumState = this.serializeObject(window.premiumState);
    }

    return saveData;
  },

  // Serialize object with Decimal support
  serializeObject(obj) {
    if (obj === null || obj === undefined) return obj;
    
    if (DecimalUtils && DecimalUtils.isDecimal(obj)) {
      return { __decimal: obj.toString() };
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.serializeObject(item));
    }
    
    if (typeof obj === 'object') {
      const serialized = {};
      for (const [key, value] of Object.entries(obj)) {
        serialized[key] = this.serializeObject(value);
      }
      return serialized;
    }
    
    return obj;
  },

  // Deserialize object with Decimal support
  deserializeObject(obj) {
    if (obj === null || obj === undefined) return obj;
    
    if (typeof obj === 'object' && obj.__decimal !== undefined) {
      return new Decimal(obj.__decimal);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.deserializeObject(item));
    }
    
    if (typeof obj === 'object') {
      const deserialized = {};
      for (const [key, value] of Object.entries(obj)) {
        deserialized[key] = this.deserializeObject(value);
      }
      return deserialized;
    }
    
    return obj;
  },

  // Check if save is allowed (throttling)
  canSave() {
    const now = Date.now();
    return !this.isSaving && (now - this.lastSaveTime) >= this.saveThrottleDelay;
  },

  // Check if export is allowed (throttling)
  canExport() {
    const now = Date.now();
    return !this.isExporting && (now - this.lastExportTime) >= this.exportThrottleDelay;
  },

  // Check if import is allowed (throttling)
  canImport() {
    const now = Date.now();
    return !this.isImporting && (now - this.lastImportTime) >= this.importThrottleDelay;
  },

  // Throttled save game to current slot
  async saveGame(force = false) {
    // Check throttling unless forced
    if (!force && !this.canSave()) {
      const timeLeft = Math.ceil((this.saveThrottleDelay - (Date.now() - this.lastSaveTime)) / 1000);
      this.showSaveNotification(`Save throttled. Wait ${timeLeft}s`, true);
      
      // Set pending save to try again later
      this.pendingSave = true;
      setTimeout(() => {
        if (this.pendingSave) {
          this.pendingSave = false;
          this.saveGame(false);
        }
      }, this.saveThrottleDelay - (Date.now() - this.lastSaveTime) + 100);
      
      return false;
    }

    // Prevent concurrent saves
    if (this.isSaving) {
      this.showSaveNotification('Save in progress...', true);
      return false;
    }

    this.isSaving = true;
    this.pendingSave = false;

    try {
      const saveData = this.serializeState();
      const saveString = JSON.stringify(saveData);
      
      // Compress the save string to reduce storage usage
      let compressedSave = saveString;
      if (typeof LZString !== 'undefined') {
        compressedSave = LZString.compressToUTF16(saveString);
      } else {
        console.warn('LZ-String library not available, saving without compression');
      }
      
      // Save to current slot using IndexedDB
      await this.setIndexedDBItem(this.getSaveKey(), compressedSave);
      
      // Save backup
      await this.setIndexedDBItem(this.getSaveKey('backup'), compressedSave);
      
      // Update last save time
      this.lastSaveTime = Date.now();
      await this.setIndexedDBItem(this.getSaveKey('lastSave'), this.lastSaveTime.toString());
      
      this.showSaveNotification('Game Saved!');
      
      this.isSaving = false;
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      this.showSaveNotification('Save Failed!', true);
      this.isSaving = false;
      return false;
    }
  },

  // Load game from current slot
  async loadGame() {
    try {
      const saveString = await this.getIndexedDBItem(this.getSaveKey());
      if (!saveString) {
        console.log(`No save data found for slot ${this.currentSlot}`);
        return false;
      }

      // Try to decompress the save string
      let decompressedString = saveString;
      if (typeof LZString !== 'undefined') {
        try {
          const decompressed = LZString.decompressFromUTF16(saveString);
          if (decompressed) {
            decompressedString = decompressed;
          } else {
            // Data might not be compressed (old save format)
          }
        } catch (decompressionError) {
          console.warn('Failed to decompress save data, trying to use as-is:', decompressionError);
        }
      }

      const saveData = JSON.parse(decompressedString);
      
      // Version check
      if (saveData.version !== this.version) {
        console.warn(`Save version mismatch: ${saveData.version} vs ${this.version}`);
        // Could implement migration logic here
      }

      // Load main game state
      if (saveData.state && window.state) {
        const loadedState = this.deserializeObject(saveData.state);
        Object.assign(window.state, loadedState);
        
        // Ensure critical currencies are Decimal objects
        const currenciesToValidate = ['fluff', 'swaria', 'feathers', 'artifacts', 'kp', 'grade', 'powerEnergy', 'powerMaxEnergy'];
        currenciesToValidate.forEach(currency => {
          if (window.state[currency] !== undefined && !DecimalUtils.isDecimal(window.state[currency])) {
            window.state[currency] = new Decimal(window.state[currency] || 0);
          }
        });
        
        // Sync global references after loading state
        if (typeof window.syncGlobalReferencesToState === 'function') {
          if (typeof window.debugFrontDeskState === 'function') {
            window.debugFrontDeskState('Before syncGlobalReferencesToState');
          }
          window.syncGlobalReferencesToState();
          if (typeof window.debugFrontDeskState === 'function') {
            window.debugFrontDeskState('After syncGlobalReferencesToState');
          }
        }
      }

      // Load settings
      if (saveData.settings && window.settings) {
        Object.assign(window.settings, saveData.settings);
        if (window.applySettings) {
          window.applySettings();
        }
      }

      // Achievements are now loaded as part of window.state

      // Load other game data
      if (saveData.other) {
        // boughtElements are now loaded as part of window.state
        if (saveData.other.generators && window.generators) {
          const loadedGenerators = this.deserializeObject(saveData.other.generators);
          Object.assign(window.generators, loadedGenerators);
        }
        if (saveData.other.lightGenerators && window.lightGenerators) {
          const loadedLightGenerators = this.deserializeObject(saveData.other.lightGenerators);
          Object.assign(window.lightGenerators, loadedLightGenerators);
        }
        if (saveData.other.infinitySystem && window.state && window.state.infinitySystem) {
          const loadedInfinitySystem = this.deserializeObject(saveData.other.infinitySystem);
          Object.assign(window.state.infinitySystem, loadedInfinitySystem);
          
          // Ensure Decimal properties are properly restored
          if (loadedInfinitySystem.infinityPoints) {
            window.state.infinitySystem.infinityPoints = new Decimal(loadedInfinitySystem.infinityPoints);
          }
          if (loadedInfinitySystem.theoremProgress) {
            window.state.infinitySystem.theoremProgress = new Decimal(loadedInfinitySystem.theoremProgress);
          }
          
          // Restore infinity images based on everReached flags
          if (typeof window.infinitySystem.restoreInfinityImages === 'function') {
            window.infinitySystem.restoreInfinityImages();
          }
        }
        if (saveData.other.infinityUpgrades && window.infinityUpgrades) {
          const loadedInfinityUpgrades = this.deserializeObject(saveData.other.infinityUpgrades);
          Object.assign(window.infinityUpgrades, loadedInfinityUpgrades);
        }
        
        // Load charger system data
        if (saveData.other.charger && window.charger) {
          const loadedCharger = this.deserializeObject(saveData.other.charger);
          Object.assign(window.charger, loadedCharger);
        }
        
        // Load prism system data
        if (saveData.other.prismState) {
          window.prismState = this.deserializeObject(saveData.other.prismState);
        }
        if (saveData.other.advancedPrismState) {
          window.advancedPrismState = this.deserializeObject(saveData.other.advancedPrismState);
        }
        if (saveData.other.prismCoreState) {
          window.prismCoreState = this.deserializeObject(saveData.other.prismCoreState);
        }
        
        // Load premium system data
        if (saveData.other.premiumState) {
          window.premiumState = this.deserializeObject(saveData.other.premiumState);
        }
      }

      this.showSaveNotification('Game Loaded!');
      
      // Validate and fix all Decimal objects after loading
      if (typeof window.validateAndFixDecimals === 'function') {
        window.validateAndFixDecimals();
      }
      
      // Trigger system reloads
      if (typeof window.loadChargerState === 'function') {
        window.loadChargerState();
      }
      
      // Additional safety check - validate Decimals one more time before UI updates
      if (window.state) {
        const currenciesToRevalidate = ['fluff', 'swaria', 'feathers', 'artifacts', 'kp', 'grade'];
        currenciesToRevalidate.forEach(currency => {
          if (window.state[currency] !== undefined && !DecimalUtils.isDecimal(window.state[currency])) {
            console.warn(`Fixed non-Decimal ${currency}:`, window.state[currency]);
            window.state[currency] = new Decimal(window.state[currency] || 0);
          }
        });
      }
      
      // Trigger UI updates
      if (window.updateUI) window.updateUI();
      if (window.renderGenerators) window.renderGenerators();
      if (window.updateChargerUI) window.updateChargerUI(true);
      
      return true;
    } catch (error) {
      console.error('Load failed:', error);
      this.showSaveNotification('Load Failed!', true);
      
      // Try backup
      return this.loadBackup();
    }
  },

  // Load backup save
  async loadBackup() {
    try {
      const backupString = await this.getIndexedDBItem(this.getSaveKey('backup'));
      if (!backupString) {
        console.log('No backup save found');
        return false;
      }

      // Temporarily change the key to load backup
      const originalKey = this.getSaveKey();
      await this.setIndexedDBItem(originalKey, backupString);
      
      const result = await this.loadGame();
      if (result) {
        console.log('Loaded from backup save');
        this.showSaveNotification('Loaded from Backup!');
      }
      
      return result;
    } catch (error) {
      console.error('Backup load failed:', error);
      return false;
    }
  },

  // Throttled export save data as string
  exportSave() {
    // Check throttling
    if (!this.canExport()) {
      const timeLeft = Math.ceil((this.exportThrottleDelay - (Date.now() - this.lastExportTime)) / 1000);
      this.showSaveNotification(`Export throttled. Wait ${timeLeft}s`, true);
      return null;
    }

    // Prevent concurrent exports
    if (this.isExporting) {
      this.showSaveNotification('Export in progress...', true);
      return null;
    }

    this.isExporting = true;

    try {
      const saveData = this.serializeState();
      const saveString = JSON.stringify(saveData);
      
      // Compress first, then base64 encode for export
      let compressedSave = saveString;
      if (typeof LZString !== 'undefined') {
        // Use the safer base64 compression instead of UTF16
        const compressed = LZString.compressToBase64(saveString);
        if (compressed) {
          compressedSave = compressed;
        }
      }
      
      // Since we're using base64 compression, we can use standard base64 encoding
      let exportString;
      try {
        exportString = btoa(compressedSave);
      } catch (btoa_error) {
        // Use Unicode-safe base64 encoding as fallback
        exportString = btoa(unescape(encodeURIComponent(compressedSave)));
      }
      
      this.lastExportTime = Date.now();
      
      // Copy to clipboard if possible
      if (navigator.clipboard) {
        navigator.clipboard.writeText(exportString).then(() => {
          this.showSaveNotification('Save exported to clipboard!');
        }).catch((clipboardError) => {
          console.warn('Clipboard failed, showing export dialog:', clipboardError);
          this.showExportDialog(exportString);
        }).finally(() => {
          this.isExporting = false;
        });
      } else {
        this.showExportDialog(exportString);
        this.isExporting = false;
      }
      
      return exportString;
    } catch (error) {
      console.error('Export failed at stage:', error.message);
      console.error('Full error:', error);
      console.error('Error stack:', error.stack);
      this.showSaveNotification('Export Failed!', true);
      this.isExporting = false;
      return null;
    }
  },

  // Export delivery reset backup as code
  exportDeliveryResetBackup() {
    try {
      // Use the SaveSystem's current slot, fallback to localStorage
      const saveSlotNumber = this.currentSlot || localStorage.getItem('currentSaveSlot');
      const backupKey = saveSlotNumber ? 
        `deliveryResetBackup_slot${saveSlotNumber}` : 
        'deliveryResetBackup';      
      const backupDataString = localStorage.getItem(backupKey);
      
      if (!backupDataString) {
        // Check if there's a backup with a different slot number
        const allKeys = Object.keys(localStorage).filter(key => key.startsWith('deliveryResetBackup'));        
        if (allKeys.length > 0) {
          this.showSaveNotification(`Backup found in different slot. Current: slot${saveSlotNumber}. Available: ${allKeys.join(', ')}`, true);
        } else {
          this.showSaveNotification('No delivery reset backup found. Perform a delivery reset first.', true);
        }
        return null;
      }
      
      const backupData = JSON.parse(backupDataString);
      
      if (!backupData.gameState) {
        this.showSaveNotification('Invalid backup data format.', true);
        return null;
      }
      
      // Create save data structure that matches our standard format
      const saveData = {
        version: this.version,
        timestamp: backupData.timestamp || Date.now(),
        state: backupData.gameState.state || backupData.gameState,
        settings: backupData.gameState.settings || {},
        other: backupData.gameState.other || {},
        metadata: {
          isDeliveryResetBackup: true,
          originalGrade: backupData.grade || "1",
          originalArtifacts: backupData.artifacts || "0",
          originalKP: backupData.kp || "0"
        }
      };
      
      const saveString = JSON.stringify(saveData);
      
      // Use the same compression and encoding as regular export
      let compressedSave = saveString;
      if (typeof LZString !== 'undefined') {
        compressedSave = LZString.compressToBase64(saveString);
      }
      
      let exportString;
      try {
        exportString = btoa(compressedSave);
      } catch (btoa_error) {
        // Use Unicode-safe base64 encoding as fallback
        exportString = btoa(unescape(encodeURIComponent(compressedSave)));
      }
      
      // Copy to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(exportString).then(() => {
          this.showSaveNotification('Delivery reset backup exported to clipboard!');
        }).catch(() => {
          this.showExportDialog(exportString);
        });
      } else {
        this.showExportDialog(exportString);
      }
      
      // Update backup info display if the function is available
      if (typeof window.updateLastDeliveryInfo === 'function') {
        window.updateLastDeliveryInfo(backupData);
      }
      
      return exportString;
      
    } catch (error) {
      console.error('Delivery reset export failed:', error);
      this.showSaveNotification('Export failed! Please try again.', true);
      return null;
    }
  },

  // Throttled import save data from string
  importSave(importString) {
    // Check throttling
    if (!this.canImport()) {
      const timeLeft = Math.ceil((this.importThrottleDelay - (Date.now() - this.lastImportTime)) / 1000);
      this.showSaveNotification(`Import throttled. Wait ${timeLeft}s`, true);
      return false;
    }

    // Prevent concurrent imports
    if (this.isImporting) {
      this.showSaveNotification('Import in progress...', true);
      return false;
    }

    this.isImporting = true;

    try {
      if (!importString || importString.trim() === '') {
        throw new Error('Empty import string');
      }

      // Decode base64 with Unicode support
      let decodedString;
      const trimmedImport = importString.trim();
      
      // Try multiple decoding approaches
      const decodingMethods = [
        () => atob(trimmedImport), // Standard base64
        () => decodeURIComponent(escape(atob(trimmedImport))), // Unicode-safe method 1
        () => {
          // Alternative Unicode handling
          const binary = atob(trimmedImport);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          return new TextDecoder('utf-8').decode(bytes);
        }
      ];
      
      let decodeSuccess = false;
      for (let i = 0; i < decodingMethods.length; i++) {
        try {
          decodedString = decodingMethods[i]();
          decodeSuccess = true;
          break;
        } catch (error) {
          continue;
        }
      }
      
      if (!decodeSuccess) {
        throw new Error('All base64 decoding methods failed');
      }
      
      // Try to decompress the decoded string (it might be compressed)
      let decompressedString = decodedString;
      
      if (typeof LZString !== 'undefined') {
        try {
          // The export uses LZString.compressToBase64() then btoa()
          // So after atob(), we have the base64 compressed string
          // We need to decompress it from base64
          const decompressed = LZString.decompressFromBase64(decodedString);
          if (decompressed) {
            decompressedString = decompressed;
          } else {
            // If base64 decompression fails, the save might be uncompressed JSON
            // Try to parse it directly first
            try {
              JSON.parse(decodedString);
              decompressedString = decodedString;
            } catch (jsonError) {
              // Fallback to UTF16 for older saves
              const decompressedUTF16 = LZString.decompressFromUTF16(decodedString);
              if (decompressedUTF16) {
                decompressedString = decompressedUTF16;
              }
            }
          }
        } catch (decompressionError) {
          // Use uncompressed data if decompression fails
        }
      }
      
      const saveData = JSON.parse(decompressedString);
      
      // Validate save data
      if (!saveData || typeof saveData !== 'object') {
        throw new Error('Invalid save data format');
      }
      
      if (!saveData.version) {
        throw new Error('Save data missing version');
      }

      // Create backup before importing (force save to bypass throttling)
      this.saveGame(true);
      
      // Import the data with compression
      const importSaveString = JSON.stringify(saveData);
      let compressedImport = importSaveString;
      if (typeof LZString !== 'undefined') {
        compressedImport = LZString.compressToUTF16(importSaveString);
      }
      
      localStorage.setItem(this.getSaveKey(), compressedImport);
      
      // Load the imported data
      const loadResult = this.loadGame();
      
      this.lastImportTime = Date.now();
      this.isImporting = false;
      
      if (loadResult) {
        // Perform complete game state reload after import
        this.performCompleteReload();
        
        this.showSaveNotification('Save imported and loaded successfully!');
        return true;
      } else {
        throw new Error('Failed to load imported data');
      }
      
    } catch (error) {
      console.error('Import failed:', error);
      this.showSaveNotification(`Import Failed: ${error.message}`, true);
      this.isImporting = false;
      return false;
    }
  },

  // Perform complete game state reload after import
  performCompleteReload() {
    try {
      // Sync global references to the newly loaded state
      if (typeof window.syncGlobalReferencesToState === 'function') {
        window.syncGlobalReferencesToState();
      }
      
      // Recalculate all element effects
      if (typeof window.recalculateAllElementEffects === 'function') {
        window.recalculateAllElementEffects();
      }
      
      // Validate and fix all decimals
      if (typeof window.validateAndFixDecimals === 'function') {
        window.validateAndFixDecimals();
      }
      
      // Reload all major game systems
      if (typeof window.loadChargerState === 'function') {
        window.loadChargerState();
      }
      
      // Sync terrarium state
      if (typeof window.syncStateToTerrarium === 'function') {
        window.syncStateToTerrarium();
      }
      
      // Reload front desk system
      if (window.frontDesk && typeof window.frontDesk.loadData === 'function') {
        window.frontDesk.loadData();
        if (typeof window.frontDesk.renderUI === 'function') {
          window.frontDesk.renderUI();
        }
      }
      
      // Re-initialize prism systems
      if (typeof window.initializePrismState === 'function') {
        window.initializePrismState();
      }
      if (typeof window.forceUpdateAllLightCounters === 'function') {
        window.forceUpdateAllLightCounters();
      }
      if (typeof window.updateLightGeneratorButtons === 'function') {
        window.updateLightGeneratorButtons();
      }
      
      // Update all UI systems
      if (typeof window.updateUI === 'function') {
        window.updateUI();
      }
      if (typeof window.renderGenerators === 'function') {
        window.renderGenerators();
      }
      if (typeof window.updateChargerUI === 'function') {
        window.updateChargerUI(true);
      }
      if (typeof window.updateKitchenUI === 'function') {
        window.updateKitchenUI();
      }
      if (typeof window.updateInventoryModal === 'function') {
        window.updateInventoryModal(true);
      }
      if (typeof window.renderDepartmentStatsButtons === 'function') {
        window.renderDepartmentStatsButtons();
      }
      if (typeof window.updatePermanentElementDiscovery === 'function') {
        window.updatePermanentElementDiscovery();
      }
      
      // Force update any visible modals or special UI states
      if (typeof window.updateKnowledgeUI === 'function') {
        window.updateKnowledgeUI();
      }
      
      // Update boutique/merchant if it exists
      if (window.boutique && typeof window.boutique.updateUI === 'function') {
        window.boutique.updateUI();
      }
      
      // Refresh any active tabs
      const activeTab = document.querySelector('.tab.active');
      if (activeTab) {
        activeTab.click();
      }
      
      
    } catch (error) {
      console.error('Error during complete reload:', error);
      // Don't fail the import if reload has issues, just log it
    }
  },

  // Check if save slot has data
  async hasSlotData(slotNumber) {
    const tempSlot = this.currentSlot;
    this.currentSlot = slotNumber;
    const hasData = (await this.getIndexedDBItem(this.getSaveKey())) !== null;
    this.currentSlot = tempSlot;
    return hasData;
  },

  // Get save slot info
  async getSlotInfo(slotNumber) {
    const tempSlot = this.currentSlot;
    this.currentSlot = slotNumber;
    
    const saveString = await this.getIndexedDBItem(this.getSaveKey());
    const lastSaveTime = await this.getIndexedDBItem(this.getSaveKey('lastSave'));
    
    this.currentSlot = tempSlot;
    
    if (!saveString) {
      return { empty: true, slotNumber };
    }

    try {
      // Try to decompress the save string
      let decompressedString = saveString;
      if (typeof LZString !== 'undefined') {
        try {
          const decompressed = LZString.decompressFromUTF16(saveString);
          if (decompressed) {
            decompressedString = decompressed;
          }
        } catch (decompressionError) {
          // Data might not be compressed, use as-is
        }
      }
      
      const saveData = JSON.parse(decompressedString);
      return {
        empty: false,
        slotNumber,
        timestamp: saveData.timestamp || parseInt(lastSaveTime) || 0,
        version: saveData.version,
        fluff: saveData.state?.fluff?.__decimal || '0',
        grade: saveData.state?.grade?.__decimal || '1'
      };
    } catch (error) {
      return { empty: true, slotNumber, error: true };
    }
  },

  // Delete save slot
  async deleteSlot(slotNumber) {
    if (slotNumber < 1 || slotNumber > this.maxSaveSlots) {
      return false;
    }

    const tempSlot = this.currentSlot;
    this.currentSlot = slotNumber;
    
    await this.removeIndexedDBItem(this.getSaveKey());
    await this.removeIndexedDBItem(this.getSaveKey('backup'));
    await this.removeIndexedDBItem(this.getSaveKey('lastSave'));
    
    this.currentSlot = tempSlot;
    
    console.log(`Deleted save slot ${slotNumber}`);
    this.showSaveNotification(`Slot ${slotNumber} deleted`);
    return true;
  },

  // Setup autosave
  setupAutoSave() {
    // Clear any existing autosave
    if (this.autosaveInterval) {
      clearInterval(this.autosaveInterval);
    }

    // Get autosave interval from settings or default to 30 seconds
    let autosaveIntervalSeconds = (window.settings && window.settings.autosaveInterval) ? window.settings.autosaveInterval : 30;
    
    // Enforce minimum interval of 15 seconds for performance
    autosaveIntervalSeconds = Math.max(15, autosaveIntervalSeconds);

    // Set up new autosave with configurable interval
    this.autosaveInterval = setInterval(() => {
      if (window.settings && window.settings.autosave) {
        // Force autosave to bypass throttling
        this.saveGame(true);
        console.log(`Autosave completed (${autosaveIntervalSeconds}s interval)`);
      }
    }, autosaveIntervalSeconds * 1000); // Convert seconds to milliseconds
  },

  // Get throttling status for UI display
  getThrottlingStatus() {
    const now = Date.now();
    return {
      canSave: this.canSave(),
      canExport: this.canExport(),
      canImport: this.canImport(),
      saveTimeLeft: Math.max(0, Math.ceil((this.saveThrottleDelay - (now - this.lastSaveTime)) / 1000)),
      exportTimeLeft: Math.max(0, Math.ceil((this.exportThrottleDelay - (now - this.lastExportTime)) / 1000)),
      importTimeLeft: Math.max(0, Math.ceil((this.importThrottleDelay - (now - this.lastImportTime)) / 1000)),
      isSaving: this.isSaving,
      isExporting: this.isExporting,
      isImporting: this.isImporting
    };
  },

  // Show save notification
  showSaveNotification(message, isError = false) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('saveNotification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'saveNotification';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      `;
      document.body.appendChild(notification);
    }

    // Set message and style
    notification.textContent = message;
    notification.style.backgroundColor = isError ? '#ff4757' : '#2ed573';
    notification.style.opacity = '1';

    // Hide after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
    }, 3000);
  },

  // Show export dialog
  showExportDialog(exportString) {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
    `;

    dialog.innerHTML = `
      <div style="background: white; padding: 20px; border-radius: 12px; max-width: 500px; width: 90%;">
        <h3>Export Save Data</h3>
        <p>Copy this save data:</p>
        <textarea readonly style="width: 100%; height: 100px; margin: 10px 0;">${exportString}</textarea>
        <button onclick="this.parentElement.parentElement.remove()" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
      </div>
    `;

    document.body.appendChild(dialog);

    // Auto-select text
    const textarea = dialog.querySelector('textarea');
    textarea.focus();
    textarea.select();
  }
};

window.testCreateBackup = function() {
  console.log('Testing backup creation manually');
  if (typeof window.saveDeliveryResetBackup === 'function') {
    window.saveDeliveryResetBackup();
    console.log('Manual backup creation completed');
  } else {
    console.log('saveDeliveryResetBackup function not available');
  }
};

window.debugDeliveryBackups = function() {
  const allKeys = Object.keys(localStorage).filter(key => key.startsWith('deliveryResetBackup'));
  console.log('All delivery reset backup keys:', allKeys);
  console.log('SaveSystem.currentSlot:', window.SaveSystem ? window.SaveSystem.currentSlot : 'not available');
  console.log('localStorage currentSaveSlot:', localStorage.getItem('currentSaveSlot'));
  
  allKeys.forEach(key => {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      console.log(`${key}:`, {
        timestamp: data.timestamp ? new Date(data.timestamp).toLocaleString() : 'no timestamp',
        grade: data.grade,
        kp: data.kp
      });
    } catch (e) {
      console.log(`${key}: invalid JSON`);
    }
  });
};

// Global functions for backwards compatibility and easy access
window.saveGame = function() {
  return window.SaveSystem.saveGame();
};

window.loadGame = function() {
  return window.SaveSystem.loadGame();
};

window.exportSave = function() {
  return window.SaveSystem.exportSave();
};

window.exportDeliveryResetBackup = function() {
  return window.SaveSystem.exportDeliveryResetBackup();
};

window.importSave = function(importString) {
  return window.SaveSystem.importSave(importString);
};

// Modal Management Functions
window.openSaveSlotModal = function() {
  const modal = document.getElementById('saveSlotModal');
  if (modal) {
    modal.classList.add('active');
    updateModalSaveUI();
  }
};

window.closeSaveSlotModal = function() {
  const modal = document.getElementById('saveSlotModal');
  if (modal) {
    modal.classList.remove('active');
  }
};

// UI Helper Functions
window.showImportDialog = function() {
  const dialog = document.createElement('div');
  dialog.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
  `;

  dialog.innerHTML = `
    <div style="background: white; padding: 20px; border-radius: 12px; max-width: 500px; width: 90%;">
      <h3>Import Save Data</h3>
      <p>Paste your save data below:</p>
      <textarea id="importTextarea" placeholder="Paste save data here..." style="width: 100%; height: 100px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; padding: 8px;"></textarea>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
        <button onclick="doImport()" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Import</button>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);

  // Focus textarea
  const textarea = dialog.querySelector('#importTextarea');
  textarea.focus();

  // Add import function to the dialog
  window.doImport = function() {
    const importData = textarea.value;
    if (window.SaveSystem.importSave(importData)) {
      dialog.remove();
      updateSaveUI();
    }
    delete window.doImport;
  };
};

window.switchToSlot = function(slotNumber) {
  window.SaveSystem.setCurrentSlot(slotNumber).then(success => {
    if (success) {
      updateSaveUI();
      window.SaveSystem.showSaveNotification(`Switched to Slot ${slotNumber}`);
    }
  });
};

window.deleteSlotConfirm = function(slotNumber) {
  if (confirm(`Are you sure you want to delete save slot ${slotNumber}? This cannot be undone!`)) {
    window.SaveSystem.deleteSlot(slotNumber).then(() => {
      updateSaveUI();
    });
  }
};

window.loadFromSlot = function(slotNumber) {
  const currentSlot = window.SaveSystem.currentSlot;
  window.SaveSystem.setCurrentSlot(slotNumber).then(success => {
    if (success) {
      window.SaveSystem.loadGame().then(loadSuccess => {
        if (loadSuccess) {
          updateSaveUI();
        } else {
          // Revert to original slot if load failed
          window.SaveSystem.setCurrentSlot(currentSlot).then(() => {
            updateSaveUI();
          });
        }
      });
    }
  });
};

function updateSaveUI() {
  // Update autosave toggle
  const autosaveToggle = document.getElementById('autosaveToggle');
  if (autosaveToggle && window.settings) {
    autosaveToggle.checked = window.settings.autosave || false;
    autosaveToggle.onchange = function() {
      window.settings.autosave = this.checked;
      window.SaveSystem.setIndexedDBItem('autosaveEnabled', this.checked.toString());
    };
  }

  // Update autosave interval slider
  const intervalSlider = document.getElementById('autosaveIntervalSlider');
  const intervalDisplay = document.getElementById('autosaveIntervalDisplay');
  
  if (intervalSlider && intervalDisplay && window.settings) {
    // Set initial value from settings or default
    const currentInterval = window.settings.autosaveInterval || 30;
    intervalSlider.value = currentInterval;
    intervalDisplay.textContent = currentInterval + (currentInterval === 1 ? ' second' : ' seconds');
    
    // Handle slider changes
    intervalSlider.oninput = function() {
      const newInterval = parseInt(this.value);
      intervalDisplay.textContent = newInterval + (newInterval === 1 ? ' second' : ' seconds');
    };
    
    intervalSlider.onchange = function() {
      const newInterval = parseInt(this.value);
      window.settings.autosaveInterval = newInterval;
      
      // Save the new interval setting
      window.SaveSystem.setIndexedDBItem('autosaveInterval', newInterval.toString());
      
      // Restart main SaveSystem autosave with new interval
      window.SaveSystem.setupAutoSave();
      
      // Note: Legacy autosave and slot autosave are disabled to prevent performance issues
      // Only the main SaveSystem autosave is used now
    };
  }
}

async function updateModalSaveUI() {
  // Update current slot display in modal
  const modalCurrentSlotDisplay = document.getElementById('modalCurrentSlotDisplay');
  if (modalCurrentSlotDisplay) {
    modalCurrentSlotDisplay.textContent = window.SaveSystem.currentSlot;
  }

  // Update save slots in modal
  const container = document.getElementById('modalSaveSlotContainer');
  if (container) {
    container.innerHTML = '';
    
    for (let i = 1; i <= window.SaveSystem.maxSaveSlots; i++) {
      const slotInfo = await window.SaveSystem.getSlotInfo(i);
      const isCurrentSlot = i === window.SaveSystem.currentSlot;
      
      const slotDiv = document.createElement('div');
      slotDiv.className = `save-slot-card ${isCurrentSlot ? 'active' : ''}`;
      slotDiv.onclick = () => {
        if (!isCurrentSlot) {
          switchToSlot(i);
          updateModalSaveUI();
        }
      };
      
      if (slotInfo.empty) {
        slotDiv.innerHTML = `
          <div class="slot-label">Slot ${i}</div>
          <div class="save-slot-summary">
            <div style="color: #999;">Empty Slot</div>
            <div style="font-size: 0.8em; color: #666;">Click to select this slot</div>
          </div>
        `;
      } else {
        const date = slotInfo.timestamp ? new Date(slotInfo.timestamp).toLocaleDateString() : 'Unknown';
        const time = slotInfo.timestamp ? new Date(slotInfo.timestamp).toLocaleTimeString() : '';
        const fluffAmount = window.formatNumber ? window.formatNumber(new Decimal(slotInfo.fluff)) : slotInfo.fluff;
        
        slotDiv.innerHTML = `
          <div class="slot-label">Slot ${i}</div>
          <div class="save-slot-summary">
            <div style="font-weight: bold;">Fluff: ${fluffAmount}</div>
            <div>Grade: ${slotInfo.grade}</div>
            <div style="font-size: 0.8em; color: #666;">${date}</div>
            <div style="font-size: 0.8em; color: #666;">${time}</div>
          </div>
          ${!isCurrentSlot ? `<button onclick="event.stopPropagation(); loadFromSlot(${i}); updateModalSaveUI();">Load</button>` : ''}
          <button class="save-slot-delete" onclick="event.stopPropagation(); deleteSlotConfirm(${i}); updateModalSaveUI();">Delete</button>
        `;
      }
      
      container.appendChild(slotDiv);
    }
  }
}

// Initialize save system when loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    await window.SaveSystem.init();
    // Load autosave setting
    const autosaveEnabled = await window.SaveSystem.getIndexedDBItem('autosaveEnabled');
    if (autosaveEnabled && window.settings) {
      window.settings.autosave = autosaveEnabled === 'true';
    }
    
    // Load autosave interval setting
    const autosaveInterval = await window.SaveSystem.getIndexedDBItem('autosaveInterval');
    if (autosaveInterval && window.settings) {
      window.settings.autosaveInterval = parseInt(autosaveInterval);
    } else if (window.settings) {
      window.settings.autosaveInterval = 30; // Default to 30 seconds
    }
    
    // Set up manage save slots button
    const openBtn = document.getElementById('openSaveSlotModalBtn');
    if (openBtn) {
      openBtn.onclick = openSaveSlotModal;
    }
    // Update UI after a short delay to ensure all elements are loaded
    setTimeout(updateSaveUI, 100);
  });
} else {
  (async () => {
    await window.SaveSystem.init();
    // Load autosave setting
    const autosaveEnabled = await window.SaveSystem.getIndexedDBItem('autosaveEnabled');
    if (autosaveEnabled && window.settings) {
      window.settings.autosave = autosaveEnabled === 'true';
    }
    
    // Load autosave interval setting
    const autosaveInterval = await window.SaveSystem.getIndexedDBItem('autosaveInterval');
    if (autosaveInterval && window.settings) {
      window.settings.autosaveInterval = parseInt(autosaveInterval);
    } else if (window.settings) {
      window.settings.autosaveInterval = 30; // Default to 30 seconds
    }
    
    // Set up manage save slots button
    const openBtn = document.getElementById('openSaveSlotModalBtn');
    if (openBtn) {
      openBtn.onclick = openSaveSlotModal;
    }
    setTimeout(updateSaveUI, 100);
  })();
}

// Debug and recovery functions
window.debugStorage = function() {
  console.log('=== STORAGE DEBUG ===');
  console.log('Current SaveSystem slot:', window.SaveSystem.currentSlot);
  console.log('IndexedDB available:', !!window.indexedDB);
  console.log('IndexedDB initialized:', window.SaveSystem.dbInitialized);
  console.log('Using IndexedDB:', window.SaveSystem.useIndexedDB);
  
  console.log('\n--- localStorage keys (Fluff Inc related) ---');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.includes('fluffInc') || key.includes('Slot') || key.includes('save') || key.includes('current'))) {
      const value = localStorage.getItem(key);
      console.log(`${key}: ${value ? `${value.length} chars` : 'null'}`);
      if (value && value.length < 200) {
        console.log(`  Content: ${value}`);
      }
    }
  }
  
  console.log('\n--- Checking for delivery reset backups ---');
  for (let i = 1; i <= 5; i++) {
    const key = `deliveryResetBackup_slot${i}`;
    const backup = localStorage.getItem(key);
    if (backup) {
      console.log(`Found backup for slot ${i}:`, backup.length, 'chars');
    }
  }
  
  // Check if we can access IndexedDB
  if (window.SaveSystem.db) {
    console.log('\n--- IndexedDB status ---');
    console.log('Database connected:', !!window.SaveSystem.db);
    console.log('Database name:', window.SaveSystem.db.name);
    console.log('Database version:', window.SaveSystem.db.version);
  }
};

window.recoverFromLocalStorage = async function() {
  console.log('Attempting to recover from localStorage...');
  
  // Check for any Fluff Inc saves in localStorage
  const potentialSaves = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.includes('fluffIncSave')) {
      const value = localStorage.getItem(key);
      if (value) {
        potentialSaves.push({ key, value });
      }
    }
  }
  
  if (potentialSaves.length === 0) {
    console.log('No localStorage saves found');
    
    // Check for delivery reset backups
    for (let i = 1; i <= 5; i++) {
      const backupKey = `deliveryResetBackup_slot${i}`;
      const backup = localStorage.getItem(backupKey);
      if (backup) {
        console.log(`Found delivery reset backup for slot ${i}`);
        if (confirm(`Found a delivery reset backup for slot ${i}. Would you like to restore it?`)) {
          try {
            const backupData = JSON.parse(backup);
            if (backupData.gameState) {
              // Create a save from the backup
              const saveData = {
                version: window.SaveSystem.version,
                timestamp: Date.now(),
                state: backupData.gameState.state || backupData.gameState,
                settings: backupData.gameState.settings || {},
                other: backupData.gameState.other || {}
              };
              
              // Save to slot i
              const tempSlot = window.SaveSystem.currentSlot;
              window.SaveSystem.currentSlot = i;
              const saveString = JSON.stringify(saveData);
              let compressedSave = saveString;
              if (typeof LZString !== 'undefined') {
                compressedSave = LZString.compressToUTF16(saveString);
              }
              await window.SaveSystem.setIndexedDBItem(window.SaveSystem.getSaveKey(), compressedSave);
              window.SaveSystem.currentSlot = tempSlot;
              
              console.log(`Restored backup to slot ${i}`);
              window.SaveSystem.showSaveNotification(`Backup restored to slot ${i}!`);
            }
          } catch (error) {
            console.error('Failed to restore backup:', error);
          }
        }
      }
    }
    return;
  }
  
  console.log(`Found ${potentialSaves.length} potential saves in localStorage`);
  
  for (const save of potentialSaves) {
    console.log(`Checking save: ${save.key}`);
    try {
      // Try to decompress if needed
      let saveContent = save.value;
      if (typeof LZString !== 'undefined') {
        try {
          const decompressed = LZString.decompressFromUTF16(save.value);
          if (decompressed) {
            saveContent = decompressed;
          }
        } catch (e) {
          // Not compressed, use as-is
        }
      }
      
      const saveData = JSON.parse(saveContent);
      if (saveData.state && saveData.state.fluff) {
        console.log(`Valid save found: Fluff ${saveData.state.fluff}, Grade ${saveData.state.grade}`);
        
        if (confirm(`Found save data with ${saveData.state.fluff} fluff. Restore this save?`)) {
          // Migrate this save to IndexedDB
          await window.SaveSystem.setIndexedDBItem(save.key, save.value);
          console.log('Save migrated to IndexedDB');
          
          // Try to load it
          const loadResult = await window.SaveSystem.loadGame();
          if (loadResult) {
            window.SaveSystem.showSaveNotification('Save data recovered!');
            if (window.updateUI) window.updateUI();
            return;
          }
        }
      }
    } catch (error) {
      console.error(`Failed to parse save ${save.key}:`, error);
    }
  }
};

window.checkSavedData = async function() {
  console.log('=== CHECKING SAVED DATA ===');
  
  for (let slot = 1; slot <= 5; slot++) {
    console.log(`\n--- Checking Slot ${slot} ---`);
    const tempSlot = window.SaveSystem.currentSlot;
    window.SaveSystem.currentSlot = slot;
    
    const saveData = await window.SaveSystem.getIndexedDBItem(window.SaveSystem.getSaveKey());
    if (saveData) {
      try {
        // Try to decompress and parse
        let decompressedData = saveData;
        if (typeof LZString !== 'undefined') {
          try {
            const decompressed = LZString.decompressFromUTF16(saveData);
            if (decompressed) decompressedData = decompressed;
          } catch (e) {}
        }
        
        const parsed = JSON.parse(decompressedData);
        console.log(`Slot ${slot} - Found save data:`);
        console.log(`- Version: ${parsed.version}`);
        console.log(`- Timestamp: ${new Date(parsed.timestamp)}`);
        if (parsed.state) {
          console.log(`- Fluff: ${parsed.state.fluff}`);
          console.log(`- Grade: ${parsed.state.grade}`);
          console.log(`- Swaria: ${parsed.state.swaria}`);
          console.log(`- Has achievements: ${!!parsed.state.achievements}`);
          console.log(`- Has generators: ${!!parsed.other?.generators}`);
        }
      } catch (error) {
        console.error(`Failed to parse slot ${slot} data:`, error);
      }
    } else {
      console.log(`Slot ${slot} - Empty`);
    }
    
    window.SaveSystem.currentSlot = tempSlot;
  }
};

window.forceLoadSlot = async function(slotNumber = 1) {
  console.log(`Attempting to force load slot ${slotNumber}...`);
  
  const tempSlot = window.SaveSystem.currentSlot;
  window.SaveSystem.currentSlot = slotNumber;
  
  try {
    const saveData = await window.SaveSystem.getIndexedDBItem(window.SaveSystem.getSaveKey());
    if (!saveData) {
      console.log(`No data found in slot ${slotNumber}`);
      return;
    }
    
    // Decompress if needed
    let decompressedData = saveData;
    if (typeof LZString !== 'undefined') {
      try {
        const decompressed = LZString.decompressFromUTF16(saveData);
        if (decompressed) decompressedData = decompressed;
      } catch (e) {
        console.log('Data not compressed or decompression failed, using as-is');
      }
    }
    
    const parsed = JSON.parse(decompressedData);
    console.log('Parsed save data:', parsed);
    
    // Manually apply the state
    if (parsed.state && window.state) {
      console.log('Applying state data...');
      
      // Deserialize the state
      const loadedState = window.SaveSystem.deserializeObject(parsed.state);
      console.log('Deserialized state:', loadedState);
      
      // Apply to window.state
      Object.assign(window.state, loadedState);
      console.log('Applied to window.state');
      
      // Apply other data
      if (parsed.other) {
        if (parsed.other.generators && window.generators) {
          Object.assign(window.generators, window.SaveSystem.deserializeObject(parsed.other.generators));
          console.log('Applied generators data');
        }
        if (parsed.other.lightGenerators && window.lightGenerators) {
          Object.assign(window.lightGenerators, window.SaveSystem.deserializeObject(parsed.other.lightGenerators));
          console.log('Applied light generators data');
        }
        if (parsed.other.infinitySystem && window.state && window.state.infinitySystem) {
          const loadedInfinitySystem = window.SaveSystem.deserializeObject(parsed.other.infinitySystem);
          Object.assign(window.state.infinitySystem, loadedInfinitySystem);
          console.log('Applied infinity system data');
          
          // Ensure Decimal properties are properly restored
          if (loadedInfinitySystem.infinityPoints) {
            window.state.infinitySystem.infinityPoints = new Decimal(loadedInfinitySystem.infinityPoints);
          }
          if (loadedInfinitySystem.theoremProgress) {
            window.state.infinitySystem.theoremProgress = new Decimal(loadedInfinitySystem.theoremProgress);
          }
          
          // Restore infinity images based on everReached flags
          if (typeof window.infinitySystem.restoreInfinityImages === 'function') {
            window.infinitySystem.restoreInfinityImages();
          }
        }
      }
      
      // Sync global references
      if (typeof window.syncGlobalReferencesToState === 'function') {
        window.syncGlobalReferencesToState();
        console.log('Synced global references');
      }
      
      // Validate and fix all Decimal objects after import
      if (typeof window.validateAndFixDecimals === 'function') {
        window.validateAndFixDecimals();
        console.log('Validated and fixed Decimal objects');
      }
      
      // Update UI
      if (window.updateUI) {
        window.updateUI();
        console.log('Updated UI');
      }
      if (window.renderGenerators) {
        window.renderGenerators();
        console.log('Rendered generators');
      }
      
      console.log('Force load completed!');
      window.SaveSystem.showSaveNotification('Save data restored!');
      
    } else {
      console.error('No valid state data found in save');
    }
    
  } catch (error) {
    console.error('Force load failed:', error);
  } finally {
    window.SaveSystem.currentSlot = tempSlot;
  }
};

// Emergency recovery functions
window.checkBrowserHistory = function() {
  console.log('=== BROWSER RECOVERY OPTIONS ===');
  console.log('1. Check if you have the game open in another browser tab/window');
  console.log('2. Check if you played in a different browser (Chrome, Firefox, Edge, Safari)');
  console.log('3. Check browser developer tools > Application > Storage > Local Storage');
  console.log('4. Do you remember your approximate progress levels?');
  console.log('   - How much fluff did you have?');
  console.log('   - What grade were you on?');
  console.log('   - Did you have any special currencies (Swaria, Feathers, Artifacts)?');
  console.log('   - What features had you unlocked?');
};

window.manualProgressRestore = function(fluffAmount, gradeLevel, swariaAmount = 0, feathersAmount = 0, artifactsAmount = 0) {
  console.log('Manually restoring progress...');
  
  if (!window.state) {
    console.error('Game state not initialized');
    return;
  }
  
  // Set basic currencies
  window.state.fluff = new Decimal(fluffAmount || 0);
  window.state.grade = new Decimal(gradeLevel || 1);
  window.state.swaria = new Decimal(swariaAmount || 0);
  window.state.feathers = new Decimal(feathersAmount || 0);
  window.state.artifacts = new Decimal(artifactsAmount || 0);
  
  // Set some reasonable defaults for other values
  if (!window.state.kp) window.state.kp = new Decimal(0);
  if (!window.state.power) window.state.power = new Decimal(220);
  if (!window.state.maxPower) window.state.maxPower = new Decimal(220);
  
  // Initialize tokens if they don't exist
  if (!window.state.tokens) {
    window.state.tokens = {
      berries: new Decimal(100),
      petals: new Decimal(100),
      sparks: new Decimal(100),
      mushroom: new Decimal(100),
      water: new Decimal(100),
      stardust: new Decimal(100),
      prisma: new Decimal(100)
    };
  }
  
  // Set some boxes produced based on grade
  if (!window.state.boxesProduced) {
    window.state.boxesProduced = {
      common: Math.max(100, gradeLevel * 50),
      uncommon: Math.max(50, gradeLevel * 25),
      rare: Math.max(10, gradeLevel * 5),
      legendary: Math.max(1, gradeLevel),
      mythic: gradeLevel > 5 ? gradeLevel - 5 : 0
    };
  }
  
  // Initialize achievements if they don't exist
  if (!window.state.achievements) {
    window.state.achievements = {};
  }
  
  // Sync global references
  if (typeof window.syncGlobalReferencesToState === 'function') {
    window.syncGlobalReferencesToState();
  }
  
  // Update UI
  if (window.updateUI) window.updateUI();
  if (window.renderGenerators) window.renderGenerators();
  
  // Save the restored state
  window.SaveSystem.saveGame(true);
  
  console.log('Progress manually restored!');
  console.log(`Fluff: ${fluffAmount}, Grade: ${gradeLevel}, Swaria: ${swariaAmount}`);
  window.SaveSystem.showSaveNotification('Progress manually restored!');
};

window.quickRestore = function() {
  console.log('=== QUICK RESTORE OPTIONS ===');
  console.log('Based on your screenshot, you appeared to be early in the game.');
  console.log('Here are some quick restore commands:');
  console.log('');
  console.log('For early game (Grade 1-2):');
  console.log('  manualProgressRestore(500, 1)');
  console.log('');  
  console.log('For mid-early game (Grade 2-3):');
  console.log('  manualProgressRestore(2000, 2, 100)');
  console.log('');
  console.log('For established game (Grade 3+):');
  console.log('  manualProgressRestore(10000, 3, 1000, 100)');
  console.log('');
  console.log('Custom restore:');
  console.log('  manualProgressRestore(fluffAmount, gradeLevel, swariaAmount, feathersAmount, artifactsAmount)');
};
