

import React, { useEffect, useState } from 'react'
import './App.css'


interface DNAState {
  modeGuess?: string
  tab_dna?: any
  habit_map?: any[]
}


function App() {
  const [dna, setDNA] = useState<DNAState>({})

  useEffect(() => {
    // load DNA from storage
    chrome.storage.local.get(['tab_dna', 'habit_map', 'modeGuess'], (data) => {
      console.log("loaded DNA:", data)
      setDNA(data)
    })
  }, [])


  return (
    <div className="app">
      <header>
        <h1>🧬 Tab DNA</h1>
        <p className="tagline">your browser knows you now</p>
      </header>

      <div className="dna-display">
        <p>Mode: <span className="highlight">{dna.modeGuess || "unknown"}</span></p>
        
        {/* TODO: actual DNA viz here */}
        <div className="placeholder">
          <p>// DNA strands go here</p>
          <p>// color bars, personality graph, switching speed</p>
          <p>// idk make it look cool</p>
        </div>
      </div>

      <footer>
        <small>local only • privacy-first • slightly creepy</small>
      </footer>
    </div>
  )
}

export default App



