

import { StorageSchema, TabDNA, DwellEvent } from './types'




export class DNAStorage {
  


  static async init(): Promise<void> {
    await chrome.storage.local.set({ 
      tab_dna: {},
      habit_map: [],
      modeGuess: "unknown",
      totalSwitches: 0,
      lastActiveTime: Date.now()
    })
  }




  static async load(): Promise<Partial<StorageSchema>> {
    return new Promise((resolve) => {
      chrome.storage.local.get(
        ['tab_dna', 'habit_map', 'modeGuess', 'totalSwitches'],
        (data) => resolve(data)
      )
    })
  }






  static async saveTabDNA(tab_dna: TabDNA): Promise<void> {
    await chrome.storage.local.set({ tab_dna })
  }





  static async saveHabitMap(habit_map: DwellEvent[]): Promise<void> {
    await chrome.storage.local.set({ habit_map })
  }



  



  static async saveMode(modeGuess: string): Promise<void> {
    await chrome.storage.local.set({ modeGuess })
  }





  static async incrementSwitches(): Promise<number> {
    return new Promise((resolve) => {
      chrome.storage.local.get(['totalSwitches'], (data) => {
        const newCount = (data.totalSwitches || 0) + 1
        chrome.storage.local.set({ totalSwitches: newCount })
        resolve(newCount)
      })
    })
  }





  static async updateLastActive(): Promise<void> {
    await chrome.storage.local.set({ lastActiveTime: Date.now() })
  }
}