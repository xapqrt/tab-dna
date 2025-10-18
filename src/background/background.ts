console.log("🧬 Tab DNA background worker alive")






let currentTab: number | null = null
let currentTabStartTime: number | null = null
let tab_dna: any = {}
let habit_map: any[] = []
let switchTimestamps: number[] = []  // track switch timing for panic detection lol
let   modeGuess = "unknown"




// init on install
chrome.runtime.onInstalled.addListener(() => {
  console.log("Tab DNA installed. watching you now 👁️")
  




  chrome.storage.local.set({ 
    tab_dna: {},
    habit_map: [],
    modeGuess: "unknown",
    totalSwitches: 0
  })
})








chrome.storage.local.get(['tab_dna', 'habit_map'], (data) => {
  tab_dna = data.tab_dna || {}
  habit_map = data.habit_map || []
  console.log("DNA loaded:", tab_dna, habit_map)
})








chrome.tabs.onActivated.addListener((activeInfo) => {
  const now = Date.now()
  




  // if we were tracking a previous tab, calc dwell time
  if (currentTab !== null && currentTabStartTime !== null) {
    const dwellTime = now - currentTabStartTime
    logDwell(currentTab, dwellTime)
  }
  



  // start tracking new tab



  currentTab = activeInfo.tabId
  currentTabStartTime = now
  



  console.log(`DNA: switched to tab ${currentTab} 🧬`)



  // track switch timestamps for speed analysis
  switchTimestamps.push(now)
  if(switchTimestamps.length > 20) {
    switchTimestamps = switchTimestamps.slice(-20)  // keep last 20
  }



  // analyze switching speed (am i panicking?? lmao)
  detectMode()




  chrome.storage.local.get(['totalSwitches'], (data) => {
    const newCount = (data.totalSwitches || 0) + 1
    chrome.storage.local.set({ totalSwitches: newCount })
    console.log(`total switches: ${newCount}`)
  })
})







chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tabId === currentTab) {
    const now = Date.now()
    




    // log the URL visit
    if (tab.url) {
      logVisit(tabId, tab.url, now)
    }
  }
})






// helper: log dwell time
function logDwell(tabId: number, dwellMs: number) {
  const dwellSec = Math.round(dwellMs / 1000)
  






  console.log(`DNA: dwelled on tab ${tabId} for ${dwellSec}s ⏱️`)
  






  // store in habit map
  habit_map.push({
    type: 'dwell',
    tabId,
    duration: dwellSec,
    timestamp: Date.now()
  })
  







  // keep only last 500 entries
  if (habit_map.length > 500) {
    habit_map = habit_map.slice(-500)
  }
  
  chrome.storage.local.set({ habit_map })
}




// helper: log URL visit


function logVisit(tabId: number, url: string, timestamp: number) {
  




  let domain = url
  try {
    domain = new URL(url).hostname
  } catch(e) {
    
  }




  

  
  console.log(`DNA: visited ${domain} 🌐`)
  
  // update tab_dna with domain visit count
  if (!tab_dna[domain]) {
    tab_dna[domain] = { visits: 0, lastSeen: 0 }
  }
  tab_dna[domain].visits += 1
  tab_dna[domain].lastSeen = timestamp
  
  chrome.storage.local.set({ tab_dna })
}









function detectMode() {
  if (switchTimestamps.length < 3) {
    return  
  }



  // calc avg time between switches




  let totalGap = 0
  for(let i=1; i < switchTimestamps.length; i++) {
    totalGap += switchTimestamps[i] - switchTimestamps[i-1]
  }
  const avgGapMs = totalGap / (switchTimestamps.length - 1)
  const  avgGapSec = avgGapMs / 1000




  // mode detection logic 




  let newMode = "CHILL"
  
  if(avgGapSec < 3) {
    newMode = "PANIC"    
  } else if (avgGapSec > 30) {
    newMode = "FOCUS"    
  }



  // only update if changed
  if(newMode !== modeGuess) {
    modeGuess = newMode
    chrome.storage.local.set({ modeGuess: newMode })
    console.log(`🧬 MODE SHIFT: ${newMode} (avg switch: ${avgGapSec.toFixed(1)}s)`)
  }
}




// helper: get current mode (for popup to read)
function getCurrentMode(): string {
  return modeGuess
}





