

import React, { useEffect, useState } from 'react'
import './App.css'
import DNAViz from './DNAViz'


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

      <DNAViz tab_dna={dna.tab_dna} modeGuess={dna.modeGuess} />

      <footer>
        <small>local only • privacy-first • slightly creepy</small>
      </footer>
    </div>
  )
}

export default App


/*
  COMMIT: integrated DNA viz component into popup
  - replaced placeholder with actual DNAViz component
  - passing tab_dna and modeGuess as props
  - ready to see some color-coded browsing personality
*/






