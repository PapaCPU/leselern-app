// sentence-reading.js - Funktionalität für das Vorlesen von Sätzen

// Datenbank für einfache Sätze
let sentences = [];
let currentSentenceIndex = 0;

// Funktion zum Initialisieren der Sätze-Datenbank
async function initSentencesDatabase() {
  // Prüfen, ob bereits Sätze im Local Storage vorhanden sind
  const storedSentences = localStorage.getItem('sentences');
  if (storedSentences) {
    sentences = JSON.parse(storedSentences);
    if (sentences.length >= 10) {
      return true;
    }
  } else {
    sentences = [];
  }

  // Wenn nicht genügend Sätze vorhanden sind, neue generieren
  while (sentences.length < 10) {
    try {
      const newSentence = await generateSimpleSentence();
      if (newSentence && !sentences.includes(newSentence)) {
        sentences.push(newSentence);
        
        // Speichern nach jedem neuen Satz
        localStorage.setItem('sentences', JSON.stringify(sentences));
        
        // Fortschritt aktualisieren, falls vorhanden
        updateLoadProgress(Math.min(100, Math.round(sentences.length * 10)));
      }
    } catch (error) {
      console.error('Fehler beim Generieren eines Satzes:', error);
    }
  }
  
  return true;
}

// Funktion zum Generieren eines einfachen Satzes
async function generateSimpleSentence() {
  // Prüfen, ob API-Key vorhanden ist
  if (!checkApiKey()) {
    return null;
  }
  
  try {
    // Hier würde später die API-Anfrage erfolgen
    // Für jetzt simulieren wir eine Antwort mit vordefinierten Sätzen
    
    const simpleSentences = [
      "Der Hund spielt im Garten.",
      "Die Katze schläft auf dem Sofa.",
      "Ein Kind liest ein Buch.",
      "Mama kocht das Abendessen.",
      "Papa repariert das Fahrrad.",
      "Wir gehen in die Schule.",
      "Der Ball rollt über den Rasen.",
      "Die Sonne scheint hell am Himmel.",
      "Ein Vogel singt im Baum.",
      "Das Auto fährt auf der Straße.",
      "Der Junge isst einen Apfel.",
      "Das Mädchen malt ein Bild.",
      "Oma backt einen Kuchen.",
      "Opa sitzt im Gartenstuhl.",
      "Die Blume wächst im Topf.",
      "Der Fisch schwimmt im Wasser.",
      "Die Kinder spielen im Park.",
      "Ein Flugzeug fliegt am Himmel.",
      "Der Lehrer erklärt die Aufgabe.",
      "Die Uhr zeigt drei Uhr an."
    ];
    
    // Zufälligen Satz auswählen
    const randomIndex = Math.floor(Math.random() * simpleSentences.length);
    return simpleSentences[randomIndex];
  } catch (error) {
    console.error('Fehler beim Generieren eines Satzes:', error);
    return null;
  }
}

// Funktion zum Anzeigen des aktuellen Satzes
function showCurrentSentence() {
  if (sentences.length === 0) {
    console.error('Keine Sätze in der Datenbank!');
    return;
  }
  
  const sentence = sentences[currentSentenceIndex];
  const sentenceDisplayElement = document.getElementById('sentence-display');
  
  if (sentenceDisplayElement) {
    sentenceDisplayElement.textContent = sentence;
  }
}

// Funktion zum Überprüfen der vorgelesenen Antwort
function checkSentenceReading(transcription) {
  if (sentences.length === 0) {
    return false;
  }
  
  const sentence = sentences[currentSentenceIndex];
  
  // Einfache Ähnlichkeitsprüfung (kann später verbessert werden)
  const similarity = calculateSimilarity(transcription.toLowerCase(), sentence.toLowerCase());
  const isCorrect = similarity >= 0.7; // 70% Ähnlichkeit als Schwellenwert
  
  if (isCorrect) {
    // Satz aus der Datenbank entfernen und neuen generieren
    removeSentenceAndGenerateNew();
    
    // 2 Pokale für einen richtig vorgelesenen Satz vergeben
    if (!areTrophiesDisabled()) {
      addTrophies(2);
    }
  }
  
  return isCorrect;
}

// Funktion zum Berechnen der Ähnlichkeit zwischen zwei Strings
function calculateSimilarity(str1, str2) {
  // Levenshtein-Distanz berechnen
  const levDist = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  
  // Ähnlichkeit als Prozentsatz (0-1)
  return 1 - (levDist / maxLength);
}

// Levenshtein-Distanz-Algorithmus
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  
  // Matrix erstellen
  const d = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  // Initialisierung
  for (let i = 0; i <= m; i++) {
    d[i][0] = i;
  }
  
  for (let j = 0; j <= n; j++) {
    d[0][j] = j;
  }
  
  // Berechnung
  for (let j = 1; j <= n; j++) {
    for (let i = 1; i <= m; i++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,      // Löschen
        d[i][j - 1] + 1,      // Einfügen
        d[i - 1][j - 1] + cost // Ersetzen
      );
    }
  }
  
  return d[m][n];
}

// Funktion zum Entfernen des aktuellen Satzes und Generieren eines neuen
async function removeSentenceAndGenerateNew() {
  if (sentences.length === 0) {
    return;
  }
  
  // Aktuellen Satz entfernen
  sentences.splice(currentSentenceIndex, 1);
  
  // Neuen Satz generieren
  try {
    const newSentence = await generateSimpleSentence();
    if (newSentence && !sentences.includes(newSentence)) {
      sentences.push(newSentence);
    }
  } catch (error) {
    console.error('Fehler beim Generieren eines neuen Satzes:', error);
  }
  
  // Index anpassen, falls nötig
  if (currentSentenceIndex >= sentences.length) {
    currentSentenceIndex = 0;
  }
  
  // Datenbank speichern
  localStorage.setItem('sentences', JSON.stringify(sentences));
}

// Funktion zum Aktualisieren des Ladefortschritts
function updateLoadProgress(percent) {
  const progressBar = document.getElementById('load-progress');
  if (progressBar) {
    progressBar.style.width = percent + '%';
  }
}

// Funktion zum Initialisieren des Satz-Vorlese-Spiels
function initSentenceReadingGame() {
  initSentencesDatabase().then(() => {
    showCurrentSentence();
  });
}
