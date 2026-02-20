# Guerilla simulator

## Game Document

- u pozadini mapa yu
- prikazati najveće gradove na njihovom koordinatama
- lokacije gradova su centri voronoi podele mape
- u svakom mestu garnizon sukladno veličini mesta
- inicijalno ustanici drže par manjih mesta, sa silom dovoljnom da osvoje neko susedno
- mehanika bitke
	- faza napada (susedne oblasti se mogu napasti)
	- faza borbe (slično kao axis and allies)
- u svakom krugu ustanici jačaju, okupacione snage ostaju iste
- iz većih mesta neprestano poleću avioni i artiljerija tuče partizane
- nakon određenog broja krugova (možda nakon što padne par većih mesta) počinje ofanziva
	- okupatori dovlače desetostruko jače snage okolo najvećih oslobođenih mesta
	- kad napadnu, igrač može birati borbu ili povlačenje (skoro nemoguće je odbraniti)
	- nakon što osvoje najveća oslobođena mesta (i progone partizane x koraka) ofanziva se završava
	- pojačanja odlaze, garnizoni se vraćaju na staro (možda naka pojačanja ostaju)
	- bonus: ofanzive imaju ime: I, II, III
- finese: dodati razne okupatore nejednakih karakteristika
- kraj
	- pobeda: oslobođenje zemlje
	- poraz: uništenje ustanka

## Technology

- svg ili canvas renderer? svg
- react ili vanila? react
- game loop ili samo events? react
- state - redux ili globalni state + game loop? react + useReducer
