// this is the habit display part, it shows users their browsing habits, it;ll be completely private and ig will help them see them what they r doing with their liffe ig




import React, {useEffect, useState } from 'react'



interface HabitSignal {

    domain: string
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
    confidence: number
    lastSee: number
}







interface HabitDisplayProps {
    habits?: HabitSignal[]
}



function HabitDisplay({habits}: HabitDisplayProps) {

    const [current_time_habits, setCurrentTimeHabits] = useState<HabitSignal[]>([])



    useEffect(() => {

        if(!habits) return

        //get current time slot todetermine and display

        const hour = new Date().getHours()
        let time_slot: 'morning' | 'afternoon' | 'evening' | 'night'

        if (hour >= 6 && hour < 12) {
      time_slot = 'morning'
    } else if (hour >= 12 && hour < 18) {
      time_slot = 'afternoon'
    } else if (hour >= 18 && hour < 22) {
      time_slot = 'evening'
    } else {
      time_slot = 'night'
    }



    //fliter habits for time we determined here ^^^^

    const filtered = habits.filter(h => h.timeOfDay === time_slot)
    setCurrentTimeHabits(filtered.slice(0, 5))
    }, [habits])




    function getTimeIcon(timeOfDay: string): string {
        switch(timeOfDay) {
            case 'morning': return '☀️'
            case 'afternoon': return '🌤️'
            case 'evening': return '�'
            case 'night': return '🌙'
            default: return '⏰' 
        }
    }



    function getConfidenceColor(confidence: number): string {

        if(confidence > 70 ) return '#00ff41'
        if(confidence > 40 ) return '#00d4ff'
        return '#ff00ff66'

    }




    if (!habits || habits.length === 0) {
        return (
            <div className="habit-display empty">
                <p className="hint">//no habits detected for this time</p>
            </div>
        )
    }


    return (
        <div className='habit-display'>
            <div className= "habit-header">
                <span className = "label">routine tabs</span>
                <span className = "time-label">
                    {getTimeIcon(current_time_habits[0].timeOfDay)}
                    {current_time_habits[0].timeOfDay}
                </span>
            </div>



<div className="habit-list">
        {current_time_habits.map((habit, idx) => (
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



