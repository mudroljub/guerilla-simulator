import data from '../../data/gradovi_normalizovano.json'
console.log(data);

// očekuje procente u data
// const renderIcon = (key, data) => {
//   const style = `"transform: translate(-50%, -50%); top: ${data.procenti.y * 100}%; left: ${data.procenti.x * 100}%;"`
//   return /* html */`
//     <div value='${key}' class='menu-btn js-start' style=${style}>
//       <br>${data.name}
//     </div>
//   `
// }

export default function Main() {
  return (
    <h1>Zdravo Svete</h1>
  )
}