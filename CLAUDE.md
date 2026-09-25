# Retningslinjer for Claude i dette repo

Dette er et slægtsforskningsprojekt for ejeren af repoet. Hjemmesiden ligger i `docs/` og udgives med GitHub Pages. Alle data ligger i `docs/data/`. Se `README.md` for dataformatet.

## Forskningsregler (skal altid følges)

* Undersøg kun den direkte linje bagud fra rodpersonen (anenummer 1). Ingen søskende, fætre eller sidelinjer som personer.
* Gå kun et led videre fra en person med status `bekræftet`. Forældre til en person under undersøgelse må ikke oprettes.
* Sæt aldrig status til `bekræftet` uden mindst én primærkilde og en konkret begrundelse i `bevis`. Begrundelsen skal forklare, hvorfor netop denne person er forælder til barnet i linjen (navne, alder, sted, faddere, folketælling i samme husstand).
* Opfind aldrig personer, datoer eller kilder. Usikre fund skrives i forskningsloggen, ikke som fakta.
* Nulevende personer får kun navn. Repoet er offentligt.
* Hver forskningsindsats noteres i `docs/data/forskning.json` under `log`, også når intet blev fundet.
* Kør `node scripts/valider.mjs` før hver commit.
* Arbejd kun på grenen `main`. Siden udgives fra `main`.

## Familieoplysninger og fiktive eksempler

* Status `spor` bruges til navne, der kun kendes fra familien. Et spor må registreres, når barnet findes, men undersøges først, når barnet er bekræftet. Forældre til et spor kan kun være spor.
* Personer og kilder med `"fiktiv": true` er opdigtede eksempler, som viser sidens funktioner. De vises med mærket Fiktiv, tælles ikke med i statistikken og er undtaget fra reglerne. En virkelig person må aldrig bruge en fiktiv kilde. Fiktive personer erstattes, efterhånden som de rigtige aner bliver fundet.

## Sprog og stil

Al tekst er på dansk. Brug aldrig tankestreg (em dash). Undgå semikolon og bindestreg i tekst, brug punktum eller komma. Det gælder også commit beskeder og JavaScript, som er skrevet uden semikolon.
