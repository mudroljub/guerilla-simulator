export const sample = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

export const randomInRange = (from: number, to: number) => Math.random() * (to - from) + from

export const range = <T>(length: number, fn: (index: number) => T): T[] =>
  Array(length).fill(0).map((_, i) => fn(i))