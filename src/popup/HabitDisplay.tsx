/*
  HABIT DISPLAY
  shows user their browsing habits — what sites they visit at what times
  kinda creepy but also kinda cool?? idk
*/



import React, { useEffect, useState } from 'react'




interface HabitSignal {
  domain: string
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  confidence: number
  lastSeen: number
}




interface HabitDisplayProps {
  habits?: HabitSignal[]
}




function HabitDisplay({ habits }: HabitDisplayProps) {

  const [currentTimeHabits, setCurrentTimeHabits] = useState<HabitSignal[]>([])



  useEffect(() => {
    if (!habits) return


    // get current time slot
    const hour = new Date().getHours()
    let timeSlot: 'morning' | 'afternoon' | 'evening' | 'night'
    


    if (hour >= 6 && hour < 12) {
      timeSlot = 'morning'
    } else if (hour >= 12 && hour < 18) {
      timeSlot = 'afternoon'
    } else if (hour >= 18 && hour < 22) {
      timeSlot = 'evening'
    } else {
      timeSlot = 'night'
    }




    // filter habits for current time
    const filtered = habits.filter(h => h.timeOfDay === timeSlot)
    setCurrentTimeHabits(filtered.slice(0, 5))  // top 5 only
  }, [habits])



  



  function getTimeIcon(timeOfDay: string): string {
    switch(timeOfDay) {
      case 'morning': return '🌅'
      case 'afternoon': return '☀️'
      case 'evening': return '🌆'
      case 'night': return '🌙'
      default: return '⏰'
    }
  }




  



  function getConfidenceColor(confidence: number): string {
    if (confidence > 70) return '#00ff41'  // high confidence = green
    if (confidence > 40) return '#00d4ff'  // medium = cyan
    return '#ff00ff66'  // low = faded pink
  }




  if (!habits || habits.length === 0) {
    return (
      <div className="habit-display empty">
        <p className="hint">// not enough data for habits yet</p>
        <p className="hint">// come back after more browsing 👀</p>
      </div>
    )
  }




  if (currentTimeHabits.length === 0) {
    return (
      <div className="habit-display empty">
        <p className="hint">// no habits detected for this time</p>
      </div>
    )
  }




  return (
    <div className="habit-display">
      <div className="habit-header">
        <span className="label">routine tabs</span>
        <span className="time-label">
          {getTimeIcon(currentTimeHabits[0].timeOfDay)} {currentTimeHabits[0].timeOfDay}
        </span>
      </div>




      <div className="habit-list">
        {currentTimeHabits.map((habit, idx) => (
          <div key={habit.domain} className="habit-item">
            <div className="habit-info">
              <span className="habit-domain">{habit.domain}</span>
              <span 
                className="habit-confidence"
                style={{ color: getConfidenceColor(habit.confidence) }}
              >
                {habit.confidence}%
              </span>
            </div>
            <div 
              className="habit-bar"
              style={{ 
                width: `${habit.confidence}%`,
                background: getConfidenceColor(habit.confidence)
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}




export default HabitDisplay




/*
  COMMIT: add habit display component
  - shows routine tabs for current time of day
  - confidence percentage with color coding
  - time-of-day icons
  - filters top 5 habits for current time slot
  
  TODO:
  - click to open habit tab?
  - "ignore this habit" button
  - show all habits not just current time
*/
