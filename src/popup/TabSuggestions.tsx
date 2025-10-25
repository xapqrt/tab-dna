// this is one of the main features so i'll surely give in some time here, this file here is basically for the tabsuggestion one, that auto suggest some tabs, one of the features which i snot a gimmick




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


        const generated = generateSuggestion()
        setSuggestions(generated)

    }, [modeGuess, habits, tab_dna])






    function generateSuggestions(): Suggestion[] {


        const suggs: Suggestion[] = []


        //suggesting on time


        if(habits && habits.length > 0) {
            const topHAbits = habits.slice(0, 3)
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

            case ''
        }
    }
}