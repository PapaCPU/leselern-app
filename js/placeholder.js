// placeholder.js - Erstellt ein Platzhalter-Bild für die App

document.addEventListener('DOMContentLoaded', function() {
  // Platzhalter-Bild für die App erstellen
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Bildgröße festlegen
  canvas.width = 400;
  canvas.height = 400;
  
  // Hintergrund
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Rahmen
  ctx.strokeStyle = '#4CAF50';
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
  
  // Text
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 24px Comic Sans MS, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Platzhalter-Bild', canvas.width / 2, canvas.height / 2 - 20);
  ctx.fillText('Hier erscheint später', canvas.width / 2, canvas.height / 2 + 20);
  ctx.fillText('ein generiertes Bild', canvas.width / 2, canvas.height / 2 + 60);
  
  // Als Bild speichern
  const dataUrl = canvas.toDataURL('image/png');
  
  // Bild herunterladen
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'placeholder.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
