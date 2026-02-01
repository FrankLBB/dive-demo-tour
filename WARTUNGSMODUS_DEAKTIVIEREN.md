# WARTUNGSMODUS DEAKTIVIEREN

## Problem

Die Website zeigt auf `dive-demo-tour.vercel.app` die Wartungsseite an, funktioniert aber auf der Branch-URL `dive-demo-tour-git-main-frank-lemkes-projects.vercel.app`.

## Ursache

Der Wartungsmodus wird über `localStorage` im Browser gespeichert. Da jede Domain ihren eigenen `localStorage` hat, ist der Wartungsmodus nur auf der Production-URL aktiv.

---

## ✅ LÖSUNG 1: Query-Parameter (Schnellste Methode)

Öffnen Sie diese URL in Ihrem Browser:

```
https://dive-demo-tour.vercel.app?bypass_maintenance=true
```

Die Website wird:
1. Den Wartungsmodus automatisch deaktivieren
2. Den Query-Parameter aus der URL entfernen
3. Sich neu laden und normal funktionieren

✨ **Vorteil:** Funktioniert sofort, keine technischen Kenntnisse nötig

---

## ✅ LÖSUNG 2: Browser Console

Wenn Sie die Browser-Entwicklertools nutzen möchten:

### Schritt 1: Browser Console öffnen

- **Windows/Linux:** Drücken Sie `F12` oder `Strg + Shift + I`
- **Mac:** Drücken Sie `Cmd + Option + I`
- Oder: Rechtsklick → "Untersuchen" → "Console"-Tab

### Schritt 2: Code eingeben

Kopieren Sie diesen Code in die Console und drücken Sie Enter:

```javascript
localStorage.removeItem('maintenanceMode');
location.reload();
```

Die Seite lädt sich neu und der Wartungsmodus ist deaktiviert.

---

## ✅ LÖSUNG 3: Über Admin-Dashboard

Falls Sie Zugriff auf das Admin-Dashboard haben:

1. Gehen Sie zu: `https://dive-demo-tour.vercel.app/admin`
2. Melden Sie sich mit Ihren Admin-Credentials an
3. Im Admin-Dashboard finden Sie den Wartungsmodus-Toggle
4. Deaktivieren Sie den Wartungsmodus

---

## 🔄 WARTUNGSMODUS AKTIVIEREN

Falls Sie den Wartungsmodus aktivieren möchten, nutzen Sie diesen Query-Parameter:

```
https://dive-demo-tour.vercel.app?maintenance=true
```

Oder über die Browser Console:

```javascript
localStorage.setItem('maintenanceMode', 'true');
location.reload();
```

---

## 📝 HINWEIS FÜR ZUKÜNFTIGE DEPLOYMENTS

### Unterschiedliche Vercel-URLs:

Vercel erstellt mehrere URLs für Ihr Projekt:

1. **Production URL:** `dive-demo-tour.vercel.app`
   - Die Haupt-URL für Produktionsumgebung
   - Wird bei jedem Push zum `main` Branch aktualisiert

2. **Branch URL:** `dive-demo-tour-git-main-frank-lemkes-projects.vercel.app`
   - Spezifisch für den `main` Branch
   - Für Preview-Zwecke

3. **Deployment URL:** `dive-demo-tour-xxxxx.vercel.app`
   - Eindeutige URL für jedes einzelne Deployment
   - Nützlich für Tests spezifischer Versionen

**Wichtig:** Der `localStorage` ist domain-spezifisch. Wenn Sie den Wartungsmodus auf einer URL aktivieren, betrifft das nur diese URL!

---

## 🛡️ BEST PRACTICES

### Für Live-Websites:

1. **Vor Wartungsarbeiten:**
   ```
   https://ihre-domain.de?maintenance=true
   ```

2. **Nach Wartungsarbeiten:**
   ```
   https://ihre-domain.de?bypass_maintenance=true
   ```

### Für Testing:

Nutzen Sie die Branch-URLs oder Deployment-URLs für Tests, um die Production-URL nicht zu beeinflussen.

---

## ❓ FAQ

### Warum funktioniert eine URL, die andere nicht?

Jede Domain hat ihren eigenen `localStorage`. Die Wartungsmodus-Einstellung wird pro Domain gespeichert.

### Kann ich den Wartungsmodus zentral steuern?

Aktuell wird der Wartungsmodus im Browser gespeichert. Für eine zentrale Steuerung müsste man eine Datenbank-Lösung implementieren.

### Verliere ich die Einstellung beim Browser-Wechsel?

Ja, `localStorage` ist browser- und domain-spezifisch. In einem anderen Browser oder Inkognito-Modus ist die Einstellung nicht vorhanden.

### Was passiert mit Admin-Zugriff im Wartungsmodus?

Admins können sich weiterhin unter `/admin` anmelden und haben dann vollen Zugriff auf die Website, auch während der Wartungsmodus aktiv ist.

---

## 🎯 ZUSAMMENFASSUNG

**Schnellste Lösung:** Nutzen Sie den Query-Parameter `?bypass_maintenance=true`

**Beispiel:**
```
https://dive-demo-tour.vercel.app?bypass_maintenance=true
```

Das war's! 🚀
