const fs = require('fs')

const gradovi = JSON.parse(fs.readFileSync('./gradovi.json', 'utf8'))

/** METHODS */

function findMinMax(gradovi, margin = 0.1) {
  let latMin = Infinity
  let latMax = -Infinity
  let lngMin = Infinity
  let lngMax = -Infinity
  let najmanji = Infinity
  let najveci = -Infinity

  for (const naziv in gradovi) {
    const grad = gradovi[naziv]
    const { lat, lon } = grad.koordinate

    if (lat < latMin) latMin = lat
    if (lat > latMax) latMax = lat
    if (lon < lngMin) lngMin = lon
    if (lon > lngMax) lngMax = lon
    if (najveci < grad.stanovnika) najveci = grad.stanovnika
    if (najmanji > grad.stanovnika) najmanji = grad.stanovnika
  }

  const latPadding = (latMax - latMin) * margin
  const lngPadding = (lngMax - lngMin) * margin

  return {
    latRange: { min: latMin - latPadding, max: latMax + latPadding },
    lngRange: { min: lngMin - lngPadding, max: lngMax + lngPadding },
    najmanji,
    najveci,
  }
}

function coordToPercent(koordinate, latRange, lngRange) {
  const y = 1 - (koordinate.lat - latRange.min) / (latRange.max - latRange.min)
  const x = (koordinate.lon - lngRange.min) / (lngRange.max - lngRange.min)

  return { y, x }
}

function sizeToPercent(size, minSize, maxSize) {
  return (size - minSize) / (maxSize - minSize) || 0.0001 // no zero size
}

/** INIT */

const { najmanji, najveci, latRange, lngRange } = findMinMax(gradovi, 0.1) // 10% margine

const obradjeno = Object.fromEntries(
  Object.entries(gradovi).map(([naziv, grad]) => [
    naziv,
   {
    pozicija: coordToPercent(grad.koordinate, latRange, lngRange),
    velicina: sizeToPercent(grad.stanovnika, najmanji, najveci)
   }
  ])
)

fs.writeFileSync('gradovi_normalizovano.json', JSON.stringify(obradjeno, null, 2), 'utf8')
