# Toverschool Sterrenlicht

Een magische leer-app voor groep 1 t/m 8 (gemaakt voor groep 6): oefen **rekenen** (Getallenmagie), **taal** (Woordspreuken) en **Papiamentu** (Eilandmagie).
Werkt op een tablet, ook zonder internet. Voortgang blijft op het apparaat. Geen reclame, geen inlog, geen externe links.
App-taal: Nederlands, Papiamentu of English (de lessen en vragen zelf zijn Nederlands, zoals op school).

## Bestanden
- `index.html` – de pagina
- `css/app.css` – het uiterlijk
- `js/util.js` – hulpjes en het register (`registerSubject`, `registerTopic`, `registerWidget`)
- `js/i18n.js` – vertalingen van knoppen en menu's
- `js/visuals.js` – klok, breukstroken, getallenlijn, cijferen, grafieken, geld + interactieve lesonderdelen
- `js/art.js` – het chibi-personage, huisdieren, Pip en de leraren
- `js/fun.js` – grapjes en grappige reacties
- `js/groepen.js` – groep 1 t/m 8: welke onderwerpen bij welke groep horen, nieuwe onderwerpen (tellen, vormen, rekenen tot 20, splitsen, rijmen, eerste letter, woorden lezen, verhoudingen, procenten, 't kofschip) en eigen liedjes
- `js/leerhulp.js` – lesmotor: foute vragen komen terug, hulp die opklimt, "bijna"-opmerkingen, "Samen in stapjes", niveau per vak, "Waar begin je?", "Ik kan…"
- `js/inhoud.js` – meer onderwerpen voor groep 1-3 en 6-8, leesboekjes en De Route (figuurtje per onderwerp)
- `js/leven.js` – ster die naar de teller vliegt, Pip's mond volgt de stem, scènes als gegevens, Rustmoment, poets-timer
- `js/eiland.js` – Mijn Eiland: bouwen en spelen, huisjes verven, cadeautjes van Pip de postbode
- `js/gezin.js` – ei uitbroeden, Brievenbus, sterren met een reden, gast en meerdere spelers, speeltijden, Ouderhoek-tab Gezin
- `js/editor2.js` – Toverspiegel 4.0: onderdelen met pijltjes en dobbelsteen, kleurenwiel met eigen kleuren, gezichtsvoorbeelden, outfit-sets, omlijning aan/uit, vleugels/staart/cape, 12 poses, 8 gezichtjes, personages bewaren en kopiëren
- `js/strip.js` – Stripmaker: stripverhaal van tot 4 plaatjes met personages, achtergrond en tekstballonnen
- `js/motoren.js` – 15 puzzelmotoren (blokken, weegschaal, kassa, klok zetten, meetgereedschap, taartpunten, lettergrepen, dictee, sorteerband, stippen verbinden, schatkaart, poortrenner, spiegelbeeld, paren zoeken, echo-muziek) met onderwerpen per groep
- `js/taalmotoren.js` – taal: zinnen bouwen, letters leggen, gesprekjes, zeg het zelf, werkwoordsvormen, luister en kies, typ het Papiamentu, woordparen, meer leesboekjes, woord van de dag, wizard-rangen
- `js/engine.js` – vragen-motor: nieuwe soorten vragen (`registerKind`), nakijken als gegevens (`gradeSpec`) en het onderwerp Toverlab (schuiflijn, vakjes kleuren, kies alles)
- `js/rekenen.js`, `js/taal.js`, `js/papiamentu.js` – vragen en lessen per vak
- `js/app.js`, `js/extra.js` – de app zelf (extra.js: kledingkamer/Toverspiegel, spelletjes, Ouderhoek, intro)
- `js/review.js` – herhalen met Leitner-doosjes en de dagelijkse Toverdrank
- `js/voice.js` – familie-stemmen: opnemen en afspelen (IndexedDB, blijft op de tablet)
- `js/theme.js` – dag en nacht volgens de klok van de tablet (ouders kunnen het vastzetten) en de havenscène
- `js/motion.js` – veerkrachtige bewegingen (knoppen, Pip, sterren); uit met "Animaties" of "minder beweging"
- Mijn Eiland (`js/eiland.js`) heeft 5 werelden (strand, bos, stad, rif, ruimte), elk met eigen voorwerpen en bord, en tover-regels (lichtknop, feestknop, regenwolk). Werelden gaan open door lessen af te maken.
- `js/garden.js` – Geheime Tuin: elk onderwerp is een plant van Curaçao die in 4 stappen groeit
- `js/delight.js` – plezier: Pip-gezichtjes en praten, bliksem bij 5/10 goed, labeltjes, uitdagingsmodus, figuurtjes op de kaart, feestdagen, welkom, voorlezen, Toverspiegel 3.0
- `js/collect.js` – dagopdrachtjes, Eilandalbum (stickers), karnavalskostuum, Toverboek en stempelkalender
- `js/games2.js` – Koppelkoorts, Toverpiano, Eilandwandeling en Bellen met Wela
- `img/scene/` – de Handelskade en de Emmabrug in lagen: lucht, wolken, zee, huizen, brug, lichtjes
- `sw.js` – offline werken (verhoog `VERSION` na elke wijziging)

## Voor ouders
In ⚙️ → **Voor ouders** (houd de knop 3 seconden in en los een som op):
- weekoverzicht, sterke en zwakke onderwerpen, laatste fouten
- groep en aantal vragen per Toverdrank
- Papiamentu-woordjes inspreken (🔊 verschijnt dan bij dat woord in lessen en vragen)
- reservekopie opslaan en terugzetten (inclusief opnames)

## Papiamentu nakijken
Woorden in `PAP_VERIFIED` (`js/papiamentu.js`) zijn nagekeken tegen Wiktionary, de woordenlijst van de Universiteit van Curaçao en CLDR.
Al het andere staat op **needs family check**; de Ouderhoek (tab Stemmen) laat per woord zien welke status het heeft.
Nog niet bevestigd en extra belangrijk om te checken: `orañá` (oranje), `rosa` (roze), `maron` (bruin), `bebi` (baby), de grammaticalessen en de Papiamentu-menuteksten.

## Iets toevoegen
- **Woordjes Papiamentu:** voeg een regel toe aan een lijst in `PAP` (`['papiamentu', 'nederlands', 'emoji']`).
- **Spellingwoorden, spreekwoorden, leesteksten:** voeg regels toe aan de lijsten in `js/taal.js`.
- **Nieuw onderwerp:** schrijf een functie `gen(diff)` die een vraag teruggeeft en meld hem aan:
  `registerTopic('rekenen', { id, name, sub, ico, gen, lesson: [{ t, h, v, w, o }] })`.
  Soorten vragen: `num`, `rest`, `time`, `choice`, `tap` (woorden aantikken), `order` (zin bouwen) en, uit engine.js, `line`, `grid` en `multi`. Een eigen soort maak je met `registerKind(naam, { render, guess, empty, check, answerText, givenText, mark })`; nakijken kan met `gradeSpec({method:'value'|'set'|'order', exact, interval, required, distinct}, gegeven)`.
- **Herhalen:** laat `gen(diff, item)` een vaste vraag maken als `item` is meegegeven en zet `item` op de vraag. Foute antwoorden komen dan vanzelf terug in de Toverdrank.
- **Groepen:** geef een onderwerp `grades: [min, max]` (groep 1 t/m 8). Het bereik van bestaande onderwerpen staat in `GRADE_RANGE` in `js/groepen.js`. De groep kies je in de intro en in de Ouderhoek.
- **Liedjes:** voeg een liedje toe aan `SONGS` in `js/groepen.js` (eigen tekst en eigen melodie, nooit een bestaand liedje). In een les: `{ w: 'liedje', o: { song: 'naam' } }`.
