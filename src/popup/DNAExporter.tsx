//dna export one, this is what i told you i'd do josias! it looks like spotify code and stuff haha



/// <reference types="chrome"/>


import React, {useState} from 'react'


interface ExportData {

    tab_dna?: any
    habit_map?: any[]
    visit_patterns?: any[]
    modeGuess?: string
    totalSwitches?: number
    domain_blacklist?: string[]
    exportDate: string
    version: string

}




function DNAExporter(){


    const [exporting, setExporting] = useState(false)
    const [last_export, setLastExport] = useState<string | null>(null)


    async function exportDNA(): Promise<void>{
        setExporting(true)



        try{

            // fetching all  data from the sotrage


            const data = await new Promise<any>((resolve) => {
                chrome.storage.local.get(null, (result) => {
                    resolve(result)
                })
            })



            //preparing export data


            const exportData: ExportData = {

                tab_dna: data.tab_dna,
                habit_map: data.habit_map,
                visit_patterns: data.visit_patterns,
                modeGuess: data.modeGuess,
                totalSwitches: data.totalSwitches,
                domain_blacklist: data.domain_blacklist,
                exportDate: new Date().toISOString(),
                version: '1.0'

            }




            //creation of json blob below


            const json = JSON.stringify(exportData, null, 2)
            const blob = new Blob([json], { type: 'application/json'})




            //creating download linkk

            //did not know it was this ez, had to peek into documentation for this




            const url = URL.createObjectURL(blob)
            const timestamp = new Date().toISOString(). split('T')[0]
            const filename = `tab-dna-export-${timestamp}.json`





            //triggering the download through the link


            const a = document. createElement('a')
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)



            setLastExport(new Date().toLocaleString())
            console.log("huff dna exported " , filename)



        } catch (err) {
            console.error('error failed: ', err)
            alert('failed to export dna bro: (')
        } finally {
            setExporting(false)
        }
    }


    async function clearAllData(): Promise<void>{
        if(!confirm('r u sure? this will delete all your browsing dna!!')) {
            return
        }



        if(!confirm('bro i wasnt kidding tho')){
            return
        }



        try {
            await new Promise<void>((resolve) => {
                chrome.storage.local.clear(() => {
                    resolve()
                })
            })


            alert('alr twin everythings done for, starting fresh')
            console.log('dna data cleared')




            //reload popup to show empty state

            window.location.reload()



        } catch(err){
            console.error('clear failed:' , err)
            alert("failed to clear data")
        }


    }



    function getDataSize(): void {

        chrome.storage.local.getBytesInUse(null, (bytes) => {
            const kb = (bytes /1024).toFixed(2)
            alert(`current DNA size: ${kb} KB`)
        })
    } 


    return (
        <div className='dna-exporter'>
            <div className='exporter-header'>
                <span className='label'>data management</span>
            </div>



            <div className='exporter-actions'>
                <button
                        className='export-btn'
                        onClick={exportDNA}
                        disabled={exporting}
                >
          {exporting ? '⏳ exporting...' : '💾 export dna'}
        </button>
        <button 
          className="size-btn"
          onClick={getDataSize}
        >
          📊 check size
        </button>



        <button 
          className="clear-btn"
          onClick={clearAllData}
        >
          🗑️ clear all data
        </button>
      </div>



      {last_export && (
        <div className="last-export">
          <small>last export: {last_export}</small>
        </div>
      )}



      <div className="exporter-footer">
        <small>export = backup • clear = fresh start • size = how much data stored</small>
      </div>
    </div>
  )
}



export default DNAExporter
