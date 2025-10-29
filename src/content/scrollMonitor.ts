


let lastScrollTime = 0
let lastScrollY = 0
let scrollSamples: number[] = []






const SAMPLE_INTERVAL = 500
const MAX_SAMPLES = 10





function getDomain(): string {
  try {
    return new URL(window.location.href).hostname
  } catch {
    return window.location.hostname
  }
}





function getScrollDepth(): number {
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  



  if (documentHeight <= windowHeight) return 100





  return Math.round((scrollTop / (documentHeight - windowHeight)) * 100)
}





function calculateScrollSpeed(deltaY: number, deltaTime: number): 'slow' | 'medium' | 'fast' | 'rapid' {
  if (deltaTime === 0) return 'medium'
  



  const pixelsPerSecond = Math.abs(deltaY) / (deltaTime / 1000)



  



  if (pixelsPerSecond > 2000) return 'rapid'
  if (pixelsPerSecond > 800) return 'fast'
  if (pixelsPerSecond > 200) return 'medium'
  return 'slow'
}





let scrollTimeout: number | null = null



window.addEventListener('scroll', () => {
  const now = Date.now()
  const currentY = window.scrollY
  



  



  if (now - lastScrollTime > SAMPLE_INTERVAL) {
    const deltaY = currentY - lastScrollY
    const deltaTime = now - lastScrollTime
    



    const speed = calculateScrollSpeed(deltaY, deltaTime)
    scrollSamples.push(now)





    if (scrollSamples.length > MAX_SAMPLES) {
      scrollSamples = scrollSamples.slice(-MAX_SAMPLES)
    }



    



    lastScrollY = currentY
    lastScrollTime = now
  }





  



  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = window.setTimeout(() => {
    const depth = getScrollDepth()
    const deltaY = currentY - lastScrollY
    const deltaTime = now - lastScrollTime
    const speed = calculateScrollSpeed(deltaY, deltaTime)



    



    chrome.runtime.sendMessage({
      type: 'scroll',
      url: window.location.href,
      domain: getDomain(),
      scrollDepth: depth,
      speed
    }).catch(() => {
      
    })
  }, 300)
}, { passive: true })





console.log(' Tab DNA scroll tracker active')