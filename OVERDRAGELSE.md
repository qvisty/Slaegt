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
5. **Fiktive eksempler.** Jesper har bedt om, at tomme pladser i træet fyldes op med opdigtede personer, tydeligt markeret med `"fiktiv": true` og mærket Fiktiv. De fjernes, efterhånden som rigtige aner findes på deres pladser. Siden har en knap til at skjule dem.
6. **Privatliv.** Repoet og siden er offentlige. Nulevende personer (Jesper og hans mor) får kun navn. Ingen fødselsdatoer, steder eller billeder af nulevende i repoet. Jespers mors fødselsdato kendes, men må ikke skrives i repoet.
7. **Kun grenen `main`.** Jesper har givet lov til commit, merge og push direkte på `main`. Lav ikke andre grene og ikke pull requests.
8. **Forsiden er stamtræet** med klikbare personer. README er kun teknisk og må ikke være det, besøgende ser.
9. **Log alt.** Hver forskningsindsats skrives i `docs/data/forskning.json` under `log`, også når intet blev fundet, og også fejlmatch.

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
| 2 | Ole Gravlev Qvist | under undersøgelse | Far. Født 24. juli 1950. Død, dato og sted ukendt. Slægten fra Viborg. Fødesogn ukendt. |
| 3 | Dorthe Merete Qvist, født Sørensen | under undersøgelse | Mor. Nulevende, født 1945. Slægten fra Sønderjylland. |
| 4 | Tage Qvist | spor | Farfar. Fuldt navn Tage Clemmen Clemmensen Qvist. Født 10. juni 1924 i Viborg (FT 1930). |
| 5 | Else Qvist | spor | Farmor. Boede i Viborg. Pigenavn ukendt. |
| 6 | Helmuth Sørensen | spor | Morfar. Boede i Haderslev. (Blev først fejlagtigt skrevet som Sønderborg. Rettet.) |
| 7 | Anna Sørensen | spor | Mormor. Boede i Haderslev. |
| 8 | Gerner Qvist | spor | Oldefar, far til Tage. Gerner Clemmen Clemmensen Qvist. Født 23. marts 1890 i Skælskør, gift 1919, død 15. december 1953. |
| 9 | Helga Margrethe Qvist | spor | Oldemor, mor til Tage. Født 28. december 1896 i Viborg, død 10. maj 1991. Pigenavn ukendt. |

Gerner og Helga ligger i samme gravsted på Viborg Kirkegård, foto Viborg_K165 hos DK-gravsten. Fundet af Jesper ved søgning på Qvist på https://www.dk-gravsten.dk/kirkeg/Viborg.php. De øvrige navne i den søgning (Emil Qvist, Ib Qvistgaard, Villy Clemmen Clemmensen Qvist og Nina Qvist) er **ikke** i linjen.

Fiktive eksempler står lige nu på anenumrene 10 til 15, 24, 25 og 48 (farmors forældre og hele mors side fra generation 3). Ingen fiktive personer på farfars side længere.

## 5. Forskning udført indtil nu

* **Websøgning** på Ole Gravlev Qvist, Tage og Else Qvist, Helmuth Sønderborg (forkert navn), Gerner Qvist og Tage Gerner Qvist. Ingen brugbare træf.
* **Fejlmatch, afvist:** Landsholdsmålmanden Ole Qvist fra KB er født 25. februar 1950 i København og lever. Han er **ikke** Jespers far. Et søgeresumé påstod, at han også hed "Ole Gravlev Qvist". Det stod ikke i kilderne og er forkert. Brug ham aldrig som match.
* **Gravsten** for Gerner og Helga fundet (se ovenfor).
* **Folketællingen 1930 fundet** i Dansk Demografisk Database (ddd.dda.dk, åben søgning uden login). Viborg Købstad, Søtorps Forlængelse, husstand 3395, opslag 7085: Gerner Clemmen Clemmensen Qvist, hustru Helga Margrethe og fem børn, heriblandt Tage (født 10. juni 1924 i Viborg). Datoerne stemmer med gravstenen. Kilden `ft1930-viborg-3395` er en indtastning (afledt). Originalen bør ses.
* **Folketællingen 1901** (Skælskør, husstand 245): Gerner som barn hos slagtermester Ludvig Valdemar Qvist (født 27. juni 1859) og Johanne Marie Qvist, født Møller (født 7. februar 1864). Kun i loggen, ikke oprettet som personer, fordi Gerner er et spor.
* **1921, 1925 og 1940** er ikke indtastet i DDD for Viborg Købstad. Danish Family Search kræver login, og MyHeritage blokerer automatiske opslag.
* **Tip til søgning:** DDD kan søges direkte med `curl` mod `https://ddd.dda.dk/asp/soeg_amter.asp` (felterne `operator=3`, `navn`, `amt`, `kilde`) og detaljer med `https://ddd.dda.dk/asp/alle_opl.asp` (felterne `amt`, `indtastningsnr`, `lbnr`).
* **Den tidligere samtale havde ikke adgang** til arkiverne. Almindelig websøgning virkede, men disse domæner var blokeret: arkivalieronline.rigsarkivet.dk, danishfamilysearch.dk, dk-gravsten.dk, slaegt.dk og qvisty.github.io.

## 6. Næste skridt i forskningen

I rækkefølge efter reglerne:

1. **Bekræft Ole og Dorthe Merete.** Bedste kilde er Jespers fødsels og dåbsattest fra borger.dk. Den nævner begge forældre.
2. **Oles fødsel 1950** i kirkebogen. Fødesognet skal findes først. Dåbsindførslen nævner forældrene, altså Tage og Else og Elses pigenavn.
3. **Folketællingen 1930 er fundet** og binder Tage til Gerner og Helga. Mangler: originalen (opslag 7085) og FT 1921, 1925 og 1940, som skal findes på Danish Family Search eller Arkivalieronline.
4. **Gerner som barn** er fundet i FT 1901 i Skælskør med forældrene. Hans dåb i 1890 står i kirkebogen for Skælskør. Forældrene undersøges først, når Gerner er bekræftet.
5. **Dorthe Meretes dåb 1945** i Sønderjylland. Nævner Helmuth og Anna Sørensen. Husk de sønderjyske regler: borgerlig registrering fra 1874, fortsat efter 1920.
6. **Helmuth og Anna Sørensen** i folketællingen 1940 i Haderslev og deres gravsted. Er Helmuth født før 1920, er han født under tysk styre, og fødslen kan stå i det tyske standesamtsregister.
7. **Gravsteder** for Tage, Else og Ole. Søg Qvist i hele landet på DK-gravstens avancerede søgning og på Find gravsted.

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
* **Statusværdier:** `bekræftet`, `under undersøgelse`, `spor`. Plus `"fiktiv": true` for eksempler og `"levende": true` for nulevende.
* **Kildekvalitet:** `primær`, `sekundær`, `afledt`.
* **Tjek:** `node scripts/valider.mjs` håndhæver reglerne (kæden af bekræftede aner, primærkilder, privatliv, plausible aldre, fiktive regler). Kør før hver commit.
* **Versionsnummer:** `node scripts/version.mjs` efter ændringer i `app.js` eller `style.css`, ellers kan browsere vise en gammel version.
* **Udgivelse:** GitHub Pages med "Deploy from a branch". En `index.html` i roden sender videre til `docs/`, så siden virker, uanset om Pages peger på roden eller `/docs`. GitHub Actions (`.github/workflows/udgiv.yml`) kører kun tjekket.
* **Test lokalt:** `cd docs && python3 -m http.server 8000`. Chromium og Playwright kan bruges til skærmbilleder.
* **Den gamle gren** `claude/genealogy-github-pages-wevif7` findes stadig på GitHub, fordi den tidligere samtale ikke havde lov til at slette grene. Jesper kan slette den under Branches.

## 9. Arbejdsgang når Jesper sender et fund

1. Læs skærmbilledet omhyggeligt. Oversæt gammel håndskrift og tysk tekst.
2. Vurder om kilden beviser noget, og hvad. Skriv det i loggen.
3. Opret eller opdater kilden i `kilder.json` med arkiv, reference eller opslagsnummer og link.
4. Opdater personen i `personer.json`. Sæt kun `bekræftet`, hvis reglerne er opfyldt, og skriv begrundelsen i `bevis`.
5. Når en person bliver bekræftet, må forældrene oprettes eller opgraderes fra `spor` til `under undersøgelse`. Fjern fiktive personer på pladser, hvor rigtige aner nu findes, og fjern ubrugte fiktive kilder.
6. Kør tjekket, commit på dansk, push til `main`, og fortæl Jesper kort hvad næste skridt er.

## 10. Forslag til første besked i den nye samtale

> Læs OVERDRAGELSE.md og CLAUDE.md i repoet qvisty/Slaegt og fortsæt slægtsforskningen. Start med at søge efter Gerner Qvist i folketællingerne 1921 til 1940 og fortæl mig, hvad du finder.
