
/// <reference types="chrome"/>


import { DNAStorage } from './storage'





interface ScrollEvent {
  type: 'scroll'
  url: string
  domain: string
  scrollDepth: number
  speed: 'slow' | 'medium' | 'fast' | 'rapid'
  timestamp: number
}





export class ScrollTracker {
  private scrollEvents: ScrollEvent[] = []
  private readonly MAX_EVENTS = 200







  async recordScroll(data: Omit<ScrollEvent, 'timestamp'>): Promise<void> {
    const event: ScrollEvent = {
      ...data,
      timestamp: Date.now()
    }





    this.scrollEvents.push(event)





    if (this.scrollEvents.length > this.MAX_EVENTS) {
      this.scrollEvents = this.scrollEvents.slice(-this.MAX_EVENTS)
    }



    



    console.log(`📜 scroll: ${data.domain} (${data.speed}, depth: ${data.scrollDepth}%)`)





    await this.saveToStorage()
  }





  



  private async saveToStorage(): Promise<void> {
    await chrome.storage.local.set({ 
      scroll_events: this.scrollEvents 
    })
  }



  



  async load(): Promise<void> {
    const data = await chrome.storage.local.get(['scroll_events'])
    this.scrollEvents = data.scroll_events || []
  }





  



  getScrollStats(domain?: string): { 
    avgDepth: number
    totalScrolls: number 
    readingPattern: 'skimmer' | 'reader' | 'mixed'
  } {
    const events = domain 
      ? this.scrollEvents.filter(e => e.domain === domain)
      : this.scrollEvents





    if (events.length === 0) {
      return { avgDepth: 0, totalScrolls: 0, readingPattern: 'mixed' }
    }





    const avgDepth = events.reduce((sum, e) => sum + e.scrollDepth, 0) / events.length
    const fastScrolls = events.filter(e => e.speed === 'fast' || e.speed === 'rapid').length
    const slowScrolls = events.filter(e => e.speed === 'slow').length



    



    let readingPattern: 'skimmer' | 'reader' | 'mixed' = 'mixed'
    if (fastScrolls > slowScrolls * 2) {
      readingPattern = 'skimmer'
    } else if (slowScrolls > fastScrolls * 2) {
      readingPattern = 'reader'
    }





    return {
      avgDepth: Math.round(avgDepth),
      totalScrolls: events.length,
      readingPattern
    }
  }
}