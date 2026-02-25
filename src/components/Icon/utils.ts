
// --- GERMAN INFANTRY ---
import { ReactComponent as GerInf1 } from '../../assets/images/german/infantry/komandir-02.svg';
import { ReactComponent as GerInf2 } from '../../assets/images/german/infantry/mitraljezac-09.svg';
import { ReactComponent as GerInf3 } from '../../assets/images/german/infantry/mitraljezac-10.svg';
import { ReactComponent as GerInf4 } from '../../assets/images/german/infantry/narednik-01.svg';
import { ReactComponent as GerInf5 } from '../../assets/images/german/infantry/narednik-02.svg';
import { ReactComponent as GerInf6 } from '../../assets/images/german/infantry/specijalac-02.svg';
import { ReactComponent as GerInf7 } from '../../assets/images/german/infantry/ss-07.svg';
import { ReactComponent as GerInf8 } from '../../assets/images/german/infantry/ss-08.svg';
import { ReactComponent as GerInf9 } from '../../assets/images/german/infantry/ss-10.svg';
import { ReactComponent as GerInf10 } from '../../assets/images/german/infantry/strazar-01-sledja.svg';
import { ReactComponent as GerInf11 } from '../../assets/images/german/infantry/vojnik-16.svg';

// --- GERMAN TANKS ---
import { ReactComponent as GerTank1 } from '../../assets/images/german/tanks/jagdpanzer38.svg';
import { ReactComponent as GerTank2 } from '../../assets/images/german/tanks/lefh18-01.svg';
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
import { ReactComponent as GerAir1 } from '../../assets/images/german/aircraft/dornier-do-355-01.svg';
import { ReactComponent as GerAir2 } from '../../assets/images/german/aircraft/fieseler-fi-156.svg';
import { ReactComponent as GerAir3 } from '../../assets/images/german/aircraft/junkers-ju87b-stuka.svg';
import { ReactComponent as GerAir4 } from '../../assets/images/german/aircraft/junkers-ju87d-5.svg';
import { ReactComponent as GerAir5 } from '../../assets/images/german/aircraft/junkers-ju87d-stuka-03.svg';
import { ReactComponent as GerAir6 } from '../../assets/images/german/aircraft/junkers-ju87d-stuka.svg';
import { ReactComponent as GerAir7 } from '../../assets/images/german/aircraft/Mesersmit-Bf-109e.svg';
import { ReactComponent as GerAir8 } from '../../assets/images/german/aircraft/Messerschmitt-Bf-109.svg';

// --- PARTISAN & ITALIAN ---
import { ReactComponent as PartInf1 } from '../../assets/images/partisan/infantry/bombas-02.svg';
import { ReactComponent as PartInf2 } from '../../assets/images/partisan/infantry/bombas-04.svg';
import { ReactComponent as PartInf3 } from '../../assets/images/partisan/infantry/komunist-02.svg';
import { ReactComponent as PartInf4 } from '../../assets/images/partisan/infantry/mitraljezac-02.svg';
import { ReactComponent as PartInf5 } from '../../assets/images/partisan/infantry/partizan-bombas-sledja.svg';
import { ReactComponent as PartInf6 } from '../../assets/images/partisan/infantry/partizanka-01.svg';
import { ReactComponent as PartInf7 } from '../../assets/images/partisan/infantry/partizanka-02.svg';
import { ReactComponent as PartInf8 } from '../../assets/images/partisan/infantry/partizanka-03.svg';
import { ReactComponent as PartInf9 } from '../../assets/images/partisan/infantry/pokret-02.svg';
import { ReactComponent as PartInf10 } from '../../assets/images/partisan/infantry/pokret-04.svg';
import { ReactComponent as PartInf11 } from '../../assets/images/partisan/infantry/pokret-05.svg';
import { ReactComponent as PartInf12 } from '../../assets/images/partisan/infantry/pokret-06.svg';
import { ReactComponent as PartInf13 } from '../../assets/images/partisan/infantry/ranjenica-01.svg';
import { ReactComponent as PartInf14 } from '../../assets/images/partisan/infantry/spanac-02.svg';
import { ReactComponent as PartInf15 } from '../../assets/images/partisan/infantry/sten-06-sledja.svg';
import { ReactComponent as PartInf16 } from '../../assets/images/partisan/infantry/stoji-01.svg';
import { ReactComponent as PartInf17 } from '../../assets/images/partisan/infantry/stoji-02.svg';
import { ReactComponent as PartInf18 } from '../../assets/images/partisan/infantry/stoji-03.svg';
import { ReactComponent as PartInf19 } from '../../assets/images/partisan/infantry/vojnik-01.svg';
import { ReactComponent as PartInf20 } from '../../assets/images/partisan/infantry/vojnik-03.svg';

import { Fraction, UnitType } from '../../types/types';

type IconComponent = React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

export const iconDict: Record<Fraction, Partial<Record<UnitType, IconComponent[]>>> = {
  German: {
    infantry: [GerInf1, GerInf2, GerInf3, GerInf4, GerInf5, GerInf6, GerInf7, GerInf8, GerInf9, GerInf10, GerInf11],
    tanks: [GerTank1, GerTank2, GerTank3, GerTank4, GerTank5, GerTank6, GerTank7, GerTank8],
    artillery: [GerArt1, GerArt2, GerArt3],
    aircraft: [GerAir1, GerAir2, GerAir3, GerAir4, GerAir5, GerAir6, GerAir7, GerAir8],
  },
  Italian: {
    infantry: [PartInf1],
  },
  Partisan: {
    infantry: [
      PartInf1, PartInf2, PartInf3, PartInf4, PartInf5, PartInf6, PartInf7, PartInf8, PartInf9, PartInf10,
      PartInf11, PartInf12, PartInf13, PartInf14, PartInf15, PartInf16, PartInf17, PartInf18, PartInf19, PartInf20
    ],
  },
};
