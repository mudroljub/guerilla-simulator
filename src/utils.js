// dodaje procente u data
function findMinMaxCoordinates(mesta, margin = 0.1) {
  let latMin = Infinity
  let latMax = -Infinity
  let lngMin = Infinity
  let lngMax = -Infinity

  for (const kljuc in mesta) {
    const mesto = scenes[kljuc]
    if (!mesto.koordinate) continue

    const { lat, lng } = mesto.koordinate

    if (lat < latMin) latMin = lat
    if (lat > latMax) latMax = lat
    if (lng < lngMin) lngMin = lng
    if (lng > lngMax) lngMax = lng
  }

  // Dodavanje margine (proširenje opsega)
  const latPadding = (latMax - latMin) * margin
  const lngPadding = (lngMax - lngMin) * margin

  return {
    latRange: { min: latMin - latPadding, max: latMax + latPadding },
    lngRange: { min: lngMin - lngPadding, max: lngMax + lngPadding }
  }
}

function calculatePercentage(koordinate, latRange, lngRange) {
  const y = 1 - (koordinate.lat - latRange.min) / (latRange.max - latRange.min)
  const x = (koordinate.lng - lngRange.min) / (lngRange.max - lngRange.min)

  return { y, x }
}

const { latRange, lngRange } = findMinMaxCoordinates(scenes, 0.1) // 10% margine

for (const kljuc in scenes) {
  const scena = scenes[kljuc]
  if (!scena.koordinate) continue
  scena.procenti = calculatePercentage(scena.koordinate, latRange, lngRange)
}

// očekuje procente u data
const renderIcon = (key, data) => {
  const style = `"transform: translate(-50%, -50%); top: ${data.procenti.y * 100}%; left: ${data.procenti.x * 100}%;"`
  return /* html */`
    <div value='${key}' class='menu-btn js-start' style=${style}>
      <br>${data.name}
    </div>
  `
}
