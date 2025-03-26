// minimal.js - Minimales JavaScript für API-Kommunikation und Local Storage

// API-Key-Funktionen
function saveApiKey(apiKey) {
  if (!apiKey || apiKey.trim() === '') {
    showMessage('Bitte gib einen gültigen API-Schlüssel ein.', 'error');
    return false;
  }
  
  try {
    localStorage.setItem('apiKey', apiKey.trim());
    showMessage('API-Schlüssel wurde gespeichert!', 'success');
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
  showMessage('Einstellungen wurden gespeichert!', 'success');
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
  
  // API-Key-Speichern-Button
  const saveApiKeyButton = document.getElementById('save-api-key');
  if (saveApiKeyButton) {
    saveApiKeyButton.addEventListener('click', function() {
      const apiKey = document.getElementById('api-key').value;
      saveApiKey(apiKey);
    });
  }
  
  // Einstellungen-Speichern-Button
  const saveSettingsButton = document.getElementById('save-settings');
  if (saveSettingsButton) {
    saveSettingsButton.addEventListener('click', function() {
      const settings = {
        difficulty: document.getElementById('difficulty').value,
        timeLimit: document.getElementById('time-limit').value
      };
      saveSettings(settings);
    });
  }
  
  // Darstellung-Speichern-Button
  const saveDisplayButton = document.getElementById('save-display');
  if (saveDisplayButton) {
    saveDisplayButton.addEventListener('click', function() {
      const settings = {
        colorTheme: document.getElementById('color-theme').value,
        fontSize: document.getElementById('font-size').value
      };
      saveSettings(settings);
      applyDisplaySettings();
    });
  }
  
  // Darstellungseinstellungen anwenden
  applyDisplaySettings();
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
