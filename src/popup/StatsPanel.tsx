/*
  STATS PANEL
  shows user their browsing stats — total switches, avg dwell, top domains
  basically a numbers dashboard but make it look like hacker terminal vibes
*/



import React, { useEffect, useState } from 'react'




interface StatsPanelProps {
  tab_dna?: any
  habit_map?: any[]
  totalSwitches?: number
}




function StatsPanel({ tab_dna, habit_map, totalSwitches }: StatsPanelProps) {

  const [stats, setStats] = useState<any>({
    avgDwell: 0,
    topDomain: '—',
    uniqueDomains: 0,
    totalDwellTime: 0
  })




  useEffect(() => {
    if (!tab_dna && !habit_map) return


    // compute stats from data
    computeStats()
  }, [tab_dna, habit_map])




  



  function computeStats(): void {
    let avgDwell = 0
    let topDomain = '—'
    let uniqueDomains = 0
    let totalDwellTime = 0




    // from habit_map (dwell events)
    if (habit_map && habit_map.length > 0) {
      const totalDuration = habit_map.reduce((sum: number, event: any) => sum + (event.duration || 0), 0)
      avgDwell = Math.round(totalDuration / habit_map.length)
      totalDwellTime = totalDuration
    }




    // from tab_dna (domain visits)
    if (tab_dna) {
      const domains = Object.keys(tab_dna)
      uniqueDomains = domains.length


      


      if (domains.length > 0) {
        const sorted = domains.sort((a, b) => tab_dna[b].visits - tab_dna[a].visits)
        topDomain = sorted[0]
      }
    }




    setStats({
      avgDwell,
      topDomain,
      uniqueDomains,
      totalDwellTime
    })
  }




  



  function formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`
    


    const mins = Math.floor(seconds / 60)
    if (mins < 60) return `${mins}m`
    


    const hours = Math.floor(mins / 60)
    const remainMins = mins % 60
    return `${hours}h ${remainMins}m`
  }




  



  function formatDomain(domain: string): string {
    // shorten long domains
    if (domain.length > 25) {
      return domain.substring(0, 22) + '...'
    }
    return domain
  }




  return (
    <div className="stats-panel">
      <div className="stats-header">
        <span className="label">📊 stats</span>
      </div>




      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{totalSwitches || 0}</div>
          <div className="stat-label">tab switches</div>
        </div>




        <div className="stat-item">
          <div className="stat-value">{formatTime(stats.avgDwell)}</div>
          <div className="stat-label">avg dwell</div>
        </div>




        <div className="stat-item">
          <div className="stat-value">{stats.uniqueDomains}</div>
          <div className="stat-label">unique sites</div>
        </div>




        <div className="stat-item highlight">
          <div className="stat-value">{formatDomain(stats.topDomain)}</div>
          <div className="stat-label">top domain</div>
        </div>
      </div>




      {/* extra stat — total time spent browsing */}
      <div className="extra-stat">
        <span className="extra-label">total time tracked:</span>
        <span className="extra-value">{formatTime(stats.totalDwellTime)}</span>
      </div>
    </div>
  )
}




export default StatsPanel





