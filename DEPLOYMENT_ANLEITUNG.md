# DEPLOYMENT ANLEITUNG
## DIVE DEMO TOUR - Komplettes Deployment mit GitHub, Supabase und Vercel

Diese Anleitung führt Sie Schritt für Schritt durch das komplette Deployment Ihrer Event-Website.

---

## 📋 VORAUSSETZUNGEN

Bevor Sie beginnen, benötigen Sie:

- ✅ Ein GitHub-Konto ([github.com](https://github.com))
- ✅ Ein Supabase-Konto ([supabase.com](https://supabase.com))
- ✅ Ein Vercel-Konto ([vercel.com](https://vercel.com))
- ✅ Zugriff auf Ihr Domain-Verwaltungssystem (falls Sie eine eigene Domain verwenden)

---

## TEIL 1: GITHUB REPOSITORY ERSTELLEN

### Schritt 1: Neues Repository erstellen

1. Gehen Sie zu [github.com](https://github.com) und melden Sie sich an
2. Klicken Sie rechts oben auf **"+"** → **"New repository"**
3. Füllen Sie die Informationen aus:
   - **Repository name:** `dive-demo-tour` (oder einen anderen Namen)
   - **Description:** "Event-Website für DIVE DEMO TOUR 2026"
   - **Visibility:** 
     - ✅ **Public** (empfohlen für Vercel Free Tier)
     - oder **Private** (benötigt Vercel Pro)
   - ❌ **NICHT** "Initialize this repository with a README" ankreuzen
4. Klicken Sie auf **"Create repository"**

### Schritt 2: Lokales Projekt mit GitHub verbinden

Sie haben zwei Optionen:

#### **Option A: Über Figma Make (empfohlen)**

Wenn Sie noch in Figma Make arbeiten:

1. Alle Dateien sind bereits im Projekt
2. Notieren Sie sich die GitHub Repository URL: `https://github.com/IHR-USERNAME/dive-demo-tour.git`

#### **Option B: Manueller Upload**

Falls Sie die Dateien lokal haben, siehe separate Anleitung: `GITHUB_UPLOAD_OHNE_LOKAL.md`

---

## TEIL 2: SUPABASE PROJEKT EINRICHTEN

### Schritt 1: Neues Supabase Projekt erstellen

1. Gehen Sie zu [supabase.com](https://supabase.com) und melden Sie sich an
2. Klicken Sie auf **"New Project"**
3. Füllen Sie die Informationen aus:
   - **Name:** `dive-demo-tour`
   - **Database Password:** Erstellen Sie ein sicheres Passwort (WICHTIG: Speichern Sie es!)
   - **Region:** Wählen Sie die nächstgelegene Region (z.B. `Europe (Frankfurt)` für Europa)
   - **Pricing Plan:** Free (ausreichend für die meisten Projekte)
4. Klicken Sie auf **"Create new project"**
5. ⏱️ Warten Sie 2-3 Minuten, bis das Projekt erstellt ist

### Schritt 2: Supabase Credentials notieren

Nach der Erstellung des Projekts:

1. Gehen Sie zu **Settings** → **API**
2. Notieren Sie sich (oder kopieren Sie in eine sichere Textdatei):

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
Anon Key (public): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key (secret): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Gehen Sie zu **Settings** → **Database** → **Connection string**
4. Wählen Sie **"URI"** und kopieren Sie die Connection String:

```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

⚠️ **WICHTIG:** Ersetzen Sie `[YOUR-PASSWORD]` durch Ihr tatsächliches Datenbank-Passwort!

### Schritt 3: Supabase Edge Function hochladen (optional, wird automatisch bei Vercel Deploy gemacht)

Die Edge Functions befinden sich in `/supabase/functions/server/` und werden automatisch durch das Projekt verwendet. Keine zusätzliche Konfiguration nötig.

---

## TEIL 3: VERCEL DEPLOYMENT

### Schritt 1: Vercel-Konto mit GitHub verbinden

1. Gehen Sie zu [vercel.com](https://vercel.com)
2. Klicken Sie auf **"Sign Up"** oder **"Log In"**
3. Wählen Sie **"Continue with GitHub"**
4. Autorisieren Sie Vercel für Ihr GitHub-Konto

### Schritt 2: Neues Projekt importieren

1. Im Vercel Dashboard, klicken Sie auf **"Add New..."** → **"Project"**
2. Suchen Sie Ihr Repository `dive-demo-tour` in der Liste
3. Klicken Sie auf **"Import"**

### Schritt 3: Projekt konfigurieren

#### Build Settings:

Die meisten Einstellungen sind bereits korrekt, überprüfen Sie:

- **Framework Preset:** `Vite`
- **Root Directory:** `./` (leer lassen)
- **Build Command:** `npm run build` (automatisch erkannt)
- **Output Directory:** `dist` (automatisch erkannt)
- **Install Command:** `npm install` (automatisch erkannt)

#### Environment Variables hinzufügen:

Klicken Sie auf **"Environment Variables"** und fügen Sie diese hinzu:

| Name | Value | Beschreibung |
|------|-------|-------------|
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | Von Supabase Settings → API |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` | Von Supabase Settings → API (Anon Key) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Von Supabase Settings → API (Service Role Key) |
| `SUPABASE_DB_URL` | `postgresql://postgres:...` | Von Supabase Settings → Database |
| `RESEND_API_KEY` | `re_xxxxx` | Von Resend (siehe unten) |
| `ADMIN_EMAIL` | `admin@ihre-domain.de` | Ihr Admin-Login E-Mail |
| `ADMIN_PASSWORD` | `IhrSicheresPasswort123!` | Ihr Admin-Login Passwort |

⚠️ **WICHTIG:** 
- Klicken Sie für jede Variable auf **alle drei Checkboxen** (Production, Preview, Development)
- Die `SUPABASE_SERVICE_ROLE_KEY` niemals im Frontend-Code verwenden!

### Schritt 4: Resend API Key erstellen

Die Website nutzt Resend für E-Mail-Versand:

1. Gehen Sie zu [resend.com](https://resend.com) und registrieren Sie sich
2. Nach der Anmeldung, klicken Sie auf **"API Keys"**
3. Klicken Sie auf **"Create API Key"**
4. Name: `dive-demo-tour-production`
5. Permissions: **"Sending access"**
6. Klicken Sie auf **"Create"**
7. Kopieren Sie den API Key (beginnt mit `re_...`)
8. Fügen Sie ihn in Vercel als `RESEND_API_KEY` Umgebungsvariable hinzu

📖 **Detaillierte Anleitung:** Siehe `RESEND_API_KEY_ANLEITUNG.md`

### Schritt 5: Deploy starten

1. Überprüfen Sie alle Einstellungen nochmal
2. Klicken Sie auf **"Deploy"**
3. ⏱️ Warten Sie 2-5 Minuten, bis das Deployment abgeschlossen ist

### Schritt 6: Deployment überprüfen

Nach erfolgreichem Deployment:

1. Klicken Sie auf **"Visit"** oder die generierte URL (z.B. `dive-demo-tour.vercel.app`)
2. Die Website sollte jetzt live sein! 🎉
3. Testen Sie die Admin-Anmeldung unter `/admin` mit Ihren konfigurierten Credentials

---

## TEIL 4: EIGENE DOMAIN VERBINDEN (Optional)

### Schritt 1: Domain zu Vercel hinzufügen

1. Im Vercel Projekt, gehen Sie zu **Settings** → **Domains**
2. Geben Sie Ihre Domain ein: `dive-demo-tour.eu`
3. Klicken Sie auf **"Add"**

### Schritt 2: DNS-Einstellungen konfigurieren

Vercel zeigt Ihnen nun die DNS-Einstellungen an. Sie haben zwei Optionen:

#### **Option A: Vercel Nameserver (empfohlen)**

Bei Ihrem Domain-Registrar (z.B. IONOS, Strato, GoDaddy):

1. Gehen Sie zu DNS/Nameserver Einstellungen
2. Ändern Sie die Nameserver zu:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
3. Speichern Sie die Änderungen
4. ⏱️ Warten Sie 24-48 Stunden (meist nur 1-2 Stunden)

#### **Option B: CNAME/A-Record (wenn Sie die Nameserver nicht ändern können)**

Bei Ihrem Domain-Registrar:

**Für Root-Domain (`dive-demo-tour.eu`):**
```
Type: A
Name: @ (oder leer)
Value: 76.76.21.21
TTL: 3600
```

**Für www-Subdomain (`www.dive-demo-tour.eu`):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### Schritt 3: SSL-Zertifikat

- Vercel erstellt automatisch ein kostenloses SSL-Zertifikat (Let's Encrypt)
- Nach erfolgreicher DNS-Propagierung ist Ihre Website über HTTPS erreichbar

---

## TEIL 5: SUPABASE MIT VERCEL VERBINDEN

### Wichtig: Aktualisieren Sie die Projekt-Info

1. Öffnen Sie die Datei `/utils/supabase/info.tsx` in Ihrem Projekt
2. Aktualisieren Sie die Werte mit Ihren tatsächlichen Supabase-Daten:

```typescript
export const projectId = 'xxxxxxxxxxxxx'; // Von Ihrer Supabase URL
export const publicAnonKey = 'eyJhbGci...'; // Ihr Supabase Anon Key
```

3. Committen und pushen Sie diese Änderungen zu GitHub
4. Vercel deployt automatisch die Änderungen

### CORS-Einstellungen in Supabase (falls nötig)

Falls Sie CORS-Fehler bekommen:

1. In Supabase: **Settings** → **API** → **CORS Configuration**
2. Fügen Sie Ihre Vercel-Domain hinzu:
   ```
   https://dive-demo-tour.vercel.app
   https://dive-demo-tour.eu
   https://www.dive-demo-tour.eu
   ```

---

## TEIL 6: ERSTE SCHRITTE NACH DEM DEPLOYMENT

### 1. Admin-Login testen

1. Gehen Sie zu `https://ihre-domain.de/admin`
2. Melden Sie sich mit den konfigurierten Credentials an
3. Sie sollten das Admin-Dashboard sehen

### 2. Erste Daten eingeben

Im Admin-Dashboard können Sie:

- ✅ **Events erstellen/bearbeiten** (Tab: Events)
- ✅ **Marken hinzufügen** (Tab: Marken)
- ✅ **Partner verwalten** (Tab: Partner)
- ✅ **Module/Programme erstellen** (Tab: Module)
- ✅ **Anmeldungen ansehen** (Tab: Anmeldungen)
- ✅ **Homepage-Text bearbeiten** (Tab: Homepage)

### 3. Wartungsmodus testen

Falls Sie Wartungsarbeiten durchführen möchten:

📖 **Siehe:** `WARTUNGSMODUS_ANLEITUNG.md`

### 4. E-Mail-Funktionalität testen

1. Erstellen Sie ein Test-Event mit Modulen
2. Aktivieren Sie "Anmeldung erforderlich" für ein Modul
3. Testen Sie die Modul-Anmeldung
4. Sie sollten eine Bestätigungs-E-Mail erhalten

---

## TEIL 7: KONTINUIERLICHE UPDATES

### Automatisches Deployment

Vercel ist jetzt mit Ihrem GitHub Repository verbunden:

- ✅ Jeder **Push** zu GitHub triggert automatisch ein neues Deployment
- ✅ **Pull Requests** erstellen Preview-Deployments
- ✅ **Main/Master Branch** wird automatisch in Production deployed

### Manuelles Re-Deployment

Falls Sie ein Re-Deployment erzwingen möchten:

1. Im Vercel Dashboard, gehen Sie zu **Deployments**
2. Klicken Sie auf die drei Punkte **"..."** beim letzten Deployment
3. Wählen Sie **"Redeploy"**

---

## 🔧 TROUBLESHOOTING

### Problem: "Environment variables not found"

**Lösung:**
1. Gehen Sie zu Vercel → Settings → Environment Variables
2. Überprüfen Sie, dass alle Variablen gesetzt sind
3. Stellen Sie sicher, dass alle drei Checkboxen (Production, Preview, Development) aktiviert sind
4. Triggern Sie ein Re-Deployment

### Problem: "Failed to fetch events" oder Datenbankfehler

**Lösung:**
1. Überprüfen Sie `SUPABASE_URL` und `SUPABASE_ANON_KEY` in Vercel
2. Überprüfen Sie, dass `/utils/supabase/info.tsx` die korrekten Werte hat
3. Überprüfen Sie die Supabase-Logs: Supabase Dashboard → Logs

### Problem: E-Mails werden nicht versendet

**Lösung:**
1. Überprüfen Sie den `RESEND_API_KEY` in Vercel
2. Im Resend Dashboard: Überprüfen Sie die Logs unter "Logs"
3. Mit dem Free Tier von Resend können Sie nur von `onboarding@resend.dev` senden
4. Für eigene Absender-Domain, siehe: `RESEND_API_KEY_ANLEITUNG.md`

### Problem: "404 Not Found" nach Reload

**Lösung:**
Die `_redirects` Datei sollte bereits vorhanden sein in `/public/_redirects/main.tsx`.
Falls nicht, erstellen Sie die Datei `/public/_redirects` mit:
```
/*    /index.html   200
```

### Problem: Bilder werden nicht angezeigt

**Lösung:**
1. Überprüfen Sie, dass die Bild-URLs korrekt sind
2. Bei Supabase Storage: Überprüfen Sie die Bucket-Permissions
3. Überprüfen Sie die Browser-Console auf CORS-Fehler

### Problem: Admin-Login funktioniert nicht

**Lösung:**
1. Überprüfen Sie `ADMIN_EMAIL` und `ADMIN_PASSWORD` in Vercel Environment Variables
2. Stellen Sie sicher, dass keine Leerzeichen vor/nach den Werten sind
3. Triggern Sie ein Re-Deployment

---

## 📊 MONITORING & ANALYTICS

### Vercel Analytics (Optional)

1. Im Vercel Dashboard → Analytics Tab
2. Aktivieren Sie Analytics (kostenlos für den Start)
3. Sehen Sie Besucherzahlen, Performance-Metriken, etc.

### Supabase Monitoring

1. Im Supabase Dashboard → Database → Logs
2. Überwachen Sie Datenbankabfragen und Fehler
3. Setzen Sie Alerts für kritische Ereignisse

---

## 🎯 CHECKLISTE: DEPLOYMENT ABGESCHLOSSEN

- [ ] GitHub Repository erstellt und Code hochgeladen
- [ ] Supabase Projekt erstellt und Credentials notiert
- [ ] Vercel Projekt erstellt und mit GitHub verbunden
- [ ] Alle Environment Variables in Vercel gesetzt
- [ ] Resend API Key erstellt und hinzugefügt
- [ ] Erste Deployment erfolgreich abgeschlossen
- [ ] Website ist unter Vercel-URL erreichbar
- [ ] Admin-Login funktioniert
- [ ] (Optional) Eigene Domain verbunden
- [ ] (Optional) DNS-Einstellungen konfiguriert
- [ ] Erste Test-Daten eingegeben
- [ ] E-Mail-Funktionalität getestet
- [ ] Wartungsmodus getestet

---

## 📚 WEITERE RESSOURCEN

- **Wartungsmodus:** `WARTUNGSMODUS_ANLEITUNG.md`
- **Resend E-Mail Setup:** `RESEND_API_KEY_ANLEITUNG.md`
- **GitHub Upload ohne lokales Projekt:** `GITHUB_UPLOAD_OHNE_LOKAL.md`
- **Admin-Abmeldung:** `ADMIN_ABMELDUNG.md`
- **Demo-Zugangsdaten:** `DEMO_ZUGANGSDATEN.md`

---

## 🆘 SUPPORT

Bei Problemen:

1. **Vercel Support:** [vercel.com/support](https://vercel.com/support)
2. **Supabase Support:** [supabase.com/support](https://supabase.com/support)
3. **GitHub Support:** [support.github.com](https://support.github.com)
4. **Community:** [Stack Overflow](https://stackoverflow.com) mit den Tags `vercel`, `supabase`, `react`

---

## ✅ ERFOLGREICH DEPLOYED!

Ihre DIVE DEMO TOUR Website ist jetzt live! 🎉

**Nächste Schritte:**
- Testen Sie alle Funktionen gründlich
- Fügen Sie Ihre Event-Daten hinzu
- Teilen Sie die Website mit Ihren Partnern
- Überwachen Sie die Analytics

Viel Erfolg mit Ihrer Event-Website! 🚀
