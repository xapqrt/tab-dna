//shows browsing ststs, making the extenion render blank someehow



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
    let avg_dwell = 0
    let top_domain = '—'
    let unique_domains = 0
    let total_dwell_time = 0




    // from habit_map (dwell events)
    if (habit_map && habit_map.length > 0) {
      const total_duration = habit_map.reduce((sum: number, event: any) => sum + (event.duration || 0), 0)
      avg_dwell = Math.round(total_duration / habit_map.length)
      total_dwell_time = total_duration
    }



    // from tab_dna (domain visits)
    if (tab_dna) {
      const domains = Object.keys(tab_dna)
      unique_domains = domains.length

      

      if (domains.length > 0) {
        const sorted = domains.sort((a, b) => tab_dna[b].visits - tab_dna[a].visits)
        top_domain = sorted[0]
      }
    }


    setStats({
      avgDwell: avg_dwell,
      topDomain: top_domain,
      uniqueDomains: unique_domains,
      totalDwellTime: total_dwell_time
    })
  }


  



  function formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`
    

    const mins = Math.floor(seconds / 60)
    if (mins < 60) return `${mins}m`
    

    const hours = Math.floor(mins / 60)
    const remain_mins = mins % 60
    return `${hours}h ${remain_mins}m`
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







