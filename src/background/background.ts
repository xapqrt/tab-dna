/// <reference types="chrome"/>


import { DwellTracker } from './dwellTracker'
import { ModeDetector } from './modeDetector'
import { ScrollTracker } from './scrollTracker'
import { HabitDetector } from './habitDetector'
import { DNAStorage } from './storage'




console.log("🧬 Tab DNA background worker alive")




const dwellTracker = new DwellTracker()
const modeDetector = new ModeDetector()
const scrollTracker = new ScrollTracker()
const habitDetector = new HabitDetector()




let currentTab: number | null = null
let currentTabStartTime: number | null = null




chrome.runtime.onInstalled.addListener(async () => {
  console.log("Tab DNA installed. watching you now 👁️")
  


  await DNAStorage.init()
})




chrome.runtime.onStartup.addListener(async () => {
  const data = await DNAStorage.load()
  dwellTracker.load(data)
  await scrollTracker.load()
  await habitDetector.load()
  


  console.log("DNA loaded from storage")
})




DNAStorage.load().then(data => {
  dwellTracker.load(data)
  scrollTracker.load()
  habitDetector.load()
})




chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const now = Date.now()
  


  


  if (currentTab !== null && currentTabStartTime !== null) {
    const dwellTime = now - currentTabStartTime
    dwellTracker.recordDwell(currentTab, dwellTime)
  }




  


  currentTab = activeInfo.tabId
  currentTabStartTime = now




  console.log(`DNA: switched to tab ${currentTab} 🧬`)




  


  modeDetector.recordSwitch()




  


  const totalSwitches = await DNAStorage.incrementSwitches()
  console.log(`total switches: ${totalSwitches}`)




  await DNAStorage.updateLastActive()
})







chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tabId === currentTab) {
    const now = Date.now()


    


    if (tab.url) {
      const domain = extractDomain(tab.url)
      
      // check blacklist before tracking
      const isBlacklisted = await checkBlacklist(domain)
      if (isBlacklisted) {
        console.log(`🔒 domain ${domain} is blacklisted, skipping tracking`)
        return
      }

      dwellTracker.recordVisit(tabId, tab.url, now)
      


      // track habit pattern too
      habitDetector.recordVisitPattern(domain, now)
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
      
      const isBlacklisted = blacklist.some((d: string) => {
        const normalizedBlacklist = d.replace(/^www\./, '').toLowerCase()
        return normalized === normalizedBlacklist || normalized.endsWith('.' + normalizedBlacklist)
      })
      
      resolve(isBlacklisted)
    })
  })
}




chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'scroll') {
    scrollTracker.recordScroll({
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
  


  if (tabId === currentTab && currentTabStartTime !== null) {
    const dwellTime = Date.now() - currentTabStartTime
    dwellTracker.recordDwell(tabId, dwellTime)
    


    currentTab = null
    currentTabStartTime = null
  }
})




