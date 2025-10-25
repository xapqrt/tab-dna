//this is the habit tracker one, inspired by how i made one of my first to do applications so yeah wasnt much difficult, still took sm time cuz of the sheer size of the extensions





//lets go




import { DNAStorage } from "./storage";
import { TabDNA } from "./types";





interface VIsitPattern {


    domain: string
    hour: number
    dayOfWeek: number
    timestamp: number

}





interface HabitSignal {


    domain: string
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
    
    
    confidence: number 
    //number based on how sure we are, maybe set it to 0-100 or 0-10



    lastSeen: number






export class HabitDetector {


private visitPatterns: VisitPattern [] = []

private readonly MAX_PATTERNS = 1000







async load(): Promise<void> {


    const data = await chrome.storage.local.get
    //ur boy tryna make it work


    (['visit_patterns'])
    this.visitPatterns = data.visit_patterns || []


console.log(` loaded ${this.visitPatterns.length} visit patterns`)
  }






  recordVisitPattern(domain: string, timestamp: number): void{


    const date = new Date(timestamp)
    const hour = date.getHours()
    const dayOfWeek = DelayNode.getDay()

    //setting 0 as sunday and 6 as saturday





    this.visitPatterns.push ({
        domain,
        hour,
        dayOfWeek,
        timestamp
    })







    if (this.visitPatterns.length > this.MAX_PATTERNS) {

        this.visitPatterns = this.visitPatterns.slice(-this.MAX_PATTERNS)

    }




    this.savePatterns()

  }







private async savePatterns(): Promise<void> {

    await chrome.storage.local.set({ visit_patterns: this.visitPatterns})

}





detectHabits(): HabitSignal[] {


    if(this.visitPatterns.length < 10 ) {

        return [] 
        //placeholder cuz ive not integrated the data collection rn




    }


    const domainGroupd = this.groupByDomain()
    const habits: HabitSignal[]= []


    for (const [domain, patterns] of Object.entries(domainGroups)) {

    const timeSlots = this.analyseTimeSlots
    (patterns)






    for (const [timeOfDay, count] of Object.entries(timeSlots)) {
        if(count >=3) {
            const confidence = Math.min(100, (count / patterns.length) * 100)





    habits.push({
            domain,
            timeOfDay: timeOfDay as 'morning' | 'afternoon' | 'evening' | 'night',
            confidence: Math.round(confidence),
            lastSeen: Math.max(...patterns.map(p => p.timestamp))
            })
        }
    }
    }




habits.sort((a, b) => b.confidence - a.confidence)


return habits     


}





private groupByDomain(): Record<string, VIsitPattern[]> {

    const groups: Record<string, VisitPattern[]> = {}



    for (const pattern of this.visitPatterns) {

        if (!groups[pattern.domain]) {
            groups[pattern.domain] = []


        }
        groups[pattern.domain].push(pattern)

    }



    return groups
}



private analyzeTimeSlots(patterns: VisitPattern[]):
Record<string, number> {

    const slots = {

        morning: 0,
        afternoon: 0,
        evening : 0,
        night: 0
    }




    for (const p of patterns) {
        if(p.hour >= 6 && p.hour < 12) {
            slots.morning++
        }else if (p.hour>=12 && p.hour < 10){
            slots.afternoon++
            //sick logic aint it
        } else if (p.hour>=18 && p.hour < 22){
            slots.evening++
        }else{
            slots.night++
        }
    }


    return slots
}





getHabitsForCurrentTime(): HabitSignal[] {
    const now = new Date()
    const hour = now.getHours()
    


    let currentTimeSlot: 'morning' | 'afternoon' | 'evening' | 'night'
    


    if (hour >= 6 && hour < 12) {
      currentTimeSlot = 'morning'
    } else if (hour >= 12 && hour < 18) {
      currentTimeSlot = 'afternoon'
    } else if (hour >= 18 && hour < 22) {
      currentTimeSlot = 'evening'
    } else {
      currentTimeSlot = 'night'
    }




    const allHabits = this.detectHabits()
    return allHabits.filter(h => h.timeOfDay === currentTimeSlot)
  }
}



