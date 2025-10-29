// ssimple site tracking streak wfeature, added it cuz idk what more to add atp might submit now   




/// <reference types="chrome"/>

import React, { useEffect, useState } from 'react'




interface SiteStreak {
  domain: string
  currentStreak: number
  longestStreak: number
  lastVisit: number
  emoji: string
}




interface SiteStreaksProps {
  visit_patterns?: any[]
  tab_dna?: any
}




function SiteStreaks({ visit_patterns, tab_dna }: SiteStreaksProps) {
  const [streaks, setStreaks] = useState<SiteStreak[]>([])
  const [topStreak, setTopStreak] = useState<SiteStreak | null>(null)




  useEffect(() => {
    if (!visit_patterns || visit_patterns.length === 0) return




    const calculatedStreaks = calculateStreaks()
    setStreaks(calculatedStreaks)
    


    if (calculatedStreaks.length > 0) {
      // find top current streak
      const top = calculatedStreaks.reduce((max, streak) => 
        streak.currentStreak > max.currentStreak ? streak : max
      )
      setTopStreak(top)
    }
  }, [visit_patterns, tab_dna])




  // main function to calculate streaks for all domains
  function calculateStreaks(): SiteStreak[] {
    // group patterns by domain
    const domainVisits: Record<string, number[]> = {}




    for (const pattern of visit_patterns!) {
      if (!domainVisits[pattern.domain]) {
        domainVisits[pattern.domain] = []
      }
      domainVisits[pattern.domain].push(pattern.timestamp)
    }




    const allStreaks: SiteStreak[] = []




    // calculate streak for each domain
    for (const [domain, timestamps] of Object.entries(domainVisits)) {
      const streak = calculateDomainStreak(domain, timestamps)
      if (streak) {
        allStreaks.push(streak)
      }
    }




    // sort by current streak (highest first)
    allStreaks.sort((a, b) => b.currentStreak - a.currentStreak)




    // return top 5 streaks
    return allStreaks.slice(0, 5)
  }




  // calculate streak for a single domain
  function calculateDomainStreak(domain: string, timestamps: number[]): SiteStreak | null {
    if (timestamps.length === 0) return null




    // get unique days visited (convert timestamps to date strings)
    const daysVisited: Set<string> = new Set()
    


    for (const ts of timestamps) {
      const date = new Date(ts)
      const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      daysVisited.add(dateStr)
    }




    // convert to sorted array of dates
    const sortedDates = Array.from(daysVisited)
      .map(str => {
        const [year, month, day] = str.split('-').map(Number)
        return new Date(year, month, day)
      })
      .sort((a, b) => a.getTime() - b.getTime())




    // calculate current streak (working backwards from today)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    


    let currentStreak = 0
    let checkDate = new Date(today)




    // check if visited today or yesterday (streak is active)
    const lastVisitDate = sortedDates[sortedDates.length - 1]
    const daysSinceLastVisit = Math.floor((today.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24))




    if (daysSinceLastVisit > 1) {
      // streak is broken, current streak is 0
      currentStreak = 0
    } else {
      // count backwards to find current streak
      while (true) {
        const dateStr = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`
        


        if (daysVisited.has(dateStr)) {
          currentStreak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          break
        }
      }
    }




    // calculate longest streak ever
    let longestStreak = 0
    let tempStreak = 0
    let prevDate: Date | null = null




    for (const date of sortedDates) {
      if (prevDate) {
        const daysDiff = Math.floor((date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
        


        if (daysDiff === 1) {
          // consecutive day
          tempStreak++
        } else {
          // streak broken
          longestStreak = Math.max(longestStreak, tempStreak)
          tempStreak = 1
        }
      } else {
        tempStreak = 1
      }
      


      prevDate = date
    }




    longestStreak = Math.max(longestStreak, tempStreak)




    return {
      domain,
      currentStreak,
      longestStreak,
      lastVisit: Math.max(...timestamps),
      emoji: getStreakEmoji(currentStreak)
    }
  }




  // get emoji based on streak length
  function getStreakEmoji(streak: number): string {
    if (streak === 0) return '💤'
    if (streak === 1) return '🔥'
    if (streak < 7) return '🔥'
    if (streak < 30) return '🚀'
    if (streak < 100) return '⭐'
    return '👑'
  }




  // get streak color based on length
  function getStreakColor(streak: number): string {
    if (streak === 0) return '#666'
    if (streak < 7) return '#ff6b35'
    if (streak < 30) return '#ffaa00'
    if (streak < 100) return '#00ff41'
    return '#9d4edd'
  }




  // get motivational message
  function getStreakMessage(streak: number): string {
    if (streak === 0) return 'streak broken, time to start fresh!'
    if (streak === 1) return 'nice start!'
    if (streak < 7) return 'building momentum!'
    if (streak === 7) return 'one week streak! 🎉'
    if (streak < 30) return 'ur on fire!'
    if (streak === 30) return 'one month! legendary! 👑'
    if (streak < 100) return 'unstoppable!'
    return 'absolute legend status! 💯'
  }




  return (
    <div className="site-streaks">
      <div className="streaks-header">
        <span className="label">🔥 site streaks</span>
        <span className="subtitle">keep the momentum going</span>
      </div>




      {!streaks || streaks.length === 0 ? (
        <div className="streaks-empty">
          <p className="hint">// no streaks yet</p>
          <p className="hint">// visit sites daily to build streaks! 💪</p>
        </div>
      ) : (
        <>
          {topStreak && topStreak.currentStreak > 0 && (
            <div className="top-streak">
              <div className="streak-emoji-big">{topStreak.emoji}</div>
              <div className="streak-info">
                <div className="streak-domain">{topStreak.domain}</div>
                <div className="streak-message">{getStreakMessage(topStreak.currentStreak)}</div>
              </div>
              <div className="streak-counter">
                <div 
                  className="streak-number"
                  style={{ color: getStreakColor(topStreak.currentStreak) }}
                >
                  {topStreak.currentStreak}
                </div>
                <div className="streak-label">day streak</div>
              </div>
            </div>
          )}




          <div className="streaks-list">
            {streaks.map((streak) => (
              <div key={streak.domain} className="streak-item">
                <div className="streak-emoji">{streak.emoji}</div>
                <div className="streak-details">
                  <div className="streak-domain-name">{streak.domain}</div>
                  <div className="streak-stats">
                    <span className="current-badge" style={{ color: getStreakColor(streak.currentStreak) }}>
                      {streak.currentStreak} days
                    </span>
                    <span className="longest-badge">
                      best: {streak.longestStreak}
                    </span>
                  </div>
                </div>
                <div className="streak-progress">
                  <div 
                    className="progress-bar"
                    style={{
                      width: `${Math.min(100, (streak.currentStreak / 30) * 100)}%`,
                      background: getStreakColor(streak.currentStreak)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>  




          <div className="streaks-footer">
            <small>🎯 visit sites daily to maintain streaks • resets if you skip a day</small>
          </div>
        </>
      )}
    </div>
  )
}




export default SiteStreaks
