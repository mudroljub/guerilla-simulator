import { useState } from 'react'
import classNames from 'classnames'
import styles from './Dice.module.scss'
import { roll } from '../../utils/math'

const faces: Record<number, number[]> = {
  1: [5],
  2: [1, 9],
  3: [1, 5, 9],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9],
}

type Props = {
  className?: string
  callback?: (num: number) => void
  value: number | null // Dodajemo ovo
}

export default function DiceButton({ className, callback, value }: Props) {
  const [rolling, setRolling] = useState(false)

  const rollDice = () => {
    if (rolling || value !== null) return // Ne dajemo novi roll dok je stari aktivan

    setRolling(true)

    setTimeout(() => {
      const number = roll()
      // Više ne radimo setValue(number) jer to radi roditelj preko callback-a
      callback?.(number)
      setRolling(false)
    }, 700)
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={classNames(styles.button, className)}
        onClick={rollDice}
        disabled={rolling || value !== null} // Onemogući klik dok traje animacija ili prikaz rezultata
      >
        {rolling || value === null ? (
          <span className={classNames(styles.icon, { [styles.rolling]: rolling })}>
            🎲
          </span>
        ) : (
          <div className={styles.dice}>
            {faces[value].map(p => (
              <span key={p} className={classNames(styles.dot, styles[`p${p}`])} />
            ))}
          </div>
        )}
      </button>
    </div>
  )
}