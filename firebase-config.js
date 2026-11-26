// ============================================================
// Firebase-Konfiguration
// ============================================================
// 1. Gehe zu https://console.firebase.google.com und lege ein
//    Projekt an (z. B. "lese-test").
// 2. Projekt-App "Web" hinzufuegen und die Konfiguration kopieren.
// 3. In der Konsole: Build -> Realtime Database -> Datenbank
//    anlegen.  Modus "Test" reicht fuer den Unterricht;
//    Regeln siehe README.
// 4. Die Werte unten durch die eigenen ersetzen.
// ============================================================

export const firebaseConfig = {
  apiKey: "DEIN_API_KEY",
  authDomain: "DEIN_PROJEKT.firebaseapp.com",
  databaseURL: "https://DEIN_PROJEKT-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "DEIN_PROJEKT",
  storageBucket: "DEIN_PROJEKT.appspot.com",
  messagingSenderId: "DEIN_SENDER_ID",
  appId: "DEINE_APP_ID"
};
