'use strict';
/* =====================================================================
   App-taal: Nederlands (nl), Papiamentu (pap) en English (en).
   Alleen de knoppen, menu's en berichten worden vertaald. De lessen en
   vragen blijven Nederlands (zoals op school).
   Nieuwe tekst? Voeg een sleutel toe met alle drie de talen.
   ===================================================================== */
const LANGS = [['nl', '🇳🇱', 'Nederlands'], ['pap', '🇨🇼', 'Papiamentu'], ['en', '🇬🇧', 'English']];
const STR = {
  appName: ['Toverschool Sterrenlicht', 'Skol di Magia Sterrenlicht', 'Starlight Magic School'],
  hi: ['Hoi', 'Halo', 'Hi'],
  student: ['Toverleerling van Sterrenlicht', 'Studiante di magia di Sterrenlicht', 'Starlight magic student'],
  chooseWhere: ['Kies waar je heen wilt', 'Skohe unda bo ke bai', 'Choose where to go'],
  needStars: ['Nog {n} ⭐ verzamelen', 'Kolekta {n} ⭐ mas', 'Collect {n} more ⭐'],
  lockedToast: ['🔒 Dit deel van de school gaat open als je in totaal <b>{n}</b> toversterren hebt.', '🔒 E parti aki di skol ta habri ora bo tin <b>{n}</b> strea di magia na total.', '🔒 This part of the school opens when you have <b>{n}</b> magic stars in total.'],
  footStars: ['Toversterren verdien je met oefenen. Je hebt er in totaal al <b>{n}</b> verzameld.', 'Bo ta gana strea di magia ora bo ta praktiká. Bo a kolekta <b>{n}</b> kaba.', 'You earn magic stars by practising. You have collected <b>{n}</b> so far.'],
  back: ['Terug', 'Bèk', 'Back'],
  learn: ['Leren', 'Siña', 'Learn'],
  practise: ['Oefenen', 'Praktiká', 'Practise'],
  mix: ['Alles door elkaar', 'Tur kos meskla', 'Mixed'],
  mixSub: ['van elk onderwerp een beetje', 'un tiki di kada tema', 'a bit of every topic'],
  st_nieuw: ['Nieuw', 'Nobo', 'New'], st_oefenen: ['Nog oefenen', 'Praktiká mas', 'Keep practising'], st_goed: ['Gaat goed', 'Ta bai bon', 'Going well'], st_super: ['Super!', 'Super!', 'Super!'],
  tipWeak: ['Tip: <b>{t}</b> is nog lastig. Bekijk eerst even de les (📖), dan gaat het vast beter!', 'Tip: <b>{t}</b> ta difísil ainda. Wak e lès (📖) promé, e ora ei lo bai mihó!', 'Tip: <b>{t}</b> is still tricky. Look at the lesson (📖) first, then it will go better!'],
  prev: ['← Vorige', '← Anterior', '← Previous'], next: ['Volgende →', 'Sigui →', 'Next →'],
  nowPractise: ['Nu oefenen! ✨', 'Awor praktiká! ✨', 'Now practise! ✨'], backToQuiz: ['Terug naar de quiz ✨', 'Bèk na e kuis ✨', 'Back to the quiz ✨'],
  lessonDone: ['📖 Les voltooid! +3 ⭐', '📖 Lès kla! +3 ⭐', '📖 Lesson done! +3 ⭐'],
  howPractise: ['Hoe wil je oefenen?', 'Kon bo ke praktiká?', 'How do you want to practise?'],
  practiceMode: ['Oefenen', 'Praktiká', 'Practice'], practiceSub: ['Geen tijd. Met hulp en uitleg.', 'Sin tempu. Ku yudansa i splikashon.', 'No timer. With help and explanations.'],
  timedMode: ['Op tijd', 'Ku tempu', 'Timed'], timedSub: ['Zoveel mogelijk goed in de tijd.', 'Tantu bon posibel den e tempu.', 'As many right as you can in time.'],
  howHard: ['Hoe moeilijk?', 'Kon difísil?', 'How hard?'],
  easy: ['Makkelijk', 'Fásil', 'Easy'], medium: ['Gemiddeld', 'Mediano', 'Medium'], hard: ['Moeilijk', 'Difísil', 'Hard'],
  howMany: ['Hoeveel vragen?', 'Kuantu pregunta?', 'How many questions?'], howLong: ['Hoeveel tijd?', 'Kuantu tempu?', 'How much time?'],
  min: ['min', 'min', 'min'],
  yourRecord: ['🏆 Jouw record hier: <b>{n}</b> punten', '🏆 Bo rekòrt aki: <b>{n}</b> punto', '🏆 Your record here: <b>{n}</b> points'],
  begin: ['Begin met toveren! ✨', 'Kuminsá hasi magia! ✨', 'Start casting! ✨'],
  lessonFirst: ['📖 Eerst de les bekijken', '📖 Wak e lès promé', '📖 Look at the lesson first'],
  qOf: ['Vraag {i} van {n}', 'Pregunta {i} di {n}', 'Question {i} of {n}'], right: ['goed', 'bon', 'right'],
  how: ['💡 Hoe doe je dit?', '💡 Kon bo ta hasi esaki?', '💡 How do I do this?'], dunno: ['🤷 Weet ik niet', '🤷 Mi no sa', '🤷 I don\'t know'],
  cast: ['Tover! ✨', 'Hasi magia! ✨', 'Cast! ✨'], tapOrder: ['Tik de woordjes in de goede volgorde…', 'Tok e palabranan den òrden korekto…', 'Tap the words in the right order…'],
  timeFormat: ['Typ de tijd zo: <b>14:30</b> of 1430', 'Tipa e ora asina: <b>14:30</b> òf 1430', 'Type the time like this: <b>14:30</b> or 1430'],
  withHelp: ['(met hulp: halve punten)', '(ku yudansa: mitar di punto)', '(with help: half points)'],
  youSaid: ['Jij', 'Abo', 'You'], goodAns: ['Goed', 'Korekto', 'Right'], goodAnsLong: ['Het goede antwoord', 'E kontesta korekto', 'The right answer'],
  toResults: ['Naar de uitslag 🏁', 'Na e resultado 🏁', 'See results 🏁'], nextQ: ['Volgende vraag →', 'Sigui →', 'Next question →'],
  almost: ['Bijna!', 'Kasi!', 'Almost!'],
  suggestQ: ['"{t}" is best lastig, hè? Zullen we samen even de les bekijken? Daarna gaat het vast beter!', '"{t}" ta difísil, he? Nos ta wak e lès huntu? Despues lo bai mihó!', '"{t}" is tricky, isn\'t it? Shall we look at the lesson together? It will be easier after that!'],
  toLesson: ['📖 Naar de les', '📖 Na e lès', '📖 Go to the lesson'],
  stopQ: ['Stoppen met deze quiz?', 'Stòp ku e kuis aki?', 'Stop this quiz?'], stopSub: ['Wat je al goed had, telt mee voor je voortgang.', 'Loke bo tabatin bon kaba ta konta pa bo progreso.', 'What you already got right still counts.'],
  goOn: ['Doorgaan', 'Sigui', 'Keep going'], stop: ['Stoppen', 'Stòp', 'Stop'],
  results: ['Uitslag', 'Resultado', 'Results'],
  r3: ['Magisch goed!', 'Masha bon!', 'Magically good!'], r2: ['Knap getoverd!', 'Bon hasí!', 'Nicely cast!'], r1: ['Goed bezig!', 'Bo ta bai bon!', 'Good going!'], r0: ['Oefening baart kunst!', 'Praktika ta hasi maestro!', 'Practice makes perfect!'],
  pip3: ['Ik niest glitters van trots! ✨', 'Mi ta stornudá glitter di orguyo! ✨', 'I\'m sneezing glitter with pride! ✨'],
  pip1: ['Elke keer word je een beetje beter. Ga zo door!', 'Kada biaha bo ta bira un tiki mihó. Sigui asina!', 'Every time you get a little better. Keep it up!'],
  pip0: ['Niet erg! Bekijk de les eens, en probeer het dan nog een keer. Ik help je!', 'No ta nada! Wak e lès i purba atrobe. Mi ta yuda bo!', 'No worries! Look at the lesson and try again. I\'ll help you!'],
  ofRight: ['van {n} goed', 'di {n} bon', 'of {n} right'], points: ['punten', 'punto', 'points'], bestStreak: ['beste reeks', 'mihó seri', 'best streak'], magicStars: ['toversterren', 'strea di magia', 'magic stars'],
  newRecord: ['🏆 Nieuw record!', '🏆 Rekòrt nobo!', '🏆 New record!'], was: ['was', 'tabata', 'was'],
  newJoke: ['😂 Nieuw grapje voor je verzameling!', '😂 Chiste nobo pa bo kolekshon!', '😂 New joke for your collection!'],
  weakLesson: ['"{t}" ging nog wat lastig. Bekijk de les, dan wordt het makkelijker!', '"{t}" tabata difísil ainda. Wak e lès, e ora ei e ta bira mas fásil!', '"{t}" was still a bit tricky. Look at the lesson and it will get easier!'],
  trickyOnes: ['Deze waren lastig – zo zit het:', 'Esakinan tabata difísil – asina e ta:', 'These were tricky – here\'s how:'],
  allRight: ['🌟 Alles goed! Geen enkele fout. Wauw!', '🌟 Tur kos bon! Ni un fout. Wauw!', '🌟 All correct! Not one mistake. Wow!'],
  again: ['✨ Nog een keer', '✨ Un biaha mas', '✨ Again'], schoolMap: ['🏰 Schoolkaart', '🏰 Mapa di skol', '🏰 School map'],
  newPlace: ['Nieuw deel van de school!', 'Parti nobo di skol!', 'New part of the school!'], placeOpenNow: ['De <b>{p}</b> is nu open!', '<b>{p}</b> ta habri awor!', 'The <b>{p}</b> is open now!'],
  giftReady: ['🎁 Cadeautje: <b>{g}</b> ligt klaar in de Kledingkamer!', '🎁 Regalo: <b>{g}</b> ta kla den Kamber di Paña!', '🎁 Gift: <b>{g}</b> is waiting in the Wardrobe!'],
  goLook: ['Ga kijken!', 'Bai wak!', 'Go and see!'], later: ['Later', 'Despues', 'Later'], ok: ['Oké', 'Ta bon', 'OK'],
  newBadge: ['Nieuwe badge', 'Medaya nobo', 'New badge'],
  // plekken
  pl_kast: ['Kledingkamer', 'Kamber di Paña', 'Wardrobe'], pls_kast: ['mantels, hoeden & staven', 'mantel, sombré i baston', 'cloaks, hats & wands'],
  pl_sterren: ['Sterrentoren', 'Toren di Strea', 'Star Tower'], pls_sterren: ['jouw voortgang', 'bo progreso', 'your progress'],
  pl_speel: ['Speelzaal', 'Sala di Wega', 'Games Hall'], pls_speel: ['toverspelletjes', 'wega di magia', 'magic games'],
  pl_weide: ['Dierenweide', 'Kunuku di Bestia', 'Pet Meadow'], pls_weide: ['magische huisdieren', 'bestia di magia', 'magic pets'],
  pl_zolder: ['Grappenzolder', 'Sòlder di Chiste', 'Joke Attic'], pls_zolder: ['jouw grapjesverzameling', 'bo kolekshon di chiste', 'your joke collection'],
  pl_tuin: ['Geheime Tuin', 'Hardin Sekreto', 'Secret Garden'], pls_tuin: ['zie je kennis groeien', 'mira bo sabiduria krese', 'watch your knowledge grow'],
  pl_feest: ['Eilandfeest', 'Fiesta di Isla', 'Island Party'], pls_feest: ['het grote toverfeest', 'e fiesta grandi di magia', 'the big magic party'],
  // vakken
  subj_rekenen: ['Getallenmagie · Rekenen', 'Magia di Number · Matemátika', 'Number Magic · Maths'], place_rekenen: ['De Getallentoren', 'Toren di Number', 'The Number Tower'],
  subj_taal: ['Woordspreuken · Taal', 'Enkanto di Palabra · Hulandes', 'Word Spells · Dutch'], place_taal: ['De Woordenbibliotheek', 'Biblioteka di Palabra', 'The Word Library'],
  subj_papiamentu: ['Eilandmagie · Papiamentu', 'Magia di Isla · Papiamentu', 'Island Magic · Papiamentu'], place_papiamentu: ['Het Eilandstrand', 'Playa di Isla', 'The Island Beach'],
  hello_rekenen: ['Hoe-hoe! Welkom in de Getallentoren. Hier toveren we met getallen. Kies een spreukenboek!', 'Hu-hu! Bon bini na Toren di Number. Aki nos ta hasi magia ku number. Skohe un buki!', 'Hoo-hoo! Welcome to the Number Tower. Here we do magic with numbers. Pick a spell book!'],
  hello_taal: ['Hallo-hallo! Ik ben Juf Inkie. Met mijn acht armen schrijf ik acht woorden tegelijk. Welke spreuk leren we vandaag?', 'Halo-halo! Mi ta Juf Inkie. Ku mi ocho brasa mi ta skirbi ocho palabra na mes momento. Kua enkanto nos ta siña awe?', 'Hello-hello! I\'m Miss Inkie. With my eight arms I write eight words at once. Which spell shall we learn today?'],
  hello_papiamentu: ['Bon bini! Mi ta Shon Yuana. Kom, dan leer ik je de taal van Curaçao. Dushi, hè?', 'Bon bini! Mi ta Shon Yuana. Bin, mi ta siña bo e idioma di Kòrsou. Dushi, he?', 'Bon bini! I\'m Shon Yuana. Come, I\'ll teach you the language of Curaçao. Dushi, right?'],
  contentNote: ['Lessen en vragen zijn in het Nederlands, net als op school.', 'Lès i preguntanan ta na Hulandes, meskos ku na skol.', 'Lessons and questions are in Dutch, just like at school.'],
  // instellingen
  settings: ['Instellingen', 'Opshonnan', 'Settings'], language: ['Taal van de app', 'Idioma di e app', 'App language'],
  sound: ['Geluid', 'Zonido', 'Sound'], anim: ['Animaties', 'Animashon', 'Animations'], bigText: ['Grotere letters', 'Lèter mas grandi', 'Bigger text'], pipJokes: ['Grapjes van Pip in de quiz', 'Chiste di Pip den e kuis', 'Pip\'s jokes in the quiz'],
  on: ['Aan', 'Sí', 'On'], off: ['Uit', 'No', 'Off'], close: ['Sluiten', 'Sera', 'Close'],
  editMe: ['🪞 Mijn personage aanpassen', '🪞 Kambia mi personahe', '🪞 Change my character'],
  /* --- Toverdrank, Ouderhoek, Toverspiegel (Papiamentu: needs family check) --- */
  potTitle: ['🧪 Toverdrank van vandaag', '🧪 Bebida di magia di awe', "🧪 Today's magic potion"],
  potSub: ['{n} vragen: lastige dingen herhalen en een paar nieuwe.', '{n} pregunta: ripití kos difísil i un par nobo.', '{n} questions: review tricky ones and a few new ones.'],
  potDone: ['Vandaag gebrouwen! Morgen weer een nieuwe.', 'Bo a prepará esun di awe! Mañan un nobo.', 'Brewed today! A new one tomorrow.'],
  potGo: ['Brouwen! ✨', 'Prepará! ✨', 'Brew! ✨'], potAgain: ['Nog eentje', 'Un mas', 'One more'],
  potStreak: ['{n} dagen', '{n} dia', '{n} days'], potStreak1: ['1 dag', '1 dia', '1 day'], potDue: ['{n} herhalen', '{n} pa ripití', '{n} to review'],
  potReady: ['{p} is klaar!', '{p} ta kla!', '{p} is ready!'],
  potWarm: ['Gisteren niet gebrouwen? Geeft niks, Pip heeft je drankje warm gehouden. 🐉', 'Bo no a prepará ayera? No ta nada, Pip a tene bo bebida kayente. 🐉', 'Missed yesterday? No problem, Pip kept your potion warm. 🐉'],
  potExtra: ['🧪 Extra drankje gebrouwen. Goed bezig!', '🧪 Bo a prepará un bebida ekstra. Bon trabou!', '🧪 Extra potion brewed. Well done!'],
  pot0: ['Sterrenstofdrank', 'Bebida di stòf di strea', 'Stardust potion'], pot1: ['Maanmelk', 'Lechi di luna', 'Moon milk'], pot2: ['Zeeschuimsap', 'Djus di skuma di laman', 'Sea foam juice'],
  pot3: ['Hibiscusthee', 'Té di hibiskus', 'Hibiscus tea'], pot4: ['Flamingofizz', 'Fizz di flamingo', 'Flamingo fizz'], pot5: ['Wolkjeswater', 'Awa di nubia', 'Cloud water'], pot6: ['Draakjesvuur', 'Kandela di dragon', 'Dragon fire'],
  gateHold: ['Dit deel is voor ouders. Los de som op om verder te gaan.', 'E parti aki ta pa mayornan. Resolvé e som pa sigui.', 'This part is for parents. Solve the sum to continue.'],
  gateGo: ['Verder', 'Sigui', 'Continue'], gateWrong: ['Dat klopt niet. Probeer het nog eens.', 'Esei no ta korekto. Purba atrobe.', 'That is not right. Try again.'],
  gateWait: ['Even wachten… nog {n} seconden', 'Warda un ratu… ainda {n} sekònde', 'Please wait… {n} seconds left'],
  gateQ: ['Typ het antwoord:', 'Skirbi e kontesta:', 'Type the answer:'],
  parWeek: ['Deze week', 'E siman aki', 'This week'], parVoice: ['Stemmen', 'Stèm', 'Voices'], parSettings: ['Instellingen', 'Opshonnan', 'Settings'],
  parDays: ['dagen geoefend', 'dia praktiká', 'days practised'], parMin: ['minuten', 'minüt', 'minutes'], parQ: ['vragen', 'pregunta', 'questions'], parOk: ['goed', 'bon', 'correct'],
  parStrong: ['Gaat super', 'Ta bai super', 'Going great'], parWeak: ['Nog oefenen', 'Praktiká mas', 'Needs practice'], parNone: ['Nog niets', 'Nada ainda', 'Nothing yet'],
  parReview: ['Herhalen', 'Ripití', 'Review'], parReviewN: ['{n} woordjes/sommen in de herhaling, {d} vandaag aan de beurt', '{n} palabra/suma pa ripití, {d} awe', '{n} items in review, {d} due today'],
  parMistakes: ['Laatste fouten', 'Erornan resien', 'Recent mistakes'],
  voiceInfo: ['Spreek de Papiamentu-woordjes in. Je kind hoort dan jullie eigen stem bij de woordjes (🔊). Tik op ⏺, zeg het woord, tik op ⏹. De opnames blijven op deze tablet.', 'Grabá e palabranan na Papiamentu. Bo yu lo tende boso mes stèm (🔊). Primi ⏺, bisa e palabra, primi ⏹. E grabashonnan ta keda riba e tablet aki.', 'Record the Papiamentu words. Your child will hear your own voice with the words (🔊). Tap ⏺, say the word, tap ⏹. Recordings stay on this tablet.'],
  voiceWho: ['Wie spreekt in?', 'Ken ta papia?', 'Who is speaking?'],
  voiceNo: ['Opnemen werkt niet in deze browser. Probeer Chrome op de tablet.', 'Grabá no ta funshoná den e browser aki. Purba Chrome riba e tablet.', 'Recording does not work in this browser. Try Chrome on the tablet.'],
  voiceSaved: ['🎙️ Opgeslagen!', '🎙️ Warda!', '🎙️ Saved!'],
  voiceDenied: ['De microfoon is niet toegestaan. Geef toestemming in Chrome (of via Family Link).', 'E mikrofòn no ta pèrmití. Duna pèrmit den Chrome (òf via Family Link).', 'Microphone not allowed. Give permission in Chrome (or via Family Link).'],
  parGrade: ['Groep', 'Grupo', 'School year (groep)'], parGradeInfo: ['De Toverdrank past de moeilijkheid hierop aan.', 'E bebida di magia ta adaptá e difikultat na esaki.', 'The magic potion adjusts its difficulty to this.'],
  parGoal: ['Vragen per Toverdrank', 'Pregunta pa kada bebida', 'Questions per potion'],
  parBackup: ['Reservekopie', 'Kopia di reserva', 'Backup'],
  parBackupInfo: ['Bewaar de voortgang (met opnames) als bestand, bijvoorbeeld voor een nieuwe tablet. Het bestand bevat de naam, voortgang en opnames: bewaar het veilig en deel het niet.', 'Warda e progreso (ku grabashon) komo dokumento, por ehempel pa un tablet nobo. E dokumento tin e nòmber, progreso i grabashon: warda e sigur i no kompartié.', 'Save progress (with recordings) as a file, for example for a new tablet. The file contains the name, progress and recordings: keep it safe and do not share it.'],
  sceneAlt: ['De Handelskade in Willemstad met de Emmabrug', 'E Handelskade na Punda ku e Brug di Pontòn', 'The Handelskade in Willemstad with the Queen Emma Bridge'],
  pipJokeBtn: ['Pip vertelt een grapje', 'Pip ta konta un chiste', 'Pip tells a joke'],
  themeLbl: ['Dag en nacht', 'Dia i anochi', 'Day and night'], th_auto: ['Automatisch', 'Outomátiko', 'Automatic'], th_day: ['Altijd dag', 'Semper dia', 'Always day'], th_night: ['Altijd nacht', 'Semper anochi', 'Always night'],
  themeInfo: ['Automatisch volgt de klok van de tablet: overdag zonnig, na zonsondergang de sterrenhemel. Geen locatie, geen internet.', 'Outomátiko ta sigui e ora di e tablet: di dia solo, despues ku solo baha e shelu di streanan.', 'Automatic follows the tablet clock: sunny by day, starry sky after sunset. No location, no internet.'],
  listen: ['Luister', 'Tende', 'Listen'], parGram: ['Grammatica (zinnetjes)', 'Gramátika (frase)', 'Grammar (sentences)'],
  parSave: ['Opslaan als bestand', 'Warda komo dokumento', 'Save as file'], parLoad: ['Terugzetten', 'Restorá', 'Restore'], parSaved: ['⬇️ Bestand opgeslagen', '⬇️ Dokumento warda', '⬇️ File saved'],
  parLoadQ: ['Voortgang terugzetten?', 'Restorá progreso?', 'Restore progress?'], parLoadSub: ['De voortgang van <b>{n}</b> vervangt wat er nu op deze tablet staat.', 'E progreso di <b>{n}</b> ta reemplasá loke tin awor riba e tablet.', 'The progress of <b>{n}</b> replaces what is on this tablet now.'],
  parLoaded: ['✅ Teruggezet!', '✅ Restorá!', '✅ Restored!'], parLoadBad: ['Dit bestand is geen Toverschool-reservekopie.', 'E dokumento aki no ta un kopia di Skol di Magia.', 'This file is not a Magic School backup.'],
  lpFace: ['Gezicht', 'Kara', 'Face'], lpExtra: ["Extra's", 'Ekstra', 'Extras'], lpRobe: ['Mantel', 'Mantel', 'Robe'],
  lpFreckles: ['Sproetjes', 'Pintanan', 'Freckles'], lpBlush: ['Blosjes', 'Kara kòrá', 'Blush'], lpBrows: ['Wenkbrauwen', 'Wènkbrou', 'Eyebrows'],
  lpTips: ['Gekleurde puntjes', 'Puntanan di koló', 'Coloured tips'], lpEyeColor: ['Oogkleur', 'Koló di wowo', 'Eye colour'], lpEyeShape: ['Oogvorm', 'Forma di wowo', 'Eye shape'], lpLashes: ['Wimpers', 'Pestaña', 'Eyelashes'],
  lpGlasses: ['Bril', 'Bril', 'Glasses'], lpEarrings: ['Oorbellen', 'Arete', 'Earrings'], lpClips: ['In je haar', 'Den bo kabei', 'In your hair'],
  lpRobeColor: ['Kleur van je mantel', 'Koló di bo mantel', 'Robe colour'], lpRobeNote: ['Geldt voor de leerlingenmantel.', 'Ta pa e mantel di studiante.', 'Applies to the student robe.'],
  lpSign: ['Jouw toverteken', 'Bo señal di magia', 'Your magic sign'], sign_ster: ['Ster', 'Strea', 'Star'], sign_maan: ['Maan', 'Luna', 'Moon'], sign_zee: ['Zee', 'Laman', 'Sea'], sign_zon: ['Zon', 'Solo', 'Sun'],
  lpSurprise: ['Verras me!', 'Sorprendé mi!', 'Surprise me!'],
  papOk: ['nagekeken', 'kontrolá', 'verified'], papCheck: ['familie: klopt dit?', 'famia: esaki ta korekto?', 'family: is this right?'],
  forParents: ['Voor ouders', 'Pa mayornan', 'For parents'],
  parentInfo: ['Alles wordt alleen op deze tablet bewaard. Geen account, geen reclame, geen links naar buiten.', 'Tur kos ta keda warda riba e tablet aki so. Sin kuenta, sin reklame, sin link pafó.', 'Everything is saved only on this tablet. No account, no ads, no outside links.'],
  reset: ['🗑️ Alle voortgang wissen', '🗑️ Kita tur progreso', '🗑️ Erase all progress'],
  resetQ: ['Echt alles wissen?', 'Di bèrdat kita tur kos?', 'Really erase everything?'], resetSub: ['Alle sterren, spullen, huisdieren en records zijn dan weg. Dit kan niet terug.', 'Tur strea, kosnan, bestia i rekòrt lo bai. Esaki no por bai bèk.', 'All stars, items, pets and records will be gone. This cannot be undone.'],
  resetYes: ['Ja, alles wissen', 'Sí, kita tur kos', 'Yes, erase everything'], cancel: ['Annuleren', 'Kanselá', 'Cancel'],
  // kledingkamer
  look: ['Uiterlijk', 'Aparensia', 'Looks'], outfits: ['Mantels', 'Mantel', 'Cloaks'], hats: ['Hoeden', 'Sombré', 'Hats'], wands: ['Staven', 'Baston', 'Wands'],
  name: ['Naam', 'Nòmber', 'Name'], skin: ['Huidskleur', 'Koló di kueru', 'Skin'], hair: ['Kapsel', 'Kabei', 'Hairstyle'], hairColor: ['Haarkleur', 'Koló di kabei', 'Hair colour'], eyes: ['Ogen', 'Wowo', 'Eyes'],
  owned: ['Van jou', 'Di bo', 'Yours'], wearing: ['Aan', 'Bisti', 'Wearing'], buyQ: ['<b>{i}</b> kopen voor {p} ⭐?', 'Kumpra <b>{i}</b> pa {p} ⭐?', 'Buy <b>{i}</b> for {p} ⭐?'], buy: ['Kopen', 'Kumpra', 'Buy'],
  needMore: ['Je hebt nog {n} ⭐ nodig. Oefen nog wat, dan kun je het kopen!', 'Bo tin mester di {n} ⭐ mas. Praktiká un tiki mas!', 'You need {n} more ⭐. Practise a bit more and you can buy it!'],
  bought: ['🎉 Gekocht en aangetrokken!', '🎉 Kumprá i bistí!', '🎉 Bought and put on!'],
  // huisdieren
  pet: ['Huisdier', 'Bestia di kas', 'Pet'], noPet: ['Je hebt nog geen huisdier. Kies er een!', 'Bo no tin bestia ainda. Skohe un!', 'You don\'t have a pet yet. Pick one!'], cuddle: ['💖 Aaien', '💖 Kariñá', '💖 Cuddle'], choose: ['Kiezen', 'Skohe', 'Choose'],
  // spelletjes
  games: ['Toverspelletjes', 'Wega di magia', 'Magic games'], best: ['Beste', 'Mihó', 'Best'], play: ['Spelen', 'Hunga', 'Play'],
  g_match: ['Woordjes-match', 'Kombiná palabra', 'Word match'], gs_match: ['Zoek de paren: Papiamentu en Nederlands', 'Buska e parehanan: Papiamentu i Hulandes', 'Find the pairs: Papiamentu and Dutch'],
  g_memory: ['Eiland-memory', 'Memory di isla', 'Island memory'], gs_memory: ['Draai kaartjes om en onthoud ze', 'Bira e kartanan i kòrda nan', 'Flip the cards and remember them'],
  g_bellen: ['Toverbellen', 'Bùrbu di magia', 'Magic bubbles'], gs_bellen: ['Tik de bel met het goede antwoord (tafels)', 'Tok e bùrbu ku e kontesta korekto (tabla)', 'Tap the bubble with the right answer (times tables)'],
  category: ['Kies een categorie', 'Skohe un kategoria', 'Choose a category'], allWords: ['Alles', 'Tur', 'All'],
  moves: ['zetten', 'move', 'moves'], score: ['score', 'puntuashon', 'score'], time: ['tijd', 'tempu', 'time'], done: ['Klaar!', 'Kla!', 'Done!'], playAgain: ['Nog een keer', 'Un biaha mas', 'Play again'],
  // voortgang
  progress: ['Jouw voortgang', 'Bo progreso', 'Your progress'], totalStars: ['sterren verzameld', 'strea kolektá', 'stars collected'], quizzes: ['quizzen', 'kuis', 'quizzes'], correctAns: ['goede antwoorden', 'kontesta korekto', 'correct answers'], days: ['dagen op rij', 'dia na fila', 'days in a row'],
  badges: ['Badges', 'Medaya', 'Badges'], accuracy: ['goed', 'bon', 'right'], notYet: ['nog niet geoefend', 'no a praktiká ainda', 'not practised yet'],
  // grappen, tuin, feest
  jokesTitle: ['Jouw grapjes', 'Bo chistenan', 'Your jokes'], jokesNone: ['Nog geen grapjes! Haal 2 of 3 sterren in een quiz om er een te winnen.', 'Ainda no tin chiste! Haña 2 òf 3 strea den un kuis pa gana un.', 'No jokes yet! Get 2 or 3 stars in a quiz to win one.'], tapAnswer: ['Tik voor het antwoord', 'Tok pa e kontesta', 'Tap for the answer'],
  gardenTitle: ['Elke bloem is een onderwerp. Hoe beter het gaat, hoe mooier hij bloeit!', 'Kada flor ta un tema. Mas bon e ta bai, mas bunita e ta floria!', 'Every flower is a topic. The better it goes, the more it blooms!'],
  partyTitle: ['Dushi! Je bent een echte Sterrenlicht-tovenaar!', 'Dushi! Bo ta un berdadero mago di Sterrenlicht!', 'Dushi! You are a real Starlight wizard!'], certificate: ['Toverdiploma', 'Diploma di magia', 'Magic diploma'],
  // intro
  introHi: ['Bon bini! Ik ben <b>Pip</b>, het kleinste draakje van Toverschool Sterrenlicht. Ik spuug geen vuur… ik nies glitters! ✨', 'Bon bini! Mi ta <b>Pip</b>, e dragon mas chikitu di Skol di Magia Sterrenlicht. Mi no ta supla kandela… mi ta stornudá glitter! ✨', 'Bon bini! I\'m <b>Pip</b>, the smallest dragon at Starlight Magic School. I don\'t breathe fire… I sneeze glitter! ✨'],
  introLang: ['In welke taal wil je de app?', 'Den kua idioma bo ke e app?', 'Which language do you want the app in?'],
  introName: ['Hoe heet jij, nieuwe toverleerling?', 'Kon bo yama, studiante nobo?', 'What\'s your name, new student?'], namePh: ['Jouw naam', 'Bo nòmber', 'Your name'],
  introLook: ['Maak je eigen tovenaarsleerling!', 'Traha bo mes studiante di magia!', 'Make your own magic student!'],
  introDone: ['Welkom op school, <b>{n}</b>! Je krijgt 10 toversterren cadeau. Kies een klas en verdien er nog veel meer!', 'Bon bini na skol, <b>{n}</b>! Bo ta haña 10 strea di magia komo regalo. Skohe un klas i gana hopi mas!', 'Welcome to school, <b>{n}</b>! Here are 10 magic stars as a gift. Pick a class and earn lots more!'],
  letsGo: ['Op naar school! 🏰', 'Bai skol! 🏰', 'Off to school! 🏰'], continue: ['Verder →', 'Sigui →', 'Continue →'],
  oldBonus: ['🦉 Je speelde al met Rekenuil! Daarom krijg je 20 extra toversterren.', '🦉 Bo a hunga ku Rekenuil kaba! Pesei bo ta haña 20 strea ekstra.', '🦉 You played Rekenuil before! So you get 20 extra magic stars.']
};
const TOPICNAMES_EN = { tafels: 'Times tables', delen: 'Division', plusmin: 'Plus and minus', groot: 'Big numbers', breuken: 'Fractions & decimals', geld: 'Money', meten: 'Measuring', opp: 'Perimeter & area', grafiek: 'Tables & graphs', klok: 'Telling time', verhaal: 'Word problems',
  eiij: 'ei or ij?', auou: 'au or ou?', gch: 'g or ch?', dubbel: 'One or two letters?', dt: 'd or t?', woorden: 'Vocabulary', lezen: 'Reading comprehension', zinsdelen: 'Subject & verb', woordsoort: 'Word types', meervoud: 'Plurals & diminutives', spreuk: 'Sayings',
  groeten: 'Greetings', getallen: 'Numbers', kleuren: 'Colours', familie: 'Family', eten: 'Food & drink', dieren: 'Animals', dagen: 'Days & months', zinnen: 'Phrases', weetjes: 'Curaçao facts', grammatika: 'Building sentences' };
const TOPICNAMES_PAP = { tafels: 'Tabla', delen: 'Divishon', plusmin: 'Suma i resta', groot: 'Number grandi', breuken: 'Frakshon i desimal', geld: 'Plaka', meten: 'Midi', opp: 'Perímetro i área', grafiek: 'Tabel i gráfiko', klok: 'Lesa ora', verhaal: 'Problema di kuenta',
  eiij: 'ei òf ij?', auou: 'au òf ou?', gch: 'g òf ch?', dubbel: 'Un òf dos lèter?', dt: 'd òf t?', woorden: 'Palabranan', lezen: 'Lesa i komprondé', zinsdelen: 'Subhekto i verbo', woordsoort: 'Tipo di palabra', meervoud: 'Plural i diminutivo', spreuk: 'Proverbio',
  groeten: 'Saludo', getallen: 'Number', kleuren: 'Koló', familie: 'Famia', eten: 'Kuminda i bebida', dieren: 'Bestia', dagen: 'Dia i luna', zinnen: 'Frase', weetjes: 'Datonan di Kòrsou', grammatika: 'Traha un frase' };
// korte zinnetjes die vaak terugkomen
const PRAISE_I18N = { pap: ['Bon hasí!', 'Super!', 'Masha bon!', 'Bo ta un strea!', 'Dushi!', 'Korekto!', 'Wauw!', 'Bo ta inteligente!'], en: ['Well done!', 'Super!', 'Great job!', 'Yes!', 'Spot on!', 'Brilliant!', 'Wow!', 'You\'re so smart!'] };
const COMFORT_I18N = { pap: ['Hasi fout ta parti di siña. Wak:', 'No ta nada! Asina e ta:', 'Kasi! Huntu nos ta wak kon e ta:'], en: ['Making mistakes is part of learning magic. Look:', 'No problem! Here\'s how it works:', 'Almost! Let\'s see how it works together:'] };
const PIPHELLO_I18N = { pap: ['Halo! Tok riba mi pa un chiste!', 'Bon bini bèk, studiante!', 'Mi tabata warda bo! Mi a kome tres pastechi kaba.', 'Bo tin gana di hasi magia? Ami sí!'], en: ['Hi! Tap me for a joke!', 'Welcome back, student!', 'I was waiting for you! I already ate three pastechi.', 'Ready to do some magic? I am!'] };

const LANGI = { nl: 0, pap: 1, en: 2 };
function lang() { return (typeof D !== 'undefined' && D.settings && D.settings.lang) || 'nl'; }
function t(key, vars) {
  const row = STR[key]; let s = row ? (row[LANGI[lang()]] || row[0]) : key;
  if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  return s;
}
function tTopic(topic) {
  const l = lang(); if (l === 'en') return TOPICNAMES_EN[topic.id] || topic.name; if (l === 'pap') return TOPICNAMES_PAP[topic.id] || topic.name; return topic.name;
}
const tList = (nlList, map) => lang() === 'nl' ? nlList : (map[lang()] || nlList);
