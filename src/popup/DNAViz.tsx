/*dna visualisation code, trying to color code dna style to each domain, alr lemme lock in*/



import React, { useEffect, useState} from 'react'



interface DomainData {

    visits: number
    lastSeen: number
    totalDwellTime?: number 


}


interface TabDNA {

    [domain: string]: DomainData
}






interface DNAVizProps {

    tab_dna?: TabDNA
    modeGuess?: string

}






function DNAViz({ tab_dna, modeGuess }: DNAVizProps) {


    const[dominant_domains, setDominantDomains] = useState<Array<{domain: string, visits: number, color: string}>>([])



    useEffect(() => {


        if(!tab_dna) return


        //trying to get top domai by vist count
    


                    const domains = Object.entries(tab_dna)

                    .map(([domain, data]) => ({

                        domain,
                        visits: data.visits,
                        color: getDNAColor(data.visits, data.totalDwellTime || 0)

                    }))

                    .sort((a,b) => b.visits -a.visits)
                    .slice(0,8)

                    //doint top 8 cuz i fell this will be more relevant cuz people want the personality to match what they do regularaly, not like on historic shi so ig this should work



                    setDominantDomains(domains)

    }, [tab_dna])



    //thinking of doing color logic like more th enumber of visits warnmer the color? and like how much people hand around the browser it should or i mean would be like stronger the color, putting js arbitray values rn cuz idk shi how to do this rn, lemme lock in and figure out, maybe copilot compllletions catch me and save me, gg



    function getDNAColor(visits: number, dwellTime: number): string {


        const hue = Math.max(0, 280 - (visits * 15))

        //purple to red, i like those, idk if people like green as much as me so 

        const saturation = Math.min(100, 60 + (dwellTime/100))

        const lightness=55

         return `hsl(${hue}, ${saturation}%, ${lightness}%)`

    }


    //now mode color for the bg glow effect, i hope its gonna look sick and not vibey


    function getModeColor(): string {

        switch(modeGuess) {

            case 'FOCUS': return '#00ff41'
            case 'PANIC': return '#ff0066'
            case 'CHILL': return '#00d4ff'
            default: return '#666'

        }
    }


   if (!tab_dna || Object.keys(tab_dna).length === 0) {
    return (

      <div className="dna-viz empty">
        <p>// no DNA data yet</p>

        <p>// browse some tabs first 🧬</p>
      </div>
    )
  }




  return (

    <div className = "dna-viz">

        <div className="dna-header">
            <span className = "mode-badge" style={{ borderColor: getModeColor(), color: getModeColor()}}>
                {modeGuess || 'unknown'}  
            </span>
        </div>

        <div className="dna-strands">
            {dominant_domains.map((d, idx) => (
                <div key={d.domain} className="dna-strand">
                    <div 
                        className="strand-bar" 
                        style={{ 
                            width: `${Math.min(100, (d.visits / dominant_domains[0].visits) * 100)}%`,
                            background: d.color,
                            animationDelay: `${idx * 0.1}s`
                        }}
                    />
                    <div className="strand-label">
                        <span className="domain-name">{d.domain}</span>
                        <span className="visit-count">{d.visits}x</span>
                    </div>
                </div>
            ))}
        </div>

        {/* dna helix decoration part, wont be putting no*/ }

        <div className ="helix-decoration">
            <div className ="helix-strand"></div>
            <div className ="helix-strand"></div>
        </div>
    </div>

  )

}



export default DNAViz