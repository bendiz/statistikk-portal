# 📈 Statistikk Portal
![image](https://github.com/bendiz/statistikk-portal/assets/101096042/ef6b1a48-4d8a-479c-85dc-f356f4fec5f7)

Denne portalen henter ut data fra en av SSB sine tabeller (Tabell 11342: Areal og befolkning i kommuner, fylker og hele landet (K) 2007-2024), gjør utregninger av median, gjenomsnitt, minimum og maksimum pr. region og presenterer dataene i en tabell og visualiseres med grafer.

Jeg har brukt Vite for å bygge frontenden, som kommer med et ferdig oppsett for React + Typescript. Dette har gjort prosjektet raskt og enkelt å sette opp.

I konfigurasjonsfilen til Vite har jeg satt opp en proxy som gjør at Vite automatisk videresender forespørselen til backenden min som kjører på en annen port. Dette gjør at jeg ikke må lage CORS-oppsett for å godkjenne forespørsler fra frontenden, da ser ser ut som alle forespørsler kommer fra samme opprinnelse.

Jeg har satt opp en Node server i Express rammeverket som skal hente dataen fra SSB. Her har jeg laget en GET-route for /api/region/:region slik at brukeren kan hente ut en liste over fylker/kommuner/hele landet basert på valg av inndeling i skjemaet. :region kan være "alle", "kommuner" eller "fylker". Brukeren får ikke gå videre med innsending av skjemaet hvis ikke denne GET-requesten er utført og minst 2 regioner er valgt.

Det er satt opp en route for app.all nederst i koden som lager en ny ExpressError med statuskode 404 dersom brukeren prøver å gå til en /api route som ikke finnes. Errormeldingen vil vises, og brukeren vil få en link til å prøve på nytt. Hvis brukeren prøver å gå til en annen route som ikke har starter med /api, så vil siden bare bli lastet på nytt, siden proxyen er satt opp med en /api route. 

### ❔ Hvordan virker den?

Når brukeren velger inndeling av region gjøres det en GET-request til serveren, som igjen henter tabellen fra SSB sin API konsoll og sender tilbake regionene til frontenden i JSON format.

Ekempel på request header ved valg av fylker <br>
![image](https://github.com/bendiz/statistikk-portal/assets/101096042/bb051689-a196-43e2-ada7-34ba8b9a95c5)
<br>
Eksempel på payload ved valg av fylker <br>
![image](https://github.com/bendiz/statistikk-portal/assets/101096042/96f36d1a-38d0-4836-bdfa-8608f31bbb75)


Før serveren henter mer data fra SSB, så må brukeren oppgi:

- 1 statistisk variabel
- Minimum 3 årstall
- Minimum 2 regioner


<br>

![image](https://github.com/bendiz/statistikk-portal/assets/101096042/835109a2-9a53-4fe0-aa11-e4d65142227f)

Brukeren blir stoppet av errorsjekk i frontend hvis h\*n forsøker å hente ut data uten å oppfylle overnevnte kriterier. Det vil komme opp en rød alertboks der brukeren ikke har fylt ut riktig, og som forhindrer informasjonen fra å bli sendt over til serveren.
For at alle alertboksene skal kunne dukke opp samtidig, så blir hver error lagt til i en array av strings. 

For hver seksjon av skjemaet så sjekkes det om errorarrayet inneholder noe og om det inneholder en error med samme tittel som seksjonen som skal renderes. Hvis dette er tilfellet, så vil headingen til seksjonen bli rød og det vises en alarmboks (som kan krysses ut) over seksjonen der det er funnet en error.

Dersom man skulle prøve seg på å sende en spørring uten å gå via skjemaet i UI'en, så vil serveren også gjøre en sjekk på disse kriteriene før dataen blir hentet eksternt.

Når dataen oppfyller kriteriene, blir dataene fra skjemaet sendt til serveren, omstrukturert slik at spørringen er i tråd med SSB sin brukerveiledning, og deretter sendt som en POST request til SSB. <br>

![image](https://github.com/bendiz/statistikk-portal/assets/101096042/8ce65d30-a69a-4a87-8025-90ef9a663648)

På serversiden er alle asynkrone funksjoner nested i en catchAsync funksjon for å fange opp eventuelle feilmeldinger og sende videre til errorhandling middleware funksjonen. Dette for å unngå alle try/catch blokkene. Dersom en error oppstår vil brukeren få en errorkode, feilmelding og link til å forsøke en ny spørring.

Siden dataen er av begrenset/fast størrelse, så sendes hele responsen over i JSON format tilbake til frontenden.
Eksempel

Header <br>
![image](https://github.com/bendiz/statistikk-portal/assets/101096042/b5a43241-6b1f-474b-a7ed-e1681aca2e2b)
<br>
Request <br>
![image](https://github.com/bendiz/statistikk-portal/assets/101096042/eedf499d-42b1-4260-bffc-071203ea0b71)
<br>
Response <br>
![image](https://github.com/bendiz/statistikk-portal/assets/101096042/b6d5351f-9a32-438c-9cfd-57892205b037)
<br>


#### 🛞 Navigasjon

Navigasjonen lar brukeren lage ny spørring, bytte mellom tabell-/grafvisning, og å scrolle til en spesifikk statistikkvariabelgraf. Dette er oppnådd ved å få tilgang til DOM elementene ved hjelp av useRef hooken til React. Siden React lager en Virtual DOM, som er en lettere kopi av den faktiske DOMen, så fungerer ikke "anchor-scrolling" som gjør at man scroller automatisk til et element med samme id. 

#### 🗒️ Skjema

Istedet for å holde styr på staten til muligens 971 forskjellige kommuner, så har jeg latt et tredjepartsbibliotek ta seg av dette. React-Select sørger for at valgene blir dynamisk generert med hver sin state. Brukeren kan utføre søk etter ønsket variabel/år/region og har god oversikt over hva som er valgt. Dropdown menyen som alltid er åpen gjør det enkelt for brukeren å se et utsnitt av valgmulighetene til enhver tid, og scrolle seg gjennom den for å gjøre flere valg. Det er egentlig mest relevant å bruke React-Select biblioteket til dataen vi får tilbake fra SSB om alle regionene som finnes i tabellen, men jeg har valgt å bruke det for alle seksjonene i skjemaet for å holde styling og oppførsel konsekvent. 

#### 📋 Tabell

Tabellkomponenten (Table) mapper verdiene til riktig region basert på indekser fra responsen og sorterer deretter dataen alfabetisk. Den sjekker også om dataene inneholder tomme rader. Hvis brukeren skrur på at h\*n vil skjule tomme rader, blir de ikke renderet i tabellen eller i grafvisningen. Hvis brukeren ikke skrur på denne funksjonaliteten, så blir alle radene lagret i tableData og vist i tabellen.

Kalkulering av median, gjennomsnitt, minimum og maksimum skjer på hver rad før de blir vist fram i tabellen og i grafene. Alle tall som blir vist blir gjort om til strings og formattert ved hjelp av regex for å formattere nummer til å sette inn mellomrom mellom tallene for å øke lesbarheten. For å gjøre kalkuleringene er det brukt en kombinasjon av innebygde arrayfunksjoner og Math-funksjoner. Median sorterer tallende i stigende rekkefølge før den returnerer midtverdien, calculateAvg bruker reduce-funksjonen for å summere alle verdiene i arrayet før den deler summen på antall verdier for å finne gjennomsnitt, calculateMin tar det minste tallet av alle verdiene (i mange tilfeller vil resultatet her bli 0, da flere av regionene mangler data for flere av årene), calculateMax finner det høyeste tallet i arrayet med verdier. 

#### 📉 Grafer

I grafkomponenten blir tomme rader som eventuelt er filtrert ut bragt med, for ikke å vises i grafene heller. Data for alle regioner blir sammenlignet i alle fire statistikkalkulasjoner, og vist fram i en graf. Hver region/datapunkt i alle grafer får en tilfeldig farge for å øke lesbarheten. Den tilfeldige fargen blir generert ved hjelp av funksjonen getRandomColor() som tar en # pluss alle mulige hexadecimale siffer og looper over de 6 ganger for å danne en tilfeldig hexadecimal fargekode. Verdiene blir vist som punkt, men har også verdietiketter over seg for å se den nøyaktige verdien uten å måtte "hover" over datapunktet. Det er satt et maksimum antall regioner på 50 for å kunne vise fram grafer, dette fordi etikettene ikke kan vises på en god måte.

#### 🌎 Øvrige kommentarer
I App.tsx skjer det meste av state handling, som deretter er passert nedover som props til "barn" av den komponenten. Før brukeren sender inn et gyldig skjema, så er validQuery satt til false, som gjør at headeren, infoseksjonen og selve skjemaet blir renderet. Når et gyldig skjema er innsendt, blir validQuery satt til true og en navigasjonsbar og en tabell blir renderet.
showGraphAlert (vis graf error) er satt til false som default, men i navigasjonsbaren kan brukeren velge å skifte til grafvisning, men kun hvis antall regioner er under eller lik 50. Hvis antall regioner er over 50, blir showGraphAlert true og en alertboks vil bli synlig. Det er klikk i navigasjonsbaren på en av statistikkgrafene eller grafvisning som toggler denne true/false.
useState hooken re-rendrer DOMen når det skjer en endring i variabelen, som gjør at vi kan rendere komponentene på nytt med en gang den endres. Slik er UIen alltid oppdatert i henhold til den nyeste staten.


## ⚙️ Demo

#### ⚡ Kjør lokalt

1. Klon prosjektet

```bash
  git clone https://github.com/bendiz/statistikk-portal
```

2. Gå til prosjektmappe

```bash
  cd statistikk-portal
```

3. Installer dependencies

```bash
  npm install
```

4. Start server (velg en av kommandoene)

```bash
  npm run start
```

```bash
  npm run dev
```

5. Brukeren kjører npm run dev eller npm run start i konsollen.
Dette gjør at både vite development serveren starter samtidig som node express serveren.

6. Brukeren åpner http://localhost:5173/ i nettleseren som laster inn de importerte modulene.
Main.tsx rendrer App.tsx, som inneholder applikasjonen.

7. Brukeren blar ned til skjemaet og kan begynne å velge variabel, år og regioninndeling. <br>
![image](https://github.com/bendiz/statistikk-portal/assets/101096042/93969a69-3cb4-4a91-807a-1c7a81a5424b)

 - Her er ingen alternativer lastet inn fra tabellen enda, men med en gang brukeren tar et valg
    på "hele landet", "fylker", eller "kommuner", så blir den asynkrone funksjonen getRegion() fyrt av.
 - Her sjekker den at brukeren ikke har valgt alternativet som kun fungerer som en placeholder (verdi = 0).

![image](https://github.com/bendiz/statistikk-portal/assets/101096042/b19b7e4b-0718-45e1-a167-9969547a0101) 
- En fetch request gjøres til http://localhost:5173/api/region/??? med valgt verdi istedet for spørsmålstegn.


- Jeg har satt opp en proxy som gjør at denne forespørselen egentlig blir videresendt til http://localhost:3000/api/region/???, der node express serveren kjører.
  <br>
![image](https://github.com/bendiz/statistikk-portal/assets/101096042/88c74004-fe5d-4539-b03b-3ce0e6566031)

- Det blir gjort en GET-request som henter ut regionen basert på request parameterne.
![image](https://github.com/bendiz/statistikk-portal/assets/101096042/d2234f2f-3b28-4fcf-bfb9-4bdb0ee3d8b6)

- Tabellen blir hentet via URL til API konsollet til SSB.

- Regionnavnene blir lagret i en array og regionskodene blir lagret i en array. Deretter blir disse regionsnavnene og kodene filtrert basert på lengden på koden. Alle fylker har en regionskode som er kortere enn 3 siffer, og alle kommuner har en regionskode som er lengre enn 2 siffer. Hvis brukeren har valgt alternativet for 'alle', så blir alle verdiene med. Dette blir sendt over som json hvis det var et parameter der i utgangspunktet.

8. Brukeren gjennomfører spørringen ved å velge 1 statistisk variabel, minimum 3 årstall og minimum 2 regioner og trykke 'Hent data'.
![image](https://github.com/bendiz/statistikk-portal/assets/101096042/e957ccb7-b74f-4a09-8b76-2d9dd4056528)

- handleSubmit funksjonen fyres av uten at siden refreshes.

- Valgene blir lagret i en variabel som blir errorsjekket med errorCheck-funksjonen. Den lager en tom array og setter errorFound til false. Hvis noen av parameterne ikke stemmer i forhold til påkrevd lengde, så blir navnet på variabelen lagt til i arrayet og errorFound satt til true.

- Det blir returnert en array med errorFound, errorArrayen og et objekt med errorMessages der keys tilsvarer navnet på den/de variablene som errorene kan forekomme i Hvis det finnes noen errorer blir de oppdatert i state, og handleSubmit funksjonen returneres før en POST request blir gjort.

- Error blir sendt som prop til Form-komponenten, som rendrer en errormelding dersom det finnes.

- Spørringen er uten errorer og sendes videre til en try/catch blokk, som forsøker å sende en POST-request til /api/submit med valgene. Hvis brukeren ikke får kontakt med serveren, vil h*n få en errormelding om at nettverksresponsen feilet. Ellers så blir tabelldataen lagret i state og validQuery satt til true i state.

![image](https://github.com/bendiz/statistikk-portal/assets/101096042/bb1415fa-9934-4a7f-9c1a-7aff0d7c7bba)

- En navigasjonsbar, en infoseksjon og en tabell blir rendret basert på at validQuery er true.

- Navigasjonsbaren får en grafVisning prop som sjekker om tabelldataen er under/lik 50. Når man trykker på grafvisning eller en av statistikkgrafene, vil denne tillate deg/ikke tillate deg å se grafdata basert på om det er true eller false. En alertboks kommer opp og siden står uendret ellers hvis du har over 50 regionsvalg.

- Jeg bruker useRef hooken i App.tsx for å finne plasseringen til elementene i DOMen, slik at jeg kan hoppe til de når jeg klikker på linken.

- Brukeren har mulighet til å skjule tomme rader ved å trykke på knappen. Dette er oppnådd ved å bruke state/set state ved klikking på knappen. I returneringen av radene i tabellen, så vil radene uten verdier bli utelatt basert på om hideEmpty er true. hasEmptyCell sjekker om det er true at alle verdiene i raden har en verdi som er lik 0. Eks: (Her ser du at Vestfold-2019 forsvinner fra tabellen, og at ikonet endres og teksten på knappen endres til "vis tomme rader").

![image](https://github.com/bendiz/statistikk-portal/assets/101096042/d6bea2e7-5b8a-4400-af98-68295ee0e527)

- Når brukeren trykker på grafvisning er tilstanden om å skjule rader med 0 bevart, men brukeren har mulighet til å skru det på igjen her også.

- I grafvisningen vises kun median, gjennomsnitt, minimum og maksimum for alle valgte regioner sammenlignet.

![grafvisning](https://github.com/bendiz/statistikk-portal/assets/101096042/6fa9eab6-cddf-4096-aefa-1758c2080aea)

- For å framstille dette på en god og enkel måte har jeg brukt chartJS biblioteket, som er svært fleksibelt og enkelt å customize. 

- Her mapper jeg over alle regionene og de forskjellige statistikkdataene for å lage et linjediagramdataen. En tilfeldig farge blir generert for å skille datapunktene.

- Årstallene i headingene er basert på hvilke år som er valgt som parameter.

![image](https://github.com/bendiz/statistikk-portal/assets/101096042/29b90641-d83a-48d4-b6ef-25b0cbf3e49c)

- I linjekartene har h3-headingene et anchor element inni seg som gjør at man scroller til elementet med riktig label(navn på statistisk kalkulering) i DOMen hvis man klikker på linken.

- Jeg har lagt til en smooth-scroll effect og lagt til et lite offset på hvor den skal scrolle til, så den ikke kutter tekst.

 Et eksempel på hva som skjer hvis man klikker "Maksimum"
![image](https://github.com/bendiz/statistikk-portal/assets/101096042/55e1e87e-4d29-40fe-95ba-62a4e4ad8a6b)



