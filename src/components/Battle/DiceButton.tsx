import { useState } from "react"
import styles from "./DiceButton.module.scss"
import classnames from "classnames"

interface Props {
    className?: string;
}

export default function DiceButton({ className }: Props) {
  const [rolling, setRolling] = useState(false)
  const [value, setValue] = useState<number>(1)

  const rollDice = () => {
    if (rolling) return

    setRolling(true)

    setTimeout(() => {
      setValue(Math.floor(Math.random() * 6) + 1)
      setRolling(false)
    }, 700)
  }

  return (
    <button className={classnames(styles.button, className)} onClick={rollDice}>
      <span className={`${styles.dice} ${rolling ? styles.rolling : ""}`}>
        🎲
      </span>
      <span className={styles.value}>{value}</span>
    </button>
  )
}