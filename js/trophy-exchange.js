// trophy-exchange.js - Funktionalität für das Einlösen von Pokalen für Bilder

// Konstanten für die Kosten
const REFERENCE_IMAGE_COST = 10; // Kosten für ein Bild mit Referenz
const SIMPLE_IMAGE_COST = 5;     // Kosten für ein einfaches Bild

// Referenzbilder
let referenceImages = {
  papa: null,
  mama: null,
  leon: null
};

// Audiorecorder für die Sprachaufnahme
let audioRecorder = null;

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', function() {
  // Elemente aus dem DOM
  const trophyCountElement = document.getElementById('trophy-count');
  const createImageButton = document.getElementById('create-image');
  const speakPromptButton = document.getElementById('speak-prompt');
  const imagePromptInput = document.getElementById('image-prompt');
  const generatedImageElement = document.getElementById('generated-image');
  const imageResultCard = document.getElementById('image-result');
  const saveImageButton = document.getElementById('save-image');
  const newImageButton = document.getElementById('new-image');
  const referenceSelectElement = document.getElementById('reference-select');
  
  // Referenzbilder laden
  loadReferenceImages();
  
  // Trophäen-Anzeige aktualisieren
  updateTrophyDisplay();
  
  // Event-Listener für Buttons
  if (createImageButton) {
    createImageButton.addEventListener('click', handleCreateImage);
  }
  
  if (speakPromptButton) {
    speakPromptButton.addEventListener('click', handleSpeakPrompt);
  }
  
  if (saveImageButton) {
    saveImageButton.addEventListener('click', handleSaveImage);
  }
  
  if (newImageButton) {
    newImageButton.addEventListener('click', handleNewImage);
  }
  
  // Audiorecorder initialisieren
  initAudioRecorder();
});

// Referenzbilder aus dem Local Storage laden
function loadReferenceImages() {
  for (const person in referenceImages) {
    const storedImage = localStorage.getItem(`referenceImage_${person}`);
    if (storedImage) {
      referenceImages[person] = storedImage;
      
      // Vorschau aktualisieren, falls vorhanden
      const previewElement = document.getElementById(`${person}-preview`);
      if (previewElement) {
        previewElement.src = storedImage;
        previewElement.classList.remove('hidden');
      }
    }
  }
  
  // Referenzauswahl aktualisieren
  updateReferenceSelect();
}

// Referenzauswahl aktualisieren
function updateReferenceSelect() {
  const referenceSelectElement = document.getElementById('reference-select');
  if (!referenceSelectElement) return;
  
  // Bestehende Optionen löschen
  referenceSelectElement.innerHTML = '';
  
  // Option für kein Referenzbild
  const noneOption = document.createElement('option');
  noneOption.value = 'none';
  noneOption.textContent = 'Kein Referenzbild (5 Pokale)';
  referenceSelectElement.appendChild(noneOption);
  
  // Optionen für vorhandene Referenzbilder
  for (const person in referenceImages) {
    if (referenceImages[person]) {
      const option = document.createElement('option');
      option.value = person;
      option.textContent = person.charAt(0).toUpperCase() + person.slice(1) + ' (10 Pokale)';
      referenceSelectElement.appendChild(option);
    }
  }
}

// Audiorecorder initialisieren
function initAudioRecorder() {
  // Prüfen, ob die Browser-API verfügbar ist
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error('Sprachaufnahme wird von diesem Browser nicht unterstützt.');
    return;
  }
  
  // Audiorecorder erstellen
  audioRecorder = createAudioRecorder({
    timeLimit: 3000, // 3 Sekunden
    silenceDetection: true, // Stille-Erkennung aktivieren
    onStart: function() {
      const speakPromptButton = document.getElementById('speak-prompt');
      if (speakPromptButton) {
        speakPromptButton.textContent = 'Ich höre...';
        speakPromptButton.disabled = true;
      }
    },
    onStop: async function(audioBlob) {
      const speakPromptButton = document.getElementById('speak-prompt');
      if (speakPromptButton) {
        speakPromptButton.textContent = 'Per Sprache beschreiben';
        speakPromptButton.disabled = false;
      }
      
      // Hier würde später die Spracherkennung erfolgen
      // Für jetzt simulieren wir eine Antwort
      const transcription = await simulateTranscription(audioBlob);
      
      // Transkription in das Eingabefeld einfügen
      const imagePromptInput = document.getElementById('image-prompt');
      if (imagePromptInput) {
        imagePromptInput.value = transcription;
      }
    },
    onError: function(error) {
      console.error('Fehler bei der Sprachaufnahme:', error);
      showMessage('Fehler bei der Sprachaufnahme. Bitte versuche es erneut.', 'error');
      
      const speakPromptButton = document.getElementById('speak-prompt');
      if (speakPromptButton) {
        speakPromptButton.textContent = 'Per Sprache beschreiben';
        speakPromptButton.disabled = false;
      }
    },
    onTimeUpdate: function(elapsed, remaining) {
      // Optional: Fortschrittsanzeige aktualisieren
    }
  });
  
  // Audiorecorder initialisieren
  audioRecorder.init().catch(error => {
    console.error('Fehler beim Initialisieren des Audiorecorders:', error);
  });
}

// Funktion zum Simulieren der Spracherkennung
async function simulateTranscription(audioBlob) {
  // Hier würde später die echte Spracherkennung erfolgen
  // Für jetzt simulieren wir eine Antwort
  
  const exampleTranscriptions = [
    "Ein Hund spielt im Park",
    "Eine Katze sitzt auf dem Sofa",
    "Ein Astronaut auf dem Mond",
    "Ein Dinosaurier im Dschungel",
    "Ein Pirat auf einem Schiff",
    "Eine Fee im Zauberwald",
    "Ein Ritter kämpft gegen einen Drachen",
    "Ein Roboter in einer futuristischen Stadt",
    "Ein Superheld rettet die Welt",
    "Ein Einhorn im Regenbogenland"
  ];
  
  // Zufällige Transkription auswählen
  const randomIndex = Math.floor(Math.random() * exampleTranscriptions.length);
  
  // Kurze Verzögerung simulieren
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return exampleTranscriptions[randomIndex];
}

// Funktion zum Erstellen eines Bildes
async function handleCreateImage() {
  const imagePromptInput = document.getElementById('image-prompt');
  const referenceSelectElement = document.getElementById('reference-select');
  
  if (!imagePromptInput || !referenceSelectElement) return;
  
  const prompt = imagePromptInput.value.trim();
  const referenceType = referenceSelectElement.value;
  
  // Prompt validieren
  if (!prompt) {
    showMessage('Bitte gib eine Beschreibung für das Bild ein.', 'error');
    return;
  }
  
  // Kosten berechnen
  const cost = referenceType === 'none' ? SIMPLE_IMAGE_COST : REFERENCE_IMAGE_COST;
  
  // Prüfen, ob genügend Pokale vorhanden sind
  if (!areTrophiesDisabled() && !removeTrophies(cost)) {
    showMessage(`Du brauchst ${cost} Pokale, um dieses Bild zu erstellen.`, 'error');
    return;
  }
  
  // Referenzbild abrufen
  const referenceImage = referenceType !== 'none' ? referenceImages[referenceType] : null;
  
  // Lade-Animation anzeigen
  showMessage('Bild wird erstellt, bitte warten...', 'info');
  
  // Hier würde später die API-Anfrage erfolgen
  // Für jetzt simulieren wir eine Antwort
  try {
    const imageUrl = await generateImage(prompt, referenceImage, referenceType);
    
    // Bild anzeigen
    const generatedImageElement = document.getElementById('generated-image');
    const imageResultCard = document.getElementById('image-result');
    
    if (generatedImageElement && imageResultCard) {
      generatedImageElement.src = imageUrl;
      generatedImageElement.alt = prompt;
      imageResultCard.classList.remove('hidden');
    }
    
    showMessage('Bild wurde erfolgreich erstellt!', 'success');
  } catch (error) {
    console.error('Fehler beim Erstellen des Bildes:', error);
    showMessage('Fehler beim Erstellen des Bildes. Bitte versuche es erneut.', 'error');
    
    // Pokale zurückerstatten
    if (!areTrophiesDisabled()) {
      addTrophies(cost);
    }
  }
}

// Funktion zum Generieren eines Bildes
async function generateImage(prompt, referenceImage, referenceType) {
  // Prüfen, ob Google API-Key vorhanden ist
  if (!checkGoogleApiKey()) {
    throw new Error('Kein Google API-Key gefunden.');
  }
  
  // Hier würde später die API-Anfrage erfolgen
  // Für jetzt simulieren wir eine Antwort mit einem Platzhalter
  
  // Verzögerung simulieren
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Platzhalter-Bild zurückgeben
  return 'images/placeholder.png';
}

// Funktion zum Starten der Sprachaufnahme
function handleSpeakPrompt() {
  if (!audioRecorder) {
    showMessage('Sprachaufnahme wird initialisiert...', 'info');
    initAudioRecorder();
    return;
  }
  
  // Sprachaufnahme starten
  audioRecorder.start();
}

// Funktion zum Speichern des generierten Bildes
function handleSaveImage() {
  const generatedImageElement = document.getElementById('generated-image');
  if (!generatedImageElement || !generatedImageElement.src) return;
  
  // Hier würde später die Logik zum Speichern des Bildes implementiert werden
  // Für jetzt simulieren wir eine Antwort
  
  showMessage('Bild wurde gespeichert!', 'success');
}

// Funktion zum Erstellen eines neuen Bildes
function handleNewImage() {
  const imageResultCard = document.getElementById('image-result');
  if (imageResultCard) {
    imageResultCard.classList.add('hidden');
  }
}
