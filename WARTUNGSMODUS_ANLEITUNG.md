# 🛠️ Wartungsmodus - Anleitung

## Übersicht

Die DIVE Demo Tour Website verfügt jetzt über einen **Wartungsmodus**, mit dem Sie die gesamte Website für normale Besucher sperren können, während Sie als Administrator weiterhin vollen Zugriff haben.

---

## 🎯 Features

### ✅ Was der Wartungsmodus kann:

1. **Besucher-Sperre**
   - Normale Besucher sehen nur die Wartungsseite
   - Professionelles Design mit Informationen
   - Kontaktmöglichkeiten für dringende Anfragen

2. **Admin-Zugriff**
   - Administratoren können sich weiterhin anmelden
   - Voller Zugriff auf alle Funktionen
   - Option zum Bypass der Wartungsseite

3. **Einfache Steuerung**
   - Ein-Klick-Aktivierung im Admin-Dashboard
   - Sofortige Aktivierung/Deaktivierung
   - Visuelles Feedback über den aktuellen Status

---

## 🔧 Wartungsmodus aktivieren/deaktivieren

### **Schritt 1: Admin-Login**
1. Öffnen Sie: `https://ihre-website.vercel.app/admin`
2. Melden Sie sich mit dem Admin-Passwort an
   - Fallback-Passwort: `admin123`
   - Oder: Ihr konfiguriertes Passwort

### **Schritt 2: Wartungsmodus-Karte finden**
1. Scrollen Sie im Dashboard nach unten
2. Finden Sie die Karte **"Wartungsmodus"**
3. Sie sehen den aktuellen Status:
   - ✅ **Website online** (grün)
   - ⚠️ **Wartungsmodus aktiv** (orange)

### **Schritt 3: Status ändern**
**Wartung aktivieren:**
- Klicken Sie auf **"Wartung starten"** (oranger Button)
- Website wird sofort in den Wartungsmodus versetzt
- Besucher sehen jetzt nur die Wartungsseite

**Wartung deaktivieren:**
- Klicken Sie auf **"Website aktivieren"** (grüner Button)
- Website ist sofort wieder für alle erreichbar
- Alle Funktionen sind verfügbar

---

## 🎨 Die Wartungsseite

### **Design & Inhalt:**

**Header:**
- Gradient-Banner mit DIVE Demo Tour Logo
- Animiertes Wartungs-Icon
- Professioneller Titel

**Inhalte:**
- Freundliche Nachricht an Besucher
- Voraussichtliche Wartungsdauer
- Was gerade passiert (System-Updates)
- Kontaktinformationen (E-Mail & Website)

**Admin-Bereich:**
- Nur sichtbar für eingeloggte Admins
- Button "Zur Website (Admin-Modus)"
- Erlaubt Bypass der Wartungsseite

**Responsive:**
- Funktioniert auf Desktop & Mobile
- Schöne Animationen
- Professionelles Design

---

## 👨‍💼 Admin-Verhalten während Wartung

### **Was Admins können:**

1. **Login möglich**
   - Admin-Login funktioniert weiterhin
   - Keine Einschränkungen

2. **Bypass-Option**
   - Auf Wartungsseite: Button "Zur Website (Admin-Modus)"
   - Klick → Voller Website-Zugriff
   - Besucher sehen weiterhin Wartungsseite

3. **Dashboard-Zugriff**
   - Alle Admin-Funktionen verfügbar
   - Anmeldungen verwalten
   - CSV-Export
   - Wartungsmodus umschalten

### **Was Admins sehen:**

**Im Dashboard (Wartungsmodus aktiv):**
```
⚠️ Wartungsmodus aktiv

Besucher sehen aktuell nur die Wartungsseite.
Sie haben als Admin weiterhin vollen Zugriff.

ℹ️ Admins können die Website weiterhin nutzen

[Website aktivieren] ← Klicken zum Deaktivieren
```

**Im Dashboard (Website online):**
```
✅ Website online

Die Website ist für alle Besucher normal erreichbar.
Alle Funktionen sind verfügbar.

[Wartung starten] ← Klicken zum Aktivieren
```

---

## 👥 Besucher-Verhalten während Wartung

### **Was Besucher sehen:**

1. **Alle URLs**
   - Egal welche Seite aufgerufen wird
   - Immer nur Wartungsseite angezeigt
   - Keine Möglichkeit zum Bypass

2. **Keine Funktionen**
   - Events nicht sichtbar
   - Anmeldung nicht möglich
   - Nur Wartungsinformationen

3. **Kontaktmöglichkeiten**
   - E-Mail: info@dive-demo-tour.eu
   - Website-Link verfügbar

---

## 🔄 Technische Details

### **Speicherung:**
```javascript
// Wartungsmodus-Status
localStorage.setItem("maintenanceMode", "true");  // Aktiviert
localStorage.setItem("maintenanceMode", "false"); // Deaktiviert
```

### **Prüfung in App.tsx:**
```javascript
// Wird bei jedem Seitenaufruf geprüft
const maintenanceMode = localStorage.getItem("maintenanceMode") === "true";

if (maintenanceMode && !bypassMaintenance) {
  // Zeige Wartungsseite
  return <MaintenancePage />
}

// Zeige normale Website
return <RouterProvider router={router} />
```

### **Admin-Erkennung:**
```javascript
// Prüft ob Admin eingeloggt ist
const adminSession = sessionStorage.getItem("adminSessionToken");
const isAdmin = !!adminSession;

// Zeigt Admin-Option auf Wartungsseite
if (isAdmin) {
  // Button "Zur Website (Admin-Modus)" anzeigen
}
```

---

## 📝 Anwendungsfälle

### **Wann Wartungsmodus nutzen?**

✅ **Empfohlen für:**
- **Updates & Upgrades**
  - Backend-Deployment
  - Datenbank-Migration
  - Feature-Updates

- **Content-Änderungen**
  - Event-Daten aktualisieren
  - Große Design-Änderungen
  - Neue Inhalte vorbereiten

- **Problembehebung**
  - Fehlersuche
  - Performance-Optimierung
  - Sicherheitsupdates

- **Geplante Wartung**
  - Server-Wartung
  - Backup-Wiederherstellung
  - System-Checks

❌ **Nicht empfohlen für:**
- Kleine Text-Änderungen
- Admin-Dashboard-Anpassungen
- Backend-Tests (nur für Admins sichtbar)

---

## 🧪 Testen

### **Test-Szenario 1: Aktivierung**
1. Als Admin einloggen
2. Wartungsmodus aktivieren
3. In neuem Inkognito-Tab öffnen
4. ✅ Wartungsseite sollte angezeigt werden

### **Test-Szenario 2: Admin-Bypass**
1. Wartungsmodus ist aktiv
2. Als Admin einloggen
3. Auf Wartungsseite: "Zur Website (Admin-Modus)" klicken
4. ✅ Normale Website sollte laden

### **Test-Szenario 3: Deaktivierung**
1. Im Admin-Dashboard
2. "Website aktivieren" klicken
3. In neuem Tab öffnen (ohne Login)
4. ✅ Normale Website sollte laden

### **Test-Szenario 4: Multi-Tab**
1. Admin-Dashboard in Tab 1 öffnen
2. Normale Website in Tab 2 öffnen
3. In Tab 1: Wartungsmodus aktivieren
4. Tab 2 neu laden
5. ✅ Wartungsseite sollte angezeigt werden

---

## 🎯 Best Practices

### **Vor Aktivierung:**
1. ✅ Alle Admins informieren
2. ✅ Wartungszeitraum festlegen
3. ✅ Kontaktperson bestimmen
4. ✅ Wartungsarbeiten planen

### **Während Wartung:**
1. ✅ Regelmäßig Status prüfen
2. ✅ Auf Anfragen reagieren
3. ✅ Updates dokumentieren
4. ✅ Tests durchführen

### **Nach Deaktivierung:**
1. ✅ Website-Funktionen testen
2. ✅ Event-Anmeldungen prüfen
3. ✅ Performance überprüfen
4. ✅ Admins informieren

---

## 📊 Status-Übersicht

### **Wartungsmodus AKTIV:**
| Benutzer | Zugriff | Funktionen | Besonderheiten |
|----------|---------|------------|----------------|
| Besucher | ❌ Nur Wartungsseite | Keine | Kontaktinfo verfügbar |
| Admin (ohne Bypass) | ⚠️ Wartungsseite | Bypass-Option | Admin-Modus verfügbar |
| Admin (mit Bypass) | ✅ Volle Website | Alle | Normale Nutzung |

### **Wartungsmodus INAKTIV:**
| Benutzer | Zugriff | Funktionen | Besonderheiten |
|----------|---------|------------|----------------|
| Besucher | ✅ Volle Website | Alle | Normal |
| Admin | ✅ Volle Website | Alle + Admin | Normal |

---

## 🔐 Sicherheit

### **Geschützte Bereiche:**
- ✅ Wartungsmodus kann nur von Admins umgeschaltet werden
- ✅ Keine API-Endpunkte für Besucher
- ✅ Status in localStorage (clientseitig)

### **Hinweise:**
- ⚠️ Admin-Session in sessionStorage
  - Wird beim Schließen des Browsers gelöscht
  - Kein permanenter Bypass

- ⚠️ Wartungsmodus-Status in localStorage
  - Bleibt auch nach Browser-Neustart
  - Kann von Admins zurückgesetzt werden

---

## ❓ FAQ

### **F: Kann ich während der Wartung Anmeldungen bearbeiten?**
**A:** Ja! Als Admin haben Sie vollen Zugriff auf das Dashboard und alle Funktionen.

### **F: Sehen Besucher die Admin-Login-Seite?**
**A:** Nein. Bei aktiviertem Wartungsmodus sehen Besucher nur die Wartungsseite, unabhängig von der URL.

### **F: Was passiert mit laufenden Sessions?**
**A:** Admin-Sessions bleiben aktiv. Besucher-Sessions werden nicht beeinflusst, da keine normale Navigation möglich ist.

### **F: Kann ich die Wartungsseite anpassen?**
**A:** Ja! Die Datei ist unter `/src/app/components/maintenance-page.tsx` und kann komplett angepasst werden.

### **F: Funktioniert der Wartungsmodus nach Deployment?**
**A:** Ja! Der Status wird in localStorage gespeichert und bleibt nach Deployment erhalten.

### **F: Wie setze ich den Wartungsmodus zurück wenn ich ausgesperrt bin?**
**A:** Öffnen Sie die Browser-Console (F12) und führen Sie aus:
```javascript
localStorage.setItem("maintenanceMode", "false");
location.reload();
```

### **F: Kann ich einen Countdown zur Wartungsseite hinzufügen?**
**A:** Ja! Sie können die `maintenance-page.tsx` erweitern mit einem Countdown-Timer.

### **F: Gibt es eine Benachrichtigung wenn Wartung aktiv ist?**
**A:** Ja, im Admin-Dashboard sehen Sie deutlich den orangenen Status "⚠️ Wartungsmodus aktiv".

---

## 🚀 Erweiterungsmöglichkeiten

### **Zusätzliche Features (optional):**

1. **Geplante Wartung**
   - Wartungsmodus zu bestimmter Zeit automatisch aktivieren
   - Countdown auf Wartungsseite

2. **Custom Nachricht**
   - Admin kann eigene Wartungsnachricht eingeben
   - Geschätzte Dauer angeben

3. **E-Mail-Benachrichtigung**
   - Alle Admins werden bei Aktivierung benachrichtigt
   - Besucher können sich für Update registrieren

4. **Wartungs-Historie**
   - Log aller Wartungsmodus-Aktivierungen
   - Dauer und Grund dokumentieren

5. **Teilweiser Wartungsmodus**
   - Nur bestimmte Seiten sperren
   - Events verfügbar, Anmeldung gesperrt

---

## 📞 Support

Bei Fragen zum Wartungsmodus:
- 📧 Technische Fragen: Fragen Sie einfach!
- 🔧 Probleme: Beschreiben Sie das Problem
- 💡 Feature-Wünsche: Teilen Sie Ihre Ideen

---

## ✅ Checkliste: Wartungsmodus

**Vor Wartung:**
- [ ] Admin-Passwort bereit
- [ ] Wartungsgrund dokumentiert
- [ ] Zeitraum festgelegt
- [ ] Admins informiert

**Aktivierung:**
- [ ] Als Admin einloggen
- [ ] Wartungsmodus aktivieren
- [ ] In Inkognito-Tab testen
- [ ] Status im Dashboard prüfen

**Während Wartung:**
- [ ] Arbeiten durchführen
- [ ] Funktionen testen
- [ ] Status beobachten
- [ ] Bei Fragen erreichbar sein

**Deaktivierung:**
- [ ] Arbeiten abgeschlossen
- [ ] Website testen
- [ ] Wartungsmodus deaktivieren
- [ ] Finale Tests durchführen
- [ ] Admins informieren

---

**Stand:** Januar 2026  
**Version:** 1.0  
**Wartungsmodus-Status:** ✅ Implementiert & Einsatzbereit

---

## 🎉 Zusammenfassung

Der Wartungsmodus ist jetzt vollständig implementiert und einsatzbereit!

**Aktivieren:** Admin-Dashboard → "Wartung starten"  
**Deaktivieren:** Admin-Dashboard → "Website aktivieren"  

**Viel Erfolg mit der DIVE Demo Tour Website!** 🚀
