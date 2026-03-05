import { IconComponent } from "../../types/types"

export const nameToIcon = (icons: IconComponent[], name: string): IconComponent => {
  const hash = Array.from(name).reduce(
    (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc),
    0
  )

  return icons[Math.abs(hash) % icons.length]
}
