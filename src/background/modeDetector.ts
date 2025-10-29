

import { BrowsingMode } from './types'
import { DNAStorage } from './storage'


export class ModeDetector {
  private switch_timestamps: number[] = []
  private current_mode: BrowsingMode = 'unknown'
  

  private readonly PANIC_THRESHOLD = 3
  private readonly FOCUS_THRESHOLD = 30
  private readonly MAX_HISTORY = 20

  



  recordSwitch(): void {
    const now = Date.now()
    this.switch_timestamps.push(now)
    

    if (this.switch_timestamps.length > this.MAX_HISTORY) {
      this.switch_timestamps = this.switch_timestamps.slice(-this.MAX_HISTORY)
    }


    this.analyze()
  }




  private analyze(): void {
    if (this.switch_timestamps.length < 3) {
      return
    }


    


    const avg_gap_sec = this.calculateAverageSwitchGap()
    const new_mode = this.determineMode(avg_gap_sec)



    if (new_mode !== this.current_mode) {
      this.current_mode = new_mode
      DNAStorage.saveMode(new_mode)
      console.log(`🧬 MODE SHIFT: ${new_mode} (avg: ${avg_gap_sec.toFixed(1)}s)`)
    }
  }




  



  private calculateAverageSwitchGap(): number {
    let total_gap = 0
    

    for (let i = 1; i < this.switch_timestamps.length; i++) {
      total_gap += this.switch_timestamps[i] - this.switch_timestamps[i - 1]
    }
    

    const avg_gap_ms = total_gap / (this.switch_timestamps.length - 1)
    return avg_gap_ms / 1000
  }




  



  private determineMode(avg_gap_sec: number): BrowsingMode {
    if (avg_gap_sec < this.PANIC_THRESHOLD) {
      return 'PANIC'
    }
    

    if (avg_gap_sec > this.FOCUS_THRESHOLD) {
      return 'FOCUS'
    }



    return 'CHILL'
  }




  getMode(): BrowsingMode {
    return this.current_mode
  }
}
