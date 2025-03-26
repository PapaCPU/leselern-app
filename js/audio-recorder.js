// audio-recorder.js - Funktionen für die Audioaufnahme und -verarbeitung

// Klasse für die Audioaufnahme
class AudioRecorder {
  constructor(options = {}) {
    this.options = {
      timeLimit: options.timeLimit || 8000, // Standardmäßig 8 Sekunden
      mimeType: 'audio/webm',
      audioBitsPerSecond: 128000
    };
    
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.stream = null;
    this.startTime = null;
    this.timer = null;
    
    // Event-Callbacks
    this.onStart = options.onStart || (() => {});
    this.onStop = options.onStop || (() => {});
    this.onDataAvailable = options.onDataAvailable || (() => {});
    this.onError = options.onError || (() => {});
    this.onTimeUpdate = options.onTimeUpdate || (() => {});
  }
  
  // Mikrofon-Zugriff anfordern und Aufnahme initialisieren
  async init() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // MediaRecorder erstellen
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: this.options.mimeType,
        audioBitsPerSecond: this.options.audioBitsPerSecond
      });
      
      // Event-Listener für Daten
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      // Event-Listener für Stopp
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: this.options.mimeType });
        this.onStop(audioBlob);
        this.isRecording = false;
        this.stopTimer();
      };
      
      return true;
    } catch (error) {
      console.error('Fehler beim Initialisieren des AudioRecorders:', error);
      this.onError(error);
      return false;
    }
  }
  
  // Aufnahme starten
  start() {
    if (!this.mediaRecorder || this.isRecording) return false;
    
    this.audioChunks = [];
    this.mediaRecorder.start();
    this.isRecording = true;
    this.startTime = Date.now();
    this.startTimer();
    this.onStart();
    
    // Automatisches Stoppen nach Zeitlimit
    setTimeout(() => {
      if (this.isRecording) {
        this.stop();
      }
    }, this.options.timeLimit);
    
    return true;
  }
  
  // Aufnahme stoppen
  stop() {
    if (!this.mediaRecorder || !this.isRecording) return false;
    
    this.mediaRecorder.stop();
    this.stopTimer();
    return true;
  }
  
  // Aufnahme abbrechen
  cancel() {
    if (!this.mediaRecorder || !this.isRecording) return false;
    
    this.mediaRecorder.stop();
    this.audioChunks = [];
    this.isRecording = false;
    this.stopTimer();
    return true;
  }
  
  // Ressourcen freigeben
  release() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    this.mediaRecorder = null;
    this.stopTimer();
  }
  
  // Timer für die Zeitanzeige starten
  startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => {
      const elapsed = Date.now() - this.startTime;
      const remaining = Math.max(0, this.options.timeLimit - elapsed);
      this.onTimeUpdate(elapsed, remaining);
    }, 100);
  }
  
  // Timer stoppen
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

// Funktion zum Erstellen eines AudioRecorders
function createAudioRecorder(options) {
  return new AudioRecorder(options);
}
