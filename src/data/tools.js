const fs = require('fs')

const gradovi = JSON.parse(fs.readFileSync('./gradovi.json', 'utf8'))

function findDuplicateCoordinates(cities, epsilon = 0.01) {
  const cityEntries = Object.entries(cities)
  const duplicates = []
  const seenPairs = new Set()

  for (let i = 0; i < cityEntries.length; i++) {
    const [nameA, dataA] = cityEntries[i]
    const { lat: latA, lon: lonA } = dataA.koordinate

    for (let j = i + 1; j < cityEntries.length; j++) {
      const [nameB, dataB] = cityEntries[j]
      const { lat: latB, lon: lonB } = dataB.koordinate

      if (Math.abs(latA - latB) <= epsilon && Math.abs(lonA - lonB) <= epsilon) {
        const pairKey = [nameA, nameB].sort().join('|')
        if (!seenPairs.has(pairKey)) {
          duplicates.push({
            gradovi: [nameA, nameB],
            koordinate: [{ lat: latA, lon: lonA }, { lat: latB, lon: lonB }]
          })
          seenPairs.add(pairKey)
        }
      }
    }
  }

  return duplicates
}

const duplikati = findDuplicateCoordinates(gradovi)
console.log(duplikati)

// fs.writeFileSync('gradovi2.json', JSON.stringify(gradovi, null, 2), 'utf8')
