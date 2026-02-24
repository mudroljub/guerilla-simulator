# Guerilla Simulator: Uprising in Yugoslavia

## Dev

```
npm start
```

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
	- dodati osnovna stanja ✓
	- obojiti stanja ✓
	- dodati promenu stanja na klik ✓
	- useReducer za čuvanje stanja ✓
	- tačkasti region ✓
- svg
	- odseći granice mape ✓
	- dodati more ✓
	- srediti isečenu južnu granicu (naći ispravan svg) !!
	- dodati crnu granicu ✓ 
- prozor
	- proširiti region stanje da bude objekat ✓
	- dodati selected u initialState ✓
	- toggle selected na klik ✓
	- dodavati crnu granicu na selected ✓
	- setovati inicijalno stanje u store (oslobođene teritorije) ✓
	- otvarati prozor za selected ✓
		- slati region data na select ✓
		- proslediti još podataka prozoru ✓
			- regije da imaju populaciju ✓
		- pozicionirati prozor blizu pozicije regije (previše komplikovano a nije bitno)
- postaviti trupe
	- u svakom mestu garnizon sukladno veličini mesta
		- odlučiti vrste jedinica i ikonice
		- postaviti ikonice na veća mesta, otvarati prozor sa svim informacijama na hover
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

### BUGS

- granice regije seku naziv
