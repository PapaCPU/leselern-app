// Einfaches Platzhalter-Bild für die App
const fs = require('fs');
const { createCanvas } = require('canvas');

// Canvas erstellen
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext('2d');

// Hintergrund
ctx.fillStyle = '#f0f0f0';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Rahmen
ctx.strokeStyle = '#4CAF50';
ctx.lineWidth = 10;
ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

// Text
ctx.fillStyle = '#333333';
ctx.font = 'bold 24px sans-serif';
ctx.textAlign = 'center';
ctx.fillText('Platzhalter-Bild', canvas.width / 2, canvas.height / 2 - 20);
ctx.fillText('Hier erscheint später', canvas.width / 2, canvas.height / 2 + 20);
ctx.fillText('ein generiertes Bild', canvas.width / 2, canvas.height / 2 + 60);

// Als PNG speichern
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('/home/ubuntu/leselern-app/images/placeholder.png', buffer);

console.log('Platzhalter-Bild wurde erstellt: /home/ubuntu/leselern-app/images/placeholder.png');
