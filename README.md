# Mediengestaltung_Lese-Test
Gemeinsame Stoppuhr für einen Lesetest: eine Uhr, 40–50 Leute.

Zwei Seiten:

- **Teilnehmende** (`index.html`, `https://prof-klinger.github.io/Mediengestaltung_Lese-Test/`): sehen die laufende Uhr und können mit **Stopp** ihre Zeit als Runde abgeben. Kein Start, kein Reset.
- **Admin** (`admin.html`, `https://prof-klinger.github.io/Mediengestaltung_Lese-Test/admin.html`): Start, Stopp (Test), **CSV-Export** der Runden (Excel-kompatibel, Semikolon-getrennt) und Zurücksetzen (mit Sicherheitsabfrage). Diese URL nur der Lehrperson geben.

Beide Seiten nutzen dieselbe Firebase Realtime Database und sind damit in Echtzeit synchron.

## Einrichtung (einmalig)

1. **Firebase-Projekt anlegen:** [console.firebase.google.com](https://console.firebase.google.com) → Projekt anlegen (z. B. „mediengestaltung-lesetest“, Region Europe West).
2. **Web-App registrieren:** Projektübersicht → „Web-App (</>)“ hinzufügen → Konfiguration kopieren.
3. **firebase-config.js anpassen:** Platzhalter durch die eigenen Werte ersetzen.
4. **Realtime Database aktivieren:** Build → Realtime Database → Datenbank anlegen (Region europe-west1), Modus „Testmodus“.
5. **Zugriffsregeln setzen** (in Realtime Database → Rules):

   ```json
   {
     "rules": {
       "state": { ".read": true, ".write": true },
       "laps":   { ".read": true, ".write": true },
       "$other": { ".read": false, ".write": false }
     }
   }
   ```

   Hinweis: Der Testmodus läuft nach 30 Tagen ab; obige Regeln gelten dauerhaft.

## Veröffentlichen (GitHub Pages)

Repo → Settings → Pages → Source: „Deploy from a branch“ → Branch `main`, Ordner `/ (root)` → Save.

## Technik

- `index.html` (Teilnehmende), `admin.html` (Admin), `style.css`, `app.js` – kein Build-Schritt nötig.
- Firebase Realtime Database (modular, via CDN) synchronisiert Startzeit, Rundenzähler und Rundenliste.
- Die Rundennummer wird atomar per Transaction vergeben – gleichzeitig geklickte „Stopp“ erzeugen keine doppelten Nummern.
- Die Uhr nutzt die Serverzeit (über `serverTimeOffset` gemessen), nicht die lokalen Geräteuhren.
- CSV-Export mit UTF-8-BOM, Semikolon-getrennt: öffnet direkt korrekt in Excel/LibreOffice.
