/// <reference types="chrome"/>

import React, { useEffect, useState } from 'react'
import './App.css'
import DNAViz from './DNAViz'
import HabitDisplay from './HabitDisplay'
import StatsPanel from './StatsPanel'
import TabSuggestions from './TabSuggestions'
import BlacklistManager from './BlacklistManager'
import DNAExporter from './DNAExporter'
import DNATimeline from './DNATimeline'
import TabPredictions from './TabPredictions'
import SiteStreaks from './SiteStreaks'
import TabSpirit from './TabSpirit'
import VectorExporter from './VectorExporter'


interface DNAState {
  modeGuess?: string
  tab_dna?: any
  habit_map?: any[]
  visit_patterns?: any[]
  totalSwitches?: number
}


function App() {
  const [dna, setDNA] = useState<DNAState>({})
  const [habits, setHabits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // load DNA from storage
    try {
      chrome.storage.local.get(['tab_dna', 'habit_map', 'modeGuess', 'visit_patterns', 'totalSwitches'], (data) => {
        console.log("loaded DNA:", data)
        
        if (chrome.runtime.lastError) {
          console.error('Storage error:', chrome.runtime.lastError)
          setError('Failed to load data')
          setLoading(false)
          return
        }

        setDNA(data || {})
        
        // compute habits from visit patterns
        if (data.visit_patterns && data.visit_patterns.length > 0) {
          const detectedHabits = computeHabits(data.visit_patterns)
          setHabits(detectedHabits)
        }
        
        setLoading(false)
      })
    } catch (err) {
      console.error('Error loading DNA:', err)
      setError('Failed to initialize')
      setLoading(false)
    }
  }, [])



  // mini habit detector in popup — should match backend logic
  function computeHabits(patterns: any[]): any[] {
    if (patterns.length < 10) return []


    const domainGroups: Record<string, any[]> = {}
    


    for (const p of patterns) {
      if (!domainGroups[p.domain]) {
        domainGroups[p.domain] = []
      }
      domainGroups[p.domain].push(p)
    }




    const habits: any[] = []


    for (const [domain, pats] of Object.entries(domainGroups)) {
      const timeSlots = { morning: 0, afternoon: 0, evening: 0, night: 0 }
      


      for (const p of pats) {
        if (p.hour >= 6 && p.hour < 12) timeSlots.morning++
        else if (p.hour >= 12 && p.hour < 18) timeSlots.afternoon++
        else if (p.hour >= 18 && p.hour < 22) timeSlots.evening++
        else timeSlots.night++
      }




      for (const [timeOfDay, count] of Object.entries(timeSlots)) {
        if (count >= 3) {
          const confidence = Math.min(100, Math.round((count / pats.length) * 100))
          habits.push({
            domain,
            timeOfDay,
            confidence,
            lastSeen: Math.max(...pats.map((p: any) => p.timestamp))
          })
        }
      }
    }




    habits.sort((a, b) => b.confidence - a.confidence)
    return habits
  }


  return (
    <div className="app">
      {loading && (
        <div className="loading-state">
          <p>loading your dna...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>⚠️ {error}</p>
          <button onClick={() => window.location.reload()}>retry</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <header>
            <h1>Tab DNA</h1>
            <p className="tagline">Your browsing habits, decoded</p>
          </header>

          <TabSpirit 
            totalSwitches={dna.totalSwitches}
            recentActivity={dna.modeGuess}
          />

          <DNAViz tab_dna={dna.tab_dna} modeGuess={dna.modeGuess} />

      <TabPredictions 
        habits={habits}
        tab_dna={dna.tab_dna}
        modeGuess={dna.modeGuess}
        visit_patterns={dna.visit_patterns}
      />

      <DNATimeline 
        habit_map={dna.habit_map}
        visit_patterns={dna.visit_patterns}
        totalSwitches={dna.totalSwitches}
      />

      <StatsPanel 
        tab_dna={dna.tab_dna} 
        habit_map={dna.habit_map}
        totalSwitches={dna.totalSwitches}
      />

      <TabSuggestions 
        modeGuess={dna.modeGuess}
        habits={habits}
        tab_dna={dna.tab_dna}
      />

      <HabitDisplay habits={habits} />

      <SiteStreaks 
        visit_patterns={dna.visit_patterns}
        tab_dna={dna.tab_dna}
      />

      <BlacklistManager onUpdate={() => {
        // reload data when blacklist changes
        setLoading(true)
        chrome.storage.local.get(['tab_dna', 'habit_map', 'modeGuess', 'visit_patterns', 'totalSwitches'], (data) => {
          if (chrome.runtime.lastError) {
            console.error('Reload error:', chrome.runtime.lastError)
            setLoading(false)
            return
          }
          setDNA(data || {})
          if (data.visit_patterns) {
            setHabits(computeHabits(data.visit_patterns))
          }
          setLoading(false)
        })
      }} />

      <VectorExporter 
        tab_dna={dna.tab_dna}
        habit_map={dna.habit_map}
        totalSwitches={dna.totalSwitches}
        modeGuess={dna.modeGuess}
      />

      <DNAExporter />

      <footer>
        <small>local only • privacy-first • slightly creepy</small>
      </footer>
        </>
      )}
    </div>
  )
}

export default App









