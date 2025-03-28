// audio-recorder.js - Funktionen für die Audioaufnahme und -verarbeitung

// Klasse für die Audioaufnahme
class AudioRecorder {
  constructor(options = {}) {
    this.options = {
      timeLimit: options.timeLimit || 3000, // Standardmäßig 3 Sekunden (statt 8)
      silenceDetection: options.silenceDetection !== false, // Standardmäßig aktiviert
      silenceThreshold: options.silenceThreshold || 0.01, // Schwellenwert für Stille
      silenceTime: options.silenceTime || 2000, // 2 Sekunden Stille für automatisches Stoppen
      mimeType: 'audio/webm',
      audioBitsPerSecond: 128000
    };
    
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.stream = null;
    this.startTime = null;
    this.timer = null;
    this.silenceTimer = null;
    this.audioContext = null;
    this.analyser = null;
    this.dataArray = null;
    this.silenceStart = null;
    
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
        this.stopSilenceDetection();
      };
      
      // Stille-Erkennung initialisieren, wenn aktiviert
      if (this.options.silenceDetection) {
        this.initSilenceDetection();
      }
      
      return true;
    } catch (error) {
      console.error('Fehler beim Initialisieren des AudioRecorders:', error);
      this.onError(error);
      return false;
    }
  }
  
  // Stille-Erkennung initialisieren
  initSilenceDetection() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);
      
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
    } catch (error) {
      console.error('Fehler beim Initialisieren der Stille-Erkennung:', error);
      // Fallback: Stille-Erkennung deaktivieren
      this.options.silenceDetection = false;
    }
  }
  
  // Stille-Erkennung starten
  startSilenceDetection() {
    if (!this.options.silenceDetection || !this.analyser) return;
    
    this.silenceTimer = setInterval(() => {
      this.analyser.getByteFrequencyData(this.dataArray);
      
      // Durchschnittliche Lautstärke berechnen
      let sum = 0;
      for (let i = 0; i < this.dataArray.length; i++) {
        sum += this.dataArray[i];
      }
      const average = sum / this.dataArray.length / 255; // Normalisieren auf 0-1
      
      // Stille erkennen
      if (average < this.options.silenceThreshold) {
        if (!this.silenceStart) {
          this.silenceStart = Date.now();
        } else if (Date.now() - this.silenceStart >= this.options.silenceTime) {
          // Stille für die angegebene Zeit erkannt, Aufnahme stoppen
          this.stop();
        }
      } else {
        // Kein Stille mehr, Timer zurücksetzen
        this.silenceStart = null;
      }
    }, 100);
  }
  
  // Stille-Erkennung stoppen
  stopSilenceDetection() {
    if (this.silenceTimer) {
      clearInterval(this.silenceTimer);
      this.silenceTimer = null;
    }
    this.silenceStart = null;
  }
  
  // Aufnahme starten
  start() {
    if (!this.mediaRecorder || this.isRecording) return false;
    
    this.audioChunks = [];
    this.mediaRecorder.start();
    this.isRecording = true;
    this.startTime = Date.now();
    this.startTimer();
    
    // Stille-Erkennung starten, wenn aktiviert
    if (this.options.silenceDetection) {
      this.startSilenceDetection();
    }
    
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
    this.stopSilenceDetection();
    return true;
  }
  
  // Aufnahme abbrechen
  cancel() {
    if (!this.mediaRecorder || !this.isRecording) return false;
    
    this.mediaRecorder.stop();
    this.audioChunks = [];
    this.isRecording = false;
    this.stopTimer();
    this.stopSilenceDetection();
    return true;
  }
  
  // Ressourcen freigeben
  release() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.mediaRecorder = null;
    this.stopTimer();
    this.stopSilenceDetection();
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
