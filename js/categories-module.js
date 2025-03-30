// categories-module.js - Funktionalität für die Kategorien und Wörter

// Kategorien
const categories = [
    'Tiere',
    'Essen',
    'Spielzeug',
    'Natur',
    'Fahrzeuge',
    'Sport',
    'Familie',
    'Schule',
    'Kleidung',
    'Farben',
    'Körper'
];

// Wörter pro Kategorie
let categoryWords = {
    'Tiere': ['Hund', 'Katze', 'Maus', 'Elefant', 'Löwe', 'Giraffe', 'Affe', 'Zebra', 'Vogel', 'Fisch'],
    'Essen': ['Apfel', 'Banane', 'Brot', 'Käse', 'Pizza', 'Nudeln', 'Suppe', 'Kuchen', 'Eis', 'Wasser'],
    'Spielzeug': ['Ball', 'Puppe', 'Auto', 'Bausteine', 'Puzzle', 'Teddy', 'Spiel', 'Karte', 'Roller', 'Buch'],
    'Natur': ['Baum', 'Blume', 'Sonne', 'Mond', 'Stern', 'Wolke', 'Regen', 'Berg', 'Fluss', 'Wald'],
    'Fahrzeuge': ['Auto', 'Bus', 'Zug', 'Flugzeug', 'Schiff', 'Fahrrad', 'Roller', 'Traktor', 'Taxi', 'Bahn'],
    'Sport': ['Fußball', 'Tennis', 'Schwimmen', 'Laufen', 'Tanzen', 'Reiten', 'Turnen', 'Ski', 'Ball', 'Tor'],
    'Familie': ['Mama', 'Papa', 'Bruder', 'Schwester', 'Oma', 'Opa', 'Tante', 'Onkel', 'Baby', 'Kind'],
    'Schule': ['Stift', 'Heft', 'Tafel', 'Buch', 'Lehrer', 'Klasse', 'Pause', 'Schule', 'Mappe', 'Tisch'],
    'Kleidung': ['Hose', 'Hemd', 'Kleid', 'Schuhe', 'Socken', 'Jacke', 'Mütze', 'Schal', 'Pullover', 'Mantel'],
    'Farben': ['Rot', 'Blau', 'Gelb', 'Grün', 'Schwarz', 'Weiß', 'Lila', 'Orange', 'Braun', 'Pink'],
    'Körper': ['Kopf', 'Arm', 'Bein', 'Hand', 'Fuß', 'Auge', 'Nase', 'Mund', 'Ohr', 'Haar']
};

// Kategorien-Modul initialisieren
function initCategoriesModule() {
    // Gespeicherte Wörter laden
    loadCategoryWords();
}

// Gespeicherte Wörter laden
function loadCategoryWords() {
    const savedCategoryWords = localStorage.getItem('categoryWords');
    if (savedCategoryWords) {
        try {
            const parsedWords = JSON.parse(savedCategoryWords);
            // Nur vorhandene Kategorien übernehmen
            for (const category in parsedWords) {
                if (categories.includes(category)) {
                    categoryWords[category] = parsedWords[category];
                }
            }
        } catch (error) {
            console.error('Fehler beim Laden der gespeicherten Wörter:', error);
        }
    }
}

// Wörter speichern
function saveCategoryWords() {
    localStorage.setItem('categoryWords', JSON.stringify(categoryWords));
}

// Zufälliges Wort aus einer Kategorie abrufen
function getRandomWordFromCategory(category) {
    if (!categoryWords[category] || categoryWords[category].length === 0) {
        // Wenn keine Wörter mehr in der Kategorie sind, neue generieren
        generateNewWordsForCategory(category);
    }
    
    const words = categoryWords[category];
    if (words.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

// Wort aus einer Kategorie entfernen und ein neues generieren
function removeWordAndGenerateNew(category, word) {
    if (!categoryWords[category]) return;
    
    // Wort aus der Kategorie entfernen
    const index = categoryWords[category].indexOf(word);
    if (index !== -1) {
        categoryWords[category].splice(index, 1);
    }
    
    // Neues Wort generieren und hinzufügen
    const newWord = generateNewWord(category);
    if (newWord) {
        categoryWords[category].push(newWord);
    }
    
    // Wörter speichern
    saveCategoryWords();
}

// Neue Wörter für eine Kategorie generieren
function generateNewWordsForCategory(category) {
    // Hier würde später die echte Wortgenerierung mit GPT erfolgen
    // Für jetzt verwenden wir vordefinierte Wörter
    
    const defaultWords = {
        'Tiere': ['Hund', 'Katze', 'Maus', 'Elefant', 'Löwe', 'Giraffe', 'Affe', 'Zebra', 'Vogel', 'Fisch'],
        'Essen': ['Apfel', 'Banane', 'Brot', 'Käse', 'Pizza', 'Nudeln', 'Suppe', 'Kuchen', 'Eis', 'Wasser'],
        'Spielzeug': ['Ball', 'Puppe', 'Auto', 'Bausteine', 'Puzzle', 'Teddy', 'Spiel', 'Karte', 'Roller', 'Buch'],
        'Natur': ['Baum', 'Blume', 'Sonne', 'Mond', 'Stern', 'Wolke', 'Regen', 'Berg', 'Fluss', 'Wald'],
        'Fahrzeuge': ['Auto', 'Bus', 'Zug', 'Flugzeug', 'Schiff', 'Fahrrad', 'Roller', 'Traktor', 'Taxi', 'Bahn'],
        'Sport': ['Fußball', 'Tennis', 'Schwimmen', 'Laufen', 'Tanzen', 'Reiten', 'Turnen', 'Ski', 'Ball', 'Tor'],
        'Familie': ['Mama', 'Papa', 'Bruder', 'Schwester', 'Oma', 'Opa', 'Tante', 'Onkel', 'Baby', 'Kind'],
        'Schule': ['Stift', 'Heft', 'Tafel', 'Buch', 'Lehrer', 'Klasse', 'Pause', 'Schule', 'Mappe', 'Tisch'],
        'Kleidung': ['Hose', 'Hemd', 'Kleid', 'Schuhe', 'Socken', 'Jacke', 'Mütze', 'Schal', 'Pullover', 'Mantel'],
        'Farben': ['Rot', 'Blau', 'Gelb', 'Grün', 'Schwarz', 'Weiß', 'Lila', 'Orange', 'Braun', 'Pink'],
        'Körper': ['Kopf', 'Arm', 'Bein', 'Hand', 'Fuß', 'Auge', 'Nase', 'Mund', 'Ohr', 'Haar']
    };
    
    if (defaultWords[category]) {
        categoryWords[category] = [...defaultWords[category]];
    } else {
        // Fallback für unbekannte Kategorien
        categoryWords[category] = ['Wort1', 'Wort2', 'Wort3', 'Wort4', 'Wort5', 'Wort6', 'Wort7', 'Wort8', 'Wort9', 'Wort10'];
    }
    
    // Wörter speichern
    saveCategoryWords();
}

// Neues Wort generieren
function generateNewWord(category) {
    // Hier würde später die echte Wortgenerierung mit GPT erfolgen
    // Für jetzt verwenden wir vordefinierte Wörter
    
    const additionalWords = {
        'Tiere': ['Pferd', 'Kuh', 'Schwein', 'Huhn', 'Ente', 'Frosch', 'Bär', 'Tiger', 'Eule', 'Igel'],
        'Essen': ['Milch', 'Saft', 'Keks', 'Obst', 'Gemüse', 'Fleisch', 'Fisch', 'Reis', 'Ei', 'Honig'],
        'Spielzeug': ['Lego', 'Zug', 'Schiff', 'Drachen', 'Knetmasse', 'Farben', 'Seil', 'Kreisel', 'Maske', 'Roboter'],
        'Natur': ['Gras', 'Blatt', 'Sand', 'Stein', 'Meer', 'See', 'Wind', 'Schnee', 'Eis', 'Feuer'],
        'Fahrzeuge': ['Lkw', 'Bagger', 'Kran', 'Boot', 'Hubschrauber', 'Rakete', 'Motorrad', 'Polizei', 'Feuerwehr', 'Rennwagen'],
        'Sport': ['Handball', 'Basketball', 'Hockey', 'Golf', 'Judo', 'Boxen', 'Yoga', 'Springen', 'Werfen', 'Klettern'],
        'Familie': ['Cousin', 'Cousine', 'Neffe', 'Nichte', 'Enkel', 'Enkelin', 'Eltern', 'Geschwister', 'Großeltern', 'Verwandte'],
        'Schule': ['Lineal', 'Schere', 'Kleber', 'Farbe', 'Rucksack', 'Mäppchen', 'Hausaufgabe', 'Rechnen', 'Lesen', 'Schreiben'],
        'Kleidung': ['Unterhose', 'T-Shirt', 'Rock', 'Stiefel', 'Sandalen', 'Handschuhe', 'Gürtel', 'Krawatte', 'Pyjama', 'Badeanzug'],
        'Farben': ['Grau', 'Türkis', 'Gold', 'Silber', 'Beige', 'Mint', 'Magenta', 'Violett', 'Indigo', 'Ocker'],
        'Körper': ['Finger', 'Zehe', 'Bauch', 'Rücken', 'Schulter', 'Knie', 'Ellbogen', 'Zahn', 'Zunge', 'Hals']
    };
    
    if (additionalWords[category]) {
        const randomIndex = Math.floor(Math.random() * additionalWords[category].length);
        return additionalWords[category][randomIndex];
    } else {
        // Fallback für unbekannte Kategorien
        return 'Neues Wort';
    }
}
