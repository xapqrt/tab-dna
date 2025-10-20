

import { DwellEvent, TabDNA } from './types'
import { DNAStorage } from './storage'





export class DwellTracker {
  private habit_map: DwellEvent[] = []
  private tab_dna: TabDNA = {}



  

  


  private readonly MAX_EVENTS = 500





  



  load(existingData: { habit_map?: DwellEvent[]; tab_dna?: TabDNA }): void {
    this.habit_map = existingData.habit_map || []
    this.tab_dna = existingData.tab_dna || {}
  }





  



  recordDwell(tabId: number, dwellMs: number): void {
    const dwellSec = Math.round(dwellMs / 1000)
    


    console.log(`DNA: dwelled on tab ${tabId} for ${dwellSec}s ⏱️`)





    this.habit_map.push({
      type: 'dwell',
      tabId,
      duration: dwellSec,
      timestamp: Date.now()
    })


    


    if (this.habit_map.length > this.MAX_EVENTS) {
      this.habit_map = this.habit_map.slice(-this.MAX_EVENTS)
    }





    DNAStorage.saveHabitMap(this.habit_map)
  }





  



  recordVisit(tabId: number, url: string, timestamp: number): void {
    const domain = this.extractDomain(url)
    


    console.log(`DNA: visited ${domain} 🌐`)





    if (!this.tab_dna[domain]) {
      this.tab_dna[domain] = { 
        visits: 0, 
        lastSeen: 0,
        totalDwellTime: 0
      }
    }





    this.tab_dna[domain].visits += 1
    this.tab_dna[domain].lastSeen = timestamp


    


    DNAStorage.saveTabDNA(this.tab_dna)
  }





  



  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname
    } catch (e) {
      return url
    }
  }





  getHabitMap(): DwellEvent[] {
    return this.habit_map
  }





  getTabDNA(): TabDNA {
    return this.tab_dna
  }
}




