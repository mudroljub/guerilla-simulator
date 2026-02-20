const fs = require('fs')

const input = JSON.parse(fs.readFileSync('./data/lokacije.json', 'utf8'))

const output = Object.fromEntries(
  Object.entries(input).map(([grad, podaci]) => [
    grad,
    { koordinate: { lat: podaci.lat, lon: podaci.lon } }
  ])
)

fs.writeFileSync('gradovi_novi.json', JSON.stringify(output, null, 2), 'utf8')

console.log('Gotovo ✔ -> gradovi_novi.json')