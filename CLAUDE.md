# Retningslinjer for Claude i dette repo

**Læs `OVERDRAGELSE.md` først.** Den indeholder alle aftaler, familiens status, udført forskning og næste skridt.

Dette er et slægtsforskningsprojekt for ejeren af repoet. Hjemmesiden ligger i `docs/` og udgives med GitHub Pages. Alle data ligger i `docs/data/`. Se `README.md` for dataformatet.

## Forskningsregler (skal altid følges)

* Personerne i træet er kun den direkte linje bagud fra rodpersonen (anenummer 1).
* Søskende til personer i linjen noteres i feltet `soeskende` på personen (vises på personsiden). Fætre og kusiner registreres ikke. Søskende uden kendt dødsdato og født for under 100 år siden får kun navn.
* Gå kun et led videre fra en person, der er fundet i en primærkilde. Nye aner får status `under undersøgelse`, indtil hele kæden fra rodpersonen er bekræftet.
* Jesper har bedt om at holde forskningen tæt på hans linje. Prioritér de nærmeste led (forældre, bedsteforældre, oldeforældre): dødsfald, gravsteder, erhverv, bopæle og bekræftelse af kæden. Gå ikke længere bagud eller bredere ud, før Jesper beder om det.
* Hver ane har en sikkerhedsgrad (`sikkerhed`: høj, middel eller lav) med forklaring i `sikkerhedTekst`. Høj og middel kan bekræftes, lav kan ikke.
* Sæt aldrig status til `bekræftet` uden mindst én primærkilde og en konkret begrundelse i `bevis`. Begrundelsen skal forklare, hvorfor netop denne person er forælder til barnet i linjen (navne, alder, sted, faddere, folketælling i samme husstand).
* Opfind aldrig personer, datoer eller kilder. Usikre fund skrives i forskningsloggen, ikke som fakta.
* Nulevende personer må have datoer og steder i datafilerne, også med dag, men siden viser kun måned og år (privatliv "måned og år" i `projekt.json`). Afdøde vises med fuld dato. Nulevende, og personer hvor det er uvist om de lever (ingen død eller begravelse registreret og ældste kendte årstal under 100 år tilbage), vises kun med måned og år. Datafilerne må indeholde den fulde dato. Billeder af nulevende kræver Jespers tilladelse. Repoet er offentligt, så alt i datafilerne kan læses af alle.
* Hver forskningsindsats noteres i `docs/data/forskning.json` under `log`, også når intet blev fundet. Link mest muligt ud af siden: giv logposter `kilder` (id'er) og `links` (tekst og url, fx Mediestream, arkiv.dk, gravstedsregistre), og giv alle kilder en `url`, når der findes en.
* Kør `node scripts/valider.mjs` før hver commit.
* Kør `node scripts/version.mjs` efter ændringer i `app.js` eller `style.css`, så browsere henter de nye filer.
* Arbejd kun på grenen `main`. Siden udgives fra `main`.

## Familieoplysninger og tomme pladser

* Status `spor` bruges til navne, der kun kendes fra familien. Et spor må registreres, når barnet findes, men undersøges først, når barnet er bekræftet. Forældre til et spor kan kun være spor.
* Der bruges ingen fiktive eller opdigtede personer. Tomme pladser i træet vises som "P.t. ukendt". Jesper har bedt om, at alt fiktivt indhold er fjernet.

## Sprog og stil

Al tekst er på dansk. Brug aldrig tankestreg (em dash). Undgå semikolon og bindestreg i tekst, brug punktum eller komma. Det gælder også commit beskeder og JavaScript, som er skrevet uden semikolon.

Når en opgave er helt færdig, skal svaret til Jesper altid slutte med et link til siden: https://qvisty.github.io/Slaegt/
