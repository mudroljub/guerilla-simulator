const fs = require('fs')

const gradovi = JSON.parse(fs.readFileSync('./gradovi.json', 'utf8'))
const stanovnici = JSON.parse(fs.readFileSync('./novo-stanovnici.json', 'utf8'))

// console.log(stanovnici)

for (const naziv in stanovnici) {
  const value = stanovnici[naziv];
  // console.log(naziv, value)

  if (gradovi[naziv]) {
    gradovi[naziv] = {
      ...gradovi[naziv],
      stanovnika: value
    }
  }
}

fs.writeFileSync('gradovi2.json', JSON.stringify(gradovi, null, 2), 'utf8')
