


import { BrowsingMode } from './types'
import { DNAStorage } from './storage'




export class ModeDetector {
  private switchTimestamps: number[] = []
  private currentMode: BrowsingMode = 'unknown'
  


  private readonly PANIC_THRESHOLD = 3
  private readonly FOCUS_THRESHOLD = 30
  private readonly MAX_HISTORY = 20



  




  recordSwitch(): void {
    const now = Date.now()
    this.switchTimestamps.push(now)
    


    if (this.switchTimestamps.length > this.MAX_HISTORY) {
      this.switchTimestamps = this.switchTimestamps.slice(-this.MAX_HISTORY)
    }



    this.analyze()
  }






  private analyze(): void {
    if (this.switchTimestamps.length < 3) {
      return
    }



    



    const avgGapSec = this.calculateAverageSwitchGap()
    const newMode = this.determineMode(avgGapSec)





    if (newMode !== this.currentMode) {
      this.currentMode = newMode
      DNAStorage.saveMode(newMode)
      console.log(`🧬 MODE SHIFT: ${newMode} (avg: ${avgGapSec.toFixed(1)}s)`)
    }
  }






  




  private calculateAverageSwitchGap(): number {
    let totalGap = 0
    


    for (let i = 1; i < this.switchTimestamps.length; i++) {
      totalGap += this.switchTimestamps[i] - this.switchTimestamps[i - 1]
    }
    


    const avgGapMs = totalGap / (this.switchTimestamps.length - 1)
    return avgGapMs / 1000
  }






  




  private determineMode(avgGapSec: number): BrowsingMode {
    if (avgGapSec < this.PANIC_THRESHOLD) {
      return 'PANIC'
    }
    


    if (avgGapSec > this.FOCUS_THRESHOLD) {
      return 'FOCUS'
    }





    return 'CHILL'
  }






  getMode(): BrowsingMode {
    return this.currentMode
  }
}

