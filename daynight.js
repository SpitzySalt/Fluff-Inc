// welcome to the Fluff Inc. game script
// this file contains major spoilers for the game
// if you want to play the game without spoilers, please do not read this file












































(function() {
  document.body.classList.add('no-transitions');
  const DAY_START = 6 * 60;    
  const DAY_END = 18 * 60;     
  const DUSK_START = 18 * 60;  
  const DUSK_END = 22 * 60;    
  const NIGHT_START = 22 * 60; 
  const NIGHT_END = 6 * 60;    
  const DAY_TO_DUSK_TRANSITION_START = 17 * 60; 
  const DAY_TO_DUSK_TRANSITION_END = 18 * 60;   
  const DUSK_TO_NIGHT_TRANSITION_START = 21 * 60; 
  const DUSK_TO_NIGHT_TRANSITION_END = 22 * 60;   
  const NIGHT_TO_DAY_TRANSITION_START = 5 * 60; 
  const NIGHT_TO_DAY_TRANSITION_END = 6 * 60;   
  let gameMinutes = 6 * 60; 
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('swariaGameMinutes');
    if (saved !== null && !isNaN(Number(saved))) {
      gameMinutes = Number(saved);
    }
  }
  let theme = 'day';
  let transitionProgress = 0; 
  let transitionType = null; 
  window.daynight = {
    getTime: () => gameMinutes,
    getTimeString: () => {
      // Check if in Halloween event and show spooky time
      if (window.state && window.state.halloweenEventActive && 
          document.querySelector('.page.active') && 
          document.querySelector('.page.active').id === 'halloweenEvent') {
        return '06:66';
      }
      const h = Math.floor(gameMinutes / 60) % 24;
      const m = gameMinutes % 60;
      return h.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0');
    },
    getTheme: () => theme,
    onThemeChange: cb => themeChangeCallbacks.push(cb),
    onTimeChange: cb => timeChangeCallbacks.push(cb),
    setTime: (mins) => {
      gameMinutes = mins % (24 * 60);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('swariaGameMinutes', gameMinutes);
      }
      timeChangeCallbacks.forEach(cb => cb(gameMinutes));
      if (gameMinutes >= 17 * 60 && gameMinutes < 18 * 60) {
        // During Halloween mode, skip dusk and go straight to dark
        if (window.state && window.state.halloweenEventActive) {
          setTheme('dark');
        } else {
          setTheme('dusk');
        }
      } else if (gameMinutes >= 18 * 60 && gameMinutes < 21 * 60) {
        // During Halloween mode, skip dusk and go straight to dark
        if (window.state && window.state.halloweenEventActive) {
          setTheme('dark');
        } else {
          setTheme('dusk');
        }
      } else if (gameMinutes >= 21 * 60 && gameMinutes < 22 * 60) {
        setTheme('dark');
      } else if ((gameMinutes >= 22 * 60 && gameMinutes < 24 * 60) || (gameMinutes >= 0 && gameMinutes < 5 * 60)) {
        setTheme('dark');
      } else if (gameMinutes >= 5 * 60 && gameMinutes < 6 * 60) {
        setTheme('day');
      } else if (gameMinutes >= 6 * 60 && gameMinutes < 17 * 60) {
        setTheme('day');
      } else {
        setTheme('day');
      }
    }
  };
  window.skipToTransition = function(which) {
    let mins = 0;
    if (which === "dayToDusk") mins = 16 * 60 + 30;      
    else if (which === "duskToNight") mins = 20 * 60 + 30; 
    else if (which === "nightToDay") mins = 4 * 60 + 30;   
    else throw new Error("Invalid transition name");
    if (window.daynight && typeof window.daynight.setTime === "function") {
      window.daynight.setTime(mins);
    }
    return "Time set to " + (""+Math.floor(mins/60)).padStart(2,"0") + ":" + (""+(mins%60)).padStart(2,"0");
  };
  window.testExtendedTransition = function(which) {
    let mins = 0;
    if (which === "dayToDusk") mins = 17 * 60 + 15;      
    else if (which === "duskToNight") mins = 21 * 60 + 15; 
    else if (which === "nightToDay") mins = 5 * 60 + 15;   
    else throw new Error("Invalid transition name");
    if (window.daynight && typeof window.daynight.setTime === "function") {
      window.daynight.setTime(mins);
    }
    return "Time set to " + (""+Math.floor(mins/60)).padStart(2,"0") + ":" + (""+(mins%60)).padStart(2,"0") + " (mid-transition)";
  };
  const themeChangeCallbacks = [];
  const timeChangeCallbacks = [];

  function setTheme(newTheme, progress = 0) {
    // Skip dusk theme during Halloween mode - use day or dark instead
    if (window.state && window.state.halloweenEventActive && newTheme === 'dusk') {
      // During dusk hours (18:00-22:00), use dark theme instead during Halloween
      newTheme = 'dark';
    }
    
    if (theme !== newTheme || transitionProgress !== progress) {
      theme = newTheme;
      transitionProgress = progress;
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'transition') {
        document.documentElement.style.setProperty('--theme-transition-progress', progress);
      } else {
        document.documentElement.style.removeProperty('--theme-transition-progress');
      }
      themeChangeCallbacks.forEach(cb => cb(theme, progress));
    }
  }

  window.daynightMainInterval = setInterval(() => {
    // Don't advance time if game is paused
    if (window.isGamePaused) {
      return;
    }
    
    // Don't advance time if in Halloween event
    if (window.state && window.state.halloweenEventActive && 
        document.querySelector('.page.active') && 
        document.querySelector('.page.active').id === 'halloweenEvent') {
      return;
    }
    
    gameMinutes = (gameMinutes + 1) % (24 * 60);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('swariaGameMinutes', gameMinutes);
    }
    timeChangeCallbacks.forEach(cb => cb(gameMinutes));
    if (gameMinutes >= 6 * 60 && gameMinutes < 18 * 60) {
      setTheme('day');
    } else if (gameMinutes >= 18 * 60 && gameMinutes < 22 * 60) {
      // During Halloween mode, skip dusk and go straight to dark
      if (window.state && window.state.halloweenEventActive) {
        setTheme('dark');
      } else {
        setTheme('dusk');
      }
    } else {
      setTheme('dark');
    }
  }, 1000);
  if (gameMinutes >= 6 * 60 && gameMinutes < 18 * 60) {
    setTheme('day');
  } else if (gameMinutes >= 18 * 60 && gameMinutes < 22 * 60) {
    // During Halloween mode, skip dusk and go straight to dark
    if (window.state && window.state.halloweenEventActive) {
      setTheme('dark');
    } else {
      setTheme('dusk');
    }
  } else {
    setTheme('dark');
  }
  setTimeout(() => {
    document.body.classList.remove('no-transitions');
  }, 100);
})();