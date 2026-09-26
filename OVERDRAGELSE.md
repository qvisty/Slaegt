# Overdragelse til en ny Claude samtale

Denne fil samler alle aftaler, instrukser og hele status for projektet, så arbejdet kan fortsætte i en ny Claude Code samtale uden at noget går tabt. Læs hele filen og `CLAUDE.md`, før du gør noget.

Senest opdateret 25. september 2026. Træet har nu 70 personer.

## 1. Hvem og hvad

* **Ejer:** Jesper Gravlev Qvist, GitHub brugeren `qvisty`.
* **Repo:** https://github.com/qvisty/Slaegt (offentligt).
* **Hjemmeside:** https://qvisty.github.io/Slaegt/
* **Formål:** Slægtsforskning i Jespers direkte linje bagud, udgivet som hjemmeside med stamtræ, viftediagram, persongalleri, tidslinje, kort, kilder, forskningsside og guide.
* **Claudes rolle:** Både udvikler af hjemmesiden og aktiv hjælper med selve forskningen. Søg selv i arkiverne, når netværket tillader det. Ellers lav guides, så Jesper kan finde kilderne, og læs og tolk de skærmbilleder, han sender.

## 2. Aftaler med Jesper

1. **Den direkte linje er træet, søskende noteres ved siden af.** Personerne i træet er forældre, bedsteforældre og så videre bagud. Søskende til hver person i linjen noteres i feltet `soeskende` og vises på personsiden (Jesper bad om at opspore bagud og sidelæns). Fætre, kusiner og andre navne noteres kun i loggen som "ikke i linjen".
2. **Et led ad gangen.** En persons forældre undersøges, når personen selv er fundet i en primærkilde. Nye aner står som `under undersøgelse`, indtil kæden fra Jesper er bekræftet.
3. **Bekræftet kræver hele kæden.** En person kan først være `bekræftet`, når barnet i linjen er bekræftet. Status `bekræftet` kræver mindst én primærkilde og en skriftlig begrundelse i feltet `bevis`.
4. **Familieoplysninger** (navne Jesper kender, men som ikke er undersøgt) registreres med status `spor`. De vises på siden med mærket Familieoplysning.
5. **Ingen fiktive personer.** Jesper har bedt om, at alt fiktivt indhold og visningen af det er fjernet. Tomme pladser i træet vises som "P.t. ukendt". Tjekket afviser personer med `"fiktiv": true`.
6. **Privatliv.** Repoet og siden er offentlige. Jesper har besluttet, at nulevendes datoer og steder må stå i datafilerne med dag, men siden viser kun måned og år (privatliv "måned og år" i `projekt.json`). Afdøde vises med fuld dato. Nulevende, og personer hvor det er uvist om de lever (ingen død eller begravelse registreret og ældste kendte årstal under 100 år tilbage), vises kun med måned og år. Datafilerne må indeholde den fulde dato. Billeder af nulevende kun med tilladelse. Følsomme oplysninger, fx om misbrug eller sygdom hos nyligt afdøde, skrives ikke.
7. **Kun grenen `main`.** Jesper har givet lov til commit, merge og push direkte på `main`. Lav ikke andre grene og ikke pull requests.
8. **Forsiden er stamtræet** med klikbare personer. README er kun teknisk og må ikke være det, besøgende ser.
9. **Log alt.** Hver forskningsindsats skrives i `docs/data/forskning.json` under `log`, også når intet blev fundet, og også fejlmatch.
10. **Link til siden.** Når en opgave er helt færdig, slutter svaret til Jesper altid med linket https://qvisty.github.io/Slaegt/

## 3. Sprog og stil (Jespers præferencer)

* Al tekst er på dansk, både på siden, i svar, i commit beskeder og i filer.
* **Brug aldrig tankestreg (em dash).** Undgå så vidt muligt semikolon og bindestreg. Brug punktum eller komma.
* JavaScript er skrevet uden semikolon. Pas på linjer, der starter med `(` eller `[`, de skal have et foranstillet semikolon.
* Brug kønsneutrale pronominer om personer, hvis køn ikke er oplyst.

## 4. Familien, status nu

Anenumre: rodpersonen er 1, far til n er 2n, mor til n er 2n + 1. Oversigten er genereret ud fra `personer.json`. Detaljer, søskende og kilder står i data og på siden.

| Nr. | Navn | Status | Sikkerhed | Født og død |
| --- | --- | --- | --- | --- |
| 1 | Jesper Gravlev Qvist | bekræftet |  |  |
| 2 | Ole Gravlev Qvist | bekræftet | høj | født 1949-07-24, død 2002-03-14 |
| 3 | Dorthe Merete Qvist | bekræftet | høj | født 1945-10-25 |
| 4 | Tage Qvist | bekræftet | høj | født 1924-06-10 |
| 5 | Else Marie Qvist | bekræftet | høj | født 1923-03-24, død ca. 2015 |
| 6 | Helmuth Sørensen | bekræftet | høj | født 1915-01-09 |
| 7 | Anna Christine Sørensen | bekræftet | høj | født 1924-12-09 |
| 8 | Gerner Qvist | bekræftet | høj | født 1890-03-23, død 1953-12-15 |
| 9 | Helga Margrethe Qvist | bekræftet | høj | født 1896-12-28, død 1991-05-10 |
| 11 | Maren Kirstine Ottilie Gravlev | bekræftet | høj | født 1895-05-15 |
| 12 | Ludwig Sørensen | bekræftet | høj | født 1883-08-16, død 1951-06-24 |
| 13 | Doris Elisabeth Sørensen | bekræftet | høj | født 1879-06-21, død 1955-02-23 |
| 14 | Jørgen Peter Bundesen | bekræftet | høj | født 1896-10-19, død 1951-12-10 |
| 15 | Dusine Andrea Bundesen | bekræftet | høj | født 1901-12-21 |
| 16 | Ludvig Valdemar Qvist | bekræftet | høj | født 1859-06-27 |
| 17 | Johanne Marie Qvist | bekræftet | høj | født 1864-02-07 |
| 18 | Anders Nielsen | bekræftet | høj | født 1856-08-19, død 1919-02-18 |
| 19 | Julie Margrethe Louise Nielsen | bekræftet | høj | født 1869-08-28 |
| 22 | Anders Kristian Gravlev | bekræftet | høj | født 1857-03-03 |
| 23 | Johanne Jensen | bekræftet | høj | født 1857-06-22 |
| 24 | Georg Friedrich Sørensen | bekræftet | høj | født 1849-07-16, død før 1912 |
| 25 | Anna Barbara Sørensen | bekræftet | høj | født 1849-10-06, død før 1912 |
| 26 | Ferdinand Gottfried Olsen | bekræftet | høj | født 1850-04-14, død 1920-12-22 |
| 27 | Doris Elisabeth Friederike Olsen | bekræftet | høj | født 1853-04-04 |
| 28 | Jes Peter Bundesen | bekræftet | høj | født 1861-12-14, død 1916-12-07 |
| 29 | Anna Catharina Bundesen | bekræftet | høj | født 1858-05-23, død 1935-12-13 |
| 30 | Rasmus Andresen Wind | bekræftet | høj | født 1859-12-16, død 1931-03-14 |
| 31 | Anna Christine Wind | bekræftet | høj | født 1862-07-05, død 1922-03-14 |
| 32 | Clemmen Clemmensen Qvist | bekræftet | høj | født 1820-05-31, død 1885-03-03 |
| 33 | Johanne Qvist | bekræftet | høj | født 1825-09-29, død 1911-06-14 |
| 34 | Johan Jacob Møller | bekræftet | høj | født 1820-03-17, død 1900-05-28 |
| 35 | Marie Birgitte Møller | bekræftet | høj | født 1832-12-24 |
| 36 | Niels Peter Andersen | bekræftet | høj | født 1821-10-08, død 1886-11-16 |
| 37 | Kristine Frederiksdatter | bekræftet | høj | født 1819-11-15 |
| 38 | Caspar Georg Julius Jensen | bekræftet | høj | født 1844-01-09 |
| 39 | Ane Marie Kirstine Jensen | bekræftet | høj | født 1845-09-30 |
| 44 | Jens Gravlev Pedersen | bekræftet | høj | født 1819-12-19, død 1903-02-18 |
| 45 | Hedevig Larsdatter | bekræftet | høj | født ca. 1813 |
| 46 | Lars Peter Eriksen | bekræftet | middel |  |
| 47 | Kirsten Marie Nielsdatter | bekræftet | middel |  |
| 48 | Søren Christian Sørensen | bekræftet | høj |  |
| 49 | Anne Sørensen | bekræftet | middel |  |
| 50 | Jes Kjær | bekræftet | høj | født 1813-03-26, død 1859-10-11 |
| 51 | Hansine Martine Hansdatter | bekræftet | høj | født 1818-03-15, død 1859-01-02 |
| 52 | Jens Ulrich Jespersen Olsen | bekræftet | høj | født ca. 1809, død 1871-12-08 |
| 53 | Magdalene Marie Olsen | bekræftet | høj | født 1815-01-06, død 1886-06-05 |
| 54 | Johan Søren Johannsen | bekræftet | høj |  |
| 55 | Maren Johannsen | bekræftet | middel |  |
| 56 | Jürgen Peter Bundesen | bekræftet | høj | født 1828-02-14, død 1865-05-04 |
| 57 | Anna Maria Bundesen | bekræftet | høj | født 1834-04-25, død 1870-10-31 |
| 58 | Rasmus Christiansen Kramer | bekræftet | høj | født 1830-06-29, død 1908-01-08 |
| 59 | Maria Catharina Kramer | bekræftet | høj | født 1828-06-24, død 1906-01-20 |
| 60 | Hans Nissen Wind | bekræftet | høj | født 1833-06-14 |
| 61 | Kirsten Marie Rasmusdatter | bekræftet | høj | født 1835-02-09 |
| 62 | Kristen Hansen Lauesen | bekræftet | middel | født ca. 1828 |
| 63 | Anne Kristine Lauesen | bekræftet | middel |  |
| 64 | Ludvig Qvist | bekræftet | høj |  |
| 65 | Nicoline Qvist | bekræftet | høj |  |
| 66 | Friderich Pedersen | under undersøgelse | lav |  |
| 67 | Eva Rosine Hansdatter | bekræftet | høj |  |
| 68 | Daniel Møller | bekræftet | høj |  |
| 69 | Margrete Møller | bekræftet | høj |  |
| 70 | Johan Anthon Gesner | bekræftet | høj |  |
| 71 | Sophie Frederikke Gesner | bekræftet | høj |  |
| 72 | Anders Christensen Gadegaard | bekræftet | høj |  |
| 73 | Maren Nielsdatter | bekræftet | middel |  |
| 74 | Frederich Christensen | bekræftet | middel |  |
| 75 | Anne Dorthe Jensdatter | bekræftet | middel |  |
| 76 | Christen Jensen | bekræftet | middel |  |
| 77 | Julie Moll | bekræftet | middel |  |
| 88 | Peder Chrestensen | bekræftet | middel |  |
| 89 | Else Chrestensdatter | bekræftet | middel |  |
| 100 | Niels Ludvigsen Kjær | bekræftet | høj | født ca. 1778, død 1854-04-01 |
| 101 | Karen Jesdatter | bekræftet | høj | død 1858-02-03 |
| 103 | Maren Mikkelsdatter | bekræftet | høj |  |
| 104 | Jesper Olsen | bekræftet | høj |  |
| 105 | Kirsten Olsen | bekræftet | høj |  |
| 106 | Peter Hansen Kaadmann | bekræftet | høj |  |
| 107 | Dorothea Maria Kaadmann | bekræftet | høj |  |
| 112 | Jep Petersen Bundesen | bekræftet | høj | født ca. 1792 |
| 113 | Margaretha Bundesen | bekræftet | middel |  |
| 114 | Jes Petersen | bekræftet | høj |  |
| 115 | Catharina Maria Petersen | bekræftet | høj |  |
| 116 | Christian Christiansen Kramer | bekræftet | høj |  |
| 117 | Anna Catharina Kramer | bekræftet | middel |  |
| 118 | Peder Jørgensen Roy | bekræftet | høj |  |
| 119 | Maria Kirstine Roy | bekræftet | høj |  |
| 120 | Anders Wind | bekræftet | høj | født ca. 1790 |
| 121 | Anna Kirstine Wind | bekræftet | middel |  |
| 122 | Rasmus Olsen | bekræftet | høj |  |
| 123 | Anna Jørgensdatter | bekræftet | høj |  |
| 124 | Hans Lausen | bekræftet | middel |  |
| 126 | Jens Lassen Andersen | bekræftet | middel |  |

Jesper bekræftede selv Ole og Dorthe Merete den 26. september 2026. Derefter er alle aner bekræftet led for led med sikkerhedsgrad. Kun Friderich Pedersen (nr. 66, udlagt barnefader) har sikkerhed lav og står som under undersøgelse. Elses far (nr. 10) er ukendt.

## 5. Forskning udført indtil nu

Alle fund er set på originalbilledet af Claude, og alle står i loggen i `forskning.json`.

* **Fars side er fundet fire led tilbage** i Viborg, Løgstør og Skælskør (se tabellen). Kilder: Oles dåb 1949, Tage og Elses vielse 1949 (Salling og Viborg Søndre), Tages konfirmation 1939, FT 1940 (Vesterled 49), FT 1930, FT 1925, Tages dåb 1924, Gerner og Helgas vielse 1919, Elses dåb 1923, FT 1901 (Gerner som barn i Skælskør) og gravstedet på Viborg Kirkegård.
* **Alle på fars side står som `spor` eller `under undersøgelse`**, fordi kæden kun kan bekræftes fra Jesper og bagud. Den mangler en kilde, der binder Ole til Jesper. Så snart den findes, kan Ole, Tage, Else, Gerner og Helga bekræftes med de kilder, der allerede er registreret.
* **Ikke fundet:** gravsted for Tage, Else, Ole, Helmuth og Anna (DK-gravsten og Find gravsted i hele landet). FT 1921 for familien.
* **Avisspor, ikke læst** (Mediestream, teksten er spærret): træf på Ole i Fredericia Dagblad 11. og 12. marts 2002 (før dødsdagen, altså ikke dødsannoncer) og mulig dødsannonce for Tage i Viborg Stifts Folkeblad 3. december 1999.
* **Mors side:** Dorthe Meretes dåb, Helmuths dåb 1915 (på tysk), hans vielse 1940 og FT 1930 og 1940 er fundet. Annas fødsel og den borgerlige vielse 1945 er ikke fundet. Avisspor om Helmuths 40 års jubilæum som direktør 1. april 1971 står i loggen.
* **Fejlmatch, afvist:** Landsholdsmålmanden Ole Qvist fra KB er født 25. februar 1950 i København og lever. Han er **ikke** Jespers far. Brug ham aldrig som match.

### Sådan søges arkiverne fra Claudes miljø

Netværket er åbent. Chromium virker ikke med proxyens certifikat, så brug curl og python3. Læs scannede sider med Read værktøjet.

* **Arkivalieronline** kan bruges uden login. Billedliste: `https://api.rigsarkivet.dk/ao/v1/billedviser/billed-reference-lister?bsid=<bsid>` eller `.../billedviser/indeks-bs?bsid=<bsid>`. Billede: `https://api.rigsarkivet.dk/ao/v1/images/<billedid>`. Stabil URL: `https://arkivalieronline.rigsarkivet.dk/da/billedviser?bsid=<bsid>#<bsid>,<billedid>`. Sogne og bind for kirkebøger: `/da/geo/geo-collection/5`, `/da/geo/archive-series/5/<NgId>`, `/da/geo/picture-series/<epid>`. Folketællinger: `/da/rif/rif-collection/7` og `/da/rif/select/7/<serieid>`.
* **Nyttige id'er:** NgId Viborg Domsogn 533363, Viborg Søndre 533381. FT serier: 1930 Bylister 16972545, 1925 Købstæder 16969289, 1921 Købstæder 16955690, 1940 Købstæder 18878629.
* **Kirkebøger 1949 og 1950** er online. Anmærkningsrubrikken er sløret. Viborg Søndre fører alle fødsler på Viborg sygehus.
* **Dansk Demografisk Database:** POST `https://ddd.dda.dk/asp/soeg_amter.asp` (`operator=3`, `navn`, `amt`, `kilde`) og `https://ddd.dda.dk/asp/alle_opl.asp` (`amt`, `indtastningsnr`, `lbnr`).
* **Find gravsted:** POST `https://findgravsted.brandsoft.dk/bsk_app/bsk_wsoffentlig_pck.AfdoedeSoeg`. **DK-gravsten:** POST `https://dk-gravsten.dk/kirkeg/kg_alle.php` (hent en cookie fra forsiden først).
* Danish Family Search kræver login. MyHeritage blokerer automatiske opslag.

## 6. Næste skridt i forskningen

Jesper har bedt om at holde forskningen tæt på hans linje. Træet er ført til generation 7 og 8 på flere grene, men det skal ikke udvides yderligere, før han beder om det. Fokus er de nærmeste led.

1. **Jespers dåbs eller navneattest** er nu den vigtigste kilde. Den bekræfter Ole og Dorthe Merete, og derefter kan hele fars side bekræftes med det samme.
2. **Oles død** 14. marts 2002 på Vejle Sygehus kendes fra Jesper. Mangler en skriftlig kilde (dødsattest eller dødsannonce efter 14. marts 2002).
3. **Tage og Elses død og gravsted.**
4. **Annas fødested** 9. december 1924. Prøv Tønder, Ribe og Esbjerg egnen, eller den borgerlige vielse i Skærbæk 1945.
5. **Helmuths firma** på havnen og Helmuth og Annas død og gravsted.
6. Når Gerner og Helga er bekræftet: Gerners dåb i Skælskør 1890 og Helgas dåb i Viborg Domsogn 1896. Forældrene er allerede kendt fra vielsen 1919.

Åbne opgaver står også i `docs/data/forskning.json` under `opgaver`, og guiden til Jesper ligger i `docs/data/guide.html`.

## 7. Domæner den nye samtale bør have adgang til

* `arkivalieronline.rigsarkivet.dk` og `www.rigsarkivet.dk` (kirkebøger og folketællinger)
* `www.danishfamilysearch.dk` og `www.danishfamilysearch.com` (navnesøgbare folketællinger)
* `www.familysearch.org` (indekserede kirkebøger)
* `dk-gravsten.dk` og `www.dk-gravsten.dk` (gravsten)
* `findgravsted.brandsoft.dk` og `www.findgravsted.dk` (gravsteder)
* `arkiv.dk` (lokalarkiver)
* `www2.statsbiblioteket.dk` (Mediestream aviser)
* `slaegt.dk` og `wiki.dis-danmark.dk` (vejledninger)
* `qvisty.github.io` (for at tjekke den udgivne side)
* `cdnjs.cloudflare.com` er ikke nødvendig. Leaflet ligger lokalt i `docs/assets/vendor/leaflet/`.

Husk: kirkebøger er scannede billeder uden navnesøgning. Folketællinger er ofte navnesøgbare. Rigsarkivet har sløret anmærkningsrubrikken i fødselslister fra 1892 og frem. Kirkebøger er scannet frem til omkring 1960 for fødte.

## 8. Teknik

* **Hjemmesiden** ligger i `docs/`. Ren HTML, CSS og JavaScript uden byggetrin. Programmet er `docs/assets/js/app.js`, stilarket `docs/assets/css/style.css`.
* **Sider (hash ruter):** `#/` stamtræ og overblik, `#/anetavle/N`, `#/vifte`, `#/galleri`, `#/person/N`, `#/tidslinje`, `#/kort`, `#/kilder`, `#/kilde/ID`, `#/forskning`, `#/guide`.
* **Data** i `docs/data/`: `projekt.json`, `personer.json`, `steder.json`, `kilder.json`, `forskning.json`, `historie.json` og `guide.html`. Formatet er beskrevet i `README.md`.
* **Statusværdier:** `bekræftet`, `under undersøgelse`, `spor`. Plus `"levende": true` for nulevende.
* **Kildekvalitet:** `primær`, `sekundær`, `afledt`.
* **Tjek:** `node scripts/valider.mjs` håndhæver reglerne (kæden af bekræftede aner, primærkilder, privatliv, plausible aldre, ingen fiktive personer). Kør før hver commit.
* **Versionsnummer:** `node scripts/version.mjs` efter ændringer i `app.js` eller `style.css`, ellers kan browsere vise en gammel version.
* **Udgivelse:** GitHub Pages med "Deploy from a branch". En `index.html` i roden sender videre til `docs/`, så siden virker, uanset om Pages peger på roden eller `/docs`. GitHub Actions (`.github/workflows/udgiv.yml`) kører kun tjekket.
* **Test lokalt:** `cd docs && python3 -m http.server 8000`. Chromium og Playwright kan bruges til skærmbilleder.
* **Den gamle gren** `claude/genealogy-github-pages-wevif7` findes stadig på GitHub, fordi den tidligere samtale ikke havde lov til at slette grene. Jesper kan slette den under Branches.

## 9. Arbejdsgang når Jesper sender et fund

1. Læs skærmbilledet omhyggeligt. Oversæt gammel håndskrift og tysk tekst.
2. Vurder om kilden beviser noget, og hvad. Skriv det i loggen.
3. Opret eller opdater kilden i `kilder.json` med arkiv, reference eller opslagsnummer og link.
4. Opdater personen i `personer.json`. Sæt kun `bekræftet`, hvis reglerne er opfyldt, og skriv begrundelsen i `bevis`.
5. Når en person bliver bekræftet, må forældrene oprettes eller opgraderes fra `spor` til `under undersøgelse`.
6. Kør tjekket, commit på dansk, push til `main`, og fortæl Jesper kort hvad næste skridt er.

## 10. Forslag til første besked i den nye samtale

> Læs OVERDRAGELSE.md og CLAUDE.md i repoet qvisty/Slaegt og fortsæt slægtsforskningen. Start med at søge efter Gerner Qvist i folketællingerne 1921 til 1940 og fortæl mig, hvad du finder.
