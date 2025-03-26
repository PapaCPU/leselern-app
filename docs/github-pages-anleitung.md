# Leselern-App für GitHub Pages

Diese Anleitung beschreibt, wie die Leselern-App auf GitHub Pages veröffentlicht werden kann.

## Voraussetzungen

- Ein GitHub-Konto
- Git auf deinem Computer installiert

## Schritte zur Veröffentlichung

1. **Repository erstellen**
   - Gehe zu [GitHub](https://github.com) und melde dich an
   - Klicke auf "New" oder "+" und dann "New repository"
   - Gib einen Namen für dein Repository ein (z.B. "leselern-app")
   - Wähle "Public" als Sichtbarkeit
   - Klicke auf "Create repository"

2. **Code hochladen**
   - Öffne ein Terminal oder eine Kommandozeile
   - Navigiere zum Verzeichnis der Leselern-App
   - Führe folgende Befehle aus:
     ```
     git init
     git add .
     git commit -m "Erste Version der Leselern-App"
     git branch -M main
     git remote add origin https://github.com/DEIN_BENUTZERNAME/leselern-app.git
     git push -u origin main
     ```
   - Ersetze "DEIN_BENUTZERNAME" durch deinen GitHub-Benutzernamen

3. **GitHub Pages aktivieren**
   - Gehe zu deinem Repository auf GitHub
   - Klicke auf "Settings"
   - Scrolle nach unten zu "GitHub Pages"
   - Wähle unter "Source" den Branch "main" und den Ordner "/" (Root)
   - Klicke auf "Save"
   - Warte einen Moment, bis die Seite veröffentlicht ist
   - Die URL deiner App wird angezeigt (normalerweise https://DEIN_BENUTZERNAME.github.io/leselern-app/)

## Wichtige Hinweise

- Die App verwendet den Local Storage des Browsers, um den API-Schlüssel und Einstellungen zu speichern
- Der API-Schlüssel wird nur lokal gespeichert und nicht an den Server gesendet
- Für die Nutzung der OpenAI API (GPT-4o mini und DALL-E 3) ist ein gültiger API-Schlüssel erforderlich
- Die App funktioniert nur in modernen Browsern mit Unterstützung für Web Speech API und Local Storage

## Anpassungen für GitHub Pages

Die App ist bereits für GitHub Pages optimiert. Alle Pfade sind relativ, sodass die App ohne Änderungen auf GitHub Pages funktioniert.
