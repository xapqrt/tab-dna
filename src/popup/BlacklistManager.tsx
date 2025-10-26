// felt that the website was lwkey tracking everything and making it a privacy concern so amma dd some privacy features too like this is the blacklist feature, such that you can exclude sm shi






/// <reference types="chrome"/>


import React, { useEffect, useState } from 'react'




interface BlacklistManagerProps {

    onUpdate?: () => void


}



function BlacklistManager({ onUpdate}: BlacklistManagerProps){

    const [blacklist, setBlacklist] = useState<string[]>([])
    const [newDomain, setNewDomain] = useState('')
    const [showInput, setShowInput] = useState('false')





    useEffect(() => {


        //load blacklist from chrome local storage

        //proud of this one, it looks advcanced



        chrome.storage.local.get(['domain_blacklist'], (data) => {
            if(data.domain_blacklist){
                setBlacklist(data.domain_blacklist)
            }
        })
    }, [])




    function addDomain(): void {

        if(!newDomain.trim()) return





       
    // clean up domain input



    let domain = newDomain.trim().toLowerCase()
    domain = domain.replace(/^https?:\/\//, '') // remove protocol
    domain = domain.replace(/^www\./, '') // remove www
    domain = domain.split('/')[0] // remove path






    if(blacklist.includes(domain)){


        alert("domain already in the blackclist vro")
        return
    }


    const updated = [...blacklist, domain]
    setBlacklist(updated)



    //save to storage


    chrome.storage.local.set({ domain_blacklist: updated}, () => {
        console.log('blacklist updated: ', updated)
        if (onUpdate) onUpdate()
    })







    setNewDomain('')
    setShowInput(false)
    }



    function removeDomain(domain: string): void {


        const updated = blacklist.filter(d => d !== domain)
        setBlacklist(updated)



        chrome.storage.local.set({ domain_blacklist: updated }, () => {

            console.log('removed from blacklist: ', domain)
            if(onUpdate) onUpdate()
        })
    }



    function handleKeyPress(e: React.KeyboardEvent): void {

        if(e.key === 'Enter'){
            addDomain()
        } else if (e.key ==="Escape") {
            setShowInput(false)
            setNewDomain('')
        }
    }





    return (

        <div className='blacklist-manager'>
            <div className='blacklist-header'>
                <span className='label'>privacy blacklist</span>
                <button className='add-btn' onClick={() => setShowInput(!showInput)}>{showInput ? '✕' : '+'}</button>

            </div>





            {showInput && (
                <div className='add-domain-input'>
                    <input
                    type='text'
                    placeholder='domain.com'
                    value = {newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    onKeyDown={handleKeyPress}
                    autoFocus
                    />
                    <button onClick={addDomain}>add</button>
                    </div>
            )}





            {blacklist.length === 0 ? (
        <div className="empty-state">
          <p className="hint">// no domains blacklisted</p>
          <p className="hint">// add domains u want excluded from tracking</p>
        </div>
      ) : (
        <div className="blacklist-items">
          {blacklist.map((domain) => (
            <div key={domain} className="blacklist-item">
              <span className="domain-text">{domain}</span>
              <button 
                className="remove-btn"
                onClick={() => removeDomain(domain)}
                title="remove from blacklist"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}




      <div className="blacklist-footer">
        <small>these domains won't be tracked or stored</small>
      </div>
    </div>
  )
}




export default BlacklistManager