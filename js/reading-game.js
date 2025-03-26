// reading-game.js - Hauptfunktionalität für das Lesespiel

// Importieren der benötigten Module
document.addEventListener('DOMContentLoaded', function() {
  // Elemente aus dem DOM
  const currentWordElement = document.getElementById('current-word');
  const startReadingButton = document.getElementById('start-reading');
  const feedbackElement = document.getElementById('feedback');
  const timerElement = document.getElementById('timer');
  
  // Wortliste nach Schwierigkeitsgrad
  const wordLists = {
    easy: ['Hund', 'Katze', 'Ball', 'Haus', 'Auto', 'Baum', 'Buch', 'Tisch', 'Stuhl', 'Apfel'],
    medium: ['Schule', 'Garten', 'Fenster', 'Blume', 'Sonne', 'Wolke', 'Regen', 'Wasser', 'Feuer', 'Erde'],
    hard: ['Elefant', 'Giraffe', 'Computer', 'Telefon', 'Geburtstag', 'Schokolade', 'Spielplatz', 'Fahrrad', 'Schwimmbad', 'Bibliothek']
  };
  
  let currentWord = '';
  let audioRecorder = null;
  let isListening = false;
  
  // Initialisierung
  function init() {
    // Schwierigkeitsgrad aus den Einstellungen laden
    const difficulty = getSetting('difficulty', 'medium');
    
    // Zufälliges Wort anzeigen
    showRandomWord(difficulty);
    
    // AudioRecorder initialisieren
    initAudioRecorder();
    
    // Event-Listener für den Start-Button
    startReadingButton.addEventListener('click', toggleListening);
  }
  
  // Zufälliges Wort anzeigen
  function showRandomWord(difficulty) {
    const words = wordLists[difficulty] || wordLists.medium;
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];
    currentWordElement.textContent = currentWord;
  }
  
  // AudioRecorder initialisieren
  async function initAudioRecorder() {
    // Zeitlimit aus den Einstellungen laden
    const timeLimit = parseInt(getSetting('timeLimit', '8')) * 1000;
    
    audioRecorder = createAudioRecorder({
      timeLimit: timeLimit,
      onStart: () => {
        startReadingButton.textContent = 'Ich höre...';
        startReadingButton.disabled = true;
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';
      },
      onStop: async (audioBlob) => {
        startReadingButton.textContent = 'Verarbeite...';
        
        try {
          // API-Key überprüfen
          const apiKey = getApiKey();
          if (!apiKey) {
            showMessage('Kein API-Schlüssel gefunden. Bitte gehe zu den Einstellungen und gib deinen API-Schlüssel ein.', 'error');
            resetUI();
            return;
          }
          
          // Audio transkribieren
          const transcriptionResult = await transcribeAudio(audioBlob, apiKey);
          const transcription = transcriptionResult.text;
          
          // Aussprache überprüfen
          const result = await checkPronunciation(transcription, currentWord);
          
          if (result.correct) {
            showMessage(result.message, 'success');
            
            // Pokal hinzufügen
            addTrophies(1);
            
            // Neues Wort nach kurzer Verzögerung
            setTimeout(() => {
              const difficulty = getSetting('difficulty', 'medium');
              showRandomWord(difficulty);
              resetUI();
            }, 2000);
          } else {
            showMessage(result.message, 'error');
            resetUI();
          }
        } catch (error) {
          console.error('Fehler bei der Spracherkennung:', error);
          showMessage('Fehler bei der Spracherkennung: ' + error.message, 'error');
          resetUI();
        }
      },
      onError: (error) => {
        console.error('Fehler beim Aufnehmen:', error);
        showMessage('Fehler beim Aufnehmen: ' + error.message, 'error');
        resetUI();
      },
      onTimeUpdate: (elapsed, remaining) => {
        if (timerElement) {
          const remainingSeconds = Math.ceil(remaining / 1000);
          timerElement.textContent = `${remainingSeconds} Sekunden`;
        }
      }
    });
    
    try {
      await audioRecorder.init();
    } catch (error) {
      console.error('Fehler beim Initialisieren des AudioRecorders:', error);
      showMessage('Fehler beim Zugriff auf das Mikrofon. Bitte erlaube den Zugriff und versuche es erneut.', 'error');
    }
  }
  
  // Aufnahme starten/stoppen
  function toggleListening() {
    if (!audioRecorder) {
      showMessage('AudioRecorder nicht initialisiert. Bitte lade die Seite neu.', 'error');
      return;
    }
    
    if (isListening) {
      audioRecorder.stop();
      isListening = false;
    } else {
      if (audioRecorder.start()) {
        isListening = true;
      } else {
        showMessage('Fehler beim Starten der Aufnahme.', 'error');
      }
    }
  }
  
  // UI zurücksetzen
  function resetUI() {
    startReadingButton.textContent = 'Vorlesen starten';
    startReadingButton.disabled = false;
    isListening = false;
    if (timerElement) {
      timerElement.textContent = '';
    }
  }
  
  // Initialisierung starten
  init();
});
