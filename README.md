# tab dna 🧬

a chrome extension that tracks ur browsing habits and builds ur unique "browsing dna"  kinda like spotify wrapped but for tabs 

## what it does

tracks every tab u open and figures out ur browsing personality. no judging just analyzing ur digital vibes

### features

- **dna visualization** - color coded strands showing ur most visited domains, changes based on how much u use em
- **mode detection** - automatically detects if ur in FOCUS, PANIC, or CHILL mode based on tab switching patterns
- **stats panel** - shows total switches, avg dwell time, unique domains, top sites
- **tab suggestions** - suggests tabs based on ur current mode and habits
- **habit tracker** - learns what u visit at different times of day (morning/afternoon/evening/night)
- **tab predictions** - literally predicts ur next tab based on time patterns, its kinda creepy how accurate it gets
- **dna timeline** - 24hr visualizer showing when ur most productive vs when ur doom scrolling
- **blacklist manager** - exclude domains from tracking (ur secrets r safe)
- **dna export** - download all ur data as json, spotify wrapped style
- **tab spirit** - shows ur current browsing mood (proud/anxious/chill)
- **site streaks** - tracks consecutive day visits with streak counters
- **vector exporter** - export ur browsing dna as a tiny base64 string to migrate browsers or share with friends, no cloud needed

## why i built this

for the carnival ysws



## installation

1. clone this repo
```bash
git clone https://github.com/xapqrt/tab-dna.git
cd tab-dna
```

2. install dependencies
```bash
npm install
```

3. build the extension
```bash
npm run build
```

4. load in chrome
- open `chrome://extensions/`
- enable "Developer mode"
- click "Load unpacked"
- select the `dist` folder



or js use the one i put out on git releases, or i hope cuz idk how to put it
## how it works

the extension runs in the background tracking:
 tab switches
 time spent on each domain
 scroll activity
 patterns by time of day
-visit frequency

all data stays local in chrome.storage, no servers no tracking no bs

## vector exporter

this is the cool part and i hope its good enough for bonus but u can export ur entire browsing dna as a 3 kb base64 string. copy paste it to
migrate to new browser
 share with friends
 backup ur data
 compare browsing personalities

includes: switches, dwell time, top 5 domains, mode, habit timeslots, signature verification

## privacy

everything is local. blacklisted domains never get tracked or stored. no urls no personal data just domain names and timestamps


## license

MIT or something, u can use it or apache idk