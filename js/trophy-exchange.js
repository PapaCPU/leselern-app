// trophy-exchange.js - Hauptfunktionalität für das Pokale-Einlösen-Modul

document.addEventListener('DOMContentLoaded', function() {
  // Elemente aus dem DOM
  const imagePromptInput = document.getElementById('image-prompt');
  const createImageButton = document.getElementById('create-image');
  const speakPromptButton = document.getElementById('speak-prompt');
  const saveImageButton = document.getElementById('save-image');
  const newImageButton = document.getElementById('new-image');
  const generatedImageElement = document.getElementById('generated-image');
  const imageResultElement = document.getElementById('image-result');
  
  // Audio-Recorder für Sprachbefehle
  let audioRecorder = null;
  
  // Initialisierung
  function init() {
    // Trophäen-Anzahl aktualisieren und Button-Status setzen
    updateTrophyCount();
    
    // AudioRecorder initialisieren
    initAudioRecorder();
    
    // Event-Listener für Buttons
    createImageButton.addEventListener('click', handleCreateImage);
    speakPromptButton.addEventListener('click', handleSpeakPrompt);
    saveImageButton.addEventListener('click', handleSaveImage);
    newImageButton.addEventListener('click', handleNewImage);
  }
  
  // Trophäen-Anzahl aktualisieren und Button-Status setzen
  function updateTrophyCount() {
    const trophyCount = getTrophyCount();
    
    // Button-Status aktualisieren
    if (trophyCount < 5) {
      createImageButton.disabled = true;
      createImageButton.textContent = 'Nicht genug Pokale (5 benötigt)';
    } else {
      createImageButton.disabled = false;
      createImageButton.textContent = 'Bild erstellen (5 Pokale)';
    }
  }
  
  // AudioRecorder initialisieren
  async function initAudioRecorder() {
    audioRecorder = createAudioRecorder({
      timeLimit: 10000, // 10 Sekunden für längere Beschreibungen
      onStart: () => {
        speakPromptButton.textContent = 'Ich höre...';
        speakPromptButton.disabled = true;
      },
      onStop: async (audioBlob) => {
        speakPromptButton.textContent = 'Verarbeite...';
        
        try {
          // API-Key überprüfen
          const apiKey = getApiKey();
          if (!apiKey) {
            showMessage('Kein API-Schlüssel gefunden. Bitte gehe zu den Einstellungen und gib deinen API-Schlüssel ein.', 'error');
            resetSpeakButton();
            return;
          }
          
          // Audio transkribieren
          const transcriptionResult = await transcribeAudio(audioBlob, apiKey);
          const transcription = transcriptionResult.text;
          
          // Transkription in das Eingabefeld einfügen
          imagePromptInput.value = transcription;
          
          showMessage('Spracherkennung abgeschlossen!', 'success');
        } catch (error) {
          console.error('Fehler bei der Spracherkennung:', error);
          showMessage('Fehler bei der Spracherkennung: ' + error.message, 'error');
        }
        
        resetSpeakButton();
      },
      onError: (error) => {
        console.error('Fehler beim Aufnehmen:', error);
        showMessage('Fehler beim Aufnehmen: ' + error.message, 'error');
        resetSpeakButton();
      }
    });
    
    try {
      await audioRecorder.init();
    } catch (error) {
      console.error('Fehler beim Initialisieren des AudioRecorders:', error);
      showMessage('Fehler beim Zugriff auf das Mikrofon. Bitte erlaube den Zugriff und versuche es erneut.', 'error');
      speakPromptButton.disabled = true;
    }
  }
  
  // Bild erstellen
  async function handleCreateImage() {
    const trophyCount = getTrophyCount();
    if (trophyCount < 5) {
      showMessage('Du brauchst mindestens 5 Pokale, um ein Bild zu erstellen.', 'error');
      return;
    }
    
    // API-Key überprüfen
    const apiKey = getApiKey();
    if (!apiKey) {
      showMessage('Kein API-Schlüssel gefunden. Bitte gehe zu den Einstellungen und gib deinen API-Schlüssel ein.', 'error');
      return;
    }
    
    const prompt = imagePromptInput.value.trim();
    if (!prompt) {
      showMessage('Bitte beschreibe, was auf dem Bild sein soll.', 'error');
      return;
    }
    
    // UI aktualisieren
    createImageButton.textContent = 'Bild wird erstellt...';
    createImageButton.disabled = true;
    
    try {
      // Kindgerechten Prompt erstellen
      const enhancedPrompt = makeChildFriendlyPrompt(prompt);
      
      // In echter Implementierung: Bild mit DALL-E 3 generieren
      // const imageUrl = await generateImage(enhancedPrompt, apiKey);
      
      // Für die Demo: Platzhalter-Bild verwenden
      const imageUrl = 'images/placeholder.png';
      
      // Pokale abziehen
      if (removeTrophies(5)) {
        // Bild anzeigen
        generatedImageElement.src = imageUrl;
        generatedImageElement.alt = 'Generiertes Bild: ' + prompt;
        
        // Ergebnis anzeigen
        imageResultElement.classList.remove('hidden');
        
        showMessage('Bild wurde erfolgreich erstellt!', 'success');
      } else {
        showMessage('Nicht genug Pokale!', 'error');
      }
    } catch (error) {
      console.error('Fehler bei der Bildgenerierung:', error);
      showMessage('Fehler bei der Bildgenerierung: ' + error.message, 'error');
    }
    
    // UI zurücksetzen
    updateTrophyCount();
  }
  
  // Sprachbefehl für Bildbeschreibung
  function handleSpeakPrompt() {
    // API-Key überprüfen
    if (!checkApiKey()) {
      return;
    }
    
    if (!audioRecorder) {
      showMessage('AudioRecorder nicht initialisiert. Bitte lade die Seite neu.', 'error');
      return;
    }
    
    audioRecorder.start();
  }
  
  // Bild speichern (simuliert)
  function handleSaveImage() {
    // In echter Implementierung: Bild herunterladen
    showMessage('Bild wurde gespeichert!', 'success');
  }
  
  // Neues Bild erstellen
  function handleNewImage() {
    imageResultElement.classList.add('hidden');
    imagePromptInput.value = '';
  }
  
  // Sprachbutton zurücksetzen
  function resetSpeakButton() {
    speakPromptButton.textContent = 'Per Sprache beschreiben';
    speakPromptButton.disabled = false;
  }
  
  // Kindgerechten Prompt erstellen
  function makeChildFriendlyPrompt(prompt) {
    // Basis-Modifikationen für kindgerechte Bilder
    const childFriendlyAdditions = [
      'kindgerecht',
      'fröhlich',
      'bunt',
      'im Cartoon-Stil',
      'für Kinder geeignet'
    ];
    
    // Zufällige Modifikation auswählen
    const randomAddition = childFriendlyAdditions[Math.floor(Math.random() * childFriendlyAdditions.length)];
    
    // Prompt erweitern
    return `${prompt}, ${randomAddition}, sicher für Kinder`;
  }
  
  // Initialisierung starten
  init();
});
