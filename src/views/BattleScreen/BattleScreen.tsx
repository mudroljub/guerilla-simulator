import Battle from '../../components/Battle/Battle'
import { useStore } from '../../store/store'

export default function BattleScreen() {
  const { state: { battleQueue } } = useStore()

  return (
    <Battle key={battleQueue[0]} />
  )
}