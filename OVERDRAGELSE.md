# Overdragelse til en ny Claude samtale

Denne fil samler alle aftaler, instrukser og hele status for projektet, så arbejdet kan fortsætte i en ny Claude Code samtale uden at noget går tabt. Læs hele filen og `CLAUDE.md`, før du gør noget.

Senest opdateret 25. september 2026.

## 1. Hvem og hvad

* **Ejer:** Jesper Gravlev Qvist, GitHub brugeren `qvisty`.
* **Repo:** https://github.com/qvisty/Slaegt (offentligt).
* **Hjemmeside:** https://qvisty.github.io/Slaegt/
* **Formål:** Slægtsforskning i Jespers direkte linje bagud, udgivet som hjemmeside med stamtræ, viftediagram, persongalleri, tidslinje, kort, kilder, forskningsside og guide.
* **Claudes rolle:** Både udvikler af hjemmesiden og aktiv hjælper med selve forskningen. Søg selv i arkiverne, når netværket tillader det. Ellers lav guides, så Jesper kan finde kilderne, og læs og tolk de skærmbilleder, han sender.

## 2. Aftaler med Jesper

1. **Kun den direkte linje.** Forældre, bedsteforældre og så videre bagud. Ingen søskende, fætre eller sidelinjer som personer. Når Jesper finder navne uden for linjen, noteres de kun i loggen som "ikke i linjen".
2. **Et led ad gangen.** En persons forældre undersøges først, når personen selv er bekræftet.
3. **Kun bekræftede aner føres videre.** Status `bekræftet` kræver mindst én primærkilde og en skriftlig begrundelse i feltet `bevis`.
4. **Familieoplysninger** (navne Jesper kender, men som ikke er undersøgt) registreres med status `spor`. De vises på siden med mærket Familieoplysning.
5. **Ingen fiktive personer.** Jesper har bedt om, at alt fiktivt indhold og visningen af det er fjernet. Tomme pladser i træet vises som "P.t. ukendt". Tjekket afviser personer med `"fiktiv": true`.
6. **Privatliv.** Repoet og siden er offentlige. Nulevende personer (Jesper og hans mor) får kun navn. Ingen fødselsdatoer, steder eller billeder af nulevende i repoet. Jespers mors fødselsdato kendes, men må ikke skrives i repoet.
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

Anenumre: rodpersonen er 1, far til n er 2n, mor til n er 2n + 1.

| Nr. | Navn | Status | Oplysninger |
| --- | --- | --- | --- |
| 1 | Jesper Gravlev Qvist | bekræftet (rodperson) | Nulevende. Kun navn. |
| 2 | Ole Gravlev Qvist | under undersøgelse | Far. Født 24. juli **1949** (familien sagde 1950) på sygehuset i Viborg, døbt 4. september 1949 i Viborg Søndre Sogn. Død 14. marts 2002 på Vejle Sygehus, 52 år (Jespers oplysning, passer med 1949). Kan bekræftes, når en kilde binder ham til Jesper (Jespers dåbsattest). |
| 3 | Dorthe Merete Qvist, født Sørensen | under undersøgelse | Mor. Nulevende, født 1945. Slægten fra Sønderjylland. |
| 4 | Tage Clemmen Clemmensen Qvist | spor | Farfar. Født 10. juni 1924 i Viborg Søndre Sogn. Dåb 1924, FT 1925, 1930 og 1940, konfirmation 1939 og vielse 1949 er fundet. Sygehusportør. Klar til at blive bekræftet, så snart Ole er bekræftet. |
| 5 | Else Marie Qvist, født Gravlev | spor | Farmor. Født 24. marts 1923 i Løgstør, datter af ugift Maren Kirstine Ottilie Gravlev. Gift med Tage 20. marts 1949 i Salling kirke. |
| 6 | Helmuth Sørensen | spor | Morfar. Boede i Haderslev. (Blev først fejlagtigt skrevet som Sønderborg. Rettet.) |
| 7 | Anna Sørensen | spor | Mormor. Boede i Haderslev. |
| 8 | Gerner Clemmen Clemmensen Qvist | spor | Oldefar. Født 23. marts 1890 i Skælskør, gift 15. november 1919 i Viborg Domkirke, død 15. december 1953. Forældre: Ludvig Valdemar Qvist og Johanne Marie Møller (kun i loggen). |
| 9 | Helga Margrethe Qvist, født Nielsen | spor | Oldemor. Født 28. december 1896 i Viborg Domsogn, død 10. maj 1991. Forældre: kellner Anders Nielsen og Julie Margrethe Louise Jensen (kun i loggen). |

Gerner og Helga ligger i samme gravsted på Viborg Kirkegård, foto Viborg_K165 hos DK-gravsten. Fundet af Jesper ved søgning på Qvist på https://www.dk-gravsten.dk/kirkeg/Viborg.php. De øvrige navne i den søgning (Emil Qvist, Ib Qvistgaard, Villy Clemmen Clemmensen Qvist og Nina Qvist) er **ikke** i linjen.

Alle andre pladser i træet er tomme og vises som "P.t. ukendt".

## 5. Forskning udført indtil nu

Alle fund er set på originalbilledet af Claude, og alle står i loggen i `forskning.json`.

* **Fars side er fundet fire led tilbage** i Viborg, Løgstør og Skælskør (se tabellen). Kilder: Oles dåb 1949, Tage og Elses vielse 1949 (Salling og Viborg Søndre), Tages konfirmation 1939, FT 1940 (Vesterled 49), FT 1930, FT 1925, Tages dåb 1924, Gerner og Helgas vielse 1919, Elses dåb 1923, FT 1901 (Gerner som barn i Skælskør) og gravstedet på Viborg Kirkegård.
* **Alle på fars side står som `spor` eller `under undersøgelse`**, fordi kæden kun kan bekræftes fra Jesper og bagud. Den mangler en kilde, der binder Ole til Jesper. Så snart den findes, kan Ole, Tage, Else, Gerner og Helga bekræftes med de kilder, der allerede er registreret.
* **Ikke fundet:** gravsted for Tage, Else, Ole, Helmuth og Anna (DK-gravsten og Find gravsted i hele landet). FT 1921 for familien.
* **Avisspor, ikke læst** (Mediestream, teksten er spærret): træf på Ole i Fredericia Dagblad 11. og 12. marts 2002 (før dødsdagen, altså ikke dødsannoncer) og mulig dødsannonce for Tage i Viborg Stifts Folkeblad 3. december 1999.
* **Mors side:** Én kandidat til Helmuth, Helmut Sørensen, født 9. januar 1914 i Haderslev (FT 1921, Slotsgade 23). Ikke bevist og ikke koblet til nogen.
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

1. **Jespers dåbs eller navneattest** er nu den vigtigste kilde. Den bekræfter Ole og Dorthe Merete, og derefter kan hele fars side bekræftes med det samme.
2. **Oles død** 14. marts 2002 på Vejle Sygehus kendes fra Jesper. Mangler en skriftlig kilde (dødsattest eller dødsannonce efter 14. marts 2002).
3. **Tage og Elses død og gravsted.**
4. **Dorthe Meretes dåb 1945** i Sønderjylland. Nævner Helmuth og Anna Sørensen. Husk de sønderjyske regler.
5. **Helmuth og Anna Sørensen** i FT 1940 i Haderslev. Tjek kandidaten Helmut, født 9. januar 1914.
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
