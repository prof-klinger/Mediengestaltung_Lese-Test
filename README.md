# Mediengestaltung_Lese-Test
Gemeinsame Stoppuhr für einen Lesetest: eine Uhr, 40–50 Leute.

Jede:r Besucher:in sieht dieselbe Stoppuhr in Echtzeit. „Start“ startet den Lauf für alle, „Stopp“ legt die aktuelle Zeit als Runde ab – die Uhr läuft weiter. Zurücksetzen leert Runden und Uhr.

## Einrichtung (einmalig)

1. **Firebase-Projekt anlegen:** [console.firebase.google.com](https://console.firebase.google.com) → Projekt anlegen (z. B. „lese-test“, Region Europe West).
2. **Web-App registrieren:** Projektübersicht → „Web-App (</>)“ hinzufügen → Konfiguration kopieren.
3. **firebase-config.js anpassen:** Im Repo die Platzhalter in `firebase-config.js` durch die eigenen Werte ersetzen.
4. **Realtime Database aktivieren:** Build → Realtime Database → Datenbank anlegen (Region europe-west1).
5. **Zugriffsregeln setzen** (Test-Regeln für den Unterricht, schreibgeschützt außer den Stoppuhr-Daten):

   ```json
   {
     "rules": {
       "state": { ".read": true, ".write": true },
       "laps":   { ".read": true, ".write": true },
       "$other": { ".read": false, ".write": false }
     }
   }
   ```
   Die Testmodus-Regeln von Firebase (frei schreibbar) funktionieren auch, sollten aber für den Produktivbetrieb auf obige Regeln eingegrenzt werden.

## Veröffentlichen (GitHub Pages)

Repo → Settings → Pages → Source: „Deploy from a branch“ → Branch `main`, Ordner `/ (root)` → Save.
Danach ist die Seite erreichbar unter:
`https://prof-klinger.github.io/Mediengestaltung_Lese-Test/`

## Technik

- `index.html`, `style.css`, `app.js` – Frontend, keine Build-Schritte nötig.
- Firebase Realtime Database (modular, via CDN) synchronisiert Startzeit, Rundenzähler und Rundenliste in Echtzeit.
- Die Rundennummer wird atomar per Transaction vergeben, damit gleichzeitig geklickte „Stopp“ keine doppelten Nummern erzeugen.
- Die Uhr nutzt die Serverzeit (gemessen per `serverTimeOffset`), nicht die lokale Uhr der Geräte.
