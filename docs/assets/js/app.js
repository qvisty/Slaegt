/* Slægten. Hovedprogram for hjemmesiden.
   Alle data ligger i mappen data/ som JSON. Personer identificeres ved anenummer:
   1 er rodpersonen, far til n er 2n og mor til n er 2n + 1. */

'use strict'

const D = {
  projekt: {},
  personer: [],
  steder: [],
  kilder: [],
  forskning: { opgaver: [], log: [] },
  historie: []
}
const P = new Map()
const S = new Map()
const K = new Map()

const MAANEDER = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december']
const FOLKETAELLINGER = [1787, 1801, 1834, 1840, 1845, 1850, 1855, 1860, 1870, 1880, 1890, 1901, 1906, 1911, 1916, 1921, 1925, 1930, 1940]
const TYPENAVNE = {
  'fødsel': 'Fødsel', 'dåb': 'Dåb', 'konfirmation': 'Konfirmation', 'vielse': 'Vielse',
  'folketælling': 'Folketælling', 'bopæl': 'Bopæl', 'flytning': 'Flytning', 'erhverv': 'Erhverv',
  'militær': 'Militær', 'udvandring': 'Udvandring', 'død': 'Død', 'begravelse': 'Begravelse',
  'skifte': 'Skifte', 'andet': 'Andet'
}
const IKONER = { 'fødsel': '*', 'dåb': '~', 'vielse': '∞', 'død': '†', 'begravelse': '⚱' }

/* Hjælpere */

function esc (v) {
  return String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function stort (s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : '' }

function gen (n) { return n.toString(2).length - 1 }

function side (n) {
  if (n === 1) return 'rod'
  return n.toString(2).charAt(1) === '0' ? 'far' : 'mor'
}

function sidenavn (s) { return s === 'far' ? 'Fars side' : s === 'mor' ? 'Mors side' : 'Rodperson' }

function relation (n) {
  if (n === 1) return D.projekt.rodBetegnelse || 'Mig'
  const ord = n.toString(2).slice(1).split('').map(b => b === '0' ? 'far' : 'mor')
  if (ord.length === 1) return stort(ord[0])
  let s = ord[0] + ord[1]
  for (let i = 2; i < ord.length; i++) s += 's ' + ord[i]
  return stort(s)
}

function generationsnavn (g) {
  const navne = ['Rodperson', 'Forældre', 'Bedsteforældre', 'Oldeforældre', 'Tipoldeforældre', 'Tiptipoldeforældre']
  return g < navne.length ? navne[g] : (g - 3) + ' x tipoldeforældre'
}

function parseDato (s) {
  if (!s) return null
  const m = String(s).trim().match(/^(ca\.|omkring|før|efter)?\s*(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?$/i)
  if (!m) return { tekst: String(s), sort: null, aar: null }
  const aar = +m[2]
  const md = m[3] ? +m[3] : null
  const dag = m[4] ? +m[4] : null
  let tekst = ''
  if (dag) tekst = dag + '. ' + MAANEDER[md - 1] + ' ' + aar
  else if (md) tekst = MAANEDER[md - 1] + ' ' + aar
  else tekst = String(aar)
  if (m[1]) tekst = m[1].toLowerCase() + ' ' + tekst
  const sort = aar + (md ? (md - 1) / 12 : 0) + (dag ? (dag - 1) / 372 : 0)
  return { tekst, sort, aar, usikker: !!m[1] }
}

function datoTekst (s) { const d = parseDato(s); return d ? d.tekst : '' }
function aarAf (s) { const d = parseDato(s); return d ? d.aar : null }

function privatlivsmode () { return (D.projekt.privatliv && D.projekt.privatliv.levende) || 'kun navn' }
function skjult (p) { return p.levende && privatlivsmode() === 'skjul' }
function visDetaljer (p) { return !p.levende || privatlivsmode() === 'vis alt' }

function fuldtNavn (p) {
  if (!p) return ''
  if (skjult(p)) return 'Levende person'
  const n = [p.fornavne, p.efternavn].filter(Boolean).join(' ').trim()
  return n || relation(p.anenummer)
}

function kortNavn (p) {
  if (skjult(p)) return 'Levende'
  const f = (p.kaldenavn || (p.fornavne || '').split(' ')[0] || '').trim()
  return [f, p.efternavn].filter(Boolean).join(' ') || relation(p.anenummer)
}

function initialer (p) {
  if (skjult(p)) return '?'
  const a = (p.fornavne || '').trim().charAt(0)
  const b = (p.efternavn || '').trim().charAt(0)
  return (a + b).toUpperCase() || '?'
}

function haendelser (p) {
  const egne = (p.haendelser || []).map(h => Object.assign({ fra: p.anenummer }, h))
  if (p.anenummer > 1 && !egne.some(h => h.type === 'vielse')) {
    const partner = P.get(p.anenummer ^ 1)
    if (partner) (partner.haendelser || []).filter(h => h.type === 'vielse').forEach(h => egne.push(Object.assign({ fra: partner.anenummer, laant: true }, h)))
  }
  return egne.sort((a, b) => {
    const x = parseDato(a.dato)
    const y = parseDato(b.dato)
    const xs = x && x.sort != null ? x.sort : 99999
    const ys = y && y.sort != null ? y.sort : 99999
    return xs - ys
  })
}

function foedt (p) {
  const h = p.haendelser || []
  return h.find(e => e.type === 'fødsel' && e.dato) || h.find(e => e.type === 'dåb' && e.dato) || null
}

function doed (p) {
  const h = p.haendelser || []
  return h.find(e => e.type === 'død' && e.dato) || h.find(e => e.type === 'begravelse' && e.dato) || null
}

function foedselsaar (p) { const f = foedt(p); return f ? aarAf(f.dato) : null }
function doedsaar (p) { const d = doed(p); return d ? aarAf(d.dato) : null }

function levetid (p) {
  if (!visDetaljer(p)) return p.levende ? 'Nulevende' : ''
  const f = foedt(p)
  const d = doed(p)
  const dele = []
  if (f) dele.push('* ' + (parseDato(f.dato).usikker ? datoTekst(f.dato) : aarAf(f.dato)))
  if (d) dele.push('† ' + (parseDato(d.dato).usikker ? datoTekst(d.dato) : aarAf(d.dato)))
  else if (!p.levende && f) dele.push('† ?')
  return dele.join('   ')
}

function stedNavn (id) {
  const s = S.get(id)
  return s ? s.navn : (id || '')
}

function stedLang (id) {
  const s = S.get(id)
  if (!s) return esc(id || '')
  const dele = [s.navn]
  if (s.sogn && s.sogn !== s.navn) dele.push(s.sogn)
  if (s.amt) dele.push(s.amt)
  return esc(dele.join(', '))
}

function statusMaerke (p) {
  if (p.status === 'bekræftet') return '<span class="maerke bekraeftet">Bekræftet</span>'
  return '<span class="maerke undersoeges">Under undersøgelse</span>'
}

function sideMaerke (n) {
  const s = side(n)
  return '<span class="maerke ' + s + '">' + esc(sidenavn(s)) + '</span>'
}

function portraet (p, klasse) {
  if (p.portraet && visDetaljer(p)) return '<img src="' + esc(p.portraet) + '" alt="' + esc(fuldtNavn(p)) + '" loading="lazy">'
  return '<div class="monogram ' + side(p.anenummer) + ' ' + (klasse || '') + '">' + esc(initialer(p)) + '</div>'
}

function erBekraeftet (n) { const p = P.get(n); return !!p && p.status === 'bekræftet' }

/* En plads i anetavlen er åben for forskning, hvis barnet er bekræftet. */
function pladsStatus (n) {
  if (P.has(n)) return P.get(n).status === 'bekræftet' ? 'bekraeftet' : 'undersoeges'
  if (n === 1) return 'aaben'
  return erBekraeftet(n >> 1) ? 'aaben' : 'laast'
}

function personer () { return D.personer.slice().sort((a, b) => a.anenummer - b.anenummer) }

function linkPerson (n, tekst) {
  return '<a href="#/person/' + n + '">' + esc(tekst != null ? tekst : fuldtNavn(P.get(n))) + '</a>'
}

function maksGen () { return D.personer.reduce((m, p) => Math.max(m, gen(p.anenummer)), 0) }

/* Indlæsning */

async function hent (fil, standard) {
  try {
    const r = await fetch('data/' + fil, { cache: 'no-cache' })
    if (!r.ok) return standard
    return await r.json()
  } catch (e) {
    console.warn('Kunne ikke læse', fil, e)
    return standard
  }
}

async function indlaes () {
  const res = await Promise.all([
    hent('projekt.json', {}),
    hent('personer.json', []),
    hent('steder.json', []),
    hent('kilder.json', []),
    hent('forskning.json', { opgaver: [], log: [] }),
    hent('historie.json', [])
  ])
  D.projekt = res[0] || {}
  D.personer = res[1] || []
  D.steder = res[2] || []
  D.kilder = res[3] || []
  D.forskning = Object.assign({ opgaver: [], log: [] }, res[4] || {})
  D.historie = res[5] || []
  D.personer.forEach(p => P.set(p.anenummer, p))
  D.steder.forEach(s => S.set(s.id, s))
  D.kilder.forEach(k => K.set(k.id, k))
}

/* Automatiske næste skridt ud fra reglen om kun at gå videre fra bekræftede aner */

function naesteSkridt () {
  const ud = []
  personer().forEach(p => {
    const n = p.anenummer
    if (p.status !== 'bekræftet') {
      const mangler = []
      if (!p.bevis) mangler.push('en begrundelse for identifikationen')
      const kilder = kildeIds(p)
      if (!kilder.some(id => K.get(id) && K.get(id).kvalitet === 'primær')) mangler.push('mindst én primærkilde')
      if (!foedt(p)) mangler.push('fødsel eller dåb')
      ud.push({ type: 'bekraeft', n, prioritet: gen(n), tekst: 'Bekræft ' + fuldtNavn(p) + ' (' + relation(n).toLowerCase() + ')', detalje: mangler.length ? 'Mangler ' + mangler.join(', ') + '.' : 'Gennemgå beviserne og sæt status til bekræftet.' })
    } else {
      [2 * n, 2 * n + 1].forEach(f => {
        if (!P.has(f)) ud.push({ type: 'find', n: f, prioritet: gen(f), tekst: 'Find ' + relation(f).toLowerCase(), detalje: (f % 2 === 0 ? 'Far' : 'Mor') + ' til ' + fuldtNavn(p) + '. Start i dåbsindførslen for ' + (p.fornavne || 'personen') + '.' })
      })
    }
  })
  return ud.sort((a, b) => (a.type === b.type ? 0 : a.type === 'bekraeft' ? -1 : 1) || a.prioritet - b.prioritet || a.n - b.n)
}

function kildeIds (p) {
  const ids = []
  const tilfoej = id => { if (id && !ids.includes(id)) ids.push(id) }
  ;(p.kilder || []).forEach(tilfoej)
  haendelser(p).forEach(h => (h.kilder || []).forEach(tilfoej))
  return ids
}

/* Sider */

function sideOversigt () {
  const alle = personer()
  const bekr = alle.filter(p => p.status === 'bekræftet')
  const unders = alle.filter(p => p.status !== 'bekræftet')
  const fodsler = alle.filter(visDetaljer).map(foedselsaar).filter(a => a)
  const aeldst = fodsler.length ? Math.min.apply(null, fodsler) : null
  const mg = maksGen()
  const titel = D.projekt.titel || 'Slægten'

  const h = []
  h.push('<h1>' + esc(titel) + '</h1>')
  if (D.projekt.beskrivelse) h.push('<p class="ingress">' + esc(D.projekt.beskrivelse) + '</p>')

  if (!alle.length) {
    h.push('<div class="tom-tilstand sektion"><h2>Projektet er klar</h2><p>Der er endnu ikke registreret nogen personer.<br>Første skridt er rodpersonen, altså dig selv, og derefter dine forældre.</p><p class="lille">Data ligger i <code>docs/data/personer.json</code>.</p></div>')
    return h.join('')
  }

  h.push('<div class="gitter gitter-4 sektion">')
  h.push(talKort(bekr.length, 'bekræftede aner'))
  h.push(talKort(unders.length, 'under undersøgelse'))
  h.push(talKort(mg + 1, mg === 0 ? 'generation' : 'generationer'))
  h.push(talKort(aeldst || '', 'ældste kendte fødselsår'))
  h.push(talKort(D.kilder.length, 'kilder registreret'))
  h.push('</div>')

  h.push('<div class="gitter gitter-2 sektion">')
  h.push('<section class="kort-flade"><h3>Fremdrift pr. generation</h3><p class="lille">Andel af mulige aner i hver generation, som er fundet.</p>')
  for (let g = 1; g <= Math.min(mg + 1, 12); g++) {
    const muligt = Math.pow(2, g)
    let ok = 0
    let vent = 0
    for (let n = muligt; n < muligt * 2; n++) {
      if (!P.has(n)) continue
      if (P.get(n).status === 'bekræftet') ok++
      else vent++
    }
    h.push('<div class="gen-raekke"><div class="navn">' + esc(generationsnavn(g)) + '</div><div class="bjaelke" role="img" aria-label="' + ok + ' bekræftede og ' + vent + ' under undersøgelse ud af ' + muligt + '"><span class="b-ok" style="width:' + (100 * ok / muligt) + '%"></span><span class="b-vent" style="width:' + (100 * vent / muligt) + '%"></span></div><div class="procent">' + ok + ' af ' + muligt + '</div></div>')
  }
  h.push('<div class="forklaring"><span><i style="background:var(--ok);border-color:var(--ok)"></i>Bekræftet</span><span><i style="background:var(--vent);border-color:var(--vent)"></i>Under undersøgelse</span></div>')
  h.push('</section>')

  const skridt = naesteSkridt().slice(0, 6)
  h.push('<section class="kort-flade"><div class="hoved-raekke"><h3>Næste skridt</h3><a class="lille" href="#/forskning">Alle opgaver</a></div>')
  h.push(skridt.length ? '<ul class="liste">' + skridt.map(skridtHtml).join('') + '</ul>' : '<p class="muted">Ingen åbne skridt lige nu.</p>')
  h.push('</section>')
  h.push('</div>')

  const log = (D.forskning.log || []).slice().sort((a, b) => String(b.dato).localeCompare(String(a.dato))).slice(0, 5)
  h.push('<div class="gitter gitter-2 sektion">')
  h.push('<section class="kort-flade"><div class="hoved-raekke"><h3>Seneste fra forskningen</h3><a class="lille" href="#/forskning">Forskningslog</a></div>')
  h.push(log.length ? '<ul class="liste">' + log.map(logHtml).join('') + '</ul>' : '<p class="muted">Forskningsloggen er tom.</p>')
  h.push('</section>')
  h.push('<section class="kort-flade"><h3>Den direkte linje</h3><p class="lille">Nærmeste aner. Klik for at se detaljer.</p><div class="foraeldre">')
  alle.filter(p => p.anenummer < 8).forEach(p => h.push(miniHtml(p.anenummer)))
  h.push('</div><p><a class="knap" href="#/anetavle">Se hele anetavlen</a> <a class="knap" href="#/galleri">Persongalleri</a></p></section>')
  h.push('</div>')
  return h.join('')
}

function talKort (v, t) { return '<div class="kort-flade tal"><div class="v">' + esc(v === '' ? '...' : v) + '</div><div class="t">' + esc(t) + '</div></div>' }

function skridtHtml (s) {
  const ikon = s.type === 'find' ? '<span class="ikon find">?</span>' : '<span class="ikon">!</span>'
  const titel = s.type === 'find' ? esc(s.tekst) : linkPerson(s.n, s.tekst)
  return '<li class="skridt">' + ikon + '<div><div><strong>' + titel + '</strong> <span class="lille">anenr. ' + s.n + '</span></div><div class="lille">' + esc(s.detalje) + '</div></div></li>'
}

function logHtml (l) {
  const pers = (l.personer || (l.anenummer ? [l.anenummer] : [])).filter(n => P.has(n)).map(n => linkPerson(n)).join(', ')
  const res = l.resultat ? ' <span class="maerke neutral">' + esc(l.resultat) + '</span>' : ''
  return '<li><div class="dato">' + esc(datoTekst(l.dato)) + (pers ? '  ·  ' + pers : '') + '</div><strong>' + esc(l.titel || '') + '</strong>' + res + (l.tekst ? '<div class="lille">' + esc(l.tekst) + '</div>' : '') + '</li>'
}

function miniHtml (n) {
  const p = P.get(n)
  if (!p) {
    const st = pladsStatus(n)
    return '<div class="mini tom"><div class="prik" style="background:var(--papir-2);color:var(--blaek-3)">?</div><div><div class="rel">' + esc(relation(n)) + '</div><div class="n muted">' + (st === 'aaben' ? 'Ikke fundet endnu' : 'Afventer bekræftelse af barnet') + '</div></div></div>'
  }
  const prik = p.portraet && visDetaljer(p) ? '<img src="' + esc(p.portraet) + '" alt="">' : esc(initialer(p))
  const farve = side(n)
  return '<a class="mini" href="#/person/' + n + '"><div class="prik" style="background:var(--' + farve + '-lys);color:var(--' + farve + ')">' + prik + '</div><div><div class="rel">' + esc(relation(n)) + '</div><div class="n">' + esc(fuldtNavn(p)) + '</div><div class="lille">' + esc(levetid(p)) + '</div></div></a>'
}

/* Anetavle som SVG */

function sideAnetavle (rodN) {
  const rod = P.has(rodN) ? rodN : 1
  const antalGen = Math.min(5, Math.max(3, maksGen() - gen(rod) + 2))
  const h = []
  h.push('<div class="hoved-raekke"><h1>Anetavle</h1><div class="knapgruppe"><a class="knap aktiv" href="#/anetavle">Anetavle</a><a class="knap" href="#/vifte">Viftediagram</a></div></div>')
  if (!D.personer.length) return h.join('') + tomData()
  h.push('<p class="ingress">Den direkte linje bagud' + (rod !== 1 ? ' fra <strong>' + esc(fuldtNavn(P.get(rod))) + '</strong> (' + esc(relation(rod).toLowerCase()) + ')' : '') + '. Klik på en person for detaljer. Klik på pilen yderst for at gå længere tilbage.</p>')
  if (rod !== 1) {
    const sti = []
    let n = rod
    while (n >= 1) { sti.unshift(n); n = n >> 1 }
    h.push('<div class="linje">' + sti.map(x => '<a href="#/anetavle/' + x + '">' + esc(kortNavn(P.get(x) || { anenummer: x })) + '</a>').join('<span class="pil">›</span>') + '</div>')
  }
  h.push(forklaring())
  h.push('<div class="diagram-ramme">' + anetavleSvg(rod, antalGen) + '</div>')
  return h.join('')
}

function forklaring () {
  return '<div class="forklaring">' +
    '<span><i style="background:var(--far-lys);border-color:var(--far)"></i>Fars side</span>' +
    '<span><i style="background:var(--mor-lys);border-color:var(--mor)"></i>Mors side</span>' +
    '<span><i style="background:var(--vent-lys);border-color:var(--vent);border-style:dashed"></i>Under undersøgelse</span>' +
    '<span><i style="background:transparent;border-color:var(--streg-2);border-style:dashed"></i>Kan undersøges nu</span>' +
    '<span><i style="background:transparent;border-color:var(--laast);border-style:dotted"></i>Låst, barnet er ikke bekræftet</span>' +
    '</div>'
}

function anetavleSvg (rod, antalGen) {
  const bw = 200
  const bh = 58
  const gx = 38
  const slots = Math.pow(2, antalGen - 1)
  const rh = 66
  const H = slots * rh + 20
  const W = antalGen * (bw + gx) + 30
  const ud = ['<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Anetavle">']
  const pos = {}
  for (let g = 0; g < antalGen; g++) {
    const antal = Math.pow(2, g)
    for (let i = 0; i < antal; i++) {
      const n = rod * antal + i
      const x = 10 + g * (bw + gx)
      const y = 10 + (i + 0.5) * (slots * rh / antal) - bh / 2
      pos[n] = { x, y }
    }
  }
  for (let g = 1; g < antalGen; g++) {
    const antal = Math.pow(2, g)
    for (let i = 0; i < antal; i++) {
      const n = rod * antal + i
      const barn = n >> 1
      if (!visPlads(n)) continue
      const a = pos[barn]
      const b = pos[n]
      const x1 = a.x + bw
      const y1 = a.y + bh / 2
      const x2 = b.x
      const y2 = b.y + bh / 2
      const mx = x1 + gx / 2
      ud.push('<path class="forbind" d="M' + x1 + ' ' + y1 + ' H' + mx + ' V' + y2 + ' H' + x2 + '"/>')
    }
  }
  Object.keys(pos).forEach(k => {
    const n = +k
    if (!visPlads(n)) return
    const { x, y } = pos[n]
    ud.push(boksSvg(n, x, y, bw, bh, gen(n) - gen(rod) === antalGen - 1))
  })
  ud.push('</svg>')
  return ud.join('')
}

function boksSvg (n, x, y, w, h, yderst) {
  const p = P.get(n)
  const st = pladsStatus(n)
  const sd = side(n)
  let fyld = 'var(--' + sd + '-lys)'
  let streg = 'var(--' + sd + ')'
  let stil = ''
  if (st === 'undersoeges') { fyld = 'var(--vent-lys)'; streg = 'var(--vent)'; stil = ' stroke-dasharray="5 3"' }
  if (st === 'aaben') { fyld = 'transparent'; streg = 'var(--streg-2)'; stil = ' stroke-dasharray="5 3"' }
  if (st === 'laast') { fyld = 'transparent'; streg = 'var(--laast)'; stil = ' stroke-dasharray="2 3"' }
  const rel = relation(n)
  const linjer = []
  if (p) {
    linjer.push('<text class="br" x="' + (x + 10) + '" y="' + (y + 16) + '">' + esc(rel.length > 28 ? 'Anenr. ' + n : rel) + '</text>')
    linjer.push('<text class="bn" x="' + (x + 10) + '" y="' + (y + 33) + '">' + esc(afkort(kortNavn(p), 24)) + '</text>')
    linjer.push('<text class="ba" x="' + (x + 10) + '" y="' + (y + 49) + '">' + esc(levetid(p)) + '</text>')
  } else {
    linjer.push('<text class="br" x="' + (x + 10) + '" y="' + (y + 16) + '">' + esc(rel.length > 28 ? 'Anenr. ' + n : rel) + '</text>')
    linjer.push('<text class="ba" x="' + (x + 10) + '" y="' + (y + 38) + '">' + (st === 'aaben' ? 'Kan undersøges nu' : 'Låst') + '</text>')
  }
  const titel = '<title>' + esc((p ? fuldtNavn(p) + '. ' : '') + rel + '. Anenummer ' + n) + '</title>'
  let pil = ''
  if (yderst && p && (P.has(2 * n) || P.has(2 * n + 1) || pladsStatus(2 * n) === 'aaben')) {
    pil = '<a href="#/anetavle/' + n + '" aria-label="Gå videre tilbage fra ' + esc(fuldtNavn(p)) + '"><circle cx="' + (x + w + 14) + '" cy="' + (y + h / 2) + '" r="11" fill="var(--blaek)"/><text x="' + (x + w + 14) + '" y="' + (y + h / 2 + 4) + '" text-anchor="middle" font-size="13" fill="var(--papir)">›</text></a>'
  }
  const rect = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="8" fill="' + fyld + '" stroke="' + streg + '"' + stil + '/>'
  if (p) return '<a class="boks" href="#/person/' + n + '">' + titel + rect + linjer.join('') + '</a>' + pil
  return '<g class="boks laast">' + titel + rect + linjer.join('') + '</g>'
}

/* Låste pladser vises kun, hvis barnet findes. Ellers bliver tavlen uoverskuelig. */
function visPlads (n) {
  return P.has(n) || n === 1 || pladsStatus(n) === 'aaben' || P.has(n >> 1)
}

function afkort (s, max) { return s.length > max ? s.slice(0, max - 1) + '…' : s }

/* Viftediagram */

function sideVifte () {
  const h = []
  h.push('<div class="hoved-raekke"><h1>Viftediagram</h1><div class="knapgruppe"><a class="knap" href="#/anetavle">Anetavle</a><a class="knap aktiv" href="#/vifte">Viftediagram</a></div></div>')
  if (!D.personer.length) return h.join('') + tomData()
  h.push('<p class="ingress">Hele den direkte linje på én gang. Fars side til venstre, mors side til højre. Hver ring er en generation.</p>')
  h.push(forklaring())
  h.push('<div class="diagram-ramme vifte">' + vifteSvg() + '</div>')
  return h.join('')
}

function vifteSvg () {
  const antalGen = Math.min(8, Math.max(4, maksGen() + 2))
  const r0 = 70
  const ringe = [0, 90, 90, 90, 100, 110, 120, 120, 120]
  const radier = [r0]
  for (let g = 1; g < antalGen; g++) radier.push(radier[g - 1] + ringe[g])
  const R = radier[antalGen - 1]
  const W = 2 * R + 40
  const Hh = R + r0 + 40
  const cx = W / 2
  const cy = R + 20
  const ud = ['<svg viewBox="0 0 ' + W + ' ' + Hh + '" width="' + W + '" role="img" aria-label="Viftediagram">']
  const rod = P.get(1)
  ud.push('<a href="#/person/1"><circle cx="' + cx + '" cy="' + cy + '" r="' + (r0 - 4) + '" fill="var(--rod-lys)" stroke="var(--rod)"/><text class="vifte-tekst" x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="14" font-weight="600">' + esc(rod ? afkort(kortNavn(rod), 16) : 'Mig') + '</text><text class="vifte-tekst" x="' + cx + '" y="' + (cy + 14) + '" text-anchor="middle" font-size="11">' + esc(rod ? relation(1) : '') + '</text></a>')
  for (let g = 1; g < antalGen; g++) {
    const antal = Math.pow(2, g)
    const ri = radier[g - 1] + 2
    const ro = radier[g]
    for (let i = 0; i < antal; i++) {
      const n = antal + i
      const a0 = Math.PI + i * Math.PI / antal
      const a1 = a0 + Math.PI / antal
      const st = pladsStatus(n)
      const sd = side(n)
      let fyld = 'var(--' + sd + '-lys)'
      if (st === 'undersoeges') fyld = 'var(--vent-lys)'
      if (st === 'aaben') fyld = 'var(--papir-2)'
      if (st === 'laast') fyld = 'var(--papir)'
      const d = bue(cx, cy, ri, ro, a0, a1)
      const p = P.get(n)
      const titel = '<title>' + esc((p ? fuldtNavn(p) + '. ' : '') + relation(n) + '. Anenummer ' + n + (p ? '' : st === 'aaben' ? '. Kan undersøges nu' : '. Låst')) + '</title>'
      const seg = '<path class="vifte-seg" d="' + d + '" fill="' + fyld + '"' + (st === 'undersoeges' ? ' stroke="var(--vent)"' : '') + '>' + titel + '</path>'
      let tekst = ''
      if (p) {
        const am = (a0 + a1) / 2
        const rm = (ri + ro) / 2
        const tx = cx + rm * Math.cos(am)
        const ty = cy + rm * Math.sin(am)
        const buelaengde = rm * Math.PI / antal
        const grader = am * 180 / Math.PI
        const radial = buelaengde < 90
        const rot = radial ? (grader < 270 ? grader - 180 : grader - 360) : grader + 90 - 360
        const fs = g <= 2 ? 13 : g <= 4 ? 11 : 9.5
        const maks = radial ? Math.floor((ro - ri) / (fs * 0.56)) : Math.floor(buelaengde / (fs * 0.58))
        const navn = afkort(radial ? (p.fornavne || '').split(' ')[0] || kortNavn(p) : kortNavn(p), Math.max(4, maks))
        const aar = levetid(p)
        tekst = '<g transform="translate(' + tx.toFixed(1) + ' ' + ty.toFixed(1) + ') rotate(' + rot.toFixed(1) + ')"><text class="vifte-tekst" text-anchor="middle" font-size="' + fs + '" font-weight="600" y="' + (g <= 4 ? -2 : 3) + '">' + esc(navn) + '</text>' + (g <= 4 ? '<text class="vifte-tekst" text-anchor="middle" font-size="' + (fs - 2) + '" y="' + (fs + 1) + '" opacity=".75">' + esc(aar.replace(/\s+/g, ' ')) + '</text>' : '') + '</g>'
        ud.push('<a href="#/person/' + n + '">' + seg + tekst + '</a>')
      } else {
        ud.push(seg)
      }
    }
  }
  ud.push('</svg>')
  return ud.join('')
}

function bue (cx, cy, ri, ro, a0, a1) {
  const p = (r, a) => (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2)
  const stor = a1 - a0 > Math.PI ? 1 : 0
  return 'M' + p(ri, a0) + ' L' + p(ro, a0) + ' A' + ro + ' ' + ro + ' 0 ' + stor + ' 1 ' + p(ro, a1) + ' L' + p(ri, a1) + ' A' + ri + ' ' + ri + ' 0 ' + stor + ' 0 ' + p(ri, a0) + ' Z'
}

/* Persongalleri */

const galleriFilter = { tekst: '', side: 'alle', status: 'alle' }

function sideGalleri () {
  const h = []
  h.push('<h1>Persongalleri</h1>')
  if (!D.personer.length) return h.join('') + tomData()
  h.push('<p class="ingress">Alle personer i den direkte linje, ordnet efter generation.</p>')
  h.push('<div class="vaerktoej"><input type="search" id="g-soeg" placeholder="Søg navn, sted eller erhverv" value="' + esc(galleriFilter.tekst) + '" aria-label="Søg">')
  h.push('<label>Side <select id="g-side"><option value="alle">Begge sider</option><option value="far">Fars side</option><option value="mor">Mors side</option></select></label>')
  h.push('<label>Status <select id="g-status"><option value="alle">Alle</option><option value="bekræftet">Bekræftet</option><option value="under undersøgelse">Under undersøgelse</option></select></label></div>')
  h.push('<div id="g-resultat"></div>')
  return h.join('')
}

function tegnGalleri () {
  const boks = document.getElementById('g-resultat')
  if (!boks) return
  const q = galleriFilter.tekst.trim().toLowerCase()
  const liste = personer().filter(p => {
    if (galleriFilter.side !== 'alle' && p.anenummer !== 1 && side(p.anenummer) !== galleriFilter.side) return false
    if (galleriFilter.side !== 'alle' && p.anenummer === 1) return false
    if (galleriFilter.status !== 'alle' && (p.status || 'under undersøgelse') !== galleriFilter.status) return false
    if (!q) return true
    return soegetekst(p).includes(q)
  })
  if (!liste.length) { boks.innerHTML = '<p class="muted">Ingen personer matcher.</p>'; return }
  const grupper = new Map()
  liste.forEach(p => { const g = gen(p.anenummer); if (!grupper.has(g)) grupper.set(g, []); grupper.get(g).push(p) })
  const ud = []
  grupper.forEach((ps, g) => {
    ud.push('<div class="gen-overskrift"><h2>' + esc(generationsnavn(g)) + '</h2><span class="lille">Generation ' + g + '  ·  ' + ps.length + ' af ' + Math.pow(2, g) + '</span></div><div class="galleri">')
    ps.forEach(p => ud.push(personKort(p)))
    ud.push('</div>')
  })
  boks.innerHTML = ud.join('')
}

function soegetekst (p) {
  if (skjult(p)) return ''
  const dele = [fuldtNavn(p), p.kaldenavn, relation(p.anenummer), (p.navnevarianter || []).join(' ')]
  if (visDetaljer(p)) (p.haendelser || []).forEach(h => { dele.push(stedNavn(h.sted), h.beskrivelse) })
  return dele.filter(Boolean).join(' ').toLowerCase()
}

function personKort (p) {
  const n = p.anenummer
  const erhverv = visDetaljer(p) ? (p.haendelser || []).filter(h => h.type === 'erhverv').map(h => h.beskrivelse).filter(Boolean)[0] : ''
  return '<a class="pkort" href="#/person/' + n + '"><div class="foto">' + portraet(p) + '<span class="nr">' + n + '</span></div><div class="tekst"><div class="relation">' + esc(relation(n)) + '</div><div class="pnavn">' + esc(fuldtNavn(p)) + '</div><div class="aar">' + esc(levetid(p)) + '</div>' + (erhverv ? '<div class="lille">' + esc(erhverv) + '</div>' : '') + '<div class="maerker">' + statusMaerke(p) + (p.levende ? '<span class="maerke levende">Nulevende</span>' : '') + '</div></div></a>'
}

/* Personside */

function sidePerson (n) {
  const p = P.get(n)
  if (!p) {
    return '<h1>' + esc(relation(n)) + '</h1><div class="tom-tilstand"><p>Anenummer ' + n + ' er ikke fundet endnu.</p><p class="lille">' + (pladsStatus(n) === 'aaben' ? 'Barnet er bekræftet, så denne ane kan undersøges nu.' : 'Barnet skal bekræftes, før denne ane undersøges.') + '</p><p><a class="knap" href="#/anetavle">Til anetavlen</a></p></div>'
  }
  const vis = visDetaljer(p)
  const h = []
  const sti = []
  let x = n
  while (x >= 1) { sti.unshift(x); x = x >> 1 }
  if (sti.length > 1) h.push('<nav class="linje" aria-label="Slægtslinje">' + sti.map(k => k === n ? '<strong>' + esc(kortNavn(p)) + '</strong>' : linkPerson(k, kortNavn(P.get(k)))).join('<span class="pil">›</span>') + '</nav>')

  const kildeNr = new Map()
  const kildeRef = ids => (ids || []).filter(id => K.has(id)).map(id => {
    if (!kildeNr.has(id)) kildeNr.set(id, kildeNr.size + 1)
    return '<sup class="kref"><a href="#/kilde/' + encodeURIComponent(id) + '" title="' + esc(K.get(id).titel) + '">[' + kildeNr.get(id) + ']</a></sup>'
  }).join('')

  const f = foedt(p)
  const d = doed(p)
  h.push('<div class="person-top"><div class="foto">' + portraet(p) + '</div><div>')
  h.push('<div class="relation lille" style="text-transform:uppercase;letter-spacing:.06em;font-weight:600">' + esc(relation(n)) + '  ·  Anenummer ' + n + '  ·  Generation ' + gen(n) + '</div>')
  h.push('<h1>' + esc(fuldtNavn(p)) + '</h1>')
  h.push('<div style="display:flex;gap:6px;flex-wrap:wrap">' + statusMaerke(p) + (n > 1 ? sideMaerke(n) : '') + (p.levende ? '<span class="maerke levende">Nulevende</span>' : '') + '</div>')
  h.push('<dl class="faktaliste">')
  if (vis && f) h.push('<dt>' + (f.type === 'dåb' ? 'Døbt' : 'Født') + '</dt><dd>' + esc(datoTekst(f.dato)) + (f.sted ? ', ' + esc(stedNavn(f.sted)) : '') + '</dd>')
  if (vis && d) h.push('<dt>' + (d.type === 'begravelse' ? 'Begravet' : 'Død') + '</dt><dd>' + esc(datoTekst(d.dato)) + (d.sted ? ', ' + esc(stedNavn(d.sted)) : '') + '</dd>')
  if (vis) {
    const erh = (p.haendelser || []).filter(e => e.type === 'erhverv').map(e => e.beskrivelse).filter(Boolean)
    if (erh.length) h.push('<dt>Erhverv</dt><dd>' + esc(Array.from(new Set(erh)).join(', ')) + '</dd>')
  }
  if (p.navnevarianter && p.navnevarianter.length && !skjult(p)) h.push('<dt>Navneformer</dt><dd>' + esc(p.navnevarianter.join(', ')) + '</dd>')
  if (vis && f && d && aarAf(f.dato) && aarAf(d.dato)) h.push('<dt>Blev</dt><dd>ca. ' + (aarAf(d.dato) - aarAf(f.dato)) + ' år</dd>')
  h.push('</dl></div></div>')

  if (!vis) {
    h.push('<div class="sektion bevis mangler"><strong>Nulevende person.</strong> Datoer, steder og billeder vises ikke offentligt.</div>')
  }

  if (vis && p.biografi) h.push('<section class="sektion"><h2>Livshistorie</h2>' + p.biografi.split(/\n\s*\n/).map(a => '<p>' + esc(a) + '</p>').join('') + '</section>')

  if (vis) {
    const hs = haendelser(p)
    if (hs.length) {
      h.push('<section class="sektion"><h2>Livsforløb</h2><ul class="haendelser">')
      hs.forEach(e => {
        const partner = e.laant ? ' <span class="lille">(registreret hos ' + linkPerson(e.fra, kortNavn(P.get(e.fra))) + ')</span>' : ''
        h.push('<li><div><span class="htype">' + esc(TYPENAVNE[e.type] || stort(e.type)) + '</span>' + (e.dato ? '  <span class="hdato">' + esc(datoTekst(e.dato)) + '</span>' : '') + (e.sted ? '  <span class="hsted">· ' + stedLang(e.sted) + '</span>' : '') + kildeRef(e.kilder) + partner + '</div>' + (e.beskrivelse ? '<p class="hbesk">' + esc(e.beskrivelse) + '</p>' : '') + '</li>')
      })
      h.push('</ul></section>')
    }
  }

  if (!p.levende || privatlivsmode() !== 'skjul') {
    h.push('<section class="sektion"><h2>Bevis for slægtskabet</h2>')
    if (p.bevis) h.push('<div class="bevis"><p style="margin:0">' + esc(p.bevis) + kildeRef(p.kilder) + '</p></div>')
    else h.push('<div class="bevis mangler"><p style="margin:0">Der er endnu ikke skrevet en begrundelse for, at denne person er den rigtige. Status forbliver <em>under undersøgelse</em>, indtil beviset er på plads.</p></div>')
    h.push('</section>')
  }

  h.push('<section class="sektion"><h2>Forældre og barn i linjen</h2><div class="foraeldre">')
  h.push(miniHtml(2 * n))
  h.push(miniHtml(2 * n + 1))
  if (n > 1) h.push(miniHtml(n >> 1).replace('<div class="rel">', '<div class="rel">Barn i linjen · '))
  h.push('</div>')
  if (p.status !== 'bekræftet') h.push('<p class="lille">Forældrene undersøges først, når ' + esc(fuldtNavn(p)) + ' er bekræftet.</p>')
  h.push('</section>')

  if (vis && p.billeder && p.billeder.length) {
    h.push('<section class="sektion"><h2>Billeder og dokumenter</h2><div class="billedrække">')
    p.billeder.forEach(b => h.push('<figure><a href="' + esc(b.fil) + '" target="_blank" rel="noopener"><img src="' + esc(b.fil) + '" alt="' + esc(b.tekst || '') + '" loading="lazy"></a>' + (b.tekst ? '<figcaption>' + esc(b.tekst) + '</figcaption>' : '') + '</figure>'))
    h.push('</div></section>')
  }

  if (vis) {
    const ft = folketaellingsraekke(p)
    if (ft.length) {
      h.push('<section class="sektion"><h2>Folketællinger</h2><p class="lille">Tællinger i personens levetid. Et flueben betyder, at personen er fundet i tællingen.</p><div class="knapgruppe">')
      ft.forEach(t => h.push('<span class="maerke ' + (t.fundet ? 'bekraeftet' : 'undersoeges') + '">' + t.aar + (t.fundet ? ' ✓' : '') + '</span>'))
      h.push('</div></section>')
    }
  }

  if (vis && p.noter) h.push('<section class="sektion"><h2>Noter</h2><p>' + esc(p.noter) + '</p></section>')

  const logs = (D.forskning.log || []).filter(l => (l.personer || [l.anenummer]).includes(n)).sort((a, b) => String(b.dato).localeCompare(String(a.dato)))
  if (logs.length) h.push('<section class="sektion"><h2>Forskningslog</h2><ul class="liste">' + logs.map(logHtml).join('') + '</ul></section>')

  kildeIds(p).forEach(id => { if (K.has(id) && !kildeNr.has(id)) kildeNr.set(id, kildeNr.size + 1) })
  if (kildeNr.size) {
    h.push('<section class="sektion"><h2>Kilder</h2><ol class="kildeliste">')
    kildeNr.forEach((nr, id) => {
      const k = K.get(id)
      h.push('<li><span class="knr">[' + nr + ']</span><div><a href="#/kilde/' + encodeURIComponent(id) + '">' + esc(k.titel) + '</a>' + (k.arkiv ? '<div class="lille">' + esc(k.arkiv) + (k.reference ? ', ' + esc(k.reference) : '') + '</div>' : '') + '</div></li>')
    })
    h.push('</ol></section>')
  }
  return h.join('')
}

function folketaellingsraekke (p) {
  const fa = foedselsaar(p)
  if (!fa) return []
  const da = doedsaar(p) || (p.levende ? new Date().getFullYear() : fa + 100)
  const fundne = new Set((p.haendelser || []).filter(h => h.type === 'folketælling').map(h => aarAf(h.dato)))
  return FOLKETAELLINGER.filter(a => a >= fa && a <= da).map(a => ({ aar: a, fundet: fundne.has(a) }))
}

/* Tidslinje */

const tidsFilter = { side: 'alle', historie: true, type: 'alle' }

function sideTidslinje () {
  const h = []
  h.push('<h1>Tidslinje</h1>')
  if (!D.personer.length) return h.join('') + tomData()
  h.push('<p class="ingress">Livslinjer for anerne og alle registrerede begivenheder i tid, sat ind i danmarkshistorien.</p>')
  h.push('<section class="sektion"><h2>Livslinjer</h2><div class="diagram-ramme" id="livslinjer"></div></section>')
  h.push('<section class="sektion"><h2>Begivenheder</h2><div class="vaerktoej">')
  h.push('<label>Side <select id="t-side"><option value="alle">Begge sider</option><option value="far">Fars side</option><option value="mor">Mors side</option></select></label>')
  const typer = Array.from(new Set(D.personer.filter(visDetaljer).flatMap(p => (p.haendelser || []).map(e => e.type))))
  h.push('<label>Type <select id="t-type"><option value="alle">Alle typer</option>' + typer.map(t => '<option value="' + esc(t) + '">' + esc(TYPENAVNE[t] || stort(t)) + '</option>').join('') + '</select></label>')
  h.push('<label><input type="checkbox" id="t-hist"' + (tidsFilter.historie ? ' checked' : '') + '> Vis danmarkshistorie</label></div>')
  h.push('<ol class="tidsliste" id="t-liste"></ol></section>')
  return h.join('')
}

function tegnLivslinjer () {
  const boks = document.getElementById('livslinjer')
  if (!boks) return
  const rækker = personer().filter(visDetaljer).map(p => ({ p, f: foedselsaar(p), d: doedsaar(p) })).filter(r => r.f)
  if (!rækker.length) { boks.innerHTML = '<p class="muted" style="padding:16px">Ingen fødselsår registreret endnu.</p>'; return }
  const nu = new Date().getFullYear()
  const min = Math.floor((Math.min.apply(null, rækker.map(r => r.f)) - 5) / 10) * 10
  const max = nu + 2
  const venstre = 190
  const W = Math.max(boks.clientWidth || 900, 700)
  const rh = 24
  const top = 30
  const hist = tidsFilter.historie ? D.historie.filter(e => e.aar >= min && e.aar <= max) : []
  const H = top + rækker.length * rh + 20 + (hist.length ? 16 : 0)
  const x = aar => venstre + (aar - min) / (max - min) * (W - venstre - 20)
  const ud = ['<svg class="livslinjer" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Livslinjer">']
  ud.push('<g class="akse">')
  const trin = max - min > 200 ? 50 : max - min > 80 ? 20 : 10
  for (let a = Math.ceil(min / trin) * trin; a <= max; a += trin) {
    ud.push('<line x1="' + x(a) + '" x2="' + x(a) + '" y1="' + (top - 8) + '" y2="' + (H - 10) + '"/><text x="' + x(a) + '" y="' + (top - 14) + '" text-anchor="middle">' + a + '</text>')
  }
  ud.push('</g>')
  if (hist.length) {
    ud.push('<g class="hist">')
    hist.forEach(e => ud.push('<line x1="' + x(e.aar) + '" x2="' + x(e.aar) + '" y1="' + top + '" y2="' + (H - 18) + '"><title>' + esc(e.aar + '. ' + e.titel) + '</title></line>'))
    ud.push('</g>')
  }
  rækker.forEach((r, i) => {
    const y = top + i * rh
    const sd = side(r.p.anenummer)
    const slut = r.d || (r.p.levende ? nu : Math.min(nu, r.f + 70))
    const usikker = !r.d && !r.p.levende
    ud.push('<a href="#/person/' + r.p.anenummer + '"><text x="' + (venstre - 10) + '" y="' + (y + 15) + '" text-anchor="end">' + esc(afkort(kortNavn(r.p), 26)) + '</text>')
    ud.push('<rect x="' + x(r.f) + '" y="' + (y + 5) + '" width="' + Math.max(3, x(slut) - x(r.f)) + '" height="14" rx="4" fill="var(--' + sd + ')"' + (usikker ? ' fill-opacity=".35" stroke="var(--' + sd + ')" stroke-dasharray="3 2"' : '') + '><title>' + esc(fuldtNavn(r.p) + '. ' + levetid(r.p)) + '</title></rect></a>')
  })
  ud.push('</svg>')
  boks.innerHTML = ud.join('')
}

function tegnTidsliste () {
  const ol = document.getElementById('t-liste')
  if (!ol) return
  const poster = []
  personer().filter(visDetaljer).forEach(p => {
    if (tidsFilter.side !== 'alle' && side(p.anenummer) !== tidsFilter.side) return
    ;(p.haendelser || []).forEach(e => {
      if (tidsFilter.type !== 'alle' && e.type !== tidsFilter.type) return
      const d = parseDato(e.dato)
      if (!d || d.sort == null) return
      poster.push({ sort: d.sort, aar: d.aar, html: '<li class="post ' + side(p.anenummer) + '"><div class="d">' + esc(d.tekst) + '</div><div><strong>' + esc(TYPENAVNE[e.type] || stort(e.type)) + '</strong>  ' + linkPerson(p.anenummer) + ' <span class="lille">(' + esc(relation(p.anenummer).toLowerCase()) + ')</span>' + (e.sted ? '<div class="lille">' + stedLang(e.sted) + '</div>' : '') + (e.beskrivelse ? '<div class="lille">' + esc(e.beskrivelse) + '</div>' : '') + '</div></li>' })
    })
  })
  if (tidsFilter.historie && poster.length) {
    const lo = Math.min.apply(null, poster.map(p => p.aar)) - 10
    D.historie.filter(e => e.aar >= lo).forEach(e => {
      const d = parseDato(e.dato || String(e.aar))
      poster.push({ sort: d.sort - 0.0001, aar: e.aar, html: '<li class="post historie"><div class="d">' + esc(d.tekst) + '</div><div><strong>' + esc(e.titel) + '</strong>' + (e.tekst ? '<div class="lille">' + esc(e.tekst) + '</div>' : '') + '</div></li>' })
    })
  }
  poster.sort((a, b) => a.sort - b.sort)
  if (!poster.length) { ol.innerHTML = '<li class="muted">Ingen daterede begivenheder endnu.</li>'; return }
  const ud = []
  let tiaar = null
  poster.forEach(p => {
    const t = Math.floor(p.aar / 10) * 10
    if (t !== tiaar) { ud.push('<li class="aarti">' + t + '’erne</li>'); tiaar = t }
    ud.push(p.html)
  })
  ol.innerHTML = ud.join('')
}

/* Kort */

let kortInstans = null
const kortFilter = { person: 'alle', ruter: true }

function sideKort () {
  const h = []
  h.push('<h1>Kort</h1>')
  if (!D.personer.length) return h.join('') + tomData()
  h.push('<p class="ingress">Steder, hvor anerne blev født, boede, blev gift og døde. Linjerne viser hver persons vej gennem livet.</p>')
  h.push('<div class="vaerktoej"><label>Person <select id="k-person"><option value="alle">Alle personer</option>' + personer().filter(visDetaljer).map(p => '<option value="' + p.anenummer + '">' + esc(fuldtNavn(p)) + ' (' + p.anenummer + ')</option>').join('') + '</select></label>')
  h.push('<label><input type="checkbox" id="k-ruter"' + (kortFilter.ruter ? ' checked' : '') + '> Vis livsruter</label></div>')
  h.push('<div id="kort" role="region" aria-label="Kort over steder"></div>')
  h.push('<section class="sektion"><h2>Stednavne</h2><ul class="stedliste" id="k-steder"></ul></section>')
  return h.join('')
}

function tegnKort () {
  const el = document.getElementById('kort')
  if (!el) return
  if (!window.L) { el.innerHTML = '<p style="padding:16px">Kortbiblioteket kunne ikke indlæses.</p>'; return }
  if (kortInstans) { kortInstans.remove(); kortInstans = null }
  kortInstans = window.L.map(el, { scrollWheelZoom: false })
  window.L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(kortInstans)

  const valgte = personer().filter(visDetaljer).filter(p => kortFilter.person === 'alle' || String(p.anenummer) === kortFilter.person)
  const perSted = new Map()
  const ruter = []
  valgte.forEach(p => {
    const punkter = []
    haendelser(p).forEach(e => {
      const s = S.get(e.sted)
      if (!s || s.lat == null || s.lng == null) return
      if (!perSted.has(s.id)) perSted.set(s.id, [])
      perSted.get(s.id).push({ p, e })
      const sidste = punkter[punkter.length - 1]
      if (!sidste || sidste[0] !== s.lat || sidste[1] !== s.lng) punkter.push([s.lat, s.lng])
    })
    if (punkter.length > 1) ruter.push({ p, punkter })
  })

  const grupper = []
  if (kortFilter.ruter) {
    ruter.forEach(r => {
      const farve = getComputedStyle(document.documentElement).getPropertyValue('--' + side(r.p.anenummer)).trim()
      grupper.push(window.L.polyline(r.punkter, { color: farve, weight: 2.5, opacity: 0.7, dashArray: '6 5' }).bindTooltip(fuldtNavn(r.p)).addTo(kortInstans))
    })
  }
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
  perSted.forEach((liste, id) => {
    const s = S.get(id)
    const sider = new Set(liste.map(x => side(x.p.anenummer)))
    const farve = sider.size === 1 ? getComputedStyle(document.documentElement).getPropertyValue('--' + Array.from(sider)[0]).trim() : accent
    const r = Math.min(16, 6 + liste.length * 1.5)
    const html = '<h4>' + esc(s.navn) + '</h4>' + (s.sogn || s.amt ? '<div class="lille">' + esc([s.sogn, s.amt].filter(Boolean).join(', ')) + '</div>' : '') + '<ul>' + liste.map(x => '<li>' + esc(TYPENAVNE[x.e.type] || x.e.type) + (x.e.dato ? ' ' + esc(datoTekst(x.e.dato)) : '') + ': <a href="#/person/' + x.p.anenummer + '">' + esc(fuldtNavn(x.p)) + '</a></li>').join('') + '</ul>'
    grupper.push(window.L.circleMarker([s.lat, s.lng], { radius: r, color: '#fff', weight: 2, fillColor: farve, fillOpacity: 0.9 }).bindPopup(html).addTo(kortInstans))
  })
  if (grupper.length) kortInstans.fitBounds(window.L.featureGroup(grupper).getBounds().pad(0.2), { maxZoom: 11 })
  else kortInstans.setView([56.0, 10.2], 7)

  const ul = document.getElementById('k-steder')
  if (ul) {
    const alle = Array.from(perSted.keys()).map(id => S.get(id)).sort((a, b) => a.navn.localeCompare(b.navn, 'da'))
    const udenKoord = new Set()
    valgte.forEach(p => (p.haendelser || []).forEach(e => { const s = S.get(e.sted); if (s && (s.lat == null || s.lng == null)) udenKoord.add(s.id) }))
    ul.innerHTML = alle.map(s => '<li><strong>' + esc(s.navn) + '</strong> <span class="lille">' + esc([s.sogn, s.herred, s.amt].filter(Boolean).join(', ')) + '</span><div class="lille">' + perSted.get(s.id).map(x => esc(kortNavn(x.p))).filter((v, i, a) => a.indexOf(v) === i).join(', ') + '</div></li>').join('') +
      Array.from(udenKoord).map(id => '<li><strong>' + esc(S.get(id).navn) + '</strong> <span class="lille">mangler koordinater</span></li>').join('') || '<li class="muted">Ingen steder endnu.</li>'
  }
}

/* Kilder */

function sideKilder (fokus) {
  const h = []
  h.push('<h1>Kilder</h1>')
  h.push('<p class="ingress">Alle kilder, som oplysningerne bygger på. En ane bliver kun bekræftet, når den er dokumenteret i mindst én primærkilde.</p>')
  if (!D.kilder.length) return h.join('') + '<div class="tom-tilstand"><p>Ingen kilder registreret endnu.</p></div>'
  const brug = new Map()
  D.personer.forEach(p => kildeIds(p).forEach(id => { if (!brug.has(id)) brug.set(id, []); brug.get(id).push(p.anenummer) }))
  const typer = Array.from(new Set(D.kilder.map(k => k.type).filter(Boolean))).sort()
  h.push('<div class="vaerktoej"><div class="knapgruppe" id="kilde-typer"><button class="knap aktiv" data-type="alle">Alle (' + D.kilder.length + ')</button>' + typer.map(t => '<button class="knap" data-type="' + esc(t) + '">' + esc(t) + '</button>').join('') + '</div></div>')
  h.push('<div class="gitter gitter-2">')
  D.kilder.slice().sort((a, b) => String(a.titel).localeCompare(String(b.titel), 'da')).forEach(k => {
    const pers = (brug.get(k.id) || []).filter(n => !skjult(P.get(n)))
    h.push('<article class="kort-flade kilde" id="kilde-' + esc(k.id) + '" data-type="' + esc(k.type || '') + '"' + (fokus === k.id ? ' style="outline:2px solid var(--accent)"' : '') + '>')
    h.push('<div class="meta">' + (k.type ? '<span class="maerke neutral">' + esc(k.type) + '</span>' : '') + (k.kvalitet ? '<span class="maerke ' + (k.kvalitet === 'primær' ? 'bekraeftet' : 'undersoeges') + '">' + esc(stort(k.kvalitet)) + 'kilde</span>' : '') + '</div>')
    h.push('<h3>' + esc(k.titel) + '</h3>')
    if (k.arkiv || k.reference) h.push('<div class="lille">' + esc([k.arkiv, k.reference].filter(Boolean).join(', ')) + '</div>')
    if (k.noter) h.push('<p>' + esc(k.noter) + '</p>')
    if (k.url) h.push('<p><a href="' + esc(k.url) + '" target="_blank" rel="noopener">Åbn kilden</a></p>')
    if (pers.length) h.push('<div class="lille">Bruges for: ' + pers.map(n => linkPerson(n)).join(', ') + '</div>')
    h.push('</article>')
  })
  h.push('</div>')
  return h.join('')
}

/* Forskning */

function sideForskning () {
  const h = []
  h.push('<h1>Forskning</h1>')
  h.push('<p class="ingress">Her kan du følge undersøgelsen. Reglen er enkel: vi går kun et led længere tilbage fra en ane, der er bekræftet.</p>')
  h.push('<section class="kort-flade sektion"><h3>Arbejdsregler</h3><ol class="regler">')
  h.push('<li><strong>Kun den direkte linje.</strong> Kun forældre, bedsteforældre og så videre bagud fra rodpersonen. Søskende og sidelinjer registreres ikke som personer.</li>')
  h.push('<li><strong>Et led ad gangen.</strong> En persons forældre undersøges først, når personen selv er bekræftet.</li>')
  h.push('<li><strong>Bekræftet kræver bevis.</strong> Mindst én primærkilde, typisk kirkebogens dåb eller fødsel, og en skriftlig begrundelse for, at det er den rigtige person.</li>')
  h.push('<li><strong>Uafhængig støtte.</strong> Forældreskabet støttes helst af en kilde mere, fx folketælling, konfirmation eller vielse, så navne, alder og sted stemmer.</li>')
  h.push('<li><strong>Modstrid løses først.</strong> Er der kilder, der ikke stemmer, forbliver personen under undersøgelse.</li>')
  h.push('</ol></section>')

  const skridt = naesteSkridt()
  h.push('<div class="gitter gitter-2 sektion">')
  h.push('<section class="kort-flade"><h3>Næste skridt</h3><p class="lille">Beregnes automatisk ud fra reglerne.</p>' + (skridt.length ? '<ul class="liste">' + skridt.map(skridtHtml).join('') + '</ul>' : '<p class="muted">Registrér rodpersonen for at komme i gang.</p>') + '</section>')

  const opg = D.forskning.opgaver || []
  const orden = { 'i gang': 0, 'åben': 1, 'venter': 2, 'færdig': 3 }
  h.push('<section class="kort-flade"><h3>Opgaver</h3>')
  if (opg.length) {
    h.push('<ul class="liste">')
    opg.slice().sort((a, b) => (orden[a.status] ?? 1) - (orden[b.status] ?? 1)).forEach(o => {
      const kl = o.status === 'færdig' ? 'bekraeftet' : o.status === 'i gang' ? 'undersoeges' : 'neutral'
      h.push('<li><div style="display:flex;gap:8px;justify-content:space-between;align-items:baseline"><strong' + (o.status === 'færdig' ? ' style="text-decoration:line-through;opacity:.6"' : '') + '>' + esc(o.titel) + '</strong><span class="maerke ' + kl + '">' + esc(o.status || 'åben') + '</span></div>' + (o.anenummer ? '<div class="lille">' + (P.has(o.anenummer) ? linkPerson(o.anenummer) : esc(relation(o.anenummer))) + '</div>' : '') + (o.tekst ? '<div class="lille">' + esc(o.tekst) + '</div>' : '') + '</li>')
    })
    h.push('</ul>')
  } else h.push('<p class="muted">Ingen opgaver endnu.</p>')
  h.push('</section></div>')

  const ftPersoner = personer().filter(p => visDetaljer(p) && foedselsaar(p))
  if (ftPersoner.length) {
    const aar = FOLKETAELLINGER.filter(a => ftPersoner.some(p => folketaellingsraekke(p).some(t => t.aar === a)))
    if (aar.length) {
      h.push('<section class="sektion"><h2>Folketællingstjek</h2><p class="lille">Hvilke folketællinger hver ane bør findes i. ✓ fundet, ○ mangler, tom celle uden for levetiden. Ikke alle tællinger dækker hele landet.</p><div class="tabel-rul kort-flade" style="padding:0"><table class="tabel"><thead><tr><th>Person</th>' + aar.map(a => '<th class="c">' + a + '</th>').join('') + '</tr></thead><tbody>')
      ftPersoner.forEach(p => {
        const r = new Map(folketaellingsraekke(p).map(t => [t.aar, t.fundet]))
        h.push('<tr><td>' + linkPerson(p.anenummer) + '</td>' + aar.map(a => r.has(a) ? (r.get(a) ? '<td class="c ft-ja">✓</td>' : '<td class="c ft-mangler">○</td>') : '<td class="c ft-na"></td>').join('') + '</tr>')
      })
      h.push('</tbody></table></div></section>')
    }
  }

  const log = (D.forskning.log || []).slice().sort((a, b) => String(b.dato).localeCompare(String(a.dato)))
  h.push('<section class="sektion"><h2>Forskningslog</h2>')
  h.push(log.length ? '<div class="kort-flade"><ul class="liste">' + log.map(logHtml).join('') + '</ul></div>' : '<p class="muted">Loggen er tom.</p>')
  h.push('</section>')
  return h.join('')
}

function tomData () {
  return '<div class="tom-tilstand"><p>Der er ingen personer registreret endnu.</p></div>'
}

/* Router */

function rute () {
  const hash = decodeURIComponent(location.hash.replace(/^#\/?/, ''))
  const dele = hash.split('/')
  return { navn: dele[0] || '', arg: dele[1] }
}

function vis () {
  const r = rute()
  const main = document.getElementById('indhold')
  let html = ''
  let titel = ''
  if (r.navn === '') { html = sideOversigt(); titel = 'Oversigt' }
  else if (r.navn === 'anetavle') { html = sideAnetavle(+r.arg || 1); titel = 'Anetavle' }
  else if (r.navn === 'vifte') { html = sideVifte(); titel = 'Viftediagram' }
  else if (r.navn === 'galleri') { html = sideGalleri(); titel = 'Persongalleri' }
  else if (r.navn === 'person') { const n = +r.arg; html = sidePerson(n); titel = P.has(n) ? fuldtNavn(P.get(n)) : relation(n) }
  else if (r.navn === 'tidslinje') { html = sideTidslinje(); titel = 'Tidslinje' }
  else if (r.navn === 'kort') { html = sideKort(); titel = 'Kort' }
  else if (r.navn === 'kilder' || r.navn === 'kilde') { html = sideKilder(r.arg); titel = 'Kilder' }
  else if (r.navn === 'forskning') { html = sideForskning(); titel = 'Forskning' }
  else { html = '<h1>Siden findes ikke</h1><p><a href="#/">Til forsiden</a></p>'; titel = 'Ikke fundet' }

  if (kortInstans && r.navn !== 'kort') { kortInstans.remove(); kortInstans = null }
  main.innerHTML = html
  document.title = titel + ' · ' + (D.projekt.titel || 'Slægten')
  const aktiv = r.navn === 'vifte' ? 'anetavle' : r.navn === 'person' ? 'galleri' : r.navn === 'kilde' ? 'kilder' : r.navn
  document.querySelectorAll('.hovedmenu a').forEach(a => a.classList.toggle('aktiv', a.dataset.rute === aktiv))
  document.getElementById('hovedmenu').classList.remove('aaben')
  document.getElementById('menu-knap').setAttribute('aria-expanded', 'false')

  efterVisning(r)
  if (r.navn === 'kilde' && r.arg) {
    const el = document.getElementById('kilde-' + r.arg)
    if (el) el.scrollIntoView({ block: 'center' })
  } else window.scrollTo(0, 0)
}

function efterVisning (r) {
  if (r.navn === 'galleri') {
    const s = document.getElementById('g-soeg')
    const sd = document.getElementById('g-side')
    const st = document.getElementById('g-status')
    if (!s) return
    sd.value = galleriFilter.side
    st.value = galleriFilter.status
    s.addEventListener('input', () => { galleriFilter.tekst = s.value; tegnGalleri() })
    sd.addEventListener('change', () => { galleriFilter.side = sd.value; tegnGalleri() })
    st.addEventListener('change', () => { galleriFilter.status = st.value; tegnGalleri() })
    tegnGalleri()
  }
  if (r.navn === 'tidslinje') {
    const sd = document.getElementById('t-side')
    const ty = document.getElementById('t-type')
    const hi = document.getElementById('t-hist')
    if (!sd) return
    sd.value = tidsFilter.side
    ty.value = tidsFilter.type
    sd.addEventListener('change', () => { tidsFilter.side = sd.value; tegnTidsliste() })
    ty.addEventListener('change', () => { tidsFilter.type = ty.value; tegnTidsliste() })
    hi.addEventListener('change', () => { tidsFilter.historie = hi.checked; tegnTidsliste(); tegnLivslinjer() })
    tegnLivslinjer()
    tegnTidsliste()
  }
  if (r.navn === 'kort') {
    const ps = document.getElementById('k-person')
    const ru = document.getElementById('k-ruter')
    if (!ps) return
    ps.value = kortFilter.person
    ps.addEventListener('change', () => { kortFilter.person = ps.value; tegnKort() })
    ru.addEventListener('change', () => { kortFilter.ruter = ru.checked; tegnKort() })
    tegnKort()
  }
  if (r.navn === 'kilder' || r.navn === 'kilde') {
    const gruppe = document.getElementById('kilde-typer')
    if (!gruppe) return
    gruppe.addEventListener('click', e => {
      const b = e.target.closest('button')
      if (!b) return
      gruppe.querySelectorAll('button').forEach(x => x.classList.toggle('aktiv', x === b))
      document.querySelectorAll('.kilde').forEach(k => { k.style.display = b.dataset.type === 'alle' || k.dataset.type === b.dataset.type ? '' : 'none' })
    })
  }
}

let resizeTimer = null
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => { if (rute().navn === 'tidslinje') tegnLivslinjer() }, 200)
})

async function start () {
  document.getElementById('menu-knap').addEventListener('click', () => {
    const m = document.getElementById('hovedmenu')
    const aaben = m.classList.toggle('aaben')
    document.getElementById('menu-knap').setAttribute('aria-expanded', String(aaben))
  })
  await indlaes()
  if (D.projekt.titel) document.getElementById('logo-titel').textContent = D.projekt.titel
  const opd = D.projekt.opdateret || (D.forskning.log || []).map(l => l.dato).sort().pop()
  if (opd) document.getElementById('opdateret').textContent = 'Senest opdateret ' + datoTekst(opd)
  window.addEventListener('hashchange', vis)
  vis()
}

document.addEventListener('DOMContentLoaded', start)
