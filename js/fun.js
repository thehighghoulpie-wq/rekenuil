'use strict';
/* =====================================================================
   Humor: grapjes, spreuknamen en grappige reacties.
   Regel: we lachen om de spreuk of om Pip, nooit om de leerling.
   ===================================================================== */
const JOKES = [
  ['Wat zegt een 0 tegen een 8?', 'Hé, leuke riem!'],
  ['Waarom ging de 6 naar de dokter?', 'Hij voelde zich een beetje omgekeerd. Hij dacht dat hij een 9 was!'],
  ['Wat zegt de ene breuk tegen de andere?', 'Jij bent mijn betere helft!'],
  ['Wat is het lievelingseten van een tovenaar?', 'Spookhetti! 🍝'],
  ['Wat is het lievelingsdier van een tovenaar?', 'Een abra-kat-abra! 🐱'],
  ['Waarom kan een spook nooit liegen?', 'Je kijkt dwars door hem heen! 👻'],
  ['Wat zei de ene oceaan tegen de andere?', 'Niks. Ze golfden alleen maar. 🌊'],
  ['Waarom gaan vissen nooit naar school?', 'Ze zwemmen al de hele dag in een school! 🐟'],
  ['Wat is geel en kan niet zwemmen?', 'Een graafmachine. En wat is geel en kan óók niet zwemmen? Twee graafmachines! 🚜'],
  ['Wat zegt de ene muur tegen de andere muur?', 'Zullen we elkaar op de hoek ontmoeten? 🧱'],
  ['Waarom nam de leerling een ladder mee naar school?', 'Hij wilde naar de bovenbouw! 🪜'],
  ['Waarom liep de klok weg?', 'Hij had er geen tijd meer voor! ⏰'],
  ['Wat zegt een flamingo als hij moe is?', 'Ik sta even op één been uit te rusten. 🦩'],
  ['Wat doet een heks als haar bezem kapot is?', 'Ze neemt de veeg-bus! 🧹'],
  ['Wat zegt een potlood tegen het papier?', 'Ik heb een puntje voor je! ✏️'],
  ['Waarom eten leguanen nooit fastfood?', 'Ze nemen alle tijd om in de zon te liggen. Haast? Nooit gehoord! 🦎'],
  ['Wat zei de liniaal tegen de gum?', 'Jij maakt alles weer goed! 📏'],
  ['Waarom was het rekenboek verdrietig?', 'Het zat vol problemen! 📕'],
  ['Hoe noem je een draak die heel veel boeken leest?', 'Een boek-wurm met vleugels! 🐉📚'],
  ['Waarom zingt de toverketel zo hard?', 'Omdat hij aan de kook is! 🎶'],
  ['Wat is het lievelingsvak van een kikker?', 'Kwaak-rekenen! 🐸'],
  ['Hoe weet je dat een eenhoorn blij is?', 'Hij heeft een glimlach van hoorn tot staart! 🦄'],
  ['Waarom gaat een tovenaar nooit zonder hoed naar buiten?', 'Dan heeft hij geen puntje meer! 🎩'],
  ['Wat zegt Shon Yuana als hij een grap hoort?', 'Hahaha, dushi! Dat is een yuana-goeie mop! 🦎'],
  ['Wat is groen en loopt door het bos?', 'Een rups met een rugzakje! 🐛'],
  ['Waarom hebben uilen nooit ruzie?', 'Ze zeggen altijd: hoe-hoe gaat het met jou? 🦉'],
  ['Wat doet een spin op de computer?', 'Een website bouwen! 🕸️'],
  ['Wat zegt een ei tegen een koekenpan?', 'Jij maakt me altijd zo gebakken! 🍳']
];

const SPELLS = ['Sommius Klopticus!', 'Abracadabra-goed!', 'Hocus Pocus, totaal in focus!', 'Sterrius Stralius!', 'Knallus Juistus!', 'Glitterium Maximum!', 'Pastechi-Presto!',
  'Bingo-Bango-Bongo!', 'Flamingo Fantastico!', 'Dushi Dazzlus!', 'Breinus Brillius!', 'Toverus Topperus!', 'Zappa-Zoem!', 'Raketto Rakketus!', 'Supernova Sparkle!'];
const PRAISE = ['Goed zo!', 'Super!', 'Knap gedaan!', 'Top!', 'Yes!', 'Helemaal goed!', 'Lekker bezig!', 'Wauw!', 'Prima!', 'Klopt als een bus!', 'Toverachtig!', 'Wat ben jij slim!'];

// grappige mislukte spreuken: [emoji, tekst]
const FAILS = [
  ['🍍', 'Poef! De spreuk toverde Pip om in een ananas. "Ik voel me een beetje… tropisch," zegt Pip.'],
  ['🐸', 'Kwaak! Er verscheen een kikker in plaats van een ster. Hij heet nu Gerrit en hij vindt het hier gezellig.'],
  ['🌧️', 'Oeps! Er hangt nu een klein regenwolkje boven Pip. "Gratis douche!" roept hij.'],
  ['🎈', 'De toverstok blies een ballon op in plaats van een spreuk. Plop!'],
  ['🧦', 'Huh? Het regent ineens sokken in het lokaal. Nou ja, lekker warm!'],
  ['🐔', 'Tok tok! Er rent een kip door het lokaal. Waar komt die nou weer vandaan?!'],
  ['🍝', 'Pip\'s staart veranderde in een sliert spaghetti. "Mmm, handig voor later," zegt hij.'],
  ['🌸', 'Er groeien bloemetjes uit de oren van Professor Uilenbal. Hij vindt het eigenlijk best mooi.'],
  ['🥄', 'Je toverstok veranderde even in een lepel. Soepje, iemand?'],
  ['🫧', 'Bubbels! Overal bubbels! Pip probeert ze allemaal op te eten.'],
  ['🦆', 'Kwek! Juf Inkie kwaakt nu als een eend. Gelukkig is het over vijf seconden over.'],
  ['🎩', 'Er sprong een konijn uit je hoed. Het zegt: "Verkeerd adres!" en springt er weer in.'],
  ['🍌', 'De spreuk maakte een banaan. Shon Yuana heeft hem al opgegeten. "Dushi!"'],
  ['💨', 'Pffft! Er kwam alleen een wolkje uit je toverstok, in de vorm van een draakje.'],
  ['🪀', 'Boing-boing! De tafels stuiteren door het lokaal. Even wachten tot ze stil liggen…'],
  ['🥸', 'Iedereen in het lokaal heeft ineens een snor. Ook de plantjes!']
];
const COMFORT = ['Fouten maken hoort bij toveren leren. Kijk maar:', 'Geeft niks! Zo zit het:', 'Bijna! Samen kijken we hoe het wel moet:', 'Niet erg, hier word je slimmer van:', 'Elke tovenaar oefent. Zo werkt het:'];

// Pip zegt af en toe iets tijdens het oefenen
const PIP_CHEER = ['Je bent op dreef! 🔥', 'Nog eentje, dan doe ik een dansje!', 'Hoera! Ik niest er glitters van! ✨', 'Wauw, mijn vleugeltjes fladderen ervan!', 'Jij bent echt een toverkanon!', 'Ik ben zo trots, ik word er helemaal roze van!'];
const PIP_HELLO = ['Hoi! Tik op mij voor een grapje!', 'Welkom terug, toverleerling!', 'Ik heb op je gewacht! Ik heb al drie pastechi\'s gegeten.', 'Zin om te toveren? Ik wel!', 'Psst… in de Speelzaal kun je spelletjes doen!', 'Wist je dat ik glitters nies als ik blij ben?'];
const STREAK_MSG = { 3: 'Drie op een rij! 🔥', 5: 'Vijf op een rij! Je bent on fire! 🔥🔥', 10: 'TIEN op een rij! Ben jij een tovenaarsmeester?! 🌟', 15: 'Vijftien! Pip valt bijna flauw van bewondering! 😵‍💫', 20: 'TWINTIG! Dit is legendarisch! 🏆' };
