# 🎯 DIVE Demo Tour - Schritt-für-Schritt Deployment-Guide

**Folgen Sie dieser Anleitung genau in dieser Reihenfolge.**  
Jeder Schritt ist nummeriert und baut auf dem vorherigen auf.

---

## ✅ Checkliste - Was Sie benötigen:

- [ ] Computer mit Internet
- [ ] Ihr DIVE Demo Tour Projektordner
- [ ] 30-45 Minuten Zeit
- [ ] E-Mail-Adresse (für Accounts)

---

# 📍 TEIL 1: GIT INSTALLIEREN UND EINRICHTEN

## Schritt 1: Prüfen Sie, ob Git bereits installiert ist

### Windows:
1. Drücken Sie `Windows-Taste + R`
2. Tippen Sie `cmd` und drücken Sie Enter
3. Geben Sie ein: `git --version`

### Mac:
1. Öffnen Sie "Terminal" (Spotlight: `CMD + Leertaste`, dann "Terminal" eingeben)
2. Geben Sie ein: `git --version`

### Ergebnis:
- ✅ **Zeigt eine Version an** (z.B. "git version 2.40.0") → Weiter zu Schritt 3
- ❌ **Fehler "command not found"** → Weiter zu Schritt 2

---

## Schritt 2: Git installieren (falls nicht installiert)

### Windows:
1. Öffnen Sie: [https://git-scm.com/download/win](https://git-scm.com/download/win)
2. Download startet automatisch
3. Installieren Sie mit **allen Standardeinstellungen**
4. Nach Installation: Öffnen Sie **"Git Bash"** (Start-Menü suchen)
5. Testen Sie: `git --version`

### Mac:
1. Öffnen Sie Terminal
2. Geben Sie ein: `xcode-select --install`
3. Folgen Sie den Anweisungen
4. Testen Sie: `git --version`

### Linux:
```bash
sudo apt-get update
sudo apt-get install git
```

✅ **Checkpoint:** `git --version` zeigt eine Versionsnummer an

---

## Schritt 3: Git konfigurieren

Öffnen Sie Terminal/Git Bash/Kommandozeile und geben Sie ein:

```bash
git config --global user.name "Ihr Name"
git config --global user.email "ihre-email@beispiel.de"
```

**Beispiel:**
```bash
git config --global user.name "Max Mustermann"
git config --global user.email "max@dive-demo-tour.eu"
```

✅ **Checkpoint:** Keine Fehlermeldung erscheint

---

# 📍 TEIL 2: GITHUB ACCOUNT ERSTELLEN

## Schritt 4: GitHub Account erstellen

1. Öffnen Sie: [https://github.com](https://github.com)
2. Klicken Sie auf **"Sign up"** (oben rechts)
3. Geben Sie ein:
   - **E-Mail-Adresse**
   - **Passwort** (mindestens 15 Zeichen oder 8+ mit Nummer und Kleinbuchstaben)
   - **Benutzername** (z.B. "dive-demo-tour" oder Ihr Name)
4. Lösen Sie das Captcha
5. Klicken Sie auf **"Create account"**
6. Bestätigen Sie Ihre E-Mail-Adresse (Check Posteingang)
7. Sie können Umfrage-Fragen überspringen (Skip)

✅ **Checkpoint:** Sie sind auf GitHub angemeldet und sehen Ihr Dashboard

---

## Schritt 5: Neues Repository auf GitHub erstellen

1. Klicken Sie auf das **grüne "New"** Button (links) oder **"+"** Symbol (oben rechts) → **"New repository"**
2. Füllen Sie aus:
   - **Repository name:** `dive-demo-tour`
   - **Description:** (optional) "Event-Website für DIVE Demo Tour durch Europa"
   - **Public** oder **Private:** Wählen Sie **Public** (kostenlos und für Vercel nötig)
   - ⚠️ **WICHTIG:** Haken bei **"Add a README file"** NICHT setzen!
   - ⚠️ **WICHTIG:** ".gitignore" und "license" auf **None** lassen
3. Klicken Sie auf **"Create repository"**

✅ **Checkpoint:** Sie sehen eine Seite mit Anweisungen und zwei Code-Blöcken

**⚠️ WICHTIG:** Lassen Sie diese GitHub-Seite offen! Sie brauchen sie gleich.

---

# 📍 TEIL 3: IHR PROJEKT ZU GITHUB HOCHLADEN

## Schritt 6: Navigieren Sie zu Ihrem Projektordner

### Windows (Git Bash):
```bash
cd C:/Users/IhrBenutzername/Dokumente/dive-demo-tour
```

### Mac/Linux (Terminal):
```bash
cd ~/Documents/dive-demo-tour
```

**Tipp:** Sie können auch im Datei-Explorer zum Ordner navigieren, dann:
- **Windows:** Rechtsklick → "Git Bash Here"
- **Mac:** Rechtsklick → "New Terminal at Folder"

**Prüfen Sie, ob Sie im richtigen Ordner sind:**
```bash
ls
```
Sie sollten Ihre Projektdateien sehen (package.json, src/, etc.)

✅ **Checkpoint:** Der `ls` Befehl zeigt Ihre DIVE-Projektdateien

---

## Schritt 7: Git Repository initialisieren

```bash
git init
```

**Erwartete Ausgabe:**
```
Initialized empty Git repository in /pfad/zu/dive-demo-tour/.git/
```

✅ **Checkpoint:** Keine Fehlermeldung

---

## Schritt 8: .gitignore Datei erstellen

Diese Datei sagt Git, welche Dateien NICHT hochgeladen werden sollen.

**Erstellen Sie eine neue Datei namens `.gitignore` im Projektordner:**

### Option A: Mit Terminal/Git Bash
```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Build-Ausgabe
dist/
build/

# Environment Variables
.env
.env.local

# System-Dateien
.DS_Store
Thumbs.db
*.log

# IDE-Einstellungen
.vscode/
.idea/
EOF
```

### Option B: Manuell
1. Öffnen Sie Ihren Code-Editor (VS Code, etc.)
2. Erstellen Sie eine neue Datei: `.gitignore`
3. Fügen Sie den Inhalt aus Option A ein
4. Speichern Sie

✅ **Checkpoint:** Datei `.gitignore` existiert im Projektordner

---

## Schritt 9: Alle Dateien hinzufügen

```bash
git add .
```

**Prüfen Sie, was hinzugefügt wurde:**
```bash
git status
```

Sie sollten eine Liste grüner Dateien sehen.

✅ **Checkpoint:** `git status` zeigt viele grüne Dateien

---

## Schritt 10: Ersten Commit erstellen

```bash
git commit -m "Initial commit: DIVE Demo Tour Website"
```

**Erwartete Ausgabe:**
```
[main (root-commit) abc1234] Initial commit: DIVE Demo Tour Website
 XX files changed, XXX insertions(+)
 create mode 100644 package.json
 ...
```

✅ **Checkpoint:** Commit wurde erfolgreich erstellt

---

## Schritt 11: Mit GitHub verbinden

⚠️ **Jetzt brauchen Sie die GitHub-Seite, die Sie in Schritt 5 offen gelassen haben!**

Auf der GitHub-Seite sehen Sie unter "…or push an existing repository from the command line" einen Code-Block.

**Kopieren Sie die Befehle und führen Sie sie aus:**

```bash
git remote add origin https://github.com/IhrBenutzername/dive-demo-tour.git
git branch -M main
git push -u origin main
```

**Ersetzen Sie "IhrBenutzername" mit Ihrem GitHub-Benutzernamen!**

**Beim ersten Mal werden Sie nach GitHub-Zugangsdaten gefragt:**
- **Username:** Ihr GitHub-Benutzername
- **Password:** 
  - ⚠️ **NICHT Ihr normales Passwort!**
  - Sie benötigen einen **Personal Access Token** (siehe unten)

---

## Schritt 11b: Personal Access Token erstellen (falls nötig)

Wenn Git nach einem Passwort fragt:

1. Gehen Sie zu GitHub im Browser
2. Klicken Sie auf Ihr Profilbild (oben rechts) → **Settings**
3. Scrollen Sie ganz nach unten → **Developer settings** (linke Sidebar)
4. Klicken Sie auf **Personal access tokens** → **Tokens (classic)**
5. Klicken Sie auf **Generate new token** → **Generate new token (classic)**
6. Füllen Sie aus:
   - **Note:** "DIVE Demo Tour Deployment"
   - **Expiration:** 90 days (oder länger)
   - **Scopes:** Haken bei **repo** setzen (alle Unterpunkte)
7. Scrollen Sie nach unten → **Generate token**
8. ⚠️ **WICHTIG:** Kopieren Sie das Token SOFORT! Es wird nur einmal angezeigt!

**Verwenden Sie dieses Token als Passwort beim `git push`**

✅ **Checkpoint:** `git push` war erfolgreich, Code ist auf GitHub!

---

## Schritt 12: Erfolg überprüfen

1. Gehen Sie zu Ihrem GitHub Repository im Browser
2. Aktualisieren Sie die Seite (F5)
3. Sie sollten jetzt alle Ihre Projektdateien sehen!

✅ **Checkpoint:** Alle Dateien sind auf GitHub sichtbar

---

# 📍 TEIL 4: VERCEL ACCOUNT UND DEPLOYMENT

## Schritt 13: Vercel Account erstellen

1. Öffnen Sie: [https://vercel.com/signup](https://vercel.com/signup)
2. Klicken Sie auf **"Continue with GitHub"**
3. Sie werden zu GitHub weitergeleitet
4. Klicken Sie auf **"Authorize Vercel"**
5. Sie sind jetzt bei Vercel angemeldet!

✅ **Checkpoint:** Sie sehen das Vercel Dashboard

---

## Schritt 14: Projekt importieren

1. Klicken Sie auf **"Add New..."** → **"Project"**
2. Sie sehen eine Liste Ihrer GitHub-Repositories
3. Finden Sie **"dive-demo-tour"**
4. Klicken Sie auf **"Import"** daneben

✅ **Checkpoint:** Sie sehen die Projekt-Konfigurationsseite

---

## Schritt 15: Build-Einstellungen konfigurieren

Vercel sollte diese automatisch erkennen. Prüfen Sie:

- **Framework Preset:** Vite (sollte automatisch erkannt werden)
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

⚠️ **Falls nicht automatisch erkannt:** Wählen Sie "Vite" aus dem Dropdown

✅ **Checkpoint:** Einstellungen sind korrekt

---

## Schritt 16: Umgebungsvariablen hinzufügen

1. Klicken Sie auf **"Environment Variables"** (Abschnitt ausklappen)
2. Fügen Sie folgende Variablen hinzu:

**Variable 1:**
- **Key:** `SUPABASE_URL`
- **Value:** Ihre Supabase URL (aus Supabase Dashboard)

**Variable 2:**
- **Key:** `SUPABASE_ANON_KEY`
- **Value:** Ihr Supabase Anon Key

**Variable 3:**
- **Key:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** Ihr Supabase Service Role Key

**Variable 4:**
- **Key:** `SUPABASE_DB_URL`
- **Value:** Ihre Supabase Database URL

**Variable 5:**
- **Key:** `ADMIN_EMAIL`
- **Value:** Die E-Mail für Ihren Admin-Login

**Variable 6:**
- **Key:** `ADMIN_PASSWORD`
- **Value:** Das Passwort für Ihren Admin-Login

### Wo finden Sie die Supabase-Werte?

1. Gehen Sie zu Ihrem Supabase Dashboard
2. Wählen Sie Ihr Projekt
3. Klicken Sie auf **Settings** (Zahnrad-Symbol links unten)
4. Klicken Sie auf **API**
5. Dort finden Sie:
   - **Project URL** = SUPABASE_URL
   - **anon public** = SUPABASE_ANON_KEY
   - **service_role** = SUPABASE_SERVICE_ROLE_KEY (⚠️ geheim halten!)

✅ **Checkpoint:** Alle 6 Umgebungsvariablen sind eingetragen

---

## Schritt 17: Deployen!

1. Klicken Sie auf **"Deploy"**
2. Warten Sie 2-4 Minuten
3. Beobachten Sie den Build-Prozess (Live-Log)

**Sie sehen:**
- 📦 Installing dependencies...
- 🏗️ Building...
- ✅ Build completed
- 🚀 Deploying...

**Erwartetes Ergebnis:**
🎉 **Congratulations! Your project has been deployed!**

✅ **Checkpoint:** Build war erfolgreich, keine Fehler

---

## Schritt 18: Website testen

1. Vercel zeigt Ihnen eine **URL** (z.B. `dive-demo-tour.vercel.app`)
2. Klicken Sie darauf oder kopieren Sie sie
3. Ihre Website öffnet sich! 🎉

**Testen Sie:**
- ✅ Homepage lädt
- ✅ Navigation funktioniert (Über uns, Impressum, Partner)
- ✅ Event-Karten sind sichtbar
- ✅ Klick auf Event öffnet Detailseite
- ✅ Event-Anmeldung öffnet Dialog
- ✅ Admin-Link im Footer führt zu Login

✅ **Checkpoint:** Website ist komplett funktional!

---

# 📍 TEIL 5: ZUKÜNFTIGE UPDATES

## Schritt 19: Änderungen deployen (in Zukunft)

Jedes Mal wenn Sie etwas ändern:

```bash
# 1. Änderungen prüfen
git status

# 2. Geänderte Dateien hinzufügen
git add .

# 3. Commit mit Beschreibung
git commit -m "Beschreibung der Änderung"

# 4. Zu GitHub hochladen
git push
```

**Das war's! Vercel deployed automatisch! 🚀**

**Beispiel:**
```bash
git add .
git commit -m "Footer aktualisiert"
git push
```

Nach 2-3 Minuten ist die neue Version live!

---

# 🎉 GESCHAFFT! ZUSAMMENFASSUNG

Sie haben jetzt:

✅ Git installiert und konfiguriert  
✅ GitHub Account erstellt  
✅ Ihr Projekt auf GitHub hochgeladen  
✅ Vercel Account erstellt  
✅ Website deployed  
✅ Automatisches Deployment bei jedem `git push`  

**Ihre Website ist live unter:**
```
https://dive-demo-tour.vercel.app
(oder Ihre individuelle URL)
```

---

# 🔄 WORKFLOW AB JETZT

```
1. Code in VS Code ändern
   ↓
2. git add . && git commit -m "Änderung" && git push
   ↓
3. ☕ Kaffee trinken (2-3 Minuten)
   ↓
4. Website ist aktualisiert! ✅
```

---

# 🌐 BONUS: CUSTOM DOMAIN EINRICHTEN

## Schritt 20: Eigene Domain verbinden (Optional)

Falls Sie `dive-demo-tour.eu` oder eine andere Domain haben:

### In Vercel:
1. Gehen Sie zu Ihrem Projekt auf Vercel
2. Klicken Sie auf **Settings** → **Domains**
3. Geben Sie Ihre Domain ein: `dive-demo-tour.eu`
4. Klicken Sie auf **Add**

### Bei Ihrem Domain-Provider (z.B. Strato):
1. Login bei Strato (oder wo Ihre Domain registriert ist)
2. Gehen Sie zu DNS-Einstellungen
3. Fügen Sie hinzu:
   - **Type:** A
   - **Name:** @
   - **Value:** `76.76.21.21`
4. Fügen Sie hinzu:
   - **Type:** CNAME
   - **Name:** www
   - **Value:** `cname.vercel-dns.com`
5. Speichern

**Warten Sie 24-48 Stunden** bis DNS propagiert ist.

---

# 🆘 HILFE BEI PROBLEMEN

## Build-Fehler auf Vercel?

1. Gehen Sie zum Vercel-Projekt
2. Klicken Sie auf **Deployments**
3. Klicken Sie auf das fehlgeschlagene Deployment
4. Lesen Sie den Error-Log
5. Häufige Ursachen:
   - Umgebungsvariablen fehlen
   - Syntaxfehler im Code
   - Package nicht installiert

## Git Push funktioniert nicht?

```bash
# Prüfen Sie Remote-Verbindung
git remote -v

# Sollte zeigen:
# origin  https://github.com/IhrBenutzername/dive-demo-tour.git (fetch)
# origin  https://github.com/IhrBenutzername/dive-demo-tour.git (push)
```

## Website zeigt Fehler?

1. Öffnen Sie Browser Console (F12)
2. Prüfen Sie Fehler im Console-Tab
3. Häufige Ursachen:
   - Supabase URLs falsch
   - API Keys fehlen
   - CORS-Probleme (Supabase Settings prüfen)

---

# 📞 SUPPORT-RESSOURCEN

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Git Docs:** [git-scm.com/doc](https://git-scm.com/doc)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **GitHub Help:** [docs.github.com](https://docs.github.com)

---

# ✅ FINALE CHECKLISTE

- [ ] Git installiert
- [ ] GitHub Account erstellt
- [ ] Repository auf GitHub
- [ ] Vercel Account erstellt
- [ ] Website deployed
- [ ] Alle Funktionen getestet
- [ ] Admin-Login funktioniert
- [ ] Event-Anmeldung funktioniert
- [ ] Ich weiß, wie ich Updates mache

---

**Herzlichen Glückwunsch! 🎉 Sie haben erfolgreich eine moderne Web-App deployed!**

**Ihre DIVE Demo Tour Website ist jetzt live und professionell gehostet! 🌊🚀**
