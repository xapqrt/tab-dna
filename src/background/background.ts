

import { DwellTracker } from './dwellTracker'
import { ModeDetector } from './modeDetector'
import { ScrollTracker } from './scrollTracker'
import { DNAStorage } from './storage'




console.log("🧬 Tab DNA background worker alive")




const dwellTracker = new DwellTracker()
const modeDetector = new ModeDetector()
const scrollTracker = new ScrollTracker()




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
  


  console.log("DNA loaded from storage")
})




DNAStorage.load().then(data => {
  dwellTracker.load(data)
  scrollTracker.load()
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







chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tabId === currentTab) {
    const now = Date.now()


    


    if (tab.url) {
      dwellTracker.recordVisit(tabId, tab.url, now)
    }
  }
})




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




