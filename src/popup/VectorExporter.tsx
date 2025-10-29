//sharable vector for browser switching makes it easier

//its very light so wont put much stress on the storage or naything, actually doing it for the bonus, i feel like this sits between clever caching and this

/// <reference types="chrome"/>

import React, { useState, useEffect } from 'react'


interface DNAVector {
  v: string  
  ts: number  
  sw: number  
  dw: number  
  dm: string[] 
  md: string  
  ht: {  
    m: number
    a: number
    e: number
    n: number
  }
  sc: number  
  sig: string 
}







interface VectorExporterProps {
  tab_dna?: any
  habit_map?: any[]
  totalSwitches?: number
  modeGuess?: string
}







function VectorExporter({ tab_dna, habit_map, totalSwitches, modeGuess }: VectorExporterProps) {






  const [vector, setVector] = useState<string>('')
  const [vector_obj, setVectorObj] = useState<DNAVector | null>(null)
  const [copied, setCopied] = useState(false)
  const [importing, setImporting] = useState(false)
  const [import_txt, setImportText] = useState('')





  useEffect(() => {
    generateVector()
  }, [tab_dna, habit_map, totalSwitches, modeGuess])



  function generateVector(): void {
    if (!tab_dna && !habit_map) return





    // calc avg dwell


    let avg_dwell = 0
    if (habit_map && habit_map.length > 0) {
      const total_dwell = habit_map.reduce((sum: number, h: any) => sum + (h.duration || 0), 0)
      avg_dwell = Math.round(total_dwell / habit_map.length)
    }




    // get top 5 domains


    const top_doms: string[] = []
    if (tab_dna) {
      const sorted = Object.entries(tab_dna)
        .sort(([, a]: any, [, b]: any) => b.visits - a.visits)
        .slice(0, 5)
        .map(([domain]) => domain)
      top_doms.push(...sorted)
    }

    // calc habit timeslots distribution
    const habit_times = { m: 0, a: 0, e: 0, n: 0 }
    if (habit_map) {
      for (const h of habit_map) {
        const hr = new Date(h.timestamp).getHours()
        if (hr >= 6 && hr < 12) habit_times.m++
        else if (hr >= 12 && hr < 18) habit_times.a++
        else if (hr >= 18 && hr < 22) habit_times.e++
        else habit_times.n++
      }
    }






    // calc scroll activity (placeholder, would use real scroll data)




    const scroll_score = Math.min(100, (totalSwitches || 0) % 100)



    // create vector


    const dna_vec: DNAVector = {
      v: '1.0',
      ts: Date.now(),
      sw: totalSwitches || 0,
      dw: avg_dwell,
      dm: top_doms,
      md: modeGuess || 'unknown',
      ht: habit_times,
      sc: scroll_score,
      sig: generateSignature(totalSwitches || 0, avg_dwell, top_doms)
    }

    setVectorObj(dna_vec)





    // compress to base64
    const json = JSON.stringify(dna_vec)
    const encoded = btoa(json)
    setVector(encoded)
  }






  function generateSignature(switches: number, dwell: number, domains: string[]): string {


    // simple hash for verification 




    const data = `${switches}-${dwell}-${domains.join(',')}`
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const chr = data.charCodeAt(i)
      hash = ((hash << 5) - hash) + chr
      hash |= 0
    }
    return Math.abs(hash).toString(36)
  }




  async function copyVector(): Promise<void> {
    if (!vector) return





    try {
      await navigator.clipboard.writeText(vector)
      setCopied(true)


      setTimeout(() => setCopied(false), 2000)

      console.log('vector copied! 📋')

    } catch (err) {

      console.error('copy failed:', err)

    
      
      alert('copy to clipboard: ' + vector)
    }
  }





  async function importVector(): Promise<void> {
    if (!import_txt.trim()) return



    try {
      // decode base64



      const decoded = atob(import_txt.trim())
      const imported: DNAVector = JSON.parse(decoded)





      // verify signature
      const expected_sig = generateSignature(imported.sw, imported.dw, imported.dm)
      if (imported.sig !== expected_sig) {
        alert(' vector signature mismatch, might be corrupted')
      }







      
      await mergeImportedVector(imported)

      alert('✅ vector imported successfully!')
      setImporting(false)
      setImportText('')

      // reload popup to show new data
      window.location.reload()

    } catch (err) {
      console.error('import failed:', err)
      alert('❌ failed to import vector, check format')
    }
  }









  async function mergeImportedVector(imported: DNAVector): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.get(null, (current_data) => {
        



        // merge switches
        const new_switches = (current_data.totalSwitches || 0) + imported.sw








        // merge domains into tabdna
        const merged_dna = { ...current_data.tab_dna }
        for (const domain of imported.dm) {
          if (!merged_dna[domain]) {
            merged_dna[domain] = { visits: 1, lastSeen: imported.ts, totalDwellTime: imported.dw }
          } else {
            merged_dna[domain].visits += 1
            merged_dna[domain].lastSeen = Math.max(merged_dna[domain].lastSeen, imported.ts)
          }
        }





        // save merged data
        chrome.storage.local.set({
          totalSwitches: new_switches,
          tab_dna: merged_dna,
          modeGuess: imported.md,
          lastImport: imported.ts
        }, () => {



          console.log('merged vector data 🧬')
          resolve()
        })
      })
    })
  }





  function getVectorSize(): string {
    if (!vector) return '0 B'

    const bytes = new Blob([vector]).size
    if (bytes < 1024) return `${bytes} B`


    return `${(bytes / 1024).toFixed(2)} KB`
  }

  function formatTimestamp(ts: number): string {
    const date = new Date(ts)
    return date.toLocaleString()
  }


  if (!vector_obj) {
    return (


      <div className="vector-exporter empty">


        <p className="hint">// generating vector...</p>
      </div>
    )
  }


  return (
    <div className="vector-exporter">

      <div className="vector-header">

        <span className="label">🧬 dna vector</span>

        <span className="vector-size">{getVectorSize()}</span>
      </div>






      <div className="vector-preview">
        <div className="preview-stats">
          <div className="stat-row">
            <span className="stat-label">switches:</span>
            <span className="stat-val">{vector_obj.sw}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">avg dwell:</span>
            <span className="stat-val">{vector_obj.dw}s</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">mode:</span>
            <span className="stat-val">{vector_obj.md}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">top domains:</span>
            <span className="stat-val">{vector_obj.dm.length}</span>
          </div>
        </div>




        <div className="vector-code">
          <code>{vector.substring(0, 60)}...</code>
        </div>
      </div>





      <div className="vector-actions">
        <button 
          className="copy-vector-btn"
          onClick={copyVector}
        >
          {copied ? '✓ copied!' : '📋 copy vector'}
        </button>

        <button 
          className="import-vector-btn"
          onClick={() => setImporting(!importing)}
        >
          📥 import vector
        </button>
      </div>




      {importing && (
        <div className="import-section">
          <div className="import-header">
            <span>paste vector to import:</span>
          </div>




          <textarea
            className="import-textarea"
            value={import_txt}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="paste base64 vector here..."
            rows={4}
          />
          <div className="import-actions">
            <button onClick={importVector}>import & merge</button>
            <button onClick={() => setImporting(false)}>cancel</button>
          </div>
        </div>
      )}

      <div className="vector-footer">
        <small>
          vector = compact snapshot of ur browsing dna
          <br />
          copy to move browsers or share ur vibe 
        </small>
      </div>






      <div className="vector-details">
        <details>
          <summary>view full vector data</summary>
          <pre className="vector-json">
            {JSON.stringify(vector_obj, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  )
}



export default VectorExporter

//lets hope it does not crashes