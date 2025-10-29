/// <reference types="chrome"/>




import React, { useEffect, useState } from 'react'

interface TabSpiritProps {
  totalSwitches?: number
  recentActivity?: string
}


interface SpiritState {
  mood: 'happy' | 'tired' | 'concerned' | 'proud' | 'sleepy' | 'excited'
  message: string
  emoji: string
}




function TabSpirit({ totalSwitches = 0, recentActivity }: TabSpiritProps) {
  const [spirit, setSpirit] = useState<SpiritState>({
    mood: 'happy',
    message: "hey there! i'm watching your tabs 👀",
    emoji: '👻'
  })

  const [switchRate, setSwitchRate] = useState(0)
  const [lastSwitchCount, setLastSwitchCount] = useState(0)


  useEffect(() => {
    // track switch rate
    const interval = setInterval(() => {
      const rate = totalSwitches - lastSwitchCount
      setSwitchRate(rate)
      setLastSwitchCount(totalSwitches)

      // react to behavior
      updateSpirit(rate, totalSwitches)
    }, 5000) // check every 5 sec

    return () => clearInterval(interval)
  }, [totalSwitches, lastSwitchCount])

  function updateSpirit(recentSwitches: number, total: number) {
    const hour = new Date().getHours()
    

    // rage switching detected lol
    if (recentSwitches > 10) {
      setSpirit({
        mood: 'concerned',
        message: "yo slow down, you're rage-switching again 😅",
        emoji: '😰'
      })
      return
    }

    // late night browsing
    if (hour >= 2 && hour < 6) {
      setSpirit({
        mood: 'sleepy',
        message: "it's 3am... should you be sleeping? 😴",
        emoji: '🌙'
      })
      return
    }
    // productive session (few switches)
    if (recentSwitches === 0 && total > 10) {
      const compliments = [
        "nice focus session! 💪",
        "you're crushing it rn",
        "locked in mode activated 🔥",
        "respect the grind 👊",
        "this is the energy ✨"
      ]
      setSpirit({
        mood: 'proud',
        message: compliments[Math.floor(Math.random() * compliments.length)],
        emoji: '🎯'
      })
      return
    }

    // high total switches
    if (total > 100) {
      setSpirit({
        mood: 'tired',
        message: "*sigh* that's a lot of tabs today...",
        emoji: '😮‍💨'
      })
      return
    }

    // morning greeting
    if (hour >= 6 && hour < 12) {
      setSpirit({
        mood: 'happy',
        message: "morning! let's get it 🌅",
        emoji: '☀️'
      })
      return
    }

    // default chill state
    const chillMessages = [
      "just vibing with your tabs 👻",
      "i'm here if you need me",
      "your browsing companion 💫",
      "keeping an eye on things 👀",
      "tab guardian on duty 🛡️",
    ]
    setSpirit({
      mood: 'happy',
      message: chillMessages[Math.floor(Math.random() * chillMessages.length)],
      emoji: '👻'
    })
  }


  function getMoodColor(mood: string): string {
    switch (mood) {
      case 'happy': return 'var(--accent-primary)'
      case 'proud': return '#4caf50'
      case 'concerned': return 'var(--accent-secondary)'
      case 'tired': return '#9e9e9e'
      case 'sleepy': return '#7c4dff'
      case 'excited': return '#ffeb3b'
      default: return 'var(--accent-primary)'
    }
  }

  return (
    <div className="tab-spirit" style={{ borderColor: getMoodColor(spirit.mood) }}>
      <div className="spirit-avatar">
        <span className="spirit-emoji">{spirit.emoji}</span>
      </div>
      <div className="spirit-content">
        <div className="spirit-message">{spirit.message}</div>
        <div className="spirit-meta">
          <span className="switch-count">{totalSwitches} switches today</span>
          {switchRate > 0 && (
            <span className="switch-rate"> • {switchRate}/5s</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default TabSpirit
