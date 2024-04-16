# Statistikk Portal

Denne portalen henter ut data fra en av SSB sine tabeller (Tabell 11342: Areal og befolkning i kommuner, fylker og hele landet (K) 2007-2024), gjør utregninger av median, gjenomsnitt, minimum og maksimum pr. region og presenterer dataene i en tabell og visualiseres med grafer.

Jeg har brukt Vite for å bygge front-enden, som kommer med et ferdig oppsett for React + Typescript. Dette har gjort prosjektet raskt og enkelt å sette opp.

I konfigurasjonsfilen til Vite har jeg satt opp en proxy som gjør at Vite automatisk videresender forespørselen til backenden min som kjører på en annen port. Dette gjør at jeg ikke må lage CORS-oppsett for å godkjenne forespørsler fra frontenden, da ser ser ut som alle forespørsler kommer fra samme opprinnelse.

### Hvordan virker den?

Når brukeren velger inndeling av region gjøres det en GET-request til serveren, som igjen henter tabellen fra SSB sin API konsoll og sender tilbake regionene til frontenden i JSON format.

Før serveren henter mer data fra SSB, så må brukeren oppgi:

- 1 statistisk variabel
- Minimum 3 årstall
- Minimum 2 regioner

Brukeren blir stoppet av errorsjekk i frontend hvis h\*n forsøker å hente ut data uten å oppfylle overnevnte kriterier. Det vil komme opp en rød alertboks der brukeren ikke har fylt ut riktig, og som forhindrer informasjonen fra å bli sendt over til serveren.

Dersom man skulle prøve seg på å sende en spørring uten å gå via skjemaet i UI'en, så vil serveren også gjøre en sjekk på disse kriteriene før dataen blir hentet eksternt.

Når dataen oppfyller kriteriene, blir dataene fra skjemaet sendt til serveren, omstrukturert slik at spørringen er i tråd med SSB sin brukerveiledning, og deretter sendt som en POST request til SSB.

På serversiden er alle asynkrone funksjoner nested i en catchAsync funksjon for å fange opp eventuelle feilmeldinger og sende videre til errorhandling middleware funksjonen. Dette for å unngå alle try/catch blokkene. Dersom en error oppstår vil brukeren få en errorkode, feilmelding og link til å forsøke en ny spørring.

Siden dataen er av begrenset/fast størrelse, så sendes hele responsen over i JSON format tilbake til frontenden

#### Navigasjon

Navigasjonen lar brukeren lage ny spørring, bytte mellom tabell-/grafvisning, og å scrolle til en spesifikk statistikkvariabelgraf. Dette er oppnådd ved å få tilgang til DOM elementene ved hjelp av useRef hooken til React.

#### Skjema

Istedet for å holde styr på staten til muligens 971 forskjellige kommuner, så har jeg latt et tredjepartsbibliotek ta seg av dette. React-Select sørger for at valgene blir dynamisk generert med hver sin state. Brukeren kan utføre søk etter ønsket variabel/år/region og har god oversikt over hva som er valgt. Dropdown menyen som alltid er åpen gjør det enkelt for brukeren å se et utsnitt av valgmulighetene til enhver tid, og scrolle seg gjennom den for å gjøre flere valg.

#### Tabell

Tabellkomponenten mapper verdiene til riktig region og sorterer dataen alfabetisk. Den sjekker også om dataene inneholder tomme rader. Hvis brukeren skrur på at h\*n vil skjule tomme rader, blir de ikke renderet i tabellen eller i grafvisningen. Hvis brukeren ikke skrur på denne funksjonaliteten, så blir alle radene vist.

Kalkulering av median, gjennomsnitt, minimum og maksimum skjer på hver rad før de blir vist fram i tabellen og i grafene. Alle tall som blir vist blir gjort om til strings og formattert ved hjelp av regex for å formattere nummer til å sette inn mellomrom mellom tallene for å øke lesbarheten.

#### Grafer

I grafkomponenten blir tomme rader som eventuelt er filtrert ut bragt med, for ikke å vises i grafene heller. Data for alle regioner blir sammenlignet i alle fire statistikkalkulasjoner, og vist fram i en graf. Hver region/datapunkt i alle grafer får en tilfeldig farge for å øke lesbarheten. Verdiene blir vist som punkt, men har også verdietiketter over seg for å se den nøyaktige verdien uten å måtte "hover" over datapunktet.
