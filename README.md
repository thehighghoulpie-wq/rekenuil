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
- `js/app.js`, `js/extra.js` – de app zelf
- `sw.js` – offline werken (verhoog `VERSION` na elke wijziging)

## Iets toevoegen
- **Woordjes Papiamentu:** voeg een regel toe aan een lijst in `PAP` (`['papiamentu', 'nederlands', 'emoji']`).
- **Spellingwoorden, spreekwoorden, leesteksten:** voeg regels toe aan de lijsten in `js/taal.js`.
- **Nieuw onderwerp:** schrijf een functie `gen(diff)` die een vraag teruggeeft en meld hem aan:
  `registerTopic('rekenen', { id, name, sub, ico, gen, lesson: [{ t, h, v, w, o }] })`.
  Soorten vragen: `num`, `rest`, `time`, `choice`, `tap` (woorden aantikken) en `order` (zin bouwen).
