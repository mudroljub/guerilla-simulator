export function toOrdinalWord(n: number): string {
  const words = [
    'First', 'Second', 'Third', 'Fourth', 'Fifth',
    'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'
  ]

  if (n > 0 && n <= words.length)
    return words[n - 1]

  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  const suffix = s[(v - 20) % 10] || s[v] || s[0]

  return `${n}${suffix}`
}
