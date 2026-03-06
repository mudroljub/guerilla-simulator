import { useState } from "react"
import classNames from "classnames"
import styles from "./Dice.module.scss"

type Props = {
  className?: string;
};

const faces: Record<number, number[]> = {
  1: [5],
  2: [1, 9],
  3: [1, 5, 9],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9],
}

export default function DiceButton({ className }: Props) {
  const [rolling, setRolling] = useState(false)
  const [value, setValue] = useState<number | null>(null)

  const rollDice = () => {
    if (rolling) return

    setRolling(true)

    setTimeout(() => {
      setValue(Math.floor(Math.random() * 6) + 1)
      setRolling(false)
    }, 700)
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={classNames(styles.button, className)}
        onClick={rollDice}
      >
        {rolling || value === null ? (
          <span className={classNames(styles.icon, { [styles.rolling]: rolling })}>
            🎲
          </span>
        ) : (
          <div className={styles.dice}>
            {faces[value].map((p) => (
              <span key={p} className={classNames(styles.dot, styles[`p${p}`])} />
            ))}
          </div>
        )}
      </button>
    </div>
  )
}