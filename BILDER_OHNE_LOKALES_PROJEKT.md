# 🖼️ Bilder einbinden ohne lokales Projekt

Sie arbeiten in der **Figma Make Umgebung** und haben kein lokales Verzeichnis auf Ihrem Mac. Hier sind Ihre Optionen:

---

## ✅ Empfohlene Lösung: Externe Bild-URLs verwenden

### Option 1: Kostenlose Bild-Hosting-Dienste

#### **ImgBB** (Einfach & Kostenlos)
1. Gehen Sie zu: [https://imgbb.com](https://imgbb.com)
2. Klicken Sie auf "Start uploading"
3. Laden Sie Ihr Bild hoch (Drag & Drop)
4. Kopieren Sie die "Direct Link" URL
5. Verwenden Sie diese URL in Ihrem Code

**Beispiel:**
```typescript
// In /src/app/data/events.ts
{
  id: "1",
  title: "DIVE Demo Kickoff",
  image: "https://i.ibb.co/xxxxxx/hamburg.jpg", // ← ImgBB URL
  // ...
}
```

#### **Imgur** (Sehr beliebt)
1. Gehen Sie zu: [https://imgur.com](https://imgur.com)
2. Klicken Sie auf "New post"
3. Laden Sie Ihr Bild hoch
4. Rechtsklick auf das Bild → "Copy image address"
5. Verwenden Sie diese URL

**Beispiel:**
```typescript
image: "https://i.imgur.com/xxxxxx.jpg"
```

#### **PostImages** (Anonym, kein Account nötig)
1. Gehen Sie zu: [https://postimages.org](https://postimages.org)
2. Drag & Drop Ihr Bild
3. Wählen Sie "Direct link"
4. Kopieren Sie die URL

---

## ☁️ Option 2: Supabase Storage (Professionell)

Da Ihr Projekt bereits Supabase nutzt, können Sie Bilder dort speichern:

### Schritt 1: Supabase Dashboard öffnen
1. Gehen Sie zu [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Wählen Sie Ihr Projekt

### Schritt 2: Storage Bucket erstellen
1. Klicken Sie links auf **"Storage"**
2. Klicken Sie auf **"New bucket"**
3. Name: `dive-events`
4. **Public bucket:** ✅ An (wichtig!)
5. Klicken Sie auf **"Create bucket"**

### Schritt 3: Bilder hochladen
1. Klicken Sie auf Ihren neuen `dive-events` Bucket
2. Klicken Sie auf **"Upload file"**
3. Wählen Sie Ihre Bilder aus
4. Nach Upload: Klicken Sie auf ein Bild
5. Klicken Sie auf **"Get URL"** oder kopieren Sie die Public URL

### Schritt 4: URL in Code verwenden
```typescript
// In /src/app/data/events.ts
{
  id: "1",
  title: "DIVE Demo Kickoff",
  image: "https://[ihr-projekt].supabase.co/storage/v1/object/public/dive-events/hamburg.jpg",
  // ...
}
```

**Für das Marken-Logo:**
```typescript
// In /src/app/pages/event-detail.tsx
// Zeile 119, ändern Sie:
src="/images/marke1-logo.png"
// Zu:
src="https://[ihr-projekt].supabase.co/storage/v1/object/public/dive-events/marke1-logo.png"
```

---

## 🌐 Option 3: Unsplash verwenden (Temporär)

Für Tests oder Platzhalter können Sie weiterhin Unsplash nutzen:

1. Gehen Sie zu: [https://unsplash.com](https://unsplash.com)
2. Suchen Sie nach passenden Bildern
3. Klicken Sie auf ein Bild
4. Rechtsklick → "Copy image address"
5. Verwenden Sie die URL

**Vorteil:** Keine Anmeldung, hochwertige Bilder
**Nachteil:** Nicht Ihre eigenen Bilder

---

## 🚀 Option 4: GitHub nutzen (Wenn Projekt auf GitHub liegt)

Falls Ihr Projekt bereits auf GitHub ist:

### Via GitHub Web Interface:

1. Gehen Sie zu Ihrem Repository auf github.com
2. Navigieren Sie zu `public/images/`
3. Klicken Sie auf **"Add file"** → **"Upload files"**
4. Drag & Drop Ihre Bilder
5. Commit message: "Event-Bilder hinzugefügt"
6. Klicken Sie auf **"Commit changes"**

Die Bilder werden dann automatisch mit Vercel deployed und sind unter `/images/ihr-bild.jpg` verfügbar.

---

## 📝 Schritt-für-Schritt: Marken-Logo einbinden

### Beispiel mit ImgBB:

#### 1. Logo hochladen
- Gehen Sie zu [imgbb.com](https://imgbb.com)
- Laden Sie `marke1-logo.png` hoch
- Kopieren Sie die "Direct Link" URL
- Beispiel: `https://i.ibb.co/abc123/marke1-logo.png`

#### 2. Code aktualisieren
Ich kann den Code für Sie anpassen. Sie müssen mir nur:
1. Die URL Ihres hochgeladenen Logos geben
2. Optional: URLs für die 6 Event-Bilder

Dann aktualisiere ich:
- `/src/app/pages/event-detail.tsx` (für das Logo)
- `/src/app/data/events.ts` (für die Event-Bilder)

---

## 🎯 Welche Methode passt zu Ihnen?

| Methode | Einfachheit | Geschwindigkeit | Professionalität | Kosten |
|---------|-------------|-----------------|------------------|--------|
| **ImgBB/Imgur** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | Kostenlos |
| **Supabase Storage** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Kostenlos* |
| **GitHub Upload** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | Kostenlos |
| **Unsplash** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | Kostenlos |

*Supabase Free Tier: 1 GB Storage

---

## 💡 Meine Empfehlung für Sie:

### Für schnelles Testen:
**→ ImgBB** (2 Minuten Setup, keine Anmeldung)

### Für Produktion:
**→ Supabase Storage** (Sie nutzen Supabase bereits, professionell, skalierbar)

### Wenn Projekt auf GitHub:
**→ GitHub Upload** (Automatisch mit Vercel deployed)

---

## 🔧 Was ich für Sie tun kann:

Sobald Sie Ihre Bilder hochgeladen haben, geben Sie mir einfach die URLs und ich:

✅ Aktualisiere das Marken-Logo in `/src/app/pages/event-detail.tsx`
✅ Aktualisiere alle 6 Event-Bilder in `/src/app/data/events.ts`
✅ Teste, ob alles funktioniert

**Sie müssen mir nur sagen:**
1. Welche Methode Sie bevorzugen
2. Die URLs Ihrer hochgeladenen Bilder

---

## 📋 Beispiel-Workflow mit ImgBB:

### Für Marken-Logo:
```
1. Gehen Sie zu imgbb.com
2. Laden Sie "marke1-logo.png" hoch
3. Kopieren Sie: https://i.ibb.co/abc123/logo.png
4. Sagen Sie mir die URL
5. Ich aktualisiere den Code ✅
```

### Für Event-Bilder:
```
1. Laden Sie alle 6 Bilder auf imgbb.com hoch
2. Kopieren Sie alle 6 URLs
3. Sagen Sie mir:
   - Hamburg: https://i.ibb.co/xxx/hamburg.jpg
   - Amsterdam: https://i.ibb.co/xxx/amsterdam.jpg
   - Kopenhagen: https://i.ibb.co/xxx/kopenhagen.jpg
   - Bergen: https://i.ibb.co/xxx/bergen.jpg
   - Stockholm: https://i.ibb.co/xxx/stockholm.jpg
   - Helsinki: https://i.ibb.co/xxx/helsinki.jpg
4. Ich aktualisiere alle in events.ts ✅
```

---

## ❓ Häufige Fragen

### "Kann ich später noch Bilder ändern?"
Ja! Einfach neues Bild hochladen, neue URL kopieren, mir sagen → ich aktualisiere.

### "Sind die Bilder dann öffentlich?"
Ja, alle diese Methoden machen Bilder öffentlich zugänglich (was für eine Website normal ist).

### "Wie groß dürfen die Bilder sein?"
- ImgBB: Max 32 MB
- Supabase Free: Total 1 GB
- Empfohlen: < 500 KB pro Bild (für schnelle Ladezeiten)

### "Funktioniert das mit Vercel Deployment?"
Ja! Externe URLs funktionieren perfekt mit Vercel.

---

## 🚀 Nächste Schritte:

1. **Wählen Sie eine Methode** (ImgBB empfohlen für schnellen Start)
2. **Laden Sie Ihre Bilder hoch**
3. **Kopieren Sie die URLs**
4. **Geben Sie mir die URLs** → Ich aktualisiere den Code
5. **Fertig!** ✅

Welche Methode möchten Sie verwenden? 😊
