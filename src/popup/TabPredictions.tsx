// predicts ur next tab based on habits and patterns
// lmao this is kinda wild




/// <reference types="chrome"/>

import React, { useEffect, useState } from 'react'




interface Prediction {
  domain: string
  confidence: number
  reason: string
  emoji: string
}




interface TabPredictionsProps {
  habits?: any[]
  tab_dna?: any
  modeGuess?: string
  visit_patterns?: any[]
}




function TabPredictions({ habits, tab_dna, modeGuess, visit_patterns }: TabPredictionsProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [topPrediction, setTopPrediction] = useState<Prediction | null>(null)




  useEffect(() => {
    if (!habits || !tab_dna || !visit_patterns) return




    const preds = generatePredictions()
    setPredictions(preds)
    if (preds.length > 0) {
      setTopPrediction(preds[0])
    }
  }, [habits, tab_dna, modeGuess, visit_patterns])




  function generatePredictions(): Prediction[] {
    const preds: Prediction[] = []
    const now = new Date()
    const currentHour = now.getHours()
    const currentDay = now.getDay()



    // time based predictions from habits
    if (habits && habits.length > 0) {
      const timeSlot = getTimeSlot(currentHour)
      const relevantHabits = habits.filter(h => h.timeOfDay === timeSlot && h.confidence > 40)




      for (const habit of relevantHabits.slice(0, 2)) {
        preds.push({
          domain: habit.domain,
          confidence: Math.min(95, habit.confidence + 10),
          reason: `u always visit this ${timeSlot}`,
          emoji: getTimeEmoji(timeSlot)
        })
      }
    }




    // mode based predictions
    if (modeGuess) {
      const mode_preds = getModeBasedPredictions(modeGuess)
      preds.push(...mode_preds)
    }



    // pattern based predictions (what u visited recently)
    if (visit_patterns && visit_patterns.length > 0) {
      const recentPatterns = visit_patterns.slice(-10)
      const domainFreq: Record<string, number> = {}




      for (const p of recentPatterns) {
        domainFreq[p.domain] = (domainFreq[p.domain] || 0) + 1
      }




      const frequentDomains = Object.entries(domainFreq)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2)




      for (const [domain, freq] of frequentDomains) {
        if (!preds.find(p => p.domain === domain)) {
          preds.push({
            domain,
            confidence: Math.min(85, 50 + (freq * 10)),
            reason: 'been visiting this a lot lately',
            emoji: '🔥'
          })
        }
      }
    }




    // day based predictions (weekend vs weekday)
    const is_weekend = currentDay === 0 || currentDay === 6
    if (is_weekend) {
      const weekend_sites = ['youtube.com', 'netflix.com', 'reddit.com', 'twitter.com']
      for (const site of weekend_sites) {
        if (tab_dna && tab_dna[site] && !preds.find(p => p.domain === site)) {
          preds.push({
            domain: site,
            confidence: 65,
            reason: 'weekend vibes detected',
            emoji: '🎮'
          })
          break
        }
      }
    } else {
      const weekday_sites = ['github.com', 'stackoverflow.com', 'docs.google.com', 'mail.google.com']
      for (const site of weekday_sites) {
        if (tab_dna && tab_dna[site] && !preds.find(p => p.domain === site)) {
          preds.push({
            domain: site,
            confidence: 70,
            reason: 'weekday work mode',
            emoji: '💼'
          })
          break
        }
      }
    }




    // late nite predictions
    if (currentHour >= 22 || currentHour < 4) {
      if (tab_dna && tab_dna['youtube.com'] && !preds.find(p => p.domain === 'youtube.com')) {
        preds.push({
          domain: 'youtube.com',
          confidence: 75,
          reason: 'late night rabbit hole incoming',
          emoji: '🌙'
        })
      }
    }


    // sort by confidence
    preds.sort((a, b) => b.confidence - a.confidence)




    return preds.slice(0, 4)
  }




  function getModeBasedPredictions(mode: string): Prediction[] {
    const preds: Prediction[] = []



    switch (mode) {
      case 'FOCUS':
        if (tab_dna) {
          const focus_sites = ['github.com', 'stackoverflow.com', 'docs.google.com']
          for (const site of focus_sites) {
            if (tab_dna[site] && !predictions.find(p => p.domain === site)) {
              preds.push({
                domain: site,
                confidence: 80,
                reason: 'FOCUS mode detected',
                emoji: '🎯'
              })
              break
            }
          }
        }
        break




      case 'PANIC':
        preds.push({
          domain: 'google.com',
          confidence: 70,
          reason: 'ur panicking, probably need to search smth',
          emoji: '😰'
        })
        break




      case 'CHILL':
        if (tab_dna) {
          const chill_sites = ['youtube.com', 'reddit.com', 'twitter.com']
          for (const site of chill_sites) {
            if (tab_dna[site] && !predictions.find(p => p.domain === site)) {
              preds.push({
                domain: site,
                confidence: 75,
                reason: 'CHILL mode active',
                emoji: '😎'
              })
              break
            }
          }
        }
        break
    }




    return preds
  }




  function getTimeSlot(hour: number): string {
    if (hour >= 6 && hour < 12) return 'morning'
    if (hour >= 12 && hour < 18) return 'afternoon'
    if (hour >= 18 && hour < 22) return 'evening'
    return 'night'
  }




  function getTimeEmoji(timeSlot: string): string {
    switch (timeSlot) {
      case 'morning': return '🌅'
      case 'afternoon': return '☀️'
      case 'evening': return '🌆'
      case 'night': return '🌙'
      default: return '⏰'
    }
  }




  function getConfidenceColor(confidence: number): string {
    if (confidence >= 80) return '#00ff41'
    if (confidence >= 60) return '#00d4ff'
    if (confidence >= 40) return '#ffaa00'
    return '#ff006688'
  }




  function getConfidenceLabel(confidence: number): string {
    if (confidence >= 80) return 'very likely'
    if (confidence >= 60) return 'likely'
    if (confidence >= 40) return 'possible'
    return 'maybe'
  }




  function openPredictedTab(url: string): void {
    chrome.tabs.create({ url: `https://${url}` })
  }




  if (!predictions || predictions.length === 0) {
    return (
      <div className="tab-predictions empty">
        <p className="hint">// need more data to predict ur next move 🔮</p>
        <p className="hint">// browse a bit more first</p>
      </div>
    )
  }




  return (
    <div className="tab-predictions">
      <div className="predictions-header">
        <span className="label">🔮 next tab prediction</span>
        <span className="accuracy">based on ur patterns</span>
      </div>




      {topPrediction && (
        <div className="top-prediction" onClick={() => openPredictedTab(topPrediction.domain)}>
          <div className="prediction-emoji">{topPrediction.emoji}</div>
          <div className="prediction-content">
            <div className="prediction-domain">{topPrediction.domain}</div>
            <div className="prediction-reason">{topPrediction.reason}</div>
          </div>
          <div className="prediction-confidence">
            <div 
              className="confidence-value"
              style={{ color: getConfidenceColor(topPrediction.confidence) }}
            >
              {topPrediction.confidence}%
            </div>
            <div className="confidence-label">
              {getConfidenceLabel(topPrediction.confidence)}
            </div>
          </div>
        </div>
      )}




      {predictions.length > 1 && (
        <div className="other-predictions">
          <div className="other-header">other possibilities:</div>
          {predictions.slice(1).map((pred, idx) => (
            <div 
              key={`${pred.domain}-${idx}`}
              className="mini-prediction"
              onClick={() => openPredictedTab(pred.domain)}
            >
              <span className="mini-emoji">{pred.emoji}</span>
              <span className="mini-domain">{pred.domain}</span>
              <span 
                className="mini-confidence"
                style={{ color: getConfidenceColor(pred.confidence) }}
              >
                {pred.confidence}%
              </span>
            </div>
          ))}
        </div>
      )}




      <div className="predictions-footer">
        <small> click to open  predictions update live</small>
      </div>
    </div>
  )  

  
}




export default TabPredictions
