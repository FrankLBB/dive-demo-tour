# 📤 Bilder auf GitHub hochladen - OHNE lokales Projekt

## Komplette Anleitung für GitHub Web-Oberfläche

Sie arbeiten in Figma Make und haben kein lokales Projekt auf Ihrem Mac. Kein Problem! Sie können Bilder direkt über die GitHub Website hochladen.

---

## 🎯 Voraussetzungen

✅ Ihr Projekt liegt auf GitHub  
✅ Sie haben Zugriff auf Ihr GitHub Repository  
✅ Sie sind bei GitHub eingeloggt  

---

## 📋 Schritt-für-Schritt-Anleitung

### **Schritt 1: GitHub Repository öffnen**

1. **Öffnen Sie Ihren Browser** (Safari, Chrome, etc.)
2. **Gehen Sie zu:** [https://github.com](https://github.com)
3. **Melden Sie sich an** (falls nicht bereits eingeloggt)
4. **Finden Sie Ihr Repository:**
   - Klicken Sie oben rechts auf Ihr Profilbild
   - Klicken Sie auf **"Your repositories"**
   - Suchen Sie **"dive-demo-tour"** (oder wie Ihr Projekt heißt)
   - Klicken Sie darauf

**Ihre URL sollte so aussehen:**
```
https://github.com/IhrBenutzername/dive-demo-tour
```

---

### **Schritt 2: Zum images-Ordner navigieren**

Sie sehen jetzt die Dateistruktur Ihres Projekts.

**Option A: Ordner existiert bereits**
1. Klicken Sie auf den Ordner **`public`**
2. Klicken Sie auf den Ordner **`images`**
3. Sie sollten eine `.gitkeep` Datei sehen
4. ✅ Weiter zu Schritt 3

**Option B: Ordner existiert noch nicht**
1. Klicken Sie auf den Ordner **`public`**
2. Falls kein `images` Ordner existiert → Weiter zu **Schritt 2b**

---

### **Schritt 2b: images-Ordner erstellen (falls nötig)**

Falls der `images` Ordner noch nicht existiert:

1. Im `public` Ordner, klicken Sie oben rechts auf **"Add file"**
2. Wählen Sie **"Create new file"**
3. Im Dateinamen-Feld geben Sie ein:
   ```
   images/.gitkeep
   ```
   (Der Schrägstrich `/` erstellt automatisch einen neuen Ordner!)
4. Scrollen Sie nach unten
5. Bei "Commit new file":
   - Commit message: `images-Ordner erstellt`
6. Klicken Sie auf **"Commit new file"** (grüner Button)
7. ✅ Der Ordner ist jetzt erstellt!

---

### **Schritt 3: Bilder hochladen**

Jetzt sind Sie im `public/images/` Ordner.

#### **A) Einzelnes Bild hochladen:**

1. Klicken Sie oben rechts auf **"Add file"**
2. Wählen Sie **"Upload files"**
3. Sie sehen jetzt eine Upload-Seite

**Methode 1 - Drag & Drop:**
   - Ziehen Sie Ihr Bild (z.B. `marke1-logo.png`) aus dem Finder
   - Lassen Sie es im markierten Bereich los
   - ✅ Das Bild wird hochgeladen

**Methode 2 - Datei auswählen:**
   - Klicken Sie auf **"choose your files"**
   - Wählen Sie Ihr Bild aus dem Finder
   - Klicken Sie auf **"Öffnen"**
   - ✅ Das Bild wird hochgeladen

4. Scrollen Sie nach unten zu "Commit changes"
5. **Commit message:** `Marke 1 Logo hinzugefügt`
6. Klicken Sie auf **"Commit changes"** (grüner Button)
7. ⏳ GitHub verarbeitet den Upload (dauert 5-10 Sekunden)
8. ✅ Fertig!

#### **B) Mehrere Bilder gleichzeitig hochladen:**

1. Klicken Sie auf **"Add file"** → **"Upload files"**
2. **Drag & Drop** alle 6 Event-Bilder gleichzeitig
   - Hamburg-Bild
   - Amsterdam-Bild
   - Kopenhagen-Bild
   - Bergen-Bild
   - Stockholm-Bild
   - Helsinki-Bild
3. Alle Dateien werden gleichzeitig hochgeladen
4. **Commit message:** `Alle 6 Event-Bilder hinzugefügt`
5. Klicken Sie auf **"Commit changes"**
6. ✅ Alle Bilder sind hochgeladen!

---

### **Schritt 4: Bilder überprüfen**

Nach dem Upload:

1. Sie sollten jetzt im `public/images/` Ordner sein
2. Ihre hochgeladenen Bilder sollten sichtbar sein:
   ```
   public/images/
   ├── .gitkeep
   ├── marke1-logo.png          ← Neu hochgeladen
   ├── hamburg.jpg              ← Neu hochgeladen
   ├── amsterdam.jpg            ← Neu hochgeladen
   ├── kopenhagen.jpg           ← Neu hochgeladen
   ├── bergen.jpg               ← Neu hochgeladen
   ├── stockholm.jpg            ← Neu hochgeladen
   └── helsinki.jpg             ← Neu hochgeladen
   ```

3. **Klicken Sie auf ein Bild** um es zu überprüfen
4. GitHub zeigt eine Vorschau
5. ✅ Alles sieht gut aus!

---

### **Schritt 5: Vercel Deployment abwarten**

Nachdem Sie Bilder auf GitHub hochgeladen haben:

1. **Vercel erkennt automatisch** die Änderungen
2. **Automatisches Deployment startet** (dauert 2-3 Minuten)
3. Sie erhalten eine E-Mail von Vercel: "Deployment successful"
4. ✅ Ihre Website ist aktualisiert!

**Vercel Dashboard prüfen:**
1. Gehen Sie zu [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Klicken Sie auf Ihr Projekt
3. Sie sehen den aktuellen Deployment-Status
4. Warten Sie, bis Status = **"Ready"** ✅

---

## 🖼️ Beispiel: Marken-Logo hochladen

### Vollständiger Ablauf:

#### 1. **Bild vorbereiten auf Ihrem Mac**
   - Dateiname: `marke1-logo.png`
   - Format: PNG (mit transparentem Hintergrund)
   - Größe: 400x400 Pixel
   - Speicherort: z.B. Downloads-Ordner

#### 2. **GitHub öffnen**
   ```
   github.com → Ihr Repository → public → images
   ```

#### 3. **Upload**
   - "Add file" → "Upload files"
   - Drag & Drop `marke1-logo.png`
   - Commit message: "Marke 1 Logo hinzugefügt"
   - "Commit changes"

#### 4. **Warten**
   - GitHub: 5-10 Sekunden
   - Vercel: 2-3 Minuten

#### 5. **Testen**
   - Öffnen Sie Ihre Website
   - Gehen Sie zu einer Event-Detailseite
   - Das Logo sollte im "Programm Marke 1" Abschnitt erscheinen ✅

---

## 🎨 Beispiel: Alle 6 Event-Bilder hochladen

### 1. **Bilder vorbereiten:**

Auf Ihrem Mac, benennen Sie Ihre Bilder:
```
Downloads/
├── hamburg.jpg
├── amsterdam.jpg
├── kopenhagen.jpg
├── bergen.jpg
├── stockholm.jpg
└── helsinki.jpg
```

**Wichtig:**
- ✅ Kleinbuchstaben verwenden
- ✅ Keine Leerzeichen
- ✅ Keine Umlaute
- ✅ Empfohlene Größe: < 500 KB pro Bild

### 2. **Auf GitHub hochladen:**

1. **Navigieren zu:** `public/images/`
2. **Klicken:** "Add file" → "Upload files"
3. **Drag & Drop:** Alle 6 Bilder gleichzeitig
4. **Commit message:** "6 Event-Bilder für alle Städte"
5. **Commit:** "Commit changes"
6. ✅ Fertig!

### 3. **Code aktualisieren lassen:**

Nachdem die Bilder auf GitHub sind, sagen Sie mir:
> "Bilder sind hochgeladen: hamburg.jpg, amsterdam.jpg, kopenhagen.jpg, bergen.jpg, stockholm.jpg, helsinki.jpg"

Dann aktualisiere ich `/src/app/data/events.ts` für Sie mit den neuen Pfaden:
```typescript
{
  id: "1",
  image: "/images/hamburg.jpg", // ← Aktualisiert
  // ...
}
```

---

## 📸 Screenshot-Guide

### So sieht die GitHub Upload-Seite aus:

#### **Upload-Bereich:**
```
┌─────────────────────────────────────────┐
│  Drag and drop files here to upload    │
│                                         │
│         [Ziehen Sie hier hin]           │
│                                         │
│       or  choose your files             │
└─────────────────────────────────────────┘
```

#### **Nach dem Upload:**
```
✅ marke1-logo.png (uploaded)
```

#### **Commit Section:**
```
Commit changes
┌─────────────────────────────────────────┐
│ Marke 1 Logo hinzugefügt                │ ← Ihre Nachricht
└─────────────────────────────────────────┘

[Commit changes] ← Grüner Button
```

---

## 🔍 Bilder finden nach dem Upload

### In GitHub:

**URL-Schema:**
```
https://github.com/IhrName/dive-demo-tour/blob/main/public/images/marke1-logo.png
```

**Klickpfad:**
```
Repository → public → images → marke1-logo.png
```

### Auf Ihrer Website:

**Nach Vercel Deployment:**
```
https://ihre-website.vercel.app/images/marke1-logo.png
```

**Im Code:**
```typescript
// So wird es referenziert:
src="/images/marke1-logo.png"
```

---

## ❓ Häufige Fragen

### **"Ich sehe keinen 'Add file' Button"**

**Grund:** Sie haben keine Schreibrechte für das Repository.

**Lösung:**
- Stellen Sie sicher, dass Sie der Owner sind
- Oder: Sie sind als Collaborator hinzugefügt

### **"Nach Upload sehe ich die Bilder nicht auf der Website"**

**Checkliste:**
1. ✅ Upload auf GitHub erfolgreich? (Dateien sind im `public/images/` sichtbar)
2. ✅ Vercel Deployment abgeschlossen? (Status = "Ready")
3. ✅ Browser-Cache geleert? (Strg+Shift+R / Cmd+Shift+R)
4. ✅ Korrekter Dateiname im Code? (Groß-/Kleinschreibung beachten!)

### **"Kann ich Bilder später ändern?"**

Ja! So geht's:
1. Gehen Sie zu `public/images/` auf GitHub
2. Klicken Sie auf das alte Bild
3. Klicken Sie auf den **Mülleimer-Icon** (Delete)
4. Laden Sie das neue Bild mit demselben Namen hoch
5. Vercel deployed automatisch

### **"Wie groß dürfen die Bilder sein?"**

**GitHub:**
- Einzelne Datei: Max 25 MB
- Empfohlen: < 1 MB pro Bild

**Vercel:**
- Keine Limits für statische Assets
- Aber: Große Bilder = langsame Website

**Optimal:**
- Event-Bilder: 200-500 KB
- Logos: 50-100 KB

---

## ⚠️ Wichtige Hinweise

### **Dateinamen:**

✅ **GUT:**
```
hamburg.jpg
marke1-logo.png
event-2026.jpg
```

❌ **SCHLECHT:**
```
Hamburg Event.jpg        ← Leerzeichen
Bild (1).jpg            ← Klammern
münchen.jpg             ← Umlaute
Event#1.jpg             ← Sonderzeichen
```

### **Bildoptimierung:**

Vor dem Upload komprimieren:
- **Online:** [TinyPNG.com](https://tinypng.com)
- **Online:** [Squoosh.app](https://squoosh.app)

**Ziel:** < 500 KB pro Bild

### **Git History:**

Jeder Upload erstellt einen Git Commit. Das ist gut für:
- ✅ Versionskontrolle
- ✅ Nachvollziehbarkeit
- ✅ Rückgängig machen möglich

---

## 🚀 Workflow-Zusammenfassung

### Schnell-Anleitung:

```
1. GitHub.com öffnen
   ↓
2. Repository auswählen
   ↓
3. public → images navigieren
   ↓
4. "Add file" → "Upload files"
   ↓
5. Bilder per Drag & Drop hochladen
   ↓
6. Commit message eingeben
   ↓
7. "Commit changes" klicken
   ↓
8. 2-3 Minuten auf Vercel Deployment warten
   ↓
9. Website aktualisieren (Cmd+Shift+R)
   ↓
10. ✅ Bilder sind live!
```

### Zeitaufwand:
- **Bilder vorbereiten:** 5 Minuten
- **Auf GitHub hochladen:** 2 Minuten
- **Vercel Deployment:** 2-3 Minuten (automatisch)
- **Total:** ~10 Minuten

---

## 📋 Checkliste

Nach dem Upload:

- [ ] Bilder sind auf GitHub sichtbar (`public/images/`)
- [ ] Vercel Deployment ist abgeschlossen (Status = "Ready")
- [ ] Dateinamen sind korrekt (Kleinbuchstaben, keine Leerzeichen)
- [ ] Bilder sind optimiert (< 500 KB)
- [ ] Code wurde aktualisiert (Pfade in events.ts und event-detail.tsx)
- [ ] Website getestet (Browser-Cache geleert)
- [ ] Alle Bilder werden korrekt angezeigt ✅

---

## 🎯 Nächste Schritte

### Für das Marken-Logo:

1. **Bereiten Sie vor:** `marke1-logo.png` (400x400px, < 100 KB)
2. **Laden Sie hoch:** GitHub → public/images → Upload
3. **Sagen Sie mir Bescheid:** "Logo ist hochgeladen"
4. **Ich prüfe:** Ob alles funktioniert ✅

### Für Event-Bilder:

1. **Bereiten Sie vor:** 6 Bilder (hamburg.jpg, amsterdam.jpg, etc.)
2. **Laden Sie hoch:** Alle gleichzeitig auf GitHub
3. **Sagen Sie mir Bescheid:** "Alle 6 Bilder sind hochgeladen"
4. **Ich aktualisiere:** `/src/app/data/events.ts` mit den neuen Pfaden
5. **Fertig!** ✅

---

## 💬 Ich bin für Sie da!

Wenn Sie Fragen haben oder Hilfe beim Upload brauchen:

- 🤔 **Finden Sie den richtigen Ordner nicht?** → Ich helfe!
- 🖼️ **Bilder sind hochgeladen?** → Sagen Sie mir Bescheid, ich aktualisiere den Code!
- ❌ **Etwas funktioniert nicht?** → Beschreiben Sie das Problem!
- ✅ **Alles geklappt?** → Super! Dann können wir weitermachen!

Viel Erfolg! 🚀
