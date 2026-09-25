# Slægten

Slægtsforskning i den direkte linje, udgivet som hjemmeside med GitHub Pages.

Hjemmesiden har oversigt, anetavle, viftediagram, persongalleri, personsider med kilder, tidslinje med danmarkshistorie, kort med livsruter, kildeoversigt og en forskningsside med næste skridt, opgaver, folketællingstjek og forskningslog.

## Arbejdsregler

1. **Kun den direkte linje.** Rodpersonen og derefter forældre, bedsteforældre og så videre bagud. Søskende og sidelinjer registreres ikke som personer.
2. **Et led ad gangen.** En persons forældre undersøges først, når personen selv er bekræftet.
3. **Bekræftet kræver bevis.** Mindst én primærkilde og en skriftlig begrundelse i feltet `bevis`.
4. **Uafhængig støtte.** Forældreskabet støttes helst af en kilde mere, fx folketælling, konfirmation eller vielse.
5. **Modstrid løses først.** Personen forbliver under undersøgelse, indtil kilderne stemmer.

Reglerne håndhæves af `scripts/valider.mjs`, som kører automatisk før hver udgivelse. Bryder data reglerne, bliver siden ikke opdateret.

## Privatliv

Repoet er **offentligt**, og det er hjemmesiden også. Derfor gælder:

* Nulevende personer markeres med `"levende": true` og må kun have navn. Datoer, steder og billeder afvises af tjekket.
* Vil du have mere privatliv, kan repoet gøres privat. GitHub Pages fra et privat repo kræver et betalt GitHub abonnement.

## Sæt udgivelsen op (én gang)

1. Gå til repoets **Settings**, derefter **Pages**.
2. Vælg **GitHub Actions** under *Build and deployment*, *Source*.
3. Næste ændring på standardgrenen udgiver siden. Adressen bliver `https://qvisty.github.io/Slaegt/`.

## Filer

| Fil | Indhold |
| --- | --- |
| `docs/data/projekt.json` | Titel, beskrivelse og privatlivsindstilling |
| `docs/data/personer.json` | Personerne i linjen |
| `docs/data/steder.json` | Steder med koordinater til kortet |
| `docs/data/kilder.json` | Kilder |
| `docs/data/forskning.json` | Opgaver og forskningslog |
| `docs/data/historie.json` | Begivenheder i danmarkshistorien til tidslinjen |
| `docs/billeder/` | Portrætter og scannede dokumenter |

## Anenumre

Hver person har et anenummer. Rodpersonen er 1. Far til person *n* er 2*n*, mor er 2*n* + 1. Far er altså 2, mor er 3, farfar 4, farmor 5, morfar 6, mormor 7 og så videre. Lige numre er mænd, ulige numre er kvinder.

## Eksempel på en person

```json
{
  "anenummer": 4,
  "fornavne": "Peder",
  "efternavn": "Jensen",
  "koen": "m",
  "status": "bekræftet",
  "navnevarianter": ["Peder Jensen Møller"],
  "portraet": "billeder/4.jpg",
  "bevis": "Døbt i Vium 1890 som søn af ... Samme forældre ses i folketællingen 1901 med alder og fødested, der stemmer.",
  "kilder": ["ft1901-vium"],
  "haendelser": [
    { "type": "dåb", "dato": "1890-02-10", "sted": "vium", "kilder": ["kb-vium-1890"] },
    { "type": "folketælling", "dato": "1901", "sted": "vium", "kilder": ["ft1901-vium"] },
    { "type": "erhverv", "dato": "1920", "sted": "randers", "beskrivelse": "Arbejdsmand" },
    { "type": "vielse", "dato": "1915-05-02", "sted": "randers" },
    { "type": "død", "dato": "ca. 1955", "sted": "skive" }
  ],
  "biografi": "Fri tekst. Blanke linjer giver nye afsnit.",
  "noter": ""
}
```

* **status:** `bekræftet` eller `under undersøgelse`.
* **dato:** `1890`, `1890-02`, `1890-02-10`, eller med `ca.`, `før`, `efter` foran.
* **type:** fødsel, dåb, konfirmation, vielse, folketælling, bopæl, flytning, erhverv, militær, udvandring, død, begravelse, skifte, andet.
* **vielse** registreres hos manden og vises automatisk hos hustruen.

Kilde:

```json
{ "id": "kb-vium-1890", "titel": "Kirkebog, Vium Sogn, fødte drenge 1890", "type": "Kirkebog", "arkiv": "Rigsarkivet, Arkivalieronline", "reference": "Opslag 45, nr. 3", "url": "https://...", "kvalitet": "primær" }
```

`kvalitet` er `primær` (samtidig kilde, fx kirkebog eller folketælling), `sekundær` (senere kilde, fx slægtsbog) eller `afledt` (afskrift eller database).

Sted:

```json
{ "id": "vium", "navn": "Vium", "sogn": "Vium Sogn", "herred": "Fjends Herred", "amt": "Viborg Amt", "lat": 56.47, "lng": 9.18 }
```

## Se siden lokalt

```sh
node scripts/valider.mjs
cd docs && python3 -m http.server 8000
```

Åbn derefter http://localhost:8000.
