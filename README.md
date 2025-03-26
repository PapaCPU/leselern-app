# Leselern-App

Eine interaktive Lese-Lern-App für Kinder, die mit Hilfe von OpenAI's GPT-4o mini und DALL-E 3 das Lesenlernen spielerisch gestaltet.

## Funktionen

- **Lesespiel**: Kinder lesen einfache Wörter vor und die App überprüft die Aussprache mit GPT-4o mini
- **Bild-zu-Wort-Spiel**: DALL-E 3 generierte Bilder werden angezeigt und Kinder müssen das passende Wort erraten
- **Wort-Kategorien**: Wörter nach Themen wie Tiere, Essen oder Farben sortiert
- **Geschichten-Lesen**: Kurze, einfache Texte zum Vorlesen
- **Pokale einlösen**: Für richtige Antworten gibt es Pokale, die für Bildgenerierungen eingelöst werden können
- **Einstellungen**: Anpassung von Schwierigkeitsgrad, Zeitlimit und Design

## Technische Details

- Entwickelt mit HTML, CSS und minimalem JavaScript
- Verwendet die OpenAI API für GPT-4o mini (Spracherkennung) und DALL-E 3 (Bildgenerierung)
- Speichert den API-Schlüssel und Einstellungen im Local Storage des Browsers
- Optimiert für die Veröffentlichung auf GitHub Pages

## Voraussetzungen

- Ein moderner Webbrowser mit Unterstützung für Web Speech API und Local Storage
- Ein gültiger OpenAI API-Schlüssel mit Zugriff auf GPT-4o mini und DALL-E 3

## Installation

1. Repository klonen oder als ZIP-Datei herunterladen
2. Die Dateien auf einem Webserver oder lokal bereitstellen
3. Die App im Browser öffnen
4. In den Einstellungen den OpenAI API-Schlüssel eingeben

## Veröffentlichung auf GitHub Pages

Eine detaillierte Anleitung zur Veröffentlichung auf GitHub Pages findest du in der Datei [docs/github-pages-anleitung.md](docs/github-pages-anleitung.md).

## Datenschutz

- Der API-Schlüssel wird nur lokal im Browser gespeichert und nicht an Server gesendet
- Audiodaten werden nur für die Dauer der Spracherkennung verwendet und nicht gespeichert
- Generierte Bilder können lokal gespeichert werden

## Lizenz

Diese App ist für den persönlichen Gebrauch bestimmt. Die Verwendung der OpenAI API unterliegt den [OpenAI Nutzungsbedingungen](https://openai.com/policies/terms-of-use).
