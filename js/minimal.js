// minimal.js - Minimale JavaScript-Funktionalität für die Leselern-App

// Globale Variablen
let apiKey = '';
let trophyCount = 0;
let difficultyLevel = 'easy';
let recordingTime = 3000; // 3 Sekunden
let silenceDetection = true;
let trophiesDisabled = false;

// Beim Laden der Seite ausführen
document.addEventListener('DOMContentLoaded', function() {
    // Gespeicherte Werte laden
    loadSettings();
    
    // Trophäen-Anzahl anzeigen
    updateTrophyDisplay();
});

// Einstellungen aus dem Local Storage laden
function loadSettings() {
    // API-Key laden
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
        apiKey = savedApiKey;
    }
    
    // Trophäen-Anzahl laden
    const savedTrophyCount = localStorage.getItem('trophyCount');
    if (savedTrophyCount !== null) {
        trophyCount = parseInt(savedTrophyCount, 10);
    }
    
    // Schwierigkeitsgrad laden
    const savedDifficulty = localStorage.getItem('difficultyLevel');
    if (savedDifficulty) {
        difficultyLevel = savedDifficulty;
    }
    
    // Aufnahmezeit laden
    const savedRecordingTime = localStorage.getItem('recordingTime');
    if (savedRecordingTime !== null) {
        recordingTime = parseInt(savedRecordingTime, 10);
    }
    
    // Stille-Erkennung laden
    const savedSilenceDetection = localStorage.getItem('silenceDetection');
    if (savedSilenceDetection !== null) {
        silenceDetection = savedSilenceDetection === 'true';
    }
    
    // Trophäen-Deaktivierung laden
    const savedTrophiesDisabled = localStorage.getItem('trophiesDisabled');
    if (savedTrophiesDisabled !== null) {
        trophiesDisabled = savedTrophiesDisabled === 'true';
    }
}

// API-Key speichern
function saveApiKey(key) {
    apiKey = key;
    localStorage.setItem('apiKey', key);
    console.log('API-Key gespeichert:', key);
}

// API-Key abrufen
function getApiKey() {
    return apiKey;
}

// API-Key überprüfen
function checkApiKey() {
    if (!apiKey) {
        showMessage('Bitte gib zuerst deinen API-Key in den Einstellungen ein.', 'error');
        return false;
    }
    return true;
}

// Trophäen hinzufügen
function addTrophies(count) {
    if (trophiesDisabled) return;
    
    trophyCount += count;
    localStorage.setItem('trophyCount', trophyCount.toString());
    updateTrophyDisplay();
    
    showMessage(`Du hast ${count} Pokal${count !== 1 ? 'e' : ''} gewonnen!`, 'success');
}

// Trophäen ausgeben
function spendTrophies(count) {
    if (trophyCount < count) {
        showMessage(`Du hast nicht genug Pokale. Du brauchst ${count} Pokale.`, 'error');
        return false;
    }
    
    trophyCount -= count;
    localStorage.setItem('trophyCount', trophyCount.toString());
    updateTrophyDisplay();
    
    return true;
}

// Trophäen-Anzeige aktualisieren
function updateTrophyDisplay() {
    const trophyCountElements = document.querySelectorAll('#trophy-count');
    trophyCountElements.forEach(element => {
        element.textContent = trophyCount;
    });
}

// Schwierigkeitsgrad speichern
function saveDifficulty(level) {
    difficultyLevel = level;
    localStorage.setItem('difficultyLevel', level);
}

// Schwierigkeitsgrad abrufen
function getDifficulty() {
    return difficultyLevel;
}

// Aufnahmezeit speichern
function saveRecordingTime(time) {
    recordingTime = time;
    localStorage.setItem('recordingTime', time.toString());
}

// Aufnahmezeit abrufen
function getRecordingTime() {
    return recordingTime;
}

// Stille-Erkennung speichern
function saveSilenceDetection(enabled) {
    silenceDetection = enabled;
    localStorage.setItem('silenceDetection', enabled.toString());
}

// Stille-Erkennung abrufen
function getSilenceDetection() {
    return silenceDetection;
}

// Trophäen-Deaktivierung speichern
function saveTrophiesDisabled(disabled) {
    trophiesDisabled = disabled;
    localStorage.setItem('trophiesDisabled', disabled.toString());
}

// Trophäen-Deaktivierung abrufen
function areTrophiesDisabled() {
    return trophiesDisabled;
}

// Nachricht anzeigen
function showMessage(message, type = 'info') {
    const feedbackElements = document.querySelectorAll('.feedback');
    
    feedbackElements.forEach(element => {
        element.textContent = message;
        element.className = 'feedback ' + type;
        
        // Nach 3 Sekunden ausblenden
        setTimeout(() => {
            element.textContent = '';
            element.className = 'feedback';
        }, 3000);
    });
}

// Referenzbild speichern
function saveReferenceImage(name, dataUrl) {
    localStorage.setItem('refImage_' + name, dataUrl);
}

// Referenzbild abrufen
function getReferenceImage(name) {
    return localStorage.getItem('refImage_' + name);
}

// Alle Referenzbilder abrufen
function getAllReferenceImages() {
    const images = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('refImage_')) {
            const name = key.replace('refImage_', '');
            images[name] = localStorage.getItem(key);
        }
    }
    return images;
}

// Zufällige Zahl zwischen min und max generieren
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
