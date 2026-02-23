# Guerilla simulator

## Dev

```
npm start
```

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

- svg renderer
- react + typescript
- useReducer + local state

## TODO

- napraviti react projekat ✓
- naći lokacije gradova + broj stanovnika ✓
- renderovati gradove na pozadini ✓
	- naći render funkciju iz partisan games ✓
	- fiksirati aspect ratio 1:1 i smisliti zoom (scroll) ✓
- implementirati voronoi oblasti
	- dodati voronoi ✓
	- napraviti komponentu za oblast ✓
	- dodati granice države (ili neki limit ✓)
	- veličinu mape setovati na jednom mestu, ne u css-u ✓
- podaci
	- dodati manja partizanska mesta sa znaka ✓
	- pronaći duplikate ✓
- nazivi
	- prikazivati samo nazive većih gradova ✓
	- prikazivati tačku grada ✓
	- tačka srazmerno veličini ✓
	- ne preklapati tačku i naziv ✓
	- prikazivati naziv na hover ✓
- pozicija da bude objekat ✓
- stanja 
	- dodati stanja
	- dodati promenu stanja na klik

### BUGS

- zbog MAX_RADIUS ne graniče se susedni periferni gradovi
- granice regije seku naziv
