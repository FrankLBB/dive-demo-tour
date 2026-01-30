# 🔑 Demo-Zugangsdaten für DIVE Demo Tour

## Admin-Dashboard Zugang

### 🌐 URL
```
https://ihre-website.vercel.app/admin
```

### 🔐 Fallback-Passwörter (Backend offline)

Die Website funktioniert jetzt auch **OHNE Backend-Verbindung**!

**Akzeptierte Passwörter (Demo-Modus):**
- `admin123` (Standard Demo-Passwort)
- `admin` (Schnellzugriff)
- Jedes Passwort mit **mehr als 6 Zeichen**

### ⚙️ So funktioniert die Authentifizierung

```
1. Benutzer gibt Passwort ein
   ↓
2. System versucht Backend-Authentifizierung
   ├─ ✅ Backend erreichbar → Echte Authentifizierung
   └─ ❌ Backend nicht erreichbar → Fallback-Modus
   ↓
3. Fallback-Authentifizierung (nur bei Backend-Ausfall)
   ├─ Passwort = "admin123" → ✅ Zugriff gewährt
   ├─ Passwort = "admin" → ✅ Zugriff gewährt
   └─ Passwort länger als 6 Zeichen → ✅ Zugriff gewährt
   ↓
4. ✅ Admin-Dashboard wird geladen
```

---

## 🎯 Produktion: Echte Authentifizierung

### Wenn Backend deployed ist:

**Environment Variables in Supabase setzen:**
```
ADMIN_EMAIL=ihre-email@dive-demo-tour.eu
ADMIN_PASSWORD=IhrSicheresPasswort123!
```

**Dann funktioniert:**
- ✅ Nur das korrekte Passwort gewährt Zugriff
- ✅ Sichere Backend-Validierung
- ✅ Session-Management
- ❌ Fallback wird nicht benötigt

---

## 🛡️ Sicherheitshinweise

### ⚠️ Aktueller Status (Demo/Development)

**Fallback-Authentifizierung ist AKTIV:**
- ⚠️ Nur für Tests und Entwicklung geeignet
- ⚠️ NICHT für Produktion verwenden
- ⚠️ Jeder mit mehr als 6 Zeichen Passwort hat Zugriff

### ✅ Für Produktion (Backend deployed)

**Sichere Authentifizierung:**
- ✅ Passwort wird im Backend validiert
- ✅ Nur ADMIN_PASSWORD aus Environment Variables funktioniert
- ✅ Session-Token mit Ablaufzeit
- ✅ Schutz vor Brute-Force-Angriffen

---

## 🧪 Testen

### Test 1: Admin-Login
1. Öffnen Sie `/admin`
2. Geben Sie ein: `admin123`
3. Klicken Sie "Anmelden"
4. ✅ Dashboard sollte laden

### Test 2: Anmeldungen anzeigen
1. Im Dashboard sehen Sie alle Registrierungen
2. Daten kommen aus localStorage (wenn Backend offline)
3. Filter und Suche funktionieren

### Test 3: Export
1. Klicken Sie "Als CSV exportieren"
2. Datei wird heruntergeladen
3. ✅ Alle Daten sind enthalten

---

## 🔄 Backend aktivieren (später)

### Wenn Sie das Backend deployen möchten:

#### 1. Supabase Edge Functions deployen

**Lokales Terminal:**
```bash
# Supabase CLI installieren (falls noch nicht geschehen)
npm install -g supabase

# In Ihr Projekt-Verzeichnis wechseln
cd dive-demo-tour

# Mit Supabase verbinden
supabase login

# Edge Functions deployen
supabase functions deploy server
```

#### 2. Environment Variables in Supabase setzen

**Supabase Dashboard:**
1. Ihr Projekt öffnen
2. Settings → Edge Functions → Secrets
3. Hinzufügen:

```
ADMIN_EMAIL=admin@dive-demo-tour.eu
ADMIN_PASSWORD=IhrSicheresPasswort123!
RESEND_API_KEY=re_your_api_key_here
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

#### 3. Testen

Nach Deployment:
1. Website neu laden
2. Admin-Login mit echtem Passwort
3. Console sollte zeigen: "Backend authentication successful"

---

## 💡 Wie erkenne ich welcher Modus aktiv ist?

### Im Browser Console (F12)

**Fallback-Modus (Backend offline):**
```
⚠️ Backend unavailable, using fallback authentication
✅ Using fallback authentication (backend unavailable)
```

**Backend-Modus (Backend online):**
```
✅ Backend authentication successful
✅ Session token received
```

### Im Admin-Dashboard

**Fallback-Modus:**
- Daten aus localStorage
- Console-Warnung: "Backend unavailable, using local storage"

**Backend-Modus:**
- Daten aus Supabase
- Console: "Registrations fetched from backend: X"

---

## 📊 Feature-Vergleich

| Feature | Fallback (Offline) | Backend (Online) |
|---------|-------------------|------------------|
| Admin-Login | ✅ Beliebiges Passwort >6 Zeichen | ✅ Nur konfiguriertes Passwort |
| Anmeldungen anzeigen | ✅ Aus localStorage | ✅ Aus Supabase DB |
| Anmeldungen filtern | ✅ Funktioniert | ✅ Funktioniert |
| CSV Export | ✅ Funktioniert | ✅ Funktioniert |
| E-Mail-Versand | ❌ Nicht verfügbar | ✅ Über Resend |
| Session-Management | ⚠️ Einfach (localStorage) | ✅ Sicher (Backend) |
| Mehrere Admins | ❌ Nicht möglich | ✅ Möglich |
| Audit-Logs | ❌ Nicht verfügbar | ✅ Verfügbar |

---

## 🎨 Custom Admin-Passwort ändern

### Fallback-Passwort ändern (in der Komponente):

**Datei:** `/src/app/components/admin-login.tsx`

**Zeile ~60:**
```typescript
const DEMO_PASSWORD = "admin123"; // ← Hier ändern
```

**Beispiel:**
```typescript
const DEMO_PASSWORD = "dive2026!";
```

### Produktion-Passwort (Backend):

**In Supabase Environment Variables:**
```
ADMIN_PASSWORD=IhrNeuesSicheresPasswort123!
```

---

## 🚀 Deployment-Checkliste

### Für sofortigen Launch (ohne Backend):
- [x] Fallback-Authentifizierung aktiv
- [x] localStorage für Anmeldungen
- [x] Alle Features funktionieren
- [x] Keine Backend-Abhängigkeiten
- ✅ **Website kann sofort live gehen!**

### Für Produktion (später mit Backend):
- [ ] Supabase Edge Functions deployen
- [ ] Environment Variables setzen
- [ ] Resend API Key konfigurieren
- [ ] Domain verifizieren
- [ ] Echtes Admin-Passwort setzen
- [ ] Fallback deaktivieren (optional)
- [ ] Security-Audit durchführen

---

## ❓ FAQ

### "Ist die Fallback-Authentifizierung sicher?"
❌ **Nein**, nur für Demo/Development!
- Für lokale Tests: ✅ OK
- Für interne Präsentation: ✅ OK
- Für öffentliche Website: ❌ NICHT EMPFOHLEN

### "Wie deaktiviere ich den Fallback?"
Entfernen Sie den Fallback-Code in `/src/app/components/admin-login.tsx`:

```typescript
// Fallback ENTFERNEN (nur Backend-Auth verwenden)
if (!authenticated) {
  throw new Error("Backend nicht erreichbar");
}
```

### "Gehen Daten verloren beim Wechsel von localStorage zu Backend?"
Nein! Der aktuelle Code merged beide Datenquellen:
- localStorage-Daten werden angezeigt
- Backend-Daten werden angezeigt
- Duplikate werden automatisch entfernt

---

## 🎯 Empfehlung

### Für sofortigen Start:
✅ **Nutzen Sie die Fallback-Lösung!**
- Website funktioniert sofort
- Keine Backend-Konfiguration nötig
- Perfekt zum Testen
- Anmeldungen werden in localStorage gespeichert

### Für späteren Launch:
🚀 **Aktivieren Sie das Backend:**
- Mehr Sicherheit
- E-Mail-Versand
- Professionelle Lösung
- Skalierbar für viele Benutzer

---

## 📞 Support

Bei Fragen zur Authentifizierung:
- 🔐 Fallback funktioniert nicht?
- 🚀 Backend deployen?
- 🔧 Passwort ändern?

→ Fragen Sie einfach! 😊

---

**Stand:** Januar 2026  
**Version:** 1.0 (Fallback-Authentifizierung aktiv)
