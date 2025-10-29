//shows ur browsing pattern throughout the day its fun



/// <reference types="chrome"/>

import React, { useEffect, useState } from 'react'




interface TimelineDataPoint {
  hour: number   
  switches: number
  mode: 'FOCUS' | 'CHILL' | 'PANIC' | 'UNKNOWN'
  energy: number
}




interface DNATimelineProps {
  habit_map?: any[]
  visit_patterns?: any[]
  totalSwitches?: number
}




function DNATimeline({ habit_map, visit_patterns, totalSwitches }: DNATimelineProps) {
  const [timeline, setTimeline] = useState<TimelineDataPoint[]>([])
  const [peakHour, setPeakHour] = useState<number>(0)
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours())




  useEffect(() => {
    if (!visit_patterns || visit_patterns.length === 0) return



    // group data by hour
    const hourly_data: Record<number, { count: number, mode: string }> = {}
    

    for (let i = 0; i < 24; i++) {
      hourly_data[i] = { count: 0, mode: 'UNKNOWN' }
    }




    // count visits per hour
    for (const pattern of visit_patterns) {
      const hour = pattern.hour
      if (hour >= 0 && hour < 24) {
        hourly_data[hour].count++
      }
    }



    // calculate energy and mode for each hour
    const timeline_data: TimelineDataPoint[] = []
    let max_switches = 0
    let peak_hr = 0




    for (let hour = 0; hour < 24; hour++) {
      const switches = hourly_data[hour].count
      

      // determine mode based on activity
      let mode: 'FOCUS' | 'CHILL' | 'PANIC' | 'UNKNOWN' = 'UNKNOWN'
      if (switches > 15) mode = 'PANIC'
      else if (switches > 8) mode = 'CHILL'
      else if (switches > 3) mode = 'FOCUS'


      // calculate energy level (0-100)
      const energy = Math.min(100, (switches / 20) * 100)


      timeline_data.push({
        hour,
        switches,
        mode,
        energy
      })


      if (switches > max_switches) {
        max_switches = switches
        peak_hr = hour
      }
    }


    setTimeline(timeline_data)
    setPeakHour(peak_hr)




  }, [visit_patterns])




  function getModeColor(mode: string): string {
    switch (mode) {
      case 'FOCUS': return '#00ff41'
      case 'PANIC': return '#ff0066'
      case 'CHILL': return '#00d4ff'
      default: return '#333'
    }
  }




  function formatHour(hour: number): string {
    if (hour === 0) return '12am'
    if (hour < 12) return `${hour}am`
    if (hour === 12) return '12pm'
    return `${hour - 12}pm`
  }




  function getEnergyLabel(energy: number): string {
    if (energy > 70) return '🔥 intense'
    if (energy > 40) return '⚡ active'
    if (energy > 15) return '💤 chill'
    return '😴 dead'
  }



  if (!timeline || timeline.length === 0) {
    return (
      <div className="dna-timeline empty">
        <p className="hint">// no timeline data yet</p>
        <p className="hint">// browse more to see ur energy patterns 📈</p>
      </div>
    )
  }


  const max_energy = Math.max(...timeline.map(d => d.energy))




  return (
    <div className="dna-timeline">
      <div className="timeline-header">
        <span className="label">⚡ browsing timeline</span>
        <span className="peak-info">
          peak: {formatHour(peakHour)}
        </span>
      </div>




      <div className="timeline-graph">
        <div className="graph-grid">
          {timeline.map((point) => {
            const is_current = point.hour === currentHour
            const height_pct = max_energy > 0 ? (point.energy / max_energy) * 100 : 0
            

            return (
              <div 
                key={point.hour} 
                className={`graph-bar ${is_current ? 'current' : ''}`}
                title={`${formatHour(point.hour)}: ${point.switches} switches (${point.mode})`}
              >
                <div 
                  className="bar-fill"
                  style={{
                    height: `${height_pct}%`,
                    background: getModeColor(point.mode),
                    boxShadow: `0 0 8px ${getModeColor(point.mode)}44`
                  }}
                />
                {is_current && (
                  <div className="current-marker">●</div>
                )}
                {point.hour % 3 === 0 && (
                  <div className="hour-label">{formatHour(point.hour)}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>




      <div className="timeline-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#00ff41' }}></span>
          <span className="legend-text">focus</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#00d4ff' }}></span>
          <span className="legend-text">chill</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: '#ff0066' }}></span>
          <span className="legend-text">panic</span>
        </div>
      </div>




      <div className="timeline-stats">
        <div className="stat-chip">
          {getEnergyLabel(timeline[currentHour]?.energy || 0)}
        </div>
        <div className="stat-chip">
          {totalSwitches || 0} total switches
        </div>
      </div>
    </div>
  )
}




export default DNATimeline
