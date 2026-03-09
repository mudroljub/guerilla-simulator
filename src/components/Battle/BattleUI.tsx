import styles from './Battle.module.scss'

interface Props {
  regionName: string
  germans: number
  partisans: number
}

export default function BattleUI({ regionName, germans, partisans }: Props) {

  return (
    <>
      <h1>Battle for {regionName}</h1>

      <div className={styles.scoreBoard}>
        <div>Germans: {germans} Partisans: {partisans}</div>
      </div>
    </>
  )
}