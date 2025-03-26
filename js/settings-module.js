// settings-module.js - Hauptfunktionalität für das Einstellungen-Modul

document.addEventListener('DOMContentLoaded', function() {
  // Elemente aus dem DOM
  const apiKeyInput = document.getElementById('api-key');
  const saveApiKeyButton = document.getElementById('save-api-key');
  const difficultySelect = document.getElementById('difficulty');
  const timeLimitSelect = document.getElementById('time-limit');
  const saveSettingsButton = document.getElementById('save-settings');
  const colorThemeSelect = document.getElementById('color-theme');
  const fontSizeSelect = document.getElementById('font-size');
  const saveDisplayButton = document.getElementById('save-display');
  
  // Initialisierung
  function init() {
    // Gespeicherte Einstellungen laden
    loadSettings();
    
    // Event-Listener für Buttons
    saveApiKeyButton.addEventListener('click', handleSaveApiKey);
    saveSettingsButton.addEventListener('click', handleSaveSettings);
    saveDisplayButton.addEventListener('click', handleSaveDisplay);
    
    // Darstellungseinstellungen initial anwenden
    applyDisplaySettings();
  }
  
  // Gespeicherte Einstellungen laden
  function loadSettings() {
    // API-Key laden
    const apiKey = getApiKey();
    apiKeyInput.value = apiKey;
    
    // Spieleinstellungen laden
    const difficulty = getSetting('difficulty', 'medium');
    const timeLimit = getSetting('timeLimit', '8');
    difficultySelect.value = difficulty;
    timeLimitSelect.value = timeLimit;
    
    // Darstellungseinstellungen laden
    const colorTheme = getSetting('colorTheme', 'default');
    const fontSize = getSetting('fontSize', 'medium');
    colorThemeSelect.value = colorTheme;
    fontSizeSelect.value = fontSize;
  }
  
  // API-Key speichern
  function handleSaveApiKey() {
    const newApiKey = apiKeyInput.value.trim();
    
    // API-Key validieren (einfache Prüfung)
    if (!newApiKey) {
      showMessage('Bitte gib einen gültigen API-Schlüssel ein.', 'error');
      return;
    }
    
    // API-Key speichern
    if (saveApiKey(newApiKey)) {
      showMessage('API-Schlüssel wurde gespeichert!', 'success');
      
      // Optional: API-Key testen
      testApiKey(newApiKey);
    }
  }
  
  // Spieleinstellungen speichern
  function handleSaveSettings() {
    const settings = {
      difficulty: difficultySelect.value,
      timeLimit: timeLimitSelect.value
    };
    
    // Einstellungen speichern
    saveSettings(settings);
    showMessage('Spieleinstellungen wurden gespeichert!', 'success');
  }
  
  // Darstellungseinstellungen speichern
  function handleSaveDisplay() {
    const settings = {
      colorTheme: colorThemeSelect.value,
      fontSize: fontSizeSelect.value
    };
    
    // Einstellungen speichern
    saveSettings(settings);
    
    // Darstellungseinstellungen anwenden
    applyDisplaySettings();
    
    showMessage('Darstellungseinstellungen wurden gespeichert!', 'success');
  }
  
  // API-Key testen (optional)
  async function testApiKey(apiKey) {
    // Einfacher Test: Prüfen, ob der API-Key das richtige Format hat
    if (!apiKey.startsWith('sk-')) {
      showMessage('Warnung: Der API-Schlüssel scheint nicht das richtige Format zu haben. Er sollte mit "sk-" beginnen.', 'error');
      return;
    }
    
    // In einer vollständigen Implementierung könnte hier ein echter API-Test durchgeführt werden
    // Dies würde jedoch eine Anfrage an die OpenAI API erfordern, was Kosten verursachen könnte
    
    showMessage('API-Schlüssel hat das richtige Format.', 'success');
  }
  
  // Initialisierung starten
  init();
});
