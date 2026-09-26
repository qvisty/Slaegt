#!/usr/bin/env node
// Validerer slægtsdata i docs/data mod projektets arbejdsregler.
// Kør med: node scripts/valider.mjs
// Afslutter med fejlkode 1, hvis der er fejl. Advarsler stopper ikke udgivelsen.

import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const rod = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'data')
const fejl = []
const advarsler = []

function laes (fil, standard) {
  try {
    return JSON.parse(readFileSync(join(rod, fil), 'utf8'))
  } catch (e) {
    if (e.code === 'ENOENT') return standard
    fejl.push(fil + ': kan ikke læses som JSON. ' + e.message)
    return standard
  }
}

const projekt = laes('projekt.json', {})
const personer = laes('personer.json', [])
const steder = laes('steder.json', [])
const kilder = laes('kilder.json', [])
const forskning = laes('forskning.json', { opgaver: [], log: [] })
const historie = laes('historie.json', [])

const STATUS = ['bekræftet', 'under undersøgelse', 'spor']
const TYPER = ['fødsel', 'dåb', 'konfirmation', 'vielse', 'folketælling', 'bopæl', 'flytning', 'erhverv', 'militær', 'udvandring', 'død', 'begravelse', 'skifte', 'andet']
const KVALITET = ['primær', 'sekundær', 'afledt']
const PRIVATLIV = ['skjul', 'kun navn', 'måned og år', 'vis alt']
const DATO = /^(ca\.|omkring|før|efter)?\s*(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?$/i

function datoOk (s) {
  if (s == null || s === '') return true
  const m = String(s).trim().match(DATO)
  if (!m) return false
  if (m[3] && (+m[3] < 1 || +m[3] > 12)) return false
  if (m[4] && (+m[4] < 1 || +m[4] > 31)) return false
  return true
}

function aar (s) {
  const m = s && String(s).trim().match(DATO)
  return m ? +m[2] : null
}

function relation (n) {
  if (n === 1) return 'rodpersonen'
  const ord = n.toString(2).slice(1).split('').map(b => b === '0' ? 'far' : 'mor')
  if (ord.length === 1) return ord[0]
  let s = ord[0] + ord[1]
  for (let i = 2; i < ord.length; i++) s += 's ' + ord[i]
  return s
}

for (const [navn, v] of [['personer.json', personer], ['steder.json', steder], ['kilder.json', kilder], ['historie.json', historie]]) {
  if (!Array.isArray(v)) fejl.push(navn + ': skal være en liste')
}

const privat = (projekt.privatliv && projekt.privatliv.levende) || 'kun navn'
if (!PRIVATLIV.includes(privat)) fejl.push('projekt.json: privatliv.levende skal være en af ' + PRIVATLIV.join(', '))

// Steder
const S = new Map()
for (const s of Array.isArray(steder) ? steder : []) {
  if (!s.id) { fejl.push('steder.json: et sted mangler id'); continue }
  if (S.has(s.id)) fejl.push('steder.json: id "' + s.id + '" findes flere gange')
  S.set(s.id, s)
  if (!s.navn) fejl.push('Sted ' + s.id + ': mangler navn')
  if ((s.lat == null) !== (s.lng == null)) fejl.push('Sted ' + s.id + ': angiv både lat og lng')
  if (s.lat != null && (typeof s.lat !== 'number' || s.lat < -90 || s.lat > 90)) fejl.push('Sted ' + s.id + ': ugyldig lat')
  if (s.lng != null && (typeof s.lng !== 'number' || s.lng < -180 || s.lng > 180)) fejl.push('Sted ' + s.id + ': ugyldig lng')
  if (s.lat == null) advarsler.push('Sted ' + s.id + ' (' + s.navn + '): mangler koordinater og vises ikke på kortet')
}

// Kilder
const K = new Map()
for (const k of Array.isArray(kilder) ? kilder : []) {
  if (!k.id) { fejl.push('kilder.json: en kilde mangler id'); continue }
  if (K.has(k.id)) fejl.push('kilder.json: id "' + k.id + '" findes flere gange')
  K.set(k.id, k)
  if (!k.titel) fejl.push('Kilde ' + k.id + ': mangler titel')
  if (!KVALITET.includes(k.kvalitet)) fejl.push('Kilde ' + k.id + ': kvalitet skal være en af ' + KVALITET.join(', '))
}

// Personer
const P = new Map()
for (const p of Array.isArray(personer) ? personer : []) {
  const n = p.anenummer
  if (!Number.isInteger(n) || n < 1) { fejl.push('personer.json: ugyldigt anenummer ' + JSON.stringify(n)); continue }
  if (P.has(n)) fejl.push('Anenummer ' + n + ' findes flere gange')
  P.set(n, p)
}

const brugteKilder = new Set()
const brugteSteder = new Set()

// En person er dokumenteret, når den er bekræftet eller har mindst én primærkilde.
function dokumenteret (p) {
  if (!p) return false
  if (p.status === 'bekræftet') return true
  const ids = [...(p.kilder || []), ...(p.haendelser || []).flatMap(h => h.kilder || [])]
  return ids.some(id => K.get(id) && K.get(id).kvalitet === 'primær')
}

for (const [n, p] of P) {
  const hvem = 'Anenr. ' + n + ' (' + ([p.fornavne, p.efternavn].filter(Boolean).join(' ') || relation(n)) + ')'
  if (!STATUS.includes(p.status)) fejl.push(hvem + ': status skal være "bekræftet", "under undersøgelse" eller "spor"')
  if (n > 1 && p.koen && p.koen !== (n % 2 === 0 ? 'm' : 'k')) fejl.push(hvem + ': køn passer ikke med anenummeret. Lige numre er mænd, ulige er kvinder')

  // Kerneregel: kun et led ad gangen fra en ane, der er fundet i en primærkilde.
  // Et spor (familieoplysning) kræver kun, at barnet findes.
  if (n > 1) {
    const barn = P.get(n >> 1)
    if (!barn) fejl.push(hvem + ': barnet (anenr. ' + (n >> 1) + ') er ikke registreret. Den direkte linje skal være ubrudt')
    else if (p.status !== 'spor' && !dokumenteret(barn)) fejl.push(hvem + ': barnet (anenr. ' + (n >> 1) + ') er ikke fundet i en primærkilde. Forælderen kan højst registreres som spor')
    else if (p.status === 'bekræftet' && barn.status !== 'bekræftet') fejl.push(hvem + ': kan ikke være bekræftet, før barnet (anenr. ' + (n >> 1) + ') er bekræftet')
  }

  const ids = new Set(p.kilder || [])
  for (const h of p.haendelser || []) {
    if (!TYPER.includes(h.type)) fejl.push(hvem + ': ukendt hændelsestype "' + h.type + '"')
    if (!datoOk(h.dato)) fejl.push(hvem + ': ugyldig dato "' + h.dato + '". Brug fx 1890, 1890-03, 1890-03-12 eller ca. 1890')
    if (h.sted) { brugteSteder.add(h.sted); if (!S.has(h.sted)) fejl.push(hvem + ': stedet "' + h.sted + '" findes ikke i steder.json') }
    for (const id of h.kilder || []) ids.add(id)
    if (h.type === 'vielse' && n > 1 && n % 2 === 1 && P.has(n - 1) && (P.get(n - 1).haendelser || []).some(x => x.type === 'vielse')) {
      advarsler.push(hvem + ': vielsen er registreret hos begge ægtefæller. Registrér den kun hos manden')
    }
  }
  for (const id of ids) {
    brugteKilder.add(id)
    if (!K.has(id)) fejl.push(hvem + ': kilden "' + id + '" findes ikke i kilder.json')
  }
  const graense = new Date().getFullYear() - 100
  for (const b of p.soeskende || []) {
    const bh = hvem + ', søskende ' + (b.navn || '?')
    if (!b.navn) fejl.push(hvem + ': en søskende mangler navn')
    for (const id of b.kilder || []) { brugteKilder.add(id); if (!K.has(id)) fejl.push(bh + ': kilden "' + id + '" findes ikke i kilder.json') }
    if (b.foedt && !datoOk(b.foedt)) fejl.push(bh + ': ugyldig fødselsdato')
    if (b.doed && !datoOk(b.doed)) fejl.push(bh + ': ugyldig dødsdato')
    const aar = b.foedt ? parseInt(String(b.foedt).match(/\d{4}/), 10) : null
    const kanLeve = !b.doed && !(aar && aar <= graense)
    if (kanLeve && (privat === 'kun navn' || privat === 'skjul') && (b.foedt || b.noter || b.sted)) fejl.push(bh + ': kan være nulevende. Kun navn, køn og kilder er tilladt')
  }
  if (p.fiktiv) fejl.push(hvem + ': fiktive personer bruges ikke længere i projektet')

  if (p.sikkerhed && !['høj', 'middel', 'lav'].includes(p.sikkerhed)) fejl.push(hvem + ': sikkerhed skal være høj, middel eller lav')
  if (p.status === 'bekræftet' && n > 1 && !p.sikkerhed) fejl.push(hvem + ': er bekræftet, men mangler en sikkerhedsgrad')
  if (p.status === 'bekræftet' && p.sikkerhed === 'lav') fejl.push(hvem + ': sikkerhed lav kan ikke være bekræftet')
  if (p.status === 'bekræftet') {
    if (!p.bevis || !String(p.bevis).trim()) fejl.push(hvem + ': er markeret bekræftet, men mangler en begrundelse i feltet "bevis"')
    const primaere = [...ids].filter(id => K.get(id) && K.get(id).kvalitet === 'primær')
    // Rodpersonen er projektets udgangspunkt og kræver ikke primærkilde
    if (!primaere.length && n > 1) fejl.push(hvem + ': er markeret bekræftet uden nogen primærkilde')
    else if (ids.size < 2 && n > 1) advarsler.push(hvem + ': er bekræftet på kun én kilde. Find gerne en uafhængig kilde mere')
  }

  // Privatliv. Repoet er offentligt, så data om nulevende må ikke ligge i filerne.
  if (p.levende && privat !== 'vis alt' && privat !== 'måned og år') {
    const detaljer = (p.haendelser || []).filter(h => h.dato || h.sted)
    if (detaljer.length) fejl.push(hvem + ': er nulevende, men har datoer eller steder registreret. De ville være offentlige i repoet. Fjern dem eller sæt privatliv til "vis alt"')
  }
  if (p.levende && privat !== 'vis alt' && (p.portraet || (p.billeder || []).length)) fejl.push(hvem + ': er nulevende, men har billeder registreret')

  // Plausibilitet mellem forælder og barn
  if (n > 1 && P.has(n >> 1)) {
    const f = foedt(p)
    const fb = foedt(P.get(n >> 1))
    if (f && fb) {
      const forskel = fb - f
      if (forskel < 12) fejl.push(hvem + ': er født ' + f + ', kun ' + forskel + ' år før barnet (' + fb + ')')
      else if (forskel > (n % 2 === 1 ? 55 : 75)) advarsler.push(hvem + ': er ' + forskel + ' år ældre end barnet. Tjek identifikationen')
    }
    const d = doedAar(p)
    if (d && fb && n % 2 === 1 && d < fb) fejl.push(hvem + ': moren er død før barnets fødsel')
    if (d && fb && n % 2 === 0 && d < fb - 1) fejl.push(hvem + ': faren er død mere end et år før barnets fødsel')
  }
}

function foedt (p) {
  const h = (p.haendelser || []).find(e => e.type === 'fødsel' && e.dato) || (p.haendelser || []).find(e => e.type === 'dåb' && e.dato)
  return h ? aar(h.dato) : null
}

function doedAar (p) {
  const h = (p.haendelser || []).find(e => e.type === 'død' && e.dato) || (p.haendelser || []).find(e => e.type === 'begravelse' && e.dato)
  return h ? aar(h.dato) : null
}

for (const id of K.keys()) if (!brugteKilder.has(id)) advarsler.push('Kilde ' + id + ' bruges ikke af nogen person')
for (const id of S.keys()) if (!brugteSteder.has(id)) advarsler.push('Sted ' + id + ' bruges ikke af nogen hændelse')

for (const l of forskning.log || []) {
  if (!datoOk(l.dato) || !l.dato) fejl.push('Forskningslog: ugyldig dato "' + l.dato + '" i "' + l.titel + '"')
  for (const n of l.personer || []) if (!P.has(n)) advarsler.push('Forskningslog "' + l.titel + '": anenr. ' + n + ' er ikke registreret')
}
for (const o of forskning.opgaver || []) {
  if (!o.titel) fejl.push('Opgaver: en opgave mangler titel')
  if (o.status && !['åben', 'i gang', 'venter', 'færdig'].includes(o.status)) fejl.push('Opgave "' + o.titel + '": status skal være åben, i gang, venter eller færdig')
}

const bekr = [...P.values()].filter(p => p.status === 'bekræftet').length
console.log('Personer: ' + P.size + ' (' + bekr + ' bekræftede). Kilder: ' + K.size + '. Steder: ' + S.size + '.')
for (const a of advarsler) console.log('  ADVARSEL  ' + a)
for (const f of fejl) console.log('  FEJL      ' + f)
if (fejl.length) {
  console.log('\n' + fejl.length + ' fejl. Ret dem, før data udgives.')
  process.exit(1)
}
console.log('Alt i orden.')
