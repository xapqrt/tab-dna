

export interface DwellEvent {
  type: 'dwell'
  tabId: number
  duration: number
  timestamp: number
}


export interface DomainData {
  visits: number
  lastSeen: number
  totalDwellTime?: number
}




export interface TabDNA {
  [domain: string]: DomainData
}






export interface StorageSchema {
  tab_dna: TabDNA
  habit_map: DwellEvent[]
  modeGuess: string
  totalSwitches: number
  lastActiveTime?: number
}




export type BrowsingMode = 'FOCUS' | 'CHILL' | 'PANIC' | 'unknown'
