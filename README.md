# Toverschool Sterrenlicht

Een magische leer-app voor groep 6: oefen **rekenen** (Getallenmagie), **taal** (Woordspreuken) en **Papiamentu** (Eilandmagie).
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
- `js/rekenen.js`, `js/taal.js`, `js/papiamentu.js` – vragen en lessen per vak
- `js/app.js`, `js/extra.js` – de app zelf (extra.js: kledingkamer/Toverspiegel, spelletjes, Ouderhoek, intro)
- `js/review.js` – herhalen met Leitner-doosjes en de dagelijkse Toverdrank
- `js/voice.js` – familie-stemmen: opnemen en afspelen (IndexedDB, blijft op de tablet)
- `js/theme.js` – dag en nacht volgens de klok van de tablet (ouders kunnen het vastzetten) en de havenscène
- `js/motion.js` – veerkrachtige bewegingen (knoppen, Pip, sterren); uit met "Animaties" of "minder beweging"
- `js/garden.js` – Geheime Tuin: elk onderwerp is een plant van Curaçao die in 4 stappen groeit
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
  Soorten vragen: `num`, `rest`, `time`, `choice`, `tap` (woorden aantikken) en `order` (zin bouwen).
- **Herhalen:** laat `gen(diff, item)` een vaste vraag maken als `item` is meegegeven en zet `item` op de vraag. Foute antwoorden komen dan vanzelf terug in de Toverdrank.
- **Andere leeftijden (later):** geef een onderwerp `grades: [min, max]` (groep). De groep staat in de Ouderhoek.
