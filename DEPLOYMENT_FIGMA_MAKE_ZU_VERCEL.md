# 🚀 Deployment: Figma Make → GitHub → Vercel

## Komplette Anleitung ohne lokales Projekt

Sie arbeiten in **Figma Make** und haben kein lokales Projekt auf Ihrem Mac. Diese Anleitung zeigt Ihnen, wie Sie Ihre Website auf GitHub hochladen und auf Vercel veröffentlichen.

---

## 📋 Übersicht

```
Figma Make → GitHub Repository → Vercel Deployment → Live Website
   (Sie)         (Code-Hosting)     (Hosting-Service)    (dive-demo-tour.eu)
```

**Zeitaufwand:** 15-20 Minuten  
**Voraussetzungen:** GitHub Account, Vercel Account (beide kostenlos)

---

## 🎯 Methode 1: GitHub Desktop (Empfohlen für Anfänger)

### Schritt 1: GitHub Desktop installieren

1. **Download:** [https://desktop.github.com](https://desktop.github.com)
2. **Installieren:** Öffnen Sie die heruntergeladene Datei
3. **Mit GitHub anmelden:**
   - Öffnen Sie GitHub Desktop
   - Klicken Sie auf "Sign in to GitHub.com"
   - Geben Sie Ihre GitHub-Anmeldedaten ein

### Schritt 2: Projekt aus Figma Make exportieren

**In Figma Make:**

1. **Klicken Sie oben rechts** auf das **Export-Symbol** (Download-Icon)
2. **Wählen Sie:** "Download project as ZIP"
3. Die ZIP-Datei wird heruntergeladen: `dive-demo-tour.zip`
4. **Entpacken Sie die ZIP-Datei:**
   - Doppelklick auf die ZIP-Datei
   - Es wird ein Ordner erstellt: `dive-demo-tour`

**Wichtig:** Merken Sie sich, wo dieser Ordner liegt (z.B. Downloads)

### Schritt 3: GitHub Repository erstellen

**In GitHub Desktop:**

1. **Klicken Sie auf:** "File" → "New repository"
2. **Füllen Sie aus:**
   - **Name:** `dive-demo-tour`
   - **Description:** "DIVE Demo Tour - Event Website für 6 Europa-Events"
   - **Local path:** Wählen Sie einen Ordner (z.B. Documents/GitHub)
   - ✅ **Initialize with README:** Aktivieren
3. **Klicken Sie auf:** "Create repository"

### Schritt 4: Projekt-Dateien kopieren

1. **Öffnen Sie den Finder:**
   - Navigieren Sie zu Ihrem entpackten `dive-demo-tour` Ordner (aus Schritt 2)
   - Öffnen Sie ihn

2. **Kopieren Sie ALLE Dateien:**
   - Markieren Sie alles (Cmd+A)
   - Kopieren Sie (Cmd+C)

3. **Öffnen Sie das GitHub Repository:**
   - In GitHub Desktop, klicken Sie auf "Repository" → "Show in Finder"
   - Ein neuer Finder-Ordner öffnet sich
   - **Fügen Sie alle Dateien ein** (Cmd+V)
   - **Überschreiben Sie** die vorhandene README.md wenn gefragt

### Schritt 5: Commit und Push zu GitHub

**In GitHub Desktop:**

1. Sie sehen jetzt alle Dateien in der linken Spalte (grün = neu)
2. **Unten links:**
   - **Summary:** `Initiales Projekt-Upload`
   - **Description:** `Komplette DIVE Demo Tour Website von Figma Make`
3. **Klicken Sie auf:** "Commit to main"
4. **Klicken Sie auf:** "Publish repository" (oben rechts)
5. **Im Dialog:**
   - ✅ **Name:** `dive-demo-tour`
   - ❌ **Keep this code private:** Deaktivieren (für Vercel Free)
   - **Klicken Sie auf:** "Publish repository"

**✅ Ihr Code ist jetzt auf GitHub!**

Überprüfen Sie: Gehen Sie zu [github.com/IhrBenutzername/dive-demo-tour](https://github.com)

---

## 🎯 Methode 2: GitHub Web Interface (Ohne Software)

Falls Sie GitHub Desktop nicht installieren möchten:

### Schritt 1: Repository auf GitHub erstellen

1. **Gehen Sie zu:** [https://github.com](https://github.com)
2. **Melden Sie sich an**
3. **Klicken Sie auf:** Grüner "New" Button (oben links)
4. **Füllen Sie aus:**
   - **Repository name:** `dive-demo-tour`
   - **Description:** "DIVE Demo Tour - Event Website"
   - ✅ **Public** (wichtig für Vercel Free)
   - ✅ **Add a README file**
   - **Add .gitignore:** Node
5. **Klicken Sie auf:** "Create repository" (grüner Button)

### Schritt 2: Projekt aus Figma Make exportieren

1. **In Figma Make:** Klicken Sie auf Export/Download
2. **Download als ZIP**
3. **Entpacken Sie die ZIP-Datei**

### Schritt 3: Dateien auf GitHub hochladen

**Wichtig:** GitHub erlaubt nur 100 Dateien gleichzeitig. Wir laden Ordner für Ordner hoch.

#### A) Haupt-Dateien hochladen

1. **Auf GitHub:** Ihr Repository ist geöffnet
2. **Klicken Sie auf:** "Add file" → "Upload files"
3. **Laden Sie einzeln hoch:**
   - `package.json`
   - `package-lock.json`
   - `index.html`
   - `vite.config.ts`
   - `tsconfig.json`
   - `tsconfig.app.json`
   - `tsconfig.node.json`
4. **Commit message:** `Haupt-Konfigurationsdateien`
5. **Klicken Sie:** "Commit changes"

#### B) src Ordner hochladen

1. **Klicken Sie:** "Add file" → "Upload files"
2. **Drag & Drop** den kompletten `src` Ordner
3. **Commit message:** `Source-Code hinzugefügt`
4. **Klicken Sie:** "Commit changes"
5. ⏳ **Warten Sie** 30-60 Sekunden

#### C) public Ordner hochladen

1. **Klicken Sie:** "Add file" → "Upload files"
2. **Drag & Drop** den kompletten `public` Ordner
3. **Commit message:** `Public Assets hinzugefügt`
4. **Klicken Sie:** "Commit changes"

#### D) supabase Ordner hochladen

1. **Klicken Sie:** "Add file" → "Upload files"
2. **Drag & Drop** den kompletten `supabase` Ordner
3. **Commit message:** `Supabase Backend hinzugefügt`
4. **Klicken Sie:** "Commit changes"

#### E) utils Ordner hochladen

1. **Klicken Sie:** "Add file" → "Upload files"
2. **Drag & Drop** den kompletten `utils` Ordner
3. **Commit message:** `Utils hinzugefügt`
4. **Klicken Sie:** "Commit changes"

**✅ Ihr Code ist jetzt auf GitHub!**

---

## 🌐 Teil 2: Vercel Deployment

### Schritt 1: Vercel Account erstellen

1. **Gehen Sie zu:** [https://vercel.com](https://vercel.com)
2. **Klicken Sie auf:** "Sign Up"
3. **Wählen Sie:** "Continue with GitHub"
4. **Autorisieren Sie** Vercel für Ihren GitHub Account
5. ✅ **Sie sind jetzt angemeldet**

### Schritt 2: Neues Projekt erstellen

1. **Auf Vercel Dashboard:** Klicken Sie auf "Add New" → "Project"
2. **Import Git Repository:**
   - Sie sehen Ihre GitHub Repositories
   - **Suchen Sie:** `dive-demo-tour`
   - **Klicken Sie auf:** "Import"

### Schritt 3: Projekt konfigurieren

**Build & Development Settings:**

```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Wichtig - Environment Variables:**

Klicken Sie auf "Environment Variables" und fügen Sie hinzu:

| Key | Value | Notiz |
|-----|-------|-------|
| `SUPABASE_URL` | Ihr Supabase URL | Aus Supabase Dashboard |
| `SUPABASE_ANON_KEY` | Ihr Supabase Anon Key | Aus Supabase Dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Ihr Service Role Key | Aus Supabase Dashboard |
| `SUPABASE_DB_URL` | Ihre Postgres Connection String | Aus Supabase Dashboard |
| `RESEND_API_KEY` | Ihr Resend API Key | Für E-Mail Versand |
| `ADMIN_EMAIL` | admin@dive-demo-tour.eu | Admin-Login E-Mail |
| `ADMIN_PASSWORD` | IhrSicheresPasswort123 | Admin-Login Passwort |

**Wo finde ich die Supabase Keys?**

1. Gehen Sie zu [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Wählen Sie Ihr Projekt
3. Klicken Sie links auf **"Settings"** (Zahnrad)
4. Klicken Sie auf **"API"**
5. Kopieren Sie:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role** (⚠️ geheim!) → `SUPABASE_SERVICE_ROLE_KEY`
6. Für DB_URL: Settings → Database → Connection String

### Schritt 4: Deploy starten

1. **Klicken Sie auf:** "Deploy" (blauer Button)
2. ⏳ **Warten Sie:** 2-3 Minuten (Vercel baut Ihre Website)
3. **Sie sehen:**
   - Build-Logs (grüne ✓ = gut)
   - Fortschrittsbalken
4. ✅ **Fertig!** "Congratulations! Your project has been deployed"

### Schritt 5: Website öffnen

1. **Klicken Sie auf:** "Visit" oder das Preview-Bild
2. **Ihre Website ist live!** 🎉
3. **URL:** z.B. `dive-demo-tour.vercel.app`

---

## 🌍 Teil 3: Eigene Domain verbinden

### Ihre Domain: dive-demo-tour.eu

#### Schritt 1: Domain zu Vercel hinzufügen

1. **In Vercel:** Ihr Projekt → "Settings" → "Domains"
2. **Klicken Sie auf:** "Add"
3. **Geben Sie ein:** `dive-demo-tour.eu`
4. **Klicken Sie auf:** "Add"
5. **Auch hinzufügen:** `www.dive-demo-tour.eu`

#### Schritt 2: DNS konfigurieren

Vercel zeigt Ihnen jetzt die DNS-Einträge:

**Für dive-demo-tour.eu:**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Für www.dive-demo-tour.eu:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### Schritt 3: DNS bei Ihrem Domain-Anbieter ändern

**Wo haben Sie die Domain gekauft?**

- **GoDaddy / IONOS / Strato / 1&1:** Gehen Sie zum Domain-Dashboard
- **Namecheap:** Advanced DNS
- **Google Domains:** DNS Settings

**DNS-Einträge hinzufügen:**

1. **Gehen Sie zum DNS-Management** Ihrer Domain
2. **Löschen Sie** vorhandene A- und CNAME-Records für @ und www
3. **Fügen Sie die neuen Einträge hinzu** (siehe oben)
4. **Speichern Sie**

**⏳ Warten Sie:** 5-60 Minuten (DNS-Propagierung)

#### Schritt 4: SSL-Zertifikat

- ✅ **Automatisch:** Vercel erstellt kostenlose SSL-Zertifikate
- ⏳ Dauert 5-10 Minuten nach DNS-Änderung
- 🔒 Ihre Website wird über HTTPS laufen

#### Schritt 5: Testen

Nach 10-60 Minuten:

1. Öffnen Sie [https://dive-demo-tour.eu](https://dive-demo-tour.eu)
2. ✅ Ihre Website sollte laden!
3. 🔒 Mit grünem Schloss (HTTPS)

---

## 🔄 Updates veröffentlichen

### So aktualisieren Sie Ihre Website nach Änderungen:

#### Mit GitHub Desktop:

1. **Änderungen in Figma Make machen**
2. **Projekt neu exportieren** (ZIP Download)
3. **Dateien im lokalen Repository aktualisieren** (überschreiben)
4. **In GitHub Desktop:**
   - Sehen Sie die Änderungen
   - **Commit message:** z.B. "Event-Bilder hinzugefügt"
   - **Klicken Sie:** "Commit to main"
   - **Klicken Sie:** "Push origin"
5. **Vercel deployed automatisch!** (30-60 Sekunden)
6. ✅ Änderungen sind live!

#### Mit GitHub Web Interface:

1. **Änderungen in Figma Make machen**
2. **Projekt neu exportieren** (ZIP Download)
3. **Auf GitHub:**
   - Navigieren Sie zur Datei die Sie ändern wollen
   - Klicken Sie auf den **Stift-Icon** (Edit)
   - Oder: "Add file" → "Upload files"
4. **Commit changes**
5. **Vercel deployed automatisch!**

---

## 📊 Vercel Dashboard Übersicht

### Was Sie im Dashboard sehen:

**Deployments:**
- 🟢 **Production:** Aktuelle Live-Version
- 🔵 **Preview:** Test-Versionen von Branches
- ⏳ **Building:** Deployment läuft
- ✅ **Ready:** Deployment erfolgreich
- ❌ **Error:** Deployment fehlgeschlagen

**Domains:**
- Ihre verbundenen Domains
- SSL-Status
- DNS-Einstellungen

**Analytics:**
- Besucher-Statistiken (in kostenpflichtigen Plänen)
- Performance-Daten

**Logs:**
- Build-Logs
- Function-Logs (Supabase Edge Functions)
- Error-Logs

---

## 🎯 Supabase Edge Functions auf Vercel

### Wichtig für Ihr Backend:

Ihre Supabase Edge Functions laufen auf Supabase, NICHT auf Vercel.

**Konfiguration prüfen:**

1. **Supabase Dashboard öffnen:** [supabase.com/dashboard](https://supabase.com/dashboard)
2. **Ihr Projekt auswählen**
3. **Edge Functions:** Links im Menü
4. **Functions deployen:**

```bash
# Wenn Sie später Zugriff auf Terminal haben:
supabase functions deploy server
```

**Alternative:** Direkt im Supabase Dashboard Functions verwalten

**Wichtig:** Die Environment Variables müssen AUCH in Supabase gesetzt sein:
- Supabase Dashboard → Settings → Edge Functions → Secrets

---

## ✅ Checkliste: Ist alles fertig?

### GitHub:
- [ ] Repository erstellt
- [ ] Alle Dateien hochgeladen
- [ ] README.md vorhanden
- [ ] .gitignore vorhanden

### Vercel:
- [ ] Projekt importiert
- [ ] Build erfolgreich
- [ ] Environment Variables gesetzt
- [ ] Website ist live
- [ ] HTTPS funktioniert

### Domain (optional):
- [ ] Domain zu Vercel hinzugefügt
- [ ] DNS-Einträge konfiguriert
- [ ] SSL-Zertifikat aktiv
- [ ] Domain leitet auf Website

### Supabase:
- [ ] Edge Functions deployed
- [ ] Environment Variables gesetzt
- [ ] Backend erreichbar
- [ ] Anmeldungen funktionieren

### Funktionalität:
- [ ] Startseite lädt
- [ ] Alle 6 Events sichtbar
- [ ] Event-Detailseiten funktionieren
- [ ] Anmelde-Formular funktioniert
- [ ] Admin-Dashboard erreichbar (/admin)
- [ ] Bilder werden angezeigt

---

## 🐛 Troubleshooting: Häufige Probleme

### Problem: "Build failed" auf Vercel

**Ursache:** Fehlende Dependencies oder falsche Konfiguration

**Lösung:**
1. Überprüfen Sie Build-Logs in Vercel
2. Stellen Sie sicher, dass `package.json` hochgeladen wurde
3. Überprüfen Sie Build Command: `npm run build`
4. Überprüfen Sie Output Directory: `dist`

### Problem: "Page not found" (404)

**Ursache:** Falsche Output Directory

**Lösung:**
1. Vercel Settings → General → Build & Development
2. Output Directory: `dist` (nicht `build`)
3. Redeploy

### Problem: Website lädt, aber Backend funktioniert nicht

**Ursache:** Environment Variables fehlen

**Lösung:**
1. Vercel → Ihr Projekt → Settings → Environment Variables
2. Fügen Sie alle Supabase Keys hinzu
3. Redeploy (Vercel → Deployments → "Redeploy")

### Problem: Domain funktioniert nicht

**Ursache:** DNS noch nicht propagiert

**Lösung:**
1. ⏳ Warten Sie 1-2 Stunden
2. Prüfen Sie DNS: [dnschecker.org](https://dnschecker.org)
3. Überprüfen Sie DNS-Einträge beim Domain-Anbieter

### Problem: "TypeError: Failed to fetch"

**Ursache:** Supabase Backend nicht deployed oder falsche URL

**Lösung:**
1. Überprüfen Sie SUPABASE_URL in Vercel Environment Variables
2. Überprüfen Sie ob Edge Functions deployed sind
3. Fallback: Die Website funktioniert jetzt auch offline (localStorage)

### Problem: Admin-Login funktioniert nicht

**Ursache:** ADMIN_EMAIL und ADMIN_PASSWORD nicht gesetzt

**Lösung:**
1. Supabase Dashboard → Settings → Edge Functions → Secrets
2. Fügen Sie hinzu:
   - `ADMIN_EMAIL`: Ihre E-Mail
   - `ADMIN_PASSWORD`: Ihr Passwort
3. Redeploy Edge Functions

---

## 📧 Support und Ressourcen

### Vercel Dokumentation:
- [https://vercel.com/docs](https://vercel.com/docs)

### GitHub Hilfe:
- [https://docs.github.com](https://docs.github.com)

### Supabase Dokumentation:
- [https://supabase.com/docs](https://supabase.com/docs)

### Video-Tutorials:
- YouTube: "Vercel deployment tutorial"
- YouTube: "GitHub für Anfänger"

---

## 🎯 Zusammenfassung: Ihr Workflow

```
1. Änderungen in Figma Make
   ↓
2. Projekt als ZIP exportieren
   ↓
3. Dateien auf GitHub hochladen
   (GitHub Desktop oder Web Interface)
   ↓
4. Git Push / Commit
   ↓
5. Vercel erkennt Änderungen automatisch
   ↓
6. Automatic Deployment (30-60 Sek.)
   ↓
7. ✅ Website ist live aktualisiert!
```

**Total Zeit pro Update:** 5-10 Minuten

---

## 🚀 Sie haben es geschafft!

Ihre DIVE Demo Tour Website ist jetzt:

✅ **Auf GitHub** gespeichert (Versionskontrolle)  
✅ **Auf Vercel** gehostet (weltweit schnell)  
✅ **Mit HTTPS** gesichert (SSL-Zertifikat)  
✅ **Auf Ihrer Domain** erreichbar (dive-demo-tour.eu)  
✅ **Automatisch deployed** (bei jedem GitHub Push)  

**Glückwunsch! 🎉**

---

## 💡 Nächste Schritte

1. **Testen Sie Ihre Live-Website** gründlich
2. **Teilen Sie die URL** mit Ihrem Team
3. **Überwachen Sie** die Analytics in Vercel
4. **Sammeln Sie Anmeldungen** über das Formular
5. **Verwalten Sie Anmeldungen** im Admin-Dashboard

Viel Erfolg mit Ihrer Event-Website! 🚀
