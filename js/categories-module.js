// categories-module.js - Funktionalität für die Kategorien und Wortgenerierung

// Kategorien für die App
const categories = [
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

// Wörter für jede Kategorie
let categoryWords = {};

// Funktion zum Initialisieren der Kategorien und Wörter
async function initCategories() {
  // Prüfen, ob bereits Wörter im Local Storage vorhanden sind
  const storedWords = localStorage.getItem('categoryWords');
  if (storedWords) {
    categoryWords = JSON.parse(storedWords);
    
    // Prüfen, ob alle Kategorien vorhanden sind und genügend Wörter haben
    let needsUpdate = false;
    for (const category of categories) {
      if (!categoryWords[category] || categoryWords[category].length < 10) {
        needsUpdate = true;
        break;
      }
    }
    
    if (!needsUpdate) {
      return true;
    }
  } else {
    categoryWords = {};
  }

  // Für jede Kategorie 10 Wörter generieren
  for (const category of categories) {
    if (!categoryWords[category]) {
      categoryWords[category] = [];
    }
    
    // Auffüllen auf 10 Wörter
    while (categoryWords[category].length < 10) {
      try {
        const newWord = await generateWordForCategory(category);
        if (newWord && !categoryWords[category].includes(newWord)) {
          categoryWords[category].push(newWord);
          
          // Speichern nach jedem neuen Wort
          localStorage.setItem('categoryWords', JSON.stringify(categoryWords));
          
          // Fortschritt aktualisieren, falls vorhanden
          updateLoadProgress();
        }
      } catch (error) {
        console.error(`Fehler beim Generieren eines Wortes für ${category}:`, error);
      }
    }
  }
  
  return true;
}

// Funktion zum Generieren eines Wortes für eine Kategorie
async function generateWordForCategory(category) {
  // Prüfen, ob API-Key vorhanden ist
  if (!checkApiKey()) {
    return null;
  }
  
  try {
    // Hier würde später die API-Anfrage erfolgen
    // Für jetzt simulieren wir eine Antwort
    
    // Beispielwörter für verschiedene Kategorien
    const wordsByCategory = {
      'Tiere': ['Affe', 'Bär', 'Chamäleon', 'Dachs', 'Elefant', 'Fuchs', 'Giraffe', 'Hund', 'Igel', 'Jaguar', 'Katze', 'Löwe', 'Maus', 'Nashorn', 'Otter', 'Pinguin', 'Qualle', 'Reh', 'Schaf', 'Tiger', 'Uhu', 'Vogel', 'Wolf', 'Zebra'],
      'Essen': ['Apfel', 'Banane', 'Croissant', 'Donut', 'Erdbeere', 'Fisch', 'Gurke', 'Honig', 'Eis', 'Joghurt', 'Käse', 'Lauch', 'Milch', 'Nudeln', 'Orange', 'Pizza', 'Quark', 'Reis', 'Salat', 'Tomate', 'Vanille', 'Waffel', 'Zucker'],
      'Spielzeug': ['Auto', 'Ball', 'Computer', 'Drachen', 'Eisenbahn', 'Fußball', 'Gameboy', 'Hula-Hoop', 'Jo-Jo', 'Knetmasse', 'Lego', 'Murmel', 'Puppe', 'Roller', 'Schaukel', 'Teddy', 'Videospiel', 'Würfel', 'Xylophon', 'Yo-Yo', 'Zauberwürfel'],
      'Fahrzeuge': ['Auto', 'Bus', 'Cabrio', 'Dampfer', 'Eisenbahn', 'Fahrrad', 'Gondel', 'Hubschrauber', 'Jet', 'Kutsche', 'Lkw', 'Motorrad', 'Omnibus', 'Panzer', 'Quad', 'Rennwagen', 'Schiff', 'Traktor', 'U-Boot', 'Van', 'Wohnmobil', 'Zug'],
      'Natur': ['Ast', 'Baum', 'Cactus', 'Düne', 'Erde', 'Fluss', 'Gras', 'Himmel', 'Insel', 'Kiesel', 'Laub', 'Meer', 'Natur', 'Ozean', 'Palme', 'Quelle', 'Regen', 'Sonne', 'Tal', 'Urwald', 'Vulkan', 'Wald', 'Zweig'],
      'Sport': ['Angeln', 'Basketball', 'Cricket', 'Dart', 'Eishockey', 'Fußball', 'Golf', 'Handball', 'Joggen', 'Klettern', 'Laufen', 'Marathon', 'Olympia', 'Polo', 'Rudern', 'Schwimmen', 'Tennis', 'Volleyball', 'Weitsprung', 'Yoga', 'Zehnkampf'],
      'Familie': ['Bruder', 'Cousin', 'Daddy', 'Eltern', 'Familie', 'Großeltern', 'Halbbruder', 'Kind', 'Mama', 'Neffe', 'Oma', 'Papa', 'Schwester', 'Tante', 'Urgroßvater', 'Vater', 'Zwilling'],
      'Schule': ['Aufgabe', 'Buch', 'Computer', 'Direktor', 'Erziehung', 'Fach', 'Grundschule', 'Heft', 'Klasse', 'Lehrer', 'Mathe', 'Note', 'Ordner', 'Pause', 'Quiz', 'Ranzen', 'Schule', 'Tafel', 'Unterricht', 'Wissen', 'Zeugnis'],
      'Kleidung': ['Anzug', 'Bluse', 'Cap', 'Dress', 'Fliege', 'Gürtel', 'Hose', 'Jacke', 'Kleid', 'Latzhose', 'Mantel', 'Nachthemd', 'Overall', 'Pullover', 'Rock', 'Socke', 'T-Shirt', 'Unterhose', 'Winterjacke', 'Zip-Jacke'],
      'Farben': ['Blau', 'Cyan', 'Dunkelblau', 'Grün', 'Hellblau', 'Indigo', 'Karminrot', 'Lila', 'Magenta', 'Orange', 'Pink', 'Rot', 'Schwarz', 'Türkis', 'Violett', 'Weiß', 'Gelb'],
      'Körper': ['Arm', 'Bauch', 'Daumen', 'Ellbogen', 'Finger', 'Gesicht', 'Hand', 'Kopf', 'Lippe', 'Mund', 'Nase', 'Ohr', 'Po', 'Rücken', 'Schulter', 'Unterarm', 'Wade', 'Zeh']
    };
    
    // Zufälliges Wort aus der Kategorie zurückgeben
    if (wordsByCategory[category] && wordsByCategory[category].length > 0) {
      const randomIndex = Math.floor(Math.random() * wordsByCategory[category].length);
      return wordsByCategory[category][randomIndex];
    } else {
      return null;
    }
  } catch (error) {
    console.error('Fehler beim Generieren eines Wortes:', error);
    return null;
  }
}

// Funktion zum Abrufen eines zufälligen Wortes aus einer Kategorie
function getRandomWordFromCategory(category) {
  if (!categoryWords[category] || categoryWords[category].length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * categoryWords[category].length);
  return categoryWords[category][randomIndex];
}

// Funktion zum Entfernen eines Wortes aus einer Kategorie und Generieren eines neuen
async function removeWordAndGenerateNew(category, word) {
  if (!categoryWords[category]) {
    return;
  }
  
  // Wort aus der Kategorie entfernen
  const index = categoryWords[category].indexOf(word);
  if (index !== -1) {
    categoryWords[category].splice(index, 1);
  }
  
  // Neues Wort generieren
  try {
    const newWord = await generateWordForCategory(category);
    if (newWord && !categoryWords[category].includes(newWord)) {
      categoryWords[category].push(newWord);
      
      // Speichern
      localStorage.setItem('categoryWords', JSON.stringify(categoryWords));
    }
  } catch (error) {
    console.error(`Fehler beim Generieren eines neuen Wortes für ${category}:`, error);
  }
}

// Funktion zum Aktualisieren des Ladefortschritts
function updateLoadProgress() {
  const progressBar = document.getElementById('load-progress');
  if (!progressBar) return;
  
  // Berechnen des Gesamtfortschritts
  let totalWords = 0;
  let targetWords = categories.length * 10;
  
  for (const category in categoryWords) {
    totalWords += categoryWords[category].length;
  }
  
  const percent = Math.min(100, Math.round((totalWords / targetWords) * 100));
  progressBar.style.width = percent + '%';
}

// Funktion zum Initialisieren des Kategorien-Moduls
function initCategoriesModule() {
  initCategories().then(() => {
    console.log('Kategorien initialisiert');
  });
}
