// --- GERMAN INFANTRY ---
import { ReactComponent as GerInf1 } from '../../assets/images/german/infantry/komandir-02.svg';
import { ReactComponent as GerInf3 } from '../../assets/images/german/infantry/mitraljezac-10.svg';
import { ReactComponent as GerInf5 } from '../../assets/images/german/infantry/narednik-02.svg';
import { ReactComponent as GerInf7 } from '../../assets/images/german/infantry/ss-07.svg';
import { ReactComponent as GerInf8 } from '../../assets/images/german/infantry/ss-08.svg';

// --- GERMAN TANKS ---
import { ReactComponent as GerTank3 } from '../../assets/images/german/tanks/panzer1a-02.svg';
import { ReactComponent as GerTank4 } from '../../assets/images/german/tanks/sd-kfz121.svg';
import { ReactComponent as GerTank5 } from '../../assets/images/german/tanks/sd-kfz161-02.svg';
import { ReactComponent as GerTank6 } from '../../assets/images/german/tanks/sd-kfz161.svg';
import { ReactComponent as GerTank7 } from '../../assets/images/german/tanks/somua-s35.svg';
import { ReactComponent as GerTank8 } from '../../assets/images/german/tanks/stug3-a.svg';

// --- GERMAN ARTILLERY ---
import { ReactComponent as GerArt1 } from '../../assets/images/german/artillery/artiljerija-01.svg';
import { ReactComponent as GerArt2 } from '../../assets/images/german/artillery/fh18-150mm.svg';
import { ReactComponent as GerArt3 } from '../../assets/images/german/artillery/gebg36.svg';

// --- GERMAN AIRCRAFT ---
import { ReactComponent as GerAir2 } from '../../assets/images/german/aircraft/fieseler-fi-156.svg';
import { ReactComponent as GerAir3 } from '../../assets/images/german/aircraft/junkers-ju87b-stuka.svg';
import { ReactComponent as GerAir8 } from '../../assets/images/german/aircraft/Messerschmitt-Bf-109.svg';

// --- PARTISAN INFANTRY ---
import { ReactComponent as PartInf1 } from '../../assets/images/partisan/infantry/bombas-02.svg';
import { ReactComponent as PartInf3 } from '../../assets/images/partisan/infantry/komunist-02.svg';
import { ReactComponent as PartInf4 } from '../../assets/images/partisan/infantry/mitraljezac-02.svg';
import { ReactComponent as PartInf5 } from '../../assets/images/partisan/infantry/partizan-bombas-sledja.svg';
import { ReactComponent as PartInf6 } from '../../assets/images/partisan/infantry/partizanka-01.svg';
import { ReactComponent as PartInf7 } from '../../assets/images/partisan/infantry/partizanka-02.svg';
import { ReactComponent as PartInf8 } from '../../assets/images/partisan/infantry/partizanka-03.svg';
import { ReactComponent as PartInf9 } from '../../assets/images/partisan/infantry/pokret-02.svg';
import { ReactComponent as PartInf10 } from '../../assets/images/partisan/infantry/pokret-04.svg';
import { ReactComponent as PartInf12 } from '../../assets/images/partisan/infantry/pokret-06.svg';
import { ReactComponent as PartInf13 } from '../../assets/images/partisan/infantry/ranjenica-01.svg';
import { ReactComponent as PartInf16 } from '../../assets/images/partisan/infantry/stoji-01.svg';
import { ReactComponent as PartInf17 } from '../../assets/images/partisan/infantry/stoji-02.svg';
import { ReactComponent as PartInf19 } from '../../assets/images/partisan/infantry/vojnik-01.svg';
import { ReactComponent as PartInf20 } from '../../assets/images/partisan/infantry/vojnik-03.svg';

import { Fraction, UnitType } from '../../types/types';

type IconComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

export const iconDict: Record<Fraction, Partial<Record<UnitType, IconComponent[]>>> = {
  German: {
    infantry: [GerInf1, GerInf3, GerInf5, GerInf7, GerInf8],
    tanks: [GerTank3, GerTank4, GerTank5, GerTank6, GerTank7, GerTank8],
    artillery: [GerArt1, GerArt2, GerArt3],
    aircraft: [GerAir2, GerAir3, GerAir8],
  },
  Partisan: {
    infantry: [
      PartInf1, PartInf3, PartInf4, PartInf5, PartInf6, PartInf7, PartInf8, PartInf9, PartInf10,
      PartInf12, PartInf13, PartInf16, PartInf17, PartInf19, PartInf20
    ],
  },
}

export const nameToIcon = (icons: IconComponent[], name: string): IconComponent => {
  const hash = Array.from(name).reduce(
    (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc),
    0
  )

  return icons[Math.abs(hash) % icons.length]
}
