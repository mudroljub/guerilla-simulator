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
		- pozicionirati prozor blizu pozicije regije (ne treba)
- sortirati regione po veličini pre renderovanja, da manji ne idu preko većih ✓
- postaviti nemce
	- garnizon sukladno veličini mesta ✓
	- dodati razne jedinice (pešaci, tenkovi, topovi, avioni) ✓
- postaviti ikonice
	- izabrati ikonice za assets ✓
	- sve prebaciti u svg ✓
	- staviti ikonice na veća mesta ✓ 
	- napraviti komponentu Icon ✓
		- komponenta prima region data i uzima region state ✓
		- na osnovu veličine garnizona i frakcije prikazuje odgovarajuću ikonicu ✓
		- prikazivati random unit type od postojećih za svako mesto ✓
		- da bude niz ikona za svaku kategoriju ✓
		- da ne ide random, nego redom po nizu ✓
		- probrati slike ✓
		- srediti veličine slika ✓
		- manje nemaca ✓
		- više partizana (problem bio limit za mala mesta) ✓
		- prikazivati slike samo na većim oblastima ✓
			- izračunati površine poligona ✓
		- da nemci budu okrenuti ka istoku a partizani ka zapadu ✓
		- previše nemačkih aviona i tenkova, treba više vojnika, podesiti šanse ✓
		- dodati hover na ustaničke teritorije ✓
- dodati legendu ✓
- postaviti partizane ✓
	- inicijalno ustanici drže neka manja mesta ✓
	- odrediti jačinu garnizona (samo pešadija dovoljna da osvoje neko susedno mesto) ✓
- srediti eslint (ne može)
- mehanika bitke
	- mogućnost napada
		- dodati regionu susedne oblasti ✓
		- dodati indikator napada za susedne oblasti (roze boja?) ✓
		- dobaviti susede od selected i menjati im boju na hover ✓
			- samo ako je izabran oslobođen a susedi nisu ✓
			- problem: boja se gubi kada kliknemo na suseda za napad ✓
			- dodati attackable - ako je status okupiran i graniči se sa oslobođenim ✓
	- faza napada
		- prikazivati napad dugme samo kad je attackable ✓
		- implementirati napad
			- dodati novo polje na region assaultTroops ✓
			- dodati izvedeno stanje attacked ✓
			- dodati vizuelni indikator (💥) ✓
			- status suvišan kad postoji frakcija, ukinuti ✓
			- otvoriti opcije napada nakon klika na dugme ✓
				- BUG: opcije ostaju otvorene za sve oblasti, modal pamti stanje ✓
				- izabrati odakle se napada (ako ima više oslobođenih suseda) ✓
				- izabrati koliko vojske se prebacuje (input range ili slično) ✓
		- stilizovati modal po uzoru na legendu ✓
		- implementirati akciju ATTACK
	- faza borbe
		- osmisliti, slično kao axis and allies
- u svakom krugu ustanici jačaju, okupacione snage ostaju iste
- iz većih mesta neprestano poleću avioni i artiljerija tuče partizane
- nakon određenog broja krugova (možda nakon što padne par većih mesta) počinje ofanziva
	- okupatori dovlače desetostruko jače snage okolo najvećih oslobođenih mesta
	- kad napadnu, igrač može birati borbu ili povlačenje (skoro nemoguće je odbraniti)
	- nakon što osvoje najveća oslobođena mesta (i progone partizane x koraka) ofanziva se završava
	- pojačanja odlaze, garnizoni se vraćaju na staro (možda naka pojačanja ostaju)
	- bonus: ofanzive imaju ime: I, II, III
- save game
	- čuvati stanje da se ne resetuje ni inicijalizuje na reload
	- resetuje se na new game
- napredno
	- dodati razne okupatore nejednakih karakteristika
- kraj
	- pobeda: oslobođenje zemlje
	- poraz: uništenje ustanka

### BUGS

- na kraju drag ne treba da otvara prozor
- select koprivnica pokazuje susedne teritorije koje se ne graniče (graniče se izvan mask)

### Završno

- Sacuvati finalne poligone kao data
- napraviti prave svg slike umesto ovih