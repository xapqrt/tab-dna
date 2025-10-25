// this is one of the main features so i'll surely give in some time here, this file here is basically for the tabsuggestion one, that auto suggest some tabs, one of the features which i snot a gimmick


/// <reference types="chrome"/>

import React, {useEffect, useState } from 'react'



interface Suggestion {
    domain: string
    reason: string
    confidence: number 
    url?: string
}





interface TabSUggestionsprops {
    modeGuess?: string
    habits?: any[]
    tab_dna?: any

}





function TabSuggestions({ modeGuess, habits, tab_dna }:TabSUggestionsprops) {


    const [suggestions, setSuggestions] = useState<Suggestion[]>
    ([])




    useEffect(() => {


        if(!modeGuess && !habits) return

        //generating suggestion shere based on mode and habits


        const generated = generateSuggestions()
        setSuggestions(generated)

    }, [modeGuess, habits, tab_dna])






    function generateSuggestions(): Suggestion[] {


        const suggs: Suggestion[] = []


        //suggesting on time


        if(habits && habits.length > 0) {
            const topHabits = habits.slice(0, 3)
            //for current time






            for (const habit of topHabits){

                if(habit.confidence > 50){

                    suggs.push({
                        domain: habit.domain,
                        reason: `u usually visit this around the time`,
                        confidence: habit.confidence,
                        url: `https://${habit.domain}`  //i lwkey hopep this is right


                    })
                }
            }
        }




        //mode based suggestion code below



        if(modeGuess) {
            const modeSuggs = getModeBasedSuggestions(modeGuess)
            suggs.push(...modeSuggs)

        }


        //sort by confidence
        suggs.sort((a,b) => b.confidence - a.confidence)


        return suggs.slice(0,5)
    }





    function getModeBasedSuggestions(mode: string): Suggestion [] {
        const suggs: Suggestion[] = []


        switch(mode) {

            case 'FOCUS' :
                        if(tab_dna) {
                            const productiveDomains = ['github.com', 'stackoverflow.com', 'docs.google.com', 'notion.so']




                            for(const domain of productiveDomains) {
                                if(tab_dna[domain]) {

                                    suggs.push({
                                        domain,
                                        reason: 'FOCUS mode',
                                        confidence: 70,
                                        url: `https://${domain}`
                                    })
                                }
                            }
                        }

                        break







                        case `PANIC`:

                        //suggesting um maybe calm sites?

                        suggs.push({
                            domain: 'youtube.com',
                            reason: 'dude ur doing too much, maybe calm down',
                            confidence: 60,
                            url: 'https://youtube.com'
                        })
                        break









                        case 'CHILL':
                            //chill webs

                            if(tab_dna) {
                                const chillDomains = ['reddit.com', 'youtube.com', 'twitter.com', 'netflix.com']






                                for (const domain of chillDomains) {
                                    if(tab_dna[domain]) {
                                        suggs.push({

                                            domain,
                                            reason: 'chill vibes detected',
                                            confidence: 65,
                                            url: `https://${domain}`

                                        })
                                    }
                                }
        
        
                            }
                            break



        }
        return suggs

    }

    function handleOpenTab(url: string): void {

        if(url) {

            chrome.tabs.create({url})
        }
    }





    function getConfidenceColor(confidence: number): string {

        if (confidence >70) return '#00ff41'
        if(confidence > 50) return '#00d4ff'
        return '#ff00ff88'
    }


     if (!suggestions || suggestions.length === 0) {
    return (
      <div className="tab-suggestions empty">
        <p className="hint">// no suggestions right now</p>
        <p className="hint">// browse more to build ur profile 👀</p>
      </div>
    )
  }



 return (
    <div className="tab-suggestions">
      <div className="suggestions-header">
        <span className="label">💡 suggestions</span>
        <span className="mode-hint">{modeGuess || 'unknown'} mode</span>
      </div>




      <div className="suggestions-list">
        {suggestions.map((sugg, idx) => (
          <div 
            key={`${sugg.domain}-${idx}`} 
            className="suggestion-item"
            onClick={() => handleOpenTab(sugg.url || `https://${sugg.domain}`)}
          >
            <div className="suggestion-info">
              <div className="suggestion-domain">{sugg.domain}</div>
              <div className="suggestion-reason">{sugg.reason}</div>
            </div>
            <div 
              className="suggestion-confidence"
              style={{ color: getConfidenceColor(sugg.confidence) }}
            >
              {sugg.confidence}%
            </div>
          </div>
        ))}
      </div>




      <div className="suggestions-footer">
        <small>click to open • suggestions based on ur habits</small>
      </div>
    </div>
  )
}






export default TabSuggestions