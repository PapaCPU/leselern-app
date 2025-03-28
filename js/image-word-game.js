// Bild-zu-Wort-Funktionalität
// Diese Datei enthält die Logik für die Bild-zu-Wort-Funktion

// Datenbank für Bilder und Wörter
let wordImages = [];
let currentWordIndex = 0;
let categories = [
  'Tiere', 
  'Essen', 
  'Spielzeug', 
  'Fahrzeuge', 
  'Natur',
  'Sport',
  'Familie',
  'Schule',
  'Kleidung',
  'Farben',
  'Körper'
];

// Funktion zum Initialisieren der Bild-zu-Wort-Datenbank
async function initImageWordDatabase() {
  // Prüfen, ob bereits Bilder im Local Storage vorhanden sind
  const storedImages = localStorage.getItem('wordImages');
  if (storedImages) {
    wordImages = JSON.parse(storedImages);
    if (wordImages.length >= 10) {
      return true;
    }
  } else {
    wordImages = [];
  }

  // Wenn nicht genügend Bilder vorhanden sind, neue generieren
  while (wordImages.length < 10) {
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    try {
      const newWord = await generateWordForLetter(letter, category);
      if (newWord) {
        // Prüfen, ob das Wort bereits in der Datenbank ist
        if (!wordImages.some(item => item.word.toLowerCase() === newWord.toLowerCase())) {
          const imageUrl = await generateImageForWord(newWord, category);
          
          wordImages.push({
            word: newWord,
            hint: `Es beginnt mit ${letter}...`,
            image: imageUrl || 'images/placeholder.png',
            category: category
          });
          
          // Speichern nach jedem neuen Wort
          localStorage.setItem('wordImages', JSON.stringify(wordImages));
          
          // Fortschritt aktualisieren, falls vorhanden
          updateLoadProgress(Math.min(100, Math.round(wordImages.length * 10)));
        }
      }
    } catch (error) {
      console.error('Fehler beim Generieren eines Wortes:', error);
    }
  }
  
  return true;
}

// Funktion zum Generieren eines Wortes für einen Buchstaben und eine Kategorie
async function generateWordForLetter(letter, category) {
  // Prüfen, ob API-Key vorhanden ist
  if (!checkApiKey()) {
    return null;
  }
  
  try {
    // Hier würde später die API-Anfrage erfolgen
    // Für jetzt simulieren wir eine Antwort
    
    // Beispielwörter für verschiedene Kategorien und Buchstaben
    const wordsByCategory = {
      'Tiere': {
        'A': 'Affe', 'B': 'Bär', 'C': 'Chamäleon', 'D': 'Dachs', 'E': 'Elefant',
        'F': 'Fuchs', 'G': 'Giraffe', 'H': 'Hund', 'I': 'Igel', 'J': 'Jaguar',
        'K': 'Katze', 'L': 'Löwe', 'M': 'Maus', 'N': 'Nashorn', 'O': 'Otter',
        'P': 'Pinguin', 'Q': 'Qualle', 'R': 'Reh', 'S': 'Schaf', 'T': 'Tiger',
        'U': 'Uhu', 'V': 'Vogel', 'W': 'Wolf', 'X': 'Xerus', 'Y': 'Yak', 'Z': 'Zebra'
      },
      'Essen': {
        'A': 'Apfel', 'B': 'Banane', 'C': 'Croissant', 'D': 'Donut', 'E': 'Erdbeere',
        'F': 'Fisch', 'G': 'Gurke', 'H': 'Honig', 'I': 'Eis', 'J': 'Joghurt',
        'K': 'Käse', 'L': 'Lauch', 'M': 'Milch', 'N': 'Nudeln', 'O': 'Orange',
        'P': 'Pizza', 'Q': 'Quark', 'R': 'Reis', 'S': 'Salat', 'T': 'Tomate',
        'U': 'Udon', 'V': 'Vanille', 'W': 'Waffel', 'X': 'Xylit', 'Y': 'Yoghurt', 'Z': 'Zucker'
      },
      'Spielzeug': {
        'A': 'Auto', 'B': 'Ball', 'C': 'Computer', 'D': 'Drachen', 'E': 'Eisenbahn',
        'F': 'Fußball', 'G': 'Gameboy', 'H': 'Hula-Hoop', 'I': 'Instrument', 'J': 'Jo-Jo',
        'K': 'Knetmasse', 'L': 'Lego', 'M': 'Murmel', 'N': 'Nähset', 'O': 'Origami',
        'P': 'Puppe', 'Q': 'Quartett', 'R': 'Roller', 'S': 'Schaukel', 'T': 'Teddy',
        'U': 'Ufo', 'V': 'Videospiel', 'W': 'Würfel', 'X': 'Xylophon', 'Y': 'Yo-Yo', 'Z': 'Zauberwürfel'
      },
      'Fahrzeuge': {
        'A': 'Auto', 'B': 'Bus', 'C': 'Cabrio', 'D': 'Dampfer', 'E': 'Eisenbahn',
        'F': 'Fahrrad', 'G': 'Gondel', 'H': 'Hubschrauber', 'I': 'Inliner', 'J': 'Jet',
        'K': 'Kutsche', 'L': 'Lkw', 'M': 'Motorrad', 'N': 'Nachtzug', 'O': 'Omnibus',
        'P': 'Panzer', 'Q': 'Quad', 'R': 'Rennwagen', 'S': 'Schiff', 'T': 'Traktor',
        'U': 'U-Boot', 'V': 'Van', 'W': 'Wohnmobil', 'X': 'Xerion', 'Y': 'Yacht', 'Z': 'Zug'
      },
      'Natur': {
        'A': 'Ast', 'B': 'Baum', 'C': 'Cactus', 'D': 'Düne', 'E': 'Erde',
        'F': 'Fluss', 'G': 'Gras', 'H': 'Himmel', 'I': 'Insel', 'J': 'Jahreszeit',
        'K': 'Kiesel', 'L': 'Laub', 'M': 'Meer', 'N': 'Natur', 'O': 'Ozean',
        'P': 'Palme', 'Q': 'Quelle', 'R': 'Regen', 'S': 'Sonne', 'T': 'Tal',
        'U': 'Urwald', 'V': 'Vulkan', 'W': 'Wald', 'X': 'Xerophyt', 'Y': 'Ysop', 'Z': 'Zweig'
      },
      'Sport': {
        'A': 'Angeln', 'B': 'Basketball', 'C': 'Cricket', 'D': 'Dart', 'E': 'Eishockey',
        'F': 'Fußball', 'G': 'Golf', 'H': 'Handball', 'I': 'Inlineskaten', 'J': 'Joggen',
        'K': 'Klettern', 'L': 'Laufen', 'M': 'Marathon', 'N': 'Netball', 'O': 'Olympia',
        'P': 'Polo', 'Q': 'Querfeldein', 'R': 'Rudern', 'S': 'Schwimmen', 'T': 'Tennis',
        'U': 'Unihockey', 'V': 'Volleyball', 'W': 'Weitsprung', 'X': 'X-Games', 'Y': 'Yoga', 'Z': 'Zehnkampf'
      },
      'Familie': {
        'A': 'Ahn', 'B': 'Bruder', 'C': 'Cousin', 'D': 'Daddy', 'E': 'Eltern',
        'F': 'Familie', 'G': 'Großeltern', 'H': 'Halbbruder', 'I': 'Ich', 'J': 'Junge',
        'K': 'Kind', 'L': 'Liebling', 'M': 'Mama', 'N': 'Neffe', 'O': 'Oma',
        'P': 'Papa', 'Q': 'Quatschkopf', 'R': 'Richtlinie', 'S': 'Schwester', 'T': 'Tante',
        'U': 'Urgroßvater', 'V': 'Vater', 'W': 'Wir', 'X': 'Xenia', 'Y': 'Yorick', 'Z': 'Zwilling'
      },
      'Schule': {
        'A': 'Aufgabe', 'B': 'Buch', 'C': 'Computer', 'D': 'Direktor', 'E': 'Erziehung',
        'F': 'Fach', 'G': 'Grundschule', 'H': 'Heft', 'I': 'Idee', 'J': 'Jugend',
        'K': 'Klasse', 'L': 'Lehrer', 'M': 'Mathe', 'N': 'Note', 'O': 'Ordner',
        'P': 'Pause', 'Q': 'Quiz', 'R': 'Ranzen', 'S': 'Schule', 'T': 'Tafel',
        'U': 'Unterricht', 'V': 'Vokabel', 'W': 'Wissen', 'X': 'Xylophon', 'Y': 'Youngster', 'Z': 'Zeugnis'
      },
      'Kleidung': {
        'A': 'Anzug', 'B': 'Bluse', 'C': 'Cap', 'D': 'Dress', 'E': 'Enge Hose',
        'F': 'Fliege', 'G': 'Gürtel', 'H': 'Hose', 'I': 'Inuit-Mantel', 'J': 'Jacke',
        'K': 'Kleid', 'L': 'Latzhose', 'M': 'Mantel', 'N': 'Nachthemd', 'O': 'Overall',
        'P': 'Pullover', 'Q': 'Quasten', 'R': 'Rock', 'S': 'Socke', 'T': 'T-Shirt',
        'U': 'Unterhose', 'V': 'Vest', 'W': 'Winterjacke', 'X': 'X-Shirt', 'Y': 'Yoga-Hose', 'Z': 'Zip-Jacke'
      },
      'Farben': {
        'A': 'Azurblau', 'B': 'Blau', 'C': 'Cyan', 'D': 'Dunkelblau', 'E': 'Erdfarben',
        'F': 'Fuchsia', 'G': 'Grün', 'H': 'Hellblau', 'I': 'Indigo', 'J': 'Jadegrün',
        'K': 'Karminrot', 'L': 'Lila', 'M': 'Magenta', 'N': 'Neongrün', 'O': 'Orange',
        'P': 'Pink', 'Q': 'Quecksilberfarben', 'R': 'Rot', 'S': 'Schwarz', 'T': 'Türkis',
        'U': 'Ultramarin', 'V': 'Violett', 'W': 'Weiß', 'X': 'Xanadu', 'Y': 'Yellow', 'Z': 'Zitronengelb'
      },
      'Körper': {
        'A': 'Arm', 'B': 'Bauch', 'C': 'Chromosom', 'D': 'Daumen', 'E': 'Ellbogen',
        'F': 'Finger', 'G': 'Gesicht', 'H': 'Hand', 'I': 'Iris', 'J': 'Jochbein',
        'K': 'Kopf', 'L': 'Lippe', 'M': 'Mund', 'N': 'Nase', 'O': 'Ohr',
        'P': 'Po', 'Q': 'Quadrizeps', 'R': 'Rücken', 'S': 'Schulter', 'T': 'Torso',
        'U': 'Unterarm', 'V': 'Vene', 'W': 'Wade', 'X': 'Xiphoid', 'Y': 'Y-Chromosom', 'Z': 'Zeh'
      }
    };
    
    // Wort für den Buchstaben und die Kategorie zurückgeben
    if (wordsByCategory[category] && wordsByCategory[category][letter]) {
      return wordsByCategory[category][letter];
    } else {
      // Fallback: Zufälliges Wort aus einer anderen Kategorie
      const fallbackCategory = Object.keys(wordsByCategory)[Math.floor(Math.random() * Object.keys(wordsByCategory).length)];
      return wordsByCategory[fallbackCategory][letter] || `${letter}...`;
    }
  } catch (error) {
    console.error('Fehler beim Generieren eines Wortes:', error);
    return null;
  }
}

// Funktion zum Generieren eines Bildes für ein Wort
async function generateImageForWord(word, category) {
  // Prüfen, ob API-Key vorhanden ist
  if (!checkApiKey()) {
    return null;
  }
  
  try {
    // Hier würde später die API-Anfrage erfolgen
    // Für jetzt simulieren wir eine Antwort mit einem Platzhalter
    return 'images/placeholder.png';
  } catch (error) {
    console.error('Fehler beim Generieren eines Bildes:', error);
    return null;
  }
}

// Funktion zum Anzeigen des aktuellen Bildes und Hinweises
function showWordImage() {
  if (wordImages.length === 0) {
    console.error('Keine Bilder in der Datenbank!');
    return;
  }
  
  const wordData = wordImages[currentWordIndex];
  const wordImageElement = document.getElementById('word-image');
  const wordHintElement = document.getElementById('word-hint');
  const wordDisplayElement = document.getElementById('word-display');
  
  if (wordImageElement) {
    wordImageElement.src = wordData.image;
    wordImageElement.alt = 'Bild zum Erraten: ' + wordData.word;
  }
  
  if (wordHintElement) {
    wordHintElement.textContent = wordData.hint;
  }
  
  // Hangman-ähnliche Anzeige für die Anzahl der Buchstaben
  if (wordDisplayElement) {
    let display = '';
    for (let i = 0; i < wordData.word.length; i++) {
      display += '_ ';
    }
    wordDisplayElement.textContent = display.trim();
  }
}

// Funktion zum Überprüfen der eingegebenen Antwort
function checkWordAnswer(answer) {
  if (wordImages.length === 0) {
    return false;
  }
  
  const wordData = wordImages[currentWordIndex];
  const isCorrect = answer.trim().toLowerCase() === wordData.word.toLowerCase();
  
  if (isCorrect) {
    // Wort aus der Datenbank entfernen und neues generieren
    removeWordAndGenerateNew();
  }
  
  return isCorrect;
}

// Funktion zum Entfernen des aktuellen Wortes und Generieren eines neuen
async function removeWordAndGenerateNew() {
  if (wordImages.length === 0) {
    return;
  }
  
  // Aktuelles Wort entfernen
  wordImages.splice(currentWordIndex, 1);
  
  // Neues Wort generieren
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  try {
    const newWord = await generateWordForLetter(letter, category);
    if (newWord) {
      const imageUrl = await generateImageForWord(newWord, category);
      
      wordImages.push({
        word: newWord,
        hint: `Es beginnt mit ${letter}...`,
        image: imageUrl || 'images/placeholder.png',
        category: category
      });
    }
  } catch (error) {
    console.error('Fehler beim Generieren eines neuen Wortes:', error);
  }
  
  // Index anpassen, falls nötig
  if (currentWordIndex >= wordImages.length) {
    currentWordIndex = 0;
  }
  
  // Datenbank speichern
  localStorage.setItem('wordImages', JSON.stringify(wordImages));
}

// Funktion zum Aktualisieren des Ladefortschritts
function updateLoadProgress(percent) {
  const progressBar = document.getElementById('load-progress');
  if (progressBar) {
    progressBar.style.width = percent + '%';
  }
}

// Funktion zum Anzeigen der Buchstaben im Hangman-Stil
function revealLetter(index) {
  const wordData = wordImages[currentWordIndex];
  const wordDisplayElement = document.getElementById('word-display');
  
  if (!wordDisplayElement) return;
  
  const currentDisplay = wordDisplayElement.textContent.split(' ');
  
  if (index >= 0 && index < wordData.word.length) {
    currentDisplay[index] = wordData.word[index];
    wordDisplayElement.textContent = currentDisplay.join(' ');
  }
}

// Funktion zum Überprüfen eines einzelnen Buchstabens
function checkLetter(letter) {
  const wordData = wordImages[currentWordIndex];
  const letterPositions = [];
  
  for (let i = 0; i < wordData.word.length; i++) {
    if (wordData.word[i].toLowerCase() === letter.toLowerCase()) {
      letterPositions.push(i);
      revealLetter(i);
    }
  }
  
  return letterPositions.length > 0 ? letterPositions : false;
}

// Funktion zum Initialisieren der Bild-zu-Wort-Funktion
function initImageWordGame() {
  initImageWordDatabase().then(() => {
    showWordImage();
  });
}
