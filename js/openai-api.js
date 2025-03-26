// openai-api.js - Funktionen für die Kommunikation mit der OpenAI API

// Konfiguration für die OpenAI API
const OPENAI_API_URL = 'https://api.openai.com/v1';

// Funktion zum Senden einer Anfrage an die OpenAI API
async function callOpenAI(endpoint, data, apiKey) {
  if (!apiKey) {
    throw new Error('Kein API-Schlüssel vorhanden');
  }

  try {
    const response = await fetch(`${OPENAI_API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API-Fehler: ${errorData.error?.message || 'Unbekannter Fehler'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fehler bei der API-Anfrage:', error);
    throw error;
  }
}

// Funktion zur Transkription von Audio mit GPT-4o mini
async function transcribeAudio(audioBlob, apiKey) {
  // Formular erstellen für die Audiodatei
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'gpt-4o-mini-transcribe');
  formData.append('language', 'de');

  try {
    const response = await fetch(`${OPENAI_API_URL}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Transkriptionsfehler: ${errorData.error?.message || 'Unbekannter Fehler'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fehler bei der Transkription:', error);
    throw error;
  }
}

// Funktion zur Generierung eines Bildes mit DALL-E 3
async function generateImage(prompt, apiKey) {
  const data = {
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    response_format: 'url'
  };

  try {
    const result = await callOpenAI('/images/generations', data, apiKey);
    return result.data[0].url;
  } catch (error) {
    console.error('Fehler bei der Bildgenerierung:', error);
    throw error;
  }
}

// Funktion zur Überprüfung der Aussprache
async function checkPronunciation(transcription, targetWord) {
  // Einfache Überprüfung: Enthält die Transkription das Zielwort?
  const transcriptionLower = transcription.toLowerCase().trim();
  const targetWordLower = targetWord.toLowerCase().trim();
  
  // Exakte Übereinstimmung
  if (transcriptionLower === targetWordLower) {
    return {
      correct: true,
      confidence: 1.0,
      message: 'Perfekt! Das war genau richtig!'
    };
  }
  
  // Teilweise Übereinstimmung (enthält das Wort)
  if (transcriptionLower.includes(targetWordLower)) {
    return {
      correct: true,
      confidence: 0.8,
      message: 'Gut gemacht! Das Wort war richtig!'
    };
  }
  
  // Levenshtein-Distanz berechnen für ähnliche Wörter
  const distance = levenshteinDistance(transcriptionLower, targetWordLower);
  const maxLength = Math.max(transcriptionLower.length, targetWordLower.length);
  const similarity = 1 - (distance / maxLength);
  
  // Wenn die Ähnlichkeit hoch genug ist, akzeptieren wir es als richtig
  if (similarity >= 0.7) {
    return {
      correct: true,
      confidence: similarity,
      message: 'Fast richtig! Gut gemacht!'
    };
  }
  
  return {
    correct: false,
    confidence: similarity,
    message: 'Versuche es noch einmal!'
  };
}

// Hilfsfunktion zur Berechnung der Levenshtein-Distanz
function levenshteinDistance(a, b) {
  const matrix = [];

  // Initialisierung der Matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Berechnung der Distanz
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // Ersetzen
          matrix[i][j - 1] + 1,     // Einfügen
          matrix[i - 1][j] + 1      // Löschen
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
