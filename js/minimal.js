// minimal.js - Minimales JavaScript für API-Kommunikation und Local Storage

// API-Key-Funktionen
function saveApiKey(apiKey) {
  if (!apiKey || apiKey.trim() === '') {
    showMessage('Bitte gib einen gültigen API-Schlüssel ein.', 'error');
    return false;
  }
  
  try {
    localStorage.setItem('apiKey', apiKey.trim());
    // Erfolgsmeldung wird nur in settings-module.js angezeigt, nicht hier
    return true;
  } catch (error) {
    console.error('Fehler beim Speichern des API-Schlüssels:', error);
    showMessage('Fehler beim Speichern des API-Schlüssels.', 'error');
    return false;
  }
}

function getApiKey() {
  return localStorage.getItem('apiKey') || '';
}

function checkApiKey() {
  const apiKey = getApiKey();
  if (!apiKey) {
    showMessage('Kein API-Schlüssel gefunden. Bitte gehe zu den Einstellungen und gib deinen API-Schlüssel ein.', 'error');
    return false;
  }
  return true;
}

// Google API-Key-Funktionen
function saveGoogleApiKey(apiKey) {
  if (!apiKey || apiKey.trim() === '') {
    showMessage('Bitte gib einen gültigen Google API-Schlüssel ein.', 'error');
    return false;
  }
  
  try {
    localStorage.setItem('googleApiKey', apiKey.trim());
    return true;
  } catch (error) {
    console.error('Fehler beim Speichern des Google API-Schlüssels:', error);
    showMessage('Fehler beim Speichern des Google API-Schlüssels.', 'error');
    return false;
  }
}

function getGoogleApiKey() {
  return localStorage.getItem('googleApiKey') || '';
}

function checkGoogleApiKey() {
  const apiKey = getGoogleApiKey();
  if (!apiKey) {
    showMessage('Kein Google API-Schlüssel gefunden. Bitte gehe zu den Einstellungen und gib deinen Google API-Schlüssel ein.', 'error');
    return false;
  }
  return true;
}

// Trophäen-Funktionen
function getTrophyCount() {
  return parseInt(localStorage.getItem('trophyCount') || '0');
}

function addTrophies(count) {
  const currentCount = getTrophyCount();
  const newCount = currentCount + count;
  localStorage.setItem('trophyCount', newCount.toString());
  updateTrophyDisplay();
  return newCount;
}

function removeTrophies(count) {
  const currentCount = getTrophyCount();
  if (currentCount < count) {
    showMessage('Nicht genug Pokale!', 'error');
    return false;
  }
  
  const newCount = currentCount - count;
  localStorage.setItem('trophyCount', newCount.toString());
  updateTrophyDisplay();
  return true;
}

function updateTrophyDisplay() {
  const trophyCountElement = document.getElementById('trophy-count');
  if (trophyCountElement) {
    trophyCountElement.textContent = getTrophyCount();
  }
}

// Einstellungs-Funktionen
function saveSettings(settings) {
  for (const [key, value] of Object.entries(settings)) {
    localStorage.setItem(key, value);
  }
  // Erfolgsmeldung wird nur in settings-module.js angezeigt, nicht hier
  return true;
}

function getSetting(key, defaultValue) {
  return localStorage.getItem(key) || defaultValue;
}

// Hilfsfunktionen
function showMessage(message, type) {
  const feedbackElement = document.getElementById('feedback');
  if (feedbackElement) {
    feedbackElement.textContent = message;
    feedbackElement.className = 'feedback feedback-' + (type || 'info');
    
    // Nachricht nach einiger Zeit ausblenden
    setTimeout(() => {
      feedbackElement.textContent = '';
      feedbackElement.className = 'feedback';
    }, 3000);
  } else {
    alert(message);
  }
}

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', function() {
  // Trophäen-Anzeige aktualisieren
  updateTrophyDisplay();
  
  // Darstellungseinstellungen anwenden
  applyDisplaySettings();
  
  // Die Event-Listener für die Buttons werden in settings-module.js definiert,
  // um doppelte Event-Listener zu vermeiden
});

// Darstellungseinstellungen anwenden
function applyDisplaySettings() {
  const colorTheme = getSetting('colorTheme', 'default');
  const fontSize = getSetting('fontSize', 'medium');
  
  // Farbschema anwenden
  document.body.classList.remove('theme-default', 'theme-blue', 'theme-pink', 'theme-orange');
  document.body.classList.add('theme-' + colorTheme);
  
  // Schriftgröße anwenden
  document.body.classList.remove('font-small', 'font-medium', 'font-large');
  document.body.classList.add('font-' + fontSize);
}

// Funktion zum Prüfen, ob Pokale für Tests deaktiviert sind
function areTrophiesDisabled() {
  return getSetting('disableTrophies', 'false') === 'true';
}
