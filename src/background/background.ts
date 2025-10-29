/// <reference types="chrome"/>


import { DwellTracker } from './dwellTracker'
import { ModeDetector } from './modeDetector'
import { ScrollTracker } from './scrollTracker'
import { HabitDetector } from './habitDetector'
import { DNAStorage } from './storage'



console.log("🧬 Tab DNA background worker alive")



const dwell_tracker = new DwellTracker()
const mode_detector = new ModeDetector()
const scroll_tracker = new ScrollTracker()
const habit_detector = new HabitDetector()



let current_tab: number | null = null
let currentTabStartTime: number | null = null







chrome.runtime.onInstalled.addListener(async () => {
  console.log("Tab DNA installed. watching you now 👁️")
  

  await DNAStorage.init()
})


chrome.runtime.onStartup.addListener(async () => {
  const data = await DNAStorage.load()
  dwell_tracker.load(data)
  await scroll_tracker.load()
  await habit_detector.load()
  

  console.log("DNA loaded from storage")
})


DNAStorage.load().then(data => {
  dwell_tracker.load(data)
  scroll_tracker.load()
  habit_detector.load()
})







chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const now = Date.now()
  

  

  if (current_tab !== null && currentTabStartTime !== null) {
    const dwell_time = now - currentTabStartTime
    dwell_tracker.recordDwell(current_tab, dwell_time)
  }



  

  current_tab = activeInfo.tabId
  currentTabStartTime = now


  console.log(`DNA: switched to tab ${current_tab} 🧬`)


  

  mode_detector.recordSwitch()


  

  const total_switches = await DNAStorage.incrementSwitches()
  console.log(`total switches: ${total_switches}`)


  await DNAStorage.updateLastActive()
})











chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tabId === current_tab) {
    const now = Date.now()

    

    if (tab.url) {
      const domain = extractDomain(tab.url)
      
      // check blacklist before tracking
      const is_blacklisted = await checkBlacklist(domain)
      if (is_blacklisted) {
        console.log(`🔒 domain ${domain} is blacklisted, skipping tracking`)
        return
      }

      dwell_tracker.recordVisit(tabId, tab.url, now)
      

      // track habit pattern too
      habit_detector.recordVisitPattern(domain, now)
    }
  }
})


               
// helper to get domain from url
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}


// check if domain is blacklisted
async function checkBlacklist(domain: string): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['domain_blacklist'], (data) => {
      const blacklist = data.domain_blacklist || []
      
      // normalize domain for comparison
      const normalized = domain.replace(/^www\./, '').toLowerCase()
      
      const is_blacklisted = blacklist.some((d: string) => {
        const normalized_blacklist = d.replace(/^www\./, '').toLowerCase()
        return normalized === normalized_blacklist || normalized.endsWith('.' + normalized_blacklist)
      })
      
      resolve(is_blacklisted)
    })
  })
}







chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'scroll') {
    scroll_tracker.recordScroll({
      type: 'scroll',
      url: message.url,
      domain: message.domain,
      scrollDepth: message.scrollDepth,
      speed: message.speed
    })

    

    sendResponse({ received: true })
  }


  return true
})


chrome.tabs.onRemoved.addListener((tabId) => {
  

  if (tabId === current_tab && currentTabStartTime !== null) {
    const dwell_time = Date.now() - currentTabStartTime
    dwell_tracker.recordDwell(tabId, dwell_time)
    

    current_tab = null
    currentTabStartTime = null
  }
})




