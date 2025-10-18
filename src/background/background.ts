/* 
  BACKGROUND SERVICE WORKER
  this is where the magic happens — listens to tabs, tracks behavior, builds the DNA
  TODO: add actual listeners lol
*/

console.log("🧬 Tab DNA background worker alive")


// placeholder for now
chrome.runtime.onInstalled.addListener(() => {
  console.log("Tab DNA installed. watching you now 👁️")
  
  // init storage maybe??
  chrome.storage.local.set({ 
    tab_dna: {},
    habit_map: [],
    modeGuess: "unknown"
  })
})


// TODO: tab switch listener
// TODO: scroll tracking
// TODO: dwell time calc
// TODO: panic mode detection lmaooo


/*
  COMMIT: scaffold background worker
  - basic service worker shell
  - logs on install
  - storage init (empty for now)
*/
