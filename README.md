# 📈 Statistikk Portal

Denne portalen henter ut data fra en av SSB sine tabeller (Tabell 11342: Areal og befolkning i kommuner, fylker og hele landet (K) 2007-2024), gjør utregninger av median, gjenomsnitt, minimum og maksimum pr. region og presenterer dataene i en tabell og visualiseres med grafer.

Jeg har brukt Vite for å bygge frontenden, som kommer med et ferdig oppsett for React + Typescript. Dette har gjort prosjektet raskt og enkelt å sette opp.

I konfigurasjonsfilen til Vite har jeg satt opp en proxy som gjør at Vite automatisk videresender forespørselen til backenden min som kjører på en annen port. Dette gjør at jeg ikke må lage CORS-oppsett for å godkjenne forespørsler fra frontenden, da ser ser ut som alle forespørsler kommer fra samme opprinnelse.

Jeg har satt opp en Node server i Express rammeverket som skal hente dataen fra SSB. Her har jeg laget en GET-route for /api/region/:region slik at brukeren kan hente ut en liste over fylker/kommuner/hele landet basert på valg av inndeling i skjemaet. :region kan være "alle", "kommuner" eller "fylker". Brukeren får ikke gå videre med innsending av skjemaet hvis ikke denne GET-requesten er utført og minst 2 regioner er valgt.

Det er satt opp en route for app.all nederst i koden som lager en ny ExpressError med statuskode 404 dersom brukeren prøver å gå til en /api route som ikke finnes. Errormeldingen vil vises, og brukeren vil få en link til å prøve på nytt. Hvis brukeren prøver å gå til en annen route som ikke har starter med /api, så vil siden bare bli lastet på nytt, siden proxyen er satt opp med en /api route. 

### ❔ Hvordan virker den?

Når brukeren velger inndeling av region gjøres det en GET-request til serveren, som igjen henter tabellen fra SSB sin API konsoll og sender tilbake regionene til frontenden i JSON format.

Før serveren henter mer data fra SSB, så må brukeren oppgi:

- 1 statistisk variabel
- Minimum 3 årstall
- Minimum 2 regioner

Brukeren blir stoppet av errorsjekk i frontend hvis h\*n forsøker å hente ut data uten å oppfylle overnevnte kriterier. Det vil komme opp en rød alertboks der brukeren ikke har fylt ut riktig, og som forhindrer informasjonen fra å bli sendt over til serveren.
For at alle alertboksene skal kunne dukke opp samtidig, så blir hver error lagt til i en array av strings. 

For hver seksjon av skjemaet så sjekkes det om errorarrayet inneholder noe og om det inneholder en error med samme tittel som seksjonen som skal renderes. Hvis dette er tilfellet, så vil headingen til seksjonen bli rød og det vises en alarmboks (som kan krysses ut) over seksjonen der det er funnet en error.

Dersom man skulle prøve seg på å sende en spørring uten å gå via skjemaet i UI'en, så vil serveren også gjøre en sjekk på disse kriteriene før dataen blir hentet eksternt.

Når dataen oppfyller kriteriene, blir dataene fra skjemaet sendt til serveren, omstrukturert slik at spørringen er i tråd med SSB sin brukerveiledning, og deretter sendt som en POST request til SSB.

På serversiden er alle asynkrone funksjoner nested i en catchAsync funksjon for å fange opp eventuelle feilmeldinger og sende videre til errorhandling middleware funksjonen. Dette for å unngå alle try/catch blokkene. Dersom en error oppstår vil brukeren få en errorkode, feilmelding og link til å forsøke en ny spørring.

Siden dataen er av begrenset/fast størrelse, så sendes hele responsen over i JSON format tilbake til frontenden.

#### 🛞 Navigasjon

Navigasjonen lar brukeren lage ny spørring, bytte mellom tabell-/grafvisning, og å scrolle til en spesifikk statistikkvariabelgraf. Dette er oppnådd ved å få tilgang til DOM elementene ved hjelp av useRef hooken til React. Siden React lager en Virtual DOM, som er en lettere kopi av den faktiske DOMen, så fungerer ikke "anchor-scrolling" som gjør at man scroller automatisk til et element med samme id. 

#### 🗒️ Skjema

Istedet for å holde styr på staten til muligens 971 forskjellige kommuner, så har jeg latt et tredjepartsbibliotek ta seg av dette. React-Select sørger for at valgene blir dynamisk generert med hver sin state. Brukeren kan utføre søk etter ønsket variabel/år/region og har god oversikt over hva som er valgt. Dropdown menyen som alltid er åpen gjør det enkelt for brukeren å se et utsnitt av valgmulighetene til enhver tid, og scrolle seg gjennom den for å gjøre flere valg. Det er egentlig mest relevant å bruke React-Select biblioteket til dataen vi får tilbake fra SSB om alle regionene som finnes i tabellen, men jeg har valgt å bruke det for alle seksjonene i skjemaet for å holde styling og oppførsel konsekvent. 

#### 📋 Tabell

Tabellkomponenten (Table) mapper verdiene til riktig region basert på indekser fra responsen og sorterer deretter dataen alfabetisk. Den sjekker også om dataene inneholder tomme rader. Hvis brukeren skrur på at h\*n vil skjule tomme rader, blir de ikke renderet i tabellen eller i grafvisningen. Hvis brukeren ikke skrur på denne funksjonaliteten, så blir alle radene lagret i tableData og vist i tabellen.

Kalkulering av median, gjennomsnitt, minimum og maksimum skjer på hver rad før de blir vist fram i tabellen og i grafene. Alle tall som blir vist blir gjort om til strings og formattert ved hjelp av regex for å formattere nummer til å sette inn mellomrom mellom tallene for å øke lesbarheten. For å gjøre kalkuleringene er det brukt en kombinasjon av innebygde arrayfunksjoner og Math-funksjoner. Median sorterer tallende i stigende rekkefølge før den returnerer midtverdien, calculateAvg bruker reduce-funksjonen for å summere alle verdiene i arrayet før den deler summen på antall verdier for å finne gjennomsnitt, calculateMin tar det minste tallet av alle verdiene (i mange tilfeller vil resultatet her bli 0, da flere av regionene mangler data for flere av årene), calculateMax finner det høyeste tallet i arrayet med verdier. 

#### 📉 Grafer

I grafkomponenten blir tomme rader som eventuelt er filtrert ut bragt med, for ikke å vises i grafene heller. Data for alle regioner blir sammenlignet i alle fire statistikkalkulasjoner, og vist fram i en graf. Hver region/datapunkt i alle grafer får en tilfeldig farge for å øke lesbarheten. Den tilfeldige fargen blir generert ved hjelp av funksjonen getRandomColor() som tar en # pluss alle mulige hexadecimale siffer og looper over de 6 ganger for å danne en tilfeldig hexadecimal fargekode. Verdiene blir vist som punkt, men har også verdietiketter over seg for å se den nøyaktige verdien uten å måtte "hover" over datapunktet. Det er satt et maksimum antall regioner på 50 for å kunne vise fram grafer, dette fordi etikettene ikke kan vises på en god måte. 

## ⚙️ Kjør lokalt

Klon prosjektet

```bash
  git clone https://github.com/bendiz/statistikk-portal
```

Gå til prosjektmappe

```bash
  cd statistikk-portal
```

Installer dependencies

```bash
  npm install
```

Start server (velg en av kommandoene)

```bash
  npm run start
```

```bash
  npm run dev
```
